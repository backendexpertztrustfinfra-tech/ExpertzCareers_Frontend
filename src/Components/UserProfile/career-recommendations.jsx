"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Compass } from "lucide-react"

export default function CareerRecommendations({ aiRecommendations = [] }) {
  return (
    <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 yellow:from-orange-950/20 yellow:to-yellow-950/20 border border-orange-200/50 yellow:border-orange-800/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Bot className="w-5 h-5 mr-2 text-orange-500" />
          Career Recommendations
        </CardTitle>
        <CardDescription>Your job search performance at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {aiRecommendations.slice(0, 2).map((rec, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white/60 yellow:bg-gray-800/60 rounded-lg border border-orange-100/50 yellow:border-orange-800/50"
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
                <span className="font-medium text-sm">{rec.title}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {rec.match}% match
              </Badge>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
          >
            <Compass className="w-4 h-4 mr-2" />
            View All Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
