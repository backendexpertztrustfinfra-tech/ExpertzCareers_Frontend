"use client"

import { Button } from "@/components/ui/button"
import { Bell, X } from "lucide-react"

export default function MessageModal({ open, title = "Notification", message, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative border-2 border-[#caa057]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-[#caa057] mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-700 text-center mb-6">{message}</p>
        <Button onClick={onClose} className="w-full bg-[#caa057] hover:bg-[#b4924c] text-white">
          OK
        </Button>
      </div>
    </div>
  )
}
