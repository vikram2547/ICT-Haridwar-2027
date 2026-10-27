
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import { useNavigate, useOutletContext } from "react-router-dom";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import { DICT } from "../../utils/dictionary";

const SectorsListing = () => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { SectorData } = VendorSectorSelectors();

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

  const columns = [
    {
      title: t("sector_list_name", "Sector Name"),
      dataIndex: "name",
      key: "name",
      width: 80,
    },
  ];

  useEffect(() => {
    if (SectorData) {
      const myData = SectorData?.data?.sectors || [];

      setDetails({
        list: myData,
        pageLength: 25,
        currentPage: 1,
        totalRecords: myData.length,
      });
    }
  }, [SectorData]);

  useEffect(() => {
    dispatch(getSectorsList());
  }, [dispatch]);

  return (
    <div>
      <CommonDivider
        label={t("sector_list_title", "Sector List")}
        compo={
          <Button
            onClick={() =>
              navigate("/add-sector-form", {
                state: {
                  key: "AddKey",
                },
              })
            }
            className="bg-orange-300 mb-1"
          >
            {t("sector_list_add_button", "Add Sector")}
          </Button>
        }
      />

      <CommonTable
        columns={columns}
        details={details}
        scroll={{ x: 1000, y: 400 }}
      />
    </div>
  );
};

export default SectorsListing;
