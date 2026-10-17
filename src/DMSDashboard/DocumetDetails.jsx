import { DatePicker } from "antd";
import moment from "moment";
// src/DocumentDetails.js
import React, { useState } from "react";
import Chart from "react-apexcharts";

const DocumentDetails = () => {
  const [selectedTab, setSelectedTab] = useState("Tentage");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const chartOptions = {
    chart: {
      id: "document-line-chart",
      toolbar: {
        show: false,
      },
    },
    colors: ["#775DD0", "#00A100"],
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  };

  const chartSeries = [
    {
      name: "Total",
      data: [35000, 30000, 40000, 38000, 35000, 37000, 36000],
    },
    {
      name: "Functional",
      data: [15000, 18000, 17000, 20000, 18000, 19000, 17000],
    },
  ];

  return (
    <div className="bg-gray-100 flex flex-col items-center">
      <div className="w-full bg-white rounded-lg p-3">
        <div className="w-full">
          <div className="flex justify-between items-center mb-1 w-full">
            <h2 className="text-xl font-bold">Document Details</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                <DatePicker defaultValue={moment()}></DatePicker>
              </span>
            </div>
          </div>
        </div>
        <hr className="border-dashed mt-0" />
        <div className="flex space-x-4 mb-4 border-b">
          {["Tentage", "Sanitation", "Waste Management"].map((tab) => (
            <button
              key={tab}
              className={`text-sm pb-2 ${
                selectedTab === tab
                  ? "border-b-2 border-red-500 text-red-500"
                  : "text-gray-500"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
