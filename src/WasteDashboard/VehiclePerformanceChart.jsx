import React, { useState } from "react";
import Chart from "react-apexcharts";
import DashboardTitle from "./DashboardTitle";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const weekFormat = "MM/DD";

/** Manually entering any of the following formats will perform date parsing */
const customWeekStartEndFormat = (value) =>
  `${dayjs(value).startOf("week").format(weekFormat)} ~ ${dayjs(value)
    .endOf("week")
    .format(weekFormat)}`;
const WeekSelectorWithAutoRange = () => {
  return (
    <DatePicker
      defaultValue={dayjs()}
      size="small"
      format={customWeekStartEndFormat}
      picker="week"
    />
  );
};

const VehiclePerformanceChart = ({ title }) => {
  const series = [
    {
      name: "Tippers",
      data: [90, 40, 50, 60, 20, 10, 70],
    },
    {
      name: "Compactors",
      data: [100, 60, 86, 100, 40, 30, 90],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 300,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    yaxis: {
      title: {
        text: "Number of Bins Collected",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} Bins Collected`;
        },
      },
    },
    colors: ["#008FFB", "#FF4560"], // Blue for Tippers, Red for Compactors
    legend: {
      position: "top",
    },
  };

  return (
    <div className="chart p-2">
      <div className="flex flex-wrap justify-between">
        <DashboardTitle title={"Vehicle Performance"}></DashboardTitle>
        <WeekSelectorWithAutoRange></WeekSelectorWithAutoRange>
      </div>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default VehiclePerformanceChart;
