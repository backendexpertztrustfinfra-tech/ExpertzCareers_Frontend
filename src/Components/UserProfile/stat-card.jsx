"use client"

export default function StatCard({ label, value, icon: Icon, color, bg, trend }) {
  return (
    <div
      className={`text-center p-4 ${bg} rounded-xl hover:scale-105 transition-transform duration-300 border border-orange-100/50 yellow:border-orange-800/50`}
    >
      <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-600 yellow:text-gray-400">{label}</div>
      {trend && <div className="text-xs text-green-600 mt-1">{trend}</div>}
    </div>
  )
}
