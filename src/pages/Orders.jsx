import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useNats } from "../hooks/useNats";

const BRAND = "#FF5252";

const KITCHEN_ALLOWED_FLOW = {
  CREATED:   ["ACCEPTED", "REJECTED"],
  ACCEPTED:  ["PREPARING"],
  PREPARING: ["READY"],
  READY:     [],
  REJECTED:  [],
};

const TAB_CONFIG = [
  { key: "ALL",       label: "All" },
  { key: "CREATED",   label: "New" },
  { key: "PREPARING", label: "Preparing" },
  { key: "READY",     label: "Ready" },
  { key: "REJECTED",  label: "Cancelled" },
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
  ACCEPTED:  { label: "Accept",          bg: "#FF5252" },
  REJECTED:  { label: "Reject",          outline: true },
  PREPARING: { label: "Start Preparing", bg: "#8b5cf6" },
  READY:     { label: "Mark Ready",      bg: "#10b981" },
};

const TRACKING_STEPS = [
  { key: "CREATED",   label: "Placed",    emoji: "🛍️" },
  { key: "ACCEPTED",  label: "Accepted",  emoji: "✅" },
  { key: "PREPARING", label: "Preparing", emoji: "👨‍🍳" },
  { key: "READY",     label: "Ready",     emoji: "📦" },
  { key: "DELIVERED", label: "Delivered", emoji: "🎉" },
];

// ─── APIs ─────────────────────────────────────────────────────────────────────
const apiGetOrders = (page = 1) =>
  axiosInstance.get(`/orders/vendor/orders?page=${page}&limit=50`, { withCredentials: true });

const apiGetOrderById = (orderId) =>
  axiosInstance.get(`/orders/vendor/orders/${orderId}`, { withCredentials: true });

const apiAcceptOrder = (orderId) =>
  axiosInstance.post(`/orders/${orderId}/accept`, {}, { withCredentials: true });

const apiMarkReady = (orderId) =>
  axiosInstance.patch(`/orders/${orderId}/statusready`, { status: "READY" }, { withCredentials: true });

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (iso) => {
  if (!iso) return "—";
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

const fmt = (n) => parseFloat(n || 0).toFixed(0);

// ─── StatusBadge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.CREATED;
  return (
    <span style={{ background: m.bg, color: m.text, border: `1px solid ${m.border}` }}
      className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-md text-[11px] font-bold whitespace-nowrap">
      <span style={{ background: m.dot }} className="w-1.5 h-1.5 rounded-full flex-shrink-0" />
      {m.label}
    </span>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spin = ({ size = 13, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin flex-shrink-0" style={{ color }} fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// ─── Action Buttons ───────────────────────────────────────────────────────────
const ActionButtons = ({ order, updatingId, onAction }) => {
  const status  = order.order_status;
  const busy    = updatingId === order.id;
  const allowed = KITCHEN_ALLOWED_FLOW[status] || [];

  if (allowed.length === 0) {
    return (
      <span className={`text-xs font-semibold italic ${status === "REJECTED" ? "text-red-400" : "text-emerald-500"}`}>
        {status === "REJECTED" ? "❌ Cancelled" : "✅ Completed"}
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-300 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
            {busy && <Spin size={12} color="#ef4444" />}{m.label}
          </button>
        );
        return (
          <button key={next} disabled={busy} onClick={() => onAction(order, next)}
            style={{ background: busy ? "#ccc" : m.bg }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition-colors disabled:opacity-50">
            {busy && <Spin size={12} />}{m.label}
          </button>
        );
      })}
    </div>
  );
};

// ─── New Order Popup ──────────────────────────────────────────────────────────
const NewOrderPopup = ({ order, onClose, onAction, updatingId }) => {
  if (!order) return null;
  const addr = order.delivery_address || {};
  const busy = updatingId === order.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between bg-amber-500">
          <div>
            <p className="text-white font-bold text-sm">🔔 New Order Received</p>
            <p className="text-amber-100 text-xs font-mono">#{order.order_id}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold text-sm">
              {(addr.name || order.user?.name || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {addr.name || order.user?.name || `User #${order.user_id}`}
              </p>
              <p className="text-xs text-gray-500">{addr.phone || order.user?.phone || "—"}</p>
              {(addr.addressLine1 || addr.city) && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  📍 {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>
          <hr />
          {order.items?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">Items Ordered</p>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 border rounded-lg px-3 py-2">
                    <div className="flex gap-2 min-w-0">
                      <span className="bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded">{item.quantity}×</span>
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {item.dish?.name || item.dish_name || `Item #${item.id}`}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-red-500">₹{fmt(item.total_price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-gray-50 border rounded-lg p-2">
              <p className="text-gray-400 uppercase text-[10px]">Payment</p>
              <span className="font-bold text-gray-700">{order.payment_mode || "COD"}</span>
            </div>
            <div className="bg-gray-50 border rounded-lg p-2">
              <p className="text-gray-400 uppercase text-[10px]">Status</p>
              <span className={`font-bold ${order.payment_status === "PAID" ? "text-green-600" : "text-amber-600"}`}>
                {order.payment_status || "PENDING"}
              </span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
              <p className="text-gray-400 uppercase text-[10px]">Total</p>
              <p className="text-lg font-extrabold text-red-500">₹{fmt(order.total_amount)}</p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button disabled={busy} onClick={() => onAction(order, "REJECTED")}
              className="flex-1 py-2.5 rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-50">
              Reject
            </button>
            <button disabled={busy} onClick={() => onAction(order, "ACCEPTED")}
              className="flex-1 py-2.5 rounded-lg bg-green-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50">
              Accept Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Order Detail Modal ───────────────────────────────────────────────────────
// Now receives `orderData` from parent (already fetched orders list) as initial data
// and also fetches fresh detail from API
const OrderDetailModal = ({ orderId, orderData, open, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !orderId) return;
    // Use orderData from parent immediately (no blank flash)
    if (orderData) setDetail(orderData);
    setLoading(true);
    setError(null);
    apiGetOrderById(orderId)
      .then((r) => {
        const fetched = r.data?.data || r.data;
        if (fetched) setDetail(fetched);
      })
      .catch((e) => {
        // If API fails but we already have orderData, don't show error
        if (!orderData) setError(e?.response?.data?.message || "Failed to load details");
      })
      .finally(() => setLoading(false));
  }, [open, orderId]);

  // Reset on close
  useEffect(() => { if (!open) { setDetail(null); setError(null); } }, [open]);

  if (!open) return null;

  const addr   = detail?.delivery_address || {};
  const user   = detail?.user || {};
  const driver = detail?.driver;
  const m      = detail ? (STATUS_META[detail.order_status] || STATUS_META.CREATED) : null;

  // Show OTP when status is ACCEPTED, PREPARING, or READY
  const showOtp = detail && ["ACCEPTED", "PREPARING", "READY", "DELIVERED"].includes(detail.order_status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        {m && <div style={{ height: 5, background: m.dot, flexShrink: 0 }} />}

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3 flex-shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Order Details</h2>
            {detail && <p className="text-xs text-gray-400 font-mono mt-0.5">{detail.order_id}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto flex-1 space-y-4">

          {/* Skeleton while loading without initial data */}
          {loading && !detail && [...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          ))}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>
          )}

          {detail && (
            <>
              {/* Status + Time */}
              <div className="flex items-center justify-between">
                <StatusBadge status={detail.order_status} />
                <span className="text-xs text-gray-400">{formatTime(detail.created_at)}</span>
              </div>

              {/* ── OTP Banner (shown when ACCEPTED and beyond) ── */}
              {showOtp && detail.pickup_otp && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-400 text-white flex items-center justify-center text-lg">
                    🔑
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-0.5">Pickup OTP</p>
                    <p className="font-mono font-black text-3xl tracking-[0.25em] text-amber-700 leading-none">
                      {detail.pickup_otp}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${detail.otp_verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {detail.otp_verified ? "✅ Verified" : "⏳ Pending"}
                    </span>
                  </div>
                </div>
              )}

              <hr className="border-gray-100" />

              {/* ── Customer / User Info ── */}
              <div className="p-3 rounded-xl border border-red-100" style={{ background: "rgba(255,82,82,0.04)" }}>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Customer</p>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {(addr.name || user.name || "U")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">
                      {addr.name || user.name || `User #${detail.user_id}`}
                    </p>
                    {/* Phone: prefer delivery address phone, fallback user.phone */}
                    <p className="text-xs text-gray-500 mt-0.5">
                      📞 {addr.phone || user.phone || "—"}
                    </p>
                    {/* Email from user object */}
                    {user.email && (
                      <p className="text-xs text-gray-400 mt-0.5">✉️ {user.email}</p>
                    )}
                    {/* User ID + verification */}
                    <div className="flex items-center gap-2 mt-1.5">
                      {user.id && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          UID #{user.id}
                        </span>
                      )}
                      {user.is_verified && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-600">
                          ✓ Verified
                        </span>
                      )}
                      {user.gender && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 capitalize">
                          {user.gender}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Delivery Address ── */}
              {(addr.addressLine1 || addr.city) && (
                <div className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Delivery Address</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    📍 {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}

              {/* ── Items ── */}
              {detail.items?.length > 0 && (
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Items</p>
                  <div className="space-y-1.5">
                    {detail.items.map((item) => (
                      <div key={item.id}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded bg-gray-300 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {item.quantity}×
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {item.dish_name || item.dish?.name || `Dish #${item.dish_id}`}
                            </p>
                            <p className="text-xs text-gray-400">₹{fmt(item.unit_price || item.price)} each</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold ml-2 flex-shrink-0" style={{ color: BRAND }}>
                          ₹{fmt(item.total_price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Payment Info ── */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Mode</p>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${detail.payment_mode === "ONLINE" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"}`}>
                    {detail.payment_mode}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Payment</p>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${detail.payment_status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {detail.payment_status}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl text-center"
                  style={{ background: "rgba(255,82,82,0.06)", border: "1px solid rgba(255,82,82,0.15)" }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Total</p>
                  <p className="text-xl font-extrabold" style={{ color: BRAND }}>₹{fmt(detail.total_amount)}</p>
                </div>
              </div>

              {/* ── Driver Info ── */}
              {driver ? (
                <div className="p-3 rounded-xl border border-blue-100 bg-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Delivery Partner</p>
                  <div className="flex items-center gap-3">
                    {driver.profile_image ? (
                      <img src={driver.profile_image} alt={driver.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {(driver.name || "D")[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800">{driver.name}</p>
                      <p className="text-xs text-gray-500">📞 {driver.phone}</p>
                      {driver.email && <p className="text-xs text-gray-400">✉️ {driver.email}</p>}
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                          🏍 {driver.vehicle_type}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                          {driver.vehicle_number}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${driver.status === "ONLINE" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          ● {driver.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Driver status for this order */}
                  {detail.driver_status && (
                    <div className="mt-2 pt-2 border-t border-blue-100">
                      <p className="text-[10px] text-gray-400">
                        Assignment: <span className={`font-bold ${detail.driver_status === "ASSIGNED" ? "text-blue-600" : "text-gray-500"}`}>{detail.driver_status}</span>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* No driver assigned yet */
                <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">🛵</div>
                  <div>
                    <p className="text-xs font-bold text-gray-500">No Driver Assigned Yet</p>
                    <p className="text-[10px] text-gray-400">
                      Status: <span className="font-semibold">{detail.driver_status || "NOT_ASSIGNED"}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* ── Delivery OTP (if present) ── */}
              {detail.delivery_otp && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-700">
                  Delivery OTP:&nbsp;
                  <span className="font-mono font-black text-base tracking-widest">{detail.delivery_otp}</span>
                  &nbsp;{detail.delivery_otp_verified ? "✅ Delivered" : "⏳ Awaiting delivery"}
                </div>
              )}

              {/* ── Price Breakdown ── */}
              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 space-y-1.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Price Breakdown</p>
                {[
                  { label: "Item Total",      val: detail.total_amount },
                  { label: "Delivery Charge", val: detail.delivery_charge },
                  { label: "Platform Fee",    val: detail.platform_fee },
                  { label: "GST",             val: detail.gst_amount },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-xs text-gray-600">
                    <span>{label}</span>
                    <span className="font-semibold">₹{fmt(val)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm font-extrabold" style={{ color: BRAND }}>
                  <span>Customer Payable</span>
                  <span>₹{fmt(detail.customer_payable)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 pb-4 flex justify-end flex-shrink-0 border-t border-gray-100 pt-3">
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Track Order Modal ────────────────────────────────────────────────────────
const TrackOrderModal = ({ orderId, orderData, open, onClose }) => {
  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!open || !orderId) return;
    // Use parent orderData immediately
    if (orderData) setTrackData({ order: orderData, driver: orderData.driver });
    setLoading(true);
    setError(null);

    apiGetOrderById(orderId)
      .then((r) => {
        const order = r.data?.data || r.data;
        if (!order) throw new Error("No data");
        setTrackData({ order, driver: order.driver });
      })
      .catch((e) => {
        if (!orderData) setError(e?.response?.data?.message || "Failed to load tracking info");
      })
      .finally(() => setLoading(false));
  }, [open, orderId, refreshKey]);

  useEffect(() => { if (!open) { setTrackData(null); setError(null); } }, [open]);

  const handleNats = useCallback((subject, msg) => {
    if (subject === "order.details.response") {
      if (msg.order?.order_id === orderId || msg.order?.id) {
        setTrackData({ order: msg.order, driver: msg.driver || msg.order?.driver || null });
        setLoading(false);
      }
      return;
    }
    if (subject === "order.status.updated" && msg.orderId === orderId) {
      setTrackData((prev) =>
        prev ? { ...prev, order: { ...prev.order, order_status: msg.status || prev.order.order_status } } : prev
      );
    }
    if (subject === "driver.location.updated" && msg.orderId === orderId) {
      setTrackData((prev) =>
        prev ? { ...prev, driver: { ...(prev.driver || {}), current_latitude: msg.latitude, current_longitude: msg.longitude } } : prev
      );
    }
  }, [orderId]);

  useNats(["order.details.response", "order.status.updated", "driver.location.updated"], handleNats);

  if (!open) return null;

  const order      = trackData?.order;
  const driver     = trackData?.driver || order?.driver;
  const addr       = order?.delivery_address || {};
  const user       = order?.user || {};

  const isRejected  = order?.order_status === "REJECTED";
  const isDelivered = order?.order_status === "DELIVERED";
  const stepIdx     = TRACKING_STEPS.findIndex((s) => s.key === order?.order_status);
  const progressPct = stepIdx < 0 ? 0 : (stepIdx / (TRACKING_STEPS.length - 1)) * 100;

  const mapsUrl = order?.delivery_latitude && order?.delivery_longitude
    ? `https://www.google.com/maps/dir/?api=1&origin=${order.pickup_latitude},${order.pickup_longitude}&destination=${order.delivery_latitude},${order.delivery_longitude}`
    : null;

  const driverMapsUrl = driver?.current_latitude && driver?.current_longitude
    ? `https://www.google.com/maps?q=${driver.current_latitude},${driver.current_longitude}`
    : null;

  // Show OTP in track modal too when accepted+
  const showOtp = order && ["ACCEPTED", "PREPARING", "READY", "DELIVERED"].includes(order.order_status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">📍</div>
            <div>
              <p className="text-white font-extrabold text-sm tracking-tight">Live Order Tracking</p>
              <p className="text-sky-100 text-xs font-mono mt-0.5">{orderId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setRefreshKey((k) => k + 1)} title="Refresh"
              className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            </button>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {loading && !trackData && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setRefreshKey((k) => k + 1)}
                className="ml-3 text-xs font-bold underline text-red-600 hover:text-red-800">Retry</button>
            </div>
          )}

          {order && (
            <>
              {/* Status + Time */}
              <div className="flex items-center justify-between">
                <StatusBadge status={order.order_status} />
                <span className="text-xs text-gray-400">{formatTime(order.created_at)}</span>
              </div>

              {/* ── OTP Banner ── */}
              {showOtp && order.pickup_otp && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-400 text-white flex items-center justify-center text-lg">
                    🔑
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-0.5">Pickup OTP</p>
                    <p className="font-mono font-black text-3xl tracking-[0.25em] text-amber-700 leading-none">
                      {order.pickup_otp}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${order.otp_verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {order.otp_verified ? "✅ Verified" : "⏳ Pending"}
                  </span>
                </div>
              )}

              {/* ── Customer Info Card ── */}
              <div className="p-4 rounded-2xl border border-red-100" style={{ background: "rgba(255,82,82,0.04)" }}>
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-3">Customer</p>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {(addr.name || user.name || "U")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">
                      {addr.name || user.name || `User #${order.user_id}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">📞 {addr.phone || user.phone || "—"}</p>
                    {user.email && <p className="text-xs text-gray-400 mt-0.5">✉️ {user.email}</p>}
                    {(addr.addressLine1 || addr.city) && (
                      <p className="text-xs text-gray-400 mt-1">
                        📍 {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {user.id && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          UID #{user.id}
                        </span>
                      )}
                      {user.is_verified && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-600">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Tracking Timeline ── */}
              {!isRejected && (
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-4 border border-sky-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500 mb-4">Order Journey</p>
                  <div className="relative flex items-start justify-between">
                    <div className="absolute top-4 left-0 right-0 px-5 pointer-events-none">
                      <div className="relative h-1 bg-sky-200 rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                          style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #0ea5e9, #38bdf8)" }} />
                      </div>
                    </div>
                    {TRACKING_STEPS.map((step, idx) => {
                      const done   = stepIdx >= idx;
                      const active = stepIdx === idx;
                      return (
                        <div key={step.key} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300 ${active ? "scale-110 shadow-md shadow-sky-200" : ""}`}
                            style={{
                              background:  done ? (active ? "#0ea5e9" : "#e0f2fe") : "#fff",
                              borderColor: done ? "#0ea5e9" : "#bae6fd",
                              color:       done ? (active ? "#fff" : "#0369a1") : "#94a3b8",
                            }}>
                            {done && !active ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <span>{step.emoji}</span>
                            )}
                          </div>
                          <p className={`text-[9px] font-bold text-center leading-tight ${done ? "text-sky-700" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {isDelivered && (
                    <div className="mt-4 text-center py-2 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-bold">
                      🎉 Order successfully delivered!
                    </div>
                  )}
                </div>
              )}

              {isRejected && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
                  <p className="text-4xl mb-2">❌</p>
                  <p className="font-bold text-red-700 text-sm">Order was Cancelled</p>
                  {order.cancel_reason && (
                    <p className="text-xs text-red-500 mt-1">Reason: {order.cancel_reason}</p>
                  )}
                </div>
              )}

              {/* ── Route Overview ── */}
              {(order.pickup_latitude || order.delivery_latitude) && (
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-orange-400 border-2 border-white shadow" />
                      <div className="w-0.5 h-6 bg-dashed bg-gray-300" style={{ borderLeft: "2px dashed #d1d5db" }} />
                      <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Pickup</p>
                        <p className="text-xs font-semibold text-gray-700 truncate">Restaurant</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Delivery</p>
                        <p className="text-xs font-semibold text-gray-700 truncate">
                          {addr.name ? `${addr.name} · ` : ""}{[addr.addressLine1, addr.city].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    </div>
                    {mapsUrl && (
                      <a href={mapsUrl} target="_blank" rel="noreferrer"
                        className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 transition-colors text-sky-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="3 11 22 2 13 21 11 13 3 11" />
                        </svg>
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
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                          <p className="text-sm font-extrabold text-gray-700 mt-0.5">
                            {val ? `${parseFloat(val).toFixed(1)} km` : "—"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Driver Card ── */}
              {driver ? (
                <div className="p-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50">
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-3">Delivery Partner</p>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {driver.profile_image ? (
                        <img src={driver.profile_image} alt={driver.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                          {(driver.name || "D")[0].toUpperCase()}
                        </div>
                      )}
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${driver.status === "ONLINE" ? "bg-green-400" : "bg-gray-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800">{driver.name}</p>
                      <p className="text-xs text-gray-500">📞 {driver.phone}</p>
                      {driver.email && <p className="text-xs text-gray-400">✉️ {driver.email}</p>}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                          🏍 {driver.vehicle_type}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                          {driver.vehicle_number}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${order.driver_status === "ASSIGNED" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                        {order.driver_status || driver.status}
                      </span>
                      {driverMapsUrl && (
                        <a href={driverMapsUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 bg-sky-100 hover:bg-sky-200 px-2.5 py-1 rounded-lg transition-colors">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                          </svg>
                          Live Location
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">🛵</div>
                  <div>
                    <p className="text-sm font-bold text-gray-500">No Driver Assigned Yet</p>
                    <p className="text-xs text-gray-400">
                      Status: <span className="font-semibold">{order.driver_status || "NOT_ASSIGNED"}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* ── OTPs ── */}
              <div className="flex gap-3 flex-wrap">
                {order.pickup_otp && (
                  <div className="flex-1 min-w-[140px] p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Pickup OTP</p>
                    <p className="font-mono font-black text-3xl tracking-[0.2em] text-amber-700">{order.pickup_otp}</p>
                    <p className="text-[10px] text-amber-500 mt-1">
                      {order.otp_verified ? "✅ Verified by driver" : "⏳ Awaiting pickup"}
                    </p>
                  </div>
                )}
                {order.delivery_otp && (
                  <div className="flex-1 min-w-[140px] p-3.5 rounded-2xl bg-green-50 border border-green-200">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-1">Delivery OTP</p>
                    <p className="font-mono font-black text-3xl tracking-[0.2em] text-green-700">{order.delivery_otp}</p>
                    <p className="text-[10px] text-green-500 mt-1">
                      {order.delivery_otp_verified ? "✅ Delivered" : "⏳ Awaiting delivery"}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Payment Summary ── */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-4 divide-x divide-gray-100">
                  {[
                    { label: "Mode",    val: order.payment_mode || "COD",       cls: "text-gray-700" },
                    { label: "Payment", val: order.payment_status || "PENDING", cls: order.payment_status === "PAID" ? "text-green-600" : "text-amber-600" },
                    { label: "Total",   val: `₹${fmt(order.total_amount)}`,      cls: "text-gray-700" },
                    { label: "Payable", val: `₹${fmt(order.customer_payable)}`,  cls: "font-extrabold", style: { color: BRAND } },
                  ].map(({ label, val, cls, style }) => (
                    <div key={label} className="px-3 py-3 text-center bg-gray-50">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                      <p className={`text-xs font-bold ${cls}`} style={style}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 pt-3 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live via NATS
          </p>
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Orders Component ────────────────────────────────────────────────────
export default function Orders() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab]         = useState(0);
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [actionError, setActionError]     = useState(null);
  const [updatingId, setUpdatingId]       = useState(null);
  const [detailOrderId, setDetailOrderId] = useState(null);
  const [detailOrderData, setDetailOrderData] = useState(null); // ← full order object for modal
  const [newOrderPopup, setNewOrderPopup] = useState(null);
  const [page, setPage]                   = useState(1);
  const [totalOrders, setTotalOrders]     = useState(0);
  const [search, setSearch]               = useState("");
  const [trackOrderId, setTrackOrderId]   = useState(null);
  const [trackOrderData, setTrackOrderData] = useState(null); // ← full order object for track modal
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
      setOrders(list);
      setTotalOrders(total);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load orders.");
    } finally {
      if (pg === 1) setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(page); }, [fetchOrders, page]);

  const handleNats = useCallback((subject, data) => {
    console.log("📨 NATS:", subject, data);

    if (subject === "order.created") {
      apiGetOrderById(data.orderId)
        .then((res) => {
          const newOrder = res.data?.data || res.data;
          if (!newOrder) return;
          setOrders((prev) => {
            const exists = prev.find((o) => o.order_id === data.orderId);
            if (exists) return prev;
            return [newOrder, ...prev];
          });
          setNewOrderPopup(newOrder);
          setTotalOrders((prev) => prev + 1);
        })
        .catch(() => fetchOrders(1));
    } else if (subject === "driver.assigned") {
      if (data.orderId) {
        setOrders((prev) =>
          prev.map((o) => o.order_id === data.orderId ? { ...o, driver_assigned: true } : o)
        );
      }
    } else if (subject === "order.status.updated") {
      const newStatus = data.status || data.order_status;
      if (data.orderId) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === data.orderId
              ? { ...o, ...(newStatus && { order_status: newStatus }), ...(data.otp_verified !== undefined && { otp_verified: data.otp_verified }) }
              : o
          )
        );
      }
    } else if (subject === "order.accepted") {
      if (data.orderId) {
        setOrders((prev) =>
          prev.map((o) => o.order_id === data.orderId ? { ...o, order_status: "ACCEPTED" } : o)
        );
      }
    } else if (subject === "order.delivered") {
      if (data.orderId) {
        setOrders((prev) =>
          prev.map((o) => o.order_id === data.orderId ? { ...o, order_status: "DELIVERED" } : o)
        );
      }
    }
  }, [fetchOrders]);

  useNats(["order.created", "order.accepted", "order.status.updated", "order.delivered", "driver.assigned"], handleNats);

  const handleAction = async (order, nextStatus) => {
    setUpdatingId(order.id);
    setActionError(null);
    try {
      if (nextStatus === "ACCEPTED") {
        const res = await apiAcceptOrder(order.order_id);
        console.log("Accept response:", res.data);
      }
      if (nextStatus === "READY") {
        await apiMarkReady(order.order_id);
      }
      setOrders((prev) =>
        prev.map((o) => o.id === order.id ? { ...o, order_status: nextStatus } : o)
      );
      if (newOrderPopup?.id === order.id) setNewOrderPopup(null);
    } catch (err) {
      setActionError(err?.response?.data?.message || "Action failed. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Open Detail Modal: pass full order object for instant display ──
  const openDetailModal = (order) => {
    setDetailOrderId(order.order_id);
    setDetailOrderData(order);
  };

  // ── Open Track Modal: pass full order object for instant display ──
  const openTrackModal = (order) => {
    setTrackOrderId(order.order_id);
    setTrackOrderData(order);
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Orders Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? "Loading…" : `${totalOrders} total order${totalOrders !== 1 ? "s" : ""}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center justify-between bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <span>{error}</span>
            <button onClick={() => fetchOrders(page)} className="ml-4 font-bold underline text-red-600 text-xs hover:text-red-800">Retry</button>
          </div>
        )}
        {actionError && (
          <div className="mb-4 flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl px-4 py-3">
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} className="ml-4 text-amber-500 hover:text-amber-700 font-bold">✕</button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-4 overflow-hidden">
          <div className="flex overflow-x-auto">
            {TAB_CONFIG.map((tab, idx) => {
              const count  = getCount(tab.key);
              const active = activeTab === idx;
              return (
                <button key={tab.key}
                  onClick={() => { setActiveTab(idx); setPage(1); setSearch(""); }}
                  style={active ? { borderColor: BRAND, color: BRAND } : {}}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${active ? "bg-red-50/40" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                  {tab.label}
                  {count > 0 && (
                    <span style={active ? { background: "rgba(255,82,82,0.12)", color: BRAND } : {}}
                      className={`text-xs font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center ${!active && "bg-gray-100 text-gray-500"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        {activeKey === "ALL" && (
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order ID, customer name, phone..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold">✕</button>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Order ID", "Customer", "Items", "Payment", "Total", "Status", "Time", "Actions"].map((h) => (
                    <th key={h} className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-gray-400 ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className="py-4 px-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${45 + Math.random() * 45}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ background: "rgba(255,82,82,0.08)", transform: "rotate(-6deg)" }}>
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FF5252" strokeWidth="1.5">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {search ? `No results for "${search}"` : `No ${TAB_CONFIG[activeTab].label} orders`}
                          </p>
                          <p className="text-sm text-gray-400 mt-0.5">
                            {search ? "Try a different search term" : "Orders will appear here once customers place them"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const m     = STATUS_META[order.order_status] || STATUS_META.CREATED;
                    const addr  = order.delivery_address || {};
                    const isNew = order.order_status === "CREATED";

                    return (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        style={{ borderLeft: `3px solid ${m.dot}`, background: isNew ? "rgba(245,158,11,0.04)" : undefined }}>

                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs font-bold text-gray-700 block">{order.order_id}</span>
                          {isNew && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded mt-1 inline-block">🆕 NEW</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-sm font-semibold text-gray-800 block">
                            {addr.name || order.user?.name || `User #${order.user_id}`}
                          </span>
                          <span className="text-xs text-gray-400 block">{addr.phone || order.user?.phone || "—"}</span>
                          {addr.city && (
                            <span className="text-xs text-gray-400">{addr.city}{addr.state ? `, ${addr.state}` : ""}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4" style={{ maxWidth: 180 }}>
                          {order.items?.length > 0 ? (
                            <div className="space-y-0.5">
                              {order.items.slice(0, 2).map((item) => (
                                <p key={item.id} className="text-xs text-gray-600 truncate">
                                  <span className="font-bold text-gray-800">{item.quantity}×</span>{" "}
                                  {item.dish?.name || item.dish_name || `Item #${item.id}`}
                                </p>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-xs text-gray-400">+{order.items.length - 2} more</p>
                              )}
                            </div>
                          ) : <span className="text-xs text-gray-400">—</span>}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded w-fit ${order.payment_mode === "ONLINE" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                              {order.payment_mode || "COD"}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded w-fit ${order.payment_status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                              {order.payment_status || "PENDING"}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-base font-extrabold" style={{ color: BRAND }}>₹{fmt(order.total_amount)}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <StatusBadge status={order.order_status} />
                          {order.pickup_otp || "no otp"}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(order.created_at)}</span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">

                            {/* View button — passes full order object */}
                            <button
                              onClick={() => openDetailModal(order)}
                              title="View Order Details"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              View
                            </button>

                            {/* Track button — passes full order object */}
                            <button
                              onClick={() => openTrackModal(order)}
                              title="Track Order"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-400 transition-colors flex-shrink-0">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                              </svg>
                              Track
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

          {activeKey === "ALL" && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/60">
              <p className="text-xs text-gray-400">
                Page <span className="font-bold text-gray-600">{page}</span> of{" "}
                <span className="font-bold text-gray-600">{totalPages}</span> · {totalOrders} total
              </p>
              <div className="flex items-center gap-1">
                <button disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  ← Prev
                </button>
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const pg = i + 1;
                  return (
                    <button key={pg} onClick={() => setPage(pg)}
                      style={page === pg ? { background: BRAND, borderColor: BRAND, color: "#fff" } : {}}
                      className="w-8 h-8 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      {pg}
                    </button>
                  );
                })}
                <button disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Order Popup */}
      {newOrderPopup && (
        <NewOrderPopup
          order={newOrderPopup}
          onClose={() => setNewOrderPopup(null)}
          onAction={handleAction}
          updatingId={updatingId}
        />
      )}

      {/* Order Detail Modal — now receives orderData for instant display */}
      <OrderDetailModal
        orderId={detailOrderId}
        orderData={detailOrderData}
        open={Boolean(detailOrderId)}
        onClose={() => { setDetailOrderId(null); setDetailOrderData(null); }}
      />

      {/* Track Order Modal — now receives orderData for instant display */}
      <TrackOrderModal
        orderId={trackOrderId}
        orderData={trackOrderData}
        open={Boolean(trackOrderId)}
        onClose={() => { setTrackOrderId(null); setTrackOrderData(null); }}
      />
    </div>
  );
}