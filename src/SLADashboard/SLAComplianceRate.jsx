// src/components/SLAComplianceRate.js
import React from "react";
import Chart from "react-apexcharts";

const SLAComplianceRate = () => {
  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Compliant", "Non-Compliant"],
    colors: ["#775DD0", "#FF4560"],
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "87%",
              fontSize: "22px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
    },
    legend: {
      show: false,
    },
  };

  const chartSeries = [87, 13]; // Example values for compliance rate

  return (
    <div className="p-4 rounded-lg shadow-md w-full bg-white">
      <div className="text-xl font-bold mb-4">SLA compliance rate</div>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="donut"
        height={300}
      />
    </div>
  );
};

export default SLAComplianceRate;
