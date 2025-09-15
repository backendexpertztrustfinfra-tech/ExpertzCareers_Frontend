import React, { useState } from "react";

const LoginModal = ({ close, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = () => {
    const user = JSON.parse(localStorage.getItem("expertzUser"));
    if (user && user.email === email && user.password === password) {
      onLogin(user);
      close();
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[300px]">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full mb-2 p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={loginHandler}
          className="w-full bg-[#b88b16] text-white p-2 rounded"
        >
          Login
        </button>
        <button onClick={close} className="mt-2 w-full text-gray-500 text-sm">
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginModal;