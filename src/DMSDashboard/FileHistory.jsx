// src/components/FileHistory.js
import React from "react";
import Chart from "react-apexcharts";

const FileHistory = () => {
  const chartOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ["#FFB700", "#775DD0", "#00E396"], // Colors for File Upload, File Edit, File Download
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: ["SLA", "Photo", "Video"],
    },
    yaxis: {
      max: 60,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      offsetX: 0,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const chartSeries = [
    {
      name: "File Upload",
      data: [40, 30, 20],
    },
    {
      name: "File Edit",
      data: [30, 20, 40],
    },
    {
      name: "File Download",
      data: [50, 40, 50],
    },
  ];

  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">File History</h3>
        <div className="text-gray-500">05/10/2025</div>
      </div>

      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default FileHistory;
