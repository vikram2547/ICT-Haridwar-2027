import React, { useState } from "react";
import Chart from "react-apexcharts";
import { DatePicker } from "antd";
import moment from "moment";

const IncidentTrends = () => {
  const [selectedDate, setSelectedDate] = useState(moment());

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const chartOptions = {
    chart: {
      type: "area",
      toolbar: {
        show: false, // Hide the export tools
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: ["Type 1", "Type 2", "Type 3", "Type 4", "Type 5", "Type 6"],
    },
    yaxis: {
      min: 0,
      max: 60,
    },
    colors: ["#775DD0"],
  };

  const chartSeries = [
    {
      name: "Incidents",
      data: [20, 30, 40, 55, 35, 45],
    },
  ];

  return (
    <div className="p-2 mx-auto bg-white rounded-xl shadow-md w-full">
      <div className="flex justify-between items-center flex-wrap">
        <h3 className="text-xl font-semibold">Incident Trends</h3>
      </div>
      <div className="flex justify-end w-full">
        <DatePicker
          defaultValue={selectedDate}
          onChange={onDateChange}
          className="px-3 py-1 border border-gray-300 rounded-md"
        />
      </div>

      <div className="w-full">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height={350}
          width="100%" // Ensures chart takes full width of its parent
        />
      </div>
    </div>
  );
};

export default IncidentTrends;
