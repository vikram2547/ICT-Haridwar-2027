
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import RouteSelector from "./routeSelector";
import { getRouteList } from "./routeSlice";
import { DICT } from "../../utils/dictionary";

const RouteList = () => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { RouteLists, loading } = RouteSelector();

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
      URLS?.getPickUpRoute?.path +
      `?page=${finalData.page}&per_page=${finalData.per_page}`;

    dispatch(getRouteList(uri));
  };

  useEffect(() => {
    if (RouteLists) {
      const data = RouteLists?.data;
      const paging = data?.paging?.[0];

      setDetails({
        list: data?.pickuproutes || [],
        pageLength: paging?.length || 25,
        currentPage: paging?.currentPage || 1,
        totalRecords: paging?.totalrecords || 0,
      });
    }
  }, [RouteLists]);

  useEffect(() => {
    getDatas();
  }, [params.page, params.per_page]);

  const columns = [
    {
      title: t("route_list_sr_no", "Sr. No"),
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
    {
      title: t("route_list_sector", "Sector"),
      dataIndex: "sector_id",
      key: "sector_id",
    },
    {
      title: t("route_list_vehicle_number", "Vehicle Number"),
      dataIndex: "vehicle_number",
      key: "vehicle_number",
    },
    {
      title: t("route_list_route_name", "Route Name"),
      dataIndex: "route_name",
      key: "route_name",
    },
    {
      title: t("route_list_start_point", "Start Point"),
      dataIndex: "start_point_name",
      key: "start_point_name",
    },
    {
      title: t("route_list_end_point", "End Point"),
      dataIndex: "end_point_name",
      key: "end_point_name",
    },
    {
      title: t("route_list_distance", "Distance (meters)"),
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: t("route_list_action", "Action"),
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (text, record) => (
        <div className="flex justify-between">
          <Button
            aria-label={t("route_list_edit", "Edit")}
            title={t("route_list_edit", "Edit")}
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            onClick={() => {
              navigate("/add-route", {
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
        label={t("route_list_title", "GPS - Route List")}
        compo={
          <Button
            onClick={() => {
              navigate("/add-route", {
                state: {
                  key: "AddKey",
                },
              });
            }}
            className="mb-1 bg-green-400"
          >
            {t("route_list_add_button", "Add Route")}
          </Button>
        }
      />

      <CommonTable
        loading={loading}
        uri="route-list"
        columns={columns}
        details={details}
        scroll={{ x: 300, y: 400 }}
      />
    </div>
  );
};

export default RouteList;
