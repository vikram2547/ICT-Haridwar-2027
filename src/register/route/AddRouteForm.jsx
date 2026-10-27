
import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router";
import { useDispatch } from "react-redux";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import CustomInput from "../../commonComponents/CustomInput";
import CustomSelect from "../../commonComponents/CustomSelect";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import { getRoutePickUpPointDrop } from "./routeSlice";
import RouteSelector from "./routeSelector";
import { postData } from "../../Fetch/Axios";
import { getFormData } from "../../urils/getFormData";
import URLS from "../../urils/URLS";
import { DICT } from "../../utils/dictionary";

const AddRouteForm = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

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

  const { SectorListDrop } = VendorSectorSelectors();
  const { PickUpPointDropdownData, loading } = RouteSelector();

  const isUpdate = key === "UpdateKey";

  const onFinish = async (values) => {
    const finalData = {
      ...values,
    };

    if (isUpdate) {
      finalData.pickup_route_id = record?.pickup_route_id;
    }

    setSubmitting(true);

    try {
      const res = await postData(
        getFormData(finalData),
        isUpdate
          ? URLS?.editPickUpRoute?.path
          : URLS?.addPickUpRoute?.path,
        {
          version: URLS?.editPickUpRoute?.version,
        }
      );

      if (res?.data?.success) {
        form.resetFields();
        navigate("/route-list");
      }
    } catch (error) {
      console.error("Failed to save route:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    dispatch(getSectorsList());
    dispatch(getRoutePickUpPointDrop());
  }, [dispatch]);

  // Populate form when editing an existing route
  useEffect(() => {
    if (isUpdate && record) {
      form.setFieldsValue(record);
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
            onClick={() => navigate("/route-list")}
            aria-label={t("route_form_back", "Back")}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {isUpdate
                ? t("route_form_update_title", "Update Route")
                : t("route_form_add_title", "Add Route")}
            </div>

            <div className="text-xs">
              {t(
                "route_form_mandatory_note",
                "All * marked fields are mandatory"
              )}
            </div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <CustomSelect
              name="sector_id"
              label={t("route_form_sector_label", "Select Sector")}
              placeholder={t(
                "route_form_sector_placeholder",
                "Select Sector"
              )}
              rules={[
                {
                  required: true,
                  message: t(
                    "route_form_sector_required",
                    "Please select Sector"
                  ),
                },
              ]}
              options={SectorListDrop || []}
            />

            <CustomInput
              label={t("route_form_vehicle_label", "Vehicle Number")}
              placeholder={t(
                "route_form_vehicle_placeholder",
                "Enter Vehicle Number"
              )}
              name="vehicle_number"
            />

            <CustomInput
              label={t("route_form_name_label", "Route Name")}
              placeholder={t(
                "route_form_name_placeholder",
                "Enter Route Name"
              )}
              name="route_name"
              rules={[
                {
                  required: true,
                  message: t(
                    "route_form_name_required",
                    "Please enter Route Name"
                  ),
                },
              ]}
            />

            <CustomSelect
              label={t("route_form_start_label", "Start Point")}
              placeholder={t(
                "route_form_start_placeholder",
                "Select Start Point"
              )}
              name="start_point_id"
              options={PickUpPointDropdownData || []}
            />

            <CustomSelect
              name="middle_point_id"
              label={t(
                "route_form_middle_label",
                "Select Middle Points"
              )}
              placeholder={t(
                "route_form_middle_placeholder",
                "Select Middle Points"
              )}
              options={PickUpPointDropdownData || []}
            />

            <CustomSelect
              label={t("route_form_end_label", "End Point")}
              placeholder={t(
                "route_form_end_placeholder",
                "Select End Point"
              )}
              name="end_point_id"
              options={PickUpPointDropdownData || []}
            />

            <CustomInput
              label={t(
                "route_form_distance_label",
                "Distance (meters)"
              )}
              placeholder={t(
                "route_form_distance_placeholder",
                "Enter Distance"
              )}
              name="distance"
            />
          </div>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                loading={loading || submitting}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {isUpdate
                  ? t("route_form_update_button", "Update Route")
                  : t("route_form_add_button", "Add Route")}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddRouteForm;
