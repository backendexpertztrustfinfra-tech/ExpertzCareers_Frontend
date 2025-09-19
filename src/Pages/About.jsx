"use client";

import { useState, useEffect } from "react";

// Simple Button component. I've added a 'glass' variant to make it more reusable.
const Button = ({
  children,
  size = "default",
  variant = "default",
  className = "",
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-semibold cursor-pointer border-0 no-underline transition-all duration-300 hover:scale-105";
  // The padding and font size for the large button are now defined here for consistency.
  const sizeClasses = size === "lg" ? "text-lg px-8 py-4" : "text-sm px-6 py-3";
  const variantClasses = {
    default: "bg-yellow-500 text-white hover:bg-yellow-600",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline:
      "bg-transparent text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-50",
    // Added the glass variant to the component, so you don't need to define it inline.
    glass:
      "bg-white/40 backdrop-blur-lg text-gray-800 hover:text-white border-2 border-white/60 transition-colors",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Card components
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-lg border border-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// Simple Badge component
const Badge = ({ children, variant = "default", className = "" }) => {
  const variantClasses = {
    default: "bg-yellow-500 text-white",
    outline: "bg-transparent text-yellow-500 border border-yellow-500",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full text-xs font-semibold px-3 py-1 transition-all duration-300 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// Simple Icons
const Icon = ({ name, size = 24, className = "" }) => {
  const icons = {
    target: "🎯",
    users: "👥",
    lightbulb: "💡",
    heart: "❤️",
    zap: "⚡",
    arrowRight: "→",
    checkCircle: "✓",
    star: "⭐",
    trendingUp: "📈",
    globe: "�",
    shield: "🛡️",
    briefcase: "💼",
    rocket: "🚀",
    brain: "🧠",
    network: "🔗",
    trophy: "🏆",
    clock: "🕐",
    mapPin: "📍",
    phone: "📞",
    mail: "📧",
  };

  return (
    <span
      className={`inline-block ${className}`}
      style={{ fontSize: `${size}px` }}
    >
      {icons[name] || "•"}
    </span>
  );
};

// Main AboutPage component
const AboutPage = () => {
  const [activeTimelineItem, setActiveTimelineItem] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    careers: 0,
    companies: 0,
    success: 0,
  });

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTimelineItem((prev) => (prev + 1) % 4);
    }, 3000);

    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let step = 0;
      const counterInterval = setInterval(() => {
        step++;
        const progress = step / steps;

        setCounters({
          careers: Math.floor(50000 * progress),
          companies: Math.floor(2500 * progress),
          success: Math.floor(95 * progress),
        });

        if (step >= steps) {
          clearInterval(counterInterval);
          setCounters({ careers: 50000, companies: 2500, success: 95 });
        }
      }, stepDuration);
    };

    setTimeout(animateCounters, 500);
    return () => clearInterval(interval);
  }, []);

  const values = [
    {
      icon: <Icon name="brain" size={32} />,
      title: "AI-Powered Intelligence",
      description:
        "Advanced machine learning algorithms that understand your career DNA and match you with perfect opportunities",
      gradient: "from-purple-500 to-yellow-500",
      bgGradient: "from-purple-50 to-yellow-50",
    },
    {
      icon: <Icon name="network" size={32} />,
      title: "Global Network",
      description:
        "Connect with industry leaders, mentors, and peers across 50+ countries and 200+ industries",
      gradient: "from-orange-500 to-teal-500",
      bgGradient: "from-orange-50 to-teal-50",
    },
    {
      icon: <Icon name="rocket" size={32} />,
      title: "Career Acceleration",
      description:
        "Fast-track your professional growth with personalized learning paths and skill development programs",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      icon: <Icon name="shield" size={32} />,
      title: "Trust & Security",
      description:
        "Bank-level security protecting your data with verified companies and transparent hiring processes",
      gradient: "from-yellow-500 to-cyan-500",
      bgGradient: "from-yellow-50 to-cyan-50",
    },
  ];

  const timeline = [
    {
      year: "2020",
      title: "Revolutionary Beginning",
      description:
        "Founded with $2M seed funding to disrupt traditional recruitment with AI-first approach",
      icon: <Icon name="star" size={24} />,
      achievement: "Launched MVP with 100 beta users",
    },
    {
      year: "2021",
      title: "Exponential Growth",
      description:
        "Achieved 500% user growth, partnered with Fortune 500 companies, and expanded to 15 countries",
      icon: <Icon name="trendingUp" size={24} />,
      achievement: "10,000+ successful placements",
    },
    {
      year: "2022",
      title: "AI Innovation Leader",
      description:
        "Launched proprietary CareerDNA™ technology and won 'Best HR Tech Innovation' award",
      icon: <Icon name="zap" size={24} />,
      achievement: "95% match accuracy achieved",
    },
    {
      year: "2023",
      title: "Global Expansion",
      description:
        "Opened offices in 5 continents, launched mobile app with 1M+ downloads, IPO preparation",
      icon: <Icon name="globe" size={24} />,
      achievement: "50+ countries served",
    },
  ];

  const stats = [
    {
      number: `${counters.careers.toLocaleString()}+`,
      label: "Dream Careers Launched",
      icon: <Icon name="briefcase" size={24} />,
      description: "Professionals found their perfect match",
    },
    {
      number: `${counters.companies.toLocaleString()}+`,
      label: "Trusted Partners",
      icon: <Icon name="shield" size={24} />,
      description: "From startups to Fortune 500",
    },
    {
      number: `${counters.success}%`,
      label: "Success Rate",
      icon: <Icon name="trophy" size={24} />,
      description: "Industry-leading placement success",
    },
    {
      number: "24/7",
      label: "Expert Support",
      icon: <Icon name="heart" size={24} />,
      description: "Always here when you need us",
    },
  ];

  const teamHighlights = [
    {
      title: "200+ Career Experts",
      description: "Former executives from Google, Microsoft, Amazon",
      icon: <Icon name="users" size={24} />,
    },
    {
      title: "AI Research Team",
      description: "PhD researchers from MIT, Stanford, Oxford",
      icon: <Icon name="brain" size={24} />,
    },
    {
      title: "Global Presence",
      description: "Offices in Silicon Valley, London, Singapore, Dubai",
      icon: <Icon name="mapPin" size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Combined CSS Animations into a single block */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
          }
        }
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        .fade-in-up {
          opacity: ${isVisible ? 1 : 0};
          transform: translateY(${isVisible ? "0" : "30px"});
          transition: all 1s ease-out;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradientShift 12s ease infinite;
        }
      `}</style>

      {/* Hero Section - Added responsive classes for better mobile display */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-16 md:py-32 px-4 md:px-6 text-center">
        {/* Floating elements */}
        <div className="absolute top-10 left-4 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-full blur-sm float-animation"></div>
        <div
          className="absolute top-20 right-4 w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-orange-400/25 to-amber-400/25 rounded-full blur-sm float-animation"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="fade-in-up">
            {/* Adjusted badge sizing and padding for better responsiveness */}
            <Badge className="mb-6 md:mb-12 text-sm sm:text-lg px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-600 border border-yellow-200">
              Transforming 50,000+ Careers Since 2020
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-10 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 bg-clip-text text-transparent leading-snug md:leading-tight">
              About Expertz Career
            </h1>

            <p className="text-base md:text-2xl lg:text-3xl text-slate-600 mb-8 md:mb-16 max-w-5xl mx-auto leading-relaxed font-medium">
              Where{" "}
              <span className="text-yellow-500 font-bold">
                ambition meets AI
              </span>
              , and
              <span className="text-orange-500 font-bold">
                {" "}
                dreams become careers
              </span>
              . We're not just another job portal – we're your intelligent
              career transformation partner.
            </p>

            {/* CTA buttons are now more responsive on small screens */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Button
                size="lg"
                className="text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white pulse-glow"
                aria-label="Start Your Journey"
              >
                Start Your Journey <Icon name="arrowRight" size={24} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 bg-transparent"
                aria-label="Watch Our Story"
              >
                Watch Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-br from-slate-50/50 to-slate-100/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-slate-800">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-lg md:text-xl text-slate-600">
              Real numbers, real impact, real careers transformed
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center bg-white/80 backdrop-blur-sm border-0"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.5s ease ${index * 0.2}s`,
                }}
              >
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl mb-6 text-yellow-500">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl lg:text-5xl font-black text-yellow-500 mb-3">
                    {stat.number}
                  </div>
                  <div className="text-lg font-bold text-slate-800 mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-slate-600">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Highlights Section */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-br from-yellow-50/50 to-orange-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-800">
              World-Class Team
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Industry veterans and AI pioneers working together to
              revolutionize your career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamHighlights.map((highlight, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-0"
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl mb-6">
                    {highlight.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">
                    {highlight.title}
                  </h3>
                  <p className="text-slate-600">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Timeline - Refactored for better mobile responsiveness */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-slate-800">
              Our Journey to Excellence
            </h2>
            <p className="text-lg md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              From a bold vision to a career revolution – discover the
              milestones that shaped the future of recruitment
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line: Adjusted to be on the left on small screens and centered on medium screens */}
            <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-1 md:w-2 h-full bg-gradient-to-b from-yellow-500 via-orange-500 to-amber-500 rounded-full"></div>

            {timeline.map((item, index) => (
              <div
                key={index}
                // Changed from flex-row to a responsive flex-col and md:flex-row
                className={`relative mb-20 flex flex-col items-start gap-8 md:gap-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Card: The layout and alignment are now responsive */}
                <div
                  className={`w-full md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                  }`}
                >
                  <Card
                    className={`${
                      activeTimelineItem === index
                        ? "bg-white border-4 border-yellow-300 scale-105 shadow-2xl"
                        : "bg-white/80 border-0"
                    } transition-all duration-500`}
                  >
                    <CardContent className="p-8 sm:p-10">
                      <div
                        className={`flex items-center gap-4 mb-4 md:mb-6 ${
                          index % 2 === 0 ? "justify-start md:justify-end" : "justify-start"
                        }`}
                      >
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg">
                          {item.icon}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-lg px-4 py-2 font-bold border-2 border-yellow-500"
                        >
                          {item.year}
                        </Badge>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black mb-4 text-slate-800">
                        {item.title}
                      </h3>
                      <p className="text-md md:text-lg text-slate-600 leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
                        <Icon
                          name="checkCircle"
                          size={16}
                          className="text-yellow-500"
                        />
                        <span className="text-sm font-semibold text-yellow-600">
                          {item.achievement}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline Dot: Positioned on the left for mobile and centered for desktop */}
                <div
                  className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full border-4 border-white shadow-lg ${
                    activeTimelineItem === index
                      ? "bg-gradient-to-br from-yellow-500 to-orange-500 scale-125"
                      : "bg-slate-300 scale-100"
                  } transition-all duration-300`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-br from-slate-100/20 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-8 text-slate-800">
              What Makes Us Different
            </h2>
            <p className="text-lg md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              The revolutionary principles that power every connection, every
              match, and every career transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-white/60 backdrop-blur-sm border-0 overflow-hidden relative group hover:bg-white"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>
                <CardContent className="p-8 sm:p-10 text-center relative z-10">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${value.gradient} text-white rounded-3xl mb-8 shadow-xl transition-all duration-500 group-hover:scale-110`}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black mb-6 text-slate-800 transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-md md:text-lg text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Adjusted for better spacing on mobile */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-yellow-100/50 via-yellow-50/50 to-orange-100/50 border border-yellow-200 shadow-2xl">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="p-3 md:p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl text-white shadow-lg">
                    <Icon name="target" size={32} md:size={40} />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-800">
                    Our Mission
                  </h2>
                </div>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-6 md:mb-8">
                  To revolutionize career development by creating meaningful
                  connections between talent and opportunity, fostering growth,
                  and building a future where every professional can achieve
                  their full potential through intelligent technology.
                </p>
                <div className="space-y-4">
                  {[
                    "Connect talent with perfect-fit opportunities using AI",
                    "Provide comprehensive career development tools",
                    "Foster long-term professional relationships globally",
                    "Enable data-driven career decisions with insights",
                    "Create inclusive opportunities for all backgrounds",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                        <Icon
                          name="checkCircle"
                          size={20}
                          className="text-yellow-500"
                        />
                      </div>
                      <span className="text-sm md:text-lg text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 md:p-12 bg-gradient-to-br from-orange-100/50 via-orange-50/50 to-amber-100/50 border border-orange-200 shadow-2xl">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="p-3 md:p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl text-white shadow-lg">
                    <Icon name="lightbulb" size={32} md:size={40} />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-800">
                    Our Vision
                  </h2>
                </div>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-6 md:mb-8">
                  To become the world's most trusted career ecosystem, where
                  innovation meets opportunity, and every professional journey
                  is supported by intelligent technology, human expertise, and a
                  global community.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: "Global Impact",
                      desc: "Transforming careers in 100+ countries",
                      icon: <Icon name="globe" size={20} />,
                    },
                    {
                      title: "AI-Powered",
                      desc: "Next-gen matching with 99% accuracy",
                      icon: <Icon name="brain" size={20} />,
                    },
                    {
                      title: "Community Driven",
                      desc: "1M+ professionals supporting each other",
                      icon: <Icon name="users" size={20} />,
                    },
                    {
                      title: "Future Ready",
                      desc: "Preparing for jobs that don't exist yet",
                      icon: <Icon name="rocket" size={20} />,
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center text-orange-600">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-slate-800">
                          {item.title}
                        </div>
                        <div className="text-slate-600">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - The buttons now use the custom `Button` component correctly */}
      <section className="py-24 md:py-28 px-4 md:px-6 relative overflow-hidden bg-gradient-to-br from-pink-100 via-orange-100 to-blue-100 animate-gradient">
        {/* Floating abstract blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-200/50 blur-3xl rounded-full animate-[float_8s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-orange-200/40 blur-3xl rounded-full animate-[float_10s_ease-in-out_infinite]"></div>

        {/* Subtle particles */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></span>
          ))}
        </div>

        {/* Content */}
        <div className="relative max-w-5xl mx-auto text-center text-gray-800">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-500">
              Transform
            </span>{" "}
            Your Career?
          </h2>
          <div className="w-32 h-1 mx-auto mb-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full shadow-md"></div>

          <p className="text-lg md:text-2xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join over{" "}
            <span className="font-bold text-orange-600">
              50,000 professionals
            </span>{" "}
            who trust
            <span className="font-semibold text-pink-600">
              {" "}
              Expertz Career
            </span>{" "}
            to unlock their dream jobs. Your breakthrough opportunity is just
            one click away ✨
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <Button
              size="lg"
              className="text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 shadow-xl hover:shadow-2xl hover:scale-105 hover:brightness-110 bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-500 transition-all rounded-2xl"
              aria-label="Find Your Dream Job"
            >
              Find Your Dream Job
              <Icon name="arrowRight" size={24} className="ml-2" />
            </Button>

            <Button
              size="lg"
              variant="glass" 
              className="text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 shadow-md hover:shadow-xl hover:scale-105 transition-all rounded-2xl"
              aria-label="Partner With Us"
            >
              Partner With Us
              <Icon name="network" size={24} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
