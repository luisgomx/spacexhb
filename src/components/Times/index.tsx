"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import TimingsTable from "./components/TimingTable";

const Times = () => {
  const [workers, setWorkers] = useState([]);

  // Function to fetch workers from the server
  const fetchWorkers = async () => {
    try {
      const response = await fetch("/api/workers");
      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }
      const data = await response.json();
      setWorkers(data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="col-span-12">
            <TimingsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Times;
