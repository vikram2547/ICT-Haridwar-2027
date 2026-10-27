
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, Table } from "antd";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";
import { getVendorListAssetType } from "./AssetTypeSlice";
import CommonSearchForm from "../../commonComponents/CommonSearchForm";
import CommonFormDropDownMaker from "../../commonComponents/CommonFormDropDownMaker";
import AssetTypeSelectors from "./assetTypeSelectors";
import ViewVendorsSectors from "./viewVendors";
import { vendorColumn } from "../../constant/const";
import { DICT } from "../../utils/dictionary";

const AssetTypeList = () => {
  const [questions, setQuestions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState(null);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });

  const [showVendors, setShowVendors] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [showVendorsList, setVendorsList] = useState([]);
  const [allQuantity, setAllQuantity] = useState(0);
  const [rowRecord, setRowRecord] = useState(null);

  const { VendorListAssetType } = AssetTypeSelectors();

  const params = useParams();
  const navigate = useNavigate();

  // Multilingual support
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

  // Get asset type list
  const getDetails = async () => {
    setLoading(true);

    try {
      let uri = URLS.assetTypes.path + "/?";

      if (params.page) {
        uri += params.page;
      }

      if (params.per_page) {
        uri += "&" + params.per_page;
      }

      if (searchQuery) {
        uri += searchQuery;
      }

      const extraHeaders = {
        "x-api-version": URLS.assetTypes.version,
      };

      const res = await getData(uri, extraHeaders);

      if (res) {
        const data = res.data;

        setDetails({
          list: data.assettypes || [],
          pageLength: data.paging?.[0]?.length || 25,
          currentPage: data.paging?.[0]?.currentpage || 1,
          totalRecords: data.paging?.[0]?.totalrecords || 0,
        });
      } else {
        setDetails({
          list: [],
          pageLength: 25,
          currentPage: 1,
          totalRecords: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching asset types:", error);
      message.error(
        t(
          "asset_type_list_fetch_error",
          "Failed to load asset types."
        )
      );

      setDetails({
        list: [],
        pageLength: 25,
        currentPage: 1,
        totalRecords: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions for selected asset type
  const fetchQuestions = async (assetTypeId) => {
    try {
      const response = await getData(
        URLS.assetQuestions.path + assetTypeId,
        {
          "x-api-version": URLS.assetQuestions.version,
        }
      );

      const data = response?.data;
      const listings = data?.listings || [];

      if (listings.length > 0) {
        setQuestions({
          unCommonList: listings.filter(
            (item) => item?.is_primary != "1"
          ),
          commonList: listings.filter(
            (item) => item?.is_primary === "1"
          ),
          pageLength: data?.paging?.[0]?.length || 0,
          currentPage: data?.paging?.[0]?.currentpage || 1,
          totalRecords: data?.paging?.[0]?.totalrecords || 0,
        });
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      message.error(
        t(
          "asset_type_list_questions_error",
          "Failed to fetch questions."
        )
      );
      setQuestions([]);
    }
  };

  useEffect(() => {
    getDetails();
  }, [params, searchQuery]);

  // Open questions modal
  const showModal = async (record) => {
    setRowRecord(record);
    setSelectedAssetType(record?.asset_type_id);
    await fetchQuestions(record?.asset_type_id);
    setIsModalVisible(true);
  };

  // Close modal and reset selected data
  const handleCancel = () => {
    setIsModalVisible(false);
    setQuestions([]);
    setShowVendors(false);
    setRowRecord(null);
    setSelectedAssetType(null);
  };

  // Fetch vendor data for selected asset type
  const getVendorsData = (record) => {
    setRowRecord(record);
    setVendorsList([]);
    setAllQuantity(0);
    dispatch(getVendorListAssetType(record?.asset_type_id));
    setShowVendors(true);
  };

  // Process vendor data from Redux
  useEffect(() => {
    if (VendorListAssetType) {
      const userDetails =
        VendorListAssetType?.data?.userdetails || [];

      const vendorData = userDetails.map((data, index) => ({
        sr_no: index + 1,
        ...data,
      }));

      const totalQuantity = userDetails.reduce(
        (total, data) =>
          total + Number(data?.total_allotted_quantity || 0),
        0
      );

      setAllQuantity(totalQuantity);
      setVendorsList(vendorData);
    }
  }, [VendorListAssetType]);

  // Asset type table columns
  const columns = [
    {
      title: t("asset_type_list_sr_no", "Sr. No"),
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
    {
      title: t("asset_type_list_category", "Category"),
      dataIndex: "asset_main_type_name",
      key: "asset_main_type",
    },
    {
      title: t(
        "asset_type_list_type_name",
        "Toilets & Tentage Type"
      ),
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: t("asset_type_list_total_quantity", "Total Quantity"),
      dataIndex: "total_quantity",
      key: "total_quantity",
    },
    {
      title: t("asset_type_list_total_registered", "Total Registered"),
      dataIndex: "registered",
      key: "registered",
      render: (text) => (text ? text : 0),
    },
    {
      title: t("asset_type_list_description", "Description"),
      dataIndex: "description",
      key: "description",
      width: 300,
    },
    {
      title: t("asset_type_list_vendors", "Vendors"),
      dataIndex: "vendors_list",
      key: "vendors_list",
      render: (text, record) => (
        <Button type="link" onClick={() => getVendorsData(record)}>
          {t("asset_type_list_view_vendors", "View Vendors")}
        </Button>
      ),
    },
    {
      title: t("asset_type_list_questions", "Questions"),
      dataIndex: "questions",
      key: "questions",
      render: (text, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          {t("asset_type_list_view_questions", "View Questions")}
        </Button>
      ),
    },
    {
      title: t("asset_type_list_action", "Action"),
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (text, record) => (
        <div className="flex justify-between">
          <Button
            title={t("asset_type_list_edit", "Edit")}
            aria-label={t("asset_type_list_edit", "Edit")}
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            onClick={() => {
              navigate("/asset-type-registration", {
                state: {
                  key: "UpdateKey",
                  record,
                },
              });
            }}
          >
            <EditOutlined />
          </Button>
        </div>
      ),
    },
  ];

  // Question table columns
  const questionsColumns = [
    {
      title: t("asset_type_list_question_en", "Question (EN)"),
      dataIndex: "question_en",
      key: "question_en",
    },
    {
      title: t("asset_type_list_question_hi", "Question (HI)"),
      dataIndex: "question_hi",
      key: "question_hi",
    },
  ];

  const totalAllottedQuantity = (details?.list || [])
    .reduce(
      (total, item) =>
        total + Number(item?.total_quantity || 0),
      0
    )
    .toLocaleString();

  return (
    <div>
      <CommonDivider
        label={t(
          "asset_type_list_title",
          "Toilets & Tentage Type List"
        )}
        compo={
          <Button
            className="bg-orange-300 mb-1"
            onClick={() => navigate("/asset-type-registration")}
          >
            {t(
              "asset_type_list_add_button",
              "Add Toilets & Tentage Type"
            )}
          </Button>
        }
      />

      <CommonSearchForm
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        dropdown={
          <CommonFormDropDownMaker
            uri="assetMainTypePerPage"
            responseListName="assetmaintypes"
            responseLabelName="name"
            responseIdName="asset_main_type_id"
            selectLabel={t(
              "asset_type_list_category_filter",
              "Toilets & Tentage Category"
            )}
            selectName="asset_main_type_id"
            required={false}
            RequiredMessage={t(
              "asset_type_list_main_type_required",
              "Main type is required!"
            )}
          />
        }
      />

      <div className="h-3" />

      <CommonTable
        columns={columns}
        uri="asset-type-list"
        details={details}
        loading={loading}
        scroll={{ x: 1200, y: 400 }}
        tableSubheading={{
          [t(
            "asset_type_list_total_allotted_quantity",
            "Total Allotted Quantity"
          )]: totalAllottedQuantity,
        }}
      />

      {/* Questions Modal */}
      <Modal
        title={
          <h5>
            {t(
              "asset_type_list_questions_for",
              "Questions for Asset Type ID"
            )}
            : {selectedAssetType}
          </h5>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <div className="mb-4">
          <p>
            <strong>
              {t("asset_type_list_category", "Category")}:
            </strong>{" "}
            {rowRecord?.asset_main_type_name}
          </p>

          <p>
            <strong>
              {t(
                "asset_type_list_type_name",
                "Toilets & Tentage Type"
              )}
              :
            </strong>{" "}
            {rowRecord?.name}
          </p>
        </div>

        {questions?.commonList?.length > 0 ? (
          <>
            <h6>
              {t(
                "asset_type_list_common_questions",
                "Common Questions"
              )}
              :
            </h6>

            <Table
              bordered
              className="mb-4"
              dataSource={questions.commonList}
              rowKey="question_id"
              pagination={false}
              scroll={{ x: 800, y: 400 }}
              columns={questionsColumns}
            />
          </>
        ) : (
          <p>
            {t(
              "asset_type_list_no_common_questions",
              "No common questions found for this type."
            )}
          </p>
        )}

        {questions?.unCommonList?.length > 0 ? (
          <>
            <h6>
              {t(
                "asset_type_list_individual_questions",
                "Individual Questions"
              )}
              :
            </h6>

            <Table
              bordered
              dataSource={questions.unCommonList}
              rowKey="question_id"
              pagination={false}
              scroll={{ x: 800, y: 400 }}
              columns={questionsColumns}
            />
          </>
        ) : (
          <p>
            {t(
              "asset_type_list_no_individual_questions",
              "No individual questions found for this type."
            )}
          </p>
        )}
      </Modal>

      {/* Vendors Modal */}
      <ViewVendorsSectors
        title={t("asset_type_list_vendor_list", "Vendor List")}
        openModal={showVendors}
        handleCancel={handleCancel}
        tableData={showVendorsList || []}
        tableHeaderData={[
          {
            label: t("asset_type_list_category", "Category"),
            value: rowRecord?.asset_main_type_name,
          },
          {
            label: t(
              "asset_type_list_type_name",
              "Toilets & Tentage Type"
            ),
            value: rowRecord?.name,
          },
        ]}
        column={vendorColumn || []}
        footer={`${t(
          "asset_type_list_total_allotted_quantity",
          "Total Allotted Quantity"
        )} : ${allQuantity}`}
      />
    </div>
  );
};

export default AssetTypeList;
