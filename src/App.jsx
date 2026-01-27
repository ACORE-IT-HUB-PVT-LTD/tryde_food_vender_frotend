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

function PublicLayout() {
  return <Outlet />;
}

function AuthLayout() {
  return (
    <main className="min-h-screen">
      <Outlet />
    </main>
  );
}

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

function RequireAuth() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/why-partner" element={<WhyPartner />} />
        <Route path="/finalcta" element={<FinalCTA />} />
        <Route path="/getstartedagin" element={<GetStarted />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Dashboard */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<VendorLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<RestaurantProfile />} />

          {/* ✅ MENU ROUTES */}
          <Route path="menu" element={<MenuManagement />}>
            <Route path="category" element={<AddCategory />} />
            <Route path="item" element={<AddFoodItem />} />
          </Route>

          <Route path="orders" element={<Orders />} />
          <Route path="tracking" element={<LiveTracking />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="offers" element={<Offers />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Route>

      <Route path="*" element={<div className="p-10 text-center">404 Not Found</div>} />
    </Routes>
  );
}

export default App;
