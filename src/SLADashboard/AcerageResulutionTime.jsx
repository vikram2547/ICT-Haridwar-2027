// src/components/AverageResolutionTime.js
import React from "react";
import Chart from "react-apexcharts";

const AverageResolutionTime = () => {
  const chartOptions = {
    chart: {
      type: "radialBar",
      offsetY: -10,
      offsetX: 0,
    },
    plotOptions: {
      radialBar: {
        startAngle: -145,
        endAngle: 145,
        track: {
          background: "#e7e7e7",
          strokeWidth: "100%",
          margin: 0, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "22px",
            formatter: function (val) {
              return val + " Min";
            },
          },
        },
      },
    },
    fill: {
      colors: ["#20E647"],
      type: "gradient",
      gradient: {
        shade: "light",
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 100],
        gradientToColors: ["#87D4F9"],
      },
    },
    stroke: {
      dashArray: 4,
    },
    labels: ["Average resolution time"],
  };

  const chartSeries = [25]; // Example value in minutes

  return (
    <div className="p-4 rounded-lg w-full flex flex-col bg-white shadow-md">
      <div className="text-xl font-bold mb-4">Average resolution time</div>
      <div className="rounded-lg flex flex-col items-center justify-center">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="radialBar"
          height={450}
        />
      </div>
    </div>
  );
};

export default AverageResolutionTime;
