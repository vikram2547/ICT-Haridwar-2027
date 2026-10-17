import React from "react";
import DonutChart from "./DonutChart";

const Wastes = () => {
  return (
    <div className="flex justify-center items-center border">
      <div className="flex flex-col gap-3 font-lg font-semibold text-[#4B465C]">
        <div>
          <span>Total Waste Bins </span> <span className="text-3xl">2350</span>
        </div>
        <div>
          <span>Total Operational Bins </span>{" "}
          <span className="text-3xl">2021</span>
        </div>
      </div>
      <div>
        <DonutChart></DonutChart>
      </div>
    </div>
  );
};

export default Wastes;
