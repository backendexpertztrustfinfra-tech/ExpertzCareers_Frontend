import React, { useState } from 'react';

const SignupModal = ({ close, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const signupHandler = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newUser = {
        name,
        email,
        password,
        profilePic: 'https://i.imgur.com/your-image.jpg'
      };

      localStorage.setItem('expertzUser', JSON.stringify(newUser));
      onSignup(newUser);
      setLoading(false);
      close();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[300px] relative">
        <h2 className="text-lg font-bold mb-4">Sign Up</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#caa057] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Creating account...</p>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-2 p-2 border"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              onClick={signupHandler}
              className="w-full bg-[#caa057] text-white p-2 rounded hover:bg-[#b4924c] transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={close}
              className="mt-2 w-full text-gray-500 text-sm"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupModal;