// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axiosInstance from "../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
    } else if (form.password.trim().length < 5) {
      err.password = "Password must be at least 5 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoggingIn(true);
    setErrors({});

    try {
      const response = await axiosInstance.post("/restaurants/login", {
        identifier: form.email.trim(),
        password: form.password.trim(),
      });

      console.log("Login Response:", response.data);

      if (response.data.token && response.data.vendor) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("vendor", JSON.stringify(response.data.vendor));

        // Beautiful success toast
        toast.success(response.data.message || "Login successful!", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "rgba(255, 255, 255, 0.98)",
            color: "#1f2937",
            border: "1px solid #FF5252",
            borderRadius: "16px",
            padding: "16px 24px",
            boxShadow: "0 10px 25px -5px rgba(255, 82, 82, 0.2)",
            fontWeight: "500",
            fontSize: "1.05rem",
          },
          iconTheme: {
            primary: "#FF5252",
            secondary: "#fff",
          },
        });

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1200);
      } else {
        toast.error("Login failed. Invalid response from server.", {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            borderRadius: "16px",
            padding: "16px 24px",
            boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.2)",
          },
        });
      }
    } catch (error) {
      console.error("Login Error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.response?.data?.errors) {
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          const errorValue = error.response.data.errors[key];
          backendErrors[key] = Array.isArray(errorValue)
            ? errorValue[0]
            : errorValue;
          // Show field-specific errors as toasts too (optional)
          toast.error(backendErrors[key], {
            duration: 4500,
            position: "top-center",
          });
        });
        setErrors(backendErrors);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Main error toast
      toast.error(errorMessage, {
        duration: 5500,
        position: "top-center",
        style: {
          background: "#fef2f2",
          color: "#991b1b",
          border: "1px solid #fecaca",
          borderRadius: "16px",
          padding: "16px 24px",
          boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.2)",
          maxWidth: "380px",
        },
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex font-['Poppins']">
      {/* ← Add Toaster here (can be placed in App.jsx too) */}
      <Toaster />

      {/* LEFT IMAGE - visible on medium+ screens */}
      <div className="hidden md:flex w-1/2 relative">
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
            Manage orders, update menu, create offers and track earnings — all
            in one place.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full bg-black z-50 md:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#fff5f5] to-[#ffecec] px-5 sm:px-6 py-8 md:py-0 relative">
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

          {/* We removed the old error box — now using toasts instead */}
          {/* You can keep it if you prefer both */}

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
                } rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF5252]/50 focus:border-[#FF5252] outline-none transition`}
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
                } rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF5252]/50 focus:border-[#FF5252] outline-none transition`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF5252] transition cursor-pointer"
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
            className={`w-full bg-[#FF5252] text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg cursor-pointer transition-all duration-200 ${
              isLoggingIn
                ? "opacity-70 cursor-wait"
                : "hover:bg-[#e03e3e] hover:shadow-xl active:scale-[0.98]"
            }`}
          >
            {isLoggingIn ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

          <div className="mt-1.5 pr-1 text-right ">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-[#FF5252] hover:text-[#c62828] font-medium hover:underline transition cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* LINK TO REGISTER */}
          <div className="text-center mt-8 text-gray-600 text-sm">
            Don't have an account?{" "}
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