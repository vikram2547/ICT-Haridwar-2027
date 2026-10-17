import React from "react";

const ReusableFormElement = ({
  elementType = "input",
  label = "",
  htmlFor = "",
  type = "text",
  options = <></>,
}) => {
  return (
    <div className="w-full">
      <label
        className="tracking-wide text-gray-700 text-sm font-semibold mb-1"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {elementType === "input" && (
        <input
          className="appearance-none block w-full text-sm text-gray-700 border border-gray-200  py-1 px-1 leading-tight focus:outline-none focus:bg-white"
          id={htmlFor}
          type={type}
          placeholder={label}
        />
      )}
      {elementType === "select" && (
        <select
          className="block appearance-none w-full  border text-sm border-gray-200 text-gray-700 py-1 px-2 pr-8  leading-tight focus:outline-none focus:bg-white"
          id="relation"
        >
          {options}
        </select>
      )}
    </div>
  );
};

export default ReusableFormElement;
