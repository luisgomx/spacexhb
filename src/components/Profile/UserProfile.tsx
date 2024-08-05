"use client";

import { ApexOptions } from "apexcharts";
import React from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";

const UserProfile: React.FC = () => {
  const { username } = useAuth();

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="flex justify-center">
        <img
          src={`https://www.habbo.es/habbo-imaging/avatarimage?user=${username}&action=none&direction=2&head_direction=2&gesture=&size=l&headonly=0`}
          alt=""
        />
      </div>
      <div className="mt-5 grid grid-cols-2">
        <div className="space-y-3 font-bold">
          <p>Usuario</p>
          {/* <p>Firma</p>
          <p>Ultima misión</p>
          <p>Siguiente ascenso:</p> */}
        </div>
        <div className="space-y-3">
          <p>{username}</p>
          {/* <p>MSK</p>
          <p>CIA Recluta</p>
          <p>3h 21min</p> */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
