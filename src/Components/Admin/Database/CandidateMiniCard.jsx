"use client"

const safeParseSkills = (skills) => {
  if (!skills) return []
  if (Array.isArray(skills)) {
    const flat = []
    for (const s of skills.filter(Boolean)) {
      if (typeof s === "string") {
        s.split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .forEach((v) => flat.push(v))
      } else {
        const v = (s?.name || s?.skill || "").trim()
        if (v) flat.push(v)
      }
    }
    return Array.from(new Set(flat))
  }

  if (typeof skills === "string") {
    try {
      const arr = JSON.parse(skills)
      if (Array.isArray(arr)) {
        const flat = []
        for (const s of arr.filter(Boolean)) {
          if (typeof s === "string") {
            s.split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .forEach((v) => flat.push(v))
          } else {
            const v = (s?.name || s?.skill || "").trim()
            if (v) flat.push(v)
          }
        }
        return Array.from(new Set(flat))
      }
    } catch {}
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

const parseQualificationArray = (qualification) => {
  if (!qualification) return []

  if (Array.isArray(qualification)) {
    return qualification.map((q) => (typeof q === "object" && q ? q : null)).filter(Boolean)
  }

  if (typeof qualification === "string") {
    const lower = qualification.trim().toLowerCase()
    if (!lower || lower === "not provided" || lower === "not specified") return []

    // Many backends save multiple entries as JSON-like items separated by '@'
    return qualification
      .split("@")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        // Try parsing flexible JSON: fix single quotes and unquoted keys
        try {
          const fixed = item
            .replace(/'/g, '"') 
            .replace(/(\b\w+\b)\s*:/g, '"$1":') // wrap keys in quotes
          const obj = JSON.parse(fixed)
          return typeof obj === "object" ? obj : null
        } catch {
          // If not JSON, interpret as a degree string
          return item ? { degree: item } : null
        }
      })
      .filter(Boolean)
  }

  if (typeof qualification === "object") {
    return [qualification]
  }

  return []
}

const formatAppliedDate = (dateStr) => {
  if (!dateStr) return "Recently Applied"
  try {
    const date = new Date(dateStr)
    const now = new Date()
    if (Number.isNaN(date.getTime())) return "Recently Applied"
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`

    const yesterday = new Date()
    yesterday.setDate(now.getDate() - 1)
    if (yesterday.toDateString() === date.toDateString()) return "Yesterday"

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  } catch {
    return "Recently Applied"
  }
}

const isAppliedWithin24Hours = (dateStr) => {
  if (!dateStr) return false
  try {
    const date = new Date(dateStr)
    const now = new Date()
    return (now - date) / (1000 * 60 * 60) < 24
  } catch {
    return false
  }
}

const CandidateMiniCard = ({ candidate, onClick }) => {
  if (!candidate) return null

  const {
    username = "Unknown User",
    skills,
    profilePhoto,
    profilphoto,
    qualification,
    appliedDate,
    qualificationRaw,
  } = candidate

  const skillsArray = safeParseSkills(skills ?? candidate.Skill)
  const qualifications = parseQualificationArray(qualification ?? qualificationRaw)

  const appliedTimeText = formatAppliedDate(appliedDate)
  const isRecent = isAppliedWithin24Hours(appliedDate)

  const primary = qualifications[0]
  const qualText = primary
    ? `${primary.degree || primary.title || "N/A"}${primary.institution || primary.instution ? ` - ${primary.institution || primary.instution}` : ""}`
    : "Not Specified"
  const extraQuals = qualifications.length > 1 ? qualifications.length - 1 : 0

  return (
    <div
      onClick={() => onClick(candidate)}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-5 flex items-center gap-5 cursor-pointer hover:shadow-2xl hover:scale-[1.03] transition-transform duration-200 ease-in-out w-full"
    >
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 hover:from-blue-500 hover:to-purple-600 transition-all">
          <img
            src={profilePhoto || profilphoto || "https://cdn-icons-png.flaticon.com/512/219/219969.png"}
            alt={username}
            className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm hover:shadow-md transition"
            onError={(e) => {
              e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/219/219969.png"
            }}
          />
        </div>
        {isRecent && (
          <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white shadow-md">
            Active
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-lg truncate max-w-[160px] sm:max-w-[200px]">{username}</h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${isRecent ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
          >
            {appliedTimeText}
          </span>
        </div>

        <div className="mt-0.5 flex items-center gap-2 text-sm text-gray-500">
          <p className="truncate max-w-[220px]">{qualText}</p>
          {extraQuals > 0 && (
            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">+{extraQuals} more</span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {skillsArray.length > 0 ? (
            skillsArray.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm"
                title={skill}
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No skills listed</span>
          )}
          {skillsArray.length > 5 && (
            <span className="text-gray-500 text-xs font-medium">+{skillsArray.length - 5} more</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CandidateMiniCard
