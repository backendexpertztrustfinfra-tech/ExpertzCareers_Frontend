export const navItems = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Jobs",
    path: "/jobs",
    megaMenu: [
      {
        title: "By Category",
        links: [
          { name: "IT Jobs", path: "/jobs?category=it" },
          { name: "Sales Jobs", path: "/jobs?category=sales" },
          { name: "Marketing Jobs", path: "/jobs?category=marketing" },
          { name: "Engineering Jobs", path: "/jobs?category=engineering" },
        ],
      },
      {
        title: "By Location",
        links: [
          { name: "Delhi", path: "/jobs?location=delhi" },
          { name: "Bangalore", path: "/jobs?location=bangalore" },
          { name: "Mumbai", path: "/jobs?location=mumbai" },
          { name: "Hyderabad", path: "/jobs?location=hyderabad" },
        ],
      },
      {
        title: "Special Jobs",
        links: [
          { name: "Remote Jobs", path: "/jobs?type=remote" },
          { name: "Work From Home", path: "/jobs?type=wfh" },
          { name: "Fresher Jobs", path: "/jobs?level=fresher" },
        ],
      },
    ],
  },
  {
    label: "Companies",
    path: "/companies",
    megaMenu: [
      {
        title: "Explore",
        links: [
          { name: "Top Companies", path: "/companies/top" },
          { name: "MNCs", path: "/companies/mnc" },
          { name: "Startups", path: "/companies/startups" },
        ],
      },
      {
        title: "Research",
        links: [
          { name: "Salaries", path: "/companies/salaries" },
          { name: "Reviews", path: "/companies/reviews" },
          { name: "Interview Q&A", path: "/companies/interviews" },
        ],
      },
    ],
  },
  {
    label: "Services",
    path: "/services",
    megaMenu: [
      {
        title: "Career Tools",
        links: [
          { name: "Resume Builder", path: "/services/resume-builder" },
          { name: "Resume Critique", path: "/services/resume-critique" },
        ],
      },
      {
        title: "Premium",
        links: [
          { name: "Resume Display", path: "/services/resume-display" },
          { name: "Subscription Plans", path: "/services/plans" },
        ],
      },
    ],
  },
]
