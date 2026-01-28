// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { GrRestaurant } from "react-icons/gr";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const err = {};

    if (!form.email.trim()) {
      err.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    ) {
      err.email = "Invalid email address";
    }

    if (!form.password.trim()) {
      err.password = "Password is required";
    } else if (form.password.trim().length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoggingIn(true);

    // Simulate a small delay (like real API call) → looks more professional
    setTimeout(() => {
      // This is what your RequireAuth checks
      localStorage.setItem("token", "mock-token-xyz123");

      // Optional: you can store more user info later
      // localStorage.setItem("user", JSON.stringify({ name: "Demo Vendor", role: "vendor" }));

      // Redirect to dashboard (replace: true prevents going back to login with browser back button)
      navigate("/dashboard", { replace: true });

      // Note: no need to setIsLoggingIn(false) → we are leaving the page
    }, 1000); // 1 second delay – change to 300 or remove in production
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT IMAGE - visible on medium+ screens */}
      <div className="hidden md:flex w-1/2 relative hover:">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt="Delicious food background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-14 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Restaurant <span className="text-[#FF5252]">Partner</span> Panel
          </h1>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-lg">
            Manage orders, update menu, create offers and track earnings — all in one place.
          </p>
        </div>
      </div>
      


      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#fff5f5] to-[#ffecec] px-5 sm:px-6 py-8 md:py-0 relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2  p-6 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
    <GrRestaurant className="text-[#FF5252]" size={60} />
  </div>

        <form
          onSubmit={handleLogin}
          className="w-full max-w-md backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl px-8 sm:px-10 py-10 sm:py-12"
        >
          {/* TITLE */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FF5252] mb-2">
              Vendor Login
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Sign in to manage your restaurant
            </p>
          </div>

          {/* EMAIL FIELD */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Email className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF5252]" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vendor@example.com"
                autoComplete="email"
                className={`w-full pl-12 pr-4 py-3.5 border ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF5252]/50 outline-none transition`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD FIELD */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF5252]" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full pl-12 pr-12 py-3.5 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF5252]/50 outline-none transition`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF5252] transition"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full bg-[#FF5252] text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 ${
              isLoggingIn
                ? "opacity-70 cursor-wait"
                : "hover:bg-[#e03e3e] hover:shadow-xl active:scale-[0.98]"
            }`}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>

          {/* LINK TO REGISTER */}
          <div className="text-center mt-8 text-gray-600 text-sm">
            Don’t have an account?{" "}
            <span
              className="text-[#FF5252] font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;