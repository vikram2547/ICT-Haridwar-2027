
// import React, { useEffect, useState } from "react";
// import {
//   Button,
// } from "antd";
// import {
//   useNavigate,
//   useParams,
//   useOutletContext,
// } from "react-router-dom";
// import { EditOutlined } from "@ant-design/icons";

// import CommonTable from "../../commonComponents/CommonTable";
// import CommonDivider from "../../commonComponents/CommonDivider";
// import { getData } from "../../Fetch/Axios";
// import URLS from "../../urils/URLS";
// import { DICT } from "../../utils/dictionary";

// const AssignedRouteList = () => {
//   const navigate = useNavigate();
//   const params = useParams();

//   const [loading, setLoading] = useState(false);
//   const [details, setDetails] = useState({
//     list: [],
//     pageLength: 25,
//     currentPage: 1,
//     totalRecords: 0,
//   });

//   // Language context
//   const outletContext = useOutletContext() || [];
//   const contextDict = outletContext[0] || {};
//   const lang =
//     outletContext[1] || localStorage.getItem("lang") || "en";

//   const t = (key, fallback) =>
//     contextDict?.[key]?.[lang] ??
//     contextDict?.[key]?.en ??
//     DICT?.[key]?.[lang] ??
//     DICT?.[key]?.en ??
//     fallback ??
//     key;

//   const getUsers = async () => {
//     setLoading(true);

//     try {
//       let uri = URLS?.assignroutes?.path + "/?";

//       if (params.page) {
//         uri = uri + params.page;
//       } else if (params.per_page) {
//         uri = uri + "&" + params.per_page;
//       }

//       const extraHeaders = {
//         "x-api-version": URLS?.assignroutes?.version,
//       };

//       const res = await getData(uri, extraHeaders);

//       if (res?.data) {
//         const data = res.data;
//         const list = (data?.assignroutes || []).map((el, index) => ({
//           ...el,
//           sr: el.sr ?? index + 1,
//           action: (
//             <Button
//               className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
//               key={el.name + index}
//               title={t("assigned_route_list_edit", "Edit")}
//               aria-label={t("assigned_route_list_edit", "Edit")}
//               onClick={() => navigate("/assign-route")}
//             >
//               <EditOutlined />
//             </Button>
//           ),
//         }));

//         const paging = data?.paging?.[0] || {};

//         setDetails({
//           list,
//           pageLength: paging.length || 25,
//           currentPage: paging.currentPage || 1,
//           totalRecords: paging.totalrecords || 0,
//         });
//       }
//     } catch (error) {
//       console.error("Failed to fetch assigned routes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getUsers();
//   }, [params.page, params.per_page]);

//   const columns = [
//     {
//       title: t("assigned_route_list_sr_no", "Sr. No"),
//       dataIndex: "sr",
//       key: "sr",
//       width: 80,
//     },
//     {
//       title: t("assigned_route_list_vehicle_number", "Vehicle Number"),
//       dataIndex: "vehicle_number",
//       key: "vehicle_number",
//     },
//     {
//       title: t("assigned_route_list_assigned_route", "Assigned Route"),
//       dataIndex: "route_name",
//       key: "route_name",
//     },
//     {
//       title: t("assigned_route_list_action", "Action"),
//       dataIndex: "action",
//       key: "action",
//       fixed: "right",
//       width: 100,
//     },
//   ];

//   return (
//     <div>
//       <CommonDivider
//         label={t("assigned_route_list_title", "Assigned Route List")}
//         compo={
//           <Button
//             onClick={() => navigate("/assign-route")}
//             className="mb-1 bg-green-400"
//           >
//             {t("assigned_route_list_assign_button", "Assign Route")}
//           </Button>
//         }
//       />

//       <CommonTable
//         loading={loading}
//         uri="assignroutes"
//         columns={columns}
//         details={details}
//         scroll={{ x: 300, y: 400 }}
//       />
//     </div>
//   );
// };

// export default AssignedRouteList;



import React, { useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { EditOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Sr. No",
    dataIndex: "sr",
    key: "sr",
    width: 80,
  },
  {
    title: "Vehicle Number",
    dataIndex: "vehicle_number",
    key: "vehicle_number",
  },
  {
    title: "Assigned Route",
    dataIndex: "route_name",
    key: "route_name",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 100,
  },
];

const AssignedRouteList = () => {
  const navigate = useNavigate();

  const [loading] = useState(false);

  const staticRoutes = [
    {
      id: 1,
      vehicle_number: "UK08CA1234",
      route_name: "Kali Marg,Gandhi Marg",
    },
    {
      id: 2,
      vehicle_number: "UK08CA2345",
      route_name: "MG Marg,Nehru Marg",
    },
    {
      id: 3,
      vehicle_number: "UK08CA3456",
      route_name: "Nehru Marg, Kali Marg",
    },
    {
      id: 4,
      vehicle_number: "UK08CA4567",
      route_name: "Har Ki Pauri Marg",
    },
    {
      id: 5,
      vehicle_number: "UK08CA5678",
      route_name: "Bhimgoda Marg",
    },
    {
      id: 6,
      vehicle_number: "UK08CA6789",
      route_name: "Rishikul Marg",
    },
    {
      id: 7,
      vehicle_number: "UK08CA7890",
      route_name: "Bairagi Camp Marg",
    },
    {
      id: 8,
      vehicle_number: "UK08CA8901",
      route_name: "Jwalapur Marg",
    },
    {
      id: 9,
      vehicle_number: "UK08CA9012",
      route_name: "Kankhal Marg",
    },
    {
      id: 10,
      vehicle_number: "UK08CA1122",
      route_name: "Daksh Road",
    },
  ];

  const list = staticRoutes.map((el, index) => ({
    ...el,
    sr: index + 1,
    action: (
      <Button
        className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
        key={el.id}
        onClick={() => navigate("/assign-route")}
      >
        <EditOutlined />
      </Button>
    ),
  }));

  const details = {
    list,
    pageLength: 25,
    currentPage: 1,
    totalRecords: list.length,
  };

  return (
    <div>
      <CommonDivider
        label={"Assigned Route List"}
        compo={
          <Button
            onClick={() => navigate("/assign-route")}
            className="mb-1 bg-green-400"
          >
            Assign Route
          </Button>
        }
      />

      <CommonTable
        loading={loading}
        uri={"assignroutes"}
        columns={columns}
        details={details}
        scroll={{ x: 600, y: 400 }}
      />
    </div>
  );
};

export default AssignedRouteList;
