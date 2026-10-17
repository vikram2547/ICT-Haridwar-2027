import React, { useState } from "react";
import { Table, Input, Button, Pagination } from "antd"; // Assuming Ant Design is used

const NotificationLog = () => {
  // Sample data
  const [data, setData] = useState([
    {
      key: "1",
      taskId: "T1023",
      channels: "SMS",
      notification: "Tent Frame Breaks",
      date: "04/03/2024 08:30AM",
      classificationType: "Task Assignment",
    },
    {
      key: "2",
      taskId: "T1024",
      channels: "MAIL",
      notification: "Tent Canopy Is Soggy with Water",
      date: "04/03/2024 08:30AM",
      classificationType: "Task Completed",
    },
    {
      key: "3",
      taskId: "T1028",
      channels: "MAIL",
      notification: "Tent Frame Breaks",
      date: "04/03/2024 08:30AM",
      classificationType: "Reminder",
    },
    {
      key: "4",
      taskId: "T1030",
      channels: "SMS",
      notification: "Tent Frame Breaks",
      date: "04/03/2024 08:30AM",
      classificationType: "SLA Breakdown",
    },
    {
      key: "5",
      taskId: "T1032",
      channels: "MAIL",
      notification: "Tent Frame Breaks",
      date: "04/03/2024 08:30AM",
      classificationType: "Task Assignment",
    },
  ]);

  // Columns for the table
  const columns = [
    { title: "Task ID", dataIndex: "taskId", key: "taskId" },
    { title: "Channels", dataIndex: "channels", key: "channels" },
    { title: "Notifications", dataIndex: "notification", key: "notification" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Classification Type",
      dataIndex: "classificationType",
      key: "classificationType",
    },
  ];

  // Function to filter data based on input (you need to implement this)
  const filterData = () => {
    // Implement filter logic here
  };

  return (
    <div
      className="bg-white shadow rounded-md p-3"
      style={{ textAlign: "center" }}
    >
      <div
        className="p-3 rounded bg-yellow-50 mb-3 flex gap-2 flex-wrap "
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
        }}
      >
        <Input
          placeholder="Task ID"
          style={{ width: "120px", marginRight: "8px" }}
        />

        <Input
          placeholder="Channels"
          style={{ width: "120px", marginRight: "8px" }}
        />

        <Input
          placeholder="Notification"
          style={{ width: "200px", marginRight: "8px" }}
        />
        <Input
          placeholder="Classification Type"
          style={{ width: "200px", marginRight: "8px" }}
        />
        <Input
          placeholder="Date"
          style={{ width: "150px", marginRight: "8px" }}
        />
        <Button type="primary" onClick={filterData}>
          Submit
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        bordered
        scroll={{ x: 400 }}
      />
    </div>
  );
};

export default NotificationLog;
