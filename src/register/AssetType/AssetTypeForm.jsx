
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { useDispatch } from "react-redux";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import { getAssetMainTypes, getSLATypes } from "./AssetTypeSlice";
import AssetTypeSelectors from "./assetTypeSelectors";
import { getQuestionList } from "../questions/questionSlice";
import QuestionSelector from "../questions/questionSelector";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";
import { DICT } from "../../utils/dictionary";

const AssetTypeForm = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const key = location.state?.key;
  const record = location.state?.record;

  // Language context
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

  const { AssetMainTypeDrop, SLATypeDrop } = AssetTypeSelectors();
  const { QuestionDrop } = QuestionSelector();

  const onFinish = async (values) => {
    const stringQuestions = values?.questions?.length
      ? values.questions.map((data) => String(data)).join(", ")
      : "No questions available";

    const stringSla = values?.slas?.length
      ? values.slas.map((data) => String(data)).join(", ")
      : "No slas available";

    const finalData = {
      ...values,
      status: 1,
      questions: stringQuestions,
      slas: stringSla,
    };

    setLoading(true);

    try {
      if (key === "UpdateKey") {
        finalData.asset_type_id = record?.asset_type_id;
      }

      const res = await postData(
        getFormData(finalData),
        key === "UpdateKey"
          ? URLS.editAssetType.path
          : URLS.assetTypeEntry.path,
        {
          version: URLS.register.version,
        }
      );

      if (res?.data?.success) {
        form.resetFields();
        navigate("/asset-type-list");
      }
    } catch (error) {
      console.error("Failed to save asset type:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl));

    dispatch(getQuestionList());

    const slaUrl = URLS?.slaTypes?.path;
    dispatch(getSLATypes(slaUrl));
  }, [dispatch]);

  // Populate the form when editing an existing record
  useEffect(() => {
    if (record) {
      const questionId = record?.questions?.map(
        (data) => data?.question_id
      );

      const slasArray =
        Number(record?.slas) === 0
          ? []
          : record?.slas
              ?.split(",")
              .map((item) => item?.trim()) || [];

      form.setFieldsValue({
        asset_main_type_id: record?.asset_main_type_id,
        name: record?.name,
        asset_type_id: record?.asset_type_id,
        name_hi: record?.name_hi,
        description: record?.description,
        questions: questionId,
        slas: slasArray,
      });
    } else {
      form.resetFields();
    }
  }, [record, key, form]);

  const isUpdate = key === "UpdateKey";

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => navigate("/asset-type-list")}
            aria-label={t("asset_type_form_back", "Back")}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {isUpdate
                ? t(
                    "asset_type_form_update_title",
                    "Update Toilets & Tentage Type"
                  )
                : t(
                    "asset_type_form_add_title",
                    "Add Toilets & Tentage Type"
                  )}
            </div>

            <div className="text-xs">
              {t(
                "asset_type_form_mandatory_note",
                "All * marks fields are mandatory"
              )}
            </div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 mb-3">
            <CustomSelect
              name="asset_main_type_id"
              label={t("asset_type_form_category", "Category")}
              rules={[
                {
                  required: true,
                  message: t(
                    "asset_type_form_category_required",
                    "Please select category"
                  ),
                },
              ]}
              placeholder={t(
                "asset_type_form_select_category",
                "Select Category"
              )}
              options={AssetMainTypeDrop || []}
            />

            <CustomInput
              name="name"
              label={
                <div className="font-semibold">
                  {t(
                    "asset_type_form_type_name",
                    "Toilets & Tentage Type Name"
                  )}
                </div>
              }
              rules={[
                {
                  required: true,
                  message: t(
                    "asset_type_form_type_name_required",
                    "Please enter a toilets & tentage type"
                  ),
                },
              ]}
              placeholder={t(
                "asset_type_form_enter_type_name",
                "Enter Toilets & Tentage Type Name"
              )}
            />

            <CustomInput
              name="name_hi"
              label={
                <div className="font-semibold">
                  {t("asset_type_form_hindi_name", "Hindi Name")}
                </div>
              }
              rules={[
                {
                  required: true,
                  message: t(
                    "asset_type_form_hindi_required",
                    "Please enter Hindi text"
                  ),
                },
              ]}
              placeholder={t(
                "asset_type_form_enter_hindi",
                "Enter Hindi text"
              )}
            />

            <CustomSelect
              name="slas"
              label={t("asset_type_form_sla_label", "Select SLA Type")}
              rules={[
                {
                  required: true,
                  message: t(
                    "asset_type_form_sla_required",
                    "Please select SLA type"
                  ),
                },
              ]}
              placeholder={t(
                "asset_type_form_sla_placeholder",
                "Select SLA Type"
              )}
              options={SLATypeDrop || []}
              mode="multiple"
            />

            <CustomSelect
              name="questions"
              label={t(
                "asset_type_form_questions_label",
                "Select Questions"
              )}
              placeholder={t(
                "asset_type_form_questions_placeholder",
                "Select Questions"
              )}
              options={QuestionDrop || []}
              mode="multiple"
            />

            <CustomInput
              type="textarea"
              name="description"
              label={
                <div className="font-semibold">
                  {t("asset_type_form_description", "Description")}
                </div>
              }
              placeholder={t(
                "asset_type_form_description_placeholder",
                "Toilets & Tentage Type Description"
              )}
            />
          </div>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
                loading={loading}
              >
                {isUpdate
                  ? t("asset_type_form_update_button", "Update")
                  : t("asset_type_form_add_button", "Add")}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AssetTypeForm;
