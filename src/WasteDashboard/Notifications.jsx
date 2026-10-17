import React from "react";

function Notifications() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 pt-2  h-full flex flex-col">
      <h2 className="text-lg font-bold mb-2">Notifications (2)</h2>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <div className="text-gray-700 font-semibold">Dr. Earl Howard</div>
              <div className="text-gray-500 text-sm">10:18 AM</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">TODAY</div>
        </div>
        <div className="flex flex-col items-start justify-start bg-gray-50 p-2 rounded-md">
          <div className="text-gray-700">
            Hello. You need to come and pass a few tests.
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <div className="text-gray-700 font-semibold">Dr. Earl Howard</div>
              <div className="text-gray-500 text-sm">10:18 AM</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">TODAY</div>
        </div>
        <div className="flex flex-col items-start justify-start bg-gray-50 p-2 rounded-md">
          <div className="text-gray-700">
            When will it be convenient for you to come to the reception?
          </div>
        </div>
      </div>
      <div className="w-full flex mt-auto">
        <button className="bg-orange-500 text-white px-4 py-2 rounded-full  m-auto mt-4 ">
          View All
        </button>
      </div>
    </div>
  );
}

export default Notifications;
