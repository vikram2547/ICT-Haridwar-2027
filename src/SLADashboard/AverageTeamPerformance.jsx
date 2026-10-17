import React from "react";
import ReactApexChart from "react-apexcharts";
import DashboardTitle from "../dashboardNew/DashboardTitle";
import { DatePicker, Select } from "antd";
import TeamPerformanceGauge from "../dashboardNew/TeamPerformanceGauge";

const AverageResponseTimeChart = () => {
  const options = {
    chart: {
      type: "bar",
      height: "100%",
      stacked: true, // Enable stacking
      toolbar: {
        show: true, // Hide toolbar if not needed
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
        columnWidth: "30%", // Adjust the width of the bars
        dataLabels: {
          position: "top",
        },

        borderRadius: 4, // Rounded corners for bars
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    yaxis: {
      title: {
        text: "Time (Mins)",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#ff4560", "#3f8f29"], // Colors for the series
    stroke: {
      show: true,
      colors: ["#e0e0e0"], // Gray shadow color
      width: 0, // Width of the shadow
    },
    grid: {
      show: true, // Hide grid lines if not needed
    },
  };

  const series = [
    {
      name: "Assigned Time",
      data: [30, 40, 45, 50, 49, 60, 70], // Replace with actual data for Assigned Time
    },
    {
      name: "Overdue Time",
      data: [0, 0, 0, 10, 0, 4, 10], // Replace with actual data for Overdue Time
    },
  ];

  return (
    <div className="bg-white p-2  shadow-md rounded-md">
      <div className="flex justify-between flex-wrap">
        <DashboardTitle title="Team Performance"></DashboardTitle>
        <div className="flex gap-3">
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

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 rounded-md">
        <div className="w-full sm:col-span-3">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={300}
          />
        </div>

        <div className="flex justify-center items-center sm:col-span-2 rounded-md ">
          <TeamPerformanceGauge></TeamPerformanceGauge>
        </div>
      </div>
    </div>
  );
};

export default AverageResponseTimeChart;
