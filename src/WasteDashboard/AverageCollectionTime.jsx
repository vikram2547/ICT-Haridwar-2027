import React from "react";
import ReactApexChart from "react-apexcharts";
import DashboardTitle from "./DashboardTitle";

const AverageCollectionTimeChart = ({ title }) => {
  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#FF8C00", "#3182CE"], // Orange and blue for Compactors and Tippers
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          if (value % 60 === 0) {
            return value / 60 + " hr";
          } else {
            return value + "m";
          }
        },
      },
    },
    legend: {
      position: "top",
    },
    tooltip: {
      y: {
        formatter: (value) => {
          if (value % 60 === 0) {
            return value / 60 + " hr";
          } else {
            return value + "m";
          }
        },
      },
    },
  };

  const series = [
    {
      name: "Compactors",
      data: [36, 35, 37, 48, 45, 50, 47], // Replace with actual data for Compactors
    },
    {
      name: "Tippers",
      data: [30, 50, 45, 48, 60, 45, 50], // Replace with actual data for Tippers
    },
  ];

  return (
    <div className="chart-container p-2 w-full">
      <DashboardTitle
        title={title || "Average collection Time"}
      ></DashboardTitle>
      <ReactApexChart
        options={options}
        series={series}
        height={300}
        type="line"
      />
    </div>
  );
};

export default AverageCollectionTimeChart;
