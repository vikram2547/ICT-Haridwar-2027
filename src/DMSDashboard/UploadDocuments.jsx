// src/components/UploadDocument.js
import React from "react";

const UploadDocument = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h3 className="text-xl font-bold mb-4">Upload Document</h3>
      <div className="mb-4">
        <label className="block text-gray-700">Label</label>
        <input
          type="text"
          placeholder="Placeholder"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4 flex items-center">
        <input type="file" className="w-full p-2 border rounded mr-2" />
        <button className="bg-blue-500 text-white p-2 rounded">Upload</button>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Tags</label>
        <input
          type="text"
          placeholder="Tags"
          className="w-full p-2 border rounded"
        />
      </div>
      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
        Submit
      </button>
    </div>
  );
};

export default UploadDocument;
