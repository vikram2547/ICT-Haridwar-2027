
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  Button,
  message,
  Collapse,
  notification,
  Row,
  Col,
  Form,
} from "antd";
import { useOutletContext } from "react-router";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";
import search from "../../assets/Dashboard/icon-search.png";
import { getPdfExcelData } from "../asset/AssetsSlice";
import { exportToExcel } from "../../Reports/ExportExcelFuntion";
import { ExportPdfFunction } from "../../Reports/ExportPdfFunction";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import CustomInput from "../../commonComponents/CustomInput";
import { getValueLabel } from "../../constant/const";
import { DICT } from "../../utils/dictionary";

const VendorList = () => {
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

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [api, contextHolder] = notification.useNotification({
    top: 100,
  });

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: t("vendor_list_note", "Note"),
      duration: 7,
      description: t(
        "vendor_list_search_info",
        "Please enter some information to perform the search."
      ),
    });
  };

  const values = form.getFieldValue("user_type_id");
  const fileName = getValueLabel(values, [], t("vendor_list_title", "Vendor List"));

  const onFinishForm = async (values) => {
    const searchParams = generateSearchQuery(values);

    if (searchParams === "&") {
      openNotificationWithIcon("info");
    }

    setSearchQuery(searchParams);
  };

  const resetForm = () => {
    form.resetFields();
    setSearchQuery("&");
  };

  const getDetails = async () => {
    setLoading(true);

    try {
      let uri = URLS.vendors.path + "&";

      if (params.page) {
        uri = uri + params.page;
      }

      if (params.per_page) {
        uri = uri + "&" + params.per_page;
      }

      if (searchQuery) {
        uri = uri + searchQuery;
      }

      const extraHeaders = {
        "x-api-version": URLS.vendors.version,
      };

      const res = await getData(uri, extraHeaders);

      if (res) {
        const data = res.data;
        const paging = data?.paging?.[0] || {};

        setDetails({
          list: data?.users || [],
          pageLength: paging.length || 25,
          currentPage: paging.currentPage || 1,
          totalRecords: paging.totalrecords || 0,
        });
      }
    } catch (error) {
      message.error(
        t("vendor_list_fetch_error", "Unable to fetch vendor list.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, [params, searchQuery]);

  const columns = [
    {
      title: t("vendor_list_sr_no", "Sr. No"),
      dataIndex: "sr",
      key: "sr",
      width: 70,
    },
    {
      title: t("vendor_list_name", "Name"),
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: t("vendor_list_email", "Email"),
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: t("vendor_list_mobile", "Mobile No."),
      dataIndex: "phone",
      key: "phone",
      width: 110,
    },
    {
      title: t("vendor_list_state", "State"),
      dataIndex: "state_name",
      key: "state_name",
      width: 120,
    },
    {
      title: t("vendor_list_city", "City"),
      dataIndex: "city_name",
      key: "city_name",
      width: 120,
    },
    {
      title: t("vendor_list_address", "Address"),
      dataIndex: "address",
      key: "address",
      width: 300,
    },
    {
      title: t("vendor_list_vendor_code", "Vendor Code"),
      dataIndex: "code",
      key: "code",
      width: 160,
    },
    {
      title: t("vendor_list_action", "Action"),
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 160,
      render: (text, record) => (
        <div className="flex gap-2 justify-between">
          <Button
            title={t("vendor_list_edit", "Edit")}
            aria-label={t("vendor_list_edit", "Edit")}
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            onClick={() => {
              navigate("/vendor-registration", {
                state: {
                  key: "UpdateKey",
                  record: record,
                },
              });
            }}
          >
            <EditOutlined />
          </Button>

          <Link to={"/vendor/add-vendor-details/" + record?.user_id}>
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
              key={record?.id}
            >
              <PlusOutlined />{" "}
              {t("vendor_list_details", "Details")}
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const pdfHeader = [
    t("vendor_list_sr_no", "Sr. No"),
    t("vendor_list_name", "Name"),
    t("vendor_list_email", "Email"),
    t("vendor_list_mobile", "Mobile No."),
  ];

  // Retained from the original export implementation.
  const columnPercentages = [15, 30, 35, 20];

  const exportToFile = async (isExcel) => {
    try {
      const url = URLS.users.path + "?page=1&per_page=5000";

      const res = await dispatch(
        getPdfExcelData(
          `${url}${searchQuery ? searchQuery : ""}`
        )
      );

      if (!res?.data?.users) {
        throw new Error(
          t("vendor_list_no_users", "No users found in the response data.")
        );
      }

      const myexcelData =
        isExcel &&
        res.data.users.map((data, index) => ({
          [t("vendor_list_sr_no", "Sr. No")]: index + 1,
          [t("vendor_list_name", "Name")]: data?.name,
          [t("vendor_list_email", "Email")]: data?.email,
          [t("vendor_list_mobile", "Mobile No.")]: data?.phone,
        }));

      const pdfData =
        !isExcel &&
        res.data.users.map((data, index) => [
          index + 1,
          data?.name,
          data?.email,
          data?.phone,
        ]);

      if (isExcel) {
        exportToExcel(myexcelData, fileName);
      } else {
        ExportPdfFunction(
          fileName,
          fileName,
          pdfHeader,
          pdfData,
          false,
          false,
          columnPercentages
        );
      }
    } catch (error) {
      message.error(
        `${t("vendor_list_export_error", "Export failed")}: ${
          error.message ||
          t("vendor_list_unknown_error", "Unknown error")
        }`
      );
    }
  };

  return (
    <div className="">
      <CommonDivider
        label={t("vendor_list_title", "Vendor List")}
        compo={
          <Button
            className="bg-orange-300 mb-1"
            onClick={() => {
              navigate("/vendor-registration", {
                state: {
                  key: "AddKey",
                },
              });
            }}
          >
            {t("vendor_list_add_vendor", "Add Vendor")}
          </Button>
        }
      />

      <div className="flex justify-end gap-2 font-semibold">
        <Button
          type="primary"
          onClick={() => exportToFile(false)}
        >
          {t("vendor_list_download_pdf", "Download PDF")}
        </Button>

        <Button
          type="primary"
          onClick={() => exportToFile(true)}
        >
          {t("vendor_list_download_excel", "Download Excel")}
        </Button>
      </div>

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
                    alt={t("vendor_list_search_icon", "Search Icon")}
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
                    <Col xs={24} sm={12} md={6} lg={5}>
                      <CustomInput
                        name="name"
                        label={t("vendor_list_name", "Name")}
                        placeholder={t("vendor_list_name_placeholder", "Name")}
                      />
                    </Col>

                    <Col xs={24} sm={12} md={6} lg={5}>
                      <CustomInput
                        name="phone"
                        label={t("vendor_list_phone_number", "Phone Number")}
                        placeholder={t(
                          "vendor_list_phone_placeholder",
                          "Phone Number"
                        )}
                        maxLength={10}
                        accept="onlyNumber"
                        rules={[
                          {
                            required: false,
                            message: t(
                              "vendor_list_phone_required",
                              "Please enter your mobile number!"
                            ),
                          },
                          {
                            pattern: /^[0-9]{10}$/,
                            message: t(
                              "vendor_list_phone_invalid",
                              "Please enter a valid 10-digit mobile number"
                            ),
                          },
                        ]}
                      />
                    </Col>

                    <Col xs={24} sm={12} md={6} lg={5}>
                      <CustomInput
                        name="email"
                        label={t("vendor_list_email", "Email")}
                        placeholder={t("vendor_list_email_placeholder", "Email")}
                        rules={[
                          {
                            required: false,
                            message: t(
                              "vendor_list_email_required",
                              "Please input your email!"
                            ),
                          },
                          {
                            type: "email",
                            message: t(
                              "vendor_list_email_invalid",
                              "The input is not a valid email!"
                            ),
                          },
                        ]}
                      />
                    </Col>

                    <Col xs={24}>
                      <div className="flex justify-start my-4 space-x-2 ml-3">
                        <Button
                          loading={loading}
                          htmlType="submit"
                          className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                        >
                          {t("vendor_list_search", "Search")}
                        </Button>

                        <Button
                          loading={loading}
                          className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                          onClick={resetForm}
                        >
                          {t("vendor_list_reset", "Reset")}
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
      </div>

      <CommonTable
        columns={columns}
        uri={"vendor"}
        details={details}
        loading={loading}
      />
    </div>
  );
};

export default VendorList;
