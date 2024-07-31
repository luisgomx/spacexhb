import React, { useState, useEffect } from "react";
import Switch from "react-switch";

interface Worker {
  _id: string;
  usuario: string;
  fecha: string;
  registradoPor: string;
  category: string;
  halfTime: boolean;
  savedPayment: boolean;
  totalHours: number;
  totalMinutes: number;
}

const PayrollTable: React.FC<{}> = () => {
  const [workersToPay, setWorkersToPay] = useState<Worker[]>([]);
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
        setWorkersToPay(data);
        setFilteredWorkers(data);
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
    return filteredWorkers.reduce((maxWorker, worker) => {
      const totalWorkerMinutes = worker.totalHours * 60 + worker.totalMinutes;
      const maxWorkerMinutes =
        maxWorker.totalHours * 60 + maxWorker.totalMinutes;
      return totalWorkerMinutes > maxWorkerMinutes ? worker : maxWorker;
    }, filteredWorkers[0]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const workerWithMostTime = getWorkerWithMostTime();

  return (
    <div>
      <div className="mb-4 flex justify-center">
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
      </div>
      <div>
        <input
          type="text"
          placeholder="Buscar trabajador"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3 w-100 rounded-lg border p-2 text-black"
        />
      </div>
      <div className="relative overflow-x-auto shadow-md dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
        <table className="w-full text-left text-sm text-white rtl:text-right">
          <thead className="bg-gray-300 text-xs font-extrabold uppercase text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha registro
              </th>
              <th scope="col" className="px-6 py-3">
                Quien registró
              </th>
              <th scope="col" className="px-6 py-3">
                Rango
              </th>
              <th scope="col" className="px-6 py-3">
                Tiempo Total
              </th>
              <th scope="col" className="px-6 py-3">
                Guardapaga
              </th>
              <th scope="col" className="px-6 py-3">
                Recorte
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
                  <td className="px-6 py-4">{worker.fecha}</td>
                  <td className="px-6 py-4">{worker.registradoPor}</td>
                  <td className="px-6 py-4">{worker.category}</td>
                  <td className="px-6 py-4">
                    {worker.totalHours || 0}h {worker.totalMinutes || 0}m
                  </td>
                  <td className="px-6 py-4">
                    <Switch
                      checked={worker.savedPayment}
                      onChange={() => {}}
                      disabled
                      onColor="#86d3ff"
                      onHandleColor="#2693e6"
                      handleDiameter={30}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      height={20}
                      width={48}
                      className="ml-2"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Switch
                      checked={worker.halfTime}
                      onChange={() => {}}
                      disabled
                      onColor="#86d3ff"
                      onHandleColor="#2693e6"
                      handleDiameter={30}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      height={20}
                      width={48}
                      className="ml-2"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  No hay trabajadores elegibles para pago.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollTable;
