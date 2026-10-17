// src/RecentActivities.js
import React from "react";
import { ClockCircleOutlined } from "@ant-design/icons"; // Optional for time icon

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      teamName: "Team Sigma",
      date: "15 MAR 2019",
      time: "02:08PM",
    },
    {
      id: 2,
      teamName: "Team Sigma",
      date: "15 MAR 2019",
      time: "02:08PM",
    },
    {
      id: 3,
      teamName: "Team Sigma",
      date: "15 MAR 2019",
      time: "02:08PM",
    },
  ];

  return (
    <div className="h-full p-3 border">
      <h3 className="text-xl font-bold mb-2">Recent Activities</h3>
      <hr className="border-dashed mt-0" />

      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-gray-50 rounded-lg flex justify-between items-center mb-2"
        >
          <div>
            <div className="text-gray-700 font-semibold">
              {activity.teamName}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <span className="mr-2 text-orange-500">●</span>
              <span>{activity.date}</span>
              <span className="mx-2">/</span>
              <span>{activity.time}</span>
            </div>
          </div>
        </div>
      ))}

      <button className="bg-lime-500 hover:bg-orange-600 text-white font-semibold flex mt-auto  m-auto  py-1 px-4 rounded-full ">
        View All
      </button>
    </div>
  );
};

export default RecentActivities;
