
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Button, message } from "antd";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import DropDown from "./DropDown";
import { DICT } from "../utils/dictionary";

import {
  DMS_param,
  gsd_wise_regi_reports,
  incident_reports,
  inspections_reports,
  masterData_param,
  monitoring_reports,
  reports_param,
  sanitationDash_param,
  sector_wise_reports,
  tentageDash_param,
  userAccess_param,
  vendor_wise_regi_reports,
  vendor_wise_reports,
  vendorDash_param,
  vehicleDash_param,
  gsd_wise_monitoring_reports,
  vehicle_reports,
  monitoring_dailyWeekly_reports,
  sector_wise_regi_reports,
  sector_type_wise_regi_reports,
  parking_wise_monitoring_reports,
  attendance_reports,
  asset_incident_reports,
  vendor_type_wise_regi_reports,
  parking_type_wise_regi_reports,
  vehicle_imei_reports,
  SLADash_param,
} from "../constant/permission";

import { logOutUser } from "../Login/slice/loginSlice";
import { revertAll } from "../Redux/action";
import { checkLoginAvailability } from "../constant/const";

const Navbar = ({ lang = "en", setLang }) => {
  const dict = DICT;
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use the selected language, with English as the fallback.
  const currentLang = lang || localStorage.getItem("lang") || "en";

  const t = (key, fallback) =>
    dict?.[key]?.[currentLang] ??
    dict?.[key]?.en ??
    fallback ??
    key;

  const [sessionToken, setSessionToken] = useState(
    localStorage.getItem("sessionToken")
  );

  const loggedIn = sessionToken;

  const sessionDataString = localStorage.getItem("sessionData");
  let sessionData = null;

  try {
    sessionData = sessionDataString ? JSON.parse(sessionDataString) : null;
  } catch (error) {
    console.error("Unable to parse session data:", error);
  }

  const tentageIdUser =
    sessionData?.allocatedmaintype?.[0]?.asset_main_type_id;

  const userRoleId = localStorage.getItem("role_id");

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleButtonClick = () => {
    if (localStorage.getItem("sessionToken")) {
      checkLoginAvailability(sessionData, navigate);
    } else {
      navigate("/login");
    }
  };

  const handleLogOut = async () => {
    try {
      const result = await dispatch(logOutUser());

      if (result?.data?.success) {
        message.success(t("navbar_logout_success", "User logged out"));
        dispatch(revertAll());

        localStorage.clear();
        sessionStorage.clear();

        setSessionToken(null);
        setOpen(false);
        navigate("/");
      } else {
        message.error(
          t("navbar_logout_failed", "Unable to log out. Please try again.")
        );
      }
    } catch (error) {
      message.error(
        t("navbar_logout_error", "Something went wrong while logging out.")
      );
    }
  };

  // Dashboard menu
  const dashboards = () => [
    sanitationDash_param?.includes(userRoleId) && {
      key: "2",
      label: (
        <Link className="text-black no-underline hover:text-green" to="/sanitation-dashboard">
          {t("navbar_sanitation_dashboard", "Sanitation Dashboard")}
        </Link>
      ),
    },

    (tentageDash_param?.includes(userRoleId) || tentageIdUser === "2") && {
      key: "3",
      label: (
        <Link className="text-black no-underline hover:text-green" to="/tentage-dashboard">
          {t("navbar_tentage_dashboard", "Tentage Dashboard")}
        </Link>
      ),
    },

    vehicleDash_param?.includes(userRoleId) && {
      key: "4",
      label: (
        <Link className="text-black no-underline hover:text-green" to="/vehicle-dashboard">
          {t("navbar_vehicle_dashboard", "Vehicle Dashboard")}
        </Link>
      ),
    },

    vendorDash_param?.includes(userRoleId) &&
      tentageIdUser !== "2" && {
        key: "6",
        label: (
          <Link className="text-black no-underline hover:text-green" to="/vendor-dashboard">
            {t("navbar_vendor_dashboard", "Vendor Dashboard")}
          </Link>
        ),
      },

    SLADash_param?.includes(userRoleId) && {
      key: "7",
      label: (
        <Link className="text-black no-underline hover:text-green" to="/SLA-dashboard">
          {t("navbar_sla_dashboard", "SLA Dashboard")}
        </Link>
      ),
    },
  ].filter(Boolean);

  // User access and registration
  const register_items = () => [
    {
      key: "1",
      label: (
        <Link className="text-black no-underline hover:text-green" to="/users">
          {t("navbar_user_registration", "User Registration")}
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link className="text-black no-underline" to="/vendor">
          {t("navbar_vendor_registration", "Vendor Registration")}
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link className="text-black no-underline" to="/asset-list">
          {t("navbar_toilets_tentage_registration", "Toilets & Tentage Registration")}
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <Link className="text-black no-underline" to="/vendor-supervisor-registration">
          {t("navbar_vendor_supervisor_registration", "Vendor Supervisor Registration")}
        </Link>
      ),
    },
  ];

  // Master data creation
  const master_items = () => [
    {
      key: "1",
      label: (
        <Link className="text-black no-underline" to="/asset-type-list">
          {t("navbar_toilets_tentage_type_list", "Toilets & Tentage Type List")}
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link className="text-black no-underline" to="/questions">
          {t("navbar_question_list", "Question List")}
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link className="text-black no-underline" to="/vehicle">
          {t("navbar_vehicle_list", "Vehicle List")}
        </Link>
      ),
    },
    {
      key: "14",
      label: (
        <Link className="text-black no-underline" to="/pickup-point">
          {t("navbar_pickup_points", "Pickup Points")}
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <Link className="text-black no-underline" to="/route-list">
          {t("navbar_gps_routes_list", "GPS Routes List")}
        </Link>
      ),
    },
    {
      key: "5",
      label: (
        <Link className="text-black no-underline" to="/assigned-routelist">
          {t("navbar_assigned_route_list", "Assigned Route List")}
        </Link>
      ),
    },
    {
      key: "6",
      label: (
        <Link className="text-black no-underline" to="/gis-services">
          {t("navbar_gis_map_registration", "GIS Map Registration")}
        </Link>
      ),
    },
    {
      key: "7",
      label: (
        <Link className="text-black no-underline" to="/sectors-listing">
          {t("navbar_sectors_list", "Sectors List")}
        </Link>
      ),
    },
    {
      key: "8",
      label: (
        <Link className="text-black no-underline" to="/parking">
          {t("navbar_parking_list", "Parking List")}
        </Link>
      ),
    },
    {
      key: "9",
      label: (
        <Link className="text-black no-underline" to="/manpower-assignment">
          {t("navbar_manpower_assignment", "Manpower Assignment")}
        </Link>
      ),
    },
    {
      key: "10",
      label: (
        <Link className="text-black no-underline" to="/shift">
          {t("navbar_shifts", "Shifts")}
        </Link>
      ),
    },
    {
      key: "11",
      label: (
        <Link className="text-black no-underline" to="/user-type-permission">
          {t("navbar_user_type_permission", "User Type Permission")}
        </Link>
      ),
    },
    {
      key: "12",
      label: (
        <Link className="text-black no-underline" to="/sector-allocation">
          {t("navbar_allocate_sector", "Allocate Sector")}
        </Link>
      ),
    },
    {
      key: "13",
      label: (
        <Link className="text-black no-underline" to="/asset-allocation">
          {t("navbar_allocate_assets", "Allocate Assets")}
        </Link>
      ),
    },
  ].sort((a, b) => {
    const labelA = String(a?.label?.props?.children ?? "").toLowerCase();
    const labelB = String(b?.label?.props?.children ?? "").toLowerCase();
    return labelA.localeCompare(labelB);
  });

  // DMS menu
  const dms_items = () => [
    {
      key: "1",
      label: (
        <Link className="text-black no-underline hover:text-green" to="/DMS-dashboard">
          {t("navbar_dms_dashboard", "DMS Dashboard")}
        </Link>
      ),
    },
  ];

  // Reports menu
  const reports_items = () => {
    const filteredReports = [
      monitoring_reports?.includes(userRoleId) && {
        key: "2",
        label: (
          <Link className="text-black no-underline hover:text-green" to="/monitoring">
            {t("navbar_monitoring_report", "Monitoring Report")}
          </Link>
        ),
      },
      monitoring_dailyWeekly_reports?.includes(userRoleId) && {
        key: "10",
        label: (
          <Link className="text-black no-underline hover:text-green" to="/monitoring-daily-report">
            {t("navbar_daily_monitoring_report", "Daily Monitoring Report")}
          </Link>
        ),
      },
      monitoring_dailyWeekly_reports?.includes(userRoleId) && {
        key: "11",
        label: (
          <Link className="text-black no-underline hover:text-green" to="/weekly-monitoring-report">
            {t("navbar_weekly_monitoring_report", "Weekly Monitoring Report")}
          </Link>
        ),
      },
      sector_wise_reports?.includes(userRoleId) && {
        key: "3",
        label: (
          <Link className="text-black no-underline" to="/sector-wise-report">
            {t("navbar_sector_wise_monitoring_report", "Sector Wise Monitoring Report")}
          </Link>
        ),
      },
      vendor_wise_reports?.includes(userRoleId) && {
        key: "5",
        label: (
          <Link className="text-black no-underline" to="/vendor-wise-report">
            {t("navbar_vendor_wise_monitoring_report", "Vendor Wise Monitoring Report")}
          </Link>
        ),
      },
      incident_reports?.includes(userRoleId) && {
        key: "6",
        label: (
          <Link className="text-black no-underline" to="/incident-report">
            {t("navbar_incident_report", "Incident Report")}
          </Link>
        ),
      },
      inspections_reports?.includes(userRoleId) && {
        key: "7",
        label: (
          <Link className="text-black no-underline" to="/inspection-report">
            {t("navbar_inspection_report", "Inspection Report")}
          </Link>
        ),
      },
      gsd_wise_regi_reports?.includes(userRoleId) && {
        key: "8",
        label: (
          <Link className="text-black no-underline" to="/gsd-wise-registration-report">
            {t("navbar_gsd_wise_registration_report", "GSD Wise Registration Report")}
          </Link>
        ),
      },
      vendor_wise_regi_reports?.includes(userRoleId) && {
        key: "9",
        label: (
          <Link className="text-black no-underline" to="/vendor-wise-registration-report">
            {t("navbar_vendor_wise_registration_report", "Vendor Wise Registration Report")}
          </Link>
        ),
      },
      sector_wise_regi_reports?.includes(userRoleId) && {
        key: "12",
        label: (
          <Link className="text-black no-underline" to="/sector-wise-registration-report">
            {t("navbar_sector_wise_registration_report", "Sector Wise Registration Report")}
          </Link>
        ),
      },
      sector_type_wise_regi_reports?.includes(userRoleId) && {
        key: "13",
        label: (
          <Link className="text-black no-underline" to="/sector-type-wise-registration-report">
            {t("navbar_sector_type_wise_registration_report", "Sector & Type Wise Registration Report")}
          </Link>
        ),
      },
      vendor_type_wise_regi_reports?.includes(userRoleId) && {
        key: "14",
        label: (
          <Link className="text-black no-underline" to="/vendor-type-wise-registration-report">
            {t("navbar_vendor_type_wise_registration_report", "Vendor & Type Wise Registration Report")}
          </Link>
        ),
      },
      parking_type_wise_regi_reports?.includes(userRoleId) && {
        key: "15",
        label: (
          <Link className="text-black no-underline" to="/parking-type-wise-registration-report">
            {t("navbar_parking_type_wise_registration_report", "Parking & Type Wise Registration Report")}
          </Link>
        ),
      },
      parking_wise_monitoring_reports?.includes(userRoleId) && {
        key: "16",
        label: (
          <Link className="text-black no-underline" to="/parking-wise-monitoring-report">
            {t("navbar_parking_wise_monitoring_report", "Parking Wise Monitoring Report")}
          </Link>
        ),
      },
      attendance_reports?.includes(userRoleId) && {
        key: "17",
        label: (
          <Link className="text-black no-underline" to="/attendance-report">
            {t("navbar_attendance_report", "Attendance Report")}
          </Link>
        ),
      },
      asset_incident_reports?.includes(userRoleId) && {
        key: "18",
        label: (
          <Link className="text-black no-underline" to="/asset-unit-report">
            {t("navbar_ptc_id_wise_monitoring_report", "PTC ID Wise Monitoring Report")}
          </Link>
        ),
      },
      gsd_wise_monitoring_reports?.includes(userRoleId) && {
        key: "19",
        label: (
          <Link className="text-black no-underline" to="/gsd-wise-monitoring-report">
            {t("navbar_gsd_wise_monitoring_report", "GSD Wise Monitoring Report")}
          </Link>
        ),
      },
      vehicle_reports?.includes(userRoleId) && {
        key: "20",
        label: (
          <Link className="text-black no-underline" to="/vehicle-report">
            {t("navbar_vehicle_report", "Vehicle Report")}
          </Link>
        ),
      },
      vehicle_imei_reports?.includes(userRoleId) && {
        key: "21",
        label: (
          <Link className="text-black no-underline" to="/vehicle-imei-report">
            {t("navbar_vehicle_tracking_report", "Vehicle Tracking Report")}
          </Link>
        ),
      },
      vehicle_imei_reports?.includes(userRoleId) && {
        key: "22",
        label: (
          <Link className="text-black no-underline" to="/weekly-registration-report">
            {t("navbar_weekly_registration_report", "Weekly Registration Report")}
          </Link>
        ),
      },
    ].filter(Boolean);

    return filteredReports.sort((a, b) => {
      const labelA = String(a?.label?.props?.children ?? "").toLowerCase();
      const labelB = String(b?.label?.props?.children ?? "").toLowerCase();
      return labelA.localeCompare(labelB);
    });
  };

  // Settings menu
  const setting_item = () => {
    const list = [
      {
        key: "1",
        label: (
          <Link className="text-black no-underline hover:text-green" to="/user-profile">
            {t("navbar_profile", "Profile")}
          </Link>
        ),
      },
      {
        key: "2",
        label: (
          <Link className="text-black no-underline hover:text-green" to="/change-password">
            {t("navbar_change_password", "Change Password")}
          </Link>
        ),
      },
    ];

    if (localStorage.getItem("sessionToken")) {
      list.push({
        key: "3",
        label: (
          <div
            className="text-black no-underline hover:text-green cursor-pointer"
            onClick={handleLogOut}
          >
            {t("navbar_logout", "Logout")}
          </div>
        ),
      });
    } else {
      list.push({
        key: "4",
        label: (
          <div
            className="text-black no-underline hover:text-green cursor-pointer"
            onClick={() => {
              setOpen(false);
              navigate("/login");
            }}
          >
            {t("navbar_login", "Login")}
          </div>
        ),
      });
    }

    return list;
  };

  return (
    <div className="px-3 font-nutino bg-white p-1 shadow-md max-w-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex gap-2 items-center">
          <button onClick={handleButtonClick} className="no-underline d-flex" />

          <button
            onClick={handleButtonClick}
            className="no-underline text-[13px] md:text-lg mr-1 bg-transparent border-none hover:text-blue-700 text-blue-500 font-bold"
          >
            {t("title2", "Dashboard")}
          </button>
        </div>

        <div className="z-50 flex items-center h-12 justify-center">
          {/* Desktop navigation */}
          <div className="hidden mt-0 xl:flex gap-1 justify-start items-center z-50 text-base font-semibold h-fit text-black lg:text-base">
            {!loggedIn && (
              <Link to="/login" className="no-underline text-black text-sm">
                <div className="h-9 flex items-center hover:bg-lime-300 px-2 rounded">
                  {t("home", "Home")}
                </div>
              </Link>
            )}

            {loggedIn && (
              <div className="h-9 flex items-center hover:bg-lime-300 px-2 rounded">
                <DropDown text="black" items={dashboards()} name={t("dashboard", "Dashboard")} />
              </div>
            )}

            {userAccess_param.includes(userRoleId) && (
              <div className="h-9 flex items-center hover:bg-lime-300 px-2 rounded">
                <DropDown
                  text="black"
                  items={register_items()}
                  name={t("user_access_registration", "User Access & Registration")}
                />
              </div>
            )}

            {masterData_param.includes(userRoleId) && (
              <div className="h-9 flex items-center hover:bg-lime-300 px-2 rounded">
                <DropDown
                  text="black"
                  items={master_items()}
                  name={t("master_data_creation", "Master Data Creation")}
                />
              </div>
            )}

            {reports_param.includes(userRoleId) && (
              <div className="h-9 flex items-center hover:bg-lime-300 px-2 rounded">
                <DropDown text="black" items={reports_items()} name={t("reports", "Reports")} />
              </div>
            )}

            <div className="h-9 flex items-center hover:bg-lime-300 px-2 rounded">
              <DropDown text="black" items={setting_item()} name={t("setting", "Settings")} />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex w-11/12 justify-between xl:hidden">
            <span className="flex items-start">
              <Button
                className="flex xl:hidden bg-transparent border-none text-black"
                onClick={showDrawer}
                aria-label={t("navbar_open_menu", "Open menu")}
              >
                <MenuOutlined />
              </Button>
            </span>
          </div>

          {/* Mobile drawer */}
          <Drawer
            onClose={onClose}
            open={open}
            title={
              <div className="text-violet-950 text-lg font-semibold">
                {t("title2", "Dashboard")}
              </div>
            }
          >
            <div className="text-base">
              {loggedIn && (
                <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300 hover:text-black px-3">
                  <DropDown
                    text="black"
                    items={dashboards()}
                    name={t("dashboard", "Dashboard")}
                  />
                </div>
              )}

              {!loggedIn && (
                <Link
                  to="/home"
                  onClick={onClose}
                  className="no-underline text-black"
                >
                  <div className="h-10 text-black border-b flex items-center hover:bg-orange-300 hover:text-black px-3">
                    {t("home", "Home")}
                  </div>
                </Link>
              )}

              {userAccess_param.includes(userRoleId) && (
                <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300 hover:text-black px-3">
                  <DropDown
                    text="black"
                    items={register_items()}
                    name={t("user_access_registration", "User Access & Registration")}
                  />
                </div>
              )}

              {masterData_param.includes(userRoleId) && (
                <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300 hover:text-black px-3">
                  <DropDown
                    text="black"
                    items={master_items()}
                    name={t("master_data_creation", "Master Data Creation")}
                  />
                </div>
              )}

              {DMS_param.includes(userRoleId) && (
                <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300 hover:text-black px-3">
                  <DropDown
                    text="black"
                    items={dms_items()}
                    name="DMS"
                  />
                </div>
              )}

              {reports_param.includes(userRoleId) && (
                <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300 hover:text-black px-3">
                  <DropDown
                    text="black"
                    items={reports_items()}
                    name={t("reports", "Reports")}
                  />
                </div>
              )}

              <div className="h-10 text-black font-semibold border-b flex items-center hover:bg-orange-300 hover:text-black px-3">
                <DropDown
                  text="black"
                  items={setting_item()}
                  name={t("setting", "Settings")}
                />
              </div>
            </div>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
