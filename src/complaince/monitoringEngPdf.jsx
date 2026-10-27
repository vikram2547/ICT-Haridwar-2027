import React from "react";
import { useOutletContext } from "react-router-dom";
import { jsPDF } from "jspdf";
import moment from "moment";
import "jspdf-autotable";
import { Button, message } from "antd";
import { IMAGELIST } from "../assets/Images/exportImages";

const MonitoringEngPdf = ({
  titleName,
  pdfName,
  headerData,
  rows,
  tableObject = {},
  landscape = false,
}) => {
  const outletContext = useOutletContext() || [];
  const [dict, lang] = outletContext;

  const t = (key, fallback) =>
    dict?.[key]?.[lang] ?? dict?.[key]?.en ?? fallback ?? key;

  const exportToPDF = () => {
    if (rows && rows.length === 0) {
      message.error(
        t("monitoring_pdf_data_unavailable", "Data is not available")
      );
      return;
    }

    const doc = new jsPDF(landscape ? "landscape" : "portrait");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 6;

    doc.y = 15;

    // Main heading
    const ictHeading = t(
      "monitoring_pdf_main_heading",
      "Haridwar Kumbh 2027"
    );

    doc.setFontSize(23);
    doc.setFont("helvetica", "bold");
    doc.text(ictHeading, pageWidth / 2, doc.y, { align: "center" });

    doc.y += 15;

    // Government logo
    doc.addImage(
      `${IMAGELIST?.govt_logo}`,
      "JPEG",
      10,
      7,
      25,
      25,
      undefined,
      undefined,
      "FAST"
    );

    // Kumbh logo
    doc.addImage(
      `${IMAGELIST?.kumbhMela}`,
      "JPEG",
      pageWidth - 35,
      7,
      25,
      25,
      undefined,
      undefined,
      "FAST"
    );

    doc.y = Math.max(doc.y, 32);

    // System heading
    const subHeading = t(
      "monitoring_pdf_sub_heading",
      "ICT Sanitation and Tentage Monitoring System"
    );

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(subHeading, pageWidth / 2, doc.y, {
      align: "center",
      maxWidth: pageWidth - 75,
    });

    doc.y += 8;

    // Report title and date
    const title = titleName || "";
    const dateString = moment().format("DD-MMM-YYYY hh:mm A");

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, 19, doc.y, {
      maxWidth: pageWidth * 0.55,
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(dateString, pageWidth - 19, doc.y, {
      align: "right",
    });

    doc.y += 5;

    // Dynamic report details
    const tableData = [
      [
        t("monitoring_pdf_category", "Category"),
        `: ${tableObject?.asset_main_type_name || ""}`,
      ],
      [
        t("monitoring_pdf_type", "Type"),
        `: ${tableObject?.asset_type_name || ""}`,
      ],
      [
        t("monitoring_pdf_vendor_name", "Vendor Name"),
        `: ${tableObject?.vendor_name || ""}`,
      ],
      ...(tableObject?.sector_name
        ? [
            [
              t("monitoring_pdf_sector", "Sector"),
              `: ${tableObject.sector_name}`,
            ],
          ]
        : []),
      ...(tableObject?.parking_name
        ? [
            [
              t("monitoring_pdf_parking_name", "Parking Name"),
              `: ${tableObject.parking_name}`,
            ],
          ]
        : []),
      ...(tableObject?.asset_main_type_id === "2"
        ? [
            [
              t("monitoring_pdf_sanstha_name", "Sanstha Name"),
              `: ${tableObject?.sanstha_name_hi || ""}`,
            ],
            [
              t("monitoring_pdf_mela_patri_name", "Mela Patri Name"),
              `: ${tableObject?.mela_patri_name || ""}`,
            ],
            [
              t("monitoring_pdf_mela_road_name", "Mela Road Name"),
              `: ${tableObject?.mela_road_name || ""}`,
            ],
          ]
        : []),
      [
        tableObject?.asset_main_type_id === "2"
          ? t("monitoring_pdf_taf_id", "TAF ID")
          : t("monitoring_pdf_ptc_id", "PTC ID"),
        `: ${tableObject?.code || ""}-${tableObject?.unit_no || ""}`,
      ],
      [
        t("monitoring_pdf_submitted_date", "Submitted Date"),
        `: ${
          tableObject?.submitted_date
            ? moment(tableObject.submitted_date).format(
                "DD-MMM-YYYY hh:mm A"
              )
            : ""
        }`,
      ],
      [
        t("monitoring_pdf_remark", "Remark"),
        `: ${tableObject?.remark || ""}`,
      ],
    ];

    doc.autoTable({
      startY: doc.y,
      body: tableData,
      theme: "plain",
      styles: {
        font: "helvetica",
        fontSize: 12,
        cellPadding: 3,
        overflow: "linebreak",
      },
      margin: { left: 10, right: 10 },
      columnStyles: {
        0: { cellWidth: 45, fontStyle: "bold" },
        1: { cellWidth: "auto" },
      },
    });

    doc.y = doc.lastAutoTable.finalY;

    // Inspection notice
    const isTaf = tableObject?.asset_main_type_id === "2";
    const reportId = `${tableObject?.code || ""}-${tableObject?.unit_no || ""}`;
    const submittedDate = tableObject?.submitted_date
      ? moment(tableObject.submitted_date).format("DD-MMM-YYYY")
      : "";

    const instructionData = t(
      "monitoring_pdf_inspection_notice",
      `You are hereby being put to notice that upon inspection on ${submittedDate} you have been sent "${tableObject?.smscount || ""}" number of SMS alerts on your registered Mobile Number "${tableObject?.vendor_phone || ""}" individually for each ${reportId} ${isTaf ? "TAF ID" : "PTC ID"} for the infractions/lacunas/defects discovered with respect to the abovementioned type of toilet and the following deviations have been found overall with respect to the under mentioned work(s):`
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");

    const instructionDataLines = doc.splitTextToSize(
      instructionData,
      pageWidth - 30
    );

    let instructionHeight = instructionDataLines.length * lineHeight + 10;

    if (doc.y + instructionHeight + 15 > pageHeight - 20) {
      doc.addPage();
      doc.y = 15;
    }

    doc.y += 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, doc.y - 5, pageWidth - 20, instructionHeight, "F");

    instructionDataLines.forEach((line, index) => {
      doc.text(line, 15, doc.y + index * lineHeight);
    });

    doc.y += instructionHeight + 5;

    // Unit-wise report heading
    const tableTitle = t(
      "monitoring_pdf_unit_wise_title",
      "Unit Wise Monitoring Report"
    );

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(tableTitle, pageWidth / 2, doc.y, {
      align: "center",
      maxWidth: pageWidth - 30,
    });

    doc.y += 5;

    // Report table
    doc.autoTable({
      head: [headerData || []],
      body: rows || [],
      startY: doc.y,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 2,
        overflow: "linebreak",
      },
      headStyles: {
        font: "helvetica",
        fontStyle: "bold",
      },
      margin: { left: 10, right: 10 },
    });

    doc.y = doc.lastAutoTable.finalY + 10;

    // Remedial action notice
    const introduction2 = t(
      "monitoring_pdf_remedial_notice",
      "You are directed to take the requisite remedial actions/measures in connection with the report being enclosed, as may be required, forthwith, within 24 hours, and apprise the Authority of the curative action(s) taken in the form of an Action Taken Report. Please note failure to abide by this notice shall not only tantamount breach of contract but would also entitle the Authority to proceed further as per the terms and conditions of agreement."
    );

    const instructionDataLines2 = doc.splitTextToSize(
      introduction2,
      pageWidth - 30
    );

    const noticeHeight = instructionDataLines2.length * lineHeight + 10;

    if (doc.y + noticeHeight > pageHeight - 30) {
      doc.addPage();
      doc.y = 15;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(10, doc.y, pageWidth - 20, noticeHeight, "F");

    instructionDataLines2.forEach((line, index) => {
      doc.text(line, 15, doc.y + 7 + index * lineHeight);
    });

    // Footer on every page
    const footerText1 = t(
      "monitoring_pdf_copyright",
      "Copyright © 2026-2027 Haridwar Kumbh Mela Authority. All Rights Reserved."
    );

    const footerText2 = t(
      "monitoring_pdf_hosted_by",
      "Hosted by Haridwar Kumbh Mela Authority."
    );

    const totalPages = doc.internal.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      const footerY = doc.internal.pageSize.getHeight() - 12;

      doc.text(footerText1, pageWidth / 2, footerY - 4, {
        align: "center",
        maxWidth: pageWidth - 20,
      });

      doc.text(footerText2, pageWidth / 2, footerY, {
        align: "center",
        maxWidth: pageWidth - 20,
      });
    }

    // Save PDF
    doc.save(`${pdfName || "Monitoring-Report"}.pdf`);
  };

  return (
    <Button type="primary" onClick={exportToPDF}>
      {t("monitoring_pdf_download_button", "Download PDF")}
    </Button>
  );
};

export default MonitoringEngPdf;