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
            className={`w-full p-3 border border-orange-300/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200/20 ${className}`}
            rows={multiline === true ? 3 : multiline}
          />
        ) : (
          <input
            value={tempValue}
            onChange={(e) => onTempChange(e.target.value)}
            className={`bg-transparent border-b-2 border-orange-500 outline-none ${className}`}
          />
        )}
        <div className="flex space-x-2">
          <Button size="sm" onClick={onSave} className="bg-orange-500 hover:bg-orange-600">
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <span
      className={`cursor-pointer hover:text-orange-600 transition-colors ${className}`}
      onClick={() => onEdit(field, value)}
    >
      {value || "Click to add..."}
    </span>
  )
}
