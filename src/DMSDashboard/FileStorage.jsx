// src/components/FileStorage.js
import React from "react";
import Chart from "react-apexcharts";
import slaIcon from "../assets/Dashboard/slaIcon.png";
import photoIcon from "../assets/Dashboard/photoIcon.png";
import videoIcon from "../assets/Dashboard/videoIcon.png";
import otherIcon from "../assets/Dashboard/otherIcon.png";

const FileStorage = () => {
  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["SLA", "Photo", "Video", "Other"],
    colors: ["#775DD0", "#00E396", "#FEB019", "#008FFB"],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: "bold",
            },
            value: {
              show: true,
              fontSize: "14px",
              formatter: () => "70000",
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: "bold",
              formatter: () => "70000",
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
  };

  const chartSeries = [25000, 30000, 10000, 5000];

  return (
    <div className="bg-white p-3 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">File Storage</h3>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="donut"
        height={300}
      />
      <div className="mt-4 flex justify-around">
        <div className="flex items-center">
          <img src={slaIcon} className="w-8 h-8 mr-2" alt="slaIcon"></img>
          <div>
            <div className="text-sm font-semibold">SLA</div>
            <div className="text-sm text-gray-500">25000</div>
          </div>
        </div>
        <div className="flex items-center">
          <img src={photoIcon} className="w-8 h-8 mr-2" alt="slaIcon"></img>
          <div>
            <div className="text-sm font-semibold">Photo</div>
            <div className="text-sm text-gray-500">30000</div>
          </div>
        </div>
        <div className="flex items-center">
          <img src={videoIcon} className="w-8 h-8 mr-2" alt="slaIcon"></img>
          <div>
            <div className="text-sm font-semibold">Video</div>
            <div className="text-sm text-gray-500">10000</div>
          </div>
        </div>
        <div className="flex items-center">
          <img src={otherIcon} className="w-8 h-8 mr-2" alt="slaIcon"></img>
          <div>
            <div className="text-sm font-semibold">Other</div>
            <div className="text-sm text-gray-500">5000</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileStorage;
