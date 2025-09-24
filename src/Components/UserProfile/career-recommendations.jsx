"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Compass } from "lucide-react"

export default function CareerRecommendations({ aiRecommendations = [] }) {
  return (
    <Card className="bg-gradient-to-r from-[#fff1ed] to-[#fff1ed] border border-[#fff1ed]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Bot className="w-5 h-5 mr-2 text-[#caa057]" />
          Career Recommendations
        </CardTitle>
        <CardDescription>Your job search performance at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {aiRecommendations.slice(0, 2).map((rec, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-[#fff1ed]"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    rec.priority === "high"
                      ? "bg-red-500"
                      : rec.priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="font-medium text-sm text-gray-800">{rec.title}</span>
              </div>
              <Badge variant="secondary" className="text-xs bg-[#fff1ed] text-[#caa057]">
                {rec.match}% match
              </Badge>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            className="w-full border-[#caa057] text-[#caa057] hover:bg-[#fff1ed] bg-transparent"
          >
            <Compass className="w-4 h-4 mr-2" />
            View All Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}