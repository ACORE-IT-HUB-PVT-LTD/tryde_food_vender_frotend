// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import VendorLayout from './layout/VendorLayout'
import Dashboard from './pages/Dashboard'
import RestaurantProfile from './pages/RestaurantProfile'
import MenuManagement from './pages/MenuManagement'
import Orders from './pages/Orders'
import LiveTracking from './pages/LiveTracking'
import Earnings from './pages/Earnings'
import Reviews from './pages/Reviews'
import Offers from './pages/Offers'
import Notifications from './pages/Notifications'
import Support from './pages/Support'
import Login from './pages/login'
import Register from './pages/Register'

function App() {
  const isAuthenticated = !!localStorage.getItem('token')  // your simple auth check

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes – wrapped in layout */}
      <Route element={isAuthenticated ? <VendorLayout /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<RestaurantProfile />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/tracking" element={<LiveTracking />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/support" element={<Support />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Optional 404 */}
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  )
}

export default App;