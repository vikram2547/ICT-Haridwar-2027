import { Button, DatePicker, Form, Input } from "antd";
import React from "react";

const PerformanceMatrixSearchFom = () => {
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 flex-wrap gap-2">
          <Form.Item noStyle name="team">
            <Input size="large" placeholder="Team" />
          </Form.Item>

          <Form.Item noStyle name="location">
            <Input size="large" placeholder="Location" />
          </Form.Item>

          <Form.Item noStyle name="overdue_tasks">
            <Input size="large" placeholder="Overdue  Tasks" />
          </Form.Item>

          <Form.Item noStyle name="crew_efficiency">
            <Input size="large" placeholder="Crew Efficiency" />
          </Form.Item>

          <Form.Item noStyle name="date">
            <DatePicker size="large" placeholder="Date" />
          </Form.Item>

          <Form.Item noStyle name="feedback_score">
            <Input size="large" placeholder="Feedback Score" />
          </Form.Item>

          <div className="flex justify-end col-span-2 md:col-span-3 lg:col-span-6">
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="w-32 bg-orange-400 font-semibold"
            >
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default PerformanceMatrixSearchFom;
