"use client";
import dynamic from "next/dynamic";
import React from "react";
import UserInfo from "../Profile/UserInfo";
import UserProfile from "../Profile/UserProfile";
import TableOne from "../Tables/TableOne";

const Profile = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="col-span-1">
            <UserProfile />
          </div>
          <div className="col-span-1 md:w-150">
            <UserInfo />
          </div>
        </div>
        <div className="col-span-1">
          <TableOne />
        </div>
      </div>
    </div>
  );
};

export default Profile;
