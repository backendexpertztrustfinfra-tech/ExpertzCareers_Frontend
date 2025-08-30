import { useState } from "react";
import { FaCheckCircle, FaEnvelope, FaFileAlt } from "react-icons/fa";

const VerificationBox = () => {
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow space-y-4">
      <h3 className="text-lg font-semibold mb-2">Verification Status</h3>

      <Item
        icon={<FaFileAlt />}
        label="Document Submission"
        status="Completed"
      />
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

      <button
        onClick={handleVerify}
        disabled={verified}
        className={`mt-4 w-full py-2 rounded-lg text-white font-semibold transition ${
          verified
            ? "bg-green-600 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600"
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-700">
        <div className="text-yellow-500 text-md">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${statusColor}`}>{status}</span>
    </div>
  );
};

export default VerificationBox;
