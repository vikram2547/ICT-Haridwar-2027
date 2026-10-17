import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./dropdown.css";

const DropDown = ({ items, name, text }) => {
  return (
    <Dropdown
      key={name}
      className={`h-full flex items-center ant-dropDown text-sm justify-center no-underline `}
      menu={{
        items,
      }}
    >
      <Link onClick={(e) => e.preventDefault()}>
        <Space className={` ${text ? "text-black" : "text-white"}`}>
          {name} <DownOutlined />
        </Space>
      </Link>
    </Dropdown>
  );
};

export default DropDown;
