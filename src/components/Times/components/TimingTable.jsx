import React, { useState, useEffect } from "react";

const TimingTable = () => {
  const [workers, setWorkers] = useState([]);
  const [noTimingWorkers, setNoTimingWorkers] = useState([]);
  const [activeTimingWorkers, setActiveTimingWorkers] = useState([]);
  const [pausedTimingWorkers, setPausedTimingWorkers] = useState([]);

  // Fetch worker data initially
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/workers/timing`,
        );
        if (response.ok) {
          const data = await response.json();
          setWorkers(data);
        } else {
          console.error("Failed to fetch workers");
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, []);

  // Categorize workers every time the workers array updates
  useEffect(() => {
    const categorizeWorkers = () => {
      const noTiming = workers.filter(
        (worker) =>
          worker.timingStatus === "inactive" ||
          worker.timingStatus === "confirmed",
      );
      const activeTiming = workers.filter(
        (worker) => worker.timingStatus === "active",
      );
      const pausedTiming = workers.filter(
        (worker) => worker.timingStatus === "paused",
      );

      setNoTimingWorkers(noTiming);
      setActiveTimingWorkers(activeTiming);
      setPausedTimingWorkers(pausedTiming);
    };

    categorizeWorkers();
  }, [workers]);

  // Handle manual refresh
  const refreshWorkers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/workers/timing`,
      );
      if (response.ok) {
        const data = await response.json();
        setWorkers(data);
      } else {
        console.error("Failed to refresh workers");
      }
    } catch (error) {
      console.error("Error refreshing workers:", error);
    }
  };

  // Handle actions to start, pause, or confirm timing
  const handleTimingAction = async (usuario, action) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/timing`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario, action }),
        },
      );

      if (response.ok) {
        await refreshWorkers(); // Refresh worker data after action
      } else {
        console.error("Failed to update timing status");
      }
    } catch (error) {
      console.error("Error updating timing status:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="relative overflow-x-auto shadow-md dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
        <h2 className="mb-4 text-center text-lg font-bold">Trabajadores</h2>
        <table className="w-full text-left text-sm text-white rtl:text-right">
          <thead className="bg-gray-300 text-xs font-extrabold uppercase text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3">
                Horas
              </th>
              <th scope="col" className="px-6 py-3">
                Minutos
              </th>
              <th scope="col" className="px-6 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {noTimingWorkers.map((worker) => (
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
                <td className="px-6 py-4">{worker.totalHours || 0}</td>
                <td className="px-6 py-4">{worker.totalMinutes || 0}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleTimingAction(worker.usuario, "start")}
                    className="text-blue-400 hover:underline"
                  >
                    Iniciar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="relative overflow-x-auto shadow-md dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
        <h2 className="mb-4 text-center text-lg font-bold">
          Trabajores con time
        </h2>
        <table className="w-full text-left text-sm text-white rtl:text-right">
          <thead className="bg-gray-300 text-xs font-extrabold uppercase text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3">
                Inicio
              </th>
              <th scope="col" className="px-6 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {activeTimingWorkers.map((worker) => (
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
                <td className="px-6 py-4">
                  {worker.startTime
                    ? new Date(worker.startTime).toLocaleString()
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleTimingAction(worker.usuario, "pause")}
                    className="mr-2 text-yellow-400 hover:underline"
                  >
                    Pausar
                  </button>
                  <button
                    onClick={() =>
                      handleTimingAction(worker.usuario, "confirm")
                    }
                    className="text-green-400 hover:underline"
                  >
                    Confirmar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="relative overflow-x-auto shadow-md dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
        <h2 className="mb-4 text-center text-lg font-bold">
          Trabajadores pausados
        </h2>
        <table className="w-full text-left text-sm text-white rtl:text-right">
          <thead className="bg-gray-300 text-xs font-extrabold uppercase text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3">
                Pausa
              </th>
              <th scope="col" className="px-6 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {pausedTimingWorkers.map((worker) => (
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
                <td className="px-6 py-4">
                  {worker.pauseTime
                    ? new Date(worker.pauseTime).toLocaleString()
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleTimingAction(worker.usuario, "start")}
                    className="mr-2 text-blue-400 hover:underline"
                  >
                    Reiniciar
                  </button>
                  <button
                    onClick={() =>
                      handleTimingAction(worker.usuario, "confirm")
                    }
                    className="text-green-400 hover:underline"
                  >
                    Confirmar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimingTable;
