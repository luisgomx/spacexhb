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
}

const PayrollTable: React.FC<{}> = () => {
  const [workersToPay, setWorkersToPay] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkersToPay = async () => {
      try {
        const response = await fetch(`/api/validate-payments`);
        const data = await response.json();
        setWorkersToPay(data);
      } catch (error) {
        console.error("Error fetching workers to pay:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkersToPay();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
                Guardapaga
              </th>
              <th scope="col" className="px-6 py-3">
                Recorte
              </th>
              {/* Added Rango */}
            </tr>
          </thead>
          <tbody>
            {workersToPay.length > 0 ? (
              workersToPay.map((worker) => (
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
                <td colSpan={6} className="px-6 py-4 text-center">
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
