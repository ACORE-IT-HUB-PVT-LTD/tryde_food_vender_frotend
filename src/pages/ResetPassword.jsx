// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Lock,
  Visibility,
  VisibilityOff,
  LockReset,
} from "@mui/icons-material";
import axiosInstance from "../api/axiosInstance";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    if (!form.password.trim()) {
      err.password = "Password is required";
    } else if (form.password.trim().length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword.trim()) {
      err.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMsg("");

    try {
     const res = await axiosInstance.post(
        `/restaurants/reset-password/${encodeURIComponent(token)}`,
        { password: form.password }
      );
    
      setSuccessMsg(res.data.message || "Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      console.error("Reset Password Error:", error);

      if (error.response?.data?.errors) {
        // Field-specific errors from backend
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          const errorValue = error.response.data.errors[key];
          backendErrors[key] = Array.isArray(errorValue)
            ? errorValue[0]
            : errorValue;
        });
        setErrors(backendErrors);
      } else if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({
          submit:
            error.message || "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-['Poppins'] bg-gradient-to-br from-[#fff5f5] to-[#ffecec] px-4 py-12">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-10 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF5252]/10">
            <LockReset className="text-[#FF5252]" style={{ fontSize: 40 }} />
          </div>
          <h2 className="text-3xl font-bold text-[#FF5252] mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600 text-base">
            Enter your new password below
          </p>
        </div>

        {/* General Error / Success */}
        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700 text-center">
              {errors.submit}
            </p>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-700 text-center">
              {successMsg}
            </p>
          </div>
        )}

        <form onSubmit={handleReset}>
          {/* New Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF5252]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF5252]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`w-full pl-12 pr-12 py-3.5 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                } rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF5252]/50 focus:border-[#FF5252] outline-none transition`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF5252] transition cursor-pointer"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#FF5252] text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 cursor-pointer ${
              isLoading
                ? "opacity-70 cursor-wait"
                : "hover:bg-[#e03e3e] hover:shadow-xl active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          Remember your password?{" "}
          <span
            className="text-[#FF5252] font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </div>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ResetPassword;