"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, DollarSign, TrendingUp, MapPin, Briefcase, ChevronRight, Edit3 } from "lucide-react"
import EditableField from "./editable-field"

const FIELDS = [
  {
    key: "summary",
    title: "Professional Summary",
    icon: FileText,
    description: "Brief overview of your professional background",
    multiline: 6,
  },
  {
    key: "currentSalary",
    title: "Current Salary",
    icon: DollarSign,
    description: "Your current compensation level",
  },
  {
    key: "expectedSalary",
    title: "Expected Salary",
    icon: TrendingUp,
    description: "Your compensation expectations for new roles",
  },
  {
    key: "preferredLocation",
    title: "Preferred Locations",
    icon: MapPin,
    description: "Cities or regions where you want to work",
  },
  {
    key: "previousCompany",
    title: "Previous Company",
    icon: Briefcase,
    description: "Your last company worked for",
  },
]

export default function ExperienceTab({
  profile,
  editingField,
  tempValue,
  handleEdit,
  handleSave,
  handleCancel,
  setTempValue,
}) {
  return (
    <div className="space-y-6">
      {FIELDS.map((field) => (
        <Card key={field.key} className="border-orange-200/50 yellow:border-orange-800/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <field.icon className="w-5 h-5 mr-2 text-orange-500" />
              {field.title}
            </CardTitle>
            <CardDescription>{field.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {editingField === field.key ? (
              <EditableField
                field={field.key}
                value={profile[field.key]}
                isEditing={true}
                tempValue={tempValue}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onTempChange={setTempValue}
                multiline={field.multiline ? field.multiline : 3}
              />
            ) : profile[field.key] ? (
              <div className="space-y-4">
                <p className="whitespace-pre-line">{profile[field.key]}</p>
                <Button
                  variant="outline"
                  onClick={() => handleEdit(field.key, profile[field.key])}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <field.icon className="w-16 h-16 text-gray-500 yellow:text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Add Your {field.title}</h3>
                <p className="text-gray-500 yellow:text-gray-400 mb-6">{field.description}</p>
                <Button
                  onClick={() => handleEdit(field.key, "")}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
