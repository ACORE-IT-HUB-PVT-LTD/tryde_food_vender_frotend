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

// ─── APIs ─────────────────────────────────────────────────────────────────────
// 1. GET /orders/vendor/orders?page=1&limit=10
const apiGetOrders = (page = 1) =>
  axiosInstance.get(`/orders/vendor/orders?page=${page}&limit=10`, { withCredentials: true });

// 2. GET /orders/vendor/orders/:orderId
const apiGetOrderById=(orderId) =>
  axiosInstance.get(`/orders/vendor/orders/${orderId}`, { withCredentials: true });

// 3. POST /orders/:orderId/accept
const apiAcceptOrder = (orderId) =>
  axiosInstance.post(`/orders/${orderId}/accept`, {}, { withCredentials: true });

// 4. PATCH /orders/:orderId/statusready
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


const NewOrderPopup = ({ order, onClose, onAction, updatingId }) => {
  if (!order) return null;

  const addr = order.delivery_address || {};
  const busy = updatingId === order.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[popIn_.25s_ease]">

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between bg-amber-500">
          <div>
            <p className="text-white font-bold text-sm">
              🔔 New Order Received
            </p>
            <p className="text-amber-100 text-xs font-mono">
              #{order.order_id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Customer Info */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold text-sm">
              {(order.user?.name || "U")[0].toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {addr.name || order.user?.name || `User #${order.user_id}`}
              </p>
              <p className="text-xs text-gray-500">
                {addr.phone || order.user?.phone || "—"}
              </p>

              {(addr.addressLine1 || addr.city) && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  📍 {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>

          <hr />

          {/* Items */}
          {order.items?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                Items Ordered
              </p>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-gray-50 border rounded-lg px-3 py-2"
                  >
                    <div className="flex gap-2 min-w-0">
                      <span className="bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded">
                        {item.quantity}×
                      </span>

                      <span className="text-sm font-medium text-gray-800 truncate">
                        {item.dish_name || `Item #${item.id}`}
                      </span>
                    </div>

                    <span className="text-sm font-bold text-red-500">
                      ₹{fmt(item.total_price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-gray-50 border rounded-lg p-2">
              <p className="text-gray-400 uppercase text-[10px]">Payment</p>
              <span className="font-bold text-gray-700">
                {order.payment_mode || "COD"}
              </span>
            </div>

            <div className="bg-gray-50 border rounded-lg p-2">
              <p className="text-gray-400 uppercase text-[10px]">Status</p>
              <span className={`font-bold ${
                order.payment_status === "PAID"
                  ? "text-green-600"
                  : "text-amber-600"
              }`}>
                {order.payment_status || "PENDING"}
              </span>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
              <p className="text-gray-400 uppercase text-[10px]">Total</p>
              <p className="text-lg font-extrabold text-red-500">
                ₹{fmt(order.total_amount)}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              disabled={busy}
              onClick={() => onAction(order, "REJECTED")}
              className="flex-1 py-2.5 rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-50"
            >
              Reject
            </button>

            <button
              disabled={busy}
              onClick={() => onAction(order, "ACCEPTED")}
              className="flex-1 py-2.5 rounded-lg bg-green-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              Accept Order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Order Detail Modal ───────────────────────────────────────────────────────
const OrderDetailModal = ({ orderId, open, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!open || !orderId) return;
    setLoading(true); setError(null); setDetail(null);
    apiGetOrderById(orderId)
      .then((r) => setDetail(r.data.data))
      .catch((e) => setError(e?.response?.data?.message || "Failed to load details"))
      .finally(() => setLoading(false));
  }, [open, orderId]);

  if (!open) return null;
  const addr = detail?.delivery_address || {};
  const m = detail ? (STATUS_META[detail.order_status] || STATUS_META.CREATED) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        {m && <div style={{ height: 5, background: m.dot, flexShrink: 0 }} />}
        <div className="flex items-start justify-between px-6 pt-5 pb-3 flex-shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Order Details</h2>
            {detail && <p className="text-xs text-gray-400 font-mono mt-0.5">{detail.order_id}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto flex-1 space-y-4">
          {loading && [...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}

          {detail && (
            <>
              <div className="flex items-center justify-between">
                <StatusBadge status={detail.order_status} />
                <span className="text-xs text-gray-400">{formatTime(detail.created_at)}</span>
              </div>
              <hr className="border-gray-100" />

              {/* Customer */}
              <div className="p-3 rounded-xl border border-red-100" style={{ background: "rgba(255,82,82,0.04)" }}>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Customer</p>
                <p className="text-sm font-bold text-gray-800">{addr.name || detail.user?.name || `User #${detail.user_id}`}</p>
                <p className="text-xs text-gray-500 mt-0.5">📞 {addr.phone || detail.user?.phone || "—"}</p>
                {detail.user?.email && <p className="text-xs text-gray-400 mt-0.5">✉️ {detail.user.email}</p>}
              </div>

              {/* Address */}
              {(addr.addressLine1 || addr.city) && (
                <div className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Delivery Address</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}

              {/* Item data from the api */}
              {detail.items?.length > 0 && (
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Items</p>
                  <div className="space-y-1.5">
                    {detail.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded bg-gray-300 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {item.quantity}×
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{item.dish_name || `Dish ${item.dish_id}`}</p>
                            <p className="text-xs text-gray-400">₹{fmt(item.unit_price)} each</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold ml-2 flex-shrink-0" style={{ color: BRAND }}>₹{fmt(item.total_price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment */}
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
                <div className="p-2.5 rounded-xl text-center" style={{ background: "rgba(255,82,82,0.06)", border: "1px solid rgba(255,82,82,0.15)" }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Total</p>
                  <p className="text-xl font-extrabold" style={{ color: BRAND }}>₹{fmt(detail.total_amount)}</p>
                </div>
              </div>

              {/* OTP */}
              {detail.pickup_otp && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700">
                  Pickup OTP:&nbsp;
                  <span className="font-mono font-black text-base tracking-widest">{detail.pickup_otp}</span>
                  &nbsp;{detail.otp_verified ? "✅ Verified" : "⏳ Awaiting verification"}
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-6 pb-4 flex justify-end flex-shrink-0 border-t border-gray-50 pt-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Orders Component ────────────────────────────────────────────────────
export default function Orders() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab]= useState(0);
  const [orders, setOrders]= useState([]);
  const [loading, setLoading]= useState(false);
  const [error, setError]= useState(null);
  const [actionError, setActionError] = useState(null);
  const [updatingId, setUpdatingId]   = useState(null);
  const [detailOrderId, setDetailOrderId] = useState(null);
  const [newOrderPopup, setNewOrderPopup] = useState(null);
  const [page, setPage]= useState(1);
  const [totalOrders, setTotalOrders]= useState(0);
  const [search, setSearch]= useState("");
  const prevIds = useRef(new Set());
  const LIMIT = 10;
  const totalPages = Math.ceil(totalOrders / LIMIT);

  // ── 1. Fetch Orders ────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async (pg = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetOrders(pg);
      const payload = res.data;

      // ✅ API response: { data: [...], total_orders: N }
      const list  = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [];
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
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(page); }, [fetchOrders, page]);

  // ── 2. NATS Real-time──────────────────────────────────────────────────────
  const handleNats = useCallback((subject, data) => {
    console.log("📨 NATS:", subject, data);

    // ✅ Naya order aaya — API se full data fetch karo
    if (subject === "order.created") {
      apiGetOrderById(data.orderId)
        .then((res) => {
          const newOrder = res.data.data;
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
    }

    // ✅ Driver assign hua — otp_verified check ke baad tracking button dikhega
    else if (subject === "driver.assigned") {
      if (data.orderId) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === data.orderId
              ? { ...o, driver_assigned: true }
              : o
          )
        );
      }
    }

    // ✅ OTP verify hua — tracking button enable karo
    else if (subject === "order.status.updated") {
      const newStatus = data.status || data.order_status;
      if (data.orderId) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === data.orderId
              ? {
                  ...o,
                  ...(newStatus && { order_status: newStatus }),
                  // ✅ OTP verified aaya to update karo
                  ...(data.otp_verified !== undefined && { otp_verified: data.otp_verified }),
                }
              : o
          )
        );
      }
    }

    // ✅ Order accepted
    else if (subject === "order.accepted") {
      if (data.orderId) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === data.orderId
              ? { ...o, order_status: "ACCEPTED" }
              : o
          )
        );
      }
    }

    // ✅ Order delivered
    else if (subject === "order.delivered") {
      if (data.orderId) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === data.orderId
              ? { ...o, order_status: "DELIVERED" }
              : o
          )
        );
      }
    }

  }, [fetchOrders]);

  useNats([
    "order.created",
    "order.accepted",
    "order.status.updated",
    "order.delivered",
    "driver.assigned",
  ], handleNats);

  // ── 3. Action Handler ──────────────────────────────────────────────────────
  const handleAction = async (order, nextStatus) => {
    setUpdatingId(order.id);
    setActionError(null);
    try {
      // ✅ POST /orders/:orderId/accept — response: { status: "ACCEPTED", otp: 4177 }
      if (nextStatus === "ACCEPTED") {
        const res = await apiAcceptOrder(order.order_id);
        console.log("Accept response:", res.data);
      }
      // ✅ PATCH /orders/:orderId/statusready — body: { status: "READY" }
      if (nextStatus === "READY") {
        await apiMarkReady(order.order_id);
      }

      // Local state update
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

  // ── 4. Filter + Search ─────────────────────────────────────────────────────
  const activeKey = TAB_CONFIG[activeTab].key;

  const searchedOrders = activeKey === "ALL" && search.trim()
    ? orders.filter((o) =>
        o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
        o.delivery_address?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.delivery_address?.phone?.includes(search)
      )
    : orders;

  const filteredOrders = activeKey === "ALL"
    ? searchedOrders
    : orders.filter((o) => o.order_status === activeKey);

  const getCount = (key) =>
    key === "ALL"
      ? orders.length
      : orders.filter((o) => o.order_status === key).length;

  // ── 5. Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Orders Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? "Loading…" : `${totalOrders} total order${totalOrders !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Errors */}
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

        {/* Search Bar - Sirf ALL tab pe */}
        {activeKey === "ALL" && (
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
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
                  {["Order ID","Customer","Items","Payment","Total","Status","Time","Actions"].map((h) => (
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
                          <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${45 + Math.random()*45}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ):filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,82,82,0.08)", transform: "rotate(-6deg)" }}>
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FF5252" strokeWidth="1.5">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
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

                    // ✅ Tracking button — driver pickup ke baad (otp_verified = true)
                    const showTracking = order.otp_verified === true || order.driver_assigned === true;

                    return (
                      <tr key={order.id} className="border-b border-gray-50 transition-colors"
                        style={{ borderLeft: `3px solid ${m.dot}`, background: isNew ? "rgba(245,158,11,0.04)" : undefined }}>

                        {/* Order ID */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs font-bold text-gray-700 block">{order.order_id}</span>
                          {isNew && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded mt-1 inline-block">🆕 NEW</span>
                          )}
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <span className="text-sm font-semibold text-gray-800 block">
                            {addr.name || order.user?.name || `User #${order.user_id}`}
                          </span>
                          <span className="text-xs text-gray-400 block">{addr.phone || order.user?.phone || "—"}</span>
                          {addr.city && (
                            <span className="text-xs text-gray-400">{addr.city}{addr.state ? `, ${addr.state}` : ""}</span>
                          )}
                        </td>

                        {/* Items - ✅ dish_name use kar rahe hain */}
                        <td className="py-3.5 px-4" style={{ maxWidth: 180 }}>
                          {order.items?.length > 0 ? (
                            <div className="space-y-0.5">
                              {order.items.slice(0, 2).map((item) => (
                                <p key={item.id} className="text-xs text-gray-600 truncate">
                                  <span className="font-bold text-gray-800">{item.quantity}×</span>{" "}
                                  {item.dish?.name || `Item #${item.id}`}
                                </p>
                              ))}
                              {order.items?.length > 2 && (
                                <p className="text-xs text-gray-400">+{order.items.length - 2} more</p>
                              )}
                            </div>
                          ) : <span className="text-xs text-gray-400">—</span>}
                        </td>

                        {/* Payment */}
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

                        {/* Total */}
                        <td className="py-3.5 px-4">
                          <span className="text-base font-extrabold" style={{ color: BRAND }}>₹{fmt(order.total_amount)}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={order.order_status} />
                        </td>

                        {/* Time */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(order.created_at)}</span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">

                            {/* Info button */}
                            <button onClick={() => setDetailOrderId(order.order_id)} title="View details"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                              </svg>
                            </button>

                            {/* Kitchen action buttons */}
                            <ActionButtons order={order} updatingId={updatingId} onAction={handleAction} />

                            {/* ✅ Tracking button - OTP verify hone ke baad dikhega */}
                            {showTracking && (
                              <button
                                onClick={() => navigate(`/tracking?orderId=${order.order_id}`)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white flex-shrink-0 hover:opacity-90 transition-opacity"
                                style={{ background: "#0ea5e9" }}
                                title="Track Order">
                                📍Track
                              </button>
                            )}

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Sirf ALL tab pe */}
          {activeKey === "ALL" && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/60">
              <p className="text-xs text-gray-400">
                Page <span className="font-bold text-gray-600">{page}</span> of{" "}
                <span className="font-bold text-gray-600">{totalPages}</span> · {totalOrders} total
              </p>
              <div className="flex items-center gap-1">
                <button disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">← Prev</button>
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const pg = i + 1;
                  return (
                    <button key={pg} onClick={() => setPage(pg)}
                      style={page === pg ? { background: BRAND, borderColor: BRAND, color: "#fff" } : {}}
                      className="w-8 h-8 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">{pg}</button>
                  );
                })}
                <button disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next →</button>
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

      {/* Detail Modal */}
      <OrderDetailModal
        orderId={detailOrderId}
        open={Boolean(detailOrderId)}
        onClose={() => setDetailOrderId(null)}
      />
    </div>
  );
}


