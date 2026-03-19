import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function Otp() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const phone = location.state?.phone;

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErr("Please enter OTP");
      return;
    }

    setLoading(true);
    setErr("");
    setMsg("");

    try {
      const response = await fetch(
        "https://api.tryde.in/kitchen/restaurants/verifyForgotOtp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone,
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMsg(data.message || "OTP verified");

        // 👉 Go to reset password page
        setTimeout(() => {
          navigate("/reset-password", { state: { phone } });
        }, 1000);
      } else {
        setErr(data.message || "Invalid OTP");
      }
    } catch (error) {
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
            onClick={() => navigate(-1)}
            className="text-[#FF5252] hover:text-[#e03e3e] p-2 rounded-full hover:bg-[#FF5252]/10"
          >
            <IoMdArrowRoundBack size={26} />
          </button>
          <h1 className="text-3xl font-bold text-[#FF5252]">
            Verify OTP
          </h1>
        </div>

        {/* Info */}
        <p className="text-gray-600 text-center mb-8">
          Enter the OTP sent to{" "}
          <span className="font-semibold text-black">{phone}</span>
        </p>

        {/* OTP Input */}
        <div className="mb-6">
          <input
            type="number"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF5252]/40 focus:border-[#FF5252] outline-none transition-all duration-200 text-center tracking-widest text-lg"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleVerifyOtp}
          disabled={loading}
          className={`w-full bg-[#FF5252] text-white py-3.5 rounded-xl font-semibold text-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2
          ${loading ? "opacity-70 cursor-wait" : "hover:bg-[#e03e3e] hover:shadow-lg active:scale-[0.98]"}`}
        >
          {loading ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Success */}
        {msg && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 text-sm font-medium">{msg}</p>
          </div>
        )}

        {/* Error */}
        {err && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-700 text-sm font-medium">{err}</p>
          </div>
        )}

        {/* Resend OTP (optional UI) */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Didn’t receive OTP?{" "}
          <span className="text-[#FF5252] cursor-pointer hover:underline">
            Resend
          </span>
        </div>
      </div>
    </div>
  );
}

export default Otp;