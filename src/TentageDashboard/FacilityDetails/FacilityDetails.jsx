import React from "react";
import FacilityDetailsForm from "./FacilityDetailsForm";
import DashboardTitle from "../DashboardTitle";
import FacilityDetailsTable from "./FacilityDetailsTable";

const FacilityDetails = () => {
  return (
    <div className="rounded-md">
      <DashboardTitle
        title={"Facility Status & Details Panel"}
      ></DashboardTitle>
      <div className="p-2">
        <FacilityDetailsForm></FacilityDetailsForm>
      </div>
      <div>
        <FacilityDetailsTable></FacilityDetailsTable>
      </div>
    </div>
  );
};

export default FacilityDetails;
