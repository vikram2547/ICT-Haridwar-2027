// src/DocumentStatus.js
import React from "react";
import ReactApexChart from "react-apexcharts";
import DashboardTitle from "../WasteDashboard/DashboardTitle";

const DocumentStatus = () => {
  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["A", "B", "C", "D"],
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
          // size: "60%", // Adjust this size to control the space for text
        },
      },
    },

    colors: ["#4CD78E", "#6FD9A6", "#92E3BF", "#B6EAD8"], // Lighter shades of #28C76F
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        if (opts.seriesIndex === 0) {
          return "";
        }
        return "";
      },
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        colors: ["#000"],
      },
      dropShadow: {
        enabled: false,
      },
    },
  };

  const chartSeries = [40, 20, 25, 15];

  return (
    <div className="pie-chart flex flex-col h-full w-full rounded-md">
      <DashboardTitle title="Incidents Reported" />
      <div className="flex justify-center items-center w-full">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={290}
          width={280}
        />
      </div>
      <div className="flex justify-center items-center text-center font-semibold p-2 mt-auto">
        Number of sanitation related incidents reported in last 24hrs
      </div>
    </div>
  );
};

export default DocumentStatus;
