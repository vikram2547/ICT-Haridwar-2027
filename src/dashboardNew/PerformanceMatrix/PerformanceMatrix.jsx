import React from "react";
import FacilityDetailsForm from "../FacilityDetails/FacilityDetailsForm";
import DashboardTitle from "../DashboardTitle";
import FacilityDetailsTable from "../FacilityDetails/FacilityDetailsTable";
import PerformanceMatrixSearchFom from "./PerformanceMatrixSearchForm";
import PerformanceMatrixTable from "./PerformanceMatrixTable";

const PerformanceMatrix = () => {
  return (
    <div className="rounded-md">
      <DashboardTitle title={"Performance Matrix"}></DashboardTitle>
      <div className="p-2">
        <PerformanceMatrixSearchFom></PerformanceMatrixSearchFom>
      </div>
      <div className="p-2">
        <PerformanceMatrixTable></PerformanceMatrixTable>
      </div>
    </div>
  );
};

export default PerformanceMatrix;
