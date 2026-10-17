import React from "react";
import Marquee from "react-fast-marquee";
import { Divider } from "antd";
import { useOutletContext } from "react-router";

const items = [
  { description: "Sanitation Area A: Clean and Well-Maintained - Completed" },
  { description: "Sanitation Area B: Scheduled for Inspection - Pending" },
  { description: "Tentage Section 1: Setup Completed - Completed" },
  { description: "Tentage Section 2: Setup in Progress - In Progress" },
  // Add more items as needed
];

const MessageContainer = () => {
  const [dict, lang] = useOutletContext();
  return (
    <div className="mt-3">
      <div className="text-green-700 font-semibold text-2xl">
        {/* {dict.sanitation_tentage_status[lang]}{" "} */}
        Sanitation Tentage Status
      </div>
      <Divider className="bg-green-500 mt-0" />
      <Marquee>
        {items.map((el, index) => {
          return (
            <div key={index} className="ml-4 bg-green-100 p-2 rounded">
              <div className="text-center text-sm font-semibold font-devnagri text-teal-950">
                {el.description}
              </div>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
};

export default MessageContainer;
