import React from "react";

const CopyWrite = ({ dict = {}, lang = "en" }) => {
  const t = (key, fallback) =>
    dict?.[key]?.[lang] ?? dict?.[key]?.en ?? fallback ?? key;

  return (
    <footer className="w-full flex items-center text-center justify-center bg-[#c9e8fc] bg-opacity-30 text-white font-semibold font-roboto p-1">
      <div className="md:w-10/12 w-11/12 xl:w-10/12 2xl:w-9/12 flex flex-col items-center justify-center m-auto">
        <div className="text-sm text-black">
          {t(
            "copyright_text",
            "Copyright © 2024-2025 Haridwar Mela Authority. All Rights Reserved."
          )}
        </div>

        <div className="text-sm text-green-800">
          {t(
            "hosted_by_text",
            "Hosted by Haridwar Mela Authority."
          )}
        </div>
      </div>
    </footer>
  );
};

export default CopyWrite;