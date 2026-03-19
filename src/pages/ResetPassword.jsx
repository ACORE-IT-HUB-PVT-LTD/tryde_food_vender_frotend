import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  Visibility,
  VisibilityOff,
  LockReset,
} from "@mui/icons-material";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone; // ✅ phone from OTP page

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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const err = {};

    if (!form.password.trim()) {
      err.password = "Password is required";
    } else if (form.password.length < 6) {
      err.password = "Minimum 6 characters required";
    }

    if (!form.confirmPassword.trim()) {
      err.confirmPassword = "Please confirm password";
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
      const response = await fetch(
        "https://api.tryde.in/kitchen/restaurants/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone,
            newPassword: form.password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccessMsg(data.message || "Password reset successful");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setErrors({ submit: data.message || "Reset failed" });
      }
    } catch (error) {
      setErrors({
        submit: "Something went wrong. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-['Poppins'] bg-gradient-to-br from-[#fff5f5] to-[#ffecec] px-4 py-12">
      <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <LockReset className="text-[#FF5252]" style={{ fontSize: 40 }} />
          <h2 className="text-2xl font-bold text-[#FF5252] mt-2">
            Reset Password
          </h2>
          <p className="text-gray-600 text-sm">
            Change password for {phone}
          </p>
        </div>

        {/* Messages */}
        {errors.submit && (
          <p className="text-red-500 text-center mb-4">{errors.submit}</p>
        )}
        {successMsg && (
          <p className="text-green-600 text-center mb-4">{successMsg}</p>
        )}

        <form onSubmit={handleReset}>
          {/* Password */}
          <div className="mb-4 relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 border rounded-xl"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6 relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 border rounded-xl"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FF5252] text-white py-3 rounded-xl"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back */}
        <p
          className="text-center mt-4 text-[#FF5252] cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;