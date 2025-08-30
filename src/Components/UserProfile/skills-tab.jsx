"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, TrendingUp, Users, Play, ExternalLink, Target, Zap, Edit3, X } from "lucide-react"

export default function SkillsTab({ SkillAssessments, handleEditSkill, handleRemoveSkill, handleAddSkill }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SkillAssessments.map((Skill, index) => (
          <Card
            key={`${Skill.Skill}-${index}`}
            className="hover:shadow-lg transition-shadow border-orange-200/50 yellow:border-orange-800/50"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{Skill.Skill}</CardTitle>
                <div className="flex items-center space-x-2">
                  {Skill.verified && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-800 yellow:bg-orange-900 yellow:text-orange-200"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {Skill.trending && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEditSkill(index)}
                    className="px-2 py-1 rounded-md hover:bg-orange-50"
                    title="Edit Skill"
                  >
                    <Edit3 className="w-4 h-4 text-orange-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="px-2 py-1 rounded-md hover:bg-red-50"
                    title="Remove Skill"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Proficiency Level</span>
                <span className="font-bold">{Skill.level}%</span>
              </div>
              <Progress value={Skill.level} className="h-3 bg-orange-100 yellow:bg-orange-900" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm text-gray-500 yellow:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{Skill.endorsements} endorsements</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 yellow:border-orange-700 yellow:text-orange-400 yellow:hover:bg-orange-900/20 bg-transparent"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Take Test
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-dashed border-orange-300/50 hover:border-orange-500 transition-colors yellow:border-orange-700/50 yellow:hover:border-orange-400">
        <CardContent className="p-8 text-center">
          <Target className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Add New Skill</h3>
          <p className="text-gray-500 yellow:text-gray-400 mb-4">Showcase more of your expertise</p>
          <Button
            onClick={handleAddSkill}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
