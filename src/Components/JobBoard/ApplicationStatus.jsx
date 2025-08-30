// components/JobBoard/ApplicationStatus.jsx
import React from "react";

const statusStyles = {
  applied: "bg-blue-100 text-blue-700 border-blue-300",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  reviewed: "bg-green-100 text-green-700 border-green-300",
  rejected: "bg-red-100 text-red-700 border-red-300",
};

const statusLabels = {
  applied: "Applied",
  pending: "Pending",
  reviewed: "Reviewed",
  rejected: "Rejected",
};

const ApplicationStatus = ({ status = "applied" }) => {
  const style = statusStyles[status] || statusStyles["applied"];
  const label = statusLabels[status] || "Applied";

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${style}`}
    >
      {label}
    </span>
  );
};

export default ApplicationStatus;
