"use client"

import { Button } from "@/components/ui/button"

export default function EditableField({
  field,
  value,
  isEditing,
  tempValue,
  onEdit,
  onSave,
  onCancel,
  onTempChange,
  className = "",
  multiline = false,
}) {
  if (isEditing) {
    return (
      <div className="space-y-2">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => onTempChange(e.target.value)}
            className={`w-full p-3 border border-[#caa057] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#fff1ed] ${className}`}
            rows={multiline === true ? 3 : multiline}
          />
        ) : (
          <input
            value={tempValue}
            onChange={(e) => onTempChange(e.target.value)}
            className={`bg-transparent border-b-2 border-[#caa057] outline-none ${className}`}
          />
        )}
        <div className="flex space-x-2">
          <Button size="sm" onClick={onSave} className="bg-[#caa057] hover:bg-[#b4924c]">
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="border-[#caa057] text-[#caa057] hover:bg-[#fff1ed] bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <span
      className={`cursor-pointer hover:text-[#caa057] transition-colors ${className}`}
      onClick={() => onEdit(field, value)}
    >
      {value || "Click to add..."}
    </span>
  )
}