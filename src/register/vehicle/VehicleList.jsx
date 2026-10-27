
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col, message } from "antd";

import search from "../../assets/Dashboard/icon-search.png";
import { EditOutlined } from "@ant-design/icons";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";
import { vehicleType } from "../../constant/const";
import { getVehicleList } from "./Slice/vehicleSlice";
import VehicleSelectors from "./Slice/vehicleSelector";
import VendorSelectors from "../../Reports/VendorwiseReports/vendorSelectors";
import { getVendorCategoryTypeDrop } from "../../Reports/VendorwiseReports/vendorslice";

const VehicleList = () => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [form] = Form.useForm();

  // Existing language context
  const [dict, lang] = useOutletContext();

 const t = (key) => dict?.[key]?.[lang] || key;

  const { VendorCatTypeDrop } = VendorSelectors();
  const { VehicleData, loading } = VehicleSelectors();
  const { paging, vehicles } = VehicleData?.data || {};

  // Search
  const onFinishForm = (values) => {
    const allEmpty = Object.values(values).every(
      (value) =>
        value === undefined ||
        value === null ||
        value === ""
    );

    if (allEmpty) {
      message.error(t("vehicle_select_search_field"));
      return;
    }

    const finalValues = {
      ...(values?.user_id && { user_id: `${values.user_id}` }),
      ...(values?.type && { type: `${values.type}` }),
      ...(values?.number && { number: `${values.number}` }),
      ...(values?.chassis_no && {
        chassis_no: `${values.chassis_no}`,
      }),
      ...(values?.imei && { imei: `${values.imei}` }),
      page: "1",
      per_page: "25",
    };

    dispatch(getVehicleList(finalValues));
  };

  // Reset
  const resetForm = () => {
    form.resetFields();

    dispatch(
      getVehicleList({
        page: "1",
        per_page: "25",
      })
    );
  };

  // URL parameters
  const getCurrentParam = () => {
    const newParams = new URLSearchParams(params?.page);
    const result = {};

    for (const [key, value] of newParams.entries()) {
      result[key] = value;
    }

    return result;
  };

  const getUsers = () => {
    const myParam = getCurrentParam();

    const newParam = {
      ...myParam,
      ...form.getFieldsValue(),
    };

    dispatch(getVehicleList(newParam));
  };

  // Update table data
  useEffect(() => {
    if (VehicleData?.success) {
      setDetails({
        list: vehicles || [],
        pageLength: vehicles?.length || 1,
        currentPage: paging?.[0]?.currentpage || 1,
        totalRecords: paging?.[0]?.totalrecords || 1,
      });
    } else {
      setDetails({
        list: [],
        pageLength: 0,
        currentPage: 1,
        totalRecords: 0,
      });
    }
  }, [VehicleData, vehicles, paging]);

  useEffect(() => {
    getUsers();
  }, [params]);

  // Vendor dropdown
  useEffect(() => {
    dispatch(
      getVendorCategoryTypeDrop({
        asset_main_type_id: 5,
      })
    );
  }, [dispatch]);

  // Table columns
  const columns = [
    {
      title: t("vehicle_sr_no"),
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
    {
      title: t("vehicle_vendor_name"),
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: t("vehicle_type"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("vehicle_number"),
      dataIndex: "number",
      key: "number",
    },
    {
      title: t("vehicle_imei_number"),
      dataIndex: "imei",
      key: "imei",
    },
    {
      title: t("vehicle_chassis_number"),
      dataIndex: "chassis_no",
      key: "chassis_no",
    },
    {
      title: t("vehicle_action"),
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <div className="flex justify-between">
          <Button
            aria-label={t("vehicle_edit")}
            title={t("vehicle_edit")}
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            onClick={() => {
              navigate("/vehicle-registration", {
                state: {
                  key: "UpdateKey",
                  record,
                },
              });
            }}
          >
            <EditOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <CommonDivider
        label={t("vehicle_list")}
        compo={
          <Button
            onClick={() => navigate("/vehicle-registration")}
            className="bg-orange-300 mb-1"
          >
            {t("vehicle_add")}
          </Button>
        }
      />

      <div>
        <Collapse
          defaultActiveKey={["1"]}
          size="small"
          className="rounded-none mt-3"
          items={[
            {
              key: "1",
              label: (
                <div className="flex items-center h-full">
                  <img
                    src={search}
                    className="h-5"
                    alt={t("vehicle_search")}
                  />
                </div>
              ),
              children: (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinishForm}
                  key="form1"
                >
                  <Row gutter={[16, 0]} align="middle">
                    <Col
                      key="user_id"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={5}
                    >
                      <CustomSelect
                        name="user_id"
                        label={t("vehicle_select_vendor")}
                        placeholder={t("vehicle_select_vendor")}
                        options={VendorCatTypeDrop || []}
                      />
                    </Col>

                    <Col
                      key="type"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={5}
                    >
                      <CustomSelect
                        label={t("vehicle_type")}
                        name="type"
                        placeholder={t("vehicle_select_type")}
                        options={vehicleType || []}
                      />
                    </Col>

                    <Col
                      key="number"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={5}
                    >
                      <CustomInput
                        label={t("vehicle_number")}
                        name="number"
                        placeholder={t("vehicle_enter_number")}
                      />
                    </Col>

                    <Col
                      key="imei"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={5}
                    >
                      <CustomInput
                        label={t("vehicle_imei_number")}
                        name="imei"
                        placeholder={t("vehicle_enter_imei")}
                      />
                    </Col>

                    <Col
                      key="chassis_no"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={5}
                    >
                      <CustomInput
                        label={t("vehicle_chassis_number")}
                        name="chassis_no"
                        placeholder={t("vehicle_enter_chassis")}
                      />
                    </Col>

                    <Col xs={24}>
                      <div className="flex justify-start my-4 space-x-2 ml-3">
                        <Button
                          loading={loading}
                          htmlType="submit"
                          className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                        >
                          {t("vehicle_search")}
                        </Button>

                        <Button
                          loading={loading}
                          className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                          onClick={resetForm}
                        >
                          {t("vehicle_reset")}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              ),
            },
          ]}
        />
      </div>

      <CommonTable
        loading={loading}
        uri="vehicle"
        columns={columns}
        details={details}
        scroll={{ x: 1200, y: 400 }}
        tableSubheading={{
          [t("vehicle_total_records")]: details?.totalRecords || 0,
        }}
      />
    </div>
  );
};

export default VehicleList;
