// src/pages/VendorProfile.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  User, Phone, CheckCircle2, AlertTriangle, Calendar,
  Clock, Shield, BadgeCheck, Landmark, FileText
} from "lucide-react";

/* ─────────────── helpers ─────────────── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "V";

/* ─────────────── Section Title ─────────────── */
const SectionTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.12em] flex items-center gap-1.5">
      {Icon && <Icon size={11} className="text-[#E53935]" />}
      {children}
    </p>
  </div>
);

/* ─────────────── Info Row ─────────────── */
const InfoRow = ({ label, value, accent = false, mono = false }) => (
  <div className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-[11.5px] text-gray-400 font-semibold whitespace-nowrap flex-shrink-0">{label}</span>
    <span className={`text-[12.5px] font-bold text-right break-all ${accent ? "text-[#E53935]" : "text-gray-800"} ${mono ? "font-mono" : ""}`}>
      {value || "—"}
    </span>
  </div>
);

/* ─────────────── Pill Badge ─────────────── */
const Pill = ({ label, variant = "default", icon: Icon }) => {
  const variants = {
    default: "bg-gray-100 text-gray-600 border-gray-200",
    red:     "bg-red-50 text-[#E53935] border-red-200",
    green:   "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber:   "bg-amber-50 text-amber-700 border-amber-200",
    blue:    "bg-blue-50 text-blue-700 border-blue-200",
    teal:    "bg-teal-50 text-teal-700 border-teal-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-xl border-2 ${variants[variant]}`}>
      {Icon && <Icon size={10} />}
      {label}
    </span>
  );
};

/* ─────────────── Stat Card ─────────────── */
const StatCard = ({ icon: Icon, label, value, sub, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-4 ${gradient}`}>
    <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-white/10" />
    <div className="relative z-10">
      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
        <Icon size={17} className="text-white" />
      </div>
      <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.12em]">{label}</p>
      <p className="text-[18px] font-black text-white leading-tight mt-0.5">{value}</p>
      {sub && <p className="text-[11px] text-white/60 mt-0.5 font-medium">{sub}</p>}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
function VendorProfile() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

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
        setTimeout(() => setAnimateIn(true), 60);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchVendorProfile();
  }, []);

  /* ── Loading ── */
  if (loading) return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50/60 to-orange-50/40"
      style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" }}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-[3px] border-red-100 border-t-[#E53935] animate-spin" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center shadow-lg shadow-red-500/30">
            <User size={18} className="text-white" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-[14px] font-bold text-gray-700">Loading Profile</p>
          <p className="text-[12px] text-gray-400 mt-0.5">Please wait a moment…</p>
        </div>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#fafafa]"
      style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" }}
    >
      <div className="bg-white rounded-2xl border-2 border-red-100 p-8 text-center max-w-sm mx-auto shadow-lg shadow-red-500/10">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-[#E53935]" />
        </div>
        <p className="text-[15px] font-black text-gray-800 mb-1">Failed to Load</p>
        <p className="text-[13px] text-gray-500">{error}</p>
      </div>
    </div>
  );

  if (!vendor) return null;

  return (
    <div
      className="min-h-screen bg-[#fafafa] p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" }}
    >
      <div
        className="max-w-7xl mx-auto space-y-5"
        style={{
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? "translateY(0)" : "translateY(14px)",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >

        {/* ══════════════════ PAGE HEADER ══════════════════ */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center shadow-lg shadow-red-500/30">
              <User size={22} className="text-white" strokeWidth={2} />
            </div>
            {vendor.is_active && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h1 className="text-[22px] font-black text-gray-900 tracking-tight leading-tight">Vendor Profile</h1>
            <p className="text-[12.5px] text-gray-400 font-medium mt-0.5">Your account details and verification status</p>
          </div>
        </div>

        {/* ══════════════════ HERO CARD ══════════════════ */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-visible">

          {/* Red banner — fixed height, no overflow issues */}
          <div
            className="relative rounded-t-3xl overflow-hidden"
            style={{ height: "100px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#E53935] via-[#EF5350] to-[#FF7043]" />
            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            {/* Shimmer top line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/60 via-white/25 to-transparent" />
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
            <div className="absolute right-32 -bottom-4 w-20 h-20 rounded-full bg-white/8" />
          </div>

          {/* Profile content — pulls avatar up to overlap banner */}
          <div className="px-5 sm:px-7 pb-6">

            {/* Row: avatar (overlapping) + name/email — RIGHT side: ID chips */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

              {/* Left block */}
              <div className="flex items-end gap-4" style={{ marginTop: "-36px" }}>
                {/* Avatar */}
                <div className="flex-shrink-0 relative z-10">
                  {vendor.profile_image ? (
                    <img
                      src={vendor.profile_image}
                      alt={vendor.name}
                      className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white flex items-center justify-center text-2xl font-black border-4 border-white shadow-xl">
                      {getInitials(vendor.name)}
                    </div>
                  )}
                </div>

                {/* Name + email */}
                <div className="pb-1 pt-10">
                  <h2 className="text-[19px] sm:text-[21px] font-black text-gray-900 leading-tight">
                    {vendor.name || "Vendor"}
                  </h2>
                  <p className="text-[12.5px] text-gray-500 font-medium mt-0.5">{vendor.email}</p>
                </div>
              </div>

              {/* Right: ID + Member Since — sit at top right BELOW banner */}
              <div className="flex gap-2.5 mt-3 sm:mt-3 self-start">
               
                <div className="bg-gray-50 border-2 border-gray-100 rounded-xl px-3.5 py-2 text-center min-w-[90px]">
                  <p className="text-[9.5px] font-black text-gray-400 uppercase tracking-wider">Member Since</p>
                  <p className="text-[12px] font-black text-gray-700 leading-tight mt-0.5">{fmt(vendor.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {vendor.description && (
              <p className="text-[13px] text-gray-500 italic border-l-2 border-[#E53935]/30 pl-3 mt-4">
                "{vendor.description}"
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Pill label={vendor.role || "VENDOR"} variant="red" icon={User} />
              <Pill
                label={vendor.status}
                variant={vendor.status === "APPROVED" ? "green" : vendor.status === "PENDING" ? "amber" : "default"}
                icon={vendor.status === "APPROVED" ? CheckCircle2 : AlertTriangle}
              />
              {vendor.is_verified   && <Pill label="KYC Verified"  variant="blue"  icon={BadgeCheck} />}
              {vendor.bank_verified && <Pill label="Bank Verified" variant="teal"  icon={Landmark} />}
              <Pill
                label={vendor.is_active ? "Active" : "Inactive"}
                variant={vendor.is_active ? "green" : "default"}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════ STAT CARDS ══════════════════ */}
     
        {/* ══════════════════ INFO GRID ══════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* CONTACT */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
            <SectionTitle icon={Phone}>Contact</SectionTitle>
            <InfoRow label="Phone"      value={vendor.phone} />
            <InfoRow label="Alt. Phone" value={vendor.alternate_phone} />
            <InfoRow label="Email"      value={vendor.email} />
          </div>

          {/* ACCOUNT */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
            <SectionTitle icon={User}>Account</SectionTitle>
            <InfoRow label="Role"   value={vendor.role}   accent />
            <InfoRow label="Status" value={vendor.status} accent />
            <InfoRow label="KYC"    value={vendor.is_verified ? "✓ Verified" : "Not Verified"} />
            <InfoRow label="Active" value={vendor.is_active ? "Yes" : "No"} />
          </div>

          {/* ACTIVITY */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
            <SectionTitle icon={Clock}>Activity</SectionTitle>
            <InfoRow label="Joined"           value={fmt(vendor.created_at)} />
            <InfoRow label="Last Updated"     value={fmt(vendor.updated_at)} />
            <InfoRow label="Last Login"       value={vendor.last_login ? fmt(vendor.last_login) : "Not recorded"} />
            <InfoRow label="Bank Verified At" value={fmt(vendor.bank_verified_at)} />
          </div>
        </div>

        {/* ══════════════════ BANK + CHEQUE ══════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* BANK DETAILS */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
            <SectionTitle icon={Landmark}>Bank Details</SectionTitle>

            {vendor.bank_verified && (
              <div className="flex items-center gap-2 bg-teal-50 border-2 border-teal-100 rounded-xl px-4 py-2.5 mb-4">
                <BadgeCheck size={16} className="text-teal-600 flex-shrink-0" />
                <p className="text-[12.5px] font-bold text-teal-700">Bank account has been verified</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <div>
                <InfoRow label="Bank Name"      value={vendor.bank_name} />
                <InfoRow label="Account Holder" value={vendor.account_holder_name} />
                <InfoRow
                  label="Account Number"
                  value={vendor.account_number ? `••••${String(vendor.account_number).slice(-4)}` : "—"}
                  mono
                />
                <InfoRow label="Account Type" value={vendor.account_type} />
              </div>
              <div>
                <InfoRow label="IFSC Code"      value={vendor.ifsc_code} mono />
                <InfoRow label="Branch"         value={vendor.branch_name} />
                <InfoRow label="Bank Verified"  value={vendor.bank_verified ? "Yes" : "No"} />
                <InfoRow label="Reset Pwd Used" value={vendor.reset_password_used ? "Yes" : "No"} />
              </div>
            </div>
          </div>

          {/* CANCELLED CHEQUE */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow duration-300">
            <SectionTitle icon={FileText}>Cancelled Cheque</SectionTitle>

            {vendor.cancelled_cheque_image ? (
              <a
                href={vendor.cancelled_cheque_image}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 block group"
              >
                <div className="relative overflow-hidden rounded-xl border-2 border-gray-100 group-hover:border-[#E53935]/30 transition-all duration-300">
                  <img
                    src={vendor.cancelled_cheque_image}
                    alt="Cancelled Cheque"
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-white text-[12px] font-bold bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm">
                      View Full Image
                    </span>
                  </div>
                </div>
                <p className="text-[11.5px] text-center text-[#E53935] mt-2.5 font-bold">
                  Click to view full size ↗
                </p>
              </a>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-gray-100 flex items-center justify-center mb-3">
                  <FileText size={22} className="text-gray-300" />
                </div>
                <p className="text-[13px] font-bold text-gray-400">Not uploaded</p>
                <p className="text-[11.5px] text-gray-300 mt-0.5">Cheque image will appear here</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ══════════════════ GLOBAL STYLES ══════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
}

export default VendorProfile;