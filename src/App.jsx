import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Layout
import VendorLayout from "./layout/VendorLayout";

// Public pages
import Home from "./pages/Home";
import FAQ from "./components/FAQ";
import HowItWorks from "./components/HowItWorks";
import SuccessStories from "./components/SuccessStories";
import WhyPartner from "./components/WhyPartner";
import FinalCTA from "./components/FinalCTA";
import GetStarted from "./components/GetStarted";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard pages
import Dashboard from "./pages/Dashboard";
import RestaurantProfile from "./pages/RestaurantProfile";
import MenuManagement from "./pages/MenuManagement";
import Orders from "./pages/Orders";
import LiveTracking from "./pages/LiveTracking";
import Earnings from "./pages/Earnings";
import Reviews from "./pages/Reviews";
import Offers from "./pages/Offers";
import Notifications from "./pages/Notifications";
import Support from "./pages/Support";

// Menu sub pages
import AddCategory from "./components/AddCategory";
import AddFoodItem from "./components/AddFoodItem";
import DownloadPanel from "./components/DaownloadPannel";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SubCategory from "./components/SubCategory";

// Public Layout - Simple wrapper for public pages
function PublicLayout() {
  return <Outlet />;
}

// Auth Layout - Wrapper for login/register pages
function AuthLayout() {
  return (
    <main className="min-h-screen">
      <Outlet />
    </main>
  );
}

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Protected Route - Redirect to login if not authenticated
function RequireAuth() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}

// Redirect if already logged in (for login/register pages)
function RedirectIfAuthenticated() {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function App() {
  return (
    <Routes>
      {/* Root redirect to home */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/download" element={<DownloadPanel />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/why-partner" element={<WhyPartner />} />
        <Route path="/finalcta" element={<FinalCTA />} />
        <Route path="/getstartedagin" element={<GetStarted />} />
      </Route>

      {/* ==================== AUTH ROUTES ==================== */}
      {/* Redirect to dashboard if already logged in */}
      <Route element={<RedirectIfAuthenticated />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

        </Route>
      </Route>


      {/* ==================== RESET PASSWORD (PUBLIC) ==================== */}
<Route element={<AuthLayout />}>
  <Route path="/reset-password/:token" element={<ResetPassword />} />
</Route>

      {/* ==================== PROTECTED DASHBOARD ROUTES ==================== */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<VendorLayout />}>
          {/* Dashboard Home */}
          <Route index element={<Dashboard />} />
          
          {/* Restaurant Profile */}
          <Route path="profile" element={<RestaurantProfile />} />

          {/* Menu Management with nested routes */}
          <Route path="menu">
            <Route index element={<MenuManagement />} />
            <Route path="category" element={<AddCategory />} />
              <Route path="sub-category" element={<SubCategory />} />
            <Route path="item" element={<AddFoodItem />} />
          </Route>

          {/* Orders Management */}
          <Route path="orders" element={<Orders />} />
          
          {/* Live Tracking */}
          <Route path="tracking" element={<LiveTracking />} />
          
          {/* Earnings & Analytics */}
          <Route path="earnings" element={<Earnings />} />
          
          {/* Customer Reviews */}
          <Route path="reviews" element={<Reviews />} />
          
          {/* Offers & Promotions */}
          <Route path="offers" element={<Offers />} />
          
          {/* Notifications */}
          <Route path="notifications" element={<Notifications />} />
          
          {/* Support & Help */}
          <Route path="support" element={<Support />} />
        </Route>
      </Route>

      {/* ==================== 404 NOT FOUND ==================== */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
              <button
                onClick={() => window.location.href = '/home'}
                className="px-6 py-3 bg-[#FF5252] text-white rounded-lg font-semibold hover:bg-[#e03e3e] transition"
              >
                Go to Home
              </button>
            </div>
          </div>
        } 
      />
    </Routes>
  );
}

export default App;