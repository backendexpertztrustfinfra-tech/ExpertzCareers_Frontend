import React, { useState } from "react";

const ProfileFormModal = ({ field, onSave, onClose }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSave(field, value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md border-2 border-[#d4af37]">
        <h2 className="text-xl font-semibold mb-4">Add {field}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${field}`}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3 mb-4"
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#d4af37] text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileFormModal;
