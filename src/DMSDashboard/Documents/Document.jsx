import React from "react";
import DocumentDetailsForm from "./DocumentDetailsForm";
import FacilityDetailsTable from "./DocumentDetailsTable";
import DashboardTitle from "../../dashboardNew/DashboardTitle";

const Document = () => {
  return (
    <div className="rounded">
      <DashboardTitle
        title={"Documents"}
      ></DashboardTitle>
      <div className="p-2">
        <DocumentDetailsForm></DocumentDetailsForm>
      </div>
      <div>
        <FacilityDetailsTable></FacilityDetailsTable>
      </div>
    </div>
  );
};

export default Document;
