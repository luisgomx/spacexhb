import React, { useState, useEffect } from "react";
import Switch from "react-switch";

interface Worker {
  _id: string;
  usuario: string;
  category: string;
  halfTime: boolean;
  savedPayment: boolean;
  totalHours: number;
  totalMinutes: number;
  paid: boolean;
  paymentAmount: number; // Add payment field
}

const PayrollTable: React.FC<{}> = () => {
  const [workersToPay, setWorkersToPay] = useState<Worker[]>([]);
  const [paidWorkers, setPaidWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchWorkersToPay = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/validate-payments`,
        );
        const data = await response.json();
        const unpaidWorkers = data.filter((worker: any) => !worker.paid);
        const paidWorkers = data.filter((worker: any) => worker.paid);
        setWorkersToPay(unpaidWorkers);
        setPaidWorkers(paidWorkers);
        setFilteredWorkers(unpaidWorkers);
      } catch (error) {
        console.error("Error fetching workers to pay:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkersToPay();
  }, []);

  useEffect(() => {
    const filterWorkers = () => {
      const filtered = workersToPay.filter((worker) =>
        worker.usuario.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredWorkers(filtered);
    };

    filterWorkers();
  }, [searchTerm, workersToPay]);

  const getWorkerWithMostTime = () => {
    const allWorkers = [...workersToPay, ...paidWorkers];
    return allWorkers.reduce((maxWorker, worker) => {
      const totalWorkerMinutes = worker.totalHours * 60 + worker.totalMinutes;
      const maxWorkerMinutes =
        maxWorker.totalHours * 60 + maxWorker.totalMinutes;
      return totalWorkerMinutes > maxWorkerMinutes ? worker : maxWorker;
    }, allWorkers[0]);
  };

  const handleMarkAsPaid = async (worker: Worker) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/worker/${worker._id}/mark-paid`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paid: true }),
        },
      );

      if (response.ok) {
        // Update workers lists after marking as paid
        const updatedWorkersToPay = workersToPay.filter(
          (w) => w._id !== worker._id,
        );
        const updatedPaidWorker = { ...worker, paid: true };
        setWorkersToPay(updatedWorkersToPay);
        setPaidWorkers([...paidWorkers, updatedPaidWorker]);
        setFilteredWorkers(updatedWorkersToPay);
      } else {
        console.error("Failed to mark worker as paid");
      }
    } catch (error) {
      console.error("Error marking worker as paid:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const workerWithMostTime = getWorkerWithMostTime();

  const totalCreditsToPay = filteredWorkers.reduce(
    (total, worker) => total + worker.paymentAmount,
    0,
  );

  const totalCreditsPaid = paidWorkers.reduce(
    (total, worker) => total + worker.paymentAmount,
    0,
  );

  return (
    <div>
      <div className="mb-4 flex justify-center gap-5">
        {workerWithMostTime && (
          <div className="bg-dark rounded-xl bg-slate-700 p-4 text-white">
            <h3 className="text-lg font-bold">Trabajador de la semana</h3>
            <div className="flex justify-center">
              <img
                src={`https://www.habbo.es/habbo-imaging/avatarimage?user=${workerWithMostTime.usuario}&action=none&direction=3&head_direction=3&gesture=&size=l&headonly=0`}
                alt=""
              />
            </div>
            <p>{workerWithMostTime.usuario}</p>
            <p>
              {workerWithMostTime.totalHours}h {workerWithMostTime.totalMinutes}
              m
            </p>
          </div>
        )}

        <div className="relative overflow-x-auto rounded-lg bg-slate-700 text-white shadow-md sm:rounded-lg md:h-40">
          {/* <h2 className="mb-4 text-center text-lg font-bold">Totales</h2> */}
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Total Créditos a Pagar:</h3>
              <p className="text-center text-2xl font-extrabold text-green-400">
                {totalCreditsToPay}c
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Total Créditos Pagados:</h3>
              <p className="text-center text-2xl font-extrabold text-red">
                {totalCreditsPaid}c
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Buscar trabajador"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3 w-auto rounded-lg border p-2 text-black md:w-100"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative overflow-x-auto shadow-md dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
          <h2 className="mb-4 text-center text-lg font-bold">
            Trabajadores a Pagar
          </h2>
          <table className="w-full text-left text-sm text-white rtl:text-right">
            <thead className="bg-gray-300 text-xs font-extrabold uppercase text-white">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3">
                  Rango
                </th>
                <th scope="col" className="px-6 py-3">
                  Tiempo Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Pago
                </th>
                <th scope="col" className="px-6 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <tr
                    key={worker._id}
                    className="bg-gray-700 border-gray-600 hover:bg-indigo-500"
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-white"
                    >
                      {worker.usuario}
                    </th>
                    <td className="px-6 py-4">{worker.category}</td>
                    <td className="px-6 py-4">
                      {worker.totalHours || 0}h {worker.totalMinutes || 0}m
                    </td>
                    <td className="px-6 py-4">{worker.paymentAmount}c</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleMarkAsPaid(worker)}
                        className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                      >
                        Pagar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    No hay trabajadores elegibles para pago.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="relative overflow-x-auto shadow-md dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
          <h2 className="mb-4 text-center text-lg font-bold">
            Trabajadores Pagados
          </h2>
          <table className="w-full text-left text-sm text-white rtl:text-right">
            <thead className="bg-gray-300 text-xs font-extrabold uppercase text-white">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3">
                  Rango
                </th>
                <th scope="col" className="px-6 py-3">
                  Tiempo Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Pago
                </th>
              </tr>
            </thead>
            <tbody>
              {paidWorkers.map((worker) => (
                <tr
                  key={worker._id}
                  className="bg-gray-700 border-gray-600 hover:bg-indigo-500"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-white"
                  >
                    {worker.usuario}
                  </th>
                  <td className="px-6 py-4">{worker.category}</td>
                  <td className="px-6 py-4">
                    {worker.totalHours || 0}h {worker.totalMinutes || 0}m
                  </td>
                  <td className="px-6 py-4">{worker.paymentAmount}c</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollTable;
