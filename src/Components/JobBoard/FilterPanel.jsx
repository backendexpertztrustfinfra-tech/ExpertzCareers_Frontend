import React, { useMemo, useState } from "react";
import {
  Filter,
  Briefcase,
  GraduationCap,
  Clock,
  MapPin,
  Building,
  IndianRupee,
  Laptop,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
} from "lucide-react";

/**
 * Expected filters shape (example):
 * {
 *   type: [], qualification: [], experience: [],
 *   location: [], company: [], industry: [],
 *   workMode: [], datePosted: [],
 *   salary: { min: 0, max: 50 } // LPA
 * }
 */

const SECTION_CLASSES =
  "rounded-xl border border-gray-200 bg-white shadow-sm p-4";

const chipBase =
  "px-3 py-1.5 text-xs rounded-full border transition cursor-pointer select-none";
const chipOn =
  "bg-yellow-50 border-yellow-400 text-yellow-700 font-medium shadow-sm";
const chipOff =
  "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50";

export default function FilterPanel({
  filters,
  setFilters,
  onApply,
  className = "",
}) {
  const [openMobile, setOpenMobile] = useState(false);

  const [openSection, setOpenSection] = useState("type");

  const [search, setSearch] = useState({
    location: "",
    company: "",
    industry: "",
  });

  const [salary, setSalary] = useState(filters?.salary || { min: 0, max: 50 });

  const OPTIONS = useMemo(
    () => ({
      type: ["Full Time", "Part Time", "Internship", "Freelance", "Fresher"],
      qualification: [
        "10th pass",
        "12th pass",
        "Diploma",
        "Graduate",
        "Post Graduate",
      ],
      experience: ["0-1 Years", "1-3 Years", "3-5 Years", "5+ Years"],
      location: [
        "Delhi",
        "Mumbai",
        "Bengaluru",
        "Hyderabad",
        "Chennai",
        "Pune",
        "Kolkata",
        "Ahmedabad",
        "Jaipur",
        "Remote",
      ],
      company: ["TCS", "Infosys", "Wipro", "Accenture", "HCL", "Tech Mahindra"],
      industry: [
        "IT Services",
        "Banking",
        "Education",
        "Healthcare",
        "Retail",
        "Manufacturing",
        "Telecom",
        "Startup",
      ],
      workMode: ["Remote", "Hybrid", "Onsite"],
      datePosted: ["Last 24 hours", "Last 7 days", "Last 30 days", "Anytime"],
    }),
    []
  );

  const sections = [
    { key: "type", title: "Job Type", icon: Briefcase },
    { key: "qualification", title: "Qualification", icon: GraduationCap },
    { key: "experience", title: "Experience", icon: Clock },
    {
      key: "location",
      title: "City / Location",
      icon: MapPin,
      searchable: true,
    },
    { key: "company", title: "Company", icon: Building, searchable: true },
    { key: "industry", title: "Industry", icon: Briefcase, searchable: true },
    { key: "workMode", title: "Work Mode", icon: Laptop },
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
      industry: [],
      workMode: [],
      datePosted: [],
      salary: { min: 0, max: 50 },
    });
    setSalary({ min: 0, max: 50 });
    setSearch({ location: "", company: "", industry: "" });
  };

  const setMin = (val) => {
    const v = Math.min(Number(val), salary.max);
    setSalary((s) => ({ ...s, min: v }));
    setFilters((p) => ({ ...p, salary: { ...p.salary, min: v } }));
  };
  const setMax = (val) => {
    const v = Math.max(Number(val), salary.min);
    setSalary((s) => ({ ...s, max: v }));
    setFilters((p) => ({ ...p, salary: { ...p.salary, max: v } }));
  };

  const applyNow = () => {
    onApply?.(filters);
    setOpenMobile(false);
  };

  const PanelBody = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-yellow-500" />
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        </div>
        <button
          onClick={clearAll}
          className="text-xs font-medium text-gray-600 hover:text-orange-600 flex items-center gap-1 transition-colors"
        >
          <X size={14} /> Clear All
        </button>
      </div>

      <div className={SECTION_CLASSES}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <IndianRupee size={16} className="text-orange-500" />
            Salary (LPA)
          </div>
          <button
            onClick={() => clearSection("salary")}
            className="text-xs text-gray-500 hover:text-orange-600"
          >
            Reset
          </button>
        </div>

        <div className="px-1 py-1">
          <div className="relative h-8">
            <input
              type="range"
              min={0}
              max={60}
              step={1}
              value={salary.min}
              onChange={(e) => setMin(e.target.value)}
              className="absolute w-full top-1/2 -translate-y-1/2 pointer-events-auto accent-yellow-400"
            />
            <input
              type="range"
              min={0}
              max={60}
              step={1}
              value={salary.max}
              onChange={(e) => setMax(e.target.value)}
              className="absolute w-full top-1/2 -translate-y-1/2 pointer-events-auto accent-orange-400"
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
            <span>₹{salary.min} LPA</span>
            <span>₹{salary.max} LPA</span>
          </div>
        </div>
      </div>

      {sections.map(({ key, title, icon: Icon, searchable }) => {
        const values = filters[key] || [];
        const count = values.length;
        const q = search[key] ?? "";
        const pool = OPTIONS[key] || [];
        const list = searchable
          ? pool.filter((p) => p.toLowerCase().includes(q.toLowerCase()))
          : pool;

        return (
          <div key={key} className={SECTION_CLASSES}>
            <button
              onClick={() => setOpenSection(openSection === key ? "" : key)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-orange-500" />
                <span className="text-sm font-semibold text-gray-900">
                  {title}
                </span>
                {count > 0 && (
                  <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    {count}
                  </span>
                )}
              </div>
              {openSection === key ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>

            {openSection === key && (
              <div className="mt-3 space-y-3">
                {searchable && (
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-2 top-2.5 text-gray-400"
                    />
                    <input
                      placeholder={`Search ${title}`}
                      value={q}
                      onChange={(e) =>
                        setSearch((s) => ({ ...s, [key]: e.target.value }))
                      }
                      className="w-full border rounded-md pl-7 pr-2 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {list.map((opt) => {
                    const active = values.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={`${chipBase} ${
                          active
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none"
                            : "bg-gray-100 text-gray-700 hover:bg-yellow-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={active}
                          onChange={() => toggleValue(key, opt)}
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>

                <div className="pt-1">
                  {count > 0 && (
                    <button
                      onClick={() => clearSection(key)}
                      className="text-xs text-gray-500 hover:text-orange-600"
                    >
                      Clear {title}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* footer actions */}
      <div className="flex gap-2">
        <button
          onClick={applyNow}
          className="flex-1 inline-flex items-center justify-center gap-2 
                   px-5 py-2.5 rounded-lg font-semibold text-sm 
                   bg-gradient-to-r from-yellow-400 to-orange-500 text-white 
                   hover:from-yellow-500 hover:to-orange-600 
                   transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <SlidersHorizontal size={16} />
          Apply Filters
        </button>

        <button
          onClick={clearAll}
          className="px-5 py-2.5 text-sm font-medium rounded-lg border border-orange-300 
                   text-orange-600 hover:bg-orange-50 transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden flex justify-end mb-3">
        <button
          onClick={() => setOpenMobile(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm"
        >
          <Filter size={16} /> Filters
        </button>
      </div>

      <aside
        className={`hidden md:block w-80 sticky top-24 max-h-[80vh] overflow-y-auto ${className}`}
      >
        {PanelBody}
      </aside>

      {openMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenMobile(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[86%] bg-white p-4 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold">Filters</h3>
              <button
                onClick={() => setOpenMobile(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            {PanelBody}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- OPTIONAL: Selected Filters Bar (place above results) ---------- */
export function SelectedFiltersBar({ filters, onRemove, onClearAll }) {
  const chips = [];

  const pushChips = (key, labelPrefix) => {
    (filters[key] || []).forEach((v) =>
      chips.push({
        key,
        value: v,
        label: `${labelPrefix ? labelPrefix + ": " : ""}${v}`,
      })
    );
  };

  pushChips("type", "Type");
  pushChips("qualification", "Edu");
  pushChips("experience", "Exp");
  pushChips("location", "Loc");
  pushChips("company", "Company");
  pushChips("industry", "Industry");
  pushChips("workMode", "Mode");
  pushChips("datePosted", "Posted");

  const hasSalary =
    filters.salary && (filters.salary.min > 0 || filters.salary.max < 50);

  if (hasSalary) {
    chips.push({
      key: "salary",
      value: "range",
      label: `₹{filters.salary.min}–₹{filters.salary.max} LPA`,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((c, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 bg-gray-100 border border-gray-200 text-gray-800 text-xs px-3 py-1.5 rounded-full"
        >
          {c.label}
          <button
            onClick={() => onRemove(c.key, c.value)}
            className="hover:text-red-600"
            aria-label={`Remove ${c.label}`}
          >
            <X size={14} />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-gray-600 underline ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
