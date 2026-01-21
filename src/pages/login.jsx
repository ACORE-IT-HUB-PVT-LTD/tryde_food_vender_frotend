import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err = {};

    if (!form.email) {
      err.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      err.email = "Invalid email address";
    }

    if (!form.password) {
      err.password = "Password is required";
    } else if (form.password.length < 6) {
      err.password = "Minimum 6 characters required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;

    localStorage.setItem("token", "mock-token");
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">

      {/* ================= LEFT IMAGE ================= */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt="food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-14 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Restaurant Partner Panel
          </h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Manage orders, menu, offers and earnings easily.
          </p>
        </div>
      </div>

      {/* ================= LOGIN FORM ================= */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#fff5f5] to-[#ffecec] px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl px-10 py-12"
        >
          {/* TITLE */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#FF5252] mb-1">
              Vendor Login
            </h2>
            <p className="text-gray-500">
              Sign in to continue
            </p>
          </div>

          {/* EMAIL */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-600">
              Email Address
            </label>

            <div className="relative mt-2">
              <Email className="absolute left-4 top-3.5 text-[#FF5252]" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vendor@email.com"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF5252] outline-none transition"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-gray-600">
              Password
            </label>

            <div className="relative mt-2">
              <Lock className="absolute left-4 top-3.5 text-[#FF5252]" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF5252] outline-none transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-[#FF5252]"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#FF5252] hover:bg-[#e04646] text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition"
          >
            Login
          </button>

          {/* FOOTER */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            Don’t have an account?{" "}
            <span className="text-[#FF5252] font-semibold cursor-pointer">
              Register
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
