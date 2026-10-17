// src/components/FileUploadingFrequency.js
import React, { useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Chart from "react-apexcharts";

const FileUploadingFrequency = () => {
  const [selectedDate, setSelectedDate] = useState(23);

  const days = [
    { day: "MO", date: 22 },
    { day: "TU", date: 23 },
    { day: "WE", date: 24 },
    { day: "TH", date: 25 },
    { day: "FR", date: 26 },
    { day: "SA", date: 27 },
    { day: "SU", date: 28 },
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const chartOptions = {
    chart: {
      id: "upload-frequency",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        "12a",
        "02a",
        "04a",
        "06a",
        "08a",
        "10a",
        "12p",
        "02p",
        "04p",
        "06p",
        "08p",
        "10p",
      ],
    },
    yaxis: {
      max: 60,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        inverseColors: false,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    colors: ["#6E62EF"],
    grid: {
      show: true,
      borderColor: "#e7e7e7",
      strokeDashArray: 4,
    },
  };

  const chartSeries = [
    {
      name: "File Uploads",
      data: [50, 40, 35, 30, 45, 40, 35, 50, 30, 40, 25, 20],
    },
  ];

  return (
    <div className="bg-white p-3 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-3">File Uploading frequency</h3>
      <div className="flex justify-between items-center mb-1">
        <LeftOutlined className="text-gray-500 cursor-pointer" />
        <div className="flex gap-2 w-11/12 overflow-scroll">
          {days.map((day) => (
            <div
              key={day.date}
              className={`p-2 rounded-lg cursor-pointer ${
                day.date === selectedDate
                  ? "bg-white border border-gray-300 shadow-md"
                  : "bg-blue-100"
              }`}
              onClick={() => handleDateChange(day.date)}
            >
              <div className="text-gray-600 text-sm">{day.date}</div>
              <div className="text-gray-600 font-semibold">{day.day}</div>
            </div>
          ))}
        </div>
        <RightOutlined className="text-gray-500 cursor-pointer" />
      </div>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height={300}
      />
    </div>
  );
};

export default FileUploadingFrequency;
