"use client";

import { motion } from "framer-motion";

const CompaniesMarquee = () => {
  const companies = [
    "TCS",
    "Wipro",
    "Infosys",
    "HCLTech",
    "Tech Mahindra",
    "LTI Mindtree",
    "Mphasis",
    "Persistent Systems",
    "Tata Elxsi",
    "L&T Technology Services",
    "Capgemini India",
    "Cognizant India",
    "Accenture India",
    "IBM India",
    "Google India",
    "Microsoft India",
    "Amazon India",
    "Flipkart",
    "PhonePe",
    "Paytm",
    "Razorpay",
    "CRED",
    "Zerodha",
    "Groww",
    "Upstox",
    "ICICI Bank",
    "HDFC Bank",
    "State Bank of India",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Airtel",
    "Jio",
    "Vodafone Idea",
    "Adani Group",
    "Reliance Industries",
    "Tata Motors",
    "Mahindra & Mahindra",
    "Maruti Suzuki",
    "Hyundai India",
    "Ola",
    "Uber India",
    "Swiggy",
    "Zomato",
    "Nykaa",
    "Meesho",
    "Udaan",
    "BYJU'S",
    "Unacademy",
    "Vedantu",
    "Freshworks",
    "Zoho",
    "MakeMyTrip",
    "Yatra",
    "OYO",
    "Dream11",
    "NPCI",
    "PayU India",
    "Tally Solutions",
    "Delhivery",
    "Blue Dart",
    "PhonePe Switch",
    "Cognizant Softvision",
    "Hexaware",
    "Mindtree",
    "Birlasoft",
    "Sonata Software",
    "Infosys BPM",
    "EXL Service",
    "Genpact",
    "EY India",
    "KPMG India",
    "PwC India",
    "Siemens India",
    "Bosch India",
    "Philips India",
    "Deloitte India",
    "Havells",
    "Godrej",
    "Aditya Birla Group",
    "ITC",
    "Asian Paints",
    "Hindustan Unilever",
    "Marico",
    "Pidilite Industries",
    "Bajaj Finserv",
    "Bajaj Auto",
    "TVS Motor",
  ];

  const duplicated = [...companies, ...companies];

  return (
    <section
      aria-label="Top Indian companies hiring"
      className="w-full overflow-hidden py-4 sm:py-5"
    >
      <motion.div
        className="flex items-center gap-8 sm:gap-16"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          x: { duration: 45, ease: "linear", repeat: Number.POSITIVE_INFINITY },
        }}
      >
        {duplicated.map((name, idx) => (
          <motion.div
            key={`${name}-${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.02, duration: 0.35 }}
            className="flex-shrink-0"
          >
            <span
              className="inline-flex items-center rounded-full border border-gray-200/60 dark:border-white/10
                         bg-[#caa057] dark:bg-white/5 px-4 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-400
                         hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
            >
              {name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CompaniesMarquee;
