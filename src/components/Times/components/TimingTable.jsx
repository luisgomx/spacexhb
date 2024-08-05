import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";

const TimingTable = () => {
  const [workers, setWorkers] = useState([]);
  const [noTimingWorkers, setNoTimingWorkers] = useState([]);
  const [activeTimingWorkers, setActiveTimingWorkers] = useState([]);
  const [pausedTimingWorkers, setPausedTimingWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [socket, setSocket] = useState(null);
  const { username } = useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch worker data initially
  useEffect(() => {
    const fetchWorkers = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/workers/timing`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setWorkers(data);
          setFilteredWorkers(data);
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
      const noTiming = filteredWorkers.filter(
        (worker) =>
          worker.timingStatus === "inactive" ||
          worker.timingStatus === "confirmed",
      );
      const activeTiming = filteredWorkers.filter(
        (worker) => worker.timingStatus === "active",
      );
      const pausedTiming = filteredWorkers.filter(
        (worker) => worker.timingStatus === "paused",
      );

      setNoTimingWorkers(noTiming);
      setActiveTimingWorkers(activeTiming);
      setPausedTimingWorkers(pausedTiming);
    };

    categorizeWorkers();
  }, [filteredWorkers]);

  // Handle manual refresh
  const refreshWorkers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/workers/timing`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setWorkers(data);
        setFilteredWorkers(data);
      } else {
        console.error("Failed to refresh workers");
      }
    } catch (error) {
      console.error("Error refreshing workers:", error);
    }
  };

  // Handle actions to start, pause, or confirm timing
  const handleTimingAction = async (worker, action) => {
    setCurrentAction(action);
    setCurrentWorker(worker);
    setModalIsOpen(true);
  };

  const confirmAction = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/timing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            usuario: currentWorker.usuario,
            action: currentAction,
            username,
          }),
        },
      );

      if (response.ok) {
        await refreshWorkers(); // Refresh worker data after action
      } else {
        console.error("Failed to update timing status");
      }
    } catch (error) {
      console.error("Error updating timing status:", error);
    } finally {
      setIsLoading(false);
      setModalIsOpen(false);
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    const wsProtocol = process.env.NODE_ENV === "production" ? "wss" : "ws";
    const wsBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL.replace(
      /^https?/,
      wsProtocol,
    );
    const ws = new WebSocket(wsBaseUrl);
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (
        message.action === "start" ||
        message.action === "pause" ||
        message.action === "confirm"
      ) {
        refreshWorkers(); // Refresh workers on timing action
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // Function to calculate and format total time
  const formatTotalTime = (totalMinutes) => {
    const formattedHours = Math.floor(totalMinutes / 60);
    const formattedMinutes = totalMinutes % 60;
    return `${formattedHours}h ${formattedMinutes}m`;
  };

  // Handle search
  useEffect(() => {
    const filtered = workers.filter((worker) =>
      worker.usuario.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredWorkers(filtered);
  }, [searchTerm, workers]);

  // Sort noTimingWorkers based on totalMinutes in descending order
  const sortedNoTimingWorkers = noTimingWorkers.sort(
    (a, b) => b.totalMinutes - a.totalMinutes,
  );

  const actionText = (action) => {
    switch (action) {
      case "start":
        return "iniciar";
      case "pause":
        return "pausar";
      case "confirm":
        return "cerrar";
      default:
        return action;
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar trabajador"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full rounded-lg border p-2 text-black"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative h-100 overflow-x-auto shadow-md dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
          <h2 className="mb-4 text-center text-lg font-bold">Trabajadores</h2>
          <table className="w-full text-left text-sm text-white rtl:text-right">
            <thead className="bg-gray-300 text-xs font-extrabold uppercase text-white">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3">
                  Tiempo Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedNoTimingWorkers.map((worker) => (
                <tr
                  key={worker._id}
                  className={`bg-gray-700 border-gray-600 hover:bg-indigo-500`}
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-white"
                  >
                    {worker.usuario}
                  </th>
                  <td className="px-6 py-4">
                    {formatTotalTime(worker.totalMinutes)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTimingAction(worker, "start")}
                      className="rounded-lg bg-green-400 p-2  font-bold text-black hover:bg-green-600"
                    >
                      Iniciar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="relative h-100 overflow-x-auto shadow-md dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
          <h2 className="mb-4 text-center text-lg font-bold">
            Trabajadores con tiempo activo
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
                  Abierto Por
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                  style={{ width: "200px" }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {activeTimingWorkers.map((worker) => (
                <tr
                  key={worker._id}
                  className={`bg-gray-700 border-gray-600 hover:bg-indigo-500 ${
                    worker.createdBy === username ? "bg-green-700" : ""
                  }`}
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
                  <td className="px-6 py-4">{worker.createdBy || "-"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTimingAction(worker, "pause")}
                      className="mr-2 rounded-lg bg-yellow-400 p-2 font-bold text-black hover:bg-yellow-600"
                    >
                      Pausar
                    </button>
                    <button
                      onClick={() => handleTimingAction(worker, "confirm")}
                      className=" mt-2 rounded-lg bg-rose-400 p-2 font-bold text-black hover:bg-rose-600"
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
                  Pausado Por
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                  style={{ width: "200px" }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {pausedTimingWorkers.map((worker) => (
                <tr
                  key={worker._id}
                  className={`bg-gray-700 border-gray-600 hover:bg-indigo-500 ${
                    worker.createdBy === username ? "bg-green-700" : ""
                  }`}
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
                  <td className="px-6 py-4">{worker.createdBy || "-"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTimingAction(worker, "start")}
                      className="mr-2 rounded-lg bg-blue-400 p-2 font-bold text-black hover:bg-blue-600"
                    >
                      Reiniciar
                    </button>
                    <button
                      onClick={() => handleTimingAction(worker, "confirm")}
                      className=" mt-2 rounded-lg bg-rose-400 p-2 font-bold text-black hover:bg-rose-600"
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="rounded-md bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold">Confirmar acción</h2>
          <p>
            ¿Estás seguro de que quieres {actionText(currentAction)} el tiempo
            para {currentWorker?.usuario}?
          </p>
          {/* <p>Abierto por: {currentWorker?.createdBy}</p> */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setModalIsOpen(false)}
              className="text-gray-600 bg-gray-200 rounded-md px-4 py-2 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={confirmAction}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <ClipLoader size={20} color={"#ffffff"} />
              ) : (
                "Confirmar"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TimingTable;
