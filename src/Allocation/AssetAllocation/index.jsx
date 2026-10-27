
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useDispatch } from "react-redux";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Tooltip,
  Collapse,
} from "antd";
import { DeleteOutlined, SyncOutlined } from "@ant-design/icons";

import {
  deleteSupervisorSectorAllocation,
} from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import ToiletAndTentageSelector from "../../register/asset/assetSelectors";
import { getAssetAllocationData } from "../../register/asset/AssetsSlice";
import CustomTable from "../../commonComponents/CustomTable";
import CustomInput from "../../commonComponents/CustomInput";
import search from "../../assets/Dashboard/icon-search.png";

// Asset Allocation
const AssetAllocation = () => {
  const [dict, lang] = useOutletContext();

  const t = (key, fallback) =>
    dict?.[key]?.[lang] ?? dict?.[key]?.en ?? fallback ?? key;

  const [viewDeleteModal, setViewDeleteModal] = useState(false);

  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const [form] = Form.useForm();
  const [fiterForm] = Form.useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, AssetAllocateData } = ToiletAndTentageSelector();

  const handleCancel = () => {
    setViewDeleteModal(false);
  };

  // Handle delete modal
  const handleDelete = (data) => {
    form.setFieldsValue({
      allocation_id: data?.allocation_id,
      allocated_user: data?.allocated_user,
    });

    setViewDeleteModal(true);
  };

  // Handle delete API
  const onDeleteFinish = async (value) => {
    const url =
      URLS?.deleteAllocate_Asset?.path + `/${value?.allocation_id}`;

    const res = await dispatch(deleteSupervisorSectorAllocation(url));

    if (res) {
      dispatch(getAssetAllocationData());

      message.success(
        `${value?.allocated_user} ${t(
          "asset_allocation_deleted_success",
          "Allocation record deleted successfully"
        )}`
      );
    } else {
      message.error(
        t(
          "asset_allocation_error",
          "Something went wrong! Please try again."
        )
      );
    }

    setViewDeleteModal(false);
  };

  // Handle search form
  const onFinishForm = (values) => {
    if (
      values?.allocated_phone == null &&
      values?.asset_code == null
    ) {
      message.warning(
        t("asset_select_search_field", "Please select any field")
      );
      return;
    }

    const finalValues = {
      ...(values?.allocated_phone && {
        phone: values?.allocated_phone,
      }),
      ...(values?.asset_code && {
        assets_code: values?.asset_code,
      }),
    };

    dispatch(getAssetAllocationData(finalValues));
  };

  // Reset search form
  const resetForm = () => {
    fiterForm.resetFields();
    dispatch(getAssetAllocationData());
  };

  useEffect(() => {
    if (AssetAllocateData) {
      setDetails(() => ({
        list: AssetAllocateData?.data?.listings,
        pageLength: AssetAllocateData?.data?.paging?.[0]?.length,
        currentPage: AssetAllocateData?.data?.paging?.[0]?.currentPage,
        totalRecords: AssetAllocateData?.data?.paging?.[0]?.totalrecords,
      }));
    }
  }, [AssetAllocateData]);

  useEffect(() => {
    dispatch(getAssetAllocationData());
  }, [dispatch]);

  const columns = [
    {
      title: t("asset_allocated_user", "Allocated User"),
      dataIndex: "allocated_user",
      key: "allocated_user",
    },
    {
      title: t("asset_allocated_phone", "Allocated Phone"),
      dataIndex: "allocated_phone",
      key: "allocated_phone",
    },
    {
      title: t("asset_code", "Asset Code"),
      dataIndex: "asset_code",
      key: "asset_code",
    },
    {
      title: t("asset_sector_name", "Sector Name"),
      dataIndex: "sector_id",
      key: "sector_id",
    },
    {
      title: t("asset_parking_name", "Parking Name"),
      dataIndex: "parking_id",
      key: "parking_id",
    },
    {
      title: t("action", "Action"),
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 150,
      render: (text, record) => (
        <div className="flex gap-2">
          <Tooltip title={t("asset_reallocate_tooltip", "Reallocate")}>
            <Button
              aria-label={t("asset_reallocate_tooltip", "Reallocate")}
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
              onClick={() => {
                navigate("/asset-allocation-form", {
                  state: {
                    key: "UpdateKey",
                    record: record,
                  },
                });
              }}
            >
              <SyncOutlined />
            </Button>
          </Tooltip>

          <Tooltip title={t("delete", "Delete")}>
            <Button
              aria-label={t("delete", "Delete")}
              className="bg-red-100 border-red-500 focus:ring-red-500 hover:bg-red-200 rounded-full"
              onClick={() => handleDelete(record)}
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <CommonDivider
        label={t("asset_allocate_assets_title", "Allocate Assets")}
      />

      <Collapse
        defaultActiveKey={["1"]}
        size="small"
        className="rounded-none mt-3"
        items={[
          {
            key: "1",
            label: (
              <div className="flex items-center h-full">
                <img
                  src={search}
                  className="h-5"
                  alt={t("search", "Search")}
                />
              </div>
            ),
            children: (
              <Form
                form={fiterForm}
                layout="vertical"
                onFinish={onFinishForm}
                key="form"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4">
                  <CustomInput
                    label={t("asset_allocated_phone", "Allocated Phone")}
                    name="allocated_phone"
                    placeholder={t(
                      "asset_allocated_phone",
                      "Allocated Phone"
                    )}
                    maxLength={10}
                  />

                  <CustomInput
                    label={t("asset_code", "Asset Code")}
                    name="asset_code"
                    placeholder={t(
                      "asset_enter_code",
                      "Enter Asset Code"
                    )}
                  />

                  <div className="flex justify-start my-4 space-x-2 ml-3">
                    <div>
                      <Button
                        loading={loading}
                        htmlType="submit"
                        className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                      >
                        {t("search", "Search")}
                      </Button>
                    </div>

                    <div>
                      <Button
                        loading={loading}
                        className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                        onClick={resetForm}
                      >
                        {t("reset", "Reset")}
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            ),
          },
        ]}
      />

      <CustomTable
        loading={loading}
        columns={columns}
        bordered
        dataSource={details || []}
        scroll={{ x: 100, y: 400 }}
        tableSubheading={{
          [t("asset_total_records", "Total Records")]:
            AssetAllocateData?.data?.listings?.length,
        }}
      />

      <Modal
        title={
          <div>
            <h5>{t("asset_delete_allocation_title", "Delete Asset Allocation")}</h5>
          </div>
        }
        open={viewDeleteModal}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={onDeleteFinish}>
          <p>
            {t(
              "asset_delete_allocation_confirmation",
              "Are you sure you want to delete this Asset Allocation Record?"
            )}
          </p>

          <Form.Item name="allocated_user">
            <Input
              disabled
              className="w-full"
              placeholder={t("asset_gsd_name", "GSD Name")}
            />
          </Form.Item>

          <Form.Item name="allocation_id">
            <Input
              disabled
              className="w-full"
              placeholder={t("asset_allocation_id", "ID")}
            />
          </Form.Item>

          <p>
            <strong className="text-red-500 font-bold">
              {t(
                "asset_delete_warning",
                "Please note: The data in this field cannot be recovered."
              )}
            </strong>
          </p>

          <Form.Item>
            <div className="flex justify-end space-x-2">
              <Button type="primary" danger htmlType="submit">
                {t("delete", "Delete")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AssetAllocation;