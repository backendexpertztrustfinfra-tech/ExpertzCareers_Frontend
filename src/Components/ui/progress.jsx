import * as React from "react";

export function Progress({ value, max = 100 }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-orange-500 h-2.5 rounded-full"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}
