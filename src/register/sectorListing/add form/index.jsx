
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import { Form, Button, Divider, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { postData } from "../../../Fetch/Axios";
import URLS from "../../../urils/URLS";
import CustomTimepicker from "../../../commonComponents/CustomTimePicker";
import CustomSelect from "../../../commonComponents/CustomSelect";
import CustomInput from "../../../commonComponents/CustomInput";
import { statusOptions } from "../../../constant/const";
import { DICT } from "../../../utils/dictionary";

const AddSectorForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

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

  const isUpdate = key === "UpdateKey";

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const fromTimeFormatted = values?.from_time
        ? dayjs(values.from_time).format("HH:mm:ss")
        : undefined;

      const toTimeFormatted = values?.to_time
        ? dayjs(values.to_time).format("HH:mm:ss")
        : undefined;

      const finalData = {
        ...values,
        from_time: fromTimeFormatted,
        to_time: toTimeFormatted,
        ...(isUpdate && {
          sector_id: Number(record?.sector_id),
        }),
      };

      const res = await postData(
        finalData,
        isUpdate ? URLS.sectorEdit.path : URLS.sectorAdd.path,
        { version: URLS.sectorEdit.version }
      );

      if (res?.data?.success) {
        message.success(
          isUpdate
            ? t("sector_form_update_success", "Sector updated successfully")
            : t("sector_form_add_success", "Sector added successfully")
        );

        form.resetFields();
        navigate("/sectors-listing");
      } else {
        message.error(
          res?.data?.message ||
            t("sector_form_save_failed", "Unable to save sector")
        );
      }
    } catch (error) {
      message.error(
        t(
          "sector_form_error",
          "Something went wrong. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUpdate && record) {
      form.setFieldsValue({
        sector_id: Number(record?.sector_id),
        name: record?.name,
        status: Number(record?.status) === 2 ? "Deactive" : "Active",
        from_time: record?.from_time
          ? dayjs(record.from_time, "HH:mm:ss")
          : undefined,
        to_time: record?.to_time
          ? dayjs(record.to_time, "HH:mm:ss")
          : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [record, key, form]);

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => navigate("/sectors-listing")}
            aria-label={t("sector_form_back", "Back")}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {isUpdate
                ? t("sector_form_update_title", "Update Sector")
                : t("sector_form_add_title", "Add Sector")}
            </div>

            <div className="text-xs">
              {t(
                "sector_form_mandatory_note",
                "All * marked fields are mandatory"
              )}
            </div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <CustomInput
              name="name"
              label={t("sector_form_name_label", "Sector Name")}
              placeholder={t("sector_form_name_placeholder", "Sector Name")}
              rules={[
                {
                  required: true,
                  message: t(
                    "sector_form_name_required",
                    "Please enter the Sector Name"
                  ),
                },
              ]}
            />
          </div>

          <Form.Item>
            <div className="flex w-full justify-end">
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {isUpdate
                  ? t("sector_form_update_button", "Update Sector")
                  : t("sector_form_add_button", "Add Sector")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddSectorForm;
