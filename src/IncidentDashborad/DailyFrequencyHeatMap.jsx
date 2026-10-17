import React, { useState } from "react";
import Chart from "react-apexcharts";
import { DatePicker } from "antd";
import moment from "moment";

const DailyFrequencyHeatmap = () => {
  const [selectedDate, setSelectedDate] = useState(moment());

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const chartOptions = {
    chart: {
      type: "heatmap",
      toolbar: {
        show: false,
      },
    },
    legend: {
      position: "bottom",
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 10,
              color: "#E0EFFF", // Light blue
            },
            {
              from: 11,
              to: 20,
              color: "#008FFB", // Mid blue
            },
            {
              from: 21,
              to: 30,
              color: "#0066CC", // Darker blue
            },
            {
              from: 31,
              to: 40,
              color: "#003D99", // Darkest blue
            },
            {
              from: 41,
              to: 50,
              color: "#002266", // Even darker blue
            },
            {
              from: 51,
              to: 60,
              color: "#000033", // Darkest blue (near black)
            },
          ],
        },
      },
    },
    xaxis: {
      categories: [
        "S01",
        "S02",
        "S03",
        "S04",
        "S05",
        "S06",
        "S07",
        "S08",
        "S09",
        "S10",
        "S11",
        "S12",
        "S13",
        "S14",
        "S15",
        "S16",
        "S17",
        "S18",
        "S19",
        "S20",
        "S21",
        "S22",
        "S23",
        "S24",
        "S25",
      ], // Session identifiers
    },
    yaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // Days of the week
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
  };

  const chartSeries = [
    {
      name: "Sun",
      data: [
        10, 15, 20, 25, 30, 35, 15, 10, 5, 20, 25, 30, 35, 20, 15, 10, 5, 25,
        20, 15, 30, 35, 25, 20, 15,
      ],
    },
    {
      name: "Mon",
      data: [
        15, 20, 25, 30, 35, 40, 20, 15, 10, 25, 30, 35, 40, 25, 20, 15, 10, 30,
        25, 20, 35, 40, 30, 25, 20,
      ],
    },
    {
      name: "Tue",
      data: [
        20, 25, 30, 35, 40, 45, 25, 20, 15, 30, 35, 40, 45, 30, 25, 20, 15, 35,
        30, 25, 40, 45, 35, 30, 25,
      ],
    },
    {
      name: "Wed",
      data: [
        25, 30, 35, 40, 45, 50, 30, 25, 20, 35, 40, 45, 50, 35, 30, 25, 20, 40,
        35, 30, 45, 50, 40, 35, 30,
      ],
    },
    {
      name: "Thu",
      data: [
        30, 35, 40, 45, 50, 31, 35, 30, 25, 40, 45, 50, 55, 40, 35, 30, 25, 45,
        40, 35, 50, 32, 45, 40, 35,
      ],
    },
    {
      name: "Fri",
      data: [
        35, 40, 45, 50, 15, 30, 40, 35, 30, 45, 50, 45, 40, 45, 40, 35, 30, 50,
        45, 40, 55, 30, 50, 45, 40,
      ],
    },
    {
      name: "Sat",
      data: [
        40, 45, 50, 25, 20, 45, 45, 40, 35, 50, 55, 10, 34, 20, 45, 40, 35, 55,
        50, 45, 40, 45, 25, 30, 45,
      ],
    },
  ];

  return (
    <div className="p-2 mx-auto bg-white rounded-xl shadow-md w-full">
      {/* Title and Date Picker */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Daily Frequency of Incidents</h3>
        <DatePicker
          defaultValue={selectedDate}
          onChange={onDateChange}
          className="px-3 py-1 border border-gray-300 rounded-md"
        />
      </div>

      {/* Heatmap Chart */}
      <div className="w-full -mt-5">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="heatmap"
          height={350}
          width="100%"
        />
      </div>
    </div>
  );
};

export default DailyFrequencyHeatmap;
