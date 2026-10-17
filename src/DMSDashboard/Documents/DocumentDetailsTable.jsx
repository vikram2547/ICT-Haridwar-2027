import { Table } from "antd";
import React from "react";

const DocumentDetailsTable = () => {
  const columns = [
    {
      title: "DOCUMENT ID",
      dataIndex: "documentId",
      key: "documentId",
      sorter: (a, b) => a.documentId.localeCompare(b.documentId),
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "TAGS",
      dataIndex: "tags",
      key: "tags",
      sorter: (a, b) => a.tags.localeCompare(b.tags),
    },
    {
      title: "METADATA",
      dataIndex: "metadata",
      key: "metadata",
    },
    {
      title: "UPLOADED DATE",
      dataIndex: "uploadedDate",
      key: "uploadedDate",
      sorter: (a, b) => new Date(a.uploadedDate) - new Date(b.uploadedDate),
    },
  ];

  // Define the data source
  const dataSource = [
    {
      key: "1",
      documentId: "T1023",
      name: "Document Name",
      tags: "Pole tents",
      metadata: "its own roller bag, a pop up tent is incredibly light...",
      uploadedDate: "04/03/2024",
    },
    {
      key: "2",
      documentId: "T1024",
      name: "Document Name",
      tags: "General",
      metadata: "its own roller bag, a pop up tent is incredibly light...",
      uploadedDate: "04/03/2024",
    },
    {
      key: "3",
      documentId: "T1028",
      name: "Document Name",
      tags: "Emergency",
      metadata: "its own roller bag, a pop up tent is incredibly light...",
      uploadedDate: "04/03/2024",
    },
    {
      key: "4",
      documentId: "T1030",
      name: "Document Name",
      tags: "Marquee tents",
      metadata: "its own roller bag, a pop up tent is incredibly light...",
      uploadedDate: "04/03/2024",
    },
    {
      key: "5",
      documentId: "T1032",
      name: "Document Name",
      tags: "VIP",
      metadata: "its own roller bag, a pop up tent is incredibly light...",
      uploadedDate: "04/03/2024",
    },
  ];

  return (
    <div className="p-2">
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 800, y: 300 }}
      />
    </div>
  );
};

export default DocumentDetailsTable;
