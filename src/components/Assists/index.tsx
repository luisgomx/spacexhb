"use client";

import React, { useState, useEffect } from "react";

interface JDUser {
  name: string;
  assistedTimes: number;
  totalMinutes: number;
  paid: boolean;
}

const Assists: React.FC = () => {
  const [jdUsers, setJdUsers] = useState<JDUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJdUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/jd`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          // Sort the users based on totalMinutes in descending order
          data.sort((a: JDUser, b: JDUser) => b.totalMinutes - a.totalMinutes);
          setJdUsers(data);
        } else {
          console.error("Failed to fetch JD users");
        }
      } catch (error) {
        console.error("Error fetching JD users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJdUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="flex flex-row gap-5">
          {jdUsers.map((user, index) => (
            <div
              key={user.name}
              className={`w-80 rounded-lg p-4 shadow-lg dark:border-strokedark dark:bg-boxdark ${
                index === 0 ? "shadow-yellow-500" : ""
              }`}
            >
              <div className="flex justify-center">
                <img
                  src={`https://www.habbo.es/habbo-imaging/avatarimage?user=${user.name}&action=none&direction=2&head_direction=2&gesture=&size=l&headonly=0`}
                  alt={user.name}
                  className="rounded-full"
                />
              </div>

              <div className="text-center">
                <div className="ml-4">
                  <h2 className=" text-ceter text-title-lg font-extrabold">
                    {user.name}
                  </h2>
                  <p className="">Minutos totales: {user.assistedTimes}</p>
                  <p className="font-bold">
                    Asistencias: {Math.floor(user.assistedTimes / 60)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assists;
