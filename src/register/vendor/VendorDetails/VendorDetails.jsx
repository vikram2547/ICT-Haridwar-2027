
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams, useOutletContext } from "react-router";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Button, Form, Input, message, Modal, Table } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import CommonTable from "../../../commonComponents/CommonTable";
import CommonDivider from "../../../commonComponents/CommonDivider";
import URLS from "../../../urils/URLS";
import { getData } from "../../../Fetch/Axios";
import { deleteVendorDetails } from "./vendorDetailsSlice";
import { getPdfExcelData } from "../../asset/AssetsSlice";
import { VendorDetailsPdfFunction } from "./vendorDetailsPdf";
import { VendorDetailsToExcel } from "./vendorDetailsExcel";
import { DICT } from "../../../utils/dictionary";

const VendorDetails = () => {
  const [loading, setLoading] = useState(false);
  const [viewDeleteModal, setViewDeleteModal] = useState(false);
  const [proposedSectors, setProposedSectors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchQuery] = useState();

  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

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

  const handleProposedSectorsView = (data, record) => {
    setProposedSectors(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setViewDeleteModal(false);
    setIsModalVisible(false);
    setProposedSectors([]);
  };

  // Open delete confirmation
  const handleDelete = (data) => {
    form.setFieldsValue({
      asset_type_name: data?.asset_type_name,
      vendor_detail_id: data?.vendor_detail_id,
    });
    setViewDeleteModal(true);
  };

  // Delete vendor details
  const onFinish = async (value) => {
    try {
      const url =
        URLS?.deleteVendorDetails?.path + value?.vendor_detail_id;

      const res = await dispatch(deleteVendorDetails(url));

      if (res) {
        await getDetails();
        message.success(
          `${t(
            "vendor_details_delete_success",
            "Vendor details deleted successfully for"
          )} ${value?.asset_type_name}`
        );
        setViewDeleteModal(false);
        form.resetFields();
      } else {
        message.error(
          t(
            "vendor_details_delete_error",
            "Something went wrong! Please try again."
          )
        );
      }
    } catch (error) {
      message.error(
        t(
          "vendor_details_delete_error",
          "Something went wrong! Please try again."
        )
      );
    }
  };

  const getDetails = async () => {
    setLoading(true);

    try {
      let uri = URLS.vendorDetails.path + params.id + "&";

      if (params.page) uri += params.page;
      if (params.per_page) uri += "&" + params.per_page;

      const res = await getData(uri, {
        "x-api-version": URLS.vendorDetails.version,
      });

      if (res?.data) {
        const data = res.data;
        const paging = data?.paging?.[0] || {};

        setUserName(data?.userdetails?.[0]?.user_name || "");

        setDetails({
          list: data?.userdetails || [],
          pageLength: paging?.length || 25,
          currentPage: paging?.currentPage || 1,
          totalRecords: paging?.totalrecords || 0,
        });
      }
    } catch (error) {
      message.error(
        t(
          "vendor_details_fetch_error",
          "Unable to fetch vendor details."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      getDetails();
    } else {
      navigate("/vendor");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, params.page, params.per_page, navigate]);

  const columns = [
    {
      title: t("vendor_details_sr_no", "Sr. No"),
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
    {
      title: t("vendor_details_category", "Category"),
      dataIndex: "asset_main_type_name",
      key: "main_type",
    },
    {
      title: t(
        "vendor_details_asset_type",
        "Toilets & Tentage Type"
      ),
      dataIndex: "asset_type_name",
      key: "asset_type",
      width: 300,
    },
    {
      title: t("vendor_details_contract_number", "Contract Number"),
      dataIndex: "contract_number",
      key: "contract_number",
      width: 120,
    },
    {
      title: t(
        "vendor_details_work_order_number",
        "Work Order Number"
      ),
      dataIndex: "work_order_number",
      key: "work_order_number",
      width: 120,
    },
    {
      title: t(
        "vendor_details_allotted_quantity",
        "Allotted Quantity"
      ),
      dataIndex: "total_allotted_quantity",
      key: "total_allotted_quantity",
    },
    {
      title: t(
        "vendor_details_proposed_sectors_parking",
        "Proposed Sectors & Parking"
      ),
      dataIndex: "proposedsectors",
      key: "proposed_sectors",
      render: (text, record) => (
        <div
          onClick={() => handleProposedSectorsView(text, record)}
          className="text-blue-500 cursor-pointer"
        >
          {t("vendor_details_view", "View")}
        </div>
      ),
    },
    {
      title: t(
        "vendor_details_manager_contact_1",
        "Manager Contact 1"
      ),
      dataIndex: "manager_contact_1",
      key: "manager_contact_1",
      width: 160,
    },
    {
      title: t(
        "vendor_details_manager_contact_2",
        "Manager Contact 2"
      ),
      dataIndex: "manager_contact_2",
      key: "manager_contact_2",
      width: 160,
    },
    {
      title: t(
        "vendor_details_date_of_allocation",
        "Date of Allocation"
      ),
      dataIndex: "date_of_allocation",
      key: "date_of_allocation",
      width: 160,
      render: (text) =>
        text ? moment(text).format("DD-MMM-YYYY") : "",
    },
    {
      title: t("vendor_details_action", "Action"),
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 130,
      render: (text, record) => (
        <div className="flex justify-between">
          <Button
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            title={t("vendor_details_edit", "Edit")}
            aria-label={t("vendor_details_edit", "Edit")}
            onClick={() => {
              navigate(
                `/vendor/add-vendor-details-form/${params?.id}`,
                {
                  state: {
                    key: "UpdateKey",
                    record,
                  },
                }
              );
            }}
          >
            <EditOutlined />
          </Button>

          <Button
            className="bg-red-100 border-red-500 focus:ring-red-500 hover:bg-red-200 rounded-full"
            title={t("vendor_details_delete", "Delete")}
            aria-label={t("vendor_details_delete", "Delete")}
            onClick={() => handleDelete(record)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  const totalAllottedQuantity = details?.list
    .reduce(
      (total, item) =>
        total + Number(item?.total_allotted_quantity || 0),
      0
    )
    .toLocaleString();

  // PDF headers
  const pdfHeader = [
    t("vendor_details_sr_no", "Sr No"),
    t("vendor_details_category", "Category"),
    t("vendor_details_asset_type", "Toilets & Tentage Type"),
    t("vendor_details_total_allotted_quantity", "Total Allotted Quantity"),
  ];

  const subTableHeader = [
    t("vendor_details_sector_parking_name", "Sector Name / Parking Name"),
    t("vendor_details_quantity", "Quantity"),
  ];

  // Export PDF or Excel
  const exportToFile = async (isExcel) => {
    try {
      const url =
        URLS.vendorDetails.path +
        `${params?.id}&page=1&per_page=5000`;

      const res = await dispatch(
        getPdfExcelData(`${url}${searchQuery ? searchQuery : ""}`)
      );

      if (!res?.data?.userdetails) {
        throw new Error("No data found in the response data.");
      }

      const registerCount = res.data.userdetails.reduce(
        (total, element) => {
          const sectorRegistered =
            element?.proposedsectors?.reduce(
              (sectorTotal, item) =>
                sectorTotal + Number(item?.registered || 0),
              0
            ) || 0;

          const parkingRegistered =
            element?.proposedparkings?.reduce(
              (parkingTotal, item) =>
                parkingTotal + Number(item?.registered || 0),
              0
            ) || 0;

          return total + sectorRegistered + parkingRegistered;
        },
        0
      );

      const myexcelData =
        isExcel &&
        res.data.userdetails.map((data, index) => ({
          [t("vendor_details_sr_no", "Sr")]: index + 1,
          [t("vendor_details_category", "Category")]:
            data?.asset_main_type_name,
          [t(
            "vendor_details_asset_type",
            "Toilets & Tentage Type"
          )]: data?.asset_type_name,
          [t(
            "vendor_details_total_allotted_quantity",
            "Total Allotted Quantity"
          )]: Number(data?.total_allotted_quantity || 0),
          [t("vendor_details_sector_parking", "Sector / Parking")]: [
            ...(data?.proposedsectors || []).map((item) => [
              item?.sector_name,
              Number(item?.quantity || 0),
              Number(item?.registered || 0),
            ]),
            [""],
            ...(data?.proposedparkings || []).map((item) => [
              item?.parking_name,
              Number(item?.quantity || 0),
              Number(item?.registered || 0),
            ]),
          ],
        }));

      if (isExcel) {
        VendorDetailsToExcel(
          myexcelData,
          `${userName} ${t("vendor_details_export_title", "Vendor Details")}`,
          {},
          totalAllottedQuantity,
          registerCount
        );
      }

      const pdfData =
        !isExcel &&
        res.data.userdetails.map((data, index) => [
          index + 1,
          data?.asset_main_type_name,
          data?.asset_type_name,
          Number(data?.total_allotted_quantity || 0),
          [
            ...(data?.proposedsectors || []).map((item) => [
              item?.sector_name,
              item?.quantity,
            ]),
            ...(data?.proposedparkings || []).map((item) => [
              item?.parking_name,
              item?.quantity,
            ]),
          ],
        ]);

      if (!isExcel) {
        VendorDetailsPdfFunction(
          `${userName} ${t("vendor_details_export_title", "Vendor Details")}`,
          `${userName} ${t("vendor_details_export_title", "Vendor Details")}`,
          pdfHeader,
          pdfData,
          subTableHeader,
          true
        );
      }
    } catch (error) {
      message.error(
        `${t("vendor_details_export_error", "Export error")}: ${
          error?.message || t("vendor_details_unknown_error", "Unknown error")
        }`
      );
    }
  };

  const sectorColumns = [
    {
      title: t("vendor_details_sector_name", "Sector Name"),
      dataIndex: "sector_name",
      key: "sector_name",
      width: "50%",
    },
    {
      title: t("vendor_details_quantity", "Quantity"),
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: t("vendor_details_registered", "Registered"),
      dataIndex: "registered",
      key: "registered",
    },
  ];

  const parkingColumns = [
    {
      title: t("vendor_details_parking_name", "Parking Name"),
      dataIndex: "parking_name",
      key: "parking_name",
      width: "50%",
    },
    {
      title: t("vendor_details_quantity", "Quantity"),
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: t("vendor_details_registered", "Registered"),
      dataIndex: "registered",
      key: "registered",
    },
  ];

  const totalRegistered =
    (proposedSectors?.proposedparkings || []).reduce(
      (total, park) => total + Number(park?.registered || 0),
      0
    ) +
    (proposedSectors?.proposedsectors || []).reduce(
      (total, sector) => total + Number(sector?.registered || 0),
      0
    );

  const totalQuantity =
    (proposedSectors?.proposedparkings || []).reduce(
      (total, park) => total + Number(park?.quantity || 0),
      0
    ) +
    (proposedSectors?.proposedsectors || []).reduce(
      (total, sector) => total + Number(sector?.quantity || 0),
      0
    );

  return (
    <div>
      <div className="flex gap-2 items-center">
        <Link to="/vendor">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            aria-label={t("vendor_details_back", "Back")}
          >
            <ArrowLeftOutlined />
          </Button>
        </Link>

        <div className="w-full">
          <CommonDivider
            label={
              <div>
                {t("vendor_details_heading", "Vendor Details For")}{" "}
                <span className="text-blue-500">{userName}</span>
              </div>
            }
            compo={
              <Button
                className="bg-orange-300 mb-1"
                onClick={() =>
                  navigate(
                    `/vendor/add-vendor-details-form/${params?.id}`,
                    {
                      state: {
                        key: "AddKey",
                      },
                    }
                  )
                }
              >
                {t("vendor_details_add_button", "Add Details")}
              </Button>
            }
          />

          <div className="flex justify-end gap-2 font-semibold mb-4">
            <Button type="primary" onClick={() => exportToFile(false)}>
              {t("vendor_details_download_pdf", "Download PDF")}
            </Button>

            <Button type="primary" onClick={() => exportToFile(true)}>
              {t("vendor_details_download_excel", "Download Excel")}
            </Button>
          </div>
        </div>
      </div>

      <CommonTable
        columns={columns}
        uri={"vendor/add-vendor-details/" + params.id}
        details={details}
        loading={loading}
        tableSubheading={{
          [t(
            "vendor_details_total_allotted_quantity",
            "Total Allotted Quantity"
          )]: totalAllottedQuantity,
        }}
      />

      {/* Proposed sectors and parking modal */}
      <Modal
        title={t(
          "vendor_details_proposed_sectors_parking",
          "Proposed Sectors & Parking"
        )}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <div className="mb-4">
          <p>
            <strong>
              {t("vendor_details_vendor_name", "Vendor Name")}:
            </strong>{" "}
            {proposedSectors?.user_name || "-"}
          </p>

          <p>
            <strong>
              {t("vendor_details_category", "Category")}:
            </strong>{" "}
            {proposedSectors?.asset_main_type_name || "-"}
          </p>

          <p>
            <strong>
              {t(
                "vendor_details_asset_type",
                "Toilets & Tentage Type"
              )}
              :
            </strong>{" "}
            {proposedSectors?.asset_type_name || "-"}
          </p>
        </div>

        {proposedSectors?.proposedsectors?.length ? (
          <Table
            bordered
            dataSource={proposedSectors.proposedsectors}
            rowKey="sector_name"
            className="mb-4"
            pagination={false}
            scroll={{ x: 300, y: 400 }}
            columns={sectorColumns}
          />
        ) : (
          <p>
            {t(
              "vendor_details_no_sectors",
              "No sectors found for this asset type."
            )}
          </p>
        )}

        {proposedSectors?.proposedparkings?.length ? (
          <Table
            bordered
            className="mb-4"
            dataSource={proposedSectors.proposedparkings}
            rowKey="parking_name"
            pagination={false}
            scroll={{ x: 300, y: 400 }}
            columns={parkingColumns}
          />
        ) : (
          <p>
            {t(
              "vendor_details_no_parking",
              "No parking found for this asset type."
            )}
          </p>
        )}

        {(proposedSectors?.proposedsectors?.length ||
          proposedSectors?.proposedparkings?.length) ? (
          <div className="flex gap-16 flex-row-reverse">
            <div className="text-right font-semibold mt-2">
              {t("vendor_details_total_registered", "Total Registered")}:{" "}
              {totalRegistered.toLocaleString()}
            </div>

            <div className="text-right font-semibold mt-2">
              {t("vendor_details_total_quantity", "Total Quantity")}:{" "}
              {totalQuantity.toLocaleString()}
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        title={t(
          "vendor_details_delete_title",
          "Delete Vendor Details"
        )}
        open={viewDeleteModal}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <p>
            {t(
              "vendor_details_delete_confirmation",
              "Are you sure you want to delete these vendor details?"
            )}
          </p>

          <Form.Item name="asset_type_name">
            <Input
              disabled
              className="w-full"
              placeholder={t(
                "vendor_details_asset_type_placeholder",
                "Asset type"
              )}
            />
          </Form.Item>

          <Form.Item name="vendor_detail_id">
            <Input
              disabled
              className="w-full"
              placeholder={t(
                "vendor_details_id_placeholder",
                "Vendor detail ID"
              )}
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-2">
              <Button type="default" onClick={handleCancel}>
                {t("vendor_details_cancel", "Cancel")}
              </Button>

              <Button type="primary" danger htmlType="submit">
                {t("vendor_details_delete", "Delete")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorDetails;
