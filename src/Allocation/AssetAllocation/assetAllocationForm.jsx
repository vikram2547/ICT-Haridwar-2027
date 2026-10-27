
import React, { useEffect, useState } from "react";
import { Form, Button, Divider, message } from "antd";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { useDispatch } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";

import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import CustomSelect from "../../commonComponents/CustomSelect";
import { getMonitoringAgent } from "../../complaince/monitoringSlice";
import MonitoringSelector from "../../complaince/monitoringSelector";
import CustomInput from "../../commonComponents/CustomInput";
import { postData } from "../../Fetch/Axios";

// Assign sector to user type
const AssetAllocationForm = () => {
  const [dict, lang] = useOutletContext();

  const t = (key, fallback) =>
    dict?.[key]?.[lang] ??
    dict?.[key]?.en ??
    fallback ??
    key;

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const key = location.state?.key;
  const record = location.state?.record;

  const [form] = Form.useForm();
  const { monitoringAgentDrop } = MonitoringSelector();

  const isUpdate = key === "UpdateKey";

  const onFinish = async (values) => {
    const finalData = {
      phone: values.allocated_phone,
      assets_code: values.asset_code,
    };

    setLoading(true);

    try {
      const res = await postData(
        getFormData(finalData),
        isUpdate
          ? URLS.reAllocate_Asset.path
          : URLS.addAllocate_Sector.path,
        {
          version: URLS.reAllocate_Asset.version,
        }
      );

      if (res?.data?.success) {
        form.resetFields();
        navigate("/asset-allocation");
      } else if (res) {
        message.error(
          t(
            "asset_allocation_failed",
            "Asset allocation failed. Please try again."
          )
        );
      }
    } catch (error) {
      message.error(
        t(
          "asset_allocation_error",
          "Something went wrong. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Set existing values for re-allocation
  useEffect(() => {
    if (isUpdate && record) {
      if (record?.user_id) {
        const urls =
          URLS?.monitoringAgent?.path +
          `&keywords=${record?.allocated_user?.split(" ")[0] || ""}`;

        dispatch(getMonitoringAgent(urls));
      }

      form.setFieldsValue(record);
    }
  }, [record, key, dispatch, form]);

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            aria-label={t("back", "Back")}
            title={t("back", "Back")}
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => navigate("/asset-allocation")}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {isUpdate
                ? t(
                    "asset_reallocation_title",
                    "Re-Allocation of Asset"
                  )
                : t(
                    "asset_allocation_title",
                    "Add Allocation of Asset"
                  )}
            </div>

            <div className="text-xs">
              {t(
                "mandatory_fields_note",
                "All * marked fields are mandatory"
              )}
            </div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            <CustomSelect
              name="user_id"
              label={t("select_gsd", "Select GSD")}
              disabled={true}
              placeholder={t("select_gsd", "Select GSD")}
              options={monitoringAgentDrop || []}
              isOnSearchFind={true}
              allowClear={false}
              apiAction={getMonitoringAgent}
              onSearchUrl={`${URLS?.monitoringAgent?.path}&keywords=`}
            />

            <CustomInput
              name="allocated_phone"
              label={t("phone", "Phone")}
              placeholder={t("phone", "Phone")}
              rules={[
                {
                  required: true,
                  message: t(
                    "asset_phone_required",
                    "Please add phone number!"
                  ),
                },
              ]}
            />

            <CustomInput
              name="asset_code"
              label={t("asset_code", "Asset Code")}
              placeholder={t("asset_code", "Asset Code")}
              rules={[
                {
                  required: true,
                  message: t(
                    "asset_code_required",
                    "Please add asset code!"
                  ),
                },
              ]}
            />
          </div>

          <div className="flex justify-end">
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="w-fit rounded-none bg-5c"
            >
              {isUpdate
                ? t("asset_reallocate_button", "Reallocate")
                : t("asset_register_button", "Register")}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AssetAllocationForm;
