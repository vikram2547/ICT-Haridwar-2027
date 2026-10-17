import { DatePicker, Select } from "antd";
import React from "react";
import Chart from "react-apexcharts";
import DashboardTitle from "./DashboardTitle";

const TaskChart = () => {
  const options = {
    chart: {
      type: "bar",
      stacked: false, // Ensure stacking is turned off
    },
    plotOptions: {
      bar: {
        horizontal: true, // Horizontal bars
        barHeight: "50%",
        borderRadius: 8, // This makes the bar ends rounded
        distributed: true, // Distribute colors across the bars
        borderRadiusApplication: "end", // Apply to the end of the bar
        borderRadiusWhenStacked: "all",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        const label = opts.w.globals.labels[opts.dataPointIndex];
        return `${label}: ${val}%`;
      },
      style: {
        fontSize: "12px",
        colors: ["#fff"], // White text on the bars
      },
    },
    xaxis: {
      categories: [
        "Total Tasks",
        "Ontime Tasks",
        "Overdue Tasks",
        "Avg. Cleaning Freq.",
      ],
    },
    yaxis: {
      labels: {
        show: false, // Hide y-axis labels if you don't want them
      },
    },
    colors: ["#ff9933", "#ff4d4f", "#52c41a", "#722ed1"], // Different colors for each bar
    fill: {
      opacity: 1,
    },
    grid: {
      show: true,
      borderColor: "#e9e9e9",
      strokeDashArray: 5,
    },
    tooltip: {
      enabled: true,
    },
  };

  const series = [
    {
      name: "Percentage",
      data: [75, 50, 50, 90], // Data for each category in one series
    },
  ];

  return (
    <div className="chart-container">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

const numbers = [
  { task: "Total Tasks", val: "45 of 50", color: "orange" },
  { task: "On-time Tasks", val: "30 of 50", color: "green" },
  { task: "Overdue", val: "15 of 50", color: "red" },
  { task: "Avg. Cleaning Freq.", val: "70%", color: "blue" },
];

const TeamPerformance = () => {
  return (
    <div className="bg-white p-2  shadow-md rounded-md">
      <div className="flex justify-between flex-wrap">
        <DashboardTitle title="Team Performance"></DashboardTitle>
        <div className="flex gap-3 ">
          <Select
            size="middle"
            placeholder="Select Team"
            options={[{ label: "Team Alpha", title: "teal-alpha" }]}
          ></Select>
          <div>
            <DatePicker size="middle"></DatePicker>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 justify-between gap-10 rounded-md">
        <div className="w-full col-span-2">
          <TaskChart></TaskChart>
        </div>
        <div className="justify-center hidden sm:flex">
          <div className="grid grid-cols-5 w-64 lg:mt-7">
            {numbers.map((el) => {
              return (
                <>
                  <div className="col-span-1">
                    <div
                      className="h-3 w-3 rounded-full mt-1"
                      style={{ backgroundColor: el.color }}
                    ></div>
                  </div>
                  <div className="col-span-4">
                    <div className="lg:text-lg">{el.task}</div>
                    <div className="lg:text-lg font-semibold">{el.val}</div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPerformance;
