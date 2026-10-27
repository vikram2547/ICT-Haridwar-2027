
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { Form, Button, Divider, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import CountryStateCity from "../../commonComponents/CountryStateCity";
import CustomInput from "../../commonComponents/CustomInput";
import { DICT } from "../../utils/dictionary";

const VendorRegistrationForm = () => {
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

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const key = location.state?.key;
  const record = location.state?.record;

  const onFinish = async (values) => {
    setLoading(true);

    try {
      values.status = 1;
      values.user_type_id = 8;

      if (key === "UpdateKey") {
        values.user_id = record.user_id;
      }

      const res = await postData(
        getFormData(values),
        key === "UpdateKey"
          ? URLS.editUser.path
          : URLS.register.path,
        {
          version: URLS.register.version,
        }
      );

      if (res?.data?.success) {
        message.success(
          key === "UpdateKey"
            ? t(
                "vendor_registration_update_success",
                "Vendor details updated successfully."
              )
            : t(
                "vendor_registration_success",
                "Vendor registered successfully."
              )
        );

        form.resetFields();
        navigate("/vendor");
      } else if (res) {
        message.error(
          res?.data?.message ||
            t(
              "vendor_registration_failed",
              "Unable to save vendor details."
            )
        );
      }
    } catch (error) {
      message.error(
        error?.message ||
          t(
            "vendor_registration_error",
            "Something went wrong while saving vendor details."
          )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (key === "UpdateKey" && record) {
      form.setFieldsValue(record);
    }
  }, [record, key, form]);

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            aria-label={t("vendor_registration_back", "Back")}
            title={t("vendor_registration_back", "Back")}
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => navigate("/vendor")}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {key === "UpdateKey"
                ? t(
                    "vendor_registration_update_title",
                    "Update Vendor Details"
                  )
                : t(
                    "vendor_registration_title",
                    "Vendor Registration"
                  )}
            </div>

            <div className="text-xs">
              {t(
                "vendor_registration_mandatory_note",
                "All * marks fields are mandatory"
              )}
            </div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            <CustomInput
              label={
                <div className="font-semibold">
                  {t(
                    "vendor_registration_mobile_label",
                    "Mobile Number (Username)"
                  )}
                </div>
              }
              name="phone"
              placeholder={t(
                "vendor_registration_mobile_placeholder",
                "Mobile Number"
              )}
              maxLength={10}
              autoComplete="off"
              accept="onlyNumber"
              rules={[
                {
                  required: true,
                  message: t(
                    "vendor_registration_mobile_required",
                    "Please enter the mobile number!"
                  ),
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: t(
                    "vendor_registration_mobile_invalid",
                    "Please enter a valid 10-digit mobile number"
                  ),
                },
              ]}
            />

            <CustomInput
              label={
                <div className="font-semibold">
                  {t("vendor_registration_name_label", "Vendor Name")}
                </div>
              }
              name="name"
              rules={[
                {
                  required: true,
                  message: t(
                    "vendor_registration_name_required",
                    "Please enter name"
                  ),
                },
              ]}
              placeholder={t(
                "vendor_registration_name_placeholder",
                "Vendor Name"
              )}
            />

            <CustomInput
              label={
                <div className="font-semibold">
                  {t("vendor_registration_email_label", "Email ID")}
                </div>
              }
              name="email"
              rules={[
                {
                  required: true,
                  message: t(
                    "vendor_registration_email_required",
                    "Please enter the email"
                  ),
                },
                {
                  type: "email",
                  message: t(
                    "vendor_registration_email_invalid",
                    "Please enter a valid email"
                  ),
                },
              ]}
              placeholder={t(
                "vendor_registration_email_placeholder",
                "Email ID"
              )}
            />

            <CountryStateCity
              form={form}
              country_id={record?.country_id}
              state_id={record?.state_id}
              city_id={record?.city_id}
            />

            {key === "AddKey" && (
              <CustomInput
                label={
                  <div className="font-semibold">
                    {t("vendor_registration_password_label", "Password")}
                  </div>
                }
                name="password"
                placeholder={t(
                  "vendor_registration_password_placeholder",
                  "Password"
                )}
                maxLength={15}
                autoComplete="off"
                isPassword={true}
                rules={[
                  {
                    required: true,
                    message: t(
                      "vendor_registration_password_required",
                      "Please enter your password!"
                    ),
                  },
                  {
                    min: 6,
                    message: t(
                      "vendor_registration_password_min",
                      "Password must be at least 6 characters."
                    ),
                  },
                ]}
              />
            )}

            <CustomInput
              type="textarea"
              label={
                <div className="font-semibold">
                  {t("vendor_registration_address_label", "Address")}
                </div>
              }
              name="address"
              rules={[
                {
                  required: true,
                  message: t(
                    "vendor_registration_address_required",
                    "Please enter the address"
                  ),
                },
              ]}
              placeholder={t(
                "vendor_registration_address_placeholder",
                "Address"
              )}
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
                {key === "UpdateKey"
                  ? t("vendor_registration_update_button", "Update")
                  : t("vendor_registration_register_button", "Register")}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default VendorRegistrationForm;
