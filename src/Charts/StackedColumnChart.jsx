import { Divider, Statistic } from "antd";
import React from "react";
import CountUp from "react-countup";
import toiletLogo from "../assets/MonitoringImages/Dashboard/toiletLogo.png";
import waste from "../assets/MonitoringImages/Dashboard/waste.png";
import tentage from "../assets/MonitoringImages/Dashboard/tentage.png";
import wsVhe from "../assets/MonitoringImages/Dashboard/wsVhe.png";
import PercentageBar from "../dashboard/PercenrageBar";

const formatter = (value) => <CountUp end={value} separator="," />;

const StackedColumnChart = ({ sectors, showDashboardFor }) => {
  const content = showDashboardFor.names;

  return (
    <div
      className={`h-full w-full border justify-center items-center grid ${
        content.length >= 2 ? "grid-cols-2" : "grid-cols-1"
      }`}
    >
      {content[0] && (
        <SingleSanitization
          content={content[0]}
          matrices={showDashboardFor.dashboards}
          className="bg-green-200"
        ></SingleSanitization>
      )}

      {content[1] && (
        <SingleSanitization
          content={content[1]}
          matrices={showDashboardFor.dashboards}
          className="bg-yellow-100"
        ></SingleSanitization>
      )}

      {content[2] && (
        <SingleSanitization
          content={content[2]}
          matrices={showDashboardFor.dashboards}
          className="bg-teal-200"
        ></SingleSanitization>
      )}

      {content[3] && (
        <SingleSanitization
          content={content[3]}
          matrices={showDashboardFor.dashboards}
          className="bg-orange-200"
        ></SingleSanitization>
      )}
    </div>
  );
};

const SingleSanitization = ({ className, content }) => {
  const good = 30;
  const average = 35;
  const bad = 45;

  const statistics = (center = false) => {
    return (
      <div
        className={`flex flex-col ${
          center ? "justify-end items-end" : "justify-center  items-center"
        }w-full`}
      >
        <Statistic value={content.value.total} formatter={formatter} />
        <span className="text-2xl">{content.title}</span>
      </div>
    );
  };

  return (
    <div className={`flex items-center w-full justify-center p-1 ${className}`}>
      <div className="w-full">
        {
          <div className="flex flex-col gap-1 w-full">
            <div
              className={`  flex flex-col gap-1  justify-center items-center w-full`}
            >
              <img
                src={
                  content.title === "Sanitization"
                    ? toiletLogo
                    : content.title === "Tentage"
                    ? tentage
                    : content.title === "Wastes"
                    ? wsVhe
                    : waste
                }
                alt=""
                className={`h-12 mt-2`}
              />
            </div>
            <div className="flex gap-1 w-full justify-between">
              <div
                className={`flex flex-col justify-center items-center w-full`}
              >
                <div
                  className={`flex flex-col justify-center items-center w-full`}
                >
                  <Statistic
                    value={content.value.total}
                    formatter={formatter}
                  />
                  <span className="text-2xl">
                    {content.title === "Sanitization"
                      ? "Sanitation"
                      : content.title === "Wastes"
                      ? "Vehicle"
                      : content.title}
                  </span>
                </div>
              </div>
              <div
                className={
                  "flex flex-col text-white font-semibold w-full text-sm text-center items-end mr-1"
                }
              >
                <PercentageBar
                  good={(content.value.ok / content.value.total) * 100}
                  average={(content.value.average / content.value.total) * 100}
                  bad={(content.value.bad / content.value.total) * 100}
                />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default StackedColumnChart;
