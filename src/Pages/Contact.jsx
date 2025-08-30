import React from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, } from "react-icons/fa";
import About from "../assets/image/about.jpeg";

const Contact = () => { 
    return (<>
        <div className="bg-white bg-cover bg-center pt-30" style={{ backgroundImage: url(`${about}`), height:300 , marginBottom:-100 }} ><h1 className="text-center text-white text-5xl">Contact Us</h1>
        </div>
      

<div className="flex flex-wrap justify-center gap-6 px-4 py-10 max-w-6xl mx-auto">
  {[
    {
      icon: <FaMapMarkerAlt size={30} />,
      title: "OUR MAIN OFFICE",
      text: "Badkal Metro Station, Faridabad, Haryana, India - 121002",
      link: "https://www.google.com/maps/place/Amartex+Family+Mart/@28.3874325,77.3137771,17z/data=!4m10!1m2!2m1!1sAmartax++Badkal+Mor!3m6!1s0x390cddbfa27e9ef1:0xd43433fb2129cd81!8m2!3d28.3874325!4d77.3182832!15sChJBbWFydGV4IEJhZGthbCBNb3IiA4gBAZIBDWdyb2Nlcnlfc3RvcmWqAVcKDS9nLzExYjgyNXcxangQASoLIgdhbWFydGV4KAAyHxABIhsgvejE5L1BhmNXXERuv7m2H8ZnihpLGHlUlYwyFhACIhJhbWFydGV4IGJhZGthbCBtb3LgAQA!16s%2Fg%2F11yx7qc_g?entry=ttu&g_ep=EgoyMDI1MDcxNS4xIKXMDSoASAFQAw%3D%3D",
    },
    {
      icon: <FaPhone size={30} />,
      title: "PHONE NUMBER",
      text: "+91-9811377155",
      link: "https://wa.me/919811377155", 
    },
    {
      icon: <FaEnvelope size={30} />,
      title: "EMAIL",
      text: "expertztrustfinfra@gmail.com",
      link: "https://mail.google.com/mail/u/0/?ogbl#inbox?compose=GTvVlcSHwQflVMswmmXksRNrdnRgqSpdPptbbQcnMRJpjpCpBrpgwwqdxRsNbXZfhgfJPnXPXQtMW",
    },
  ].map((card, idx) => (
    <a
      key={idx}
      href={card.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#FDF6F0] shadow-lg rounded-xl p-6 text-center w-[260px] border-t-4 border-transparent hover:border-[#A65F00] transition block"
    >
      <div className="text-[#A65F00] flex justify-center mb-3">{card.icon}</div>
      <h3 className="font-bold mb-1">{card.title}</h3>
      <p className="text-sm">{card.text}</p>
    </a>
  ))}
</div>


      {/* Contact Form and Info */}
<div className=" w-full text-black py-10 px-4 lg:px-20">
<div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between gap-10 bg-[#FDF8F0] p-10 rounded-3xl border-transparent hover:border-[#A65F00] transition" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", }}>
    
    {/* Contact Form */}
    <form className="flex-1 space-y-6">
      <div>
        <label htmlFor="email" className="block font-medium">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter a valid email address"
          className="w-full p-2 mt-1 border-b border-black  text-black outline-none"
        />
      </div>
      <div>
        <label htmlFor="name" className="block font-medium">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your Name"
          className="w-full p-2 mt-1 border-b border-black  text-black outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="block font-medium">Message</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          placeholder="Enter your message"
          className="w-full p-2 mt-1 border-b border-black  text-black outline-none"
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-yellow-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-yellow-700 transition"
      >
        SUBMIT
      </button>
    </form>

    {/* Info & Socials */}
    <div className="flex-1">
  <h2 className="text-3xl font-light mb-4">Get in touch</h2>
  <p className="italic font-semibold mb-4">
    We prioritize trust, career growth, and end-to-end support tailored to your professional journey.
  </p>
  <p className="text-sm mb-6">
    Whether you're a job seeker or recruiter, Expertz Career is your reliable partner in success.
    Let’s shape future careers together!
  </p>
</div>

  </div>
</div>

    </>
    );
};

export default Contact;