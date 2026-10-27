
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router";
import dayjs from "dayjs";
import { Form, Button, Divider, message, InputNumber } from "antd";
import {
  ArrowLeftOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { postData } from "../../../Fetch/Axios";
import URLS from "../../../urils/URLS";
import { getFormData } from "../../../urils/getFormData";
import { getParkingData } from "../../parking/parkingSlice";
import ParkingSelector from "../../parking/parkingSelector";
import { getValueLabel } from "../../../constant/const";
import CustomSelect from "../../../commonComponents/CustomSelect";
import AssetTypeSelectors from "../../AssetType/assetTypeSelectors";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../../AssetType/AssetTypeSlice";
import { getSectorsList } from "../../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import CustomDatepicker from "../../../commonComponents/CustomDatepicker";
import CustomInput from "../../../commonComponents/CustomInput";
import { DICT } from "../../../utils/dictionary";

const dateFormat = "YYYY-MM-DD";

const VendorDetailsForm = () => {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [parkQuantity, setParkQuantity] = useState(0);

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const key = location.state?.key;
  const record = location.state?.record;
  const isUpdate = key === "UpdateKey";

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

  const { parkingDrop } = ParkingSelector();
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors();
  const { SectorListDrop } = VendorSectorSelectors();

  // Prepopulate form when editing vendor details
  useEffect(() => {
    if (!isUpdate || !record) return;

    const proposedParkings = record?.proposedparkings || [];
    const proposedSectors = record?.proposedsectors || [];

    const parkEdit = proposedParkings.map((data) => ({
      quantity: Number(data?.quantity || 0),
      parking: data?.parking_id,
    }));

    const totalParkingQuantity = proposedParkings.reduce(
      (total, data) => total + Number(data?.quantity || 0),
      0
    );

    setParkQuantity(totalParkingQuantity);

    form.setFieldsValue({
      parking_info: parkEdit,
    });

    const url = URLS?.assetType?.path + record?.asset_main_type_id;
    dispatch(getAssetTypes(url));

    const updatedDetails = {
      ...record,
      date_of_allocation: record?.date_of_allocation
        ? dayjs(record.date_of_allocation)
        : null,
    };

    const sectorInfo = [];
    let totalSectorQuantity = 0;

    if (proposedSectors.length) {
      totalSectorQuantity = Number(proposedSectors[0]?.quantity || 0);

      form.setFieldsValue({
        sector: proposedSectors[0]?.sector_id,
        quantity: Number(proposedSectors[0]?.quantity || 0),
      });

      for (let index = 1; index < proposedSectors.length; index++) {
        sectorInfo.push({
          sector: proposedSectors[index]?.sector_id,
          quantity: Number(proposedSectors[index]?.quantity || 0),
        });

        totalSectorQuantity += Number(
          proposedSectors[index]?.quantity || 0
        );
      }

      setQuantity(totalSectorQuantity);

      form.setFieldsValue({
        sector_info: sectorInfo,
      });
    } else {
      setQuantity(0);
      form.setFieldsValue({
        sector: undefined,
        quantity: undefined,
        sector_info: [],
      });
    }

    form.setFieldsValue(updatedDetails);
  }, [isUpdate, record, form, dispatch]);

  // Category selection
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
    });

    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url));
  };

  // Validate duplicate sectors
  const handelQuantitySector = () => {
    const vals = form.getFieldsValue();
    const selected = [];

    if (vals?.sector) selected.push(vals.sector);

    if (vals?.sector_info) {
      for (const item of vals.sector_info) {
        if (item?.sector) {
          if (selected.includes(item.sector)) {
            message.info(
              t(
                "vendor_details_form_sector_duplicate",
                "Sector already selected!"
              )
            );
          } else {
            selected.push(item.sector);
          }
        }
      }
    }
  };

  // Validate duplicate parking
  const handelQuantityParking = () => {
    const vals = form.getFieldsValue();
    const selected = [];

    if (vals?.parking) selected.push(vals.parking);

    if (vals?.parking_info) {
      for (const item of vals.parking_info) {
        if (item?.parking) {
          if (selected.includes(item.parking)) {
            message.info(
              t(
                "vendor_details_form_parking_duplicate",
                "Parking already selected!"
              )
            );
          } else {
            selected.push(item.parking);
          }
        }
      }
    }
  };

  // Calculate sector quantity
  const handelQuantity = () => {
    const vals = form.getFieldsValue();
    let total = Number(vals.quantity || 0);

    if (vals?.sector_info) {
      for (const item of vals.sector_info) {
        total += Number(item?.quantity || 0);
      }
    }

    setQuantity(total);
  };

  // Calculate parking quantity
  const handelParkQuantity = () => {
    const vals = form.getFieldsValue();
    let total = 0;

    if (vals?.parking_info) {
      for (const item of vals.parking_info) {
        total += Number(item?.quantity || 0);
      }
    }

    setParkQuantity(total);
  };

  // Submit vendor details
  const onFinish = async (values) => {
    if (!params.id) {
      message.info(
        t("vendor_details_form_invalid_user", "Invalid user.")
      );
      return;
    }

    setLoading(true);

    try {
      values.user_id = params.id;

      if (values.date_of_allocation) {
        values.date_of_allocation =
          values.date_of_allocation.format(dateFormat);
      }

      if (isUpdate) {
        values.vendor_detail_id = record?.vendor_detail_id;
      }

      const vals = form.getFieldsValue();

      // Collect sectors and quantities
      const selectedSectors = [];
      const quantities = [];

      if (vals.sector) {
        selectedSectors.push(vals.sector);
        quantities.push(vals.quantity);
      }

      if (vals?.sector_info) {
        for (const item of vals.sector_info) {
          if (item?.sector) {
            if (selectedSectors.includes(item.sector)) {
              const duplicateSector = (SectorListDrop || []).find(
                (sector) => sector?.value == item.sector
              );

              message.error(
                `${duplicateSector?.label || ""} ${t(
                  "vendor_details_form_duplicate_found",
                  "is already selected."
                )}`
              );

              return;
            }

            selectedSectors.push(item.sector);
            quantities.push(item.quantity);
          }
        }
      }

      values.proposed_sectors_quantity = quantities.join(",");
      values.proposed_sectors_id = selectedSectors.join(",");
      values.total_allotted_quantity =
        Number(quantity || 0) + Number(parkQuantity || 0);

      delete values.sector_info;

      // Collect parking and quantities
      const selectedParking = [];
      const parkQuantities = [];

      if (vals?.parking_info) {
        for (const item of vals.parking_info) {
          if (item?.parking) {
            if (selectedParking.includes(item.parking)) {
              const parkingLabel = getValueLabel(
                item.parking,
                parkingDrop,
                "parking"
              );

              message.error(
                `${parkingLabel || ""} ${t(
                  "vendor_details_form_duplicate_found",
                  "is already selected."
                )}`
              );

              return;
            }

            selectedParking.push(item.parking);
            parkQuantities.push(item.quantity);
          }
        }
      }

      values.proposed_parkings_quantity = parkQuantities.join(",");
      values.proposed_parkings_id = selectedParking.join(",");

      delete values.parking_info;

      const res = await postData(
        getFormData(values),
        isUpdate
          ? URLS.editVendorDetails.path
          : URLS.addVendorDetails.path,
        {
          version: URLS.addVendorDetails.version,
        }
      );

      if (res?.data?.success) {
        form.resetFields();
        navigate("/vendor/add-vendor-details/" + params.id);
      }
    } catch (error) {
      message.error(
        t(
          "vendor_details_form_submit_error",
          "Unable to save vendor details. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!params.id) {
      navigate("/vendor");
    }
  }, [params.id, navigate]);

  // Load dropdown data
  useEffect(() => {
    dispatch(getSectorsList());

    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl));

    const parkingUrl = URLS?.parking?.path;
    dispatch(getParkingData(parkingUrl));
  }, [dispatch]);

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => {
              if (params.id) {
                navigate("/vendor/add-vendor-details/" + params.id);
              } else {
                navigate("/vendor");
              }
            }}
            aria-label={t("vendor_details_form_back", "Back")}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {isUpdate
                ? `${t(
                    "vendor_details_form_update_title",
                    "Update Vendor Details"
                  )} ${record?.user_name || ""}`
                : t(
                    "vendor_details_form_title",
                    "Vendor Details"
                  )}
            </div>

            <div className="text-xs">
              {t(
                "vendor_details_form_mandatory_note",
                "All * marks fields are mandatory"
              )}
            </div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            <CustomSelect
              name="asset_main_type_id"
              label={t(
                "vendor_details_form_category_label",
                "Select Category"
              )}
              placeholder={t(
                "vendor_details_form_category_placeholder",
                "Select Category"
              )}
              onSelect={handleSelect}
              options={AssetMainTypeDrop || []}
              rules={[
                {
                  required: true,
                  message: t(
                    "vendor_details_form_category_required",
                    "Please select category."
                  ),
                },
              ]}
            />

            <CustomSelect
              name="asset_type_id"
              label={t(
                "vendor_details_form_type_label",
                "Select Type"
              )}
              placeholder={t(
                "vendor_details_form_type_placeholder",
                "Select Type"
              )}
              options={AssetTypeDrop || []}
              rules={[
                {
                  required: true,
                  message: t(
                    "vendor_details_form_asset_type_required",
                    "Please select asset type."
                  ),
                },
              ]}
            />

            <CustomInput
              label={
                <div className="font-semibold">
                  {t("vendor_details_form_loe_label", "LOE Number")}
                </div>
              }
              name="contract_number"
              rules={[
                {
                  required: true,
                  message: t(
                    "vendor_details_form_loe_required",
                    "Please enter LOE number."
                  ),
                },
              ]}
              placeholder={t(
                "vendor_details_form_loe_placeholder",
                "LOE Number"
              )}
            />

            <CustomInput
              label={
                <div className="font-semibold">
                  {t(
                    "vendor_details_form_manager_contact_1",
                    "Manager Contact 1"
                  )}
                </div>
              }
              name="manager_contact_1"
              rules={[
                {
                  required: true,
                  message: t(
                    "vendor_details_form_manager_contact_1_required",
                    "Please enter manager contact 1."
                  ),
                },
              ]}
              accept="onlyNumber"
              maxLength={10}
              placeholder={t(
                "vendor_details_form_manager_contact_1_placeholder",
                "Manager Contact 1"
              )}
            />

            <CustomInput
              label={
                <div className="font-semibold">
                  {t(
                    "vendor_details_form_manager_contact_2",
                    "Manager Contact 2"
                  )}
                </div>
              }
              name="manager_contact_2"
              rules={[
                {
                  required: true,
                  message: t(
                    "vendor_details_form_manager_contact_2_required",
                    "Please enter manager contact 2."
                  ),
                },
              ]}
              accept="onlyNumber"
              maxLength={10}
              placeholder={t(
                "vendor_details_form_manager_contact_2_placeholder",
                "Manager Contact 2"
              )}
            />

            <CustomInput
              label={
                <div className="font-semibold">
                  {t(
                    "vendor_details_form_work_order_number",
                    "Work Order Number"
                  )}
                </div>
              }
              name="work_order_number"
              rules={[
                {
                  required: true,
                  message: t(
                    "vendor_details_form_work_order_required",
                    "Please enter work order number."
                  ),
                },
              ]}
              placeholder={t(
                "vendor_details_form_work_order_placeholder",
                "Work Order Number"
              )}
            />

            <CustomDatepicker
              label={t(
                "vendor_details_form_allocation_date",
                "Date of Allocation"
              )}
              placeholder={t(
                "vendor_details_form_allocation_date",
                "Date of Allocation"
              )}
              name="date_of_allocation"
              rules={[
                {
                  required: true,
                  message: t(
                    "vendor_details_form_allocation_date_required",
                    "Please select date of allocation."
                  ),
                },
              ]}
              className="w-full"
            />

            <div className="col-span-3 font-semibold">
              {t(
                "vendor_details_form_total_allotted_quantity",
                "Total Allotted Quantity"
              )}
              : {(Number(quantity || 0) + Number(parkQuantity || 0)).toLocaleString()}
            </div>

            <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 justify-start items-start gap-3 mt-3 mb-2">
              <CustomSelect
                name="sector"
                label={t(
                  "vendor_details_form_select_sector",
                  "Select a sector"
                )}
                placeholder={t(
                  "vendor_details_form_select_sector",
                  "Select a sector"
                )}
                onChange={handelQuantitySector}
                options={SectorListDrop || []}
                rules={[
                  {
                    required: true,
                    message: t(
                      "vendor_details_form_sector_required",
                      "Please select sector."
                    ),
                  },
                ]}
              />

              <Form.Item
                label={t(
                  "vendor_details_form_quantity",
                  "Quantity"
                )}
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: t(
                      "vendor_details_form_quantity_required",
                      "Please enter quantity."
                    ),
                  },
                ]}
              >
                <InputNumber
                  onChange={handelQuantity}
                  min={0}
                  className="w-full"
                  placeholder={t(
                    "vendor_details_form_quantity_placeholder",
                    "Quantity"
                  )}
                />
              </Form.Item>
            </div>
          </div>

          {/* Additional sectors */}
          <Form.List name="sector_info">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key: fieldKey, name, ...restField }) => (
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 justify-start items-start gap-3 mt-3 mb-2"
                    key={fieldKey}
                  >
                    <div className="w-full">
                      <CustomSelect
                        name={[name, "sector"]}
                        {...restField}
                        placeholder={t(
                          "vendor_details_form_select_sector",
                          "Select a sector"
                        )}
                        onChange={handelQuantitySector}
                        options={SectorListDrop || []}
                        rules={[
                          {
                            required: true,
                            message: t(
                              "vendor_details_form_sector_required",
                              "Please select sector."
                            ),
                          },
                        ]}
                      />
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[
                        {
                          required: true,
                          message: t(
                            "vendor_details_form_quantity_required",
                            "Please enter quantity."
                          ),
                        },
                      ]}
                    >
                      <InputNumber
                        onChange={handelQuantity}
                        min={0}
                        className="w-full"
                        placeholder={t(
                          "vendor_details_form_enter_quantity",
                          "Enter quantity"
                        )}
                      />
                    </Form.Item>

                    <div className="flex">
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(name);
                          setTimeout(handelQuantity, 0);
                        }}
                      />
                    </div>
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    {t(
                      "vendor_details_form_add_sector",
                      "Add Sector"
                    )}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          {/* Parking entries */}
          <Form.List name="parking_info">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key: fieldKey, name, ...restField }) => (
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 justify-start items-start gap-3 mt-3 mb-2"
                    key={fieldKey}
                  >
                    <div className="w-full">
                      <CustomSelect
                        name={[name, "parking"]}
                        {...restField}
                        placeholder={t(
                          "vendor_details_form_select_parking",
                          "Select a parking"
                        )}
                        onChange={handelQuantityParking}
                        options={parkingDrop || []}
                        rules={[
                          {
                            required: true,
                            message: t(
                              "vendor_details_form_parking_required",
                              "Please select parking."
                            ),
                          },
                        ]}
                      />
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[
                        {
                          required: true,
                          message: t(
                            "vendor_details_form_quantity_required",
                            "Please enter quantity."
                          ),
                        },
                      ]}
                    >
                      <InputNumber
                        onChange={handelParkQuantity}
                        min={0}
                        className="w-full"
                        placeholder={t(
                          "vendor_details_form_enter_quantity",
                          "Enter quantity"
                        )}
                      />
                    </Form.Item>

                    <div className="flex">
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(name);
                          setTimeout(handelParkQuantity, 0);
                        }}
                      />
                    </div>
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    {t(
                      "vendor_details_form_add_parking",
                      "Add Parking"
                    )}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {isUpdate
                  ? t("vendor_details_form_update_button", "Update")
                  : t("vendor_details_form_register_button", "Register")}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default VendorDetailsForm;
