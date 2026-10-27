
import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router";
import { useDispatch } from "react-redux";
import {
  Collapse,
  Form,
  Button,
  notification,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";

import { getMonitoringAgent } from "./monitoringSlice";
import search from "../assets/Dashboard/icon-search.png";
import { generateSearchQuery } from "../urils/getSearchQuery";
import {
  dateOptions,
  getFormatedNumber,
  getValueLabel,
  parkingType,
} from "../constant/const";
import URLS from "../urils/URLS";
import { getData } from "../Fetch/Axios";
import CommonDivider from "../commonComponents/CommonDivider";
import MonitoringSelector from "./monitoringSelector";
import CustomSelect from "../commonComponents/CustomSelect";
import CustomInput from "../commonComponents/CustomInput";
import CustomDatepicker from "../commonComponents/CustomDatepicker";
import { exportToExcel } from "../Reports/ExportExcelFuntion";
import { getPdfExcelData } from "../register/asset/AssetsSlice";
import { MonitoringPdfNew } from "./MonitoringPdf";
import { getVendorCategoryTypeDrop } from "../Reports/VendorwiseReports/vendorslice";
import VendorSelectors from "../Reports/VendorwiseReports/vendorSelectors";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../register/AssetType/AssetTypeSlice";
import AssetTypeSelectors from "../register/AssetType/assetTypeSelectors";
import CustomTable from "../commonComponents/CustomTable";

const Monitoring = () => {
  const [dict, lang] = useOutletContext();

  const t = (key, fallback) =>
    dict?.[key]?.[lang] ?? dict?.[key]?.en ?? fallback ?? key;

  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState();
  const [showDateRange, setShowDateRange] = useState(false);
  const [filesName, setFilesName] = useState(null);

  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalUnit: 0,
  });

  const [pdfTitleData, setPdfTitleData] = useState({
    category: "Combined",
    type: "Combined",
    date: "Combined",
  });

  const checkQuestions = "Is the toilet clean?";

  const { monitoringAgentDrop } = MonitoringSelector();
  const { VendorCatTypeDrop } = VendorSelectors();
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors();

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();

  const [api, contextHolder] = notification.useNotification({
    top: 100,
  });

  const key = location.state?.key;
  const record = location.state?.record;

  const userRoleId = localStorage.getItem("role_id");
  const UserId = localStorage.getItem("userId");

  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString
    ? JSON.parse(sessionDataString)
    : null;

  const userCategoryId =
    sessionData?.allocatedmaintype?.[0]?.asset_main_type_id;

  const IsVendor = Number(userRoleId) === 8;

  const categoryType = form.getFieldValue("asset_main_type_id");
  const asset_type_id_name = form.getFieldValue("asset_type_id");
  const vendor_id_name = form.getFieldValue("vendor_id");

  const catTypeName = getValueLabel(
    categoryType,
    AssetMainTypeDrop,
    null
  );

  const assetTypeName = getValueLabel(
    asset_type_id_name,
    AssetTypeDrop,
    null
  );

  const vendorName = getValueLabel(
    vendor_id_name,
    VendorCatTypeDrop,
    null
  );

  const ParkingTypeName = getValueLabel(
    formValue?.parking_type,
    parkingType,
    null
  );

  // Translate known static dropdown labels while preserving values.
  const translateOptions = (options = [], labelMap = {}) =>
    options.map((option) => {
      const originalLabel =
        typeof option.label === "string"
          ? option.label
          : option.label;

      if (typeof originalLabel !== "string") {
        return option;
      }

      return {
        ...option,
        label: labelMap[originalLabel]
          ? t(labelMap[originalLabel].key, labelMap[originalLabel].fallback)
          : originalLabel,
      };
    });

  const translatedDateOptions = translateOptions(dateOptions, {
    Today: { key: "monitoring_today", fallback: "Today" },
    "Current Month": {
      key: "monitoring_current_month",
      fallback: "Current Month",
    },
    "Date Range": {
      key: "monitoring_date_range",
      fallback: "Date Range",
    },
  });

  const translatedParkingTypes = translateOptions(parkingType, {
    "Parking Type": {
      key: "monitoring_parking_type",
      fallback: "Parking Type",
    },
    "Parking Area": {
      key: "monitoring_parking_area",
      fallback: "Parking Area",
    },
    "Public Toilet": {
      key: "monitoring_public_toilet",
      fallback: "Public Toilet",
    },
  });

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: t("monitoring_note", "Note"),
      duration: 7,
      description: t(
        "monitoring_search_required",
        "Please enter some information to perform the search."
      ),
    });
  };

  // Handle category selection
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
      vendor_id: null,
    });

    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url));

    if (!IsVendor && value) {
      dispatch(
        getVendorCategoryTypeDrop({
          asset_main_type_id: value,
        })
      );
    }
  };

  // Handle asset type selection
  const handleTypeSelect = (value) => {
    form.setFieldsValue({
      vendor_id: null,
    });

    if (!IsVendor && value) {
      dispatch(
        getVendorCategoryTypeDrop({
          asset_main_type_id: formValue?.asset_main_type_id,
          asset_type_id: value,
        })
      );
    }
  };

  // Search form submission
  const onFinishForm = (values) => {
    let pdfDateOpt = null;

    if (values?.date_format === "Today") {
      pdfDateOpt = moment().format("DD-MMM-YYYY");
    } else if (values?.date_format === "Current Month") {
      const start = moment()
        .startOf("month")
        .format("DD-MMM-YYYY");

      const end = moment()
        .endOf("month")
        .format("DD-MMM-YYYY");

      pdfDateOpt = `${start} to ${end}`;
    } else if (values?.date_format === "Date Range") {
      const start = dayjs(values?.form_date).format("DD-MMM-YYYY");
      const end = dayjs(values?.to_date).format("DD-MMM-YYYY");

      pdfDateOpt = `${start} to ${end}`;
    }

    setPdfTitleData({
      category: values?.asset_main_type_id
        ? catTypeName
        : "Combined",
      type: values?.asset_type_id
        ? assetTypeName
        : "Combined",
      date: pdfDateOpt || "Combined",
    });

    const finalData = { ...values };

    if (values?.form_date || values?.to_date) {
      const from = dayjs(values?.form_date);
      const to = dayjs(values?.to_date);

      const start = from.format("YYYY-MM-DD");
      const end = to.format("YYYY-MM-DD");

      finalData.form_date = values?.form_date ? start : end;
      finalData.to_date = values?.to_date ? end : start;
    }

    const searchParams = generateSearchQuery(finalData);

    if (searchParams === "&") {
      openNotificationWithIcon("info");
    }

    setSearchQuery(searchParams);
  };

  // Reset form
  const resetForm = () => {
    form.resetFields();
    setSearchQuery("&");
    setShowDateRange(false);
    setFilesName(null);
    setStartDate(null);
  };

  const handleDateSelect = (value) => {
    if (value === "Date Range") {
      setShowDateRange(true);
    } else {
      form.setFieldsValue({
        form_date: null,
        to_date: null,
      });

      setShowDateRange(false);
      setStartDate(null);
    }
  };

  const disabledDate = (current) => {
    if (!current || !startDate) return false;

    const maxDate = moment(startDate).clone().add(9, "days");

    return (
      current.isBefore(startDate, "day") ||
      current.isAfter(maxDate, "day")
    );
  };

  // Fetch monitoring records
  const getDetails = async () => {
    setLoading(true);

    try {
      let uri = URLS.monitoring.path + "?";

      if (IsVendor) {
        uri += `&vendor_id=${UserId}`;
      }

      if (params.page) {
        uri += params.page;
      }

      if (params.per_page) {
        uri += "&" + params.per_page;
      }

      if (searchQuery) {
        uri += searchQuery;
      }

      const extraHeaders = {
        "x-api-version": URLS.asset.version,
      };

      const res = await getData(uri, extraHeaders);

      if (res) {
        const data = res.data;

        const totalUnit = data?.listings?.reduce(
          (total, item) => total + Number(item?.unit_no || 0),
          0
        );

        setDetails({
          list: data?.listings || [],
          pageLength: data?.paging?.[0]?.length || 25,
          currentPage: data?.paging?.[0]?.currentpage || 1,
          totalUnit,
          totalRecords: data?.paging?.[0]?.totalrecords || 0,
        });
      }
    } catch (error) {
      message.error(
        t(
          "monitoring_fetch_error",
          "Unable to fetch monitoring records."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Report filename
  const getReportName = () => {
    let reportName = "";

    if (vendorName) {
      reportName += vendorName;
    }

    if (catTypeName) {
      reportName += reportName ? `-${catTypeName}` : catTypeName;
    }

    if (assetTypeName) {
      reportName += `(${assetTypeName})`;
    }

    if (ParkingTypeName) {
      reportName += ` ${ParkingTypeName} `;
    }

    return reportName
      ? `${reportName} - ${t(
          "monitoring_report",
          "Monitoring Report"
        )}`
      : t(
          "toilet_tentage_monitoring_report",
          "Toilet & Tentage Monitoring Report"
        );
  };

  useEffect(() => {
    setFilesName(getReportName());
  }, [
    categoryType,
    asset_type_id_name,
    vendor_id_name,
    ParkingTypeName,
    lang,
  ]);

  useEffect(() => {
    if (searchQuery) {
      getDetails();
    }
  }, [searchQuery]);

  // Pagination search
  const getUsers = (dataObj = {}) => {
    const formValues = form.getFieldsValue();

    const formattedDate = formValues?.form_date
      ? dayjs(formValues.form_date).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");

    const formattedToDate = formValues?.to_date
      ? dayjs(formValues.to_date).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");

    const newParam = {
      page: dataObj?.page || "1",
      per_page: dataObj?.size || "25",
      ...formValues,
      form_date: formattedDate,
      to_date: formattedToDate,
    };

    setSearchQuery(generateSearchQuery(newParam));
  };

  // Load a saved search record
  useEffect(() => {
    if (!record) return;

    const isDateType = record?.date_format === "Date Range";

    const fromDate = record?.form_date
      ? dayjs(record.form_date)
      : null;

    const toDate = record?.to_date
      ? dayjs(record.to_date)
      : null;

    const modifyData = {
      ...record,
      ...(isDateType && {
        form_date: fromDate?.isValid()
          ? fromDate.format("YYYY-MM-DD")
          : null,
        to_date: toDate?.isValid()
          ? toDate.format("YYYY-MM-DD")
          : null,
      }),
    };

    const modifyFormData = {
      ...record,
      ...(isDateType && {
        form_date: fromDate?.isValid() ? fromDate : null,
        to_date: toDate?.isValid() ? toDate : null,
      }),
    };

    if (isDateType) {
      setShowDateRange(true);

      if (fromDate?.isValid()) {
        setStartDate(fromDate.format("YYYY-MM-DD"));
      }
    }

    form.setFieldsValue(modifyFormData);
    setSearchQuery(generateSearchQuery(modifyData));

    if (record?.asset_main_type_id) {
      dispatch(
        getAssetTypes(
          URLS?.assetType?.path + record.asset_main_type_id
        )
      );
    }

    const paramData = {
      ...(record?.asset_main_type_id && {
        asset_main_type_id: record.asset_main_type_id,
      }),
      ...(record?.asset_type_id && {
        asset_type_id: record.asset_type_id,
      }),
    };

    dispatch(getVendorCategoryTypeDrop(paramData));

    const agentUrl = record?.created_by
      ? `${URLS?.monitoringAgent?.path}&user_id=${record.created_by}`
      : URLS?.monitoringAgent?.path;

    dispatch(getMonitoringAgent(agentUrl));
  }, [record]);

  // Initial data loading
  useEffect(() => {
    dispatch(
      getAssetMainTypes(URLS?.assetMainTypePerPage?.path)
    );

    if (!key) {
      getDetails();

      if (!IsVendor) {
        dispatch(getMonitoringAgent(URLS?.monitoringAgent?.path));
        dispatch(getVendorCategoryTypeDrop());
      } else {
        dispatch(
          getAssetTypes(
            URLS?.assetType?.path + userCategoryId
          )
        );
      }
    }
  }, []);

  // Table columns
  const columns = [
    {
      title: t("monitoring_name", "Name"),
      dataIndex: "asset_type_name",
      key: "asset_type_name",
      width: 210,
      sorter: (a, b) =>
        a?.asset_type_name?.localeCompare(b?.asset_type_name),
    },
    {
      title: t("monitoring_ptc_taf_code", "PTC / TAF Code"),
      dataIndex: "asset_code",
      key: "asset_code",
      width: 110,
      render: (text, record) =>
        text ? `${text}-${record?.unit_no}` : "",
      sorter: (a, b) => a?.asset_code - b?.asset_code,
    },
    {
      title: t("monitoring_sector_name", "Sector Name"),
      dataIndex: "sector_name",
      key: "sector_name",
      width: 110,
      sorter: (a, b) => {
        const extractNumber = (str) => {
          const match = str?.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };

        return (
          extractNumber(a?.sector_name) -
          extractNumber(b?.sector_name)
        );
      },
    },
    ...(!IsVendor
      ? [
          {
            title: t("monitoring_vendor_name", "Vendor Name"),
            dataIndex: "vendor_name",
            key: "vendor_name",
            width: 210,
            sorter: (a, b) =>
              a?.vendor_name?.localeCompare(b?.vendor_name),
          },
        ]
      : []),
    {
      title: t("monitoring_clean", "Clean"),
      dataIndex: "zero_count",
      key: "clean_status",
      width: 110,
      render: (text, record) =>
        record?.issue?.some(
          (question) => question?.question_en === checkQuestions
        )
          ? t("monitoring_unclean", "Unclean")
          : t("monitoring_clean", "Clean"),
    },
    {
      title: t("monitoring_compliant", "Compliant"),
      dataIndex: "zero_count",
      key: "compliant_status",
      width: 130,
      render: (text) =>
        text !== null && text !== undefined && text !== ""
          ? Number(text) === 0
            ? t("monitoring_compliant", "Compliant")
            : Number(text) > 7
            ? t("monitoring_not_compliant", "Not Compliant")
            : t("monitoring_partial_compliant", "Partial Compliant")
          : "",
      sorter: (a, b) =>
        (Number(a?.zero_count) || 0) -
        (Number(b?.zero_count) || 0),
    },
    {
      title: t("monitoring_date", "Date"),
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (text) =>
        text ? moment(text).format("DD-MMM-YYYY") : "",
      sorter: (a, b) =>
        moment(a?.created_at).toDate() -
        moment(b?.created_at).toDate(),
    },
    ...(!IsVendor
      ? [
          {
            title: t("monitoring_gsd_name", "GSD Name"),
            dataIndex: "agent_name",
            key: "agent_name",
            render: (text) =>
              text || t("monitoring_gsd", "GSD"),
            sorter: (a, b) =>
              a?.agent_name?.localeCompare(b?.agent_name),
          },
        ]
      : []),
    {
      title: t("monitoring_remark", "Remark"),
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: t(
        "monitoring_details_view",
        "Monitoring Details View"
      ),
      key: "action",
      fixed: "right",
      width: 150,
      render: (text, record) => (
        <div
          className="flex gap-2 text-blue-500 cursor-pointer"
          onClick={() =>
            navigate(`/monitoring-report/${record?.id}`, {
              state: {
                key: "monitoring-details",
                record: formValue,
              },
            })
          }
        >
          {t("monitoring_view", "Monitoring")}
        </div>
      ),
    },
  ];

  // PDF header
  const pdfHeader = [
    t("monitoring_sr_no", "Sr No"),
    t("monitoring_type_name", "Type Name"),
    t("monitoring_code", "Code"),
    t("monitoring_sector", "Sector"),
    t("monitoring_vendor_name", "Vendor Name"),
    t("monitoring_clean_status", "Clean Status"),
    t("monitoring_compliant_status", "Compliant Status"),
    t("monitoring_date", "Date"),
    t("monitoring_gsd_name", "GSD Name"),
  ];

  const columnPercentages = [5, 16, 9, 9, 20, 7, 9, 10, 15];

  // PDF and Excel exports
  const exportToFile = async (isExcel) => {
    try {
      let url = URLS.monitoring.path + "?page=1&per_page=5000";

      if (userRoleId === "8") {
        url += `&vendor_id=${UserId}`;
      }

      const res = await dispatch(
        getPdfExcelData(
          `${url}${searchQuery ? searchQuery : ""}`
        )
      );

      if (!res?.data?.listings) {
        throw new Error("No listings found in the response data.");
      }

      const listings = res.data.listings;

      const unitCount = listings.reduce(
        (total, item) => total + (Number(item?.unit_no) || 0),
        0
      );

      const getCleanStatus = (data) =>
        data?.issue?.some(
          (question) => question?.question_en === checkQuestions
        )
          ? t("monitoring_unclean", "Unclean")
          : t("monitoring_clean", "Clean");

      const getCompliantStatus = (value) => {
        if (value === null || value === undefined || value === "") {
          return "";
        }

        return Number(value) === 0
          ? t("monitoring_compliant", "Compliant")
          : Number(value) > 7
          ? t("monitoring_not_compliant", "Not Compliant")
          : t("monitoring_partial_compliant", "Partial Compliant");
      };

      const myexcelData = isExcel
        ? listings.map((data, index) => ({
            [t("monitoring_sr_no", "Sr")]: index + 1,
            [t("monitoring_type_name", "Asset Type Name")]:
              data?.asset_type_name,
            [t("monitoring_code", "Code")]:
              Number(data?.asset_code),
            [t("monitoring_unit", "Unit")]:
              Number(data?.unit_no),
            [t("monitoring_sector", "Sector")]:
              data?.sector_name,
            [t("monitoring_vendor_name", "Vendor Name")]:
              data?.vendor_name,
            [t("monitoring_clean_status", "Clean Status")]:
              getCleanStatus(data),
            [t("monitoring_compliant_status", "Compliant Status")]:
              getCompliantStatus(data?.zero_count),
            [t("monitoring_date", "Date")]: data?.created_at
              ? moment(data.created_at).format("DD-MMM-YYYY hh:mm A")
              : "",
            [t("monitoring_gsd_name", "GSD Name")]:
              data?.agent_name || "GSD",
          }))
        : [];

      if (isExcel) {
        exportToExcel(myexcelData, filesName, [
          {
            name: t("monitoring_total_unit", "Total Unit"),
            value: unitCount,
            colIndex: 4,
          },
        ]);
      } else {
        const pdfData = listings.map((data, index) => [
          index + 1,
          data?.asset_type_name,
          `${data?.asset_code}-${data?.unit_no}`,
          data?.sector_name,
          data?.vendor_name,
          getCleanStatus(data),
          getCompliantStatus(data?.zero_count),
          data?.created_at
            ? moment(data.created_at).format("DD-MMM-YYYY hh:mm A")
            : "",
          data?.agent_name || "GSD",
        ]);

        MonitoringPdfNew(
          t(
            "monitoring_unit_wise_report",
            "Unit wise Monitoring Report"
          ),
          filesName,
          pdfHeader,
          [
            ...pdfData,
            [
              "",
              t("monitoring_total", "Total"),
              unitCount,
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          ],
          true,
          true,
          columnPercentages,
          {
            category: t("monitoring_combined", pdfTitleData.category),
            type: t("monitoring_combined", pdfTitleData.type),
            date: pdfTitleData.date,
          }
        );
      }
    } catch (error) {
      message.error(
        `${t("monitoring_export_error", "Error occurred")}: ${
          error.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div>
      <CommonDivider
        label={t(
          "toilet_tentage_monitoring",
          "Toilet & Tentage Monitoring"
        )}
      />

      <div className="flex justify-end gap-2 font-semibold">
        <Button type="primary" onClick={() => exportToFile(false)}>
          {t("monitoring_download_pdf", "Download PDF")}
        </Button>

        <Button type="primary" onClick={() => exportToFile(true)}>
          {t("monitoring_download_excel", "Download Excel")}
        </Button>
      </div>

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
                <Row gutter={[16, 0]} align="middle">
                  {!IsVendor && (
                    <Col
                      key="asset_main_type_id"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={5}
                    >
                      <CustomSelect
                        name="asset_main_type_id"
                        label={t(
                          "monitoring_select_category",
                          "Select Category"
                        )}
                        placeholder={t(
                          "monitoring_select_category",
                          "Select Category"
                        )}
                        onSelect={handleSelect}
                        options={AssetMainTypeDrop?.slice(0, 2) || []}
                      />
                    </Col>
                  )}

                  <Col
                    key="asset_type_id"
                    xs={24}
                    sm={12}
                    md={6}
                    lg={5}
                  >
                    <CustomSelect
                      name="asset_type_id"
                      label={t("monitoring_select_type", "Select Type")}
                      placeholder={t(
                        "monitoring_select_type",
                        "Select Type"
                      )}
                      options={AssetTypeDrop || []}
                      onSelect={handleTypeSelect}
                    />
                  </Col>

                  {!IsVendor && (
                    <>
                      <Col
                        key="vendor_id"
                        xs={24}
                        sm={12}
                        md={6}
                        lg={5}
                      >
                        <CustomSelect
                          name="vendor_id"
                          label={t(
                            "monitoring_select_vendor",
                            "Select Vendor"
                          )}
                          placeholder={t(
                            "monitoring_select_vendor",
                            "Select Vendor"
                          )}
                          options={VendorCatTypeDrop || []}
                        />
                      </Col>

                      <Col
                        key="created_by"
                        xs={24}
                        sm={12}
                        md={6}
                        lg={5}
                      >
                        <CustomSelect
                          name="created_by"
                          label={t(
                            "monitoring_select_gsd",
                            "Select GSD"
                          )}
                          placeholder={t(
                            "monitoring_select_gsd",
                            "Select GSD"
                          )}
                          options={monitoringAgentDrop || []}
                          isOnSearchFind={true}
                          apiAction={getMonitoringAgent}
                          onSearchUrl={`${URLS?.monitoringAgent?.path}&keywords=`}
                        />
                      </Col>
                    </>
                  )}

                  <Col
                    key="parking_type"
                    xs={24}
                    sm={12}
                    md={6}
                    lg={5}
                  >
                    <CustomSelect
                      name="parking_type"
                      label={t(
                        "monitoring_parking_type",
                        "Parking Type"
                      )}
                      placeholder={t(
                        "monitoring_parking_type",
                        "Parking Type"
                      )}
                      options={translatedParkingTypes}
                    />
                  </Col>

                  <Col key="code" xs={24} sm={12} md={6} lg={5}>
                    <CustomInput
                      name="code"
                      label={t(
                        "monitoring_item_qr_code",
                        "Item QR Code"
                      )}
                      placeholder={t(
                        "monitoring_item_qr_code",
                        "Item QR Code"
                      )}
                    />
                  </Col>

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
                        "monitoring_select_date_type",
                        "Select Date Type"
                      )}
                      placeholder={t(
                        "monitoring_select_date_type",
                        "Select Date Type"
                      )}
                      onSelect={handleDateSelect}
                      options={translatedDateOptions}
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
                          label={t(
                            "monitoring_from_date",
                            "From Date"
                          )}
                          className="w-full"
                          placeholder={t(
                            "monitoring_from_date",
                            "From Date"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t(
                                "monitoring_start_date_required",
                                "Please select a start date!"
                              ),
                            },
                          ]}
                          onChange={(date) => {
                            const selectedStart = dayjs(date);
                            const selectedEnd = dayjs(
                              form.getFieldValue("to_date")
                            );

                            if (
                              selectedStart.isValid() &&
                              selectedEnd.isValid()
                            ) {
                              const difference = selectedEnd.diff(
                                selectedStart,
                                "days"
                              );

                              if (
                                selectedStart.isAfter(selectedEnd) ||
                                difference > 9
                              ) {
                                form.setFieldValue("to_date", null);
                              }
                            }

                            setStartDate(
                              selectedStart.isValid()
                                ? selectedStart.format("YYYY-MM-DD")
                                : null
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
                          label={t(
                            "monitoring_to_date",
                            "To Date"
                          )}
                          className="w-full"
                          placeholder={t(
                            "monitoring_to_date",
                            "To Date"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t(
                                "monitoring_end_date_required",
                                "Please select an end date!"
                              ),
                            },
                          ]}
                          disabledDate={disabledDate}
                        />
                      </Col>
                    </>
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

      {contextHolder}

      <CustomTable
        loading={loading}
        columns={columns}
        bordered
        dataSource={details || []}
        scroll={{ x: 1400, y: 400 }}
        tableSubheading={{
          [t("monitoring_total_records", "Total Records")]:
            getFormatedNumber(details?.totalRecords || 0) || 0,

          [t("monitoring_total_unit", "Total Unit")]: `${
            getFormatedNumber(details?.totalUnit || 0) || 0
          } ${t("monitoring_per_page", "per page")}`,
        }}
        onPageChange={(page, size) => {
          getUsers({
            page,
            size,
          });
        }}
      />
    </div>
  );
};

export default Monitoring;
