import { useState } from "react";
// import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../fireBase/firebase";

import img from "../../assets/bgImage1.png";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/me");
    } catch (err) {
      console.log("error in Login :", err);
    }
  };

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = result._tokenResponse.idToken; // Google ID token

    // Send token to backend
    const res = await axios.post("http://localhost:5000/api/auth/google", { idToken: credential });

    console.log(result.user)
    localStorage.setItem("token", res.data.token);
    navigate("/me");
  } catch (error) {
    console.error("Google login error:", error);
  }
};


  return (
    <div className="h-screen w-screen flex">
      {/* Left Side - Form */}
      <div className="w-1/2 h-full flex items-center justify-center bg-[#2C363F] border-r-2 border-gray-400">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl shadow-xl p-8 border-gray-400">
          <h1 className="text-2xl font-bold text-[#5EDFEA] text-center mb-6" >
            Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition duration-200"
            >
              Login
            </button>
            <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition duration-200 mt-4"
            >
                Sign in with Google
            </button>

          </form>
          <p className="text-gray-400 text-sm text-center mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-yellow-400 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/2 h-full">
        <img
          src={img}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
