import React, { useState } from "react";
import { Table, Button } from "antd";
import VehicleRegistrationForm from "./VehicleRegistrationForm";
import CommonTable from "../commonComponents/CommonTable";
import CommonDivider from "../commonComponents/CommonDivider";

const columns = [
  {
    title: "Vehicle Type",
    dataIndex: "vehicleType",
    key: "vehicleType",
  },
  {
    title: "Vehicle Name",
    dataIndex: "vehicleName",
    key: "vehicleName",
  },
  {
    title: "Vehicle Number",
    dataIndex: "vehicleNumber",
    key: "vehicleNumber",
  },
  {
    title: "RC Details",
    dataIndex: "rcDetails",
    key: "rcDetails",
  },
];

const VehicleList = () => {
  const vehiclesLocal =
    JSON.parse(localStorage.getItem("vehicleRegistration")) || [];
  const [isVehicleList, setIsVehicleList] = useState(false);
  const [vehicleList, setVehicleList] = useState(vehiclesLocal);

  return (
    <div className="">
      {!isVehicleList && (
        <>
          <CommonDivider
            label={"Vehicle List"}
            compo={
              <Button
                onClick={() => setIsVehicleList(true)}
                className="bg-orange-300 mb-1"
              >
                Add Vehicle
              </Button>
            }
          ></CommonDivider>
          <CommonTable
            columns={columns}
            dataSource={[...vehicleList]}
          ></CommonTable>
        </>
      )}
      {isVehicleList && <VehicleRegistrationForm />}
    </div>
  );
};

export default VehicleList;
