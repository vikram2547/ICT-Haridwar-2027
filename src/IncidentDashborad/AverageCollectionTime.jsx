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
    colors: ["#FF4560", "#775DD0", "#FEB019", "#008FFB", "#FF66FF", "#00E396"], // Colors for each line
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
      name: "Type 1",
      data: [40, 45, 35, 35, 35, 40, 35],
    },
    {
      name: "Type 2",
      data: [30, 35, 45, 40, 43, 38, 37],
    },
    {
      name: "Type 3",
      data: [25, 30, 35, 40, 38, 37, 35],
    },
    {
      name: "Type 4",
      data: [20, 25, 30, 28, 30, 35, 32],
    },
    {
      name: "Type 5",
      data: [15, 20, 25, 23, 22, 25, 28],
    },
    {
      name: "Type 6",
      data: [10, 15, 20, 18, 17, 16, 19],
    },
  ];

  return (
    <div className="chart-container p-2 w-full">
      <DashboardTitle
        title={title || "Daily Priority Wise Tasks"}
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
