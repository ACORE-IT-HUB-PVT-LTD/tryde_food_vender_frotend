import axios from "axios";
import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { Email } from "@mui/icons-material";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendLink = async () => {
    setLoading(true);
    setErr("");
    setMsg("");

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZW5kb3JJZCI6MzcsInZlcnNpb24iOjEsImlhdCI6MTc2OTg3MzUyNSwiZXhwIjoxNzcwNDc4MzI1LCJpc3MiOiJmb29kLWFwcC12ZW5kb3IifQ.01MBwD8qcSKe3-mJ8p7W_xPiL3C_SnDe541MvpdoX9Q";

      const res = await axiosInstance.post(
        `/restaurants/forgot-password`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg(res.data.message);
    } catch (error) {
      console.log(error);
      setErr("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-['Poppins'] bg-gradient-to-br from-[#fff5f5] to-[#ffecec] px-5 py-10">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[#FF5252] hover:text-[#e03e3e] p-2 rounded-full hover:bg-[#FF5252]/10 transition-colors"
          >
            <IoMdArrowRoundBack size={28} />
          </button>
          <h1 className="text-3xl font-bold text-[#FF5252]">Forgot Password</h1>
        </div>

        <p className="text-gray-600 text-center mb-8 text-base">
          Enter your email and we'll send you a password reset link.
        </p>

        {/* Email Input */}
        <div className="relative mb-8">
          <Email className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF5252]" />
          <input
            type="email"
            placeholder="vendor@example.com"
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF5252]/40 focus:border-[#FF5252] outline-none transition-all duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSendLink}
          disabled={loading}
          className={`w-full bg-[#FF5252] text-white py-3.5 rounded-xl font-semibold text-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2
            ${loading ? "opacity-70 cursor-wait" : "hover:bg-[#e03e3e] hover:shadow-lg active:scale-[0.98]"}`}
        >
          {loading ? (
            <>
              <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>

        {/* Messages */}
        {msg && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 text-sm font-medium">{msg}</p>
          </div>
        )}

        {err && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-700 text-sm font-medium">{err}</p>
          </div>
        )}

        {/* Back to login link */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          Remember your password?{" "}
          <span
            className="text-[#FF5252] font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;