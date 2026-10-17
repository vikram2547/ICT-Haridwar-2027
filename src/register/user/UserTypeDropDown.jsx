import React, { useEffect, useState } from "react";
import optionsMaker from "../../urils/OptionMaker";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { Form, Select } from "antd";

const UserTypeDropDown = ({ form, required = true, showLabel }) => {
  const [userTypes, setUserTypes] = useState([]);

  useEffect(() => {
    optionsMaker(
      "userType",
      "user_type",
      "user_type",
      setUserTypes,
      "",
      "user_type_id"
    );
  }, [form]);

  return (
    <Form.Item
      name="user_type_id"
      label={showLabel || <div className="font-semibold">Select User Type</div>}
      rules={[{ required: required, message: "Please select User Type" }]}
      className="mb-4"
    >
      <Select
        placeholder="Select a User Type"
        className="rounded-none"
        options={userTypes}
      ></Select>
    </Form.Item>
  );
};

export default UserTypeDropDown;
