import React, { useState, useEffect } from "react";
import Switch from "react-switch";

interface Worker {
  _id: string;
  usuario: string;
  fecha: string;
  registradoPor: string;
  category: string;
  savedPayment: boolean;
  halfTime: boolean;
  savedPaymentEndDate?: string;
  halfTimeEndDate?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: Worker | null;
  onSave: (updatedWorker: Worker) => void;
  setTriggerWorkers: any;
  triggerWorkers: any;
}

const EditWorkerModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  worker,
  onSave,
  setTriggerWorkers,
  triggerWorkers,
}) => {
  const [name, setName] = useState(worker?.usuario || "");
  const [category, setCategory] = useState(worker?.category || "");
  const [savedPayment, setSavedPayment] = useState(
    worker?.savedPayment || false,
  );
  const [halfTime, setHalfTime] = useState(worker?.halfTime || false);
  const [savedPaymentEndDate, setSavedPaymentEndDate] = useState(
    worker?.savedPaymentEndDate || "",
  );
  const [halfTimeEndDate, setHalfTimeEndDate] = useState(
    worker?.halfTimeEndDate || "",
  );

  useEffect(() => {
    if (worker) {
      setName(worker.usuario);
      setCategory(worker.category);
      setSavedPayment(worker.savedPayment);
      setHalfTime(worker.halfTime);
      setSavedPaymentEndDate(worker.savedPaymentEndDate || "");
      setHalfTimeEndDate(worker.halfTimeEndDate || "");

      // Automatically turn off switches if the end date has passed
      const today = new Date().toISOString().split("T")[0];
      if (
        worker.savedPaymentEndDate &&
        new Date(worker.savedPaymentEndDate) < new Date(today)
      ) {
        setSavedPayment(false);
      }
      if (
        worker.halfTimeEndDate &&
        new Date(worker.halfTimeEndDate) < new Date(today)
      ) {
        setHalfTime(false);
      }
    }
  }, [worker]);

  const handleSave = async () => {
    if (worker) {
      const updatedWorker = {
        ...worker,
        usuario: name,
        category,
        savedPayment,
        halfTime,
        savedPaymentEndDate,
        halfTimeEndDate,
      };

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/worker/${worker._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedWorker),
          },
        );

        if (response.ok) {
          const data = await response.json();
          onSave(data.worker);
          setTriggerWorkers(!triggerWorkers);
        } else {
          console.error("Failed to update worker");
        }
      } catch (error) {
        console.error("Error:", error);
      }

      onClose();
    }
  };

  if (!isOpen || !worker) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-black p-6 shadow-md sm:max-w-lg">
        <h2 className="mb-4 text-xl font-bold">Editar Trabajador</h2>
        <div className="mb-4 flex justify-center">
          <img
            src={`https://www.habbo.es/habbo-imaging/avatarimage?user=${worker.usuario}&action=none&direction=2&head_direction=2&gesture=&size=l&headonly=0`}
            alt=""
            className="h-auto max-w-full"
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-700 block text-sm font-medium">
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border p-2 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-700 block text-sm font-medium">
            Rango
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border p-2 text-black"
          >
            <option value="SEG">SEG</option>
            <option value="TEC">TEC</option>
            <option value="LOG">LOG</option>
            <option value="HR">HR</option>
            <option value="DIR">DIR</option>
            <option value="OP">OP</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="mb-4 sm:mr-4">
            <label className="text-gray-700 block text-sm font-medium">
              Guardapaga
            </label>
            <Switch
              checked={savedPayment}
              onChange={setSavedPayment}
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
            <label className="text-gray-700 block text-sm font-medium">
              Fecha fin
            </label>
            <input
              type="date"
              value={savedPaymentEndDate}
              onChange={(e) => setSavedPaymentEndDate(e.target.value)}
              className="mt-2 w-full rounded-lg border p-2 text-black"
            />
          </div>
          <div className="mb-4 sm:ml-4">
            <label className="text-gray-700 block text-sm font-medium">
              Recorte
            </label>
            <Switch
              checked={halfTime}
              onChange={setHalfTime}
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
            <label className="text-gray-700 block text-sm font-medium">
              Fecha fin
            </label>
            <input
              type="date"
              value={halfTimeEndDate}
              onChange={(e) => setHalfTimeEndDate(e.target.value)}
              className="mt-2 w-full rounded-lg border p-2 text-black"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 mr-2 rounded-lg px-4 py-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWorkerModal;
