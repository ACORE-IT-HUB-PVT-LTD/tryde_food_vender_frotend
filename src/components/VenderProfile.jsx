// src/pages/VendorProfile.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function VendorProfile() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setError("No token found."); setLoading(false); return; }
        const res = await axiosInstance.get("/restaurants/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const vendorData = Array.isArray(res.data.vendor)
          ? res.data.vendor[0]
          : res.data.vendor || res.data;
        setVendor(vendorData);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchVendorProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#ff5858]/20 border-t-[#ff5858] rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[#ff5858]">{error}</p>
    </div>
  );

  if (!vendor) return null;

  const fmt = (d) => d
    ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Top Hero Row ── */}
        <div className="bg-white rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          {vendor.profile_image ? (
            <img src={vendor.profile_image} alt={vendor.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-[#ff5858]/20 flex-shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#ff5858] text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {(vendor.name?.[0] || "V").toUpperCase()}
            </div>
          )}

          {/* Name + Meta */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl font-bold text-gray-900">{vendor.name || "Vendor"}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{vendor.email}</p>
            {vendor.description && (
              <p className="text-sm text-gray-400 italic mt-1">"{vendor.description}"</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <Pill label={vendor.role || "VENDOR"} cls="bg-[#ff5858]/10 text-[#ff5858]" />
              <Pill label={vendor.status} cls={
                vendor.status === "APPROVED" ? "bg-green-100 text-green-700" :
                vendor.status === "PENDING"  ? "bg-yellow-100 text-yellow-700" :
                                               "bg-red-100 text-red-600"} />
              {vendor.is_verified  && <Pill label="✓ KYC Verified"  cls="bg-blue-100 text-blue-700" />}
              {vendor.bank_verified && <Pill label="✓ Bank Verified" cls="bg-emerald-100 text-emerald-700" />}
              <Pill label={vendor.is_active ? "Active" : "Inactive"} cls={vendor.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"} />
            </div>
          </div>

          {/* Member Since */}
          <div className="text-center sm:text-right flex-shrink-0">
            <p className="text-xs text-gray-400">Member Since</p>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">{fmt(vendor.created_at)}</p>
            <p className="text-xs text-gray-400 mt-2">Vendor ID</p>
            <p className="text-sm font-semibold text-[#ff5858]">#{vendor.id}</p>
          </div>
        </div>

        {/* ── 3-Column Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Contact */}
          <InfoSection title="Contact">
            <Row label="Phone"           value={vendor.phone || "—"} />
            <Row label="Alt. Phone"      value={vendor.alternate_phone || "—"} />
            <Row label="Email"           value={vendor.email || "—"} />
          </InfoSection>

          {/* Account */}
          <InfoSection title="Account">
            <Row label="Role"            value={vendor.role || "—"} />
            <Row label="Status"          value={vendor.status || "—"} accent />
            <Row label="KYC"             value={vendor.is_verified ? "Verified" : "Not Verified"} />
            <Row label="Active"          value={vendor.is_active ? "Yes" : "No"} />
          </InfoSection>

          {/* Activity */}
          <InfoSection title="Activity">
            <Row label="Joined"          value={fmt(vendor.created_at)} />
            <Row label="Last Updated"    value={fmt(vendor.updated_at)} />
            <Row label="Last Login"      value={vendor.last_login ? fmt(vendor.last_login) : "Not recorded"} />
            <Row label="Bank Verified"   value={fmt(vendor.bank_verified_at)} />
          </InfoSection>
        </div>

        {/* ── Bank + Cheque Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Bank Details spans 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6">
            <h2 className="text-xs font-bold text-[#ff5858] uppercase tracking-widest mb-4">
              Bank Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
              <Row label="Bank Name"        value={vendor.bank_name || "—"} />
              <Row label="Account Holder"   value={vendor.account_holder_name || "—"} />
              <Row label="Account Number"   value={vendor.account_number ? `****${vendor.account_number}` : "—"} />
              <Row label="IFSC Code"        value={vendor.ifsc_code || "—"} />
              <Row label="Branch"           value={vendor.branch_name || "—"} />
              <Row label="Account Type"     value={vendor.account_type || "—"} />
              <Row label="Bank Verified"    value={vendor.bank_verified ? "Yes" : "No"} />
              <Row label="Reset Pwd Used"   value={vendor.reset_password_used ? "Yes" : "No"} />
            </div>
          </div>

          {/* Cheque Image */}
          <div className="bg-white rounded-2xl p-6 flex flex-col">
            <h2 className="text-xs font-bold text-[#ff5858] uppercase tracking-widest mb-4">
              Cancelled Cheque
            </h2>
            {vendor.cancelled_cheque_image ? (
              <a href={vendor.cancelled_cheque_image} target="_blank" rel="noopener noreferrer"
                className="block flex-1">
                <img src={vendor.cancelled_cheque_image} alt="Cancelled Cheque"
                  className="w-full h-40 object-cover rounded-xl border border-gray-100 hover:opacity-90 transition-opacity" />
                <p className="text-xs text-center text-[#ff5858] mt-2 font-medium">Click to view full</p>
              </a>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-400">Not uploaded</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const Pill = ({ label, cls }) => (
  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${cls}`}>{label}</span>
);

const InfoSection = ({ title, children }) => (
  <div className="bg-white rounded-2xl p-6">
    <h2 className="text-xs font-bold text-[#ff5858] uppercase tracking-widest mb-4">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Row = ({ label, value, accent = false }) => (
  <div className="flex items-start justify-between gap-2">
    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{label}</span>
    <span className={`text-xs font-semibold text-right ${accent ? "text-[#ff5858]" : "text-gray-800"}`}>
      {value}
    </span>
  </div>
);

export default VendorProfile;