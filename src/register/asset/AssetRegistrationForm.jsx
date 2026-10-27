
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import CustomSelect from "../../commonComponents/CustomSelect";
import { postData } from "../../Fetch/Axios";
import { getFormData } from "../../urils/getFormData";
import URLS from "../../urils/URLS";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import { getAssetMainTypes, getAssetTypes } from "../AssetType/AssetTypeSlice";
import AssetTypeSelectors from "../AssetType/assetTypeSelectors";
import { getParkingData } from "../parking/parkingSlice";
import ParkingSelector from "../parking/parkingSelector";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import MonitoringSelector from "../../complaince/monitoringSelector";
import { getMonitoringAgent } from "../../complaince/monitoringSlice";
import { getAssetTypeWiseVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import CustomInput from "../../commonComponents/CustomInput";
import { DICT } from "../../utils/dictionary";

const AssetRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

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

  const key = location.state?.key;
  const record = location.state?.record;
  const userRoleId = localStorage.getItem("role_id");

  const { SectorListDrop } = VendorSectorSelectors();
  const { parkingDrop } = ParkingSelector();
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors();
  const { AssetTypeVendorDrop } = VendorSupervisorSelector();
  const { monitoringAgentDrop } = MonitoringSelector();

  // Handle asset category selection
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
    });

    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url));
  };

  // Handle asset type selection
  const handleTypeSelect = (value) => {
    form.setFieldsValue({
      vendor_id: null,
    });

    if (value && userRoleId !== "8") {
      dispatch(getAssetTypeWiseVendorList(value));
    }
  };

  // Submit asset registration form
  const onFinish = async (values) => {
    setLoading(true);

    try {
      const finalData = {
        ...values,
      };

      if (key === "UpdateKey") {
        finalData.assets_id = record?.assets_id;
      }

      const res = await postData(
        getFormData(finalData),
        key === "UpdateKey"
          ? URLS?.edtAssetList?.path
          : URLS?.addAssetList?.path,
        {
          version: URLS?.edtAssetList?.version,
        }
      );

      if (res?.data?.success) {
        form.resetFields();
        navigate("/asset-list");
      }
    } catch (error) {
      console.error("Asset registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load dropdown data
  useEffect(() => {
    dispatch(getSectorsList());

    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl));

    const parkingUrl = URLS?.parking?.path;
    dispatch(getParkingData(parkingUrl));
  }, [dispatch]);

  // Populate form when editing an existing asset
  useEffect(() => {
    if (key === "UpdateKey") {
      if (record?.asset_main_type_id) {
        handleSelect(Number(record.asset_main_type_id));
      }

      if (record?.asset_type_id) {
        handleTypeSelect(Number(record.asset_type_id));
      }

      if (record?.created_by) {
        const urls =
          URLS?.monitoringAgent?.path +
          `&keywords=${record?.agent_name?.split(" ")[0] || ""}`;

        dispatch(getMonitoringAgent(urls));
      }

      form.setFieldsValue(record);
    }
  }, [record, key]);

  const isUpdate = key === "UpdateKey";

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        {/* Header */}
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => navigate("/asset-list")}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {isUpdate
                ? t("asset_form_update_asset", "Update Asset")
                : t("asset_form_add_asset", "Add Asset")}
            </div>

            <div className="text-xs">
              {t(
                "asset_form_mandatory_note",
                "All * marks fields are mandatory"
              )}
            </div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <CustomSelect
              name="asset_main_type_id"
              label={t("asset_form_category", "Category")}
              rules={[
                {
                  required: true,
                  message: t(
                    "asset_form_select_category_error",
                    "Please select category"
                  ),
                },
              ]}
              onSelect={handleSelect}
              placeholder={t(
                "asset_form_select_category",
                "Select Category"
              )}
              options={AssetMainTypeDrop || []}
            />

            <CustomSelect
              name="asset_type_id"
              label={t("asset_form_select_type", "Select Type")}
              placeholder={t("asset_form_select_type", "Select Type")}
              options={AssetTypeDrop || []}
              rules={[
                {
                  required: true,
                  message: t(
                    "asset_form_select_asset_type_error",
                    "Please select asset type"
                  ),
                },
              ]}
              onSelect={handleTypeSelect}
            />

            <CustomSelect
              name="vendor_id"
              label={t("asset_form_select_vendor", "Select Vendor")}
              placeholder={t("asset_form_select_vendor", "Select Vendor")}
              options={AssetTypeVendorDrop || []}
            />

            <CustomSelect
              name="created_by"
              label={t("asset_form_select_gsd", "Select GSD")}
              placeholder={t("asset_form_select_gsd", "Select GSD")}
              options={monitoringAgentDrop || []}
              isOnSearchFind={true}
              apiAction={getMonitoringAgent}
              onSearchUrl={`${URLS?.monitoringAgent?.path}&keywords=`}
            />

            <CustomInput
              name="code"
              label={t("asset_form_asset_code", "Asset Code")}
              placeholder={t("asset_form_asset_code", "Asset Code")}
              rules={[
                {
                  required: true,
                  message: t(
                    "asset_form_asset_code_error",
                    "Please enter asset code"
                  ),
                },
              ]}
            />

            <CustomInput
              name="unit"
              label={t("asset_form_units", "Units")}
              placeholder={t("asset_form_unit_placeholder", "Enter Unit")}
              rules={[
                {
                  required: true,
                  message: t(
                    "asset_form_unit_error",
                    "Please enter unit"
                  ),
                },
              ]}
            />

            <CustomSelect
              name="sector_id"
              label={t("asset_form_select_sector", "Select Sector")}
              placeholder={t("asset_form_select_sector", "Select Sector")}
              options={SectorListDrop || []}
            />

            <CustomSelect
              name="parking_id"
              label={t("asset_form_select_parking", "Select Parking")}
              placeholder={t("asset_form_select_parking", "Select Parking")}
              options={parkingDrop || []}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {isUpdate
                  ? t("asset_form_update_asset", "Update Asset")
                  : t("asset_form_add_asset", "Add Asset")}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AssetRegistrationForm;
