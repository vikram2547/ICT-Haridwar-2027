
import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import { QuestionType, yesNoType } from "../../constant/const";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";
import { DICT } from "../../utils/dictionary";

const QuestionRegistrationForm = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
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

  // Set form values for add/update
  useEffect(() => {
    if (key === "UpdateKey" && record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldValue("type", "C");
    }
  }, [record, key, form]);

  const onFinish = async (values) => {
    setLoading(true);

    const finalData = {
      ...values,
      status: 1,
    };

    if (key === "UpdateKey") {
      finalData.question_id = record?.question_id;
    }

    try {
      const res = await postData(
        getFormData(finalData),
        key === "UpdateKey"
          ? URLS.editQuestionsEntry.path
          : URLS.questionsEntry.path,
        {
          version: URLS.register.version,
        }
      );

      if (res?.data?.success) {
        form.resetFields();
        navigate("/questions");
      }
    } catch (error) {
      console.error("Failed to save question:", error);
    } finally {
      setLoading(false);
    }
  };

  const isUpdate = key === "UpdateKey";

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => navigate("/questions")}
            aria-label={t("question_form_back", "Back")}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {isUpdate
                ? t("question_form_update_title", "Update Question")
                : t("question_form_add_title", "Add Question")}
            </div>

            <div className="text-xs">
              {t(
                "question_form_mandatory_note",
                "All * marked fields are mandatory"
              )}
            </div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <CustomInput
            label={t("question_form_english_label", "Question (English)")}
            name="question_en"
            rules={[
              {
                required: true,
                message: t(
                  "question_form_english_required",
                  "Please enter the question in English"
                ),
              },
            ]}
            placeholder={t(
              "question_form_english_placeholder",
              "Enter question in English"
            )}
          />

          <CustomInput
            label={t("question_form_hindi_label", "Question (Hindi)")}
            name="question_hi"
            placeholder={t(
              "question_form_hindi_placeholder",
              "Enter question in Hindi"
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CustomSelect
              label={t("question_form_is_image_label", "Is Image")}
              name="is_image"
              rules={[
                {
                  required: true,
                  message: t(
                    "question_form_option_required",
                    "Please select an option"
                  ),
                },
              ]}
              placeholder={t(
                "question_form_is_image_placeholder",
                "Select if image is required"
              )}
              options={yesNoType || []}
            />

            <CustomSelect
              label={t("question_form_is_image_on_label", "Is Image On")}
              name="is_image_on"
              rules={[
                {
                  required: true,
                  message: t(
                    "question_form_option_required",
                    "Please select an option"
                  ),
                },
              ]}
              placeholder={t(
                "question_form_is_image_on_placeholder",
                "Select if image is active"
              )}
              options={yesNoType || []}
            />

            <CustomSelect
              label={t("question_form_is_primary_label", "Is Primary")}
              name="is_primary"
              rules={[
                {
                  required: true,
                  message: t(
                    "question_form_option_required",
                    "Please select an option"
                  ),
                },
              ]}
              placeholder={t(
                "question_form_is_primary_placeholder",
                "Select if primary"
              )}
              options={yesNoType || []}
            />

            <CustomSelect
              label={t("question_form_type_label", "Question Type")}
              name="type"
              rules={[
                {
                  required: true,
                  message: t(
                    "question_form_type_required",
                    "Please select a question type"
                  ),
                },
              ]}
              placeholder={t(
                "question_form_type_placeholder",
                "Select type"
              )}
              options={QuestionType || []}
            />
          </div>

          <CustomInput
            type="textarea"
            label={t("question_form_description_label", "Description")}
            name="description"
            rules={[
              {
                required: true,
                message: t(
                  "question_form_description_required",
                  "Please enter a description"
                ),
              },
            ]}
            placeholder={t(
              "question_form_description_placeholder",
              "Enter description"
            )}
          />

          <Form.Item>
            <div className="flex w-full justify-end">
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {isUpdate
                  ? t(
                      "question_form_update_button",
                      "Update Question"
                    )
                  : t("question_form_add_button", "Add Question")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default QuestionRegistrationForm;
