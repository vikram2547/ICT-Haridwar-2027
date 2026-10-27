// import React from "react";
// import { useOutletContext } from "react-router";

// const PerformingVendors = ({ performanceData = [] }) => {
//   const [dict, lang] = useOutletContext();

//   return (
//     <div className="bg-white p-2 rounded-md">
//       <div className="flex justify-between items-center mb-4">
//         <div className="text-xl font-bold">
//           {dict.vendor_performance_overview[lang]}
//         </div>
//         <span className="text-gray-500">{dict.last_24_hrs[lang]}</span>
//       </div>
//       <div className="">
//         <div className="p-4 border rounded-md shadow-md">
//           <div className="text-start">
//             <div className="text-green-600 font-semibold flex gap-1 mb-2">
//               <span>{dict.high_performing_vendors[lang]}</span>
//             </div>
//             <ul className="mt-2">
//               <li className="flex justify-between font-semibold border-b pb-1">
//                 <span>{dict.vendor[lang]}</span>
//                 <span>{dict.not_Complaint[lang]}</span>
//               </li>
//               {performanceData?.highperformingvendors
//                 ?.slice(0, 3)
//                 ?.map((item, index) => (
//                   <li
//                     key={index}
//                     className="flex justify-between py-2 border-b last:border-b-0"
//                   >
//                     <span>
//                       {lang === "en"
//                         ? item?.vendor_name_en
//                         : item?.vendor_name_hi}
//                     </span>
//                     <span className="font-semibold">{item?.not_compliant}</span>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//       <div className="mt-2">
//         <div className="p-4 border rounded-md shadow-md">
//           <div className="text-start">
//             <div className="text-red-600 font-semibold flex gap-1 mb-2">
//               <span>{dict.low_performing_vendors[lang]}</span>
//             </div>
//             <ul className="mt-2">
//               <li className="flex justify-between font-semibold border-b pb-1">
//                 <span>{dict.vendor[lang]}</span>
//                 <span>{dict.not_Complaint[lang]}</span>
//               </li>
//               {performanceData?.lowperformingvendors
//                 ?.slice(0, 3)
//                 ?.map((item, index) => (
//                   <li
//                     key={index}
//                     className="flex justify-between py-2 border-b last:border-b-0"
//                   >
//                     <span>
//                       {lang === "en"
//                         ? item?.vendor_name_en
//                         : item?.vendor_name_hi}
//                     </span>
//                     <span className="font-semibold">{item?.not_compliant}</span>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PerformingVendors;

import React from "react";
import { useOutletContext } from "react-router";

const PerformingVendors = ({ performanceData = [] }) => {
  const [dict, lang] = useOutletContext();

  // Static demo data
  const staticPerformanceData = {
    highperformingvendors: [
      {
        vendor_name_en: "Clean India Services",
        vendor_name_hi: "क्लीन इंडिया सर्विसेज",
        not_compliant: 4,
      },
      {
        vendor_name_en: "Shree Sanitation Works",
        vendor_name_hi: "श्री सैनिटेशन वर्क्स",
        not_compliant: 7,
      },
      {
        vendor_name_en: "Green City Solutions",
        vendor_name_hi: "ग्रीन सिटी सॉल्यूशंस",
        not_compliant: 10,
      },
    ],
    lowperformingvendors: [
      {
        vendor_name_en: "Aarav Facility Management",
        vendor_name_hi: "आरव फैसिलिटी मैनेजमेंट",
        not_compliant: 42,
      },
      {
        vendor_name_en: "Om Sai Enterprises",
        vendor_name_hi: "ओम साई एंटरप्राइजेज",
        not_compliant: 36,
      },
      {
        vendor_name_en: "Shiv Shakti Services",
        vendor_name_hi: "शिव शक्ति सर्विसेज",
        not_compliant: 31,
      },
    ],
  };

  const hasApiData =
    performanceData?.highperformingvendors?.length > 0 ||
    performanceData?.lowperformingvendors?.length > 0;

  const data = hasApiData
    ? performanceData
    : staticPerformanceData;

  return (
    <div className="bg-white p-2 rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-bold">
          {dict.vendor_performance_overview[lang]}
        </div>

        <span className="text-xs text-gray-500">
          {dict.last_24_hrs[lang]}
        </span>
      </div>

      {/* High Performing Vendors */}
      <div className="p-3 border rounded-md shadow-sm">
        <div className="text-start">
          <div className="text-green-600 font-semibold mb-2">
            {dict.high_performing_vendors[lang]}
          </div>

          <ul>
            <li className="flex justify-between font-semibold border-b pb-2 text-sm">
              <span>{dict.vendor[lang]}</span>
              <span>{dict.not_Complaint[lang]}</span>
            </li>

            {data?.highperformingvendors?.slice(0, 3).map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center gap-2 py-2 border-b last:border-b-0 text-sm"
              >
                <span className="text-gray-700">
                  {lang === "en"
                    ? item?.vendor_name_en
                    : item?.vendor_name_hi}
                </span>

                <span className="font-semibold text-green-600">
                  {item?.not_compliant}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Low Performing Vendors */}
      <div className="mt-3 p-3 border rounded-md shadow-sm">
        <div className="text-start">
          <div className="text-red-600 font-semibold mb-2">
            {dict.low_performing_vendors[lang]}
          </div>

          <ul>
            <li className="flex justify-between font-semibold border-b pb-2 text-sm">
              <span>{dict.vendor[lang]}</span>
              <span>{dict.not_Complaint[lang]}</span>
            </li>

            {data?.lowperformingvendors?.slice(0, 3).map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center gap-2 py-2 border-b last:border-b-0 text-sm"
              >
                <span className="text-gray-700">
                  {lang === "en"
                    ? item?.vendor_name_en
                    : item?.vendor_name_hi}
                </span>

                <span className="font-semibold text-red-600">
                  {item?.not_compliant}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformingVendors;
