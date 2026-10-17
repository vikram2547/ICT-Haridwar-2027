import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Coming Soon!</h1>

      <p>Waste Collection Process</p>
      <p>Routes of waste collection Vehicles</p>
      <p>Bins Registration</p>
      <p>Routes Optimization</p>
      <p>Real Time GPS Fleet tracking Management</p>
      <p>Geo fencing</p>
     
      <p className="text-lg text-gray-600 mb-8">
        We're working hard to bring you this feature. Stay tuned!
      </p>
      <div>
        <Link to="/">
          <Button type="primary" size="large">
            Go Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
