import { MinusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import React from "react";

const SectorsField = ({ options, sectorIndex, handleRemoveSelectedIds }) => {
  return (
    <>
      <Form.Item
        label={<div className="font-semibold">Sector</div>}
        name={"sect_" + sectorIndex}
        rules={[{ required: true, message: "Sector is required!" }]}
        className="mb-4"
      >
        <Select placeholder="Sector" allowClear>
          {options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={<div className="font-semibold">Quantity</div>}
        name={"quant_" + sectorIndex}
        rules={[{ required: true, message: "Quantity is a required field!" }]}
        className="mb-4"
      >
        <Input placeholder="Quantity"></Input>
      </Form.Item>

      {sectorIndex !== 1 ? (
        <Button
          className="border border-dashed border-1 border-gray-100 rounded-full flex w-9 h-9"
          onClick={() => {
            handleRemoveSelectedIds(sectorIndex);
          }}
        >
          <MinusOutlined></MinusOutlined>
        </Button>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default SectorsField;
const { Option } = Select;
