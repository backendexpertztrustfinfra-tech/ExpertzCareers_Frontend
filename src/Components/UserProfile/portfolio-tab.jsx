"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Lightbulb, ExternalLink, FileText, GraduationCap, Award, ChevronRight, Edit3 } from "lucide-react"
import EditableField from "./editable-field"

export default function PortfolioTab({
  profile,
  editingField,
  tempValue,
  handleEdit,
  handleSave,
  handleCancel,
  setTempValue,
  handleResumeUpload,
  handlePortfolioSave,
  handleCertificateSave,
}) {
  const OTHER_SECTIONS = [
    {
      key: "projects",
      title: "Featured Projects",
      icon: Lightbulb,
      description: "Showcase your best work and achievements",
    },
    {
      key: "qualification",
      title: "Qualification",
      icon: GraduationCap,
      description: "Your academic background and qualifications",
    },
    {
      key: "certificationlink",
      title: "Certificates & Achievements",
      icon: Award,
      description: "Professional Certificates and achievements",
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-[#fff1ed]/5 to-[#fff1ed]/5 border-2 border-[#fff1ed]">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#caa057]" />
            Resume & Documents
          </CardTitle>
          <CardDescription>Upload your resume and other important documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="text-center p-8 border-2 border-dashed border-[#caa057] rounded-lg hover:border-[#caa057] transition-colors cursor-pointer"
              onClick={() => document.getElementById("resumeInput").click()}
            >
              <Upload className="w-12 h-12 text-[#caa057] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Upload Resume</h3>
              <p className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX (Max 5MB)</p>
              <Button className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              <input
                id="resumeInput"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
            </div>

            <div className="text-center p-8 border-2 border-dashed border-[#caa057] rounded-lg hover:border-[#caa057] transition-colors cursor-pointer">
              <Lightbulb className="w-12 h-12 text-[#caa057] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Portfolio Links</h3>
              <p className="text-sm text-gray-500 mb-4">GitHub, Behance, Personal Website</p>
              <Button
                variant="secondary"
                onClick={handlePortfolioSave}
                className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Add Links
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {OTHER_SECTIONS.map((field) => (
        <Card key={field.key} className="border-[#fff1ed]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <field.icon className="w-5 h-5 mr-2 text-[#caa057]" />
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
                onEdit={() => {}}
                onSave={handleSave}
                onCancel={handleCancel}
                onTempChange={setTempValue}
                multiline={6}
              />
            ) : profile[field.key] ? (
              <div className="space-y-4">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{profile[field.key]}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleEdit(field.key, profile[field.key])}
                  className="border-[#caa057] text-[#caa057] hover:bg-[#fff1ed]"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <field.icon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Add Your {field.title}</h3>
                <p className="text-gray-500 mb-6">{field.description}</p>
                <Button
                  onClick={() =>
                    field.key === "certificationlink" ? handleCertificateSave() : handleEdit(field.key, "")
                  }
                  className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
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