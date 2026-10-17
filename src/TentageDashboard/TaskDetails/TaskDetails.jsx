import React from "react";
import TaskDetailsForm from "./TaskDetailsForm";
import DashboardTitle from "../DashboardTitle";
import TaskDetailsTable from "./TaskDetailsTable";

const TaskDetails = () => {
  return (
    <div className="rounded-md shadow-md bg-white">
      <DashboardTitle title={"Task Details"}></DashboardTitle>
      <div className="p-2">
        <TaskDetailsForm></TaskDetailsForm>
      </div>
      <div>
        <TaskDetailsTable></TaskDetailsTable>
      </div>
    </div>
  );
};

export default TaskDetails;
