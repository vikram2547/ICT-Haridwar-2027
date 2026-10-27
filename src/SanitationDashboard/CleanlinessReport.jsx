// import React from "react";
// import Chart from "react-apexcharts";
// import { useOutletContext } from "react-router";
// import VendorSectorSelectors from "../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
// import SanitationDashSelector from "./Slice/sanitationDashboardSelector";

// const CleanlinessReport = () => {
//   const [dict, lang] = useOutletContext();
//   const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown ( api of this drop call in ToiletDetails component of sanitation dash)
//   const category = SectorListDrop?.map((data) => data?.label);
//   const { SanitationDash_data } = SanitationDashSelector(); // dashboard
//   const sectorOptions = SanitationDash_data?.data?.sectorgraph || [];

//   const options = {
//     chart: {
//       type: "bar",
//       stacked: false,
//       toolbar: {
//         show: false,
//       },
//     },
//     colors: ["#00E396", "#FF4560"],
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: "70%",
//         dataLabels: {
//           position: "top",
//         },
//       },
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: function (val) {
//         return val;
//       },
//       offsetY: -20,
//       style: {
//         fontSize: "12px",
//         colors: ["#304758"],
//       },
//     },
//     xaxis: {
//       categories: category || [],
//       // categories: sectorData?.map((sector) => sector?.name),
//     },
//     yaxis: {
//       title: {
//         text: "Time (Mins)",
//       },
//     },
//     fill: {
//       opacity: 1,
//     },
//     tooltip: {
//       y: {
//         formatter: function (val) {
//           return `${val} mins`;
//         },
//       },
//     },
//   };

//   const series = [
//     {
//       name: "Sanitized",
//       // data: [
//       //   60, 80, 75, 50, 49, 60, 70, 57, 78, 86, 47, 75, 86, 67, 98, 56, 75, 56,
//       //   87, 46, 55, 77, 66, 88, 76,
//       // ],
//       data: sectorOptions?.map((item) => Number(item?.yes) || 0),
//     },
//     {
//       name: "Non Sanitized",
//       // data: [
//       //   29, 30, 35, 20, 30, 24, 50, 30, 40, 55, 30, 66, 44, 55, 66, 44, 55, 44,
//       //   65, 45, 46, 37, 47, 54, 66,
//       // ],
//       data: sectorOptions?.map((item) => Number(item?.no) || 0),
//     },
//   ];

//   return (
//     <div className="bg-white p-3 rounded-lg mx-auto">
//       <div className="flex justify-between items-center mb-2">
//         <h3 className="text-xl font-bold">
//           {dict.sectorwise_cleanliness_report[lang]}
//         </h3>
//       </div>
//       <Chart options={options} series={series} type="bar" height={300} />
//     </div>
//   );
// };

// export default CleanlinessReport;

import React from "react";

const sectorData = [
  {
    sector: "Sector 1",
    location: "Jhusi Ghat",
    sanitized: 186,
    nonSanitized: 9,
  },
  {
    sector: "Sector 2",
    location: "Sangam Point",
    sanitized: 172,
    nonSanitized: 14,
  },
  {
    sector: "Sector 4",
    location: "Phalwa Road",
    sanitized: 131,
    nonSanitized: 17,
  },
  {
    sector: "Sector 3",
    location: "Lal Bagh",
    sanitized: 149,
    nonSanitized: 21,
  },
  {
    sector: "Sector 6",
    location: "Arail Side",
    sanitized: 96,
    nonSanitized: 26,
  },
  {
    sector: "Sector 5",
    location: "Bara Triveni",
    sanitized: 118,
    nonSanitized: 33,
  },
  {
    sector: "Sector 7",
    location: "Kachari Ghat",
    sanitized: 74,
    nonSanitized: 41,
  },
  {
    sector: "Sector 8",
    location: "Minto Bhatta",
    sanitized: 58,
    nonSanitized: 38,
  },
];

const CleanlinessReport = () => {
  const leftSectors = sectorData.slice(0, 3);
  const rightSectors = sectorData.slice(3, 6);

  const renderSector = (item) => {
    const total = item.sanitized + item.nonSanitized;
    const percentage =
      total > 0
        ? ((item.sanitized / total) * 100).toFixed(1)
        : "0.0";

    return (
      <div
        key={item.sector}
        className="border border-gray-100 rounded-md px-2 py-2 hover:bg-gray-50"
      >
        {/* Sector name and score */}
        <div className="flex justify-between items-center gap-1 mb-1">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-gray-800 truncate">
              {item.sector} · {item.location}
            </h4>
            <p className="text-xs text-emerald-700 font-medium mt-0.5">
              {item.sanitized} sanitized
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-gray-800 leading-tight">
              {percentage}%
            </p>
            <p className="text-[10px] text-gray-500">Cleanliness</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="h-full bg-red-500"
            style={{ width: `${100 - Number(percentage)}%` }}
          />
        </div>

        {/* Counts */}
        <div className="flex justify-between items-center mt-1.5 text-xs">
          <span className="text-emerald-500">
            Yes: {item.sanitized}
          </span>
          <span className="text-red-400">
            No: {item.nonSanitized}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow-sm w-full">
      {/* Compact Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-3">
        <div>
          <h3 className="text-base font-bold text-gray-800">
            Sector-wise Cleanliness Benchmark
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Sanitized vs Non-Sanitized inspections (last 24 hrs)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-gray-600">Sanitized (Yes)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-gray-600">Non-Sanitized (No)</span>
          </div>
        </div>
      </div>

      {/* Two-column sector layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {leftSectors.map(renderSector)}
        </div>

        <div className="flex flex-col gap-2">
          {rightSectors.map(renderSector)}
        </div>
      </div>
    </div>
  );
};

export default CleanlinessReport;
