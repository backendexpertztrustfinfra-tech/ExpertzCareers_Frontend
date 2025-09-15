import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  Users,
  Clock,
  FileText,
  Building,
} from "lucide-react";

const faqs = [
  {
    question: "How do I apply for a job?",
    answer:
      "Search for job listings and click on 'Apply'. Fill in your details and submit your application directly to employers.",
    icon: FileText,
  },
  {
    question: "Do I need a resume to apply?",
    answer:
      "Yes, a resume is recommended for most jobs, though some roles may allow applications with basic details only.",
    icon: Users,
  },
  {
    question: "Can I find part-time or freelance work?",
    answer:
      "Yes, our platform provides part-time, freelance, remote, and full-time opportunities across industries.",
    icon: Clock,
  },
  {
    question: "How soon will I get a response after applying?",
    answer:
      "It depends on the employer, but typically most applicants receive a response within 2–7 business days.",
    icon: Sparkles,
  },
  {
    question: "How can companies post jobs on the platform?",
    answer:
      "Employers can create an account, verify their details, and publish job postings using our employer dashboard.",
    icon: Building,
  },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-yellow-50/30 to-orange-50/50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-tr from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center items-center"
        >
          <div className="relative group w-full max-w-md sm:max-w-lg lg:max-w-xl">
            <img
              src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=800&q=80"
              alt="Team discussion"
              className="rounded-2xl shadow-2xl object-cover w-full h-64 sm:h-80 lg:h-[500px] group-hover:scale-105 transition-transform duration-700 border-4 border-white/50"
            />

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl border border-white/20"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  Live Support
                </span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl border border-white/20"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  24/7 Available
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="mb-10 sm:mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
              <Sparkles className="w-4 h-4 text-yellow-600" />
              <span className="text-xs sm:text-sm font-medium text-orange-800">
                Got Questions?
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Find answers to common questions about our platform and services.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => {
              const IconComponent = faq.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="group"
                >
                  <div className="rounded-xl sm:rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-yellow-200/60 transition-all duration-300 overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 text-left group-hover:bg-gradient-to-r group-hover:from-yellow-50/50 group-hover:to-orange-50/30 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                        </div>
                        <span className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-gray-900">
                          {faq.question}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: activeIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-yellow-600 transition-colors duration-300" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-6 pb-4 sm:pb-6 ml-12 sm:ml-14">
                            <motion.div
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="text-gray-600 leading-relaxed text-sm sm:text-base bg-gradient-to-r from-gray-50 to-yellow-50/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border-l-4 border-yellow-400"
                            >
                              {faq.answer}
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 sm:mt-12 p-5 sm:p-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl sm:rounded-2xl text-white"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-sm sm:text-base text-yellow-100 mb-4">
              Our support team is here to help you 24/7
            </p>
            <Link to="/contact">
            <button className="w-full sm:w-auto bg-white text-yellow-500 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-yellow-50 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Contact Support
            </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
