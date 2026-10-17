import React from "react";
import { Table, Button, Input } from "antd";
import { Link } from "react-router-dom";

const { Search } = Input;

const data = [
  {
    key: "1",
    srNo: 1,
    assetsId: "84873",
    assetsName: "Table",
    assetsCode: "Table0039",
    unit: "Option 1",
    group: "Option 2",
    vendor: "Option 2",
  },
  {
    key: "2",
    srNo: 2,
    assetsId: "84874",
    assetsName: "Tant Office Furniture",
    assetsCode: "9748873874",
    unit: "Option 2",
    group: "Option 2",
    vendor: "Option 2",
  },
];

const columns = [
  {
    title: "Sr No.",
    dataIndex: "srNo",
    key: "srNo",
  },
  {
    title: "Assets Id",
    dataIndex: "assetsId",
    key: "assetsId",
  },
  {
    title: "Assets Name",
    dataIndex: "assetsName",
    key: "assetsName",
  },
  {
    title: "Assets Code",
    dataIndex: "assetsCode",
    key: "assetsCode",
  },
  {
    title: "Unit",
    dataIndex: "unit",
    key: "unit",
  },
  {
    title: "Group",
    dataIndex: "group",
    key: "group",
  },
  {
    title: "Vendor",
    dataIndex: "vendor",
    key: "vendor",
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <div>
        <Button type="link">View</Button>
        <Button type="link">Edit</Button>
        <Button type="link">Delete</Button>
        <Button type="link">QR</Button>
      </div>
    ),
  },
];

const AssetsList = () => {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Search placeholder="Search assets" style={{ width: 300 }} />
        <Link to="/asset-registration">
          <Button type="primary">Add New Asset</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default AssetsList;
