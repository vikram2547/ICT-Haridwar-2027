import React from "react";
import { Button } from "antd";
import { Link, useOutletContext } from "react-router-dom";

const ComingSoon = () => {
  const outletContext = useOutletContext() || [];
  const dict = outletContext[0] || {};
  const lang = outletContext[1] || "en";

  const t = (key, fallback) =>
    dict?.[key]?.[lang] ?? dict?.[key]?.en ?? fallback ?? key;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">
        {t("coming_soon_title", "Coming Soon!")}
      </h1>

      <p className="text-lg text-gray-600 mb-8 text-center px-4">
        {t(
          "coming_soon_description",
          "We're working hard to bring you this feature. Stay tuned!"
        )}
      </p>

      <div>
        <Link to="/">
          <Button type="primary" size="large">
            {t("coming_soon_home_button", "Go Back to Home")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;