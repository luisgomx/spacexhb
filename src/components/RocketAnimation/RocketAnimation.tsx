import React from "react";
import Image from "next/image";
import rocketImage from "/public/rocket.png"; // Make sure to add your rocket image to the public folder

const RocketAnimation = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="rocket-launch">
        <Image src={rocketImage} height="150" alt="Rocket" className="rocket" />
        <div className="flames"></div>
      </div>

      <style jsx>{`
        .rocket-launch {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .rocket {
          width: 100px;
          animation: launch 2s ease-in-out infinite;
        }
        .flames {
          width: 20px;
          height: 60px;
          background: radial-gradient(circle, orange, red);
          border-radius: 50%;
          margin-top: -20px;
          animation: flame 0.5s infinite alternate;
        }
        @keyframes launch {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes flame {
          from {
            opacity: 1;
            transform: scaleY(1);
          }
          to {
            opacity: 0.5;
            transform: scaleY(0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default RocketAnimation;
