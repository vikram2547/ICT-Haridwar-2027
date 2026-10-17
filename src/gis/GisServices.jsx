import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-10 bg-gray-100">
      <div>
        <Link to="/">
          <Button type="primary" size="large">
            Go Back to Home
          </Button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4">Coming Soon!</h1>

      <b>GIS Services:</b>
      <p>Survey of the geographical Area</p>
      <p>GIS Based Asset Registration</p>
      <p>Typographical Survey</p>
      <p>Route Survey</p>
      <p>Boundary Survey</p>
      <p>Validating the Data Points</p>
      <p>Creating the Shape Files</p>
      <p>Superimposing (Integration) Shape Files on the desired base Maps</p>
      <p>Geo coding & Creating Geo database</p>

      <b>Delivery:</b>
      <p>Accurate location intelligence</p>
      <p>Analytics capabilities</p>
      <p>Interactive maps</p>
      <p>Forecasting capabilities</p>
      <p>Monitoring of change over time</p>
      <p>Managing and responding to events</p>
      <p>Trend analysis capabilities</p>
      <p>Reporting</p>

      <p className="text-lg text-gray-600 mb-8">
        <b>We're working hard to bring you this feature. Stay tuned!</b>
      </p>
    </div>
  );
};

export default ComingSoon;
