import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

interface Worker {
  _id?: string;
  name?: string;
  usuario?: string;
  category?: string;
  halfTime?: boolean;
  savedPayment?: boolean;
  totalHours?: number;
  totalMinutes?: number;
  paid?: boolean;
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
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/validate-payments`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
            },
          },
        );
        const data = await response.json();
        const unpaidWorkers = data?.workersToPay?.filter(
          (worker: any) => !worker.paid,
        );
        const paidWorkers = data.workersToPay.filter(
          (worker: any) => worker.paid,
        );
        const unpaidUsers = data.usersToPay
          .filter((user: any) => !user.paid)
          .map((user: any) => ({ ...user, category: "JD" }));
        const paidUsers = data.usersToPay
          .filter((user: any) => user.paid)
          .map((user: any) => ({ ...user, category: "JD" }));
        setWorkersToPay([...unpaidWorkers, ...unpaidUsers]);
        setPaidWorkers([...paidWorkers, ...paidUsers]);
        setFilteredWorkers([...unpaidWorkers, ...unpaidUsers]);
        console.log(data.usersToPay);
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
      const filtered = workersToPay?.filter(
        (worker) =>
          worker?.usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          worker?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredWorkers(filtered);
    };

    filterWorkers();
  }, [searchTerm, workersToPay]);

  const getWorkerWithMostTime = () => {
    const allWorkers = workersToPay.filter((worker) => worker.usuario);
    return allWorkers.reduce((maxWorker, worker) => {
      const totalWorkerMinutes =
        (worker.totalHours || 0) * 60 + (worker.totalMinutes || 0);
      const maxWorkerMinutes =
        (maxWorker.totalHours || 0) * 60 + (maxWorker.totalMinutes || 0);
      return totalWorkerMinutes > maxWorkerMinutes ? worker : maxWorker;
    }, allWorkers[0]);
  };

  const handleMarkAsPaid = async (worker: Worker) => {
    const token = localStorage.getItem("token");

    if (worker._id) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/worker/${worker._id}/mark-paid`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
            },
            body: JSON.stringify({ paid: true }),
          },
        );

        if (response.ok) {
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
    } else if (worker.name) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${worker.name}/mark-paid`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
            },
            body: JSON.stringify({ paid: true }),
          },
        );

        if (response.ok) {
          const updatedWorkersToPay = workersToPay.filter(
            (w) => w.name !== worker.name,
          );
          const updatedPaidWorker = { ...worker, paid: true };
          setWorkersToPay(updatedWorkersToPay);
          setPaidWorkers([...paidWorkers, updatedPaidWorker]);
          setFilteredWorkers(updatedWorkersToPay);
        } else {
          console.error("Failed to mark user as paid");
        }
      } catch (error) {
        console.error("Error marking user as paid:", error);
      }
    } else {
      console.error("Worker does not have a valid ID or name");
    }
  };

  const exportToExcel = () => {
    // Calculate totals
    const totalToPay = filteredWorkers.reduce(
      (total, worker) => total + worker.paymentAmount,
      0,
    );
    const totalPaid = paidWorkers.reduce(
      (total, worker) => total + worker.paymentAmount,
      0,
    );

    // Get the current date
    const currentDate = new Date().toLocaleDateString();

    // Prepare data for export
    const dataToExport = [
      { Usuario: "", Rango: "", "Tiempo Total": "", Pago: "", Estado: "" }, // Empty row

      { Usuario: "", Rango: "", "Tiempo Total": "", Pago: "", Estado: "" }, // Another empty row for spacing
      ...filteredWorkers.map((worker) => ({
        Usuario: worker.usuario || worker.name,
        Rango: worker.category || "JD",
        "Tiempo Total":
          worker.category === "JD"
            ? `${Math.floor((worker.totalMinutes || 0) / 60)} assist`
            : `${worker.totalHours || 0}h ${worker.totalMinutes || 0}m`,
        Pago: `${worker.paymentAmount}c`,
        Estado: worker.paid ? "Pagado" : "No pagado",
      })),
      {
        Usuario: `Fecha: ${currentDate}`,
        Rango: "",
        "Tiempo Total": "",
        Pago: "",
        Estado: "",
      },
      {
        Usuario: `Total Créditos a Pagar: ${totalToPay}c`,
        Rango: "",
        "Tiempo Total": "",
        Pago: "",
        Estado: "",
      },
      {
        Usuario: `Total Créditos Pagados: ${totalPaid}c`,
        Rango: "",
        "Tiempo Total": "",
        Pago: "",
        Estado: "",
      },
    ];

    // Generate Excel sheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trabajadores");

    // Export the workbook to a file
    XLSX.writeFile(workbook, "Trabajadores_Pago.xlsx");
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
        {workerWithMostTime && workerWithMostTime.usuario && (
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
      <div className="flex justify-between">
        <div>
          <input
            type="text"
            placeholder="Buscar trabajador"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3 w-auto rounded-lg border p-2 text-black md:w-100"
          />
        </div>
        <button
          onClick={exportToExcel}
          className="mb-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Exportar a Excel
        </button>
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
                    key={worker._id || worker.name}
                    className="bg-gray-700 border-gray-600 hover:bg-indigo-500"
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-white"
                    >
                      {worker.usuario || worker.name}
                    </th>
                    <td className="px-6 py-4">{worker.category || "JD"}</td>
                    <td className="px-6 py-4">
                      {worker.category === "JD"
                        ? `${Math.floor((worker.totalMinutes || 0) / 60)} assist`
                        : `${worker.totalHours || 0}h ${
                            worker.totalMinutes || 0
                          }m`}
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
                  key={worker._id || worker.name}
                  className="bg-gray-700 border-gray-600 hover:bg-indigo-500"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-white"
                  >
                    {worker.usuario || worker.name}
                  </th>
                  <td className="px-6 py-4">{worker.category || "JD"}</td>
                  <td className="px-6 py-4">
                    {worker.category === "JD"
                      ? `${Math.floor((worker.totalMinutes || 0) / 60)} assist`
                      : `${worker.totalHours || 0}h ${worker.totalMinutes || 0}m`}
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
