import React, { useState } from "react";

const LoginCard = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const user = { email };
    localStorage.setItem("expertzUser", JSON.stringify(user));
    onLogin(user);
  };

  return (
    <div className="absolute top-20 right-4 bg-white border border-gray-300 shadow-lg p-6 rounded-xl w-80 z-50">
      <h2 className="text-xl font-semibold mb-4">Login / Signup</h2>
      <input
        type="email"
        placeholder="Enter Email"
        className="w-full mb-3 p-2 border rounded-md"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        className="w-full mb-3 p-2 border rounded-md"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-[#caa057] text-white py-2 rounded-md hover:bg-[#b4924c]"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default LoginCard;