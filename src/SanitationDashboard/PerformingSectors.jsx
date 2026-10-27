// import React from "react";
// import { useOutletContext } from "react-router";

// const PerformingSectors = ({ performanceData = [] }) => {
//   const [dict, lang] = useOutletContext();

//   return (
//     <div className="bg-white p-2 rounded-md">
//       <div className="flex justify-between items-center mb-4">
//         <div className="text-xl font-bold">
//           {dict.sector_performance_overview[lang]}
//         </div>
//         <span className="text-gray-500">{dict.last_24_hrs[lang]}</span>
//       </div>
//       <div className="">
//         <div className="p-4 border rounded-md shadow-md">
//           <div className="text-start">
//             <div className="text-green-600 font-semibold flex gap-1 mb-2">
//               <span>{dict.high_performing_sector[lang]}</span>
//             </div>
//             <ul className="mt-2">
//               <li className="flex justify-between font-semibold border-b pb-1">
//                 <span>{dict.sector[lang]}</span>
//                 <span>{dict.not_Complaint[lang]}</span>
//               </li>
//               {performanceData?.highperformingsectors
//                 ?.slice(0, 3)
//                 ?.map((item, index) => (
//                   <li
//                     key={index}
//                     className="flex justify-between py-2 border-b last:border-b-0"
//                   >
//                     <span>
//                       {lang === "en"
//                         ? item?.sector_name_en
//                         : item?.sector_name_hi}
//                     </span>
//                     <span className="font-semibold">
//                       {item?.not_compliant}
//                       {/* {` ${dict.not_Complaint[lang]}`} */}
//                     </span>
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
//               <span>{dict.low_performing_sector[lang]}</span>
//             </div>
//             <ul className="mt-2">
//               <li className="flex justify-between font-semibold border-b pb-1">
//                 <span>{dict.sector[lang]}</span>
//                 <span>{dict.not_Complaint[lang]}</span>
//               </li>
//               {performanceData?.lowperformingsectors
//                 ?.slice(0, 3)
//                 ?.map((item, index) => (
//                   <li
//                     key={index}
//                     className="flex justify-between py-2 border-b last:border-b-0"
//                   >
//                     <span>
//                       {lang === "en"
//                         ? item?.sector_name_en
//                         : item?.sector_name_hi}
//                     </span>
//                     <span className="font-semibold">
//                       {item?.not_compliant}
//                       {/* {` ${dict.not_Complaint[lang]}`} */}
//                     </span>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PerformingSectors;

import React from "react";
import { useOutletContext } from "react-router";

const PerformingSectors = ({ performanceData = [] }) => {
  const [dict, lang] = useOutletContext();

  // Static data for demonstration
  const staticPerformanceData = {
    highperformingsectors: [
      {
        sector_name_en: "Sector 1 - Jhusi Ghat",
        sector_name_hi: "सेक्टर 1 - झूंसी घाट",
        not_compliant: 5,
      },
      {
        sector_name_en: "Sector 2 - Sangam Point",
        sector_name_hi: "सेक्टर 2 - संगम पॉइंट",
        not_compliant: 8,
      },
      {
        sector_name_en: "Sector 3 - Lal Bagh",
        sector_name_hi: "सेक्टर 3 - लाल बाग",
        not_compliant: 12,
      },
    ],
    lowperformingsectors: [
      {
        sector_name_en: "Sector 8 - Minto Bhatta",
        sector_name_hi: "सेक्टर 8 - मिंटो भट्ठा",
        not_compliant: 38,
      },
      {
        sector_name_en: "Sector 7 - Kachari Ghat",
        sector_name_hi: "सेक्टर 7 - कचहरी घाट",
        not_compliant: 41,
      },
      {
        sector_name_en: "Sector 5 - Bara Triveni",
        sector_name_hi: "सेक्टर 5 - बारा त्रिवेणी",
        not_compliant: 33,
      },
    ],
  };

  const hasApiData =
    performanceData?.highperformingsectors?.length > 0 ||
    performanceData?.lowperformingsectors?.length > 0;

  const data = hasApiData
    ? performanceData
    : staticPerformanceData;

  return (
    <div className="bg-white p-2 rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-bold">
          {dict.sector_performance_overview[lang]}
        </div>
        <span className="text-xs text-gray-500">
          {dict.last_24_hrs[lang]}
        </span>
      </div>

      {/* High Performing Sectors */}
      <div className="p-3 border rounded-md shadow-sm">
        <div className="text-start">
          <div className="text-green-600 font-semibold mb-2">
            {dict.high_performing_sector[lang]}
          </div>

          <ul>
            <li className="flex justify-between font-semibold border-b pb-2 text-sm">
              <span>{dict.sector[lang]}</span>
              <span>{dict.not_Complaint[lang]}</span>
            </li>

            {data?.highperformingsectors?.slice(0, 3).map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center gap-2 py-2 border-b last:border-b-0 text-sm"
              >
                <span className="text-gray-700">
                  {lang === "en"
                    ? item?.sector_name_en
                    : item?.sector_name_hi}
                </span>

                <span className="font-semibold text-green-600">
                  {item?.not_compliant}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Low Performing Sectors */}
      <div className="mt-3 p-3 border rounded-md shadow-sm">
        <div className="text-start">
          <div className="text-red-600 font-semibold mb-2">
            {dict.low_performing_sector[lang]}
          </div>

          <ul>
            <li className="flex justify-between font-semibold border-b pb-2 text-sm">
              <span>{dict.sector[lang]}</span>
              <span>{dict.not_Complaint[lang]}</span>
            </li>

            {data?.lowperformingsectors?.slice(0, 3).map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center gap-2 py-2 border-b last:border-b-0 text-sm"
              >
                <span className="text-gray-700">
                  {lang === "en"
                    ? item?.sector_name_en
                    : item?.sector_name_hi}
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

export default PerformingSectors;
