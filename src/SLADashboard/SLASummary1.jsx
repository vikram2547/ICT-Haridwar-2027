import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Select } from "antd";
import DashboardTitle from "../dashboardNew/DashboardTitle";

const { Option } = Select;

const SLAChart = () => {
  // Chart options and series data
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "donut",
    },
    labels: ["Completed Tasks", "Overdue Tasks"],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
      dropShadow: {
        enabled: true,
      },
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
              fontWeight: 600,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 400,
              formatter: (val) => `${Math.floor(val)}%`,
            },
            total: {
              show: true,
              showAlways: false,
              label: "Total",
              fontSize: "16px",
              fontWeight: 600,
              formatter: () => "100%",
            },
          },
        },
      },
    },
    colors: ["#00C49F", "#FF8042"],
    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
      },
    },
  });

  const [chartSeries, setChartSeries] = useState([80, 20]); // Initial chart data
  const [vendor, setVendor] = useState("Vendor 1"); // Selected vendor

  // Handle vendor change
  const handleVendorChange = (value) => {
    setVendor(value);
    // Update the chart data based on selected vendor (you can replace this logic with real data)
    if (value === "Vendor 1") {
      setChartSeries([80, 20]);
    } else if (value === "Vendor 2") {
      setChartSeries([70, 30]);
    } else {
      setChartSeries([60, 40]);
    }
  };

  return (
    <div
      className="bg-white shadow rounded-md p-3 h-full"
      style={{ textAlign: "center" }}
    >
      <DashboardTitle title="SLA Summary"></DashboardTitle>
      <Select
        value={vendor}
        style={{ width: 150, marginBottom: "2px" }}
        onChange={handleVendorChange}
      >
        <Option value="Vendor 1">Vendor 1</Option>
        <Option value="Vendor 2">Vendor 2</Option>
        <Option value="Vendor 3">Vendor 3</Option>
      </Select>

      <Chart
        options={chartOptions}
        series={chartSeries}
        type="donut"
        height={250}
      />

      <div style={{ marginTop: "4px", fontSize: "16px" }}>
        <div>Intime Completed Tasks: 5000</div>
        <div>Overdue Tasks: 1000</div>
      </div>
    </div>
  );
};

export default SLAChart;
