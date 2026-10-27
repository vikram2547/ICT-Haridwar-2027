
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router-dom";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import RouteSelector from "./routeSelector";
import { getRoutePickUpPoint } from "./routeSlice";
import { DICT } from "../../utils/dictionary";

const PickUpPoint = () => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { loading, PickUpPoint } = RouteSelector();

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

  const getDatas = () => {
    const queryString = params?.page
      ? params.page
      : params?.per_page;

    const urlParam = new URLSearchParams(queryString || "");
    const page = urlParam.get("page");
    const perPage = urlParam.get("per_page");

    const finalData = {
      page: page?.toString() || "1",
      per_page: perPage?.toString() || "10",
    };

    const uri =
      URLS?.getPickUpPoint?.path +
      `?page=${finalData.page}&per_page=${finalData.per_page}`;

    dispatch(getRoutePickUpPoint(uri));
  };

  useEffect(() => {
    if (PickUpPoint) {
      const data = PickUpPoint?.data;
      const paging = data?.paging?.[0];

      setDetails({
        list: data?.pickuppoints || [],
        pageLength: paging?.length || 25,
        currentPage: paging?.currentPage || 1,
        totalRecords: paging?.totalrecords || 0,
      });
    }
  }, [PickUpPoint]);

  useEffect(() => {
    getDatas();
  }, [params.page, params.per_page]);

  const columns = [
    {
      title: t("pickup_point_sr_no", "Sr. No"),
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
    {
      title: t("pickup_point_name", "Point Name"),
      dataIndex: "point_name",
      key: "point_name",
    },
    {
      title: t("pickup_point_latitude", "Latitude"),
      dataIndex: "latitude",
      key: "latitude",
    },
    {
      title: t("pickup_point_longitude", "Longitude"),
      dataIndex: "longitude",
      key: "longitude",
    },
    {
      title: t("pickup_point_action", "Action"),
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (text, record) => (
        <div className="flex justify-between">
          <Button
            aria-label={t("pickup_point_edit", "Edit")}
            title={t("pickup_point_edit", "Edit")}
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            onClick={() => {
              navigate("/pickup-point-form", {
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
        label={t("pickup_point_title", "GPS - Pick Up Point")}
        compo={
          <Button
            onClick={() => {
              navigate("/pickup-point-form", {
                state: {
                  key: "AddKey",
                },
              });
            }}
            className="mb-1 bg-green-400"
          >
            {t("pickup_point_add_button", "Add Pickup Point")}
          </Button>
        }
      />

      <CommonTable
        loading={loading}
        uri="pickup-point"
        columns={columns}
        details={details}
        scroll={{ x: 300, y: 400 }}
      />
    </div>
  );
};

export default PickUpPoint;
