import { Table } from "antd";
import React from "react";

const TaskDetailsTable = () => {
  const dataSource = [
    {
      key: "1",
      facilityId: "T1023",
      location: "Section 5, Zone B",
      issuesTasks: "Tent Frame Breaks",
      issueDateTime: "04/03/2024 08:30 AM",
      assignPerson: "Gajodhar Dubey",
      dueDate: "04/03/2024",
      taskStatus: "Completed",
    },
    {
      key: "2",
      facilityId: "T1024",
      location: "Section 4, Zone A",
      issuesTasks: "Tent Canopy is Soggy with Water",
      issueDateTime: "04/03/2024 08:30 AM",
      assignPerson: "Naman Sharma",
      dueDate: "04/03/2024",
      taskStatus: "Not Done",
    },
    {
      key: "3",
      facilityId: "T1028",
      location: "Section 4, Zone B",
      issuesTasks: "Tent Frame Breaks",
      issueDateTime: "04/03/2024 08:30 AM",
      assignPerson: "Mukesh Tiwary",
      dueDate: "04/03/2024",
      taskStatus: "Completed",
    },
    {
      key: "4",
      facilityId: "T1030",
      location: "Section 3, Zone D",
      issuesTasks: "Tent Frame Breaks",
      issueDateTime: "04/03/2024 08:30 AM",
      assignPerson: "Preetam Pyare",
      dueDate: "04/03/2024",
      taskStatus: "Completed",
    },
    {
      key: "5",
      facilityId: "T1032",
      location: "Section 5, Zone D",
      issuesTasks: "Tent Frame Breaks",
      issueDateTime: "04/03/2024 08:30 AM",
      assignPerson: "Sandeep Verma",
      dueDate: "04/03/2024",
      taskStatus: "Not Done",
    },
  ];

  const columns = [
    {
      title: "Facility ID",
      dataIndex: "facilityId",
      key: "facilityId",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Issues/Tasks",
      dataIndex: "issuesTasks",
      key: "issuesTasks",
    },
    {
      title: "Issue Date/Time",
      dataIndex: "issueDateTime",
      key: "issueDateTime",
    },
    {
      title: "Assign Person",
      dataIndex: "assignPerson",
      key: "assignPerson",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Task Status",
      dataIndex: "taskStatus",
      key: "taskStatus",
    },
  ];

  return (
    <div className="p-2">
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 400 }}
      />
    </div>
  );
};

export default TaskDetailsTable;
