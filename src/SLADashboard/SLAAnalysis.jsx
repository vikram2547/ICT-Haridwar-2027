// src/components/SLAAnalysis.js
import React from "react";
import Chart from "react-apexcharts";

const SLAAnalysis = () => {
  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ["#00E396", "#FF4560"], // Green for on-time, Red for overdue
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        "Vendor1",
        "Vendor2",
        "Vendor3",
        "Vendor4",
        "Vendor5",
        "Vendor6",
        "Vendor7",
        "Vendor8",
        "Vendor9",
        "Vendor10",
      ],
    },
    yaxis: {
      max: 60,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
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
      name: "On time Tasks",
      data: [40, 30, 20, 40, 30, 40, 50, 20, 30, 40],
    },
    {
      name: "Overdue Tasks",
      data: [10, 20, 30, 20, 20, 10, 10, 20, 20, 10],
    },
  ];

  return (
    <div className="bg-white p-3 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">SLA Analysis</h3>
        <div className="text-gray-500">05/10/2025</div>
      </div>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default SLAAnalysis;
