"use client"

import { Button } from "@/components/ui/button"
import { Bell, X } from "lucide-react"

export default function AlertModal({ open, message, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white yellow:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm relative border-2 border-orange-400">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 yellow:text-gray-400 yellow:hover:text-gray-200"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-orange-500 mr-2" />
          <h3 className="text-xl font-semibold text-gray-800 yellow:text-white">Notification</h3>
        </div>
        <p className="text-gray-700 yellow:text-gray-300 text-center mb-6">{message}</p>
        <Button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          OK
        </Button>
      </div>
    </div>
  )
}
    