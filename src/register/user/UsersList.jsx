
import React, { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Button,
  message,
  Collapse,
  notification,
  Row,
  Col,
  Form,
  Tooltip,
} from "antd";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { ExportPdfFunction } from "../../Reports/ExportPdfFunction";
import { exportToExcel } from "../../Reports/ExportExcelFuntion";
import { getPdfExcelData } from "../asset/AssetsSlice";
import { generateSearchQuery } from "../../urils/getSearchQuery";
import CustomInput from "../../commonComponents/CustomInput";
import CustomSelect from "../../commonComponents/CustomSelect";
import search from "../../assets/Dashboard/icon-search.png";
import { getUserTypeList } from "../../permission/UserTypePermission/userTypeSlice";
import UserTypeSelector from "../../permission/UserTypePermission/userTypeSelector";
import { getValueLabel } from "../../constant/const";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import { DICT } from "../../utils/dictionary";

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [showSectorDrop, setShowSectorDrop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("&");

  const [userDetails, setUserDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [api, contextHolder] = notification.useNotification({
    top: 100,
  });

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

  const { UserListDrop } = UserTypeSelector();
  const { SectorListDrop } = VendorSectorSelectors();

  const formValue = Form.useWatch([], form) || {};
  const selectedUserType = formValue?.user_type_id;

  const fileNames = getValueLabel(
    selectedUserType,
    UserListDrop,
    t("user_list_all_users", "All User List")
  );

  const fileName = useMemo(() => {
    if (formValue?.allocate_sector_id) {
      const sectName = getValueLabel(
        formValue.allocate_sector_id,
        SectorListDrop,
        "-"
      );

      return `${fileNames} - ${sectName}`;
    }

    return `${fileNames}`;
  }, [
    formValue?.allocate_sector_id,
    fileNames,
    SectorListDrop,
  ]);

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: t("user_list_note", "Note"),
      duration: 7,
      description: t(
        "user_list_search_required",
        "Please enter some information to perform the search."
      ),
    });
  };

  const onFinishForm = (values) => {
    const searchParams = generateSearchQuery(values);

    if (searchParams === "&") {
      openNotificationWithIcon("info");
    }

    setSearchQuery(searchParams);
  };

  const resetForm = () => {
    form.resetFields();
    setShowSectorDrop(false);
    setSearchQuery("&");
  };

  const getUsers = async () => {
    setLoading(true);

    try {
      let uri = URLS.users.path + "/?";

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
        "x-api-version": URLS.users.version,
      };

      const res = await getData(uri, extraHeaders);

      if (res) {
        const data = res.data;
        const paging = data?.paging?.[0];

        setUserDetails({
          list: data?.users || [],
          pageLength: paging?.length || 25,
          currentPage: paging?.currentPage || 1,
          totalRecords: paging?.totalrecords || 0,
        });
      }
    } catch (error) {
      message.error(
        t("user_list_fetch_error", "Unable to load users.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [params.page, params.per_page, searchQuery]);

  useEffect(() => {
    dispatch(getUserTypeList(URLS?.allUserType?.path));
    dispatch(getSectorsList());
  }, [dispatch]);

  const getVal = (val) => {
    if (
      val === "undefined" ||
      val === undefined ||
      val === null ||
      val === ""
    ) {
      return "-";
    }

    return val;
  };

  const columns = [
    {
      title: t("user_list_user_type", "User Type"),
      dataIndex: "user_type",
      key: "user_type",
    },
    {
      title: t("user_list_name", "Name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("user_list_phone", "Phone (Username)"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("user_list_email", "Email"),
      dataIndex: "email",
      key: "email",
      width: 250,
      render: getVal,
    },
    {
      title: t("user_list_allocate_sector", "Allocate Sector"),
      dataIndex: "allocate_sector_id",
      key: "allocate_sector_id",
      render: (value) =>
        value
          ? getValueLabel(value, SectorListDrop, null) || "-"
          : "-",
    },
    {
      title: t("user_list_status", "Status"),
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (value) => {
        const isActive = String(value) === "1";

        return (
          <div className="flex justify-center items-center">
            <Tooltip
              title={
                isActive
                  ? t("user_list_active", "Active")
                  : t("user_list_inactive", "Inactive")
              }
            >
              {isActive ? (
                <CheckCircleOutlined className="text-green-500 text-2xl" />
              ) : (
                <CloseCircleOutlined className="text-red-500 text-2xl" />
              )}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: t("user_list_country", "Country"),
      dataIndex: "country_name",
      key: "country_name",
      render: getVal,
    },
    {
      title: t("user_list_state", "State"),
      dataIndex: "state_name",
      key: "state_name",
      render: getVal,
    },
    {
      title: t("user_list_city", "City"),
      dataIndex: "city_name",
      key: "city_name",
      render: getVal,
    },
    {
      title: t("user_list_address", "Address"),
      dataIndex: "address",
      key: "address",
      width: 300,
      render: getVal,
    },
    {
      title: t("user_list_action", "Action"),
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (text, record) => (
        <div className="flex justify-between">
          <Button
            aria-label={t("user_list_edit", "Edit")}
            title={t("user_list_edit", "Edit")}
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            onClick={() => {
              navigate("/user-registration", {
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

  const pdfHeader = [
    t("user_list_sr_no", "Sr No"),
    t("user_list_user_type", "User Type"),
    t("user_list_name", "Name"),
    t("user_list_phone_export", "Phone"),
    t("user_list_email", "Email"),
    t("user_list_allocate_sector", "Allocate Sector"),
    t("user_list_address", "Address"),
    t("user_list_city", "City"),
    t("user_list_state", "State"),
  ];

  const columnPercentages = [4, 13, 14, 10, 18, 7, 18, 8, 8];

  const exportToFile = async (isExcel) => {
    try {
      const url = URLS.users.path + "?page=1&per_page=5000";

      const res = await dispatch(
        getPdfExcelData(`${url}${searchQuery || ""}`)
      );

      if (!res?.data?.users) {
        throw new Error(
          t("user_list_no_export_data", "No users found to export.")
        );
      }

      const users = res.data.users;

      if (isExcel) {
        const excelData = users.map((data, index) => ({
          [t("user_list_sr_no", "Sr")]: index + 1,
          [t("user_list_user_type", "User Type")]:
            data?.user_type || "",
          [t("user_list_name", "Name")]: data?.name || "",
          [t("user_list_phone_export", "Phone")]:
            data?.phone || "",
          [t("user_list_email", "Email")]: data?.email || "",
          [t("user_list_address", "Address")]:
            data?.address || "",
          [t("user_list_allocate_sector", "Allocate Sector")]:
            Number(data?.allocate_sector_id) === 0
              ? "-"
              : `Sector ${data?.allocate_sector_id || ""}`,
          [t("user_list_city", "City")]: data?.city_name || "",
          [t("user_list_state", "State")]: data?.state_name || "",
          [t("user_list_country", "Country")]:
            data?.country_name || "",
        }));

        exportToExcel(excelData, fileName);
      } else {
        const pdfData = users.map((data, index) => [
          index + 1,
          data?.user_type || "",
          data?.name || "",
          data?.phone || "",
          data?.email || "",
          Number(data?.allocate_sector_id) === 0
            ? "-"
            : `Sector ${data?.allocate_sector_id || ""}`,
          data?.address || "",
          data?.city_name || "",
          data?.state_name || "",
        ]);

        ExportPdfFunction(
          fileName,
          fileName,
          pdfHeader,
          pdfData,
          true,
          false,
          columnPercentages
        );
      }
    } catch (error) {
      message.error(
        `${t("user_list_export_error", "Export failed")}: ${
          error.message || t("user_list_unknown_error", "Unknown error")
        }`
      );
    }
  };

  return (
    <>
      <CommonDivider
        label={t("user_list_title", "User List")}
        compo={
          <Button
            onClick={() =>
              navigate("/user-registration", {
                state: {
                  key: "AddKey",
                },
              })
            }
            className="bg-orange-300 mb-1"
          >
            {t("user_list_add_button", "Add User")}
          </Button>
        }
      />

      <div className="flex justify-end gap-2 font-semibold">
        <Button type="primary" onClick={() => exportToFile(false)}>
          {t("user_list_download_pdf", "Download PDF")}
        </Button>

        <Button type="primary" onClick={() => exportToFile(true)}>
          {t("user_list_download_excel", "Download Excel")}
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
                <img src={search} className="h-5" alt="Search Icon" />
                <span className="ml-2">
                  {t("user_list_search", "Search Users")}
                </span>
              </div>
            ),
            children: (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinishForm}
              >
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name="user_type_id"
                      label={t("user_list_select_user_type", "Select User Type")}
                      placeholder={t("user_list_select_user_type", "Select User Type")}
                      options={UserListDrop || []}
                      onChange={(value) => {
                        const isGsd = Number(value) === 6;
                        setShowSectorDrop(isGsd);
                        form.setFieldValue("allocate_sector_id", null);
                      }}
                    />
                  </Col>

                  {showSectorDrop && (
                    <Col xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name="allocate_sector_id"
                        label={t("user_list_select_sector", "Select Sector")}
                        placeholder={t("user_list_select_sector", "Select Sector")}
                        allowClear={true}
                        options={SectorListDrop || []}
                      />
                    </Col>
                  )}

                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomInput
                      name="name"
                      label={t("user_list_name", "Name")}
                      placeholder={t("user_list_name", "Name")}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomInput
                      name="phone"
                      label={t("user_list_phone_number", "Phone Number")}
                      placeholder={t("user_list_phone_number", "Phone Number")}
                      maxLength={10}
                      accept="onlyNumber"
                      rules={[
                        {
                          pattern: /^[0-9]{10}$/,
                          message: t(
                            "user_list_phone_invalid",
                            "Please enter a valid 10-digit mobile number"
                          ),
                        },
                      ]}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={5}>
                    <CustomInput
                      name="email"
                      label={t("user_list_email", "Email")}
                      placeholder={t("user_list_email", "Email")}
                      rules={[
                        {
                          type: "email",
                          message: t(
                            "user_list_email_invalid",
                            "Please enter a valid email address"
                          ),
                        },
                      ]}
                    />
                  </Col>

                  <Col xs={24}>
                    <div className="flex justify-start my-4 space-x-2">
                      <Button
                        loading={loading}
                        type="primary"
                        htmlType="submit"
                        className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                      >
                        {t("user_list_search_button", "Search")}
                      </Button>

                      <Button
                        loading={loading}
                        className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                        onClick={resetForm}
                      >
                        {t("user_list_reset_button", "Reset")}
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
        loading={loading}
        uri="users"
        columns={columns}
        details={userDetails}
        scroll={{ x: 1800, y: 400 }}
        setUserDetails={setUserDetails}
      />
    </>
  );
};

export default UserList;
