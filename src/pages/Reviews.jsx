import React, { useContext, useEffect, useState } from "react";
import { RestaurantContext } from "../context/getRestaurant";
import axiosInstance from "../api/axiosInstance";
import {
  Star, Trash2, Eye, X, MessageSquare, UtensilsCrossed,
  TrendingUp, Users, ChevronRight, AlertTriangle, CheckCircle2,
  Flame, Zap, Settings2, Package, Clock, IndianRupee,
  ImageOff, Tag, Award, ThumbsUp,
} from "lucide-react";
import { FaLeaf, FaDrumstickBite } from "react-icons/fa";

/* ══ Toast ══ */
const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const ok = type === "success";
  return (
    <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border max-w-sm
        ${ok ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-[#E53935]"}`}
      style={{ animation: "slideRight 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
      {ok ? <CheckCircle2 size={17} className="flex-shrink-0" /> : <AlertTriangle size={17} className="flex-shrink-0" />}
      <p className="text-[13px] font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-60 hover:opacity-100"><X size={14} /></button>
    </div>
  );
};

/* ══ Delete Confirm ══ */
const DeleteModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]" onClick={onCancel} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[160] w-[90%] max-w-sm"
        style={{ animation: "scaleUp 0.22s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.14)" }}>
          <div className="bg-gradient-to-br from-[#E53935] to-[#FF7043] px-6 py-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }} />
            <div className="relative w-12 h-12 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trash2 className="text-white w-5 h-5" />
            </div>
            <h3 className="relative text-base font-bold text-white">Delete Review</h3>
          </div>
          <div className="p-5">
            <p className="text-gray-600 text-[13.5px] text-center mb-5">Are you sure you want to delete this review? This cannot be undone.</p>
            <div className="flex gap-2.5">
              <button onClick={onCancel} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[13px] font-semibold rounded-xl transition-all">Cancel</button>
              <button onClick={onConfirm} className="flex-1 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13px] font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/30 active:scale-95 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ══ Star Rating Display ══ */
const StarRating = ({ value, size = 14 }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= Math.round(value) ? "#f59e0b" : "#e5e7eb"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

/* ══ Avatar ══ */
const Avatar = ({ src, name, size = "w-10 h-10" }) => {
  const initials = name ? name.charAt(0).toUpperCase() : "U";
  if (src) return <img src={src} alt={name} className={`${size} rounded-full object-cover ring-2 ring-white shadow`} onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }} />;
  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 ring-2 ring-white shadow`}>
      {initials}
    </div>
  );
};

/* ══════════════════════════════════════════ MAIN ══ */
const Reviews = () => {
  const { restaurant } = useContext(RestaurantContext);
  const [activeTab, setActiveTab] = useState(0);
  const [restaurantReviews, setRestaurantReviews] = useState([]);
  const [dishReviews, setDishReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuItemDialog, setMenuItemDialog] = useState({ open: false, item: null, loading: false });
  const [menuItemCache, setMenuItemCache] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, type }
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(""), 3500); return () => clearTimeout(t); }
  }, [successMsg]);

  const fetchRestaurantReviews = async () => {
    try {
      const result = await axiosInstance.get(`/restaurants/restaurant/${restaurant.id}`, { withCredentials: true });
      if (result.data.success) setRestaurantReviews(result.data.data);
      console.log
    } catch (error) { console.error("Error fetching restaurant reviews:", error); }
  };

  const fetchDishReviews = async (menuItemIds) => {
    try {
      const uniqueIds = [...new Set(menuItemIds)];
      const promises = uniqueIds.map((id) => axiosInstance.get(`/restaurants/dish/${id}`, { withCredentials: true }));
      const results = await Promise.all(promises);
      const allDishReviews = results.flatMap((r) => r.data.success ? r.data.data : []);
      const seen = new Set();
      const unique = allDishReviews.filter((r) => { if (seen.has(r.id)) return false; seen.add(r.id); return true; });
      setDishReviews(unique);
    } catch (error) { console.error("Error fetching dish reviews:", error); }
  };

  const fetchMenuItemById = async (menuItemId) => {
    if (menuItemCache[menuItemId]) {
      setMenuItemDialog({ open: true, item: menuItemCache[menuItemId], loading: false });
      return;
    }
    setMenuItemDialog({ open: true, item: null, loading: true });
    try {
      const result = await axiosInstance.get(`/menuitems/viewsingle/${menuItemId}`, { withCredentials: true });
      if (result.data && result.data.data) {
        const item = result.data.data;
        setMenuItemCache((prev) => ({ ...prev, [menuItemId]: item }));
        setMenuItemDialog({ open: true, item, loading: false });
      } else {
        setMenuItemDialog({ open: true, item: null, loading: false });
      }
    } catch (error) {
      console.error("Error fetching menu item:", error);
      setMenuItemDialog({ open: true, item: null, loading: false });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchRestaurantReviews();
      setLoading(false);
    };
    if (restaurant?.id) loadData();
  }, [restaurant?.id]);

  useEffect(() => {
    if (restaurantReviews.length > 0) {
      const menuItemIds = restaurantReviews.map((r) => r.menuitem_id).filter(Boolean);
      if (menuItemIds.length > 0) fetchDishReviews(menuItemIds);
    }
  }, [restaurantReviews]);

  const handleDeleteReview = () => {
    if (!deleteTarget) return;
    const setter = deleteTarget.type === "restaurant" ? setRestaurantReviews : setDishReviews;
    setter((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setSuccessMsg("Review deleted successfully");
    setDeleteTarget(null);
  };

  const closeDialog = () => setMenuItemDialog({ open: false, item: null, loading: false });

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const currentReviews = activeTab === 0 ? restaurantReviews : dishReviews;
  const reviewType = activeTab === 0 ? "restaurant" : "dish";
  const averageRating = currentReviews.length > 0
    ? currentReviews.reduce((sum, r) => sum + r.rating, 0) / currentReviews.length
    : 0;

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: currentReviews.filter((r) => Math.round(r.rating) === star).length,
    pct: currentReviews.length ? (currentReviews.filter((r) => Math.round(r.rating) === star).length / currentReviews.length) * 100 : 0,
  }));

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      <Toast msg={successMsg} type="success" onClose={() => setSuccessMsg("")} />
      <DeleteModal open={!!deleteTarget} onConfirm={handleDeleteReview} onCancel={() => setDeleteTarget(null)} />

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center shadow-md shadow-red-500/25">
              <MessageSquare size={20} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Reviews Dashboard</h1>
              </div>
              <p className="text-[12.5px] text-gray-400 ml-3">Manage customer feedback and ratings</p>
            </div>
          </div>
        </div>

        {/* ── Stats Row ──
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Reviews", value: restaurantReviews.length + dishReviews.length, gradient: "from-[#E53935] to-[#FF7043]", icon: <MessageSquare size={16} /> },
            { label: "Avg Rating", value: averageRating > 0 ? averageRating.toFixed(1) : "—", gradient: "from-amber-500 to-yellow-400", icon: <Star size={16} /> },
            { label: "Restaurant", value: restaurantReviews.length, gradient: "from-blue-500 to-cyan-400", icon: <UtensilsCrossed size={16} /> },
            { label: "Dish Reviews", value: dishReviews.length, gradient: "from-violet-500 to-purple-400", icon: <ThumbsUp size={16} /> },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>{s.icon}</div>
              <div>
                <p className="text-xl font-extrabold text-gray-900 leading-tight">{s.value}</p>
                <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
         */}

        {/* ── Rating Overview + Tabs ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {[
              { label: "Restaurant Reviews", count: restaurantReviews.length, icon: <UtensilsCrossed size={14} /> },
              { label: "Dish Reviews", count: dishReviews.length, icon: <ThumbsUp size={14} /> },
            ].map((tab, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-5 py-3.5 text-[13px] font-bold border-b-2 transition-all duration-200
                  ${activeTab === i ? "border-[#E53935] text-[#E53935] bg-red-50/50" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
                {tab.icon}
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${activeTab === i ? "bg-[#E53935] text-white" : "bg-gray-100 text-gray-500"}`}>
                  {tab.count}
                </span>
              </button>
            ))}

            {/* Average rating in tab bar — desktop */}
            {currentReviews.length > 0 && (
              <div className="ml-auto flex items-center gap-3 px-5 hidden md:flex">
                <StarRating value={averageRating} size={15} />
                <span className="text-[13px] font-bold text-gray-700">{averageRating.toFixed(1)}</span>
                <span className="text-[12px] text-gray-400">({currentReviews.length} reviews)</span>
              </div>
            )}
          </div>

          {/* ── Rating Distribution ── */}
          {currentReviews.length > 0 && (
            <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-center flex-shrink-0">
                  <p className="text-5xl font-extrabold text-gray-900">{averageRating.toFixed(1)}</p>
                  <StarRating value={averageRating} size={16} />
                  <p className="text-[11px] text-gray-400 mt-1">{currentReviews.length} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5 w-full sm:w-auto">
                  {ratingDist.map((r) => (
                    <div key={r.star} className="flex items-center gap-2">
                      <span className="text-[11.5px] font-bold text-gray-500 w-3">{r.star}</span>
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-700" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-[11px] text-gray-400 w-5 text-right">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Table / Empty ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-red-100 animate-spin border-t-[#E53935]" />
              <p className="text-[13px] text-gray-400 font-medium">Loading reviews…</p>
            </div>
          ) : currentReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <MessageSquare size={28} className="text-[#E53935] opacity-60" />
              </div>
              <h3 className="text-[15px] font-bold text-gray-800 mb-1">No reviews yet</h3>
              <p className="text-[13px] text-gray-400">Customer reviews will appear here</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#E53935] to-[#FF7043]">
                      {["Customer", "Date", "Rating", "Comment", reviewType === "restaurant" ? "Dish" : "Dish ID", ""].map((h, i) => (
                        <th key={i} className={`px-5 py-3.5 text-left text-[11.5px] font-bold text-white uppercase tracking-wider ${i === 5 ? "text-right w-16" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currentReviews.map((review) => (
                      <tr key={review.id} className="hover:bg-red-50/20 transition-colors duration-150 group">
                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar src={review.user_image} name={review.user_name} />
                            <div>
                              <p className="text-[13px] font-bold text-gray-800 group-hover:text-[#E53935] transition-colors">{review.user_name || "Anonymous"}</p>
                              <p className="text-[11px] text-gray-400">User #{review.user_id}</p>
                            </div>
                          </div>
                        </td>
                        {/* Date */}
                        <td className="px-5 py-4">
                          <span className="text-[12.5px] text-gray-500 font-medium">{formatDate(review.created_at)}</span>
                        </td>
                        {/* Rating */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <StarRating value={review.rating} />
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full w-fit
                              ${review.rating >= 4 ? "bg-emerald-50 text-emerald-600" : review.rating >= 3 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"}`}>
                              {review.rating}/5
                            </span>
                          </div>
                        </td>
                        {/* Comment */}
                        <td className="px-5 py-4 max-w-[240px]">
                          {review.comment
                            ? <p className="text-[12.5px] text-gray-600 line-clamp-2 leading-relaxed">{review.comment}</p>
                            : <em className="text-[12px] text-gray-300">No comment</em>}
                        </td>
                        {/* Dish */}
                        <td className="px-5 py-4">
                          {review.menuitem_id ? (
                            <button onClick={() => fetchMenuItemById(review.menuitem_id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E53935]/25 text-[#E53935] bg-red-50 text-[11.5px] font-bold hover:bg-[#E53935] hover:text-white hover:border-[#E53935] transition-all duration-200 group/chip">
                              <Eye size={11} className="group-hover/chip:scale-110 transition-transform" />
                              Dish #{review.menuitem_id}
                            </button>
                          ) : (
                            <span className="text-[12px] text-gray-300 italic">N/A</span>
                          )}
                        </td>
                        {/* Delete */}
                        <td className="px-5 py-4 text-right">
                          <button onClick={() => setDeleteTarget({ id: review.id, type: reviewType })}
                            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-400 hover:text-[#E53935] transition-all duration-200">
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3 p-4">
                {currentReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-[#E53935]/20 transition-all duration-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={review.user_image} name={review.user_name} size="w-10 h-10" />
                        <div>
                          <p className="text-[13.5px] font-bold text-gray-900">{review.user_name || "Anonymous"}</p>
                          <p className="text-[11px] text-gray-400">{formatDate(review.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${review.rating >= 4 ? "bg-emerald-50 text-emerald-600" : review.rating >= 3 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"}`}>{review.rating}/5</span>
                        <button onClick={() => setDeleteTarget({ id: review.id, type: reviewType })}
                          className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-400 hover:text-[#E53935] transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <StarRating value={review.rating} size={13} />
                    {review.comment && <p className="text-[12.5px] text-gray-600 mt-2 leading-relaxed">{review.comment}</p>}
                    {review.menuitem_id && (
                      <button onClick={() => fetchMenuItemById(review.menuitem_id)}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E53935]/25 text-[#E53935] bg-red-50 text-[11.5px] font-bold hover:bg-[#E53935] hover:text-white transition-all">
                        <Eye size={11} /> Dish #{review.menuitem_id}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          {currentReviews.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-5 py-4 border-t border-gray-50 bg-gray-50/30">
              <p className="text-[13px] text-gray-500 font-medium">
                Total: <span className="font-bold text-gray-800">{currentReviews.length}</span> reviews
              </p>
              <div className="flex items-center gap-2">
                <StarRating value={averageRating} size={14} />
                <span className="text-[14px] font-extrabold text-[#E53935]">{averageRating.toFixed(1)}</span>
                <span className="text-[12px] text-gray-400">/ 5.0</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ MENU ITEM DETAIL MODAL ═══════════ */}
      {menuItemDialog.open && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={closeDialog} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[95%] max-w-lg max-h-[90vh] overflow-hidden"
            style={{ animation: "scaleUp 0.22s cubic-bezier(0.16,1,0.3,1)" }}>
            <div className="bg-white rounded-2xl overflow-hidden flex flex-col" style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.16)", maxHeight: "90vh" }}>

              {/* Header */}
              <div className="bg-gradient-to-r from-[#E53935] to-[#FF7043] px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><UtensilsCrossed size={16} className="text-white" /></div>
                  <h2 className="text-[15px] font-bold text-white">Menu Item Details</h2>
                </div>
                <button onClick={closeDialog} className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"><X size={14} className="text-white" /></button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: "none" }}>
                {menuItemDialog.loading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-red-100 animate-spin border-t-[#E53935]" />
                    <p className="text-[13px] text-gray-400">Fetching item details…</p>
                  </div>
                ) : menuItemDialog.item ? (() => {
                  const item = menuItemDialog.item;
                  const hasOffer = item.offer_price && parseFloat(item.offer_price) < parseFloat(item.price);
                  const discount = hasOffer ? Math.round(((parseFloat(item.price) - parseFloat(item.offer_price)) / parseFloat(item.price)) * 100) : 0;
                  return (
                    <>
                      {item.image ? (
                        <div className="relative h-56 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${item.food_type === "VEG" ? "bg-emerald-500" : "bg-red-500"}`}>
                              {item.food_type === "VEG" ? <FaLeaf size={9} /> : <FaDrumstickBite size={9} />}
                              {item.food_type}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                            {item.is_bestseller && <span className="px-2 py-0.5 rounded-full bg-amber-400 text-white text-[10.5px] font-bold">⭐ Bestseller</span>}
                            {item.is_recommended && <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10.5px] font-bold">★ Recommended</span>}
                          </div>
                          <div className="absolute bottom-3 left-4">
                            <h3 className="text-white text-xl font-extrabold drop-shadow-sm">{item.name}</h3>
                          </div>
                        </div>
                      ) : (
                        <div className="h-28 bg-red-50 flex flex-col items-center justify-center">
                          <ImageOff size={32} className="text-red-200 mb-1" />
                          <p className="text-[12px] text-gray-400">No image available</p>
                        </div>
                      )}

                      <div className="p-5 space-y-4">
                        {!item.image && <h3 className="text-xl font-extrabold text-[#E53935]">{item.name}</h3>}

                        {/* Availability + tags */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${item.is_available ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>{item.is_available ? "Available" : "Unavailable"}</span>
                          {item.is_spicy && <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-500">🌶 Spicy</span>}
                          {item.is_customizable && <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600">Customizable</span>}
                          {item.is_fast_delivery && <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-600">⚡ Fast Delivery</span>}
                          {item.preparation_time && <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600">⏱ {item.preparation_time} min</span>}
                        </div>

                        {item.description && (
                          <div className="bg-red-50/50 border border-red-100 rounded-xl p-3.5">
                            <p className="text-[12px] text-gray-400 font-semibold mb-1">Description</p>
                            <p className="text-[13px] text-gray-700 leading-relaxed">{item.description}</p>
                          </div>
                        )}

                        {/* Pricing */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-[11px] font-bold text-[#E53935] uppercase tracking-widest mb-3">Pricing</p>
                          <div className="flex items-center gap-3 mb-3">
                            {hasOffer ? (
                              <>
                                <span className="text-2xl font-extrabold text-[#E53935]">₹{parseFloat(item.offer_price).toFixed(2)}</span>
                                <span className="text-gray-400 line-through text-[14px]">₹{parseFloat(item.price).toFixed(2)}</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">{discount}% OFF</span>
                              </>
                            ) : (
                              <span className="text-2xl font-extrabold text-[#E53935]">₹{parseFloat(item.price).toFixed(2)}</span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: "Tax", value: item.tax_percent ? `${parseFloat(item.tax_percent).toFixed(0)}%` : "—" },
                              { label: "Packaging", value: item.packaging_charge ? `₹${parseFloat(item.packaging_charge).toFixed(2)}` : "—" },
                            ].map((f) => (
                              <div key={f.label} className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                                <p className="text-[10.5px] text-gray-400 font-medium mb-0.5">{f.label}</p>
                                <p className="text-[14px] font-extrabold text-gray-800">{f.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-[11px] font-bold text-[#E53935] uppercase tracking-widest mb-3">Details</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: "Rating", value: item.rating ? `⭐ ${parseFloat(item.rating).toFixed(1)} / 5` : "—" },
                              { label: "Prep Time", value: item.preparation_time ? `${item.preparation_time} min` : "—" },
                              { label: "Total Orders", value: item.total_orders ?? "—" },
                              { label: "Calories", value: item.calories ? `${item.calories} kcal` : "—" },
                              ...(item.available_from && item.available_to ? [{ label: "Hours", value: `${item.available_from?.slice(0, 5)} – ${item.available_to?.slice(0, 5)}` }] : []),
                            ].map((d) => (
                              <div key={d.label} className="bg-white rounded-xl p-3 border border-gray-100">
                                <p className="text-[10.5px] text-gray-400 font-medium mb-0.5">{d.label}</p>
                                <p className="text-[13px] font-bold text-gray-800">{d.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })() : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <ImageOff size={40} className="mb-3 opacity-30" />
                    <p className="text-[13px] font-semibold">Item not found or failed to load.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-gray-50 flex-shrink-0">
                <button onClick={closeDialog} className="w-full py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13px] font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/30 active:scale-95 transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes slideRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes scaleUp { from { opacity:0; transform:translate(-50%,-48%) scale(0.95); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }
      `}</style>
    </div>
  );
};

export default Reviews;