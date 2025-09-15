import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
        <p className="mb-4">You don't have permission to view this page.</p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="px-4 py-2 bg-gray-200 rounded">Home</Link>
          <Link to="/signup" className="px-4 py-2 bg-yellow-500 text-white rounded">Complete Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
