"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ChartTwo from "@/components/Profile/UserProfile";
import dynamic from "next/dynamic";
import React from "react";

const ChartThree = dynamic(() => import("@/components/Profile/ChartThree"), {
  ssr: false,
});

const Chart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default Chart;
