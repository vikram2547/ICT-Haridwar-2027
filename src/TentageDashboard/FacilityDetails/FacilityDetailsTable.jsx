import { Table } from "antd";
import React from "react";

const FacilityDetailsTable = () => {
  const dataSource = [
    {
      key: "1",
      facilityId: "T1023",
      location: "Section 5, Zone B",
      tentType: "Pole tents",
      tentDetails: "Its own roller bag. 9 pop up tent is incredibly ...",
      lastSchedule: "In 2 hrs",
      nextSchedule: "04/03/2024",
      vendor: "Team Alpha",
    },
    {
      key: "2",
      facilityId: "T1024",
      location: "Section 4, Zone A",
      tentType: "General",
      tentDetails: "Its own roller bag. 9 pop up ...",
      lastSchedule: "In 2-3 hrs",
      nextSchedule: "04/03/2024",
      vendor: "Team Beta",
    },
    {
      key: "3",
      facilityId: "T1028",
      location: "Section 4, Zone B",
      tentType: "Emergency",
      tentDetails: "Its own roller bag. 9 pop up ...",
      lastSchedule: "In 4-6 hrs",
      nextSchedule: "04/03/2024",
      vendor: "Team Beta",
    },
    {
      key: "4",
      facilityId: "T1030",
      location: "Section 3, Zone D",
      tentType: "Marquee tents",
      tentDetails: "Its own roller bag. 9 pop ...",
      lastSchedule: "NA",
      nextSchedule: "04/03/2024",
      vendor: "Team Beta",
    },
    {
      key: "5",
      facilityId: "T1032",
      location: "Section 5, Zone D",
      tentType: "VIP",
      tentDetails: "Its own roller bag. 9 pop ...",
      lastSchedule: "In 2 hrs",
      nextSchedule: "04/03/2024",
      vendor: "Team Beta",
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
      title: "Tent Type",
      dataIndex: "tentType",
      key: "tentType",
    },
    {
      title: "Tent Details",
      dataIndex: "tentDetails",
      key: "tentDetails",
    },
    {
      title: "Last Schedule",
      dataIndex: "lastSchedule",
      key: "lastSchedule",
    },
    {
      title: "Next Schedule",
      dataIndex: "nextSchedule",
      key: "nextSchedule",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
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

export default FacilityDetailsTable;
