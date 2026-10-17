import { Checkbox } from "antd";
import React from "react";

const GroupCheckBox = ({ setSelectedDashboardVals }) => {
  const plainOptions = ["Tentage", "Sanitization", "Vehicle", "Bins"];

  const onChange = (checkedValues) => {
    if (checkedValues.length) {
      checkedValues = checkedValues.map((el) => {
        if (el === "Vehicle") {
          return "Wastes";
        } else return el;
      });

      setSelectedDashboardVals(() => [...checkedValues]);
    } else {
      const newPlainOptions = plainOptions.map((el) => {
        if (el === "Vehicle") {
          return "Wastes";
        } else return el;
      });
      setSelectedDashboardVals(() => [...newPlainOptions]);
    }
  };

  return (
    <div>
      <Checkbox.Group options={plainOptions} onChange={onChange} />
    </div>
  );
};

export default GroupCheckBox;
