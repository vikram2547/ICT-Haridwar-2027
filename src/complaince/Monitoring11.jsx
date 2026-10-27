
import React, { useState, useEffect } from "react";
import { Table, Button, Input, message, Modal } from "antd";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router";
import QRCode from "qrcode.react";

import CommonDivider from "../commonComponents/CommonDivider";
import MonitoringReport from "./MonitoringReport";

const { Search } = Input;

const Monitoring = () => {
  const [dict, lang] = useOutletContext();

  const t = (key, fallback) =>
    dict?.[key]?.[lang] ?? dict?.[key]?.en ?? fallback ?? key;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isAssetList, setIsAssetList] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [assetInfo, setsetAssetInfo] = useState();

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "http://filemanagement.metaxpay.in:8001/asset-list/"
        );

        const result = await response.json();

        if (response.ok && result.data) {
          const transformedData = result.data.map((item, index) => ({
            key: item.id,
            srNo: index + 1,
            assetsId: item.id,
            dataCreated: item.date_created,
            assetsName: item.asset_name || "N/A",
            assetsCode: item.asset_code || "N/A",
            vendor: item.vendor || "N/A",
            qrCodeUrl: item.qr_code || "",
            img: item.asset_image,
          }));

          setData(transformedData);
          setFilteredData(transformedData);
        } else {
          message.error(
            result.message ||
              t("asset_monitoring_load_failed", "Failed to load assets")
          );
        }
      } catch (error) {
        message.error(
          t(
            "asset_monitoring_fetch_error",
            "An error occurred while fetching the assets"
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();

    const queryParams = new URLSearchParams(window.location.search);

    if (queryParams.get("status") === "success") {
      setSuccessMessage(
        t(
          "asset_monitoring_registered_success",
          "Asset Registered Successfully"
        )
      );

      const timeout = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [lang]);

  const handleSearch = (value) => {
    const searchValue = value.trim().toLowerCase();

    const filtered = data.filter(
      (item) =>
        String(item.assetsName).toLowerCase().includes(searchValue) ||
        String(item.assetsCode).toLowerCase().includes(searchValue) ||
        String(item.vendor).toLowerCase().includes(searchValue)
    );

    setFilteredData(filtered);
  };

  const showQrCode = (record) => {
    setQrCodeData(String(record.assetsCode || ""));
    setQrCodeUrl(record.qrCodeUrl || "");
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: t("asset_monitoring_name", "Assets Name"),
      dataIndex: "assetsName",
      key: "assetsName",
    },
    {
      title: t("asset_monitoring_code", "Assets Code"),
      dataIndex: "assetsCode",
      key: "assetsCode",
    },
    {
      title: t("asset_monitoring_vendor", "Vendor"),
      dataIndex: "vendor",
      key: "vendor",
    },
    {
      title: t("action", "Action"),
      key: "action",
      render: (text, record) => (
        <div className="flex flex-wrap gap-1">
          <Button type="link" onClick={() => showQrCode(record)}>
            {t("asset_monitoring_qr", "QR")}
          </Button>

          <Button
            type="link"
            onClick={() => setsetAssetInfo(record)}
          >
            {t("asset_monitoring_view_monitoring", "View Monitoring")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {!assetInfo ? (
        <div>
          {successMessage && (
            <div className="text-center text-green-500 font-bold mb-5">
              {successMessage}
            </div>
          )}

          {!isAssetList && (
            <>
              <CommonDivider
                label={t(
                  "asset_monitoring_listing",
                  "Assets Monitoring Listing"
                )}
              />

              <div className="mb-2 flex justify-between items-center">
                <Search
                  placeholder={t(
                    "asset_monitoring_search_placeholder",
                    "Search assets"
                  )}
                  onSearch={handleSearch}
                  allowClear
                  className="w-[300px]"
                />
              </div>

              <Table
                scroll={{ y: 450 }}
                columns={columns}
                bordered
                dataSource={filteredData}
                loading={loading}
                pagination={false}
                locale={{
                  emptyText: t(
                    "asset_monitoring_no_data",
                    "No assets found"
                  ),
                }}
              />
            </>
          )}

          {isAssetList && (
            <div>
              {t(
                "asset_monitoring_other_component",
                "Other Component/Form"
              )}
            </div>
          )}

          <Modal
            width={300}
            title={t("asset_monitoring_qr_title", "QR Code")}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <div className="flex justify-center items-center text-center">
              {qrCodeUrl ? (
                <img
                  src={
                    "http://filemanagement.metaxpay.in:8001" +
                    qrCodeUrl
                  }
                  alt={t("asset_monitoring_qr_alt", "Asset QR Code")}
                  className="w-[200px]"
                />
              ) : (
                <QRCode value={qrCodeData || " "} />
              )}
            </div>
          </Modal>
        </div>
      ) : (
        <div>
          <MonitoringReport
            data={assetInfo}
            setsetAssetInfo={setsetAssetInfo}
          />
        </div>
      )}
    </>
  );
};

export default Monitoring;
