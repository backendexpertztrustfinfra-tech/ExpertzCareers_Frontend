// import React from "react";
// import {
//   FaMapMarkerAlt,
//   FaPhone,
//   FaEnvelope,
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedinIn,
// } from "react-icons/fa";
// import About from "../assets/Image/about.jpeg";

// const Contact = () => {
//   return (
//     <>
//       {/* Hero */}
//       <div
//         className="bg-white bg-cover bg-center flex items-center justify-center"
//         style={{
//           backgroundImage: `url(${About})`,
//           height: 300,
//           marginBottom: -100,
//         }}
//       >
//         <h1 className="text-center text-white text-4xl sm:text-5xl font-bold drop-shadow-lg">
//           Contact Us
//         </h1>
//       </div>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-10 max-w-6xl mx-auto">
//         {[
//           {
//             icon: <FaMapMarkerAlt size={28} />,
//             title: "OUR MAIN OFFICE",
//             text: "Badkal Metro Station, Faridabad, Haryana, India - 121002",
//             link: "https://www.google.com/maps",
//           },
//           {
//             icon: <FaPhone size={28} />,
//             title: "PHONE NUMBER",
//             text: "+91-9811377155",
//             link: "https://wa.me/919811377155",
//           },
//           {
//             icon: <FaEnvelope size={28} />,
//             title: "EMAIL",
//             text: "expertztrustfinfra@gmail.com",
//             link: "mailto:expertztrustfinfra@gmail.com",
//           },
//         ].map((card, idx) => (
//           <a
//             key={idx}
//             href={card.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="bg-[#FDF6F0] shadow-lg rounded-xl p-6 text-center border-t-4 border-transparent hover:border-[#A65F00] transition w-full"
//           >
//             <div className="text-[#A65F00] flex justify-center mb-3">
//               {card.icon}
//             </div>
//             <h3 className="font-bold text-base sm:text-lg mb-1">{card.title}</h3>
//             <p className="text-sm sm:text-base">{card.text}</p>
//           </a>
//         ))}
//       </div>

//       {/* Contact Form + Info */}
//       <div className="w-full text-black py-10 px-4 sm:px-6 lg:px-20">
//         <div
//           className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between gap-10 bg-[#FDF8F0] p-6 sm:p-10 rounded-3xl border-transparent hover:border-[#A65F00] transition"
//           style={{
//             boxShadow:
//               "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//           }}
//         >
//           {/* Contact Form */}
//           <form className="flex-1 space-y-6">
//             <div>
//               <label htmlFor="email" className="block font-medium text-sm sm:text-base">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 placeholder="Enter a valid email address"
//                 className="w-full p-2 mt-1 border-b border-black text-black outline-none text-sm sm:text-base"
//               />
//             </div>
//             <div>
//               <label htmlFor="name" className="block font-medium text-sm sm:text-base">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 placeholder="Enter your Name"
//                 className="w-full p-2 mt-1 border-b border-black text-black outline-none text-sm sm:text-base"
//               />
//             </div>
//             <div>
//               <label htmlFor="message" className="block font-medium text-sm sm:text-base">
//                 Message
//               </label>
//               <textarea
//                 id="message"
//                 name="message"
//                 rows="4"
//                 placeholder="Enter your message"
//                 className="w-full p-2 mt-1 border-b border-black text-black outline-none text-sm sm:text-base"
//               ></textarea>
//             </div>
//             <button
//               type="submit"
//               className="bg-yellow-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-yellow-700 transition w-full sm:w-auto"
//             >
//               SUBMIT
//             </button>
//           </form>

//           {/* Info & Socials */}
//           <div className="flex-1">
//             <h2 className="text-2xl sm:text-3xl font-light mb-4">
//               Get in touch
//             </h2>
//             <p className="italic font-semibold mb-4 text-sm sm:text-base">
//               We prioritize trust, career growth, and end-to-end support tailored to your professional journey.
//             </p>
//             <p className="text-sm sm:text-base mb-6">
//               Whether you're a job seeker or recruiter, Expertz Career is your reliable partner in success. Let’s shape future careers together!
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Contact;

import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import About from "../assets/Image/about.jpeg";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true); // Show thank you message
    e.target.reset();   // Clear form inputs

    // Hide message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactCards = [
    {
      icon: <FaMapMarkerAlt size={28} />,
      title: "OUR MAIN OFFICE",
      text: "Badkal Metro Station, Faridabad, Haryana, India - 121002",
      link: "https://www.google.com/maps",
    },
    {
      icon: <FaPhone size={28} />,
      title: "PHONE NUMBER",
      text: "+91-9811377155",
      link: "https://wa.me/919811377155",
    },
    {
  icon: <FaEnvelope size={28} />,
  title: "EMAIL",
  text: "expertztrustfinfra@gmail.com",
  link: "mailto:expertztrustfinfra@gmail.com?subject=Contact%20from%20Website&body=Hello%20Expertz%20Team,",
}
,
  ];

  return (
    <>
      {/* Hero */}
      <div
        className="bg-white bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${About})`,
          height: 300,
          marginBottom: -100,
        }}
      >
        <h1 className="text-center text-white text-4xl sm:text-5xl font-bold drop-shadow-lg">
          Contact Us
        </h1>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-10 max-w-6xl mx-auto">
       {contactCards.map((card, idx) => (
  <a
    key={idx}
    href={card.link}
    className="bg-[#FDF6F0] shadow-lg rounded-xl p-6 text-center border-t-4 border-transparent hover:border-[#A65F00] transition w-full"
    {...(card.link.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
  >
    <div className="text-[#A65F00] flex justify-center mb-3">
      {card.icon}
    </div>
    <h3 className="font-bold text-base sm:text-lg mb-1">{card.title}</h3>
    <p className="text-sm sm:text-base">{card.text}</p>
  </a>
))}
    
      </div>

      {/* Contact Form + Info */}
      <div className="w-full text-black py-10 px-4 sm:px-6 lg:px-20">
        <div
          className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between gap-10 bg-[#FDF8F0] p-6 sm:p-10 rounded-3xl border-transparent hover:border-[#A65F00] transition"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          }}
        >
          {/* Contact Form */}
          <form className="flex-1 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block font-medium text-sm sm:text-base">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter a valid email address"
                className="w-full p-2 mt-1 border-b border-black text-black outline-none text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="block font-medium text-sm sm:text-base">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your Name"
                className="w-full p-2 mt-1 border-b border-black text-black outline-none text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block font-medium text-sm sm:text-base">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Enter your message"
                className="w-full p-2 mt-1 border-b border-black text-black outline-none text-sm sm:text-base"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-yellow-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-yellow-700 transition w-full sm:w-auto"
            >
              SUBMIT
            </button>

            {/* Thank You Message */}
            {submitted && (
              <p className="mt-4 text-green-600 font-medium text-sm sm:text-base">
                Thank you for contacting us! We will get back to you shortly.
              </p>
            )}
          </form>

          {/* Info & Socials */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-light mb-4">
              Get in touch
            </h2>
            <p className="italic font-semibold mb-4 text-sm sm:text-base">
              We prioritize trust, career growth, and end-to-end support tailored to your professional journey.
            </p>
            <p className="text-sm sm:text-base mb-6">
              Whether you're a job seeker or recruiter, Expertz Career is your reliable partner in success. Let’s shape future careers together!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
