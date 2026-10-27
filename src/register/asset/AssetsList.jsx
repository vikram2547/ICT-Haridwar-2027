
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Modal,
  Collapse,
  Form,
  notification,
  Row,
  Col,
  message,
  Input,
} from "antd";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import moment from "moment";
import dayjs from "dayjs";

import CommonTable from "../../commonComponents/CommonTable";
import search from "../../assets/Dashboard/icon-search.png";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";
import { getPdfExcelData } from "./AssetsSlice";
import {
  deleteSupervisorSectorAllocation,
  getSectorsList,
} from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import CustomSelect from "../../commonComponents/CustomSelect";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import MonitoringSelector from "../../complaince/monitoringSelector";
import { getMonitoringAgent } from "../../complaince/monitoringSlice";
import { getAssetMainTypes, getAssetTypes } from "../AssetType/AssetTypeSlice";
import AssetTypeSelectors from "../AssetType/assetTypeSelectors";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import CoordinatesMap from "../../commonComponents/map/map";
import ShowCode from "./showCode";
import { exportToExcel } from "../../Reports/ExportExcelFuntion";
import { ExportPdfFunction } from "../../Reports/ExportPdfFunction";
import CustomInput from "../../commonComponents/CustomInput";
import { dateWeekOptions, getValueLabel } from "../../constant/const";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { asset_delete_permisssion } from "../../constant/permission";
import ParkingSelector from "../parking/parkingSelector";
import { getParkingData } from "../parking/parkingSlice";
import VendorSelectors from "../../Reports/VendorwiseReports/vendorSelectors";
import { getVendorCategoryTypeDrop } from "../../Reports/VendorwiseReports/vendorslice";
import { DICT } from "../../utils/dictionary";

const AssetsList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("&asset_main_type_id=1");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [viewDeleteModal, setViewDeleteModal] = useState(false);

  const outletContext = useOutletContext() || [];
  const contextDict = outletContext[0] || {};
  const lang =
    outletContext[1] || localStorage.getItem("lang") || "en";

  const t = (key, fallback) =>
    contextDict?.[key]?.[lang] ??
    contextDict?.[key]?.en ??
    DICT?.[key]?.[lang] ??
    DICT?.[key]?.en ??
    fallback ??
    key;

  const ImageUrl = localStorage.getItem("ImageUrl") || "";
  const userRoleId = localStorage.getItem("role_id");

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const formValue = form.getFieldsValue();
  const categoryId = form.getFieldValue("asset_main_type_id");

  const [api, contextHolder] = notification.useNotification({
    top: 100,
  });

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: t("assets_list_note", "Note"),
      duration: 7,
      description: t(
        "assets_list_search_required",
        "Please enter some information to perform the search."
      ),
    });
  };

  const { SectorListDrop } = VendorSectorSelectors();
  const { monitoringAgentDrop } = MonitoringSelector();
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors();
  const { parkingDrop } = ParkingSelector();
  const { VendorCatTypeDrop } = VendorSelectors();

  const pdfTitleData = {
    category: getValueLabel(
      formValue?.asset_main_type_id,
      AssetMainTypeDrop,
      null
    ),
    type: getValueLabel(formValue?.asset_type_id, AssetTypeDrop, null),
    vendor: getValueLabel(formValue?.vendor_id, VendorCatTypeDrop, null),
    sector: getValueLabel(formValue?.sector_id, SectorListDrop, null),
  };

  const fileDateName =
    formValue?.date_format === "Today"
      ? moment().format("DD-MMM-YYYY")
      : formValue?.date_format === "Date Range"
      ? `${dayjs(formValue?.form_date).format("DD-MMM-YYYY")} to ${dayjs(
          formValue?.to_date
        ).format("DD-MMM-YYYY")}`
      : t("assets_list_all_dates", "All Dates");

  const getReportName = () => {
    let name =
      categoryId === "2"
        ? t("assets_list_tentage_list", "Tentage List")
        : t("assets_list_toilets_list", "Toilets List");

    if (pdfTitleData?.vendor) {
      name += ` - ${pdfTitleData.vendor}`;
    }
    if (pdfTitleData?.category) {
      name += ` - ${pdfTitleData.category}`;
    }
    if (pdfTitleData?.type) {
      name += ` - ${pdfTitleData.type}`;
    }
    if (pdfTitleData?.sector) {
      name += ` - ${pdfTitleData.sector}`;
    }

    name += ` - ${fileDateName}`;
    return name;
  };

  const fileName = getReportName();

  // Handle category selection
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
      vendor_id: null,
    });

    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url));

    const paramData = {
      asset_main_type_id: value,
    };

    dispatch(getVendorCategoryTypeDrop(paramData));
  };

  // Handle asset type selection
  const handleTypeSelect = (value) => {
    form.setFieldsValue({
      vendor_id: null,
    });

    if (value) {
      const paramData = {
        asset_main_type_id: formValue?.asset_main_type_id,
        asset_type_id: value,
      };

      dispatch(getVendorCategoryTypeDrop(paramData));
    }
  };

  // Search form submission
  const onFinishForm = (values) => {
    const finalData = {
      ...values,
    };

    if (values?.form_date || values?.to_date) {
      const dayjsObjectFrom = dayjs(values?.form_date?.$d);
      const dayjsObjectTo = dayjs(values?.to_date?.$d);

      const start = dayjsObjectFrom.format("YYYY-MM-DD");
      const end = dayjsObjectTo.format("YYYY-MM-DD");

      finalData.form_date = values?.form_date ? start : end;
      finalData.to_date = values?.to_date ? end : start;
    }

    const searchParams = generateSearchQuery(finalData);

    if (searchParams === "&") {
      openNotificationWithIcon("info");
    }

    setSearchQuery(searchParams);
  };

  // Reset filters
  const resetForm = () => {
    form.resetFields();
    setSearchQuery("&asset_main_type_id=1");
    setShowDateRange(false);
    getCurrentData();
  };

  // Handle date filter selection
  const handleDateSelect = (value) => {
    if (value === "Date Range") {
      setShowDateRange(true);
    } else {
      form.setFieldsValue({
        form_date: null,
        to_date: null,
      });
      setShowDateRange(false);
    }
  };

  // Get asset list
  const getDetails = async () => {
    setLoading(true);

    try {
      let uri = URLS.assetList.path + "?";

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
        "x-api-version": URLS.assetTypes.version,
      };

      const res = await getData(uri, extraHeaders);

      if (res) {
        const data = res.data;

        setDetails({
          list: data.listings,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentpage,
          totalRecords: data.paging[0].totalrecords,
        });
      }
    } catch (error) {
      message.error(
        t("assets_list_fetch_error", "Unable to load asset records.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setViewDeleteModal(false);
  };

  // Open delete confirmation
  const handleDelete = (data) => {
    form.setFieldsValue({
      assets_id: data?.assets_id,
      asset_type_name: data?.asset_type_name,
      asset_main_type_name: data?.asset_main_type_name,
    });

    setViewDeleteModal(true);
  };

  // Delete asset
  const onFinish = async (value) => {
    const url = URLS?.deleteAssetList?.path + `/${value?.assets_id}`;

    try {
      const res = await dispatch(deleteSupervisorSectorAllocation(url));

      if (res) {
        await getDetails();

        message.success(
          `${value?.asset_main_type_name} - ${value?.asset_type_name} ${t(
            "assets_list_delete_success",
            "record deleted successfully"
          )}`
        );
      } else {
        message.error(
          t(
            "assets_list_delete_error",
            "Something went wrong! Please try again."
          )
        );
      }
    } catch (error) {
      message.error(
        t(
          "assets_list_delete_error",
          "Something went wrong! Please try again."
        )
      );
    }

    setViewDeleteModal(false);
  };

  useEffect(() => {
    getDetails();
  }, [params, searchQuery]);

  const getCurrentData = () => {
    form.setFieldValue("asset_main_type_id", "1");

    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl));

    handleSelect("1");
  };

  useEffect(() => {
    getCurrentData();

    const urls = URLS?.monitoringAgent?.path;
    dispatch(getMonitoringAgent(urls));
    dispatch(getSectorsList());

    const url = URLS?.parking?.path;
    dispatch(getParkingData(url));
  }, []);

  // Disable dates outside the allowed range
  const disabledDate = (current) => {
    if (!current || !startDate) {
      return false;
    }

    const maxDate = moment(startDate).clone().add(29, "days");

    return (
      current.isBefore(startDate, "day") ||
      current.isAfter(maxDate, "day")
    );
  };

  // Table columns
  const columns = [
    {
      title: t("assets_list_category", "Category"),
      dataIndex: "asset_main_type_name",
      key: "asset_main_type_name",
      width: 100,
    },
    {
      title: t("assets_list_type", "Type"),
      dataIndex: "asset_type_name",
      key: "asset_type_name",
      width: 150,
    },
    {
      title: t("assets_list_vendor_name", "Vendor Name"),
      dataIndex: "vendor_name",
      key: "vendor_name",
      width: 140,
    },
    {
      title: t("assets_list_gsd_name", "GSD Name"),
      dataIndex: "agent_name",
      key: "agent_name",
      render: (text) => text || t("assets_list_gsd", "GSD"),
      width: 120,
    },
    {
      title: t("assets_list_gsd_phone", "GSD Phone"),
      dataIndex: "agent_phone",
      key: "agent_phone",
      width: 120,
    },
    ...(categoryId === "2"
      ? [
          {
            title: t("assets_list_sector_name", "Sector Name"),
            dataIndex: "sector_name",
            key: "sector_name",
            width: 80,
          },
          {
            title: t("assets_list_sanstha_name", "Sanstha Name"),
            dataIndex: "sanstha_name_hi",
            key: "sanstha_name_hi",
            render: (text) => text || "",
            width: 140,
          },
        ]
      : [
          {
            title: t("assets_list_sector_parking", "Sector / Parking"),
            dataIndex: "sector_name",
            key: "sector_name",
            render: (text, record) =>
              text || record?.parking_name || "",
            width: 130,
          },
        ]),
    {
      title: t("assets_list_photo", "Photo"),
      width: 100,
      render: (text, record) =>
        record.photo ? (
          <Image
            width={60}
            height={60}
            src={ImageUrl + record.photo}
            alt={t("assets_list_photo_alt", "Asset Photo")}
          />
        ) : (
          t("assets_list_no_image", "No Image")
        ),
      key: "photo",
    },
    {
      title: t("assets_list_code", "Code"),
      dataIndex: "code",
      key: "code",
      render: (text, record) => (
        <ShowCode
          showData={`${text}-${record?.unit}`}
          tableData={record?.units}
        />
      ),
      width: 80,
    },
    {
      title: t("assets_list_location", "Location"),
      render: (text, record) =>
        record?.longitude && record?.latitude ? (
          <CoordinatesMap
            coordinates={[record.longitude, record.latitude]}
            showLocation={false}
          />
        ) : (
          t("assets_list_na", "N/A")
        ),
      width: 100,
    },
    {
      title: t("assets_list_registered_at", "Registered At"),
      dataIndex: "tagged_at",
      key: "tagged_at",
      render: (text) =>
        text ? moment(text).format("DD-MMM-YYYY hh:mm A") : "",
      width: 130,
    },
    ...(asset_delete_permisssion?.includes(userRoleId)
      ? [
          {
            title: t("assets_list_action", "Action"),
            dataIndex: "action",
            key: "action",
            fixed: "right",
            width: 105,
            render: (text, record) => (
              <div className="flex justify-between">
                <Button
                  aria-label={t("assets_list_edit", "Edit")}
                  title={t("assets_list_edit", "Edit")}
                  className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
                  onClick={() => {
                    navigate("/asset-registration-form", {
                      state: {
                        key: "UpdateKey",
                        record,
                      },
                    });
                  }}
                >
                  <EditOutlined />
                </Button>

                <Button
                  aria-label={t("assets_list_delete", "Delete")}
                  title={t("assets_list_delete", "Delete")}
                  className="bg-red-100 border-red-500 focus:ring-red-500 hover:bg-red-200 rounded-full"
                  onClick={() => handleDelete(record)}
                >
                  <DeleteOutlined />
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  // PDF column headings
  const pdfHeader = [
    t("assets_list_sr_no", "Sr No"),
    ...(formValue?.asset_type_id
      ? []
      : categoryId === "2"
      ? [t("assets_list_tentage_type", "Tentage Type")]
      : [t("assets_list_toilets_type", "Toilets Type")]),
    ...(formValue?.vendor_id
      ? []
      : [t("assets_list_vendor_name", "Vendor Name")]),
    t("assets_list_gsd_name", "GSD Name"),
    t("assets_list_gsd_phone", "GSD Phone"),
    ...(formValue?.asset_main_type_id === "1"
      ? [t("assets_list_sector_parking", "Sector / Parking")]
      : []),
    ...(formValue?.asset_main_type_id === "2"
      ? [t("assets_list_sector_name", "Sector")]
      : []),
    ...(formValue?.asset_main_type_id === "2"
      ? [t("assets_list_sanstha_name", "Sanstha")]
      : []),
    t("assets_list_code", "Code"),
    t("assets_list_unit", "Unit"),
    t("assets_list_register_date", "Register Date"),
  ];

  // Export PDF or Excel
  const exportToFile = async (isExcel) => {
    try {
      const url = URLS.assetListExport.path;
      const finalValues = {
        ...form.getFieldsValue(),
      };

      if (finalValues?.form_date || finalValues?.to_date) {
        const dayjsObjectFrom = dayjs(finalValues?.form_date?.$d);
        const dayjsObjectTo = dayjs(finalValues?.to_date?.$d);

        const start = dayjsObjectFrom.format("YYYY-MM-DD");
        const end = dayjsObjectTo.format("YYYY-MM-DD");

        finalValues.form_date = finalValues?.form_date ? start : end;
        finalValues.to_date = finalValues?.to_date ? end : start;
      }

      const res = await dispatch(getPdfExcelData(url, finalValues));

      if (!res?.data?.listings) {
        throw new Error(
          t("assets_list_no_export_data", "No records found to export.")
        );
      }

      const unitCount = res.data.listings.reduce(
        (total, listing) => total + (Number(listing?.unit) || 0),
        0
      );

      const myexcelData =
        isExcel &&
        res.data.listings.map((data, index) => ({
          [t("assets_list_sr", "Sr")]: index + 1,
          [t("assets_list_category", "Category")]:
            data?.asset_main_type_name,
          [t("assets_list_type", "Type")]: data?.asset_type_name,
          [t("assets_list_vendor_name", "Vendor Name")]: data?.vendor_name,
          [t("assets_list_gsd_name", "GSD Name")]: data?.agent_name,
          [t("assets_list_gsd_phone", "GSD Phone")]: data?.agent_phone
            ? Number(data.agent_phone) || "-"
            : "-",
          [t("assets_list_sector_name", "Sector")]: data?.sector_name,
          ...(formValue?.asset_main_type_id !== "1" && {
            [t("assets_list_sanstha_name", "Sanstha")]:
              data?.sanstha_name_hi,
          }),
          ...(formValue?.asset_main_type_id !== "2" && {
            [t("assets_list_parking", "Parking")]: data?.parking_name,
          }),
          [t("assets_list_code", "Code")]: Number(data?.code),
          [t("assets_list_unit", "Unit")]: Number(data?.unit),
          [t("assets_list_register_date", "Register Date")]: data?.created_at
            ? moment(data.created_at).format("DD-MMM-YYYY hh:mm A")
            : "",
        }));

      if (isExcel) {
        exportToExcel(myexcelData, fileName, [
          {
            name: t("assets_list_total_unit", "Total Unit"),
            value: unitCount,
            colIndex: 10,
          },
        ]);
      }

      const pdfData =
        !isExcel &&
        res.data.listings.map((data, index) => [
          index + 1,
          ...(formValue?.asset_type_id ? [] : [data?.asset_type_name]),
          ...(formValue?.vendor_id ? [] : [data?.vendor_name]),
          data?.agent_name,
          data?.agent_phone,
          ...(formValue?.asset_main_type_id === "1"
            ? [data?.sector_name || data?.parking_name || ""]
            : []),
          ...(formValue?.asset_main_type_id === "2"
            ? [data?.sector_name]
            : []),
          ...(formValue?.asset_main_type_id === "2"
            ? [data?.sanstha_name]
            : []),
          Number(data?.code),
          Number(data?.unit),
          data?.created_at
            ? moment(data.created_at).format("DD-MMM-YYYY hh:mm A")
            : "",
        ]);

      if (!isExcel) {
        ExportPdfFunction(
          "",
          fileName,
          pdfHeader,
          [
            ...pdfData,
            [
              "",
              "",
              "",
              t("assets_list_total_unit", "Total Unit"),
              unitCount,
              "",
            ],
          ],
          true,
          true,
          [],
          [
            {
              label: `${t("assets_list_category", "Category")} : ${
                pdfTitleData?.category ||
                t("assets_list_combined", "Combined")
              }`,
            },
            {
              label: `${t("assets_list_type", "Type")} : ${
                pdfTitleData?.type ||
                t("assets_list_combined", "Combined")
              }`,
            },
            {
              label: `${t("assets_list_vendor_name", "Vendor Name")} : ${
                pdfTitleData?.vendor ||
                t("assets_list_combined", "Combined")
              }`,
            },
            {
              label: `${t("assets_list_sector_name", "Sector")} : ${
                pdfTitleData?.sector ||
                t("assets_list_combined", "Combined")
              }`,
            },
          ]
        );
      }
    } catch (error) {
      message.error(
        `${t("assets_list_export_error", "Error occurred")}: ${
          error.message || t("assets_list_unknown_error", "Unknown error")
        }`
      );
    }
  };

  // Translate date filter labels while preserving their original values
  const translatedDateWeekOptions = (dateWeekOptions || []).map((option) => {
    const optionValue = option?.value ?? option?.label;
    let translatedLabel = option?.label;

    if (optionValue === "Today") {
      translatedLabel = t("assets_list_today", "Today");
    } else if (optionValue === "Date Range") {
      translatedLabel = t("assets_list_date_range", "Date Range");
    } else if (optionValue === "This Week") {
      translatedLabel = t("assets_list_this_week", "This Week");
    } else if (optionValue === "This Month") {
      translatedLabel = t("assets_list_this_month", "This Month");
    }

    return {
      ...option,
      label: translatedLabel,
    };
  });

  return (
    <>
      <CommonDivider
        label={t("assets_list_title", "Toilets & Tentage List")}
      />

      <div className="flex justify-end gap-2 font-semibold">
        <Button type="primary" onClick={() => exportToFile(false)}>
          {t("assets_list_download_pdf", "Download PDF")}
        </Button>

        <Button type="primary" onClick={() => exportToFile(true)}>
          {t("assets_list_download_excel", "Download Excel")}
        </Button>
      </div>

      <Collapse
        defaultActiveKey={["1"]}
        size="small"
        className="rounded-none mt-3"
        items={[
          {
            key: 1,
            label: (
              <div className="flex items-center h-full">
                <img
                  src={search}
                  className="h-5"
                  alt={t("assets_list_search_icon", "Search")}
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
                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name="asset_main_type_id"
                      label={t("assets_list_select_category", "Select Category")}
                      allowClear={false}
                      placeholder={t(
                        "assets_list_select_category",
                        "Select Category"
                      )}
                      onSelect={handleSelect}
                      options={(AssetMainTypeDrop || []).slice(0, 2)}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name="asset_type_id"
                      label={t("assets_list_select_type", "Select Type")}
                      placeholder={t(
                        "assets_list_select_type",
                        "Select Type"
                      )}
                      options={AssetTypeDrop || []}
                      onSelect={handleTypeSelect}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name="created_by"
                      label={t("assets_list_select_gsd", "Select GSD")}
                      placeholder={t(
                        "assets_list_select_gsd",
                        "Select GSD"
                      )}
                      options={monitoringAgentDrop || []}
                      isOnSearchFind={true}
                      apiAction={getMonitoringAgent}
                      onSearchUrl={`${URLS?.monitoringAgent?.path}&keywords=`}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name="vendor_id"
                      label={t("assets_list_select_vendor", "Select Vendor")}
                      placeholder={t(
                        "assets_list_select_vendor",
                        "Select Vendor"
                      )}
                      options={VendorCatTypeDrop || []}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name="sector_id"
                      label={t("assets_list_select_sector", "Select Sector")}
                      placeholder={t(
                        "assets_list_select_sector",
                        "Select Sector"
                      )}
                      options={SectorListDrop || []}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name="parking_id"
                      label={t("assets_list_select_parking", "Select Parking")}
                      placeholder={t(
                        "assets_list_select_parking",
                        "Select Parking"
                      )}
                      options={parkingDrop || []}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomInput
                      name="code"
                      label={t("assets_list_code", "Code")}
                      placeholder={t("assets_list_code", "Code")}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name="date_format"
                      label={t("assets_list_select_date_type", "Select Date Type")}
                      placeholder={t(
                        "assets_list_select_date_type",
                        "Select Date Type"
                      )}
                      onSelect={handleDateSelect}
                      options={translatedDateWeekOptions}
                    />
                  </Col>

                  {showDateRange && (
                    <>
                      <Col xs={24} sm={12} md={6} lg={5}>
                        <CustomDatepicker
                          name="form_date"
                          label={t("assets_list_from_date", "From Date")}
                          className="w-full"
                          placeholder={t(
                            "assets_list_from_date",
                            "From Date"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t(
                                "assets_list_start_date_required",
                                "Please select a start date!"
                              ),
                            },
                          ]}
                          onChange={(date) => {
                            const start = dayjs(date?.$d);
                            const end = dayjs(
                              form.getFieldValue("to_date")?.$d
                            );

                            if (start.isAfter(end)) {
                              form.setFieldValue("to_date", null);
                            }

                            const daysDifference = end.diff(start, "days");

                            if (daysDifference > 30) {
                              form.setFieldValue("to_date", null);
                            }

                            setStartDate(start.format("YYYY-MM-DD"));
                          }}
                        />
                      </Col>

                      <Col xs={24} sm={12} md={6} lg={5}>
                        <CustomDatepicker
                          name="to_date"
                          label={t("assets_list_to_date", "To Date")}
                          className="w-full"
                          placeholder={t("assets_list_to_date", "To Date")}
                          rules={[
                            {
                              required: true,
                              message: t(
                                "assets_list_end_date_required",
                                "Please select an end date!"
                              ),
                            },
                          ]}
                          disabledDate={disabledDate}
                        />
                      </Col>
                    </>
                  )}

                  <Col span={24}>
                    <div className="flex justify-start my-4 space-x-2 ml-3">
                      <Button
                        loading={loading}
                        htmlType="submit"
                        className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                      >
                        {t("assets_list_search", "Search")}
                      </Button>

                      <Button
                        loading={loading}
                        className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                        onClick={resetForm}
                      >
                        {t("assets_list_reset", "Reset")}
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

      <CommonTable
        columns={columns}
        uri="asset-list"
        details={details}
        totalName={t("assets_list_total_code_count", "Total Code Count")}
        loading={loading}
        scroll={{ x: 1500, y: 400 }}
      />

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        title={t("assets_list_qr_code", "QR Code")}
        width={200}
      >
        {qrCodeUrl ? (
          <Image
            src={qrCodeUrl}
            alt={t("assets_list_qr_code", "QR Code")}
          />
        ) : (
          <p>{t("assets_list_no_qr_code", "No QR Code available")}</p>
        )}
      </Modal>

      <Modal
        title={
          <h5>
            {t(
              "assets_list_delete_modal_title",
              "Delete Toilets & Tentage Type"
            )}
          </h5>
        }
        open={viewDeleteModal}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <p>
            {t(
              "assets_list_delete_confirmation",
              "Are you sure you want to delete this Toilets & Tentage Type record?"
            )}
          </p>

          <Form.Item name="asset_main_type_name">
            <Input
              disabled
              className="w-full"
              placeholder={t("assets_list_category", "Category")}
            />
          </Form.Item>

          <Form.Item name="asset_type_name">
            <Input
              disabled
              className="w-full"
              placeholder={t("assets_list_type", "Type")}
            />
          </Form.Item>

          <Form.Item name="assets_id">
            <Input
              disabled
              className="w-full"
              placeholder={t("assets_list_id", "ID")}
            />
          </Form.Item>

          <p>
            <strong className="text-red-500 font-bold">
              {t(
                "assets_list_delete_warning",
                "Please note: This data cannot be recovered."
              )}
            </strong>
          </p>

          <Form.Item>
            <div className="flex justify-end space-x-2">
              <Button type="primary" danger htmlType="submit">
                {t("assets_list_delete", "Delete")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AssetsList;
