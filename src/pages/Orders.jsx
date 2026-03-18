import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useNats } from "../hooks/useNats";
import {
  Search, X, Eye, MapPin, RefreshCw, ChevronLeft, ChevronRight,
  Package, Clock, CheckCircle2, XCircle, AlertTriangle, Truck,
  UtensilsCrossed, IndianRupee, User, Phone, Mail, MapPinned,
  Key, Shield, Bike, ShoppingBag, TrendingUp, Activity,
} from "lucide-react";

const BRAND = "#E53935";

const KITCHEN_ALLOWED_FLOW = {
  CREATED:   ["ACCEPTED", "REJECTED"],
  ACCEPTED:  ["PREPARING"],
  PREPARING: ["READY"],
  READY:     [],
  REJECTED:  [],
};

const TAB_CONFIG = [
  { key: "ALL",       label: "All",        icon: <Activity size={13} /> },
  { key: "CREATED",   label: "New",        icon: <ShoppingBag size={13} /> },
  { key: "PREPARING", label: "Preparing",  icon: <UtensilsCrossed size={13} /> },
  { key: "READY",     label: "Ready",      icon: <CheckCircle2 size={13} /> },
  { key: "REJECTED",  label: "Cancelled",  icon: <XCircle size={13} /> },
];

const STATUS_META = {
  CREATED:   { label: "New",       dot: "#f59e0b", bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  ACCEPTED:  { label: "Accepted",  dot: "#3b82f6", bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  PREPARING: { label: "Preparing", dot: "#8b5cf6", bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  READY:     { label: "Ready",     dot: "#10b981", bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  REJECTED:  { label: "Cancelled", dot: "#ef4444", bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
  DELIVERED: { label: "Delivered", dot: "#6366f1", bg: "#eef2ff", text: "#4338ca", border: "#c7d2fe" },
};

const ACTION_META = {
  ACCEPTED:  { label: "Accept",          bg: "from-[#E53935] to-[#FF7043]" },
  REJECTED:  { label: "Reject",          outline: true },
  PREPARING: { label: "Start Preparing", bg: "from-violet-500 to-purple-500" },
  READY:     { label: "Mark Ready",      bg: "from-emerald-500 to-teal-500" },
};

const TRACKING_STEPS = [
  { key: "CREATED",   label: "Placed",    emoji: "🛍️" },
  { key: "ACCEPTED",  label: "Accepted",  emoji: "✅" },
  { key: "PREPARING", label: "Preparing", emoji: "👨‍🍳" },
  { key: "READY",     label: "Ready",     emoji: "📦" },
  { key: "DELIVERED", label: "Delivered", emoji: "🎉" },
];

const apiGetOrders  = (page = 1) => axiosInstance.get(`/orders/vendor/orders?page=${page}&limit=50`, { withCredentials: true });
const apiGetOrderById = (orderId) => axiosInstance.get(`/orders/vendor/orders/${orderId}`, { withCredentials: true });
const apiAcceptOrder  = (orderId) => axiosInstance.post(`/orders/${orderId}/accept`, {}, { withCredentials: true });
const apiMarkReady    = (orderId) => axiosInstance.patch(`/orders/${orderId}/statusready`, { status: "READY" }, { withCredentials: true });

const formatTime = (iso) => {
  if (!iso) return "—";
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};
const fmt = (n) => parseFloat(n || 0).toFixed(0);

/* ══ Status Badge ══ */
const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.CREATED;
  return (
    <span style={{ background: m.bg, color: m.text, border: "1px solid " + m.border }}
      className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-lg text-[11px] font-bold whitespace-nowrap">
      <span style={{ background: m.dot }} className="w-1.5 h-1.5 rounded-full flex-shrink-0" />
      {m.label}
    </span>
  );
};

/* ══ Spinner ══ */
const Spin = ({ size = 13, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin flex-shrink-0" style={{ color }} fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

/* ══ Action Buttons ══ */
const ActionButtons = ({ order, updatingId, onAction }) => {
  const status  = order.order_status;
  const busy    = updatingId === order.id;
  const allowed = KITCHEN_ALLOWED_FLOW[status] || [];

  if (allowed.length === 0) {
    return (
      <span className={`text-[11px] font-bold italic ${status === "REJECTED" ? "text-red-400" : "text-emerald-500"}`}>
        {status === "REJECTED" ? "Cancelled" : "Completed"}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5 justify-end flex-wrap">
      {allowed.map((next) => {
        const m = ACTION_META[next];
        if (!m) return null;
        if (m.outline) return (
          <button key={next} disabled={busy} onClick={() => onAction(order, next)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-bold border border-red-300 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
            {busy && <Spin size={12} color="#ef4444" />}{m.label}
          </button>
        );
        return (
          <button key={next} disabled={busy} onClick={() => onAction(order, next)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-bold text-white bg-gradient-to-r ${busy ? "from-gray-300 to-gray-400" : m.bg} hover:opacity-90 transition-all shadow-sm disabled:opacity-50`}>
            {busy && <Spin size={12} />}{m.label}
          </button>
        );
      })}
    </div>
  );
};

/* ══ New Order Popup ══ */
const NewOrderPopup = ({ order, onClose, onAction, updatingId }) => {
  if (!order) return null;
  const addr = order.delivery_address || {};
  const busy = updatingId === order.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
        <div className="bg-gradient-to-r from-amber-500 to-orange-400 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                <ShoppingBag size={13} className="text-white" />
              </div>
              <p className="text-white font-bold text-[14px]">🔔 New Order Received</p>
            </div>
            <p className="text-amber-100 text-[11px] font-mono">#{order.order_id}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-xl transition"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">
              {(addr.name || order.user?.name || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-[14px] truncate">{addr.name || order.user?.name || `User #${order.user_id}`}</p>
              <p className="text-[12px] text-gray-500">{addr.phone || order.user?.phone || "—"}</p>
              {(addr.addressLine1 || addr.city) && (
                <p className="text-[11.5px] text-gray-400 mt-1 line-clamp-2">
                  📍 {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {order.items?.length > 0 && (
            <div>
              <p className="text-[10.5px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Items Ordered</p>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1" style={{ scrollbarWidth: "none" }}>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                    <div className="flex gap-2 min-w-0 items-center">
                      <span className="bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0">{item.quantity}×</span>
                      <span className="text-[13px] font-semibold text-gray-800 truncate">{item.dish?.name || item.dish_name || `Item #${item.id}`}</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#E53935] flex-shrink-0 ml-2">₹{fmt(item.total_price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Payment", value: order.payment_mode || "COD", neutral: true },
              { label: "Status", value: order.payment_status || "PENDING", green: order.payment_status === "PAID" },
              { label: "Total", value: `₹${fmt(order.total_amount)}`, red: true },
            ].map((c) => (
              <div key={c.label} className={`rounded-xl p-2.5 text-center border ${c.red ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}>
                <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{c.label}</p>
                <p className={`text-[13px] font-extrabold ${c.red ? "text-[#E53935]" : c.green ? "text-emerald-600" : "text-gray-700"}`}>{c.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-1">
            <button disabled={busy} onClick={() => onAction(order, "REJECTED")}
              className="flex-1 py-2.5 rounded-xl border border-red-300 text-red-600 font-bold text-[13px] hover:bg-red-50 transition disabled:opacity-50">
              Reject
            </button>
            <button disabled={busy} onClick={() => onAction(order, "ACCEPTED")}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[13px] hover:opacity-90 transition shadow-md shadow-emerald-500/25 disabled:opacity-50">
              Accept Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══ Modal Shell ══ */
const ModalShell = ({ open, onClose, headerBg, headerIcon, title, subtitle, children, footer, maxW = "max-w-lg", extra }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxW} overflow-hidden max-h-[92vh] flex flex-col`} style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>
        <div className={`px-6 py-4 flex items-center justify-between flex-shrink-0 ${headerBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">{headerIcon}</div>
            <div>
              <p className="text-white font-bold text-[15px]">{title}</p>
              {subtitle && <p className="text-white/70 text-[11px] font-mono">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {extra}
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-xl transition"><X size={15} /></button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4" style={{ scrollbarWidth: "none" }}>{children}</div>
        {footer && <div className="px-5 py-4 border-t border-gray-50 flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
};

/* ══ Info Card ══ */
const InfoCard = ({ title, children, accent }) => {
  const bg = accent ? (accent + "0f") : "transparent";
  const bd = accent ? (accent + "30") : "#f3f4f6";
  return (
    <div className="rounded-2xl border p-4" style={{ background: bg, borderColor: bd }}>
      {title && <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: accent || "#9ca3af" }}>{title}</p>}
      {children}
    </div>
  );
};

/* ══ OTP Banner ══ */
const OtpBanner = ({ otp, verified, label = "Pickup OTP" }) => (
  <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
    <div className="w-10 h-10 rounded-xl bg-amber-400 text-white flex items-center justify-center text-lg flex-shrink-0">🔑</div>
    <div className="flex-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-0.5">{label}</p>
      <p className="font-mono font-black text-3xl tracking-[0.25em] text-amber-700 leading-none">{otp}</p>
    </div>
    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
      {verified ? "✅ Verified" : "⏳ Pending"}
    </span>
  </div>
);

/* ══ Order Detail Modal ══ */
const OrderDetailModal = ({ orderId, orderData, open, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !orderId) return;
    if (orderData) setDetail(orderData);
    setLoading(true); setError(null);
    apiGetOrderById(orderId)
      .then((r) => { const f = r.data?.data || r.data; if (f) setDetail(f); })
      .catch((e) => { if (!orderData) setError(e?.response?.data?.message || "Failed to load details"); })
      .finally(() => setLoading(false));
  }, [open, orderId]);

  useEffect(() => { if (!open) { setDetail(null); setError(null); } }, [open]);

  const addr   = detail?.delivery_address || {};
  const user   = detail?.user || {};
  const driver = detail?.driver;
  const m      = detail ? (STATUS_META[detail.order_status] || STATUS_META.CREATED) : null;
  const showOtp = detail && ["ACCEPTED", "PREPARING", "READY", "DELIVERED"].includes(detail.order_status);

  return (
    <ModalShell open={open} onClose={onClose}
      headerBg="bg-gradient-to-r from-[#E53935] to-[#FF7043]"
      headerIcon={<Eye size={16} className="text-white" />}
      title="Order Details"
      subtitle={detail?.order_id}
      footer={<button onClick={onClose} className="w-full py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13px] font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all">Close</button>}
    >
      {loading && !detail && [...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl p-3">{error}</div>}

      {detail && (
        <>
          {m && <div className="flex items-center justify-between">
            <StatusBadge status={detail.order_status} />
            <span className="text-[12px] text-gray-400">{formatTime(detail.created_at)}</span>
          </div>}

          {showOtp && detail.pickup_otp && <OtpBanner otp={detail.pickup_otp} verified={detail.otp_verified} />}

          {/* Customer */}
          <InfoCard title="Customer" accent="#E53935">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {(addr.name || user.name || "U")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-bold text-gray-800">{addr.name || user.name || `User #${detail.user_id}`}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">📞 {addr.phone || user.phone || "—"}</p>
                {user.email && <p className="text-[12px] text-gray-400 mt-0.5">✉️ {user.email}</p>}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {user.id && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">UID #{user.id}</span>}
                  {user.is_verified && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-600">✓ Verified</span>}
                  {user.gender && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 capitalize">{user.gender}</span>}
                </div>
              </div>
            </div>
          </InfoCard>

          {(addr.addressLine1 || addr.city) && (
            <InfoCard accent="#6366f1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Delivery Address</p>
              <p className="text-[12.5px] text-gray-600 leading-relaxed">📍 {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}</p>
            </InfoCard>
          )}

          {/* Items */}
          {detail.items?.length > 0 && (
            <div>
              <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-widest mb-2">Items</p>
              <div className="space-y-2">
                {detail.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white text-[10.5px] font-bold flex items-center justify-center flex-shrink-0">{item.quantity}×</span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 truncate">{item.dish_name || item.dish?.name || `Dish #${item.dish_id}`}</p>
                        <p className="text-[11px] text-gray-400">₹{fmt(item.unit_price || item.price)} each</p>
                      </div>
                    </div>
                    <span className="text-[13px] font-bold ml-2 flex-shrink-0 text-[#E53935]">₹{fmt(item.total_price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Mode", val: detail.payment_mode, cls: detail.payment_mode === "ONLINE" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600" },
              { label: "Payment", val: detail.payment_status, cls: detail.payment_status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700" },
              { label: "Total", val: `₹${fmt(detail.total_amount)}`, red: true },
            ].map((c) => (
              <div key={c.label} className={`rounded-xl p-3 text-center border ${c.red ? "border-red-100 bg-red-50" : "border-gray-100 bg-gray-50"}`}>
                <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400 mb-1">{c.label}</p>
                {c.red ? <p className="text-xl font-extrabold text-[#E53935]">{c.val}</p>
                  : <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded-lg ${c.cls}`}>{c.val}</span>}
              </div>
            ))}
          </div>

          {/* Driver */}
          {driver ? (
            <InfoCard title="Delivery Partner" accent="#3b82f6">
              <div className="flex items-center gap-3">
                {driver.profile_image
                  ? <img src={driver.profile_image} alt={driver.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0" />
                  : <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">{(driver.name || "D")[0].toUpperCase()}</div>
                }
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-bold text-gray-800">{driver.name}</p>
                  <p className="text-[12px] text-gray-500">📞 {driver.phone}</p>
                  {driver.email && <p className="text-[11.5px] text-gray-400">✉️ {driver.email}</p>}
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 uppercase">🏍 {driver.vehicle_type}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 uppercase">{driver.vehicle_number}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${driver.status === "ONLINE" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>● {driver.status}</span>
                  </div>
                </div>
              </div>
              {detail.driver_status && (
                <div className="mt-2 pt-2 border-t border-blue-100">
                  <p className="text-[11px] text-gray-400">Assignment: <span className={`font-bold ${detail.driver_status === "ASSIGNED" ? "text-blue-600" : "text-gray-500"}`}>{detail.driver_status}</span></p>
                </div>
              )}
            </InfoCard>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-base">🛵</div>
              <div>
                <p className="text-[13px] font-bold text-gray-500">No Driver Assigned Yet</p>
                <p className="text-[11px] text-gray-400">Status: <span className="font-semibold">{detail.driver_status || "NOT_ASSIGNED"}</span></p>
              </div>
            </div>
          )}

          {detail.delivery_otp && (
            <OtpBanner otp={detail.delivery_otp} verified={detail.delivery_otp_verified} label="Delivery OTP" />
          )}

          {/* Price Breakdown */}
          <InfoCard title="Price Breakdown" accent="#8b5cf6">
            <div className="space-y-2">
              {[
                { label: "Item Total",      val: detail.total_amount },
                { label: "Delivery Charge", val: detail.delivery_charge },
                { label: "Platform Fee",    val: detail.platform_fee },
                { label: "GST",             val: detail.gst_amount },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between text-[12.5px] text-gray-600">
                  <span>{label}</span>
                  <span className="font-semibold">₹{fmt(val)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 flex justify-between text-[13.5px] font-extrabold text-[#E53935]">
                <span>Customer Payable</span>
                <span>₹{fmt(detail.customer_payable)}</span>
              </div>
            </div>
          </InfoCard>
        </>
      )}
    </ModalShell>
  );
};

/* ══ Track Order Modal ══ */
const TrackOrderModal = ({ orderId, orderData, open, onClose }) => {
  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!open || !orderId) return;
    if (orderData) setTrackData({ order: orderData, driver: orderData.driver });
    setLoading(true); setError(null);
    apiGetOrderById(orderId)
      .then((r) => { const order = r.data?.data || r.data; if (!order) throw new Error("No data"); setTrackData({ order, driver: order.driver }); })
      .catch((e) => { if (!orderData) setError(e?.response?.data?.message || "Failed to load tracking info"); })
      .finally(() => setLoading(false));
  }, [open, orderId, refreshKey]);

  useEffect(() => { if (!open) { setTrackData(null); setError(null); } }, [open]);

  const handleNats = useCallback((subject, msg) => {
    if (subject === "order.details.response" && (msg.order?.order_id === orderId || msg.order?.id)) {
      setTrackData({ order: msg.order, driver: msg.driver || msg.order?.driver || null }); setLoading(false); return;
    }
    if (subject === "order.status.updated" && msg.orderId === orderId) {
      setTrackData((p) => p ? { ...p, order: { ...p.order, order_status: msg.status || p.order.order_status } } : p);
    }
    if (subject === "driver.location.updated" && msg.orderId === orderId) {
      setTrackData((p) => p ? { ...p, driver: { ...(p.driver || {}), current_latitude: msg.latitude, current_longitude: msg.longitude } } : p);
    }
  }, [orderId]);

  useNats(["order.details.response", "order.status.updated", "driver.location.updated"], handleNats);

  const order      = trackData?.order;
  const driver     = trackData?.driver || order?.driver;
  const addr       = order?.delivery_address || {};
  const user       = order?.user || {};
  const isRejected  = order?.order_status === "REJECTED";
  const isDelivered = order?.order_status === "DELIVERED";
  const stepIdx     = TRACKING_STEPS.findIndex((s) => s.key === order?.order_status);
  const progressPct = stepIdx < 0 ? 0 : (stepIdx / (TRACKING_STEPS.length - 1)) * 100;
  const mapsUrl     = order?.delivery_latitude && order?.delivery_longitude ? `https://www.google.com/maps/dir/?api=1&origin=${order.pickup_latitude},${order.pickup_longitude}&destination=${order.delivery_latitude},${order.delivery_longitude}` : null;
  const driverMapsUrl = driver?.current_latitude ? `https://www.google.com/maps?q=${driver.current_latitude},${driver.current_longitude}` : null;
  const showOtp = order && ["ACCEPTED", "PREPARING", "READY", "DELIVERED"].includes(order.order_status);

  return (
    <ModalShell open={open} onClose={onClose} maxW="max-w-2xl"
      headerBg="bg-gradient-to-r from-sky-500 to-blue-500"
      headerIcon={<MapPin size={16} className="text-white" />}
      title="Live Order Tracking"
      subtitle={orderId}
      extra={
        <button onClick={() => setRefreshKey((k) => k + 1)} className="text-white hover:bg-white/20 p-2 rounded-xl transition">
          <RefreshCw size={15} />
        </button>
      }
      footer={
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Live via NATS
          </p>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white text-[13px] font-bold hover:opacity-90 transition">Close</button>
        </div>
      }
    >
      {loading && !trackData && [...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl p-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setRefreshKey((k) => k + 1)} className="ml-3 text-xs font-bold underline">Retry</button>
        </div>
      )}

      {order && (
        <>
          <div className="flex items-center justify-between">
            <StatusBadge status={order.order_status} />
            <span className="text-[12px] text-gray-400">{formatTime(order.created_at)}</span>
          </div>

          {showOtp && order.pickup_otp && <OtpBanner otp={order.pickup_otp} verified={order.otp_verified} />}

          {/* Customer */}
          <InfoCard title="Customer" accent="#E53935">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {(addr.name || user.name || "U")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-bold text-gray-800">{addr.name || user.name || `User #${order.user_id}`}</p>
                <p className="text-[12px] text-gray-500">📞 {addr.phone || user.phone || "—"}</p>
                {user.email && <p className="text-[12px] text-gray-400">✉️ {user.email}</p>}
                {(addr.addressLine1 || addr.city) && (
                  <p className="text-[11.5px] text-gray-400 mt-1">📍 {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}</p>
                )}
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  {user.id && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">UID #{user.id}</span>}
                  {user.is_verified && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-600">✓ Verified</span>}
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Tracking Timeline */}
          {!isRejected && (
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-5 border border-sky-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500 mb-5">Order Journey</p>
              <div className="relative flex items-start justify-between">
                <div className="absolute top-4 left-0 right-0 px-5 pointer-events-none">
                  <div className="relative h-1.5 bg-sky-200 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-gradient-to-r from-sky-400 to-blue-500" style={{ width: String(progressPct) + "%" }} />
                  </div>
                </div>
                {TRACKING_STEPS.map((step, idx) => {
                  const done = stepIdx >= idx; const active = stepIdx === idx;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300 ${active ? "scale-110 shadow-md shadow-sky-200" : ""}`}
                        style={{ background: done ? (active ? "#0ea5e9" : "#e0f2fe") : "#fff", borderColor: done ? "#0ea5e9" : "#bae6fd", color: done ? (active ? "#fff" : "#0369a1") : "#94a3b8" }}>
                        {done && !active
                          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          : <span>{step.emoji}</span>}
                      </div>
                      <p className={`text-[9px] font-bold text-center ${done ? "text-sky-700" : "text-gray-400"}`}>{step.label}</p>
                    </div>
                  );
                })}
              </div>
              {isDelivered && <div className="mt-4 text-center py-2 rounded-xl bg-emerald-100 text-emerald-700 text-[12px] font-bold">🎉 Order successfully delivered!</div>}
            </div>
          )}

          {isRejected && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-4xl mb-2">❌</p>
              <p className="font-bold text-red-700 text-[14px]">Order was Cancelled</p>
              {order.cancel_reason && <p className="text-[12px] text-red-500 mt-1">Reason: {order.cancel_reason}</p>}
            </div>
          )}

          {/* Route */}
          {(order.pickup_latitude || order.delivery_latitude) && (
            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 flex items-center gap-3">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-orange-400 border-2 border-white shadow" />
                  <div className="w-0.5 h-6" style={{ borderLeft: "2px dashed #d1d5db" }} />
                  <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div><p className="text-[10px] text-gray-400 uppercase font-bold">Pickup</p><p className="text-[12px] font-semibold text-gray-700">Restaurant</p></div>
                  <div><p className="text-[10px] text-gray-400 uppercase font-bold">Delivery</p>
                    <p className="text-[12px] font-semibold text-gray-700 truncate">{addr.name ? `${addr.name} · ` : ""}{[addr.addressLine1, addr.city].filter(Boolean).join(", ")}</p>
                  </div>
                </div>
                {mapsUrl && (
                  <a href={mapsUrl} target="_blank" rel="noreferrer"
                    className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 transition text-sky-700">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                    <p className="text-[9px] font-bold">Navigate</p>
                  </a>
                )}
              </div>
              {(order.restaurant_to_customer_km || order.driver_distance_km || order.total_trip_km) && (
                <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
                  {[
                    { label: "To Customer", val: order.restaurant_to_customer_km },
                    { label: "Driver Trip",  val: order.driver_distance_km },
                    { label: "Total Route",  val: order.total_trip_km },
                  ].map(({ label, val }) => (
                    <div key={label} className="px-3 py-2.5 text-center">
                      <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                      <p className="text-[13px] font-extrabold text-gray-700 mt-0.5">{val ? `${parseFloat(val).toFixed(1)} km` : "—"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Driver */}
          {driver ? (
            <InfoCard title="Delivery Partner" accent="#3b82f6">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  {driver.profile_image
                    ? <img src={driver.profile_image} alt={driver.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
                    : <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-md">{(driver.name || "D")[0].toUpperCase()}</div>
                  }
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${driver.status === "ONLINE" ? "bg-green-400" : "bg-gray-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-bold text-gray-800">{driver.name}</p>
                  <p className="text-[12px] text-gray-500">📞 {driver.phone}</p>
                  {driver.email && <p className="text-[11.5px] text-gray-400">✉️ {driver.email}</p>}
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 uppercase">🏍 {driver.vehicle_type}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 uppercase">{driver.vehicle_number}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${order.driver_status === "ASSIGNED" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{order.driver_status || driver.status}</span>
                  {driverMapsUrl && (
                    <a href={driverMapsUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 bg-sky-100 hover:bg-sky-200 px-2.5 py-1 rounded-lg transition">
                      <MapPin size={11} /> Live Location
                    </a>
                  )}
                </div>
              </div>
            </InfoCard>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">🛵</div>
              <div>
                <p className="text-[13px] font-bold text-gray-500">No Driver Assigned Yet</p>
                <p className="text-[11px] text-gray-400">Status: <span className="font-semibold">{order.driver_status || "NOT_ASSIGNED"}</span></p>
              </div>
            </div>
          )}

          {/* OTPs */}
          <div className="flex gap-3 flex-wrap">
            {order.pickup_otp && (
              <div className="flex-1 min-w-[140px] p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Pickup OTP</p>
                <p className="font-mono font-black text-3xl tracking-[0.2em] text-amber-700">{order.pickup_otp}</p>
                <p className="text-[10px] text-amber-500 mt-1">{order.otp_verified ? "✅ Verified by driver" : "⏳ Awaiting pickup"}</p>
              </div>
            )}
            {order.delivery_otp && (
              <div className="flex-1 min-w-[140px] p-3.5 rounded-2xl bg-green-50 border border-green-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-1">Delivery OTP</p>
                <p className="font-mono font-black text-3xl tracking-[0.2em] text-green-700">{order.delivery_otp}</p>
                <p className="text-[10px] text-green-500 mt-1">{order.delivery_otp_verified ? "✅ Delivered" : "⏳ Awaiting delivery"}</p>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-4 divide-x divide-gray-100">
              {[
                { label: "Mode",    val: order.payment_mode || "COD",       cls: "text-gray-700" },
                { label: "Payment", val: order.payment_status || "PENDING", cls: order.payment_status === "PAID" ? "text-emerald-600" : "text-amber-600" },
                { label: "Total",   val: `₹${fmt(order.total_amount)}`,      cls: "text-gray-700" },
                { label: "Payable", val: `₹${fmt(order.customer_payable)}`,  cls: "text-[#E53935] font-extrabold" },
              ].map(({ label, val, cls }) => (
                <div key={label} className="px-3 py-3 text-center bg-gray-50">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                  <p className={`text-[12px] font-bold ${cls}`}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </ModalShell>
  );
};
/* ══ Chat Modal ══ */
/* Paste BEFORE: export default function Orders() */

const CHAT_SENDER = {
  user: {
    label:      "Customer",
    initials:   "C",
    side:       "left",             // ← left side
    bubbleBg:   "#eff6ff",
    bubbleBdr:  "#bfdbfe",
    bubbleText: "#1d4ed8",
    avatarBg:   "#dbeafe",
    avatarText: "#1d4ed8",
    borderRadius: "4px 12px 12px 12px",
  },
  driver: {
    label:      "Driver",
    initials:   "D",
    side:       "right",            // ← right side
    bubbleBg:   "#fffbeb",
    bubbleBdr:  "#fde68a",
    bubbleText: "#92400e",
    avatarBg:   "#fef3c7",
    avatarText: "#92400e",
    borderRadius: "12px 4px 12px 12px",
  },
  vendor: {
    label:      "You (Vendor)",
    initials:   "V",
    side:       "right",
    bubbleBg:   "#ecfdf5",
    bubbleBdr:  "#a7f3d0",
    bubbleText: "#065f46",
    avatarBg:   "#d1fae5",
    avatarText: "#065f46",
    borderRadius: "12px 4px 12px 12px",
  },
};

const ChatModal = ({ orderId, chatData, onClose }) => {
  const open     = Boolean(orderId);
  const messages = chatData?.messages || [];

  /* Group by date */
  const grouped = messages.reduce((acc, msg) => {
    const date = msg.created_at
      ? new Date(msg.created_at).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        })
      : "Today";
    if (!acc.length || acc[acc.length - 1].date !== date)
      acc.push({ date, msgs: [msg] });
    else
      acc[acc.length - 1].msgs.push(msg);
    return acc;
  }, []);

  /* Which senders are actually present — for legend */
  const presentTypes = [...new Set(messages.map((m) => m.sender_type?.toLowerCase()))];

  if (!open) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      headerBg="bg-gradient-to-r from-emerald-500 to-teal-500"
      headerIcon={<span style={{ fontSize: 16 }}>💬</span>}
      title="Order Chat"
      subtitle={orderId}
      maxW="max-w-lg"
      extra={
        <span style={{
          background: chatData?.status === "active" ? "#d1fae5" : "#f3f4f6",
          color:      chatData?.status === "active" ? "#065f46" : "#6b7280",
          fontSize: 10, fontWeight: 700, padding: "3px 10px",
          borderRadius: 20, letterSpacing: "0.05em",
        }}>
          ● {chatData?.status || "—"}
        </span>
      }
      footer={
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {presentTypes.map((type) => {
            const s = CHAT_SENDER[type];
            if (!s) return null;
            return (
              <span key={type} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 11, color: "#6b7280", fontWeight: 600,
              }}>
                <span style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: s.avatarBg, border: "1.5px solid " + s.bubbleBdr,
                  display: "inline-block",
                }} />
                {s.label}
                <span style={{
                  fontSize: 10, color: "#9ca3af",
                  marginLeft: 2,
                }}>
                  ({s.side === "left" ? "← left" : "right →"})
                </span>
              </span>
            );
          })}
        </div>
      }
    >
      {/* Empty state */}
      {messages.length === 0 && (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "64px 0", gap: 12,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "#ecfdf5",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24,
          }}>💬</div>
          <p style={{ fontWeight: 700, color: "#374151", fontSize: 14, margin: 0 }}>
            No messages yet
          </p>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
            No conversation for this order
          </p>
        </div>
      )}

      {/* Messages */}
      {grouped.map(({ date, msgs }) => (
        <div key={date} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Date divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
            <span style={{
              fontSize: 10, fontWeight: 700, color: "#9ca3af",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              {date}
            </span>
            <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
          </div>

          {msgs.map((msg) => {
            const type    = msg.sender_type?.toLowerCase() || "user";
            const s       = CHAT_SENDER[type] || CHAT_SENDER.user;
            const isRight = s.side === "right";

            return (
              <div key={msg.id} style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                flexDirection: isRight ? "row-reverse" : "row",
              }}>

                {/* Avatar circle */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: s.avatarBg,
                  border: "1.5px solid " + s.bubbleBdr,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: s.avatarText,
                  flexShrink: 0,
                }}>
                  {s.initials}
                </div>

                {/* Content */}
                <div style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: isRight ? "flex-end" : "flex-start",
                  gap: 4,
                }}>
                  {/* Sender name */}
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "#9ca3af",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>
                    {s.label}
                  </span>

                  {/* Bubble */}
                  <div style={{
                    maxWidth: "80%",
                    background: s.bubbleBg,
                    border: "1px solid " + s.bubbleBdr,
                    borderRadius: s.borderRadius,
                    padding: "9px 14px",
                    fontSize: 13,
                    color: s.bubbleText,
                    lineHeight: 1.55,
                    wordBreak: "break-word",
                  }}>
                    {msg.message}
                  </div>

                  {/* Time + read */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 10, color: "#9ca3af",
                  }}>
                    <span>
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit", minute: "2-digit",
                          })
                        : ""}
                    </span>
                    <span style={{
                      fontWeight: 700, fontSize: 11,
                      color: msg.is_read ? "#10b981" : "#d1d5db",
                    }}>
                      {msg.is_read ? "✓✓" : "✓"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </ModalShell>
  );
};

/* ══════════════════════════════════════════ MAIN ORDERS ══ */
export default function Orders() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab]           = useState(0);
  const [orders, setOrders]                 = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const [actionError, setActionError]       = useState(null);
  const [updatingId, setUpdatingId]         = useState(null);
  const [detailOrderId, setDetailOrderId]   = useState(null);
  const [detailOrderData, setDetailOrderData] = useState(null);
  const [newOrderPopup, setNewOrderPopup]   = useState(null);
  const [page, setPage]                     = useState(1);
  const [totalOrders, setTotalOrders]       = useState(0);
  const [search, setSearch]                 = useState("");
  const [trackOrderId, setTrackOrderId]     = useState(null);
  const [trackOrderData, setTrackOrderData] = useState(null);
  const [chatOrderId, setChatOrderId] = useState(null);
const [chatData, setChatData] = useState(null);
  const prevIds = useRef(new Set());
  const LIMIT = 10;
  const totalPages = Math.ceil(totalOrders / LIMIT);

  const fetchOrders = useCallback(async (pg = 1) => {
    if (pg === 1) setLoading(true);
    setError(null);
    try {
      const res = await apiGetOrders(pg);
      const payload = res.data;
      const list = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [];
      const total = payload.total_orders ?? list.length;
      if (pg === 1 && prevIds.current.size > 0) {
        const newOnes = list.filter((o) => o.order_status === "CREATED" && !prevIds.current.has(o.id));
        if (newOnes.length > 0) setNewOrderPopup(newOnes[0]);
      }
      prevIds.current = new Set(list.map((o) => o.id));
      setOrders(list); setTotalOrders(total);
    } catch (err) { setError(err?.response?.data?.message || "Failed to load orders."); }
    finally { if (pg === 1) setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(page); }, [fetchOrders, page]);

  const handleNats = useCallback((subject, data) => {
    if (subject === "order.created") {
      apiGetOrderById(data.orderId).then((res) => {
        const newOrder = res.data?.data || res.data;
        if (!newOrder) return;
        setOrders((prev) => { if (prev.find((o) => o.order_id === data.orderId)) return prev; return [newOrder, ...prev]; });
        setNewOrderPopup(newOrder); setTotalOrders((prev) => prev + 1);
      }).catch(() => fetchOrders(1));
    } else if (subject === "driver.assigned") {
      if (data.orderId) setOrders((prev) => prev.map((o) => o.order_id === data.orderId ? { ...o, driver_assigned: true } : o));
    } else if (subject === "order.status.updated") {
      const newStatus = data.status || data.order_status;
      if (data.orderId) setOrders((prev) => prev.map((o) => o.order_id === data.orderId ? { ...o, ...(newStatus && { order_status: newStatus }), ...(data.otp_verified !== undefined && { otp_verified: data.otp_verified }) } : o));
    } else if (subject === "order.accepted") {
      if (data.orderId) setOrders((prev) => prev.map((o) => o.order_id === data.orderId ? { ...o, order_status: "ACCEPTED" } : o));
    } else if (subject === "order.delivered") {
      if (data.orderId) setOrders((prev) => prev.map((o) => o.order_id === data.orderId ? { ...o, order_status: "DELIVERED" } : o));
    }
  }, [fetchOrders]);

  useNats(["order.created", "order.accepted", "order.status.updated", "order.delivered", "driver.assigned"], handleNats);

  const handleAction = async (order, nextStatus) => {
    setUpdatingId(order.id); setActionError(null);
    try {
      if (nextStatus === "ACCEPTED") await apiAcceptOrder(order.order_id);
      if (nextStatus === "READY")    await apiMarkReady(order.order_id);
      setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, order_status: nextStatus } : o));
      if (newOrderPopup?.id === order.id) setNewOrderPopup(null);
    } catch (err) { setActionError(err?.response?.data?.message || "Action failed. Please try again."); }
    finally { setUpdatingId(null); }
  };

  const openDetailModal = (order) => { setDetailOrderId(order.order_id); setDetailOrderData(order); };
  const openTrackModal  = (order) => { setTrackOrderId(order.order_id); setTrackOrderData(order); };
  const openChat = (order) => {setChatOrderId(order.order_id);setChatData(order.chat);
};

  const activeKey = TAB_CONFIG[activeTab].key;
  const searchedOrders = activeKey === "ALL" && search.trim()
    ? orders.filter((o) =>
        o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
        o.delivery_address?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.delivery_address?.phone?.includes(search)
      )
    : orders;
  const filteredOrders = activeKey === "ALL" ? searchedOrders : orders.filter((o) => o.order_status === activeKey);
  const getCount = (key) => key === "ALL" ? orders.length : orders.filter((o) => o.order_status === key).length;

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center shadow-md shadow-red-500/25">
              <ShoppingBag size={20} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Orders Dashboard</h1>
              </div>
              <p className="text-[12.5px] text-gray-400 ml-3">{loading ? "Loading…" : `${totalOrders} total order${totalOrders !== 1 ? "s" : ""}`}</p>
            </div>
          </div>
          <button onClick={() => fetchOrders(page)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-600 hover:border-[#E53935]/30 hover:text-[#E53935] transition-all shadow-sm">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Stats 
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {TAB_CONFIG.map((tab) => {
            const count = getCount(tab.key);
            const meta = STATUS_META[tab.key] || { dot: "#E53935", bg: "#fff5f5", text: "#E53935" };
            const isAll = tab.key === "ALL";
            return (
              <button key={tab.key}
                onClick={() => { setActiveTab(TAB_CONFIG.indexOf(tab)); setPage(1); setSearch(""); }}
                className={`bg-white rounded-2xl border p-3.5 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                  ${activeTab === TAB_CONFIG.indexOf(tab) ? "border-[#E53935]/30 shadow-sm ring-2 ring-[#E53935]/10" : "border-gray-100 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: isAll ? "rgba(229,57,53,0.1)" : meta.bg, color: isAll ? "#E53935" : meta.text }}>
                    {tab.icon}
                  </div>
                  {count > 0 && tab.key === "CREATED" && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xl font-extrabold text-gray-900">{count}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{tab.label}</p>
              </button>
            );
          })}
        </div>
        */}

        {/* Errors */}
        {error && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl px-4 py-3">
            <span>{error}</span>
            <button onClick={() => fetchOrders(page)} className="ml-4 font-bold underline text-red-600 text-[12px]">Retry</button>
          </div>
        )}
        {actionError && (
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-700 text-[13px] rounded-xl px-4 py-3">
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} className="ml-4 text-amber-500 font-bold"><X size={14} /></button>
          </div>
        )}

        {/* Tabs + Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TAB_CONFIG.map((tab, idx) => {
              const count  = getCount(tab.key);
              const active = activeTab === idx;
              return (
                <button key={tab.key}
                  onClick={() => { setActiveTab(idx); setPage(1); setSearch(""); }}
                  className={`flex items-center gap-2 px-5 py-3.5 text-[13px] font-bold whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0
                    ${active ? "border-[#E53935] text-[#E53935] bg-red-50/50" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
                  {tab.icon}
                  {tab.label}
                  {count > 0 && (
                    <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${active ? "bg-[#E53935] text-white" : "bg-gray-100 text-gray-500"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search */}
          {activeKey === "ALL" && (
            <div className="p-4 border-b border-gray-50">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:bg-white focus-within:border-[#E53935]/40 focus-within:shadow-[0_0_0_3px_rgba(229,57,53,0.08)] transition-all duration-200">
                <Search size={15} className="text-gray-400 flex-shrink-0" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by order ID, customer name, phone…"
                  className="flex-1 bg-transparent outline-none text-[13.5px] text-gray-700 placeholder-gray-400" />
                {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#E53935] to-[#FF7043]">
                  {["Order ID", "Customer", "Items", "Payment", "Total", "Status", "Time", "Actions"].map((h) => (
                    <th key={h} className={`py-3.5 px-4 text-[11.5px] font-bold uppercase tracking-wider text-white ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className="py-4 px-4"><div className="h-4 bg-gray-100 rounded-lg animate-pulse" style={{ width: (45 + Math.floor(Math.random() * 40)) + "%" }} /></td>
                      ))}
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                          <ShoppingBag size={28} className="text-[#E53935] opacity-60" />
                        </div>
                        <p className="font-bold text-gray-700">{search ? `No results for "${search}"` : `No ${TAB_CONFIG[activeTab].label} orders`}</p>
                        <p className="text-[13px] text-gray-400">{search ? "Try a different search term" : "Orders will appear here once customers place them"}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const m    = STATUS_META[order.order_status] || STATUS_META.CREATED;
                    const addr = order.delivery_address || {};
                    const isNew = order.order_status === "CREATED";
                    return (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-red-50/10 transition-colors group"
                        style={{ borderLeft: "3px solid " + m.dot, background: isNew ? "rgba(245,158,11,0.03)" : undefined }}>

                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[12px] font-bold text-gray-700 block">{order.order_id}</span>
                          {isNew && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-lg mt-1 inline-block">🆕 NEW</span>}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-[13px] font-bold text-gray-800 group-hover:text-[#E53935] transition-colors block">{addr.name || order.user?.name || `User #${order.user_id}`}</span>
                          <span className="text-[11.5px] text-gray-400">{addr.phone || order.user?.phone || "—"}</span>
                          {addr.city && <span className="text-[11px] text-gray-400 block">{addr.city}{addr.state ? `, ${addr.state}` : ""}</span>}
                        </td>

                        <td className="py-3.5 px-4" style={{ maxWidth: 180 }}>
                          {order.items?.length > 0 ? (
                            <div className="space-y-0.5">
                              {order.items.slice(0, 2).map((item) => (
                                <p key={item.id} className="text-[12px] text-gray-600 truncate">
                                  <span className="font-bold text-gray-800">{item.quantity}×</span> {item.dish?.name || item.dish_name || `Item #${item.id}`}
                                </p>
                              ))}
                              {order.items.length > 2 && <p className="text-[11px] text-gray-400">+{order.items.length - 2} more</p>}
                            </div>
                          ) : <span className="text-[12px] text-gray-400">—</span>}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg w-fit ${order.payment_mode === "ONLINE" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{order.payment_mode || "COD"}</span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg w-fit ${order.payment_status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{order.payment_status || "PENDING"}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-[15px] font-extrabold text-[#E53935]">₹{fmt(order.total_amount)}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <StatusBadge status={order.order_status} />
                          <p className="text-[10px] text-gray-400 mt-1">{order.pickup_otp || "no otp"}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-[12px] text-gray-400 whitespace-nowrap">{formatTime(order.created_at)}</span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button onClick={() => openDetailModal(order)} title="View Details"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11.5px] font-bold border border-gray-200 text-gray-600 hover:border-[#E53935]/30 hover:text-[#E53935] hover:bg-red-50 transition-all">
                              <Eye size={12} /> View
                            </button>
                            <button onClick={() => openTrackModal(order)} title="Track Order"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11.5px] font-bold border border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-400 transition-all">
                              <MapPin size={12} /> Track
                            </button>
                            <button
  onClick={() => openChat(order)}
  title="Chat"
  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11.5px] font-bold border border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 transition-all"
>
  💬 Chat
</button>
                            <ActionButtons order={order} updatingId={updatingId} onAction={handleAction} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          

          {/* Pagination */}
          {activeKey === "ALL" && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50 bg-gray-50/30">
              <p className="text-[12.5px] text-gray-400">
                Page <span className="font-bold text-gray-700">{page}</span> of <span className="font-bold text-gray-700">{totalPages}</span> · {totalOrders} total
              </p>
              <div className="flex items-center gap-1">
                <button disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft size={15} />
                </button>
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const pg = i + 1;
                  return (
                    <button key={pg} onClick={() => setPage(pg)}
                      className={`w-8 h-8 rounded-xl text-[12.5px] font-bold border transition-all ${page === pg ? "bg-gradient-to-br from-[#E53935] to-[#FF7043] border-[#E53935] text-white shadow-sm shadow-red-500/25" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {pg}
                    </button>
                  );
                })}
                <button disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {newOrderPopup && <NewOrderPopup order={newOrderPopup} onClose={() => setNewOrderPopup(null)} onAction={handleAction} updatingId={updatingId} />}
      <OrderDetailModal orderId={detailOrderId} orderData={detailOrderData} open={Boolean(detailOrderId)} onClose={() => { setDetailOrderId(null); setDetailOrderData(null); }} />
      <TrackOrderModal orderId={trackOrderId} orderData={trackOrderData} open={Boolean(trackOrderId)} onClose={() => { setTrackOrderId(null); setTrackOrderData(null); }} />
      <ChatModal
    orderId={chatOrderId}
    chatData={chatData}
    onClose={() => {
      setChatOrderId(null);
      setChatData(null);
    }}
  />

      
      

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes menuIn { from { opacity:0; transform:translateY(-6px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
      `}</style>
    </div>
    
  );
}