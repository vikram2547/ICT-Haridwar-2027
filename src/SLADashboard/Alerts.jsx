import React from "react";

function Alerts() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 pt-2 h-full w-full">
      <h2 className="text-lg font-bold mb-2">Alerts</h2>
      <div className="space-y-4">
        <div className="flex flex-col items-start justify-start bg-sky-50 p-2 rounded-md">
          <div className="flex ">
            <div className="w-3 h-3 mt-1 rounded-full bg-red-500 mr-2"></div>
            <div className="text-gray-700 font-semibold">Team Sigma</div>
          </div>
          <div className="text-gray-500 text-sm">15 MAR 2019 / 02:08 PM</div>
        </div>
        <div className="flex flex-col items-start justify-start bg-sky-50 p-2 rounded-md">
          <div className="flex ">
            <div className="w-3 h-3 mt-1 rounded-full bg-green-500 mr-2"></div>
            <div className="text-gray-700 font-semibold">Team Delta</div>
          </div>
          <div className="text-gray-500 text-sm">23 JUN 2019 / 11:31 PM</div>
        </div>
        <div className="flex flex-col items-start justify-start bg-sky-50 p-2 rounded-md">
          <div className="flex ">
            <div className="w-3 h-3 mt-1 rounded-full bg-blue-500 mr-2"></div>
            <div className="text-gray-700 font-semibold">Team Omega</div>
          </div>
          <div className="text-gray-500 text-sm">12 SEP 2019 / 02:46 PM</div>
        </div>
      </div>
      <div className="w-full flex mt-auto">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full m-auto mt-4">
          View All
        </button>
      </div>
    </div>
  );
}

export default Alerts;
