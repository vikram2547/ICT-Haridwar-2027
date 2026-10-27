
import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router";
import { useDispatch } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Form, Button, Divider, message } from "antd";

import CountryStateCity from "../../commonComponents/CountryStateCity";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import CustomInput from "../../commonComponents/CustomInput";
import CustomSelect from "../../commonComponents/CustomSelect";
import { getUserTypeList } from "../../permission/UserTypePermission/userTypeSlice";
import UserTypeSelector from "../../permission/UserTypePermission/userTypeSelector";
import { activeOptions } from "../../constant/const";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { DICT } from "../../utils/dictionary";

const UserRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const key = location.state?.key;
  const record = location.state?.record;
  const isUpdate = key === "UpdateKey";

  const { UserListDrop } = UserTypeSelector();
  const { SectorListDrop } = VendorSectorSelectors();

  const IsGsd = Number(record?.user_type_id) === 6;

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

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const finalValue = {
        ...values,
        ...(key === "AddKey" && { status: 1 }),
      };

      if (isUpdate) {
        finalValue.user_id = record?.user_id;
      }

      const res = await postData(
        getFormData(finalValue),
        isUpdate ? URLS.editUser.path : URLS.register.path,
        {
          version: URLS.register.version,
        }
      );

      if (res?.data?.success) {
        message.success(
          isUpdate
            ? t("user_form_update_success", "User updated successfully")
            : t("user_form_register_success", "User registered successfully")
        );

        form.resetFields();
        navigate("/users");
      } else {
        message.error(
          res?.data?.message ||
            t("user_form_save_failed", "Unable to save user details")
        );
      }
    } catch (error) {
      message.error(
        t(
          "user_form_error",
          "Something went wrong. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const uri = URLS?.allUserType?.path;
    dispatch(getUserTypeList(uri));

    if (IsGsd) {
      dispatch(getSectorsList());
    }
  }, [dispatch, IsGsd]);

  useEffect(() => {
    if (isUpdate && record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [record, isUpdate, form]);

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => navigate("/users")}
            aria-label={t("user_form_back", "Back")}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {isUpdate
                ? t("user_form_update_title", "Update User Details")
                : t("user_form_register_title", "User Registration")}
            </div>

            <div className="text-xs">
              {t(
                "user_form_mandatory_note",
                "All * marks fields are mandatory"
              )}
            </div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            <CustomSelect
              name="user_type_id"
              label={t("user_form_user_type", "Select User Type")}
              placeholder={t("user_form_user_type_placeholder", "Select User Type")}
              rules={[
                {
                  required: true,
                  message: t(
                    "user_form_user_type_required",
                    "Please select User Type"
                  ),
                },
              ]}
              options={UserListDrop || []}
            />

            <CustomInput
              label={
                <div className="font-semibold">
                  {t("user_form_mobile_label", "Mobile Number (Username)")}
                </div>
              }
              name="phone"
              placeholder={t("user_form_mobile_placeholder", "Mobile Number")}
              maxLength={10}
              autoComplete="off"
              accept="onlyNumber"
              rules={[
                {
                  required: true,
                  message: t(
                    "user_form_mobile_required",
                    "Please enter the mobile number!"
                  ),
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: t(
                    "user_form_mobile_invalid",
                    "Please enter a valid 10-digit mobile number"
                  ),
                },
              ]}
            />

            <CustomInput
              label={
                <div className="font-semibold">
                  {t("user_form_password", "Password")}
                </div>
              }
              name="password"
              placeholder={t("user_form_password_placeholder", "Password")}
              maxLength={15}
              autoComplete="off"
              isPassword={true}
              rules={[
                {
                  required: !isUpdate,
                  message: t(
                    "user_form_password_required",
                    "Please enter your password!"
                  ),
                },
                {
                  min: 6,
                  message: t(
                    "user_form_password_min",
                    "Password must be at least 6 characters."
                  ),
                },
              ]}
            />

            <CustomInput
              label={
                <div className="font-semibold">
                  {t("user_form_name_label", "Name (Display Name)")}
                </div>
              }
              name="name"
              rules={[
                {
                  required: true,
                  message: t(
                    "user_form_name_required",
                    "Please enter name"
                  ),
                },
              ]}
              placeholder={t(
                "user_form_name_placeholder",
                "Name (Display Name)"
              )}
            />

            <CustomInput
              label={
                <div className="font-semibold">
                  {t("user_form_email_label", "Email ID")}
                </div>
              }
              name="email"
              placeholder={t("user_form_email_placeholder", "Email ID")}
            />

            {IsGsd && (
              <CustomSelect
                name="allocate_sector_id"
                label={t("user_form_sector", "Select Sector")}
                placeholder={t("user_form_sector_placeholder", "Select Sector")}
                options={SectorListDrop || []}
              />
            )}

            <CountryStateCity
              form={form}
              country_id={record?.country_id}
              state_id={record?.state_id}
              city_id={record?.city_id}
            />

            {isUpdate && (
              <CustomSelect
                name="status"
                label={t("user_form_status", "Select Status")}
                placeholder={t("user_form_status_placeholder", "Select Status")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "user_form_status_required",
                      "Please select Status"
                    ),
                  },
                ]}
                options={activeOptions || []}
              />
            )}

            <CustomInput
              type="textarea"
              label={
                <div className="font-semibold">
                  {t("user_form_address", "Address")}
                </div>
              }
              name="address"
              placeholder={t("user_form_address_placeholder", "Address")}
            />
          </div>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {isUpdate
                  ? t("user_form_update_button", "Update")
                  : t("user_form_register_button", "Register")}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UserRegistrationForm;
