
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router";
import dayjs from "dayjs";
import moment from "moment";
import { Collapse, Form, Button, message } from "antd";

import VehicleSelectors from "../../register/vehicle/Slice/vehicleSelector";
import VendorSelectors from "../VendorwiseReports/vendorSelectors";
import { getVehicleList } from "../../register/vehicle/Slice/vehicleSlice";
import { getVendorCategoryTypeDrop } from "../VendorwiseReports/vendorslice";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import CustomTable from "../../commonComponents/CustomTable";
import {
  getFormatedNumber,
  getValueLabel,
  vehicleType,
} from "../../constant/const";
import search from "../../assets/Dashboard/icon-search.png";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getPdfExcelData } from "../../register/asset/AssetsSlice";
import URLS from "../../urils/URLS";
import { exportToExcel } from "../ExportExcelFuntion";
import { ExportPdfFunction } from "../ExportPdfFunction";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";

const VehicleReports = ({
  modalName = "Vehicle Report",
  showPdf = true,
}) => {
  const [dict, lang] = useOutletContext();

  // Translation helper: follows the existing project dictionary pattern.
  const t = (key, fallback) =>
    dict?.[key]?.[lang] ??
    dict?.[key]?.en ??
    fallback ??
    key;

  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { VehicleData, loading } = VehicleSelectors();
  const { paging, vehicles } = VehicleData?.data || {};

  const { VendorCatTypeDrop } = VendorSelectors();
  const { SectorListDrop } = VendorSectorSelectors();

  // Read current form values when needed.
  const getCurrentFormValues = () => form.getFieldsValue();

  const getFormattedDate = (date) =>
    date ? moment(new Date(date)).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");

  // Search filters
  const onFinishForm = (values) => {
    const hasSearchValue = Object.values(values).some(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== ""
    );

    if (!hasSearchValue) {
      message.error(
        t(
          "vehicle_select_search_field",
          "Please select or enter at least one search field"
        )
      );
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
      ...(values?.sector_id && { sector_id: values.sector_id }),
      date: getFormattedDate(values?.date),
      page: "1",
      per_page: "25",
    };

    dispatch(getVehicleList(finalValues));
  };

  // Reset filters
  const resetForm = () => {
    const newDate = dayjs().format("YYYY-MM-DD");

    form.resetFields();
    form.setFieldsValue({
      date: dayjs(newDate, "YYYY-MM-DD"),
    });

    dispatch(
      getVehicleList({
        page: "1",
        per_page: "25",
        date: moment().format("YYYY-MM-DD"),
      })
    );
  };

  // Pagination
  const getUsers = (dataObj = {}) => {
    const values = getCurrentFormValues();

    const newParam = {
      page: String(dataObj?.page || "1"),
      per_page: String(dataObj?.size || "25"),
      ...(values?.user_id && { user_id: values.user_id }),
      ...(values?.type && { type: values.type }),
      ...(values?.number && { number: values.number }),
      ...(values?.chassis_no && { chassis_no: values.chassis_no }),
      ...(values?.imei && { imei: values.imei }),
      ...(values?.sector_id && { sector_id: values.sector_id }),
      date: getFormattedDate(values?.date),
    };

    dispatch(getVehicleList(newParam));
  };

  // Update table data
  useEffect(() => {
    if (VehicleData?.success) {
      const currentPaging = paging?.[0] || {};

      setDetails({
        list: vehicles || [],
        pageLength: vehicles?.length || 0,
        currentPage: currentPaging?.currentpage || 1,
        totalRecords: currentPaging?.totalrecords || 0,
      });
    } else if (VehicleData) {
      setDetails({
        list: [],
        pageLength: 0,
        currentPage: 1,
        totalRecords: 0,
      });
    }
  }, [VehicleData, vehicles, paging]);

  // Initial load and dropdown data
  useEffect(() => {
    const newDate = dayjs().format("YYYY-MM-DD");

    form.setFieldsValue({
      date: dayjs(newDate, "YYYY-MM-DD"),
    });

    dispatch(
      getVehicleList({
        page: "1",
        per_page: "25",
        date: moment().format("YYYY-MM-DD"),
      })
    );

    dispatch(
      getVendorCategoryTypeDrop({
        asset_main_type_id: 5,
      })
    );

    dispatch(getSectorsList());
  }, [dispatch, form]);

  // Export file names
  const values = getCurrentFormValues();

  const fileName = t("vehicle_report", "Vehicle Report");
  const vehicleTypeFileName = values?.type;

  const vendorFileName = getValueLabel(
    values?.user_id,
    VendorCatTypeDrop,
    undefined
  );

  const sectorFileName = getValueLabel(
    values?.sector_id,
    SectorListDrop,
    undefined
  );

  const fileDateName = values?.date
    ? dayjs(values.date).format("DD-MMM-YYYY")
    : dayjs().format("DD-MMM-YYYY");

  const fileNameParts = [
    vendorFileName,
    sectorFileName,
    vehicleTypeFileName,
    fileDateName,
  ].filter(Boolean);

  const finalFileName = fileNameParts.length
    ? `${fileName}-${fileNameParts.join(" - ")}`
    : fileName;

  // Vehicle table columns
  const vehicleColumns = useMemo(
    () => [
      {
        title: t("vehicle_vendor_name", "Vendor Name"),
        dataIndex: "user_name",
        key: "user_name",
      },
      {
        title: t("vehicle_type", "Vehicle Type"),
        dataIndex: "type",
        key: "type",
      },
      {
        title: t("vehicle_number", "Vehicle Number"),
        dataIndex: "number",
        key: "number",
      },
      {
        title: t("vehicle_imei_number", "IMEI Number"),
        dataIndex: "imei",
        key: "imei",
      },
      {
        title: t("vehicle_chassis_number", "Chassis Number"),
        dataIndex: "chassis_no",
        key: "chassis_no",
      },
      {
        title: t("vehicle_sector", "Sector"),
        dataIndex: "sector_id",
        key: "sector_id",
        render: (text) =>
          text
            ? getValueLabel(
                text,
                SectorListDrop,
                t("vehicle_sector", "Sector")
              )
            : "-",
      },
      {
        title: t("vehicle_routes", "Routes"),
        dataIndex: "route_name",
        key: "route_name",
        render: (text) => text || "-",
      },
      {
        title: t("vehicle_runnable_km", "Runnable (Kilometer)"),
        dataIndex: "distance_run",
        key: "distance_run",
        render: (text) => (text ? `${text} Km` : "0 Km"),
      },
    ],
    [lang, dict, SectorListDrop]
  );

  // PDF column headings
  const pdfHeader = useMemo(
    () => [
      t("vehicle_sr_no", "Sr No"),
      ...(values?.user_id
        ? []
        : [t("vehicle_vendor_name", "Vendor Name")]),
      ...(values?.type
        ? []
        : [t("vehicle_type", "Vehicle Type")]),
      t("vehicle_number", "Vehicle Number"),
      t("vehicle_imei_number", "IMEI Number"),
      t("vehicle_chassis_number", "Chassis Number"),
      ...(values?.sector_id
        ? []
        : [t("vehicle_sector_name", "Sector Name")]),
      t("vehicle_routes", "Routes"),
      t("vehicle_kilometer", "Kilometer"),
    ],
    [values, lang, dict]
  );

  // Download PDF / Excel
  const exportToFile = async (isExcel) => {
    const currentValues = getCurrentFormValues();

    const param = {
      page: "1",
      per_page: "5000",
      ...(currentValues?.user_id && {
        user_id: currentValues.user_id,
      }),
      ...(currentValues?.type && {
        type: currentValues.type,
      }),
      ...(currentValues?.number && {
        number: currentValues.number,
      }),
      ...(currentValues?.imei && {
        imei: currentValues.imei,
      }),
      ...(currentValues?.sector_id && {
        sector_id: currentValues.sector_id,
      }),
      ...(currentValues?.chassis_no && {
        chassis_no: currentValues.chassis_no,
      }),
      date: getFormattedDate(currentValues?.date),
    };

    try {
      const url = URLS?.vehicles?.path;
      const res = await dispatch(getPdfExcelData(url, param));

      if (!res?.data?.vehicles) {
        throw new Error("No vehicles found in the response data.");
      }

      const excelData = isExcel
        ? res.data.vehicles.map((data, index) => ({
            [t("vehicle_sr_no", "Sr No")]: index + 1,
            ...(!currentValues?.user_id && {
              [t("vehicle_vendor_name", "Vendor Name")]:
                data?.user_name || "",
            }),
            ...(!currentValues?.type && {
              [t("vehicle_type", "Vehicle Type")]: data?.type || "",
            }),
            [t("vehicle_number", "Vehicle Number")]:
              data?.number || "",
            [t("vehicle_imei_number", "IMEI Number")]:
              data?.imei || "",
            [t("vehicle_chassis_number", "Chassis Number")]:
              data?.chassis_no || "",
            ...(!currentValues?.sector_id && {
              [t("vehicle_sector_name", "Sector Name")]:
                getValueLabel(
                  data?.sector_id,
                  SectorListDrop,
                  t("vehicle_sector", "Sector")
                ) || "",
            }),
            [t("vehicle_routes", "Routes")]:
              data?.route_name || "-",
            [t("vehicle_kilometer", "Kilometer")]:
              data?.distance_run || "0 Km",
          }))
        : [];

      const pdfData = !isExcel
        ? res.data.vehicles.map((data, index) => [
            index + 1,
            ...(!currentValues?.user_id
              ? [data?.user_name || ""]
              : []),
            ...(!currentValues?.type ? [data?.type || ""] : []),
            data?.number || "",
            data?.imei || "",
            data?.chassis_no || "",
            ...(!currentValues?.sector_id
              ? [
                  getValueLabel(
                    data?.sector_id,
                    SectorListDrop,
                    t("vehicle_sector", "Sector")
                  ) || "",
                ]
              : []),
            data?.route_name || "-",
            data?.distance_run || "0 Km",
          ])
        : [];

      if (isExcel) {
        exportToExcel(excelData, finalFileName);
      } else {
        ExportPdfFunction(
          finalFileName,
          finalFileName,
          pdfHeader,
          pdfData,
          true,
          false
        );
      }
    } catch (error) {
      message.error(
        `${t("vehicle_export_error", "Export error")}: ${
          error?.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <>
      <CommonDivider
        className="ml-10-"
        label={t("vehicle_report", modalName)}
      />

      <div className="flex justify-end gap-2 font-semibold">
        {showPdf && (
          <>
            <Button
              type="primary"
              onClick={() => exportToFile(false)}
            >
              {t("download_pdf", "Download PDF")}
            </Button>

            <Button
              type="primary"
              onClick={() => exportToFile(true)}
            >
              {t("download_excel", "Download Excel")}
            </Button>
          </>
        )}
      </div>

      <div className="rounded-md w-full">
        <div className="mx-4 mb-6">
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
                      alt={t("search", "Search")}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4">
                      <CustomSelect
                        name="user_id"
                        label={t("select_vendor", "Select Vendor")}
                        placeholder={t("select_vendor", "Select Vendor")}
                        options={VendorCatTypeDrop || []}
                      />

                      <CustomSelect
                        label={t("vehicle_type", "Vehicle Type")}
                        name="type"
                        placeholder={t(
                          "vehicle_select_type",
                          "Select Vehicle Type"
                        )}
                        options={vehicleType || []}
                      />

                      <CustomInput
                        label={t("vehicle_number", "Vehicle Number")}
                        name="number"
                        placeholder={t(
                          "vehicle_number_placeholder",
                          "e.g. AA00AA0000"
                        )}
                        maxLength={10}
                      />

                      <CustomInput
                        label={t("vehicle_imei_number", "IMEI Number")}
                        name="imei"
                        placeholder={t(
                          "vehicle_enter_imei",
                          "Enter IMEI Number"
                        )}
                      />

                      <CustomInput
                        label={t("vehicle_chassis_number", "Chassis Number")}
                        name="chassis_no"
                        placeholder={t(
                          "vehicle_enter_chassis",
                          "Enter Chassis Number"
                        )}
                      />

                      <CustomSelect
                        name="sector_id"
                        label={t("select_sector", "Select Sector")}
                        placeholder={t("select_sector", "Select Sector")}
                        options={SectorListDrop || []}
                      />

                      <CustomDatepicker
                        name="date"
                        label={t("date", "Date")}
                        className="w-full"
                        placeholder={t("date", "Date")}
                      />

                      <div className="flex justify-start my-4 space-x-2 ml-3">
                        <Button
                          loading={loading}
                          htmlType="submit"
                          className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                        >
                          {t("search", "Search")}
                        </Button>

                        <Button
                          loading={loading}
                          className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                          onClick={resetForm}
                        >
                          {t("reset", "Reset")}
                        </Button>
                      </div>
                    </div>
                  </Form>
                ),
              },
            ]}
          />

          <CustomTable
            loading={loading}
            columns={vehicleColumns}
            bordered
            dataSource={details}
            scroll={{ x: 100, y: 400 }}
            tableSubheading={{
              [t("vehicle_total_records", "Total Records")]:
                getFormatedNumber(details?.totalRecords) || 0,
            }}
            onPageChange={(page, size) => {
              getUsers({ page, size });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default VehicleReports;
