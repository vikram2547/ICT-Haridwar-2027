import React from "react";
import { Divider } from "antd";
import Chart from "./Chart";
import { useOutletContext } from "react-router";

const SupportAndInfo = () => {
  const [dict, lang] = useOutletContext();
  return (
    <div className="mt-3">
      <div className=" text-green-700 font-semibold text-2xl ">
        {dict.support_info[lang]}
      </div>
      <Divider className="bg-green-500 mt-0" />

      <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 text-sm">
        <div className="border-1 border-cc h-60 ">
          <div className="bg-ec h-12 flex items-center justify-center uppercase font-semibold text-white text-lg">
            {dict.city_corner[lang]}
          </div>
          <div className="p-2">
            <ul className="list-disc font-semibold">
              <span className="hover:text-ec ">
                {/* {dict.info_missing[lang]} */}
                <li> हेल्पलाइन नंबर 1920 डायल करें</li>
                <li> सेक्टर 3-पुल नंबर 1 के पास</li>
                <li> सेक्टर 4-एसडीएम कार्यालय के पास</li>
                <li> सेक्टर 5-हरिश्चंद्र रोड पीडीएस शॉप के पास</li>
              </span>
            </ul>
          </div>
        </div>
        <div className="border-1 border-cc h-60 ">
          <div className="bg-5e  h-12 flex items-center justify-center uppercase font-semibold text-white text-lg">
            {dict.useful_links[lang]}
          </div>
          <div className="p-2">
            <ul className="list-disc  font-semibold ">
              <li className="">
                <span className="hover:text-ec">FAQ </span>
              </li>
              <li>
                <span className="hover:text-ec">Community Forum </span>
              </li>
              <li>
                <span className="hover:text-ec">Technical Support</span>
              </li>
              <li>
                <span className="hover:text-ec">Citizen Feedback</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-1 border-cc h-60">
          <div className="bg-ec9 h-12 flex items-center justify-center uppercase font-semibold text-white text-lg">
            {dict.login_section[lang]}
          </div>
          <div className="p-2">
            <ul className="list-disc font-semibold">
              <span className="hover:text-ec">
                <li>
                  {/* {dict.police[lang]} */}
                  UP Police Officials
                </li>{" "}
              </span>
              <span className="hover:text-ec">
                <li>Mela Officials Authority </li>
              </span>

              <span className="hover:text-ec">
                <li>{dict.citizens[lang]}</li>
              </span>
            </ul>
          </div>
        </div>
        <div className="border-1 border-cc h-60">
          <div className="bg-249B  h-12 flex items-center justify-center uppercase font-semibold text-white text-lg">
            {dict.todays_statistics[lang]}{" "}
          </div>
          <div className="flex items-center justify-center p-2">
            <Chart></Chart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportAndInfo;
