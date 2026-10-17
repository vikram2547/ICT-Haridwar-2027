import React, { useState } from "react";
import { Rate, Table } from "antd";
import { render } from "@testing-library/react";
const dataSource = [
  {
    key: "1",
    team: "Alpha",
    dailyComplianceRate: "95%",
    overdueTasks: 15,
    avgCleaningFreq: "Daily Every 2 hrs",
    crewEfficiency: "95%",
    feedbackScore: { ratings: 4.8, reviews: "100 reviews" },
    location: "Section 5, Zone D",
  },
  {
    key: "2",
    team: "Omega",
    dailyComplianceRate: "83%",
    overdueTasks: 6,
    avgCleaningFreq: "Daily Every 2.3 hrs",
    crewEfficiency: "97%",
    feedbackScore: { ratings: 4.5, reviews: "98 reviews" },
    location: "Section 3, Zone D",
  },
  {
    key: "3",
    team: "Sigma",
    dailyComplianceRate: "87%",
    overdueTasks: 2,
    avgCleaningFreq: "Daily Every 1.5 hrs",
    crewEfficiency: "98%",
    feedbackScore: { ratings: 4, reviews: "200 reviews" },
    location: "Section 4, Zone B",
  },
  {
    key: "4",
    team: "Delta",
    dailyComplianceRate: "98%",
    overdueTasks: 0,
    avgCleaningFreq: "Daily Every 2.3 hrs",
    crewEfficiency: "88%",
    feedbackScore: { ratings: 5, reviews: "300 reviews" },
    location: "Section 4, Zone A",
  },
  {
    key: "5",
    team: "Phoenix",
    dailyComplianceRate: "97%",
    overdueTasks: 1,
    avgCleaningFreq: "Daily Every 1 hr",
    crewEfficiency: "91%",
    feedbackScore: { ratings: 4.8, reviews: "210 reviews" },
    location: "Section 5, Zone B",
  },
];

const columns = [
  {
    title: "TEAM",
    dataIndex: "team",
    key: "team",
  },
  {
    title: "DAILY COMPLIANCE RATE",
    dataIndex: "dailyComplianceRate",
    key: "dailyComplianceRate",
  },
  {
    title: "OVERDUE TASKS",
    dataIndex: "overdueTasks",
    key: "overdueTasks",
  },
  {
    title: "AVG. CLEANING FREQ.",
    dataIndex: "avgCleaningFreq",
    key: "avgCleaningFreq",
  },
  {
    title: "CREW EFFICIENCY",
    dataIndex: "crewEfficiency",
    key: "crewEfficiency",
  },
  {
    title: "FEEDBACK SCORE",
    dataIndex: "feedbackScore",
    key: "feedbackScore",
    render: (el) => {
      return (
        <div className="flex justify-start gap-3 items-center">
          <div>
            <div>{el.ratings}</div>
            <Rate
              size="small"
              allowHalf
              onChange={() => {}}
              allowClear={false}
              disabled
              defaultValue={el.ratings}
            />{" "}
          </div>
          <div className="">{el.reviews}</div>
        </div>
      );
    },
  },
  {
    title: "LOCATION",
    dataIndex: "location",
    key: "location",
  },
];

const PerformanceMatrixTable = () => {
  return (
    <Table dataSource={dataSource} columns={columns} scroll={{ x: 1300}} />
  );
};

export default PerformanceMatrixTable;
