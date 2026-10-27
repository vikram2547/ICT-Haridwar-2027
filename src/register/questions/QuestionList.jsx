
import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router-dom";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { DICT } from "../../utils/dictionary";

const QuestionList = () => {
  const [loading, setLoading] = useState(false);

  const [userDetails, setUserDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });

  const navigate = useNavigate();
  const params = useParams();

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

  const getUsers = async () => {
    setLoading(true);

    try {
      let uri = URLS.questions.path + "/?";

      if (params.page) {
        uri = uri + params.page;
      } else if (params.per_page) {
        uri = uri + "&" + params.per_page;
      }

      const extraHeaders = {
        "x-api-version": URLS.questions.version,
      };

      const res = await getData(uri, extraHeaders);

      if (res?.data) {
        const data = res.data;
        const paging = data?.paging?.[0] || {};

        setUserDetails({
          list: data?.listings || [],
          pageLength: paging.length || 25,
          currentPage: paging.currentPage || 1,
          totalRecords: paging.totalrecords || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [params.page, params.per_page]);

  const columns = [
    {
      title: t("question_list_sr_no", "Sr. No"),
      dataIndex: "sr",
      key: "sr",
      width: 70,
    },
    {
      title: t("question_list_english", "Question (English)"),
      dataIndex: "question_en",
      key: "question_en",
      width: 300,
    },
    {
      title: t("question_list_hindi", "Question (Hindi)"),
      dataIndex: "question_hi",
      key: "question_hi",
      width: 300,
    },
    {
      title: t("question_list_type", "Question Type"),
      dataIndex: "type",
      key: "type",
      render: (value) =>
        value === "C"
          ? t("question_list_cleaning", "Cleaning")
          : t("question_list_maintenance", "Maintenance"),
      width: 130,
    },
    {
      title: t("question_list_image_required", "Image Required"),
      dataIndex: "is_image",
      key: "is_image",
      render: (value) =>
        value === "1"
          ? t("question_list_yes", "Yes")
          : t("question_list_no", "No"),
      width: 130,
    },
    {
      title: t("question_list_image_on", "Image Required ON"),
      dataIndex: "is_image_on",
      key: "is_image_on",
      render: (value) =>
        value === "1"
          ? t("question_list_yes", "Yes")
          : t("question_list_no", "No"),
      width: 150,
    },
    {
      title: t("question_list_primary", "Primary Question"),
      dataIndex: "is_primary",
      key: "is_primary",
      render: (value) =>
        value === "1"
          ? t("question_list_yes", "Yes")
          : t("question_list_no", "No"),
      width: 150,
    },
    {
      title: t("question_list_action", "Action"),
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <div className="flex justify-between">
          <Button
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            title={t("question_list_edit", "Edit")}
            aria-label={t("question_list_edit", "Edit")}
            onClick={() => {
              navigate("/add-question-form", {
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

  return (
    <div>
      <CommonDivider
        label={t("question_list_title", "Question List")}
        compo={
          <Button
            onClick={() => navigate("/add-question-form")}
            className="bg-orange-300 mb-1"
          >
            {t("question_list_add_button", "Add Questions")}
          </Button>
        }
      />

      <CommonTable
        loading={loading}
        uri="questions"
        columns={columns}
        details={userDetails}
        scroll={{ x: 1000, y: 400 }}
      />
    </div>
  );
};

export default QuestionList;
