"use client"

import { useState } from "react"
import {
  Brain,
  Video,
  TrendingUp,
  Users,
  Zap,
  Target,
  Globe,
  Shield,
  Rocket,
  Star,
  BookOpen,
  MessageSquare,
  BarChart3,
  Briefcase,
  ChevronRight,
  Play,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredService, setHoveredService] = useState(null)

  const categories = [
    { id: "all", name: "All Services", icon: <Globe className="w-4 h-4" /> },
    { id: "ai", name: "AI-Powered", icon: <Brain className="w-4 h-4" /> },
    { id: "career", name: "Career Growth", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "networking", name: "Networking", icon: <Users className="w-4 h-4" /> },
    { id: "premium", name: "Premium", icon: <Star className="w-4 h-4" /> },
  ]

  const services = [
    {
      id: 1,
      title: "AI Career Path Visualizer",
      category: "ai",
      icon: <Brain className="w-8 h-8" />,
      description:
        "Interactive 3D visualization of your career journey with AI-powered predictions and personalized roadmaps.",
      features: ["3D Career Mapping", "AI Predictions", "Skill Gap Analysis", "Growth Timeline"],
      price: "Free",
      badge: "Revolutionary",
      color: "from-yellow-400 to-orange-500",
      popularity: 98,
    },
    {
      id: 2,
      title: "Video Resume Studio",
      category: "career",
      icon: <Video className="w-8 h-8" />,
      description:
        "Professional video resume creation with AI-powered editing, templates, and industry-specific guidance.",
      features: ["AI Video Editing", "Industry Templates", "Voice Coaching", "Background Removal"],
      price: "₹299/month",
      badge: "Trending",
      color: "from-yellow-400 to-orange-500",
      popularity: 94,
    },
    {
      id: 3,
      title: "Real-Time Salary Negotiator",
      category: "ai",
      icon: <TrendingUp className="w-8 h-8" />,
      description: "AI-powered salary negotiation assistant with live market data and personalized strategies.",
      features: ["Live Market Data", "Negotiation Scripts", "Success Tracking", "Industry Benchmarks"],
      price: "₹199/month",
      badge: "Exclusive",
      color: "from-yellow-400 to-orange-500",
      popularity: 91,
    },
    {
      id: 4,
      title: "Virtual Networking Events",
      category: "networking",
      icon: <Users className="w-8 h-8" />,
      description: "Immersive virtual networking with industry leaders, featuring AI matchmaking and real-time chat.",
      features: ["AI Matchmaking", "Virtual Rooms", "Industry Leaders", "Live Chat"],
      price: "₹99/event",
      badge: "Live",
      color: "from-yellow-400 to-orange-500",
      popularity: 89,
    },
  ]

  const filteredServices =
    activeCategory === "all" ? services : services.filter((service) => service.category === activeCategory)

  const stats = [
    { label: "Success Rate", value: "94%", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Active Users", value: "2.5M+", icon: <Users className="w-5 h-5" /> },
    { label: "Job Placements", value: "150K+", icon: <Briefcase className="w-5 h-5" /> },
    { label: "Avg Salary Increase", value: "40%", icon: <TrendingUp className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 animate-gradient-x"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Zap className="w-4 h-4" />
              Revolutionary Career Services
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
              Power Up Your Career with
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {" "}Expertz Services
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              We provide end-to-end career solutions – from resume building to skill development, interview prep, and job search assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                Start Your Journey
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-orange-200 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-orange-50 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm border border-orange-100 rounded-2xl p-4 sm:p-6 text-center hover:bg-white transition-all duration-300"
              >
                <div className="flex justify-center mb-2 sm:mb-3 text-orange-500">{stat.icon}</div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-200"
                  : "bg-white text-gray-700 hover:bg-orange-50 border border-orange-100"
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white border border-orange-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              {/* Badge */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <span
                  className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-gradient-to-r ${service.color} text-white`}
                >
                  {service.badge}
                </span>
              </div>

              {/* Icon */}
              <div
                className={`inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.color} text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Popularity Bar */}
              <div className="mb-4 sm:mb-6">
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <span className="text-[10px] sm:text-xs text-gray-500">Popularity</span>
                  <span className="text-[10px] sm:text-xs font-semibold text-orange-600">{service.popularity}%</span>
                </div>
                <div className="w-full bg-orange-50 rounded-full h-1.5 sm:h-2">
                  <div
                    className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${service.color} transition-all duration-1000`}
                    style={{ width: hoveredService === service.id ? `${service.popularity}%` : "0%" }}
                  ></div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between">
                <span className="text-lg sm:text-2xl font-bold text-gray-900">{service.price}</span>
                <button
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r ${service.color} text-white text-xs sm:text-sm font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg group/btn`}
                >
                  Get Started
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 py-16 sm:py-20">
        <div className="max-w-3xl sm:max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
            Join millions of professionals who've accelerated their careers with our revolutionary platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center group">
              Start Free Trial
            </button>
            <button className="border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:bg-white/10 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services