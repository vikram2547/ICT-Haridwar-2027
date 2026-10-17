import React from "react";
import ReactApexChart from "react-apexcharts";
import DashboardTitle from "../DashboardTitle";

const DonutChart = () => {
  const chartOptions = {
    chart: {
      type: "donut",
    },
    legend: {
      show: false, // Hide the legend
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        donut: {
          size: "50%", // Adjust this size to control the space for text
        },
      },
    },

    colors: ["#4CD78E", "#E5E4E2"], // Lighter shades of #28C76F
    // dataLabels: {
    //   enabled: true,
    //   formatter: function (val, opts) {
    //     if (opts.seriesIndex === 0) {
    //       return "";
    //     }
    //     return "";
    //   },
    //   style: {
    //     fontSize: "16px",
    //     fontWeight: "bold",
    //     colors: ["#000"],
    //   },
    //   dropShadow: {
    //     // enabled: false,
    //   },
    // },
  };

  const chartSeries = [86, 14];

  return (
    <div className="pie-chart flex flex-col h-full w-full rounded-md">
      <div className="flex justify-center items-center w-full">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={200}
          width={180}
        />
      </div>
      <div className="flex justify-center items-center text-center font-semibold p-2 mt-auto">
        86% Operational{" "}
      </div>
    </div>
  );
};

export default DonutChart;
