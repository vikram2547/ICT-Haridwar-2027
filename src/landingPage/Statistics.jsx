import { Divider, Statistic } from "antd";
import React from "react";
import CountUp from "react-countup";

import tentage from "../assets/MonitoringImages/Dashboard/tentage.png";
import toiletlogo from "../assets/MonitoringImages/Dashboard/toiletLogo.png";
import waste from "../assets/MonitoringImages/Dashboard/waste.png";
import cranetruck from "../assets/MonitoringImages/Dashboard/wsVhe.png";

import { useOutletContext } from "react-router";

const Statistics = () => {
  const [dict, lang] = useOutletContext();

  const formatter = (value) => <CountUp end={value} separator="," />;

  return (
    <div className="mt-3">
      <div className="text-green-700 font-semibold text-2xl ">
        {dict.statistics[lang]}
      </div>
      <Divider className="bg-green-500 mt-0" />

      <div className="grid grid-cols-2 sm:grid-cols-2 text-sm xs:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 mb-4 ">
        <div className="flex items-center justify-around   p-2  bg-lime-100 border-r-2  border-b-2 md:border-b-0 border-dashed  border-teal-400">
          <div className="flex w-12 md:w-16">
            <img src={tentage} className="w-full" alt="" />
          </div>
          <div className="flex items-center justify-around flex-col font-semibold">
            <span className="flex items-center ">
              <Statistic value={47811} formatter={formatter} />
            </span>
            <span className="flex items-center text-center">Total Tentage</span>
          </div>
        </div>

        <div className="flex items-center justify-around  p-2 bg-violet-100 border-b-2 md:border-b-0 md:border-r-2  border-dashed border-teal-400">
          <div className="flex w-12 md:w-16">
            <img src={toiletlogo} className="w-full" alt="" />
          </div>
          <div className="flex items-center justify-around flex-col font-semibold">
            <span className="flex items-center">
              <Statistic value={96000} formatter={formatter} />
            </span>
            <span className="flex items-center text-center font-semibold">
              Total Toilets & Urinals
            </span>
          </div>
        </div>

        <div className="flex items-center justify-around p-2 bg-green-100 border-r-2 border-teal-400 border-dashed">
          <div className="flex">
            <img src={cranetruck} className="w-12 sm:w-16 md:w-14" alt="" />
          </div>

          <div className="flex items-center justify-center flex-col">
            <span className="flex items-center font-semibold">
              <Statistic value={160} formatter={formatter} />
            </span>
            <span className="flex items-center text-center font-semibold">
              Total Vehicle
            </span>
          </div>
        </div>

        <div className="flex items-center justify-around p-2 bg-green-100 md:border-r-2 border-teal-400 border-dashed border-r-0">
          <div className="flex w-12 md:w-14 ml-2">
            <img src={waste} className="w-full" alt="" />
          </div>

          <div className="flex items-center justify-center flex-col font-semibold">
            <span className="flex items-center">
              <Statistic value={60000} formatter={formatter} />
            </span>
            <span className="flex items-center text-center font-semibold">
              {/* {dict.total_reunion[lang]} */}
              Total Bins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
