import { Button, DatePicker, Form, Input } from "antd";
import React from "react";

const FacilityDetailsForm = () => {
  const onFinish = (values) => {};
  return (
    <div
      className="p-3 rounded bg-yellow-50"
      style={{
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
      }}
    >
      <Form onFinish={onFinish}>
        <div className="flex justify-between flex-wrap">
          <div className="w-96">
            <Form.Item noStyle name="">
              <Input placeholder="Search by Document,Keywords,Tags" />
            </Form.Item>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="w-32 bg-orange-400 font-semibold"
          >
            Search
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FacilityDetailsForm;
