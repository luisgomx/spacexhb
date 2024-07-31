"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PayrollTable from "./components/PayrollTable";

const Payroll = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-1">
          <PayrollTable />
        </div>
      </div>
    </div>
  );
};

export default Payroll;
