
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { useDispatch } from "react-redux";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import CustomSelect from "../../commonComponents/CustomSelect";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import { vehicleType } from "../../constant/const";
import CustomInput from "../../commonComponents/CustomInput";
import { DICT } from "../../utils/dictionary";

const AddVehicleForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const key = location.state?.key;
  const record = location.state?.record;

  // Language context
  const outletContext = useOutletContext() || [];
  const contextDict = outletContext[0] || {};
  const lang = outletContext[1] || localStorage.getItem("lang") || "en";

  const t = (key, fallback) =>
    contextDict?.[key]?.[lang] ??
    contextDict?.[key]?.en ??
    DICT?.[key]?.[lang] ??
    DICT?.[key]?.en ??
    fallback ??
    key;

  const { VendorListDrop } = VendorSupervisorSelector();

  const isUpdate = key === "UpdateKey";

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const finalValues = {
        ...values,
        status: 1,
      };

      if (isUpdate) {
        finalValues.vehicle_id = record?.vehicle_id;
      }

      const res = await postData(
        getFormData(finalValues),
        isUpdate ? URLS.editVehicle.path : URLS.addVehicle.path,
        {
          version: URLS.addVehicle.version,
        }
      );

      if (res?.data?.success) {
        form.resetFields();
        navigate("/vehicle");
      }
    } catch (error) {
      console.error("Vehicle form submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getVendorList());
  }, [dispatch]);

  useEffect(() => {
    if (isUpdate && record) {
      form.setFieldsValue(record);
    }
  }, [form, record, isUpdate]);

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => navigate("/vehicle")}
            aria-label={t("vehicle_form_back", "Back")}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {isUpdate
                ? t("vehicle_form_update_title", "Update Vehicle")
                : t("vehicle_form_add_title", "Add Vehicle")}
            </div>

            <div className="text-xs">
              {t(
                "vehicle_form_mandatory_note",
                "All * marks fields are mandatory"
              )}
            </div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <CustomSelect
              name="user_id"
              label={t("vehicle_form_vendor_label", "Select Vendor")}
              placeholder={t(
                "vehicle_form_vendor_placeholder",
                "Select Vendor"
              )}
              options={VendorListDrop || []}
              rules={[
                {
                  required: true,
                  message: t(
                    "vehicle_form_vendor_required",
                    "Please select Vendor"
                  ),
                },
              ]}
            />

            <CustomSelect
              label={t("vehicle_form_type_label", "Vehicle Type")}
              name="type"
              placeholder={t(
                "vehicle_form_type_placeholder",
                "Select Vehicle Type"
              )}
              options={vehicleType || []}
            />

            <CustomInput
              label={t("vehicle_form_number_label", "Vehicle Number")}
              name="number"
              placeholder={t(
                "vehicle_form_number_placeholder",
                "e.g. AA00AA0000"
              )}
              maxLength={10}
            />

            <CustomInput
              label={t("vehicle_form_imei_label", "IMEI Number")}
              name="imei"
              placeholder={t(
                "vehicle_form_imei_placeholder",
                "Enter IMEI number"
              )}
            />

            <CustomInput
              label={t("vehicle_form_chassis_label", "Chassis Number")}
              name="chassis_no"
              placeholder={t(
                "vehicle_form_chassis_placeholder",
                "Enter chassis number"
              )}
            />

            <div className="flex w-full justify-end items-end">
              <Form.Item>
                <div className="flex w-full justify-end">
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    className="w-fit rounded-none bg-5c"
                  >
                    {isUpdate
                      ? t("vehicle_form_update_button", "Update Vehicle")
                      : t("vehicle_form_add_button", "Add Vehicle")}
                  </Button>
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddVehicleForm;
