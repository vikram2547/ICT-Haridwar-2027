// src/components/Approvals.js
import React from "react";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const Approvals = () => {
  const data = [
    { id: "T1023", name: "File Name" },
    { id: "T1024", name: "File Name" },
    { id: "T1028", name: "File Name" },
    { id: "T1030", name: "File Name" },
    { id: "T1032", name: "File Name" },
  ];

  return (
    <div className="bg-white p-3 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Approvals</h3>
        <button className="text-blue-500">View All</button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2">ID</th>
            <th className="py-2">NAME</th>
            <th className="py-2">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2 text-center">{item.id}</td>
              <td className="py-2 text-center">{item.name}</td>
              <td className="py-2 text-center flex justify-center space-x-2">
                <EyeOutlined className="text-blue-500" />
                <CheckCircleOutlined className="text-green-500" />
                <CloseCircleOutlined className="text-red-500" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Approvals;
