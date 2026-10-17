// src/components/TasksCompletedByVendor.js
import React from "react";
import Chart from "react-apexcharts";

const TasksCompletedByVendor = () => {
  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ["#00E396", "#CED4DC"], // Green for completed, Light Gray for total tasks
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
      name: "Completed Tasks",
      data: [40, 30, 20, 50, 30, 40, 50, 20, 40, 30],
    },
    {
      name: "Total Tasks",
      data: [50, 40, 30, 60, 50, 50, 60, 40, 50, 50],
    },
  ];

  return (
    <div className="bg-white p-3 rounded-lg shadow-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">Tasks Completed by Vendor</h3>
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

export default TasksCompletedByVendor;
