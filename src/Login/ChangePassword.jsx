import React, { useState } from "react";
import { Button, Form, message } from "antd";
import { useOutletContext } from "react-router-dom";
import URLS from "../urils/URLS";
import { DICT } from "../utils/dictionary";
import CustomInput from "../commonComponents/CustomInput";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Read the selected language from the existing outlet context.
  const outletContext = useOutletContext() || [];
  const contextDict = outletContext[0] || {};
  const lang = outletContext[1] || localStorage.getItem("lang") || "en";

  // Use outlet translations first, then the existing DICT, then fallback.
  const t = (key, fallback) =>
    contextDict?.[key]?.[lang] ??
    contextDict?.[key]?.en ??
    DICT?.[key]?.[lang] ??
    DICT?.[key]?.en ??
    fallback ??
    key;

  const headers = {
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  const handleChangePassword = async (data) => {
    if (data?.confirmPassword !== data?.newPassword) {
      message.error(
        t("change_password_mismatch", "Passwords do not match.")
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("password", data?.confirmPassword);

      const response = await fetch(`${URLS.baseUrl}/change-password`, {
        method: "POST",
        headers,
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success(
          t("change_password_success", "Password changed successfully!")
        );
        form.resetFields();
      } else {
        message.error(
          result.message ||
            t("change_password_failed", "Failed to change password.")
        );
      }
    } catch (error) {
      message.error(
        t("change_password_error", "Error changing password.")
      );
      console.error("Change password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 mx-auto p-3 bg-white shadow-md rounded-lg w-full relative">
      <div className="text-2xl font-bold mb-4">
        {t("change_password_title", "Change Password")}
      </div>

      <Form
        form={form}
        onFinish={handleChangePassword}
        layout="vertical"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          <CustomInput
            name="newPassword"
            label={t("change_password_new_label", "New Password:")}
            placeholder={t("change_password_placeholder", "Password")}
            maxLength={15}
            autoComplete="off"
            isPassword={true}
            rules={[
              {
                required: true,
                message: t(
                  "change_password_required",
                  "Please enter your password!"
                ),
              },
              {
                min: 6,
                message: t(
                  "change_password_min_length",
                  "Password must be at least 6 characters."
                ),
              },
            ]}
            className="mt-2"
          />

          <CustomInput
            name="confirmPassword"
            label={t(
              "change_password_confirm_label",
              "Confirm Password:"
            )}
            placeholder={t(
              "change_password_confirm_placeholder",
              "Confirm Password"
            )}
            maxLength={15}
            autoComplete="off"
            isPassword={true}
            rules={[
              {
                required: true,
                message: t(
                  "change_password_confirm_required",
                  "Please confirm your password!"
                ),
              },
              {
                min: 6,
                message: t(
                  "change_password_min_length",
                  "Password must be at least 6 characters."
                ),
              },
            ]}
            className="mt-2"
          />
        </div>

        <br />

        <div className="flex justify-end">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-fit rounded-none bg-5c"
            >
              {t("change_password_save", "Save Changes")}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ChangePassword;