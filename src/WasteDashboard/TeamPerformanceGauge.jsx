import React from "react";
import ReactApexChart from "react-apexcharts";

const TeamPerformanceGauge = () => {
  const options = {
    chart: {
      type: "radialBar",
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: "#999",
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "22px",
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    labels: ["Average Results"],
  };

  const series = [78]; // Percentage value for the radial bar

  return (
    <div className="w-full border flex justify-center text-center flex-col">
      <div className=" font-semibold">Team Alpha</div>
      <div className="text-lg">Weekly Performance</div>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={300}
      />
    </div>
  );
};

export default TeamPerformanceGauge;
