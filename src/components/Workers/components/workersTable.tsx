import React, { useState } from "react";
import EditWorkerModal from "./EditWorkerModal";

interface Worker {
  _id: string;
  usuario: string;
  fecha: string;
  registradoPor: string;
  category: string; // Add this if needed
  savedPayment: boolean; // Add savedPayment
  halfTime: boolean; // Add halfTime
}

const WorkersTable: React.FC<{
  workers: Worker[];
  setTriggerWorkers: any;
  triggerWorkers: any;
}> = ({ workers, setTriggerWorkers, triggerWorkers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const fetchWorker = async (id: string) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/worker/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
          },
        },
      );
      if (response.ok) {
        const worker = await response.json();
        return worker;
      } else {
        console.error("Failed to fetch worker data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    return null;
  };

  const handleEditClick = async (worker: Worker) => {
    const latestWorkerData = await fetchWorker(worker._id);
    if (latestWorkerData) {
      setSelectedWorker(latestWorkerData);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorker(null);
  };

  const handleSaveWorker = (updatedWorker: Worker) => {
    // Replace this with your logic to save the updated worker data
    console.log("Updated worker:", updatedWorker);

    // Example: If you are using a backend API, you can make a request here
    /*
    fetch('/api/update-worker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedWorker),
    }).then(response => response.json()).then(data => {
      console.log('Worker updated:', data);
    }).catch(error => {
      console.error('Error updating worker:', error);
    });
    */
  };

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
                Acciones
              </th>
              <th></th>
              {/* Added Rango */}
            </tr>
          </thead>
          <tbody>
            {workers.length > 0 ? (
              workers.map((worker, index) => (
                <tr
                  key={index}
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
                  <td className="px-6 py-4">{worker.category}</td>{" "}
                  <td className="">
                    <button
                      onClick={() => handleEditClick(worker)}
                      className="ml-7 rounded-lg bg-indigo-600 p-2"
                    >
                      Editar
                    </button>
                  </td>
                  <td>
                    {worker.halfTime && (
                      <span className="mr-2 rounded-3xl bg-yellow-800 p-2">
                        Recorte
                      </span>
                    )}
                    {worker.savedPayment && (
                      <span className="rounded-3xl bg-yellow-800 p-2">
                        Guarda
                      </span>
                    )}
                  </td>
                  {/* Added Rango */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  No hay trabajadores aún :(
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <EditWorkerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        worker={selectedWorker}
        onSave={handleSaveWorker}
        setTriggerWorkers={setTriggerWorkers}
        triggerWorkers={triggerWorkers}
      />
    </div>
  );
};

export default WorkersTable;
