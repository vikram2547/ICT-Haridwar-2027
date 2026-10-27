
import React, { useState } from "react";
import { Form, Input, Button, Divider, message } from "antd";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useOutletContext } from "react-router";
import CommonFormDropDownMaker from "../../commonComponents/CommonFormDropDownMaker";
import { DICT } from "../../utils/dictionary";

const AssignRouteForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      values.status = 1;

      const res = await postData(
        getFormData(values),
        URLS.assignRoute.path,
        {
          version: URLS.assignRoute.version,
        }
      );

      if (res?.data?.success) {
        message.success(t("assign_route_success", "Route assigned successfully"));
        form.resetFields();
        navigate("/assigned-routelist");
      } else {
        message.error(
          res?.data?.message ||
            t("assign_route_failed", "Failed to assign route")
        );
      }
    } catch (error) {
      message.error(
        t("assign_route_error", "Something went wrong. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => navigate("/assigned-routelist")}
            aria-label={t("assign_route_back", "Back")}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {t("assign_route_title", "Assign Route")}
            </div>

            <div className="text-xs">
              {t(
                "assign_route_mandatory_note",
                "All * marks fields are mandatory"
              )}
            </div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <CommonFormDropDownMaker
              uri="vendors"
              responseListName="users"
              responseLabelName="name"
              responseIdName="user_id"
              selectLabel={t("assign_route_vendor", "Vendor")}
              selectName="user_id"
              RequiredMessage={t(
                "assign_route_vendor_required",
                "Vendor is required!"
              )}
            />

            <Form.Item
              label={t("assign_route_vehicle_number", "Vehicle Number")}
              name="rc"
            >
              <Input
                placeholder={t(
                  "assign_route_vehicle_placeholder",
                  "Enter vehicle number"
                )}
                className="rounded-none"
              />
            </Form.Item>

            <Form.Item
              label={t("assign_route_name", "Assign Route")}
              name="name"
            >
              <Input
                placeholder={t(
                  "assign_route_name_placeholder",
                  "Enter route name"
                )}
                className="rounded-none"
              />
            </Form.Item>
          </div>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {t("assign_route_submit", "Assign Route")}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AssignRouteForm;
