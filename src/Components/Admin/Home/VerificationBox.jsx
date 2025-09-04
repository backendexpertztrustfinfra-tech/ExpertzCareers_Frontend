import { useState } from "react";
import { FaCheckCircle, FaEnvelope, FaFileAlt } from "react-icons/fa";

const VerificationBox = () => {
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
  };

  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-md space-y-4 w-full max-w-md mx-auto">
      {/* Header */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
        Verification Status
      </h3>

      {/* Items */}
      <div className="space-y-3">
        <Item icon={<FaFileAlt />} label="Document Submission" status="Completed" />
        <Item
          icon={<FaEnvelope />}
          label="Email Verification"
          status={verified ? "Verified" : "Pending"}
        />
        <Item
          icon={<FaCheckCircle />}
          label="General Verification"
          status={verified ? "Verified" : "Pending"}
        />
      </div>

      {/* Button */}
      <button
        onClick={handleVerify}
        disabled={verified}
        className={`w-full py-2.5 rounded-lg text-sm sm:text-base font-semibold transition ${
          verified
            ? "bg-green-600 text-white cursor-not-allowed"
            : "bg-yellow-500 text-white hover:bg-yellow-600"
        }`}
      >
        {verified ? "Verified" : "Verify Now"}
      </button>
    </div>
  );
};

const Item = ({ icon, label, status }) => {
  const statusColor =
    status === "Completed" || status === "Verified"
      ? "text-green-600"
      : "text-yellow-500";

  return (
    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 sm:gap-2">
      <div className="flex items-center gap-2 text-gray-700">
        <div className="text-yellow-500 text-base sm:text-lg">{icon}</div>
        <span className="text-sm sm:text-base font-medium">{label}</span>
      </div>
      <span className={`text-xs sm:text-sm font-semibold ${statusColor}`}>
        {status}
      </span>
    </div>
  );
};

export default VerificationBox;
