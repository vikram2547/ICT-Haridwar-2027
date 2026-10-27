import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Collapse, Form, Button, Row, Col, message } from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";

import { getMonitoringDailyReport } from "./monitoringSlice";
import search from "../assets/Dashboard/icon-search.png";
import { dateDayOptions, getValueLabel } from "../constant/const";
import CommonDivider from "../commonComponents/CommonDivider";
import CustomSelect from "../commonComponents/CustomSelect";
import CustomDatepicker from "../commonComponents/CustomDatepicker";
import MonitoringSelector from "./monitoringSelector";
import { revertMonitoringSlice } from "../Redux/action";
import { MonitoringDailyReportPdf } from "./DailyReport";
import URLS from "../urils/URLS";
import VendorSelectors from "../Reports/VendorwiseReports/vendorSelectors";
import { getVendorCategoryTypeDrop } from "../Reports/VendorwiseReports/vendorslice";

const MonitoringDailyReport = () => {
  const outletContext = useOutletContext() || [];
  const [dict, lang] = outletContext;

  const t = (key, fallback) =>
    dict?.[key]?.[lang] ?? dict?.[key]?.en ?? fallback ?? key;

  const [startDate, setStartDate] = useState(null);
  const [showDateRange, setShowDateRange] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [filesName, setFilesName] = useState(null);

  const { DailyReport, loading } = MonitoringSelector();
  const { VendorCatTypeDrop } = VendorSelectors();

  const userRoleId = localStorage.getItem("role_id");
  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Translate the date options without changing their values.
  const translatedDateOptions = (dateDayOptions || []).map((option) => {
    const optionValue = option.value ?? option.label;

    const translatedLabel = {
      Today: t("monitoring_report_today", "Today"),
      "Date Range": t("monitoring_report_date_range", "Date Range"),
      date: t("monitoring_report_date", "Date"),
    }[optionValue];

    return {
      ...option,
      label: translatedLabel ?? option.label,
    };
  });

  // Submit report filters.
  const onFinishForm = async (values) => {
    const finalData = {
      vendor_id: userRoleId === "8" ? userId : values?.vendor_id,
    };

    const name = getValueLabel(
      values?.vendor_id,
      VendorCatTypeDrop,
      ""
    );

    if (values?.form_date || values?.to_date) {
      const dayjsObjectFrom = dayjs(values?.form_date?.$d);
      const dayjsObjectTo = dayjs(values?.to_date?.$d);

      const start = dayjsObjectFrom.format("YYYY-MM-DD");
      const end = dayjsObjectTo.format("YYYY-MM-DD");

      finalData.form_date = values?.form_date ? start : end;
      finalData.to_date = values?.to_date ? end : start;
    } else if (values?.date_format === "Today") {
      finalData.form_date = moment().format("YYYY-MM-DD");
      finalData.to_date = moment().format("YYYY-MM-DD");
    } else if (values?.date_format === "date") {
      finalData.form_date = dayjs(values?.date).format("YYYY-MM-DD");
      finalData.to_date = dayjs(values?.date).format("YYYY-MM-DD");
    }

    setFilesName(name);

    const url = URLS?.monitoringDailyReport?.path;
    dispatch(getMonitoringDailyReport(url, finalData));
  };

  // Reset form and report state.
  const resetForm = () => {
    form.resetFields();
    setShowDateRange(false);
    setShowDate(false);
    setStartDate(null);
    setFilesName(null);
    setValue();
    dispatch(revertMonitoringSlice());
  };

  const handleDateSelect = (value) => {
    if (value === "Date Range") {
      setShowDateRange(true);
      setShowDate(false);
    } else if (value === "date") {
      setShowDate(true);
      setShowDateRange(false);
      form.setFieldsValue({
        date: null,
        form_date: null,
        to_date: null,
      });
    } else {
      form.setFieldsValue({
        form_date: null,
        to_date: null,
        date: null,
      });
      setShowDateRange(false);
      setShowDate(false);
    }
  };

  const disabledDate = (current) => {
    if (!current || !startDate) {
      return false;
    }

    const maxDate = moment(startDate).clone().add(8, "days");

    return (
      current.isBefore(startDate, "day") ||
      current.isAfter(maxDate, "day")
    );
  };

  const setValue = () => {
    form.setFieldValue("date_format", "Today");
  };

  useEffect(() => {
    if (DailyReport?.success) {
      MonitoringDailyReportPdf(
        DailyReport?.data,
        t("monitoring_report_pdf_title", "Daily Monitoring Report"),
        filesName
          ? `${filesName} - ${t(
              "monitoring_report_pdf_title",
              "Daily Monitoring Report"
            )}`
          : t("monitoring_report_pdf_title", "Daily Monitoring Report"),
        false,
        false
      );

      resetForm();
    } else if (DailyReport) {
      message.error(
        t("monitoring_report_not_available", "Report Not Available")
      );
      resetForm();
    }
  }, [DailyReport]);

  useEffect(() => {
    if (userRoleId !== "8") {
      dispatch(
        getVendorCategoryTypeDrop({
          asset_main_type_id: 1,
        })
      );
    }

    setValue();
  }, []);

  return (
    <>
      <CommonDivider
        label={t("monitoring_daily_report_title", "Daily Monitoring Report")}
      />

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
                  alt={t("monitoring_report_search_icon", "Search Icon")}
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
                <Row gutter={[16, 16]} align="middle">
                  {userRoleId !== "8" && (
                    <Col
                      key="vendor_id"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={5}
                    >
                      <CustomSelect
                        name="vendor_id"
                        label={t("monitoring_report_select_vendor", "Select Vendor")}
                        placeholder={t(
                          "monitoring_report_select_vendor",
                          "Select Vendor"
                        )}
                        options={VendorCatTypeDrop || []}
                        rules={[
                          {
                            required: true,
                            message: t(
                              "monitoring_report_vendor_required",
                              "Please select Vendor!"
                            ),
                          },
                        ]}
                      />
                    </Col>
                  )}

                  <Col
                    key="date_format"
                    xs={24}
                    sm={12}
                    md={6}
                    lg={5}
                  >
                    <CustomSelect
                      name="date_format"
                      label={t(
                        "monitoring_report_select_date_type",
                        "Select Date Type"
                      )}
                      placeholder={t(
                        "monitoring_report_select_date_type",
                        "Select Date Type"
                      )}
                      onSelect={handleDateSelect}
                      options={translatedDateOptions}
                      rules={[
                        {
                          required: true,
                          message: t(
                            "monitoring_report_date_type_required",
                            "Please select Date Type!"
                          ),
                        },
                      ]}
                    />
                  </Col>

                  {showDateRange && (
                    <>
                      <Col
                        key="form_date"
                        xs={24}
                        sm={12}
                        md={6}
                        lg={5}
                      >
                        <CustomDatepicker
                          name="form_date"
                          label={t("monitoring_report_from_date", "From Date")}
                          className="w-full"
                          placeholder={t(
                            "monitoring_report_from_date",
                            "From Date"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t(
                                "monitoring_report_start_date_required",
                                "Please select a start date!"
                              ),
                            },
                          ]}
                          onChange={(date) => {
                            const startDateValue = dayjs(date?.$d);
                            const endDateValue = dayjs(
                              form.getFieldValue("to_date")?.$d
                            );

                            if (
                              endDateValue.isValid() &&
                              startDateValue.isAfter(endDateValue)
                            ) {
                              form.setFieldValue("to_date", null);
                            }

                            const daysDifference = endDateValue.diff(
                              startDateValue,
                              "days"
                            );

                            if (
                              endDateValue.isValid() &&
                              daysDifference > 7
                            ) {
                              form.setFieldValue("to_date", null);
                            }

                            setStartDate(
                              startDateValue.format("YYYY-MM-DD")
                            );
                          }}
                        />
                      </Col>

                      <Col
                        key="to_date"
                        xs={24}
                        sm={12}
                        md={6}
                        lg={5}
                      >
                        <CustomDatepicker
                          name="to_date"
                          label={t("monitoring_report_to_date", "To Date")}
                          className="w-full"
                          placeholder={t(
                            "monitoring_report_to_date",
                            "To Date"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t(
                                "monitoring_report_end_date_required",
                                "Please select an end date!"
                              ),
                            },
                          ]}
                          disabledDate={disabledDate}
                        />
                      </Col>
                    </>
                  )}

                  {showDate && (
                    <Col
                      key="date"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={5}
                    >
                      <CustomDatepicker
                        name="date"
                        label={t("monitoring_report_date", "Date")}
                        className="w-full"
                        placeholder={t("monitoring_report_date", "Date")}
                        rules={[
                          {
                            required: true,
                            message: t(
                              "monitoring_report_date_required",
                              "Please select a date!"
                            ),
                          },
                        ]}
                      />
                    </Col>
                  )}

                  <Col xs={24}>
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
                  </Col>
                </Row>
              </Form>
            ),
          },
        ]}
      />
    </>
  );
};

export default MonitoringDailyReport;