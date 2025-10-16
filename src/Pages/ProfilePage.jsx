"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect, useCallback, useMemo, useTransition } from "react"
import Cookies from "js-cookie"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../Components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
import {
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Award,
  Brain,
  Eye,
  Heart,
  Video,
  Upload,
  Edit3,
  CheckCircle,
  Rocket,
  Camera,
  Download,
  BarChart3,
  GraduationCap,
  Lightbulb,
  FileText,
  Bot,
  Compass,
  Bell,
  X,
  Building,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react"
import generateResume from "../utils/generateResume"
import { BASE_URL } from "../config"
import { deDupeFetch } from "../utils/request"

// --- Helper Functions ---

const safeJSONParse = (str, fallback = []) => {
  if (!str) return fallback
  if (typeof str !== "string") return str
  try {
    return JSON.parse(str)
  } catch (e) {
    console.error("JSON parse error:", e)
    return fallback
  }
}

const parseRegisterStyleObject = (item) => {
  if (!item || typeof item !== "string") return null
  // strip outer braces if present
  const trimmed = item.trim().replace(/^\{|\}$/g, "")
  const regex = /(\w+)\s*:\s*'([^']*)'/g
  const obj = {}
  let m
  while ((m = regex.exec(trimmed))) {
    obj[m[1]] = m[2]
  }
  return Object.keys(obj).length ? obj : null
}

const monthYearFormatLocal = (date) => {
  if (!date) return ""
  const d = new Date(date)
  if (isNaN(d.getTime())) return ""
  // Check if the date is a full date string (YYYY-MM-DD), if so, format to only show Month Year
  return d.toLocaleString("default", { month: "long", year: "numeric" })
}

// **NEW Helper to extract Month/Year from duration string**
const parseMonthYearFromDuration = (durationPart) => {
  if (!durationPart || durationPart === "Present") return ""
  // Normalize string to handle formats like "April 2026"
  // Use the first day of the month for date input compatibility
  const date = new Date(durationPart)
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    // Return YYYY-MM-DD format (using day 01)
    return `${year}-${month}-01`
  }
  return "" // Invalid date format
}

const parseSkills = (skillField) => {
  if (!skillField) return []
  if (Array.isArray(skillField)) return skillField
  if (typeof skillField === "string") {
    // try parse as JSON array first
    try {
      const parsed = JSON.parse(skillField)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // fallback: CSV string
    }
    return skillField
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

const parseQualOrExp = (field) => {
  if (!field) return []
  if (Array.isArray(field)) return field

  if (typeof field === "string") {
    const items = field.includes("@") ? field.split("@") : [field]

    return items
      .map((item) => {
        try {
          const fixed = item.replace(/'/g, '"')
          const parsedObject = JSON.parse(fixed)
          parsedObject.pursuing = parsedObject.pursuing === true || parsedObject.pursuing === "true"
          parsedObject.currentlyWorking =
            parsedObject.currentlyWorking === true || parsedObject.currentlyWorking === "true"

          if ((!parsedObject.startDate || !parsedObject.endDate) && parsedObject.duration) {
            const isPresent = parsedObject.duration.includes("Present")
            const parts = parsedObject.duration.split(isPresent ? " - " : / - |-/).map((p) => p.trim())

            if (parts.length >= 2) {
              if (!parsedObject.startDate) {
                parsedObject.startDate = parseMonthYearFromDuration(parts[0])
              }

              if (isPresent) {
                parsedObject.endDate = ""
                parsedObject.currentlyWorking = parsedObject.currentlyWorking || true
                parsedObject.pursuing = parsedObject.pursuing || true
              } else if (!parsedObject.endDate) {
                parsedObject.endDate = parseMonthYearFromDuration(parts[1])
                parsedObject.currentlyWorking = parsedObject.currentlyWorking || false
                parsedObject.pursuing = parsedObject.pursuing || false
              }
            }
          }

          parsedObject.startDate = parsedObject.startDate || ""
          parsedObject.endDate = parsedObject.endDate || ""

          return parsedObject
        } catch (e) {
          console.error("JSON parse error for item:", item, e)
          return null
        }
      })
      .filter(Boolean)
  }

  if (typeof field === "object") return [field]

  return []
}

const formatBackendData = (data) => {
  const u = data?.user || {}
  return {
    name: u.username || "",
    email: u.useremail || "",
    phone: u.phonenumber || "",
    designation: u.designation || "",
    location: u.location || "",
    profilphoto: u.profilphoto || "",
    videoIntro: u.introvideo || null,
    currentSalary: u.previousSalary || "",
    expectedSalary: u.salaryExpectation || "",
    bio: u.bio || "",
    projects: u.projectlink || "",
    certificationlink: u.certificationlink || "",
    portfioliolink: u.portfioliolink || "",
    resume: u.resume || "",
    Skills: parseSkills(u.Skill),
    qualification: parseQualOrExp(u.qualification),
    experience: parseQualOrExp(u.Experience),
    previouscompanyName: u.previouscompanyName || "",
  }
}

// --- Reusable Components (Updated) ---

const EditableField = ({
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
  placeholder = "",
}) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => onTempChange(e.target.value)}
            className={`w-full p-3 border border-orange-300/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200/20 ${className}`}
            rows={multiline === true ? 3 : multiline}
            placeholder={placeholder}
          />
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => {
              if (field === "phone") {
                const numberValue = e.target.value.replace(/[^0-9]/g, "")
                if (numberValue.length <= 10) {
                  onTempChange(numberValue)
                }
              } else {
                onTempChange(e.target.value)
              }
            }}
            maxLength={field === "phone" ? 10 : undefined}
            className={`bg-transparent border-b-2 border-orange-500 outline-none w-full ${className}`}
            placeholder={placeholder}
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
      className={`cursor-pointer hover:text-orange-600 transition-colors ${
        !value ? "text-gray-400" : "text-gray-900"
      } ${className}`}
      onClick={() => onEdit(field, value)}
    >
      {value || placeholder}
    </span>
  )
}

const StatCard = ({ label, value, icon: Icon, color, bg, trend }) => (
  <div
    className={`text-center p-4 ${bg} rounded-xl hover:scale-105 transition-transform duration-300 border border-orange-100/50`}
  >
    <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
    {trend && <div className="text-xs text-green-600 mt-1">{trend}</div>}
  </div>
)

const AddQualificationFormFixed = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    degree: "",
    instution: "",
    startDate: "",
    endDate: "",
    pursuing: false,
    fieldOfStudy: "",
  })

  const isFormValid = () => {
    return (
      form.degree.trim() !== "" &&
      form.instution.trim() !== "" &&
      form.startDate.trim() !== "" &&
      (form.pursuing || form.endDate.trim() !== "")
    )
  }

  return (
    <div className="p-4 border-2 border-dashed rounded-lg bg-gray-50 space-y-4">
      <h3 className="text-lg font-semibold">Add New Qualification</h3>
      <input
        type="text"
        value={form.degree}
        onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))}
        placeholder="Degree / Certification Name *"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        value={form.instution}
        onChange={(e) => setForm((p) => ({ ...p, instution: e.target.value }))}
        placeholder="instution / University Name *"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        value={form.fieldOfStudy}
        onChange={(e) => setForm((p) => ({ ...p, fieldOfStudy: e.target.value }))}
        placeholder="Field of Study (Optional)"
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
          className="w-1/2 p-2 border rounded"
          required // REQUIRED
        />
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
          disabled={form.pursuing}
          className="w-1/2 p-2 border rounded"
          required={!form.pursuing} // Conditional REQUIRED
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={form.pursuing}
          onChange={(e) => setForm((p) => ({ ...p, pursuing: e.target.checked }))}
        />
        Currently Pursuing
      </label>
      <div className="flex space-x-2">
        <Button
          onClick={() => {
            if (!isFormValid()) {
              alert("Please fill in all required fields (Name, instution, Start Date, and End Date/Pursuing).")
              return
            }
            onSave(form)
          }}
        >
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

// **FIXED: Added required attributes and validation**
const AddExperienceFormFixed = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    position: "",
    companyName: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
  })

  const isFormValid = () => {
    return (
      form.position.trim() !== "" &&
      form.companyName.trim() !== "" &&
      form.startDate.trim() !== "" &&
      (form.currentlyWorking || form.endDate.trim() !== "")
    )
  }

  return (
    <div className="p-4 border-2 border-dashed rounded-lg bg-gray-50 space-y-4">
      <h3 className="text-lg font-semibold">Add New Experience</h3>
      <input
        type="text"
        value={form.position}
        onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
        placeholder="Job Role / position *"
        className="w-full p-2 border rounded"
        required // REQUIRED
      />
      <input
        type="text"
        value={form.companyName}
        onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
        placeholder="Company Name *"
        className="w-full p-2 border rounded"
        required // REQUIRED
      />
      <div className="flex gap-2">
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
          className="w-1/2 p-2 border rounded"
          required // REQUIRED
        />
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
          disabled={form.currentlyWorking}
          className="w-1/2 p-2 border rounded"
          required={!form.currentlyWorking} // Conditional REQUIRED
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={form.currentlyWorking}
          onChange={(e) => setForm((p) => ({ ...p, currentlyWorking: e.target.checked }))}
        />
        Currently Working Here
      </label>
      <div className="flex space-x-2">
        <Button
          onClick={() => {
            if (!isFormValid()) {
              alert(
                "Please fill in all required fields (Job Role, Company Name, Start Date, and End Date/Currently Working).",
              )
              return
            }
            onSave(form)
          }}
        >
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

const EditableSkillRow = ({ skill, index, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(skill || "")

  useEffect(() => {
    setValue(skill || "")
  }, [skill])

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-white shadow-sm">
      {isEditing ? (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded-md"
            required // REQUIRED
          />
          <div className="flex space-x-1 ml-2">
            <Button
              size="sm"
              onClick={async () => {
                if (!value.trim()) return
                await onSave(index, value.trim())
                setIsEditing(false)
              }}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setValue(skill || "")
              }}
            >
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <span className="font-semibold text-gray-800">{skill}</span>
          <div className="flex space-x-1">
            <button onClick={() => setIsEditing(true)} className="p-1 rounded-full hover:bg-gray-100">
              <Edit3 className="w-4 h-4 text-gray-500" />
            </button>
            <button onClick={() => onDelete(index)} className="p-1 rounded-full hover:bg-red-100">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const AddSkillFormFixed = ({ onSave, onCancel }) => {
  const [name, setName] = useState("")
  return (
    <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Add New Skill</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., React, Node.js *"
        className="w-full max-w-sm p-2 border rounded-md mb-4 text-gray-900"
        required // REQUIRED
      />
      <div className="flex space-x-2">
        <Button
          onClick={() => {
            if (!name.trim()) return
            onSave(name.trim())
            setName("")
          }}
        >
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

// **FIXED: Use original date fields for display and editing**
const EditableQualificationCard = ({ qualification, index, onSave, onDelete }) => {
  // IMPORTANT: Use qualification's startDate/endDate/pursuing for initial state
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState(qualification || {})

  useEffect(() => {
    setForm(qualification || {})
  }, [qualification])

  const displayDuration = (() => {
    // Prefer to use the parsed full dates for display if available
    const start = form.startDate ? monthYearFormatLocal(form.startDate) : ""
    const end = form.pursuing ? "Present" : form.endDate ? monthYearFormatLocal(form.endDate) : ""

    // Fallback to the duration string from the backend if dates aren't fully populated
    if (start || end) {
      return `${start} - ${end}`
    }
    return qualification.duration || "N/A"
  })()

  const isFormValid = () => {
    return form.degree && form.instution && form.startDate && (form.pursuing || form.endDate)
  }

  return (
    <Card className="border-orange-100 hover:shadow-lg transition-shadow relative">
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              name="degree"
              value={form.degree || ""}
              onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))}
              placeholder="Degree / Certification Name *"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="instution"
              value={form.instution || ""}
              onChange={(e) => setForm((p) => ({ ...p, instution: e.target.value }))}
              placeholder="instution / University Name *"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="fieldOfStudy"
              value={form.fieldOfStudy || ""}
              onChange={(e) => setForm((p) => ({ ...p, fieldOfStudy: e.target.value }))}
              placeholder="Field of Study (Optional)"
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <input
                type="date"
                name="startDate"
                value={form.startDate || ""}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                className="w-1/2 p-2 border rounded"
                required // REQUIRED
              />
              <input
                type="date"
                name="endDate"
                value={form.endDate || ""}
                onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                disabled={form.pursuing}
                className="w-1/2 p-2 border rounded"
                required={!form.pursuing} // Conditional REQUIRED
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="pursuing"
                checked={form.pursuing || false}
                onChange={(e) => setForm((p) => ({ ...p, pursuing: e.target.checked }))}
              />
              Currently Pursuing
            </label>
            <div className="flex space-x-2 mt-4">
              <Button
                size="sm"
                onClick={async () => {
                  if (!isFormValid()) {
                    alert("Please fill in all required fields (Name, instution, Start Date, and End Date/Pursuing).")
                    return
                  }
                  await onSave(index, form)
                  setIsEditing(false)
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setForm(qualification || {})
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900">{qualification.degree || "N/A"}</h4>
                <p className="text-sm text-gray-600 mt-1">{qualification.instution || "N/A"}</p>
                {qualification.fieldOfStudy && (
                  <p className="text-xs text-gray-500 mt-1">{qualification.fieldOfStudy}</p>
                )}
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                <GraduationCap className="w-3 h-3 mr-1" />#{index + 1}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
              <Calendar className="w-4 h-4" />
              <span>{displayDuration}</span>
            </div>
            <div className="absolute top-2 right-2 flex space-x-1">
              <button onClick={() => setIsEditing(true)} className="p-1 rounded-full hover:bg-gray-100">
                <Edit3 className="w-4 h-4 text-gray-500" />
              </button>
              <button onClick={() => onDelete(index)} className="p-1 rounded-full hover:bg-red-100">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// **FIXED: Use original date fields for display and editing**
const EditableExperienceCard = ({ experience, index, onSave, onDelete }) => {
  // IMPORTANT: Use experience's startDate/endDate/currentlyWorking for initial state
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState(experience || {})

  useEffect(() => {
    setForm(experience || {})
  }, [experience])

  const displayDuration = (() => {
    // Prefer to use the parsed full dates for display if available
    const start = form.startDate ? monthYearFormatLocal(form.startDate) : ""
    const end = form.currentlyWorking ? "Present" : form.endDate ? monthYearFormatLocal(form.endDate) : ""

    // Fallback to the duration string from the backend if dates aren't fully populated
    if (start || end) {
      return `${start} - ${end}`
    }
    return experience.duration || "N/A"
  })()

  const isFormValid = () => {
    return form.position && form.companyName && form.startDate && (form.currentlyWorking || form.endDate)
  }

  return (
    <Card className="border-orange-100 hover:shadow-lg transition-shadow relative">
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              name="position"
              value={form.position || ""}
              onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
              placeholder="Job Role / position *"
              className="w-full p-2 border rounded"
              required // REQUIRED
            />
            <input
              type="text"
              name="companyName"
              value={form.companyName || ""}
              onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
              placeholder="companyName Name *"
              className="w-full p-2 border rounded"
              required // REQUIRED
            />
            <div className="flex gap-2">
              <input
                type="date"
                name="startDate"
                value={form.startDate || ""}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                className="w-1/2 p-2 border rounded"
                required // REQUIRED
              />
              <input
                type="date"
                name="endDate"
                value={form.endDate || ""}
                onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                disabled={form.currentlyWorking}
                className="w-1/2 p-2 border rounded"
                required={!form.currentlyWorking} // Conditional REQUIRED
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="currentlyWorking"
                checked={form.currentlyWorking || false}
                onChange={(e) => setForm((p) => ({ ...p, currentlyWorking: e.target.checked }))}
              />
              Currently Working Here
            </label>
            <div className="flex space-x-2 mt-4">
              <Button
                size="sm"
                onClick={async () => {
                  if (!isFormValid()) {
                    alert(
                      "Please fill in all required fields (Job Role, Company Name, Start Date, and End Date/Currently Working).",
                    )
                    return
                  }
                  await onSave(index, form)
                  setIsEditing(false)
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setForm(experience || {})
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900">{experience.position || "N/A"}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-600">{experience.companyName || "N/A"}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                <Briefcase className="w-3 h-3 mr-1" />#{index + 1}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
              <Clock className="w-4 h-4" />
              <span>{displayDuration}</span>
            </div>
            <div className="absolute top-2 right-2 flex space-x-1">
              <button onClick={() => setIsEditing(true)} className="p-1 rounded-full hover:bg-gray-100">
                <Edit3 className="w-4 h-4 text-gray-500" />
              </button>
              <button onClick={() => onDelete(index)} className="p-1 rounded-full hover:bg-red-100">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// --- Full Component ---
const ProfilePage = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    location: "",
    profilphoto: "",
    videoIntro: null,
    currentSalary: "",
    expectedSalary: "",
    bio: "",
    Skills: [],
    qualification: [],
    experience: [],
    projects: "",
    certificationlink: "",
    portfioliolink: "",
    resume: "",
    previouscompanyName: "",
  })
  const [jobStats, setJobStats] = useState({ applied: 0, saved: 0 })
  const [editingField, setEditingField] = useState("")
  const [tempValue, setTempValue] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

  // State for Skills
  const [isAddingSkill, setIsAddingSkill] = useState(false)

  // State for Qualifications
  const [isAddingQualification, setIsAddingQualification] = useState(false)

  // State for Experience
  const [isAddingExperience, setIsAddingExperience] = useState(false)

  // State for Portfolio links
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false)
  const [isEditingProjects, setIsEditingProjects] = useState(false)
  const [isEditingCert, setIsEditingCert] = useState(false)
  const [tempPortfolioValue, setTempPortfolioValue] = useState("")
  const [tempProjectValue, setTempProjectValue] = useState("")
  const [tempCertValue, setTempCertValue] = useState("")

  // Other state for file uploads
  const [videoFile, setVideoFile] = useState(null)
  const [previewVideo, setPreviewVideo] = useState(null)

  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const showNotification = (message) => {
    setModalMessage(message)
    setShowModal(true)
  }

  // --- API Functions ---
  const fetchJobStats = useCallback(async () => {
    const token = Cookies.get("userToken")
    if (!token) return

    try {
      const [appliedData, savedData] = await Promise.all([
        deDupeFetch(
          `${BASE_URL}/jobseeker/appliedjobs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
          { ttlMs: 15000 },
        ),
        deDupeFetch(
          `${BASE_URL}/jobseeker/getsavedJobs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
          { ttlMs: 15000 },
        ),
      ])

      startTransition(() => {
        setJobStats({
          applied: appliedData?.appliedJobs?.length || 0,
          saved: savedData?.savedJobs?.length || 0,
        })
      })
    } catch (err) {
      console.error("fetchJobStats error:", err)
      startTransition(() => setJobStats({ applied: 0, saved: 0 }))
    }
  }, [])

  const fetchProfile = useCallback(async () => {
    try {
      const token = Cookies.get("userToken")
      if (!token) {
        console.error("No token found in cookies")
        setLoading(false)
        return
      }

      const data = await deDupeFetch(
        `${BASE_URL}/jobseeker/getjobseekerprofile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
        { ttlMs: 15000 },
      )

      if (data?.message && !data?.user) {
        throw new Error(data.message || "Failed to fetch profile")
      }

      startTransition(() => {
        setProfile(formatBackendData(data))
        setLoading(false)
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      setLoading(false)
    }
  }, [])

  const setProfileSafely = useCallback(
    (data) => {
      if (data && data.user) {
        startTransition(() => setProfile(formatBackendData(data)))
      } else {
        // If the update response doesn't contain a full user object, refetch the profile
        fetchProfile()
      }
    },
    [fetchProfile],
  )

  /**
   * IMPORTANT FIX: This function has been significantly modified to resolve the res.json() error.
   * FIX 1: It now directly uses fetch with a manual .json() call and proper error checking.
   * FIX 2: It maintains the original data structure for the backend (stringified objects joined by '@').
   */
  const saveArrayToBackend = async (key, arrayData) => {
    try {
      const token = Cookies.get("userToken")
      if (!token) throw new Error("No auth token")

      const formData = new FormData()

      if (key === "Skill") {
        const csv = (arrayData || [])
          .map((s) => s.trim())
          .filter(Boolean)
          .join(", ")
        formData.append("Skill", csv)
      } else if (key === "qualification") {
        const finalString = (arrayData || [])
          .map((q) => {
            const start = q.startDate ? monthYearFormatLocal(q.startDate) : ""
            const end = q?.pursuing ? "Present" : q.endDate ? monthYearFormatLocal(q.endDate) : ""
            const duration = `${start} - ${end}`

            // Only save essential fields + duration for cross-platform compatibility
            const objectToSave = {
              degree: q.degree,
              instution: q.instution,
              fieldOfStudy: q.fieldOfStudy || "", // Keep this if necessary for app/display
              duration: duration,
            }

            // Using single quotes for the outer string as per the original structure
            return JSON.stringify(objectToSave).replace(/"/g, "'")
          })
          .join("@")
        formData.append("qualification", finalString)
      } else if (key === "Experience") {
        const finalString = (arrayData || [])
          .map((e) => {
            const start = e.startDate ? monthYearFormatLocal(e.startDate) : ""
            const end = e?.currentlyWorking ? "Present" : e.endDate ? monthYearFormatLocal(e.endDate) : ""
            const duration = `${start} - ${end}`

            // Only save essential fields + duration for cross-platform compatibility
            const objectToSave = {
              position: e.position,
              companyName: e.companyName,
              duration: duration,
            }

            // Using single quotes for the outer string as per the original structure
            return JSON.stringify(objectToSave).replace(/"/g, "'")
          })
          .join("@")
        formData.append("Experience", finalString)
      } else {
        // Fallback for other array types if needed
        formData.append(key, JSON.stringify(arrayData))
      }

      // Use plain fetch API or ensure deDupeFetch returns a standard Response object
      const apiRes = await fetch(`${BASE_URL}/jobseeker/updateProfile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      
      // Attempt to parse JSON regardless of status, as the server sends JSON errors too
      let data = {}
      try {
          data = await apiRes.json()
      } catch (jsonError) {
          // Ignore if unable to parse JSON (e.g., if response body is empty or not JSON)
      }

      if (!apiRes.ok) {
          // If the status is not 2xx, throw an error with the message from the backend
          throw new Error(data.message || `Failed to save data with status: ${apiRes.status}`)
      }

      setProfileSafely(data)
      return true
    } catch (err) {
      // The catch block handles both network/parsing errors AND explicit API errors
      console.error(`saveArrayToBackend error for ${key}:`, err)
      // Only show a generic fail message if the specific error is not useful
      showNotification(err.message || `Failed to save ${key}.`)
      return false
    }
  }

// **FIXED: Better error handling to prevent "Error: Profile Updated Successfully" issue**
  const handleUpdateProfile = async (payloadOrFormData) => {
    try {
      const token = Cookies.get("userToken")
      if (!token) throw new Error("No auth token")

      let body
      if (payloadOrFormData instanceof FormData) {
        body = payloadOrFormData
      } else {
        // optimistic merge to prevent flicker
        startTransition(() => {
          setProfile((prev) => {
            const optimistic = { ...prev }
            const beToUi = {
              username: "name",
              useremail: "email",
              phonenumber: "phone",
              designation: "designation",
              location: "location",
              previousSalary: "currentSalary",
              salaryExpectation: "expectedSalary",
              bio: "bio",
              projectlink: "projects",
              certificationlink: "certificationlink",
              portfioliolink: "portfioliolink",
              previouscompanyName: "previouscompanyName",
            }
            for (const [k, v] of Object.entries(payloadOrFormData)) {
              const uiKey = beToUi[k]
              if (uiKey) optimistic[uiKey] = v
            }
            return optimistic
          })
        })

        body = new FormData()
        Object.entries(payloadOrFormData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            body.append(key, value)
          }
        })
      }

      // Use plain fetch or handle deDupeFetch's response manually
      const apiRes = await fetch(
        `${BASE_URL}/jobseeker/updateProfile`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body,
        },
      )

      let data = {}
      try {
          data = await apiRes.json()
      } catch (jsonError) {
          // Server might return 200/201 without a body, that's okay.
      }


      // Check for HTTP status first
      if (!apiRes.ok) {
          // Throw an actual error if the update failed based on status
          throw new Error(data.message || `Failed to update profile with status: ${apiRes.status}`)
      }
      
      setProfileSafely(data)
      // Success: No need to throw an error, just show the notification.
      showNotification("Profile updated successfully!") 
    } catch (error) {
      console.error("Error updating profile:", error)
      showNotification(error.message || "Failed to update profile.")
      // Revert optimistic changes by refetching
      fetchProfile()
    }
  }

  const uiToBackendMap = {
    name: "username",
    email: "useremail",
    phone: "phonenumber",
    designation: "designation",
    location: "location",
    currentSalary: "previousSalary",
    expectedSalary: "salaryExpectation",
    bio: "bio",
    projects: "projectlink",
    certificationlink: "certificationlink",
    portfioliolink: "portfioliolink",
    previouscompanyName: "previouscompanyName",
  }

  const handleSaveAll = async () => {
    const payload = {}
    for (const [uiKey, beKey] of Object.entries(uiToBackendMap)) {
      payload[beKey] = profile[uiKey]
    }
    if (videoFile) {
      payload.introvideo = videoFile
    }

    await handleUpdateProfile(payload)
  }

  const handleEdit = (field, value) => {
    setEditingField(field)
    setTempValue(value)
  }

  const handleSave = async () => {
    const updatePayload = {}
    let needsUpdate = false

    // Use the uiToBackendMap for field mapping
    const beKey = uiToBackendMap[editingField]
    if (beKey) {
      if (profile[editingField] !== tempValue) {
        needsUpdate = true
        updatePayload[beKey] = tempValue
      }
    }

    if (needsUpdate) {
      await handleUpdateProfile(updatePayload)
    }

    setEditingField("")
    setTempValue("")
  }

  const handleCancel = () => {
    setEditingField("")
    setTempValue("")
  }

  // --- Skills Logic ---
  const handleAddSkill = async (skillName) => {
    if (!skillName.trim()) {
      showNotification("Skill name cannot be empty.")
      return
    }
    const newSkillsList = [...profile.Skills, skillName.trim()]
    const success = await saveArrayToBackend("Skill", newSkillsList)
    if (success) {
      setIsAddingSkill(false)
      showNotification("Skill added successfully!")
    }
  }

  const saveSkillAtIndex = async (index, updated) => {
    const newSkillsList = profile.Skills.map((s, i) => (i === index ? updated : s))
    const success = await saveArrayToBackend("Skill", newSkillsList)
    if (success) showNotification("Skill updated successfully!")
  }

  const handleRemoveSkill = async (index) => {
    if (!window.confirm("Are you sure you want to remove this skill?")) return
    const newSkillsList = profile.Skills.filter((_, i) => i !== index)
    const success = await saveArrayToBackend("Skill", newSkillsList)
    if (success) {
      showNotification("Skill removed successfully!")
    }
  }

  // --- Qualifications Logic ---
  const handleAddQualification = async (newQualData) => {
    if (!newQualData.degree || !newQualData.instution) {
      showNotification("Please fill in degree and instution.")
      return
    }
    const newQualsList = [...profile.qualification, newQualData]
    const success = await saveArrayToBackend("qualification", newQualsList)
    if (success) {
      setIsAddingQualification(false)
      showNotification("Qualification added successfully!")
    }
  }

  const saveQualificationAtIndex = async (index, updated) => {
    const newQualsList = profile.qualification.map((q, i) => (i === index ? updated : q))
    const success = await saveArrayToBackend("qualification", newQualsList)
    if (success) showNotification("Qualification updated successfully!")
  }

  const handleRemoveQualification = async (index) => {
    if (!window.confirm("Are you sure you want to remove this qualification?")) return
    const newQualsList = profile.qualification.filter((_, i) => i !== index)
    const success = await saveArrayToBackend("qualification", newQualsList)
    if (success) {
      showNotification("Qualification removed successfully!")
    }
  }

  // --- Experience Logic ---
  const handleAddExperience = async (newExpData) => {
    if (!newExpData.position || !newExpData.companyName) {
      showNotification("Please fill in job role and companyName.")
      return
    }
    const newExpList = [...profile.experience, newExpData]
    const success = await saveArrayToBackend("Experience", newExpList)
    if (success) {
      setIsAddingExperience(false)
      showNotification("Experience added successfully!")
    }
  }

  const saveExperienceAtIndex = async (index, updated) => {
    const newExpList = profile.experience.map((e, i) => (i === index ? updated : e))
    const success = await saveArrayToBackend("Experience", newExpList)
    if (success) showNotification("Experience updated successfully!")
  }

  const handleRemoveExperience = async (index) => {
    if (!window.confirm("Are you sure you want to remove this experience?")) return
    const newExpList = profile.experience.filter((_, i) => i !== index)
    const success = await saveArrayToBackend("Experience", newExpList)
    if (success) {
      showNotification("Experience removed successfully!")
    }
  }

  // --- Other profile field logic (video, resume, etc.) ---
  const handleVideoDelete = async () => {
    const fd = new FormData()
    fd.append("introvideo", "")
    await handleUpdateProfile(fd)
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append("introvideo", file)
    await handleUpdateProfile(fd)
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append("resume", file)
    await handleUpdateProfile(fd)
  }

  const handleDownloadResume = () => {
    if (!profile.name && !profile.email) {
      showNotification("Please fill in at least your name and email before generating the resume.")
      return
    }
    generateResume(profile)
    showNotification("Your resume has been generated and downloaded!")
  }

  const handleSavePortfolioField = async (field) => {
    let valueToSave
    let uiKey
    if (field === "projects") {
      valueToSave = tempProjectValue
      uiKey = "projects"
    } else if (field === "certificationlink") {
      valueToSave = tempCertValue
      uiKey = "certificationlink"
    } else if (field === "portfioliolink") {
      valueToSave = tempPortfolioValue
      uiKey = "portfioliolink"
    } else {
      return
    }

    const payload = { [uiToBackendMap[uiKey]]: valueToSave }
    await handleUpdateProfile(payload)

    if (field === "projects") setIsEditingProjects(false)
    if (field === "certificationlink") setIsEditingCert(false)
    if (field === "portfioliolink") setIsEditingPortfolio(false)
  }

  const handleCancelPortfolioEdit = (field) => {
    if (field === "projects") {
      setIsEditingProjects(false)
      setTempProjectValue(profile.projects)
    } else if (field === "certificationlink") {
      setIsEditingCert(false)
      setTempCertValue(profile.certificationlink)
    } else if (field === "portfioliolink") {
      setIsEditingPortfolio(false)
      setTempPortfolioValue(profile.portfioliolink)
    }
  }

  // **NEW: Use useMemo for expensive calculations**
  const contactInfo = useMemo(
    () => [
      {
        key: "location",
        icon: MapPin,
        value: profile.location,
        color: "text-[#caa057]",
        editable: true,
        placeholder: "Enter your city",
      },
      {
        key: "phone",
        icon: Phone,
        value: profile.phone,
        color: "text-yellow-500",
        editable: true,
        placeholder: "Enter your phone number",
      },
      {
        key: "email",
        icon: Mail,
        value: profile.email,
        color: "text-orange-600",
        editable: false, // Email usually not directly editable in profile
        placeholder: "Your email address",
      },
      // Removed previouscompanyName from contactInfo as it's handled elsewhere
    ],
    [profile.location, profile.phone, profile.email],
  )

  const jobStatsData = useMemo(
    () => [
      {
        label: "Applied",
        value: jobStats.applied,
        icon: Rocket,
        color: "text-[#caa057]",
        bg: "bg-orange-100",
      },
      {
        label: "Saved",
        value: jobStats.saved,
        icon: Heart,
        color: "text-red-500",
        bg: "bg-red-100",
      },
    ],
    [jobStats.applied, jobStats.saved],
  )

  useEffect(() => {
    fetchJobStats()
    fetchProfile()

    const updateStatsHandler = () => {
      fetchJobStats()
    }
    window.addEventListener("savedJobsUpdated", updateStatsHandler)
    window.addEventListener("appliedJobsUpdated", updateStatsHandler)
    return () => {
      window.removeEventListener("savedJobsUpdated", updateStatsHandler)
      window.removeEventListener("appliedJobsUpdated", updateStatsHandler)
    }
  }, [fetchJobStats, fetchProfile])

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-[#fff1ed] bg-white/80 p-6">
              <div className="h-6 w-40 bg-orange-100 rounded mb-2 animate-pulse" />
              <div className="h-4 w-64 bg-orange-50 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="p-4 rounded-xl border bg-white animate-pulse">
                    <div className="h-5 w-10 bg-orange-100 rounded mb-2" />
                    <div className="h-6 w-16 bg-orange-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-[#fff1ed] bg-[#fff1ed]/50 p-6 animate-pulse">
              <div className="h-6 w-56 bg-orange-100 rounded mb-2" />
              <div className="h-4 w-40 bg-orange-50 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden bg-gradient-to-br from-white via-orange-50 to-yellow-50 border-2 border-orange-200/50 shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-yellow-500/5"></div>
          <CardContent className="relative p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:gap-8">
              <div className="relative group text-center md:text-left mb-6 md:mb-0">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32 sm:w-36 sm:h-36 border-4 border-gradient-to-br from-orange-400 to-yellow-400 shadow-2xl ring-4 ring-orange-200/50">
                    <AvatarImage
                      src={profile.profilphoto ? `${BASE_URL}${profile.profilphoto}` : "/placeholder.svg"}
                      alt={profile.name}
                    />
                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-orange-500 to-yellow-500 text-white">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (!file) return
                      const formData = new FormData()
                      formData.append("profilphoto", file)
                      fetch(`${BASE_URL}/jobseeker/updateProfile`, {
                        method: "PUT",
                        headers: {
                          Authorization: `Bearer ${Cookies.get("userToken")}`,
                        },
                        body: formData,
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          if (data && data.user && data.user.profilphoto) {
                            startTransition(() => {
                              setProfile((prev) => ({
                                ...prev,
                                profilphoto: data.user.profilphoto,
                              }))
                            })
                          } else {
                            fetchProfile()
                          }
                          showNotification("Profile photo updated successfully!")
                        })
                        .catch((err) => {
                          console.error("Photo upload error:", err)
                          showNotification("Failed to upload photo.")
                        })
                    }}
                    accept="image/*"
                  />
                </div>
                <div className="mt-4">
                  {previewVideo || profile.videoIntro ? (
                    <div className="relative">
                      <video
                        src={previewVideo || `${BASE_URL}${profile.videoIntro}`}
                        controls
                        className="w-full max-w-xs mx-auto h-24 rounded-xl object-cover border-2 border-orange-300/50 shadow-lg"
                      />
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                        <Video className="w-3 h-3 mr-1" />
                        Intro
                      </Badge>
                      <button
                        onClick={handleVideoDelete}
                        className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-md shadow hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="relative group w-full max-w-xs mx-auto">
                      <div className="w-full h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl border-2 border-dashed border-orange-300/50 flex items-center justify-center cursor-pointer hover:from-orange-200 hover:to-yellow-200 transition-all duration-300 group-hover:scale-105">
                        <div className="text-center">
                          <Video className="w-8 h-8 text-[#caa057] mx-auto mb-2" />
                          <p className="text-xs text-[#caa057] font-medium">Add Video Intro</p>
                          <p className="text-xs text-gray-500">Stand out more!</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleVideoUpload}
                        accept="video/*"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold flex items-center group">
                    <EditableField
                      field="name"
                      value={profile.name}
                      isEditing={editingField === "name"}
                      tempValue={tempValue}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onTempChange={setTempValue}
                      className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                      placeholder="Enter your name"
                    />
                    {editingField !== "name" && (
                      <Edit3 className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#caa057]" />
                    )}
                  </h1>

                  {/* FIXED ERROR: Replaced <p> with <div> because <EditableField> can render a <div>, and <div> cannot be inside <p>. The styling classes are preserved. */}
                  <div className="text-base sm:text-xl text-gray-600 mt-1 sm:mt-2">
                    <EditableField
                      field="designation"
                      value={profile.designation}
                      isEditing={editingField === "designation"}
                      tempValue={tempValue}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onTempChange={setTempValue}
                      className="text-base sm:text-xl text-gray-600"
                      placeholder="Enter your designation"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map(({ key, icon: Icon, value, color, editable, placeholder }) => (
                    <div
                      key={key}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 hover:bg-[#fff1ed] transition-all duration-300 group border border-[#fff1ed] hover:border-[#caa057] hover:shadow-lg"
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                      {editable ? (
                        <EditableField
                          field={key}
                          value={value}
                          isEditing={editingField === key}
                          tempValue={tempValue}
                          onEdit={handleEdit}
                          onSave={handleSave}
                          onCancel={handleCancel}
                          onTempChange={setTempValue}
                          className="flex-1 group-hover:text-[#caa057] transition-colors text-sm sm:text-base font-medium"
                          placeholder={placeholder}
                        />
                      ) : (
                        <span className="flex-1 text-gray-500 text-sm sm:text-base font-medium">
                          {value || placeholder}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-14 sm:h-16 bg-white/80 backdrop-blur-sm border border-orange-200/50 rounded-xl">
            {[
              { value: "overview", icon: Eye, label: "Overview" },
              { value: "Skills", icon: Brain, label: "Skills" },
              { value: "experience", icon: Briefcase, label: "Experience" },
              { value: "portfolio", icon: Award, label: "Portfolio" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#caa057] data-[state=active]:to-[#caa057] data-[state=active]:text-white"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-[#fff1ed] h-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg sm:text-2xl">
                      <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#caa057]" />
                      Job Activity Dashboard
                    </CardTitle>
                    <CardDescription>Your job search performance at a glance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {jobStatsData.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="bg-gradient-to-br from-[#fff1ed]/70 to-[#fff1ed]/30 border border-[#fff1ed] flex flex-col justify-center h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Bot className="w-5 h-5 mr-2 text-[#caa057]" />
                      Career Recommendations
                    </CardTitle>
                    <CardDescription>AI-powered recommendations to boost your profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        onClick={() => navigate("/services")}
                        size="sm"
                        variant="outline"
                        className="w-full border-[#caa057] text-[#caa057] hover:bg-[#fff1ed] transition-colors duration-300 bg-transparent"
                      >
                        <Compass className="w-4 h-4 mr-2" />
                        View All Recommendations
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Skills" className="space-y-6">
            <Card className="border-[#fff1ed]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-[#caa057]" />
                  Skills
                </CardTitle>
                <CardDescription>Your technical and professional skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.Skills.map((skill, index) => (
                    <EditableSkillRow
                      key={`skill-${index}`}
                      skill={skill}
                      index={index}
                      onSave={saveSkillAtIndex}
                      onDelete={handleRemoveSkill}
                    />
                  ))}
                </div>

                {isAddingSkill ? (
                  <AddSkillFormFixed
                    onSave={async (name) => {
                      const newSkillsList = [...profile.Skills, name]
                      const ok = await saveArrayToBackend("Skill", newSkillsList)
                      if (ok) {
                        setIsAddingSkill(false)
                        showNotification("Skill added successfully!")
                      }
                    }}
                    onCancel={() => setIsAddingSkill(false)}
                  />
                ) : (
                  <Button
                    onClick={() => setIsAddingSkill(true)}
                    className="w-full mt-4 bg-[#caa057] hover:bg-[#b4924c] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add New Skill
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card className="border-[#fff1ed]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-[#caa057]" />
                  Education & Qualifications
                </CardTitle>
                <CardDescription>Your academic background and certifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.qualification.map((qual, index) => (
                  <EditableQualificationCard
                    key={`qual-${index}`}
                    qualification={qual}
                    index={index}
                    onSave={saveQualificationAtIndex}
                    onDelete={handleRemoveQualification}
                  />
                ))}
                {isAddingQualification ? (
                  <AddQualificationFormFixed
                    onSave={async (entry) => {
                      const newList = [...profile.qualification, entry]
                      const ok = await saveArrayToBackend("qualification", newList)
                      if (ok) {
                        setIsAddingQualification(false)
                        showNotification("Qualification added successfully!")
                      }
                    }}
                    onCancel={() => setIsAddingQualification(false)}
                  />
                ) : (
                  <Button
                    onClick={() => setIsAddingQualification(true)}
                    className="w-full mt-4 bg-[#caa057] hover:bg-[#b4924c] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add New Qualification
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-[#fff1ed]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-[#caa057]" />
                  Work Experience
                </CardTitle>
                <CardDescription>Your professional work history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.experience.map((exp, index) => (
                  <EditableExperienceCard
                    key={`exp-${index}`}
                    experience={exp}
                    index={index}
                    onSave={saveExperienceAtIndex}
                    onDelete={handleRemoveExperience}
                  />
                ))}
                {isAddingExperience ? (
                  <AddExperienceFormFixed
                    onSave={async (entry) => {
                      const newList = [...profile.experience, entry]
                      const ok = await saveArrayToBackend("Experience", newList)
                      if (ok) {
                        setIsAddingExperience(false)
                        showNotification("Experience added successfully!")
                      }
                    }}
                    onCancel={() => setIsAddingExperience(false)}
                  />
                ) : (
                  <Button
                    onClick={() => setIsAddingExperience(true)}
                    className="w-full mt-4 bg-[#caa057] hover:bg-[#b4924c] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add New Experience
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card className="bg-gradient-to-br from-[#fff1ed] to-[#fff1ed] border-2 border-[#fff1ed]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#caa057]" />
                  Resume & Documents
                </CardTitle>
                <CardDescription>Upload your resume and other important documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8 border-2 border-dashed border-[#caa057] rounded-lg hover:border-[#caa057] transition-colors">
                  <Upload className="w-12 h-12 text-[#caa057] mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Upload Resume</h3>
                  <p className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX (Max 5MB)</p>
                  <input
                    id="resumeInput"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                  />
                  <div className="flex flex-col items-center space-y-4">
                    <Button
                      className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg w-full max-w-xs"
                      onClick={() => document.getElementById("resumeInput").click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    {profile.resume && (
                      <a
                        href={`${BASE_URL}${profile.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full max-w-xs"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Resume
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#fff1ed]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-[#caa057]" />
                  Portfolio Links
                </CardTitle>
                <CardDescription>Showcase your work and professional achievements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "portfioliolink",
                    title: "Personal Portfolio",
                    icon: Lightbulb,
                    placeholder: "e.g., https://my-portfolio.com",
                    isEditing: isEditingPortfolio,
                    tempValue: tempPortfolioValue,
                    setTempValue: setTempPortfolioValue,
                    setIsEditing: setIsEditingPortfolio,
                  },
                  {
                    key: "projects",
                    title: "Project Links",
                    icon: FileText,
                    placeholder: "e.g., https://github.com/my-projects",
                    isEditing: isEditingProjects,
                    tempValue: tempProjectValue,
                    setTempValue: setTempProjectValue,
                    setIsEditing: setIsEditingProjects,
                  },
                  {
                    key: "certificationlink",
                    title: "Certificates & Achievements",
                    icon: Award,
                    placeholder: "e.g., https://coursera.org/certificate/...",
                    isEditing: isEditingCert,
                    tempValue: tempCertValue,
                    setTempValue: setTempCertValue,
                    setIsEditing: setIsEditingCert,
                  },
                ].map(({ key, title, icon: Icon, placeholder, isEditing, tempValue, setTempValue, setIsEditing }) => (
                  <div
                    key={key}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between"
                  >
                    <div className="flex items-center mb-2 sm:mb-0">
                      <Icon className="w-5 h-5 mr-2 text-[#caa057]" />
                      <h4 className="font-semibold">{title}</h4>
                    </div>
                    {isEditing ? (
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:ml-4 space-y-2 sm:space-y-0 sm:space-x-2">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          placeholder={placeholder}
                          className="flex-1 p-2 border rounded-md text-gray-900"
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleSavePortfolioField(key)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCancelPortfolioEdit(key)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        {profile[key] ? (
                          <a
                            href={profile[key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center"
                          >
                            View Link <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">{placeholder}</span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(true)
                            if (key === "projects") setTempProjectValue(profile[key] || "")
                            if (key === "certificationlink") setTempCertValue(profile[key] || "")
                            if (key === "portfioliolink") setTempPortfolioValue(profile[key] || "")
                          }}
                          className="border-[#caa057] text-[#caa057] hover:bg-[#fff1ed]"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          {profile[key] ? "Edit" : "Add"}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-12">
          <Button
            size="lg"
            onClick={handleSaveAll}
            className="px-8 bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Save All Changes
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleDownloadResume}
            className="px-8 border-[#caa057] text-[#caa057] hover:bg-[#fff1ed] bg-transparent"
          >
            <Download className="w-5 h-5 mr-2" />
            Generate Resume
          </Button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative border-2 border-orange-400">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-[#caa057] mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Notification</h3>
            </div>
            <p className="text-gray-700 text-center mb-6">{modalMessage}</p>
            <Button onClick={() => setShowModal(false)} className="w-full bg-[#caa057] hover:bg-[#b4924c] text-white">
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage