import { useState, useContext } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";

// import img1 from "../../assets/bgImage.png";
import img from "../../assets/bgImage1.png";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export default function Register() {
  const { fetchMe } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Send token to backend
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        idToken,
      });

      console.log("Google Register response:", res.data);
      // Save token to localStorage or context
      navigate("/me");
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("Google Register error:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      await fetchMe();
      navigate("/me");
    } catch (err) {
      setError(err.response?.data?.message || "Error registering");
    }
  };

  // 📌 Google register/login
//   const handleGoogleRegister = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);

//       const idToken = await result.user.getIdToken();

//       // Backend call
//       const res = await axios.post("/auth/google", { idToken });
//       localStorage.setItem("token", res.data.token);
//       await fetchMe();
//       navigate("/me");
//     } catch (err) {
//       console.error("Google register error:", err);
//       setError("Google sign-in failed");
//     }
//   };



  return (
    <div className="h-screen w-screen flex">
      {/* Left Side - Image */}
      <div className="w-1/2 h-full">
        <img
          src={img}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="min-h-screen w-1/2 h-full flex items-center justify-center bg-[#2C363F]"
      >

        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-[#5EDFEA] text-center mb-6">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              name="username"
              type="text"
              placeholder="Username"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition duration-200"
            >
              Sign Up
            </button>
            <button type="button"
            onClick={handleGoogleRegister}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition duration-200 mt-4"
            >
                Sign up with Google
            </button>

          </form>

          <p className="text-gray-400 text-sm text-center mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-yellow-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
