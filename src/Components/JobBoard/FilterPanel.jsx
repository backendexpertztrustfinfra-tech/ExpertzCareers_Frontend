import { useMemo, useState } from "react";
import {
  Filter,
  Briefcase,
  GraduationCap,
  Clock,
  MapPin,
  Building,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const SECTION_CLASSES = "rounded-xl border border-gray-200 bg-white shadow-sm p-4";

const chipBase = "px-3 py-1.5 text-xs rounded-full border transition cursor-pointer select-none";
const chipOn = "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white font-medium shadow";
const chipOff = "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50";

export default function FilterPanel({ filters, setFilters, onApply, allJobs = [], className = "" }) {
  const [openMobile, setOpenMobile] = useState(false);
  const [openSection, setOpenSection] = useState("type");
  const [search, setSearch] = useState({
    location: "",
    company: "",
    jobCategory: "",
    experience: "",
  });
  const [salary, setSalary] = useState(filters?.salary || { min: 0, max: 50 });

  const dynamicExperience = useMemo(() => {
    const unique = new Set(allJobs.map((j) => j.experience).filter(Boolean));
    return Array.from(unique);
  }, [allJobs]);

  const dynamicIndustries = useMemo(() => {
    const unique = new Set(allJobs.map((j) => j.jobCategory).filter(Boolean));
    return Array.from(unique);
  }, [allJobs]);

  const OPTIONS = useMemo(
    () => ({
      type: ["Full-Time", "Part-Time", "Internship", "Freelance", "Fresher"],
      qualification: ["10th pass", "12th pass", "Diploma", "Graduate", "Post Graduate"],
      experience: dynamicExperience.length ? dynamicExperience : ["0-1 Years", "1-3 Years", "3-5 Years", "5+ Years"],
      location: ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Remote"],
      company: ["TCS", "Infosys", "Wipro", "Accenture", "HCL", "Tech Mahindra"],
      jobCategory: dynamicIndustries.length ? dynamicIndustries : ["IT", "HR", "Marketing", "Finance"],
      datePosted: ["Last 7 days", "Last 10 days", "Last 30 days", "Anytime"],
    }),
    [dynamicExperience, dynamicIndustries]
  );

  const sections = [
    { key: "type", title: "Job Type", icon: Briefcase },
    { key: "qualification", title: "Qualification", icon: GraduationCap },
    { key: "experience", title: "Experience", icon: Clock, searchable: true, custom: true },
    { key: "location", title: "City / Location", icon: MapPin, searchable: true, custom: true },
    { key: "company", title: "Company", icon: Building, searchable: true, custom: true },
    { key: "jobCategory", title: "Job Category", icon: Briefcase, searchable: true, custom: true },
    { key: "datePosted", title: "Date Posted", icon: Calendar },
  ];

  const toggleValue = (key, value) => {
    setFilters((prev) => {
      const current = new Set(prev[key] || []);
      current.has(value) ? current.delete(value) : current.add(value);
      return { ...prev, [key]: Array.from(current) };
    });
  };

  const clearSection = (key) => {
    if (key === "salary") {
      setSalary({ min: 0, max: 50 });
      setFilters((p) => ({ ...p, salary: { min: 0, max: 50 } }));
    } else {
      setFilters((p) => ({ ...p, [key]: [] }));
    }
  };

  const clearAll = () => {
    setFilters({
      type: [],
      qualification: [],
      experience: [],
      location: [],
      company: [],
      jobCategory: [],
      datePosted: [],
      salary: { min: 0, max: 50 },
    });
    setSalary({ min: 0, max: 50 });
    setSearch({ location: "", company: "", jobCategory: "", experience: "" });
  };

  const applyNow = () => {
    onApply?.(filters);
    setOpenMobile(false);
  };

  const addCustomValue = (key, value) => {
    if (!value.trim()) return;
    setFilters((prev) => {
      const current = new Set(prev[key] || []);
      current.add(value.trim());
      return { ...prev, [key]: Array.from(current) };
    });
    setSearch((s) => ({ ...s, [key]: "" }));
  };

  const PanelBody = (
    <div className="space-y-4 pb-24 md:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#caa057]" />
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        </div>
        <button onClick={clearAll} className="text-xs font-medium text-gray-600 hover:text-[#caa057] flex items-center gap-1">
          <X size={14} /> Clear All
        </button>
      </div>

      {sections.map(({ key, title, icon: Icon, searchable, custom }) => {
        const values = filters[key] || [];
        const count = values.length;
        const q = search[key] ?? "";
        const pool = OPTIONS[key] || [];
        const list = [...new Set([...pool, ...values])].filter((p) =>
          searchable ? p.toLowerCase().includes(q.toLowerCase()) : true
        );

        return (
          <div key={key} className={SECTION_CLASSES}>
            <button onClick={() => setOpenSection(openSection === key ? "" : key)} className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-[#caa057]" />
                <span className="text-sm font-semibold text-gray-900">{title}</span>
                {count > 0 && (
                  <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[#caa057] to-[#caa057] text-white">
                    {count}
                  </span>
                )}
              </div>
              {openSection === key ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
            </button>

            {openSection === key && (
              <div className="mt-3 space-y-3">
                {searchable && (
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-2 top-2.5 text-gray-400" />
                      <input
                        placeholder={`Search or Add ${title}`}
                        value={q}
                        onChange={(e) => setSearch((s) => ({ ...s, [key]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomValue(key, search[key]);
                          }
                        }}
                        className="w-full border rounded-md pl-7 pr-2 py-2 text-sm focus:ring-2 focus:ring-[#caa057] outline-none"
                      />
                    </div>
                    {custom && (
                      <button onClick={() => addCustomValue(key, search[key])} className="px-3 py-1.5 text-xs font-medium text-[#caa057] border border-[#caa057] rounded-md hover:bg-[#fff1ed]">
                        Add
                      </button>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {list.map((opt) => {
                    const active = values.includes(opt);
                    return (
                      <label key={opt} className={`${chipBase} ${active ? chipOn : chipOff}`}>
                        <input type="checkbox" className="hidden" checked={active} onChange={() => toggleValue(key, opt)} />
                        {opt}
                      </label>
                    );
                  })}
                </div>

                {count > 0 && <button onClick={() => clearSection(key)} className="text-xs text-gray-500 hover:text-[#caa057]">Clear {title}</button>}
              </div>
            )}
          </div>
        );
      })}

      <div className="hidden md:flex gap-2">
        <button onClick={applyNow} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-[#caa057] to-[#caa057] text-white hover:from-[#b4924c] hover:to-[#b4924c] shadow-md">
          <SlidersHorizontal size={16} /> Apply Filters
        </button>
        <button onClick={clearAll} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-[#caa057] text-[#caa057] hover:bg-[#fff1ed]">Reset</button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden flex justify-end mb-3">
        <button onClick={() => setOpenMobile(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#caa057] to-[#caa057] text-white text-sm font-semibold shadow-md hover:from-[#b4924c] hover:to-[#b4924c] active:scale-95 transition-all duration-200">
          <Filter size={18} className="text-white" /> Filters
        </button>
      </div>

      <aside className={`hidden md:block w-80 sticky top-24 max-h-[80vh] overflow-y-auto ${className}`}>{PanelBody}</aside>

      {openMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenMobile(false)} />
          <div className="absolute right-0 top-0 h-full w-4/5 bg-white p-4 overflow-y-auto">{PanelBody}</div>
        </div>
      )}
    </>
  );
}
