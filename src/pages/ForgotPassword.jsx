import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendLink = async () => {
    // ✅ Validation
    if (!phone) {
      setErr("Please enter phone number");
      return;
    }

    if (phone.length !== 10) {
      setErr("Enter valid 10 digit phone number");
      return;
    }

    setLoading(true);
    setErr("");
    setMsg("");

    try {
      const response = await fetch(
        "https://api.tryde.in/kitchen/restaurants/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMsg(data.message || "OTP sent successfully");

        setLoading(false); // ✅ fix loader before redirect

        // ✅ Navigate to OTP page
        setTimeout(() => {
          navigate("/otp-verification", { state: { phone } });
        }, 1000);

      } else {
        setErr(data.message || "Failed to send OTP");
        setLoading(false);
      }
    } catch (error) {
      setErr("Something went wrong. Try again.");
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
          <h1 className="text-3xl font-bold text-[#FF5252]">
            Forgot Password
          </h1>
        </div>

        <p className="text-gray-600 text-center mb-8 text-base">
          Enter your phone number and we'll send you an OTP.
        </p>

        {/* Phone Input */}
        <div className="relative mb-8">
          <input
            type="tel"
            placeholder="Enter phone number"
            className="w-full pl-4 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF5252]/40 focus:border-[#FF5252] outline-none transition-all duration-200"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            "Send OTP"
          )}
        </button>

        {/* Success Message */}
        {msg && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 text-sm font-medium">{msg}</p>
          </div>
        )}

        {/* Error Message */}
        {err && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-700 text-sm font-medium">{err}</p>
          </div>
        )}

        {/* Back to login */}
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