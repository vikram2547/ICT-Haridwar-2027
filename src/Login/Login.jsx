import React, { useEffect, useState } from "react";
import { Button, Form, message, Modal } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import loginImg from "../assets/Images/loginImg.webp";
import { useNavigate } from "react-router";
import { DICT } from "../utils/dictionary";
import { loginFetch } from "../Fetch/Axios";
import BeforeLoginUserTypeDropDown from "../register/user/BeforeLoginUserTypeDropDown";
import "./login.css";
import URLS from "../urils/URLS";
import { checkLoginAvailability } from "../constant/const";
import CustomInput from "../commonComponents/CustomInput";
import { useDispatch } from "react-redux";
import { storeToken } from "./slice/loginSlice";
import CustomNumericCaptcha from "../commonComponents/CustomNumericCaptcha";

const headers = {
  "x-api-key": "YunHu873jHds83hRujGJKd873",
  "x-api-version": "1.0.1",
  "x-platform": "Web",
  "x-access-token": localStorage.getItem("sessionToken") || "",
};

const Login = () => {
  const localLang = localStorage.getItem("lang");

  const [lang] = useState(localLang || "en");
  const [canProceed, setCanProceed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpStep, setOtpStep] = useState(false);

  const [form] = Form.useForm();
  const [forgotForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isHindi = lang === "hi";

  // Translation helper: selected language -> English -> fallback.
  const t = (key, fallback) =>
    DICT?.[key]?.[lang] ?? DICT?.[key]?.en ?? fallback ?? key;

  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString
    ? JSON.parse(sessionDataString)
    : null;

  useEffect(() => {
    if (sessionData) {
      checkLoginAvailability(sessionData, navigate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login
  const onFinish = async (values) => {
    if (Number(values?.captcha) !== Number(values?.enter_captcha)) {
      message.error(t("login_captcha_error", "Please enter the correct CAPTCHA!"));
      return;
    }

    const formData = new FormData();
    formData.append("user_type_id", values.user_type_id);
    formData.append("username", values.username);
    formData.append("platform", "Web");
    formData.append("password", values.password);

    setLoading(true);

    try {
      const res = await loginFetch(formData, setCanProceed);
      const resData = res?.data?.sessionData?.[0];

      if (res?.sessionToken) {
        dispatch(storeToken(res.sessionToken));
      }

      if (resData) {
        setTimeout(() => {
          checkLoginAvailability(resData, navigate);
        }, 1000);
      }
    } catch (error) {
      message.error(
        t("login_failed", "Unable to log in. Please try again.")
      );
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Request OTP for forgot password
  const handleForgotPassword = async (value) => {
    if (Number(value?.captcha) !== Number(value?.enter_captcha)) {
      message.error(t("login_captcha_error", "Please enter the correct CAPTCHA!"));
      return;
    }

    setPhone(value?.phone);

    try {
      const formData = new FormData();
      formData.append("phone", value?.phone);

      const response = await fetch(
        `${URLS.baseUrl}/resetpasswordrequest`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        message.success(
          t("login_otp_sent", "OTP sent successfully!")
        );
        setOtpStep(true);
      } else {
        message.error(
          result.message ||
            t("login_otp_failed", "Failed to send OTP.")
        );
      }
    } catch (error) {
      message.error(
        t("login_otp_request_error", "Error in OTP request.")
      );
      console.error("OTP request error:", error);
    }
  };

  // Reset password
  const handleResetPassword = async (value) => {
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("otp", value?.otp);
      formData.append("password", value?.newPassword);

      const response = await fetch(`${URLS.baseUrl}/resetpassword`, {
        method: "POST",
        headers,
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success(
          t("login_password_reset_success", "Password reset successfully!")
        );
        setForgotPasswordVisible(false);
        setOtpStep(false);
        forgotForm.resetFields();
        resetForm.resetFields();
        form.resetFields();
      } else {
        message.error(
          result.message ||
            t("login_password_reset_failed", "Failed to reset password.")
        );
      }
    } catch (error) {
      message.error(
        t("login_password_reset_error", "Error resetting password.")
      );
      console.error("Password reset error:", error);
    }
  };

  const openForgotPassword = (e) => {
    e.preventDefault();
    forgotForm.resetFields();
    resetForm.resetFields();
    setOtpStep(false);
    setForgotPasswordVisible(true);
  };

  const closeForgotPassword = () => {
    setForgotPasswordVisible(false);
    forgotForm.resetFields();
    resetForm.resetFields();
    setOtpStep(false);
  };

  return (
    <div className="flex m-auto bg-gray-100">
      <div className="h-screen m-auto flex w-10/12 flex-col justify-center">
        <div className="grid md:grid-cols-2 grid-cols-1 w-full h-96 shadow-xl">
          {/* Login image */}
          <div className="w-full h-96 hidden md:flex">
            <img
              src={loginImg}
              alt={t("login_image_alt", "Login")}
              className="w-full h-full"
            />
          </div>

          {/* Login form */}
          <div className="flex h-full flex-col w-full items-center">
            <div className="text-center font-merriweather p-2 font-semibold text-lg flex flex-col items-center w-full m-auto justify-center">
              <div className="text-center font-semibold text-xl w-full col-span-2 flex m-auto justify-center">
                <div className="flex flex-col">
                  <div className="text-orange-500">
                    {DICT?.title1?.[lang] ?? DICT?.title1?.en ?? ""}
                  </div>

                  <hr className="mt-1 mb-1 text-yellow-900" />

                  <div
                    className="text-green-800"
                    style={{ paddingBottom: "50px" }}
                  >
                    {DICT?.title2?.[lang] ?? DICT?.title2?.en ?? ""}
                  </div>
                </div>
              </div>

              <div className="w-8/12">
                <div className="flex w-full gap-4">
                  <Form
                    className="w-full gap-5"
                    form={form}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                  >
                    <BeforeLoginUserTypeDropDown form={form} />

                    <CustomInput
                      name="username"
                      placeholder={t("login_mobile_placeholder", "Mobile Number")}
                      maxLength={10}
                      autoComplete="off"
                      accept="onlyNumber"
                      prefix={<UserOutlined />}
                      isPassword={false}
                      rules={[
                        {
                          required: true,
                          message: t(
                            "login_mobile_required",
                            "Please enter your mobile number!"
                          ),
                        },
                        {
                          pattern: /^[0-9]{10}$/,
                          message: t(
                            "login_mobile_invalid",
                            "Please enter a valid 10-digit mobile number."
                          ),
                        },
                      ]}
                      className="mt-2"
                    />

                    <CustomInput
                      name="password"
                      placeholder={t("login_password_placeholder", "Password")}
                      maxLength={15}
                      autoComplete="off"
                      prefix={<LockOutlined />}
                      isPassword={true}
                      rules={[
                        {
                          required: true,
                          message: t(
                            "login_password_required",
                            "Please enter your password!"
                          ),
                        },
                      ]}
                      className="mt-2"
                    />

                    <CustomNumericCaptcha form={form} />

                    <Form.Item noStyle>
                      <div className="flex justify-between">
                        <Button
                          loading={loading}
                          type="primary"
                          htmlType="submit"
                          className="bg-orange-400 text-white ml-2"
                        >
                          {t("login_button", "Login")}
                        </Button>

                        <a
                          href="#"
                          onClick={openForgotPassword}
                          className="text-blue-500 text-sm underline ml-2"
                        >
                          {t("login_forgot_password", "Forgot Password?")}
                        </a>
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot password / OTP / reset password modal */}
      <Modal
        title={
          <h5 className="font-semibold mb-2">
            {!otpStep
              ? t("login_forgot_password_title", "Forgot Password")
              : t("login_set_new_password_title", "Set New Password")}
          </h5>
        }
        open={forgotPasswordVisible}
        onCancel={closeForgotPassword}
        width={400}
        footer={null}
        destroyOnClose
      >
        <Form
          form={otpStep ? resetForm : forgotForm}
          onFinish={otpStep ? handleResetPassword : handleForgotPassword}
          layout="vertical"
        >
          {!otpStep ? (
            <>
              <CustomInput
                label={t("login_phone_label", "Phone Number")}
                name="phone"
                rules={[
                  {
                    required: true,
                    message: t(
                      "login_phone_required",
                      "Please enter your phone number!"
                    ),
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: t(
                      "login_phone_invalid",
                      "Please enter a valid 10-digit phone number!"
                    ),
                  },
                ]}
                placeholder={t("login_phone_placeholder", "Phone Number")}
                maxLength={10}
                autoComplete="off"
                accept="onlyNumber"
                className="mt-2"
              />

              <CustomNumericCaptcha form={forgotForm} />

              <div className="text-center mt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-[30%]"
                >
                  {t("login_get_otp", "Get OTP")}
                </Button>
              </div>
            </>
          ) : (
            <>
              <CustomInput
                name="otp"
                label={t("login_otp_label", "One Time Password (OTP)")}
                placeholder={t("login_otp_placeholder", "One Time Password (OTP)")}
                rules={[
                  {
                    required: true,
                    message: t("login_otp_required", "Please enter OTP!"),
                  },
                ]}
                className="mt-2"
              />

              <CustomInput
                label={t("login_new_password_label", "New Password")}
                name="newPassword"
                placeholder={t("login_new_password_placeholder", "New Password")}
                maxLength={15}
                autoComplete="off"
                isPassword={true}
                rules={[
                  {
                    required: true,
                    message: t(
                      "login_new_password_required",
                      "Please enter a new password!"
                    ),
                  },
                  {
                    min: 6,
                    message: t(
                      "login_password_min_length",
                      "Password must be at least 6 characters."
                    ),
                  },
                ]}
                className="mt-2"
              />

              <div className="text-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-[30%]"
                >
                  {t("login_save_button", "Save")}
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Login;