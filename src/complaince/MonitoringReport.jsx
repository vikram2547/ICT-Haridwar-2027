import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Image, Divider } from "antd";
import {
  useLocation,
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";

import { getData } from "../Fetch/Axios";
import URLS from "../urils/URLS";
import CoordinatesMap from "../commonComponents/map/map";
import MonitoringEngPdf from "./monitoringEngPdf";
import ExportToExcel from "../Reports/ExportToExcel";

const MonitoringReport = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assetDetails, setAssetDetails] = useState({});
  const [excelData, setExcelData] = useState([]);

  const params = useParams();
  const navigate = useNavigate();
  const contentRef = useRef();
  const location = useLocation();
  const record = location.state?.record;

  // Get language and translations from the existing outlet context.
  const outletContext = useOutletContext() || [];
  const dict = outletContext[0] || {};
  const lang = outletContext[1] || "en";

  // Translation helper: selected language -> English -> fallback text.
  const t = (key, fallback) =>
    dict?.[key]?.[lang] ?? dict?.[key]?.en ?? fallback ?? key;

  const isHindi = lang === "hi";
  const ImageUrl = localStorage.getItem("ImageUrl") || "";

  // Fetch monitoring details from the API.
  const getDetails = async () => {
    setLoading(true);

    try {
      const uri = `${URLS.monitoringDetails.path}${params.id}`;
      const extraHeaders = {
        "x-api-version": URLS.monitoringDetails.version,
      };

      const res = await getData(uri, extraHeaders);

      if (res?.success && res.data?.monitoring?.length > 0) {
        const monitoringData = res.data.monitoring[0];

        const myexcelData = (monitoringData.questions || [])
          .filter((item) => item?.answer !== "N")
          .map((data, index) => ({
            sr: index + 1,
            question_en: data?.question_en,
            question_hi: data?.question_hi,
            question_display: isHindi
              ? data?.question_hi || data?.question_en
              : data?.question_en || data?.question_hi,
            description: data?.description,
            answer:
              data?.answer === "1"
                ? "Yes"
                : data?.answer === "0"
                ? "No"
                : "Maintenance",
            image: data?.image,
          }));

        setDetails(myexcelData);

        // Keep both English and Hindi question columns in Excel.
        const myexcelDatas = (monitoringData.questions || [])
          .filter((item) => item?.answer !== "N")
          .map((data, index) => ({
            [t("monitoring_report_excel_sr", "Sr No")]: index + 1,
            [t("monitoring_report_excel_question_en", "Question (English)")]:
              data?.question_en,
            [t("monitoring_report_excel_question_hi", "Question (Hindi)")]:
              data?.question_hi,
            [t("monitoring_report_excel_description", "Description")]:
              data?.description,
            [t("monitoring_report_excel_answer", "Answer")]:
              data?.answer === "1"
                ? t("monitoring_report_yes", "Yes")
                : data?.answer === "0"
                ? t("monitoring_report_no", "No")
                : t("monitoring_report_maintenance", "Maintenance"),
          }));

        setExcelData(myexcelDatas);

        setAssetDetails({
          asset_main_type_id: monitoringData?.asset_main_type_id,
          asset_main_type_name:
            monitoringData?.asset_main_type_name || "N/A",
          vendor_name: monitoringData?.vendor_name || "N/A",
          sector_name: monitoringData?.sector_name || null,
          circle_name: monitoringData?.circle_name || "N/A",
          latitude: monitoringData?.latitude || "N/A",
          longitude: monitoringData?.longitude || "N/A",
          remark: monitoringData?.remark || "No remarks",
          photo:
            monitoringData?.photo !== "N" ? monitoringData?.photo : null,
          asset_type_name: monitoringData?.asset_type_name || "",
          qrCode: monitoringData?.qr_code || null,
          code: monitoringData?.code || null,
          plot_no: monitoringData?.plot_no || null,
          mela_road_name: monitoringData?.mela_road_name || null,
          mela_patri_name: monitoringData?.mela_patri_name || null,
          parking_name: monitoringData?.parking_name || null,
          sanstha_name_hi: monitoringData?.sanstha_name_hi || null,
          smscount: monitoringData?.smscount || null,
          vendor_phone: monitoringData?.vendor_phone || null,
          unit_no: monitoringData?.unit_no || "N/A",
          submitted_date: monitoringData?.updated_at
            ? moment(monitoringData.updated_at).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : "N/A",
        });
      } else {
        setDetails([]);
        setExcelData([]);
        setAssetDetails({});
      }
    } catch (error) {
      console.error("Failed to fetch monitoring details:", error);
      setDetails([]);
      setExcelData([]);
      setAssetDetails({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
    // Re-fetch when the report ID or selected language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, lang]);

  // Table columns.
  const dateColumns = [
    {
      title: t("monitoring_report_sr_no", "Sr No"),
      dataIndex: "sr",
      key: "sr",
      width: "5%",
    },
    {
      title: t("monitoring_report_question_en", "Question"),
      dataIndex: "question_display",
      key: "question_display",
    },
    {
      title: t("monitoring_report_image", "Image"),
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image && image !== "N" ? (
          <Image
            width={130}
            src={`${ImageUrl}${image}`}
            alt={t("monitoring_report_question_image", "Question Image")}
          />
        ) : (
          "-"
        ),
      width: "15%",
    },
    {
      title: t("monitoring_report_answer", "Answer"),
      dataIndex: "answer",
      key: "answer",
      render: (answer) => (
        <div
          className={`p-1 px-3 rounded-md flex w-fit text-xs ${
            answer === "Yes"
              ? "bg-green-500"
              : answer === "No"
              ? "bg-orange-500"
              : "bg-blue-200"
          }`}
        >
          {answer === "Yes"
            ? t("monitoring_report_yes", "Yes")
            : answer === "No"
            ? t("monitoring_report_no", "No")
            : t("monitoring_report_maintenance", "Maintenance")}
        </div>
      ),
      width: "10%",
    },
  ];

  // PDF headings and rows use the currently selected language.
  const pdfHeader = [
    t("monitoring_report_sr_no", "Sr No"),
    t("monitoring_report_question", "Question"),
    t("monitoring_report_answer", "Answer"),
  ];

  const pdfData = details.map((opt, index) => [
    index + 1,
    opt?.question_display || "",
    opt?.answer === "Yes"
      ? t("monitoring_report_yes", "Yes")
      : opt?.answer === "No"
      ? t("monitoring_report_no", "No")
      : t("monitoring_report_maintenance", "Maintenance"),
  ]);

  const reportTitle = t("monitoring_report_title", "Monitoring Report");
  const pdfFileName = isHindi
    ? "निगरानी-रिपोर्ट"
    : "Monitoring-Report";

  return (
    <div>
      <div className="mx-auto p-3 pb-3 bg-white shadow-md rounded-lg w-full mt-3">
        <div className="flex items-center gap-2 font-semibold flex-wrap">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => {
              navigate("/monitoring", {
                state: {
                  key: "monitoring",
                  record,
                },
              });
            }}
          >
            <ArrowLeftOutlined />
          </Button>

          <div className="text-d9 text-2xl w-full md:w-auto flex items-end flex-wrap">
            <span className="mr-1">
              {t("monitoring_report_for", "Monitoring Report For:")}
            </span>
            <span className="text-blue-500">
              {assetDetails?.asset_type_name}
            </span>
          </div>

          <MonitoringEngPdf
            titleName={reportTitle}
            pdfName={pdfFileName}
            headerData={pdfHeader}
            rows={pdfData}
            tableObject={assetDetails || {}}
          />

          <ExportToExcel
            excelData={excelData || []}
            fileName={pdfFileName}
          />
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <div className="mt-3" ref={contentRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[40%,40%,20%]">
            {/* Asset information - first column */}
            <table className="table-auto w-full text-left border-collapse border-none">
              <tbody>
                <tr>
                  <td className="font-semibold w-[40%] border-0">
                    {t("monitoring_report_category", "Category")}
                  </td>
                  <td className="border-0">
                    : {assetDetails?.asset_main_type_name || "N/A"}
                  </td>
                </tr>

                <tr>
                  <td className="font-semibold w-[40%] border-0">
                    {t("monitoring_report_type", "Type")}
                  </td>
                  <td className="border-0">
                    : {assetDetails?.asset_type_name || "N/A"}
                  </td>
                </tr>

                <tr>
                  <td className="font-semibold w-[40%] border-0">
                    {t("monitoring_report_vendor_name", "Vendor Name")}
                  </td>
                  <td className="border-0">
                    : {assetDetails?.vendor_name || "N/A"}
                  </td>
                </tr>

                {assetDetails?.sector_name && (
                  <tr>
                    <td className="font-semibold w-[40%] border-0">
                      {t("monitoring_report_sector", "Sector")}
                    </td>
                    <td className="border-0">
                      : {assetDetails?.sector_name || "N/A"}
                    </td>
                  </tr>
                )}

                {assetDetails?.parking_name && (
                  <tr>
                    <td className="font-semibold w-[40%] border-0">
                      {t("monitoring_report_parking_name", "Parking Name")}
                    </td>
                    <td className="border-0">
                      : {assetDetails?.parking_name || "N/A"}
                    </td>
                  </tr>
                )}

                {/* Tentage-specific information */}
                {assetDetails?.asset_main_type_id === "2" && (
                  <>
                    <tr>
                      <td className="font-semibold w-[40%] border-0">
                        {t("monitoring_report_sanstha_name", "Sanstha Name")}
                      </td>
                      <td className="border-0">
                        : {assetDetails?.sanstha_name_hi || "N/A"}
                      </td>
                    </tr>

                    <tr>
                      <td className="font-semibold w-[40%] border-0">
                        {t(
                          "monitoring_report_mela_patri_name",
                          "Mela Patri Name"
                        )}
                      </td>
                      <td className="border-0">
                        : {assetDetails?.mela_patri_name || "N/A"}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            {/* Asset information - second column */}
            <table className="table-auto w-full text-left border-collapse border-none">
              <tbody>
                <tr>
                  <td className="font-semibold w-[40%] border-0">
                    {t("monitoring_report_latitude", "Latitude")}
                  </td>
                  <td className="border-0">
                    : {assetDetails?.latitude || "N/A"}
                  </td>
                </tr>

                <tr>
                  <td className="font-semibold w-[40%] border-0">
                    {t("monitoring_report_longitude", "Longitude")}
                  </td>
                  <td className="border-0">
                    : {assetDetails?.longitude || "N/A"}
                  </td>
                </tr>

                <tr>
                  <td className="font-semibold w-[40%] border-0">
                    {assetDetails?.asset_main_type_id === "2"
                      ? t("monitoring_report_taf_id", "TAF ID")
                      : t("monitoring_report_ptc_id", "PTC ID")}
                  </td>
                  <td className="border-0">
                    : {`${assetDetails?.code || "N/A"}-${assetDetails?.unit_no || "N/A"}`}
                  </td>
                </tr>

                {assetDetails?.asset_main_type_id === "2" && (
                  <tr>
                    <td className="font-semibold w-[40%] border-0">
                      {t(
                        "monitoring_report_mela_road_name",
                        "Mela Road Name"
                      )}
                    </td>
                    <td className="border-0">
                      : {assetDetails?.mela_road_name || "N/A"}
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="font-semibold w-[40%] border-0">
                    {t("monitoring_report_submitted_date", "Submitted Date")}
                  </td>
                  <td className="border-0">
                    :{" "}
                    {assetDetails?.submitted_date &&
                    assetDetails.submitted_date !== "N/A"
                      ? moment(assetDetails.submitted_date).format(
                          "DD-MMM-YYYY hh:mm A"
                        )
                      : "N/A"}
                  </td>
                </tr>

                <tr>
                  <td className="font-semibold w-[40%] border-0">
                    {t("monitoring_report_remark", "Remark")}
                  </td>
                  <td className="border-0">
                    : {assetDetails?.remark || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Images and map */}
            <div className="grid md:grid-cols-2">
              <div className="w-full">
                <div>
                  {t("monitoring_report_asset_image", "Asset Image")}
                </div>

                {assetDetails?.photo ? (
                  <Image
                    width={125}
                    height={125}
                    src={`${ImageUrl}${assetDetails.photo}`}
                    alt={t("monitoring_report_asset_image", "Asset Image")}
                  />
                ) : (
                  <span>
                    {t(
                      "monitoring_report_no_image",
                      "No Image Available"
                    )}
                  </span>
                )}
              </div>

              <div className="flex justify-center items-center w-full">
                <CoordinatesMap
                  coordinates={[
                    assetDetails?.longitude,
                    assetDetails?.latitude,
                  ]}
                  showLocation={false}
                />
              </div>
            </div>
          </div>
        </div>

        {details.length > 0 ? (
          <Table
            columns={dateColumns}
            dataSource={details}
            rowKey="sr"
            pagination={false}
            scroll={{ x: 1000, y: 350 }}
            bordered
            className="rounded-none mt-2"
            loading={loading}
          />
        ) : (
          <div className="mt-3 font-semibold text-orange-500 text-center">
            {loading
              ? t("monitoring_report_loading", "Loading report...")
              : t(
                  "monitoring_report_compliance_completed",
                  "Compliance completed successfully"
                )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringReport;