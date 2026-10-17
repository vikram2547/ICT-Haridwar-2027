import React from "react";
import DashboardTitle from "./DashboardTitle";
import ApexCharts from "react-apexcharts";

const GaugeChart = () => {
  const options = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: "#e0e0e0",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: true,
            color: "#888",
            fontSize: "17px",
          },
          value: {
            color: "#111",
            fontSize: "36px",
            show: true,
          },
        },
      },
    },
    fill: {
      colors: ["#00E396", "#F03E3E"], // Green for initial, Red for additional 30%
    },
    stroke: {
      dashArray: [4, 4], // No dash for initial segment, dashed stroke for additional 30%
    },
    labels: ["Score"],
  };

  const series = [70]; // Example value

  return (
    <div>
      <ApexCharts
        options={options}
        series={series}
        type="radialBar"
        height={350}
        width={350}
      />
    </div>
  );
};

const CleanlinessScoreGauge = () => {
  return (
    <div className="h-full flex flex-col rounded-md">
      <DashboardTitle title="Cleanliness Score"></DashboardTitle>
      <div className="-mt-7 flex w-full justify-center">
        <GaugeChart />
      </div>
      <div className="flex justify-center items-center text-center font-semibold p-2 mt-auto">
        Overall cleanliness level across all facilities
      </div>
    </div>
  );
};

export default CleanlinessScoreGauge;
