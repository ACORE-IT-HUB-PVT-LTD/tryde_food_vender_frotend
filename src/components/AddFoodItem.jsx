import React, { useContext, useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Switch, FormControlLabel, Grid,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Pagination, Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import { IoMdCamera, IoMdRestaurant } from "react-icons/io";
import { FaRegStar, FaPepperHot, FaLeaf, FaDrumstickBite, FaBolt } from "react-icons/fa";
import { MdVisibility, MdToggleOn, MdToggleOff } from "react-icons/md";
import {
  UtensilsCrossed, ChefHat, Package, Tag, Clock, Flame,
  BadgeCheck, Star, Zap, Sparkles, Filter, Search,
  CheckCircle2, XCircle, AlertTriangle, X,
} from "lucide-react";

import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";

/* ─────────────── shared input class ─────────────── */
const inputCls =
  "w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2.5 text-[13.5px] text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-[#E53935]/60 focus:ring-2 focus:ring-[#E53935]/10 transition-all duration-200";
const selectCls = inputCls + " cursor-pointer";
const labelCls = "text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1.5 block";

/* ─────────────── Toast ─────────────── */
const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const ok = type === "success";
  return (
    <div
      className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border max-w-sm ${
        ok ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-[#E53935]"
      }`}
      style={{ animation: "slideRight 0.35s cubic-bezier(0.16,1,0.3,1)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
    >
      {ok ? <CheckCircle2 size={17} className="flex-shrink-0" /> : <AlertTriangle size={17} className="flex-shrink-0" />}
      <p className="text-[13px] font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-60 hover:opacity-100"><X size={14} /></button>
    </div>
  );
};

/* ─────────────── Section Title ─────────────── */
const SectionTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.12em] flex items-center gap-1.5">
      {Icon && <Icon size={11} className="text-[#E53935]" />}
      {children}
    </p>
  </div>
);

/* ─────────────── Tag Chip ─────────────── */
const TagChip = ({ label, color, icon }) => (
  <span
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-black text-white"
    style={{ backgroundColor: color }}
  >
    {icon}{label}
  </span>
);

/* ─────────────── Status Toggle Row ─────────────── */
const StatusRow = ({ field, label, description, color, value, onToggle }) => (
  <div
    className="flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200"
    style={{
      borderColor: value ? `${color}60` : "#e5e7eb",
      backgroundColor: value ? `${color}10` : "#f9fafb",
    }}
    onClick={() => onToggle(field)}
  >
    <div>
      <p className="text-[13px] font-bold" style={{ color: value ? color : "#374151" }}>{label}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
    </div>
    <div className="flex items-center gap-2">
      <span
        className="text-[10px] font-black px-2.5 py-1 rounded-lg text-white"
        style={{ backgroundColor: value ? color : "#9ca3af" }}
      >
        {value ? "ON" : "OFF"}
      </span>
      <div style={{ color: value ? color : "#d1d5db" }}>
        {value ? <MdToggleOn size={34} /> : <MdToggleOff size={34} />}
      </div>
    </div>
  </div>
);

/* ─────────────── Menu Item Card (mobile) ─────────────── */
const MenuCard = ({ item, index, pagination, getCategoryName, handleViewDetail, handleOpenStatusModal, handleEdit, handleDelete }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
    {item.image && (
      <div className="relative h-44 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover"
          onError={e => e.target.src = "https://via.placeholder.com/300x200?text=No+Image"} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
          <TagChip
            label={item.food_type}
            color={item.food_type === "VEG" ? "#10b981" : "#ef4444"}
            icon={item.food_type === "VEG" ? <FaLeaf size={9} /> : <FaDrumstickBite size={9} />}
          />
          {item.is_bestseller && <TagChip label="Bestseller" color="#f59e0b" icon="⭐" />}
          {item.is_spicy && <TagChip label="Spicy" color="#ef4444" icon="🌶️" />}
          {item.is_fast_delivery && <TagChip label="Fast" color="#06b6d4" icon={<Zap size={9}/>} />}
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-[10.5px] font-black px-2.5 py-1 rounded-xl text-white ${item.is_available ? "bg-emerald-500" : "bg-gray-400"}`}>
            {item.is_available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
    )}
    <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-[15px] font-black text-gray-900">{item.name}</p>
          <p className="text-[11.5px] text-gray-400 font-medium">{getCategoryName(item.category_id)}</p>
        </div>
        <div className="text-right">
          <p className="text-[16px] font-black text-[#E53935]">₹{item.price}</p>
          {item.offer_price && <p className="text-[11.5px] text-emerald-600 font-bold">Offer ₹{item.offer_price}</p>}
        </div>
      </div>
      {item.description && (
        <p className="text-[12px] text-gray-500 line-clamp-2 mb-3">{item.description}</p>
      )}
      <div className="flex items-center justify-between">
        {item.preparation_time ? (
          <span className="flex items-center gap-1 text-[11.5px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
            <Clock size={11} />{item.preparation_time} min
          </span>
        ) : <span />}
        <div className="flex gap-1">
          <button onClick={() => handleViewDetail(item)} className="p-2 rounded-xl bg-red-50 text-[#E53935] hover:bg-red-100 transition-colors">
            <MdVisibility size={16} />
          </button>
          <button onClick={() => handleOpenStatusModal(item)} className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
            <TuneIcon style={{ fontSize: 16 }} />
          </button>
          <button onClick={() => handleEdit(item)} className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            <EditIcon style={{ fontSize: 16 }} />
          </button>
          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
            <DeleteIcon style={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const AddFoodItem = () => {
  const { restaurant } = useContext(RestaurantContext);
  const { categories } = useContext(CategoriesContext);

  const [allCategories, setAllCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [displayedMenuItems, setDisplayedMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [animateIn, setAnimateIn] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add");

  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [statusItem, setStatusItem] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [statusForm, setStatusForm] = useState({
    is_active: true, is_available: true, is_recommended: false,
    is_bestseller: false, is_fast_delivery: false,
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [foodType, setFoodType] = useState("VEG");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isFastDelivery, setIsFastDelivery] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [taxPercent, setTaxPercent] = useState("");
  const [packagingCharge, setPackagingCharge] = useState("");
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [isSpicy, setIsSpicy] = useState(false);
  const [preparationTime, setPreparationTime] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [calories, setCalories] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (successMsg || errorMsg) {
      const t = setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 5000);
      return () => clearTimeout(t);
    }
  }, [successMsg, errorMsg]);

  const fetchAllCategoriesUnpaginated = async () => {
    if (!restaurant?.id) return;
    const token = localStorage.getItem("token");
    try {
      const first = await axiosInstance.get(`/categories/${restaurant.id}`, {
        params: { page: 1, limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = first.data.data || [];
      const pg = first.data.pagination || {};
      if (!pg.totalPages || pg.totalPages <= 1) { setAllCategories(data); return; }
      const rest = await Promise.all(
        Array.from({ length: pg.totalPages - 1 }, (_, i) =>
          axiosInstance.get(`/categories/${restaurant.id}`, {
            params: { page: i + 2, limit: 100 },
            headers: { Authorization: `Bearer ${token}` },
          }).then(r => r.data.data || []).catch(() => [])
        )
      );
      setAllCategories([...data, ...rest.flat()]);
    } catch {
      setAllCategories(categories || []);
    }
  };

  const fetchAllMenuItems = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/menuitems/${restaurant.id}/menu-items`, {
        params: { page, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllMenuItems(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
    } catch (error) {
      setAllMenuItems([]);
      setErrorMsg(error?.response?.data?.message || error?.message || "Failed to fetch menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant?.id) {
      fetchAllCategoriesUnpaginated();
      fetchAllMenuItems(1);
      setTimeout(() => setAnimateIn(true), 80);
    }
  }, [restaurant?.id]);

  useEffect(() => {
    if (filterCategory === "all") setDisplayedMenuItems(allMenuItems);
    else setDisplayedMenuItems(allMenuItems.filter(item => item.category_id === filterCategory));
  }, [filterCategory, allMenuItems]);

  const fetchSubCategories = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/subcategories/${categoryId}/sub-categories`, {
        params: { page: 1, limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories(res.data.data || res.data || []);
    } catch (error) {
      setSubCategories([]);
      setErrorMsg(error?.response?.data?.message || "Failed to fetch sub-categories.");
    }
  };

  useEffect(() => {
    if (selectedCategory) fetchSubCategories(selectedCategory);
    else { setSubCategories([]); setSelectedSubCategory(""); }
  }, [selectedCategory]);

  const resetForm = () => {
    setName(""); setDescription(""); setSelectedCategory(""); setSelectedSubCategory("");
    setPrice(""); setOfferPrice(""); setFoodType("VEG"); setIsAvailable(true);
    setIsBestseller(false); setIsRecommended(false); setIsFastDelivery(false); setIsActive(true);
    setTaxPercent(""); setPackagingCharge(""); setIsCustomizable(false);
    setAvailableFrom(""); setAvailableTo(""); setIsSpicy(false); setPreparationTime("");
    setStockQuantity(""); setCalories(""); setImage(null); setCurrentImage("");
    setEditId(null); setErrors({}); setMode("add");
  };

  const openAddModal = () => { resetForm(); setOpenModal(true); };
  const closeModal = () => { setOpenModal(false); resetForm(); };

  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = "Food name is required";
    if (!selectedCategory) err.category = "Please select a category";
    if (!selectedSubCategory) err.subCategory = "Please select a sub-category";
    if (!price || Number(price) <= 0) err.price = "Valid price is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setCurrentImage(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { setErrorMsg("Please fix the errors before submitting"); return; }
    if (!image && !currentImage) {
      setErrors({ image: "Image is required" });
      setErrorMsg("Please upload an image before submitting");
      return;
    }
    setIsSaving(true); setErrorMsg(""); setSuccessMsg("");

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("category_id", selectedCategory);
    formData.append("sub_category_id", selectedSubCategory);
    formData.append("price", price);
    if (offerPrice) formData.append("offer_price", offerPrice);
    formData.append("food_type", foodType);
    formData.append("is_available", isAvailable);
    formData.append("is_bestseller", isBestseller);
    formData.append("is_recommended", isRecommended);
    formData.append("is_fast_delivery", isFastDelivery);
    formData.append("is_active", isActive);
    if (taxPercent) formData.append("tax_percent", taxPercent);
    if (packagingCharge) formData.append("packaging_charge", packagingCharge);
    formData.append("is_customizable", isCustomizable);
    if (availableFrom) formData.append("available_from", availableFrom);
    if (availableTo) formData.append("available_to", availableTo);
    formData.append("is_spicy", isSpicy);
    if (preparationTime) formData.append("preparation_time", preparationTime);
    if (stockQuantity) formData.append("stock_quantity", stockQuantity);
    if (calories) formData.append("calories", calories);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");
    const config = { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } };

    try {
      if (mode === "add") {
        await axiosInstance.post(`/menuitems/restaurants/${restaurant?.id}/menu-items`, formData, config);
        setSuccessMsg("Menu item created successfully!");
        const newTotalPages = Math.ceil((pagination.total + 1) / pagination.limit);
        closeModal();
        await fetchAllMenuItems(newTotalPages);
      } else {
        await axiosInstance.put(`/menuitems/update/menu-items/${editId}`, formData, config);
        setSuccessMsg("Menu item updated successfully!");
        closeModal();
        await fetchAllMenuItems(pagination.page);
      }
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || error?.response?.data?.error || "Failed to save menu item.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (menuItem) => {
    try {
      setEditId(menuItem.id);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/menuitems/viewsingle/${menuItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data;
      setName(data.name || ""); setDescription(data.description || "");
      setSelectedCategory(data.category_id || ""); setSelectedSubCategory(data.sub_category_id || "");
      setPrice(data.price || ""); setOfferPrice(data.offer_price || "");
      setFoodType(data.food_type || "VEG"); setIsAvailable(data.is_available ?? true);
      setIsBestseller(data.is_bestseller ?? false); setIsRecommended(data.is_recommended ?? false);
      setIsFastDelivery(data.is_fast_delivery ?? false); setIsActive(data.is_active ?? true);
      setTaxPercent(data.tax_percent || ""); setPackagingCharge(data.packaging_charge || "");
      setIsCustomizable(data.is_customizable ?? false); setAvailableFrom(data.available_from || "");
      setAvailableTo(data.available_to || ""); setIsSpicy(data.is_spicy ?? false);
      setPreparationTime(data.preparation_time || ""); setStockQuantity(data.stock_quantity || "");
      setCalories(data.calories || ""); setCurrentImage(data.image || ""); setImage(null);
      setMode("edit"); setOpenModal(true); setErrors({});
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || error?.message || "Failed to load menu item details.");
    }
  };

  const handleViewDetail = async (menuItem) => {
    setViewLoading(true); setOpenViewModal(true); setViewItem(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/menuitems/viewsingle/${menuItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setViewItem(response.data.data);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || error?.message || "Failed to load item details.");
      setOpenViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  const closeViewModal = () => { setOpenViewModal(false); setViewItem(null); };

  const handleOpenStatusModal = async (menuItem) => {
    setStatusItem(menuItem); setOpenStatusModal(true); setStatusLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/menuitems/viewsingle/${menuItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data;
      setStatusForm({
        is_active: data.is_active ?? true, is_available: data.is_available ?? true,
        is_recommended: data.is_recommended ?? false, is_bestseller: data.is_bestseller ?? false,
        is_fast_delivery: data.is_fast_delivery ?? false,
      });
    } catch {
      setStatusForm({
        is_active: menuItem.is_active ?? true, is_available: menuItem.is_available ?? true,
        is_recommended: menuItem.is_recommended ?? false, is_bestseller: menuItem.is_bestseller ?? false,
        is_fast_delivery: menuItem.is_fast_delivery ?? false,
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const closeStatusModal = () => { setOpenStatusModal(false); setStatusItem(null); };
  const handleStatusToggle = (field) => setStatusForm(prev => ({ ...prev, [field]: !prev[field] }));

  const handleSaveStatus = async () => {
    if (!statusItem) return;
    setIsSavingStatus(true);
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.patch(`/menuitems/${statusItem.id}/statuses`, statusForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("Status updated successfully!");
      closeStatusModal();
      await fetchAllMenuItems(pagination.page);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Failed to update status.");
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const token = localStorage.getItem("token");
      const result = await axiosInstance.delete(`/menuitems/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg(result.data.message || "Menu item deleted successfully");
      const targetPage = allMenuItems.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
      await fetchAllMenuItems(targetPage);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Failed to delete menu item");
    }
  };

  const handlePageChange = (_, newPage) => fetchAllMenuItems(newPage);
  const modalCategories = allCategories.length ? allCategories : (categories || []);
  const getCategoryName = (id) =>
    allCategories.find(c => c.id === id)?.name || categories?.find(c => c.id === id)?.name || "Unknown";
  const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  /* ── No restaurant ── */
  if (!restaurant?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa]"
        style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-10 max-w-sm text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-500/25">
            <ChefHat size={36} className="text-white" />
          </div>
          <h2 className="text-[20px] font-black text-gray-900 mb-2">Restaurant Required</h2>
          <p className="text-[13.5px] text-gray-500 leading-relaxed">Please select or load a restaurant first to manage menu items.</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════ */
  return (
    <div
      className="min-h-screen bg-[#fafafa] p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" }}
    >
      <Toast msg={successMsg} type="success" onClose={() => setSuccessMsg("")} />
      <Toast msg={errorMsg} type="error" onClose={() => setErrorMsg("")} />

      <div
        className="max-w-7xl mx-auto space-y-5"
        style={{
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? "translateY(0)" : "translateY(14px)",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >

        {/* ══════════════════ PAGE HEADER ══════════════════ */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center shadow-lg shadow-red-500/30">
              <ChefHat size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-[22px] font-black text-gray-900 tracking-tight leading-tight">Menu Items</h1>
              <p className="text-[12.5px] text-gray-400 font-medium mt-0.5">Manage your restaurant's menu and availability</p>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13.5px] font-black rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all"
          >
            <AddIcon style={{ fontSize: 18 }} />Add Menu Item
          </button>
        </div>

        {/* ══════════════════ STATS ROW ══════════════════ */}
     

        {/* ══════════════════ FILTER BAR ══════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center">
              <Filter size={14} className="text-white" />
            </div>
            <span className="text-[12px] font-black text-gray-500 uppercase tracking-wider">Filter</span>
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-2 text-[13px] font-semibold text-gray-700 outline-none focus:border-[#E53935]/40 focus:ring-2 focus:ring-[#E53935]/10 transition-all min-w-[200px]"
          >
            <option value="all">All Menu Items</option>
            {modalCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          {filterCategory !== "all" && (
            <span className="flex items-center gap-1.5 bg-red-50 border-2 border-red-100 text-[#E53935] text-[12px] font-black px-3 py-1.5 rounded-xl">
              {getCategoryName(filterCategory)}
              <button onClick={() => setFilterCategory("all")} className="opacity-60 hover:opacity-100 ml-0.5">
                <X size={12} />
              </button>
            </span>
          )}
          <span className="ml-auto text-[12px] font-bold text-gray-400">
            {displayedMenuItems.length} of {pagination.total} items
          </span>
        </div>

        {/* ══════════════════ CONTENT ══════════════════ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-[3px] border-red-100 border-t-[#E53935] animate-spin" />
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center">
                <ChefHat size={14} className="text-white" />
              </div>
            </div>
            <p className="text-[13px] font-bold text-gray-400">Loading menu items…</p>
          </div>
        ) : displayedMenuItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-5">
              <IoMdRestaurant size={40} color="#E53935" opacity={0.4} />
            </div>
            <h3 className="text-[17px] font-black text-gray-700 mb-2">No menu items found</h3>
            <p className="text-[13px] text-gray-400 mb-6">
              {filterCategory === "all" ? "Add your first menu item to get started" : `No items in "${getCategoryName(filterCategory)}"`}
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13.5px] font-black rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all"
            >
              <AddIcon style={{ fontSize: 18 }} />Add Menu Item
            </button>
          </div>
        ) : (
          <>
            {/* ─── Desktop Table ─── */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#E53935] to-[#FF7043]">
                    {["#", "Image", "Name & Description", "Category", "Type", "Price", "Time", "Status", "Tags", "Actions"].map((h, i) => (
                      <th key={h} className={`px-4 py-3.5 text-[11px] font-black text-white uppercase tracking-wider ${i === 9 ? "text-center" : "text-left"} whitespace-nowrap`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayedMenuItems.map((item, i) => (
                    <tr key={item.id} className="border-t border-gray-50 hover:bg-red-50/20 transition-colors duration-150 group">
                      <td className="px-4 py-3 text-[12px] font-bold text-gray-400">
                        {(pagination.page - 1) * pagination.limit + i + 1}
                      </td>
                      <td className="px-4 py-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                            onError={e => e.target.src = "https://via.placeholder.com/80?text=No+Image"} />
                        ) : (
                          <div className="w-16 h-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                            <IoMdRestaurant size={22} color="#d1d5db" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3" style={{ maxWidth: 200 }}>
                        <p className="text-[13.5px] font-black text-gray-900 leading-tight">{item.name}</p>
                        {item.description && (
                          <p className="text-[11.5px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-black">
                          {getCategoryName(item.category_id)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-white text-[11px] font-black ${item.food_type === "VEG" ? "bg-emerald-500" : "bg-red-500"}`}>
                          {item.food_type === "VEG" ? <FaLeaf size={9} /> : <FaDrumstickBite size={9} />}
                          {item.food_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[14px] font-black text-gray-900">₹{item.price}</p>
                        {item.offer_price && (
                          <p className="text-[11px] text-emerald-600 font-bold">₹{item.offer_price} offer</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.preparation_time ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-black">
                            <Clock size={10} />{item.preparation_time}m
                          </span>
                        ) : <span className="text-gray-300 text-[13px]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10.5px] font-black ${item.is_available ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-400"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${item.is_available ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                            {item.is_available ? "Available" : "Unavailable"}
                          </span>
                          {item.is_active === false && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-50 text-red-600 border border-red-200 text-[10.5px] font-black">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />Inactive
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {item.is_bestseller && <TagChip label="Best" color="#f59e0b" icon="⭐" />}
                          {item.is_spicy && <TagChip label="Spicy" color="#ef4444" icon="🌶️" />}
                          {item.is_customizable && <TagChip label="Custom" color="#3b82f6" />}
                          {item.is_recommended && <TagChip label="Rec" color="#8b5cf6" />}
                          {item.is_fast_delivery && <TagChip label="Fast" color="#06b6d4" icon={<Zap size={9}/>} />}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleViewDetail(item)}
                            className="p-2 rounded-xl bg-red-50 text-[#E53935] hover:bg-red-100 transition-colors" title="View">
                            <MdVisibility size={16} />
                          </button>
                          <button onClick={() => handleOpenStatusModal(item)}
                            className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="Status">
                            <TuneIcon style={{ fontSize: 16 }} />
                          </button>
                          <button onClick={() => handleEdit(item)}
                            className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Edit">
                            <EditIcon style={{ fontSize: 16 }} />
                          </button>
                          <button onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete">
                            <DeleteIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ─── Mobile Cards ─── */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayedMenuItems.map((item, i) => (
                <MenuCard key={item.id} item={item} index={i} pagination={pagination}
                  getCategoryName={getCategoryName} handleViewDetail={handleViewDetail}
                  handleOpenStatusModal={handleOpenStatusModal} handleEdit={handleEdit} handleDelete={handleDelete} />
              ))}
            </div>

            {/* ─── Pagination ─── */}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[12.5px] font-semibold text-gray-500">
                  Showing <span className="font-black text-gray-800">{(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-black text-gray-800">{pagination.total}</span> items
                </p>
                <Stack spacing={2}>
                  <Pagination count={pagination.totalPages} page={pagination.page} onChange={handlePageChange} shape="rounded"
                    sx={{ "& .MuiPaginationItem-root.Mui-selected": { bgcolor: "#E53935", color: "white", "&:hover": { bgcolor: "#c62828" } } }} />
                </Stack>
              </div>
            )}
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          STATUS MODAL
      ══════════════════════════════════════════════════════ */}
      <Dialog open={openStatusModal} onClose={closeStatusModal} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden", fontFamily: "'Plus Jakarta Sans',sans-serif" } }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-600 to-purple-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <TuneIcon style={{ color: "white", fontSize: 20 }} />
            </div>
            <div>
              <p className="text-[15px] font-black text-white">Manage Status</p>
              {statusItem && <p className="text-[11.5px] text-white/70 font-medium">{statusItem.name}</p>}
            </div>
          </div>
          <button onClick={closeStatusModal} className="w-8 h-8 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center text-white">
            <X size={15} />
          </button>
        </div>

        <div className="px-5 py-5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {statusLoading ? (
            <div className="flex justify-center py-10">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-[3px] border-purple-100 border-t-purple-500 animate-spin" />
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <StatusRow field="is_active"       label="Active"         description="Visible on the platform"       color="#10b981" value={statusForm.is_active}       onToggle={handleStatusToggle} />
              <StatusRow field="is_available"    label="Available"      description="Can be ordered right now"      color="#E53935" value={statusForm.is_available}    onToggle={handleStatusToggle} />
              <StatusRow field="is_recommended"  label="Recommended"    description="Show in recommended section"   color="#8b5cf6" value={statusForm.is_recommended}  onToggle={handleStatusToggle} />
              <StatusRow field="is_bestseller"   label="Bestseller"     description="Mark as a bestselling item"    color="#f59e0b" value={statusForm.is_bestseller}   onToggle={handleStatusToggle} />
              <StatusRow field="is_fast_delivery" label="Fast Delivery" description="Eligible for fast delivery"   color="#06b6d4" value={statusForm.is_fast_delivery} onToggle={handleStatusToggle} />
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          <button onClick={closeStatusModal} disabled={isSavingStatus}
            className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-[13px] font-bold hover:bg-gray-50 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSaveStatus} disabled={isSavingStatus || statusLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-[13px] font-black rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60">
            {isSavingStatus && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isSavingStatus ? "Saving…" : "Save Status"}
          </button>
        </div>
      </Dialog>

      {/* ══════════════════════════════════════════════════════
          VIEW DETAIL MODAL
      ══════════════════════════════════════════════════════ */}
      <Dialog open={openViewModal} onClose={closeViewModal} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden", fontFamily: "'Plus Jakarta Sans',sans-serif" } }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#E53935] to-[#FF7043]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MdVisibility size={20} color="white" />
            </div>
            <p className="text-[15px] font-black text-white">Menu Item Details</p>
          </div>
          <button onClick={closeViewModal} className="w-8 h-8 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center text-white">
            <X size={15} />
          </button>
        </div>

        <DialogContent sx={{ p: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {viewLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-[3px] border-red-100 border-t-[#E53935] animate-spin" />
                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center">
                  <ChefHat size={14} className="text-white" />
                </div>
              </div>
            </div>
          ) : viewItem ? (
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              {/* Banner image */}
              {viewItem.image ? (
                <div className="relative h-56 overflow-hidden">
                  <img src={viewItem.image} alt={viewItem.name} className="w-full h-full object-cover"
                    onError={e => e.target.src = "https://via.placeholder.com/400x240?text=No+Image"} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                    <TagChip label={viewItem.food_type} color={viewItem.food_type === "VEG" ? "#10b981" : "#ef4444"}
                      icon={viewItem.food_type === "VEG" ? <FaLeaf size={9} /> : <FaDrumstickBite size={9} />} />
                    {viewItem.is_bestseller && <TagChip label="Bestseller" color="#f59e0b" icon="⭐" />}
                    {viewItem.is_recommended && <TagChip label="Recommended" color="#8b5cf6" />}
                    {viewItem.is_fast_delivery && <TagChip label="Fast" color="#06b6d4" icon={<Zap size={9}/>} />}
                  </div>
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                    <span className={`text-[10.5px] font-black px-2.5 py-1 rounded-xl text-white ${viewItem.is_available ? "bg-emerald-500" : "bg-gray-500"}`}>
                      {viewItem.is_available ? "✓ Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-28 bg-gradient-to-r from-[#E53935]/10 to-[#FF7043]/10 flex items-center justify-center">
                  <IoMdRestaurant size={48} color="#E5393560" />
                </div>
              )}

              <div className="px-5 py-5 space-y-4" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {/* Name + price */}
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[22px] font-black text-gray-900 leading-tight">{viewItem.name}</h2>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[22px] font-black text-[#E53935]">₹{viewItem.price}</p>
                    {viewItem.offer_price && <p className="text-[12px] text-emerald-600 font-bold">₹{viewItem.offer_price} offer</p>}
                  </div>
                </div>

                {/* Tag chips */}
                <div className="flex flex-wrap gap-1.5">
                  {viewItem.is_spicy && <TagChip label="Spicy" color="#ef4444" icon="🌶️" />}
                  {viewItem.is_customizable && <TagChip label="Customizable" color="#3b82f6" />}
                  {viewItem.preparation_time && <TagChip label={`${viewItem.preparation_time} min`} color="#f59e0b" icon={<Clock size={9}/>} />}
                  {viewItem.calories && <TagChip label={`${viewItem.calories} cal`} color="#f97316" icon={<Flame size={9}/>} />}
                  {viewItem.stock_quantity != null && <TagChip label={`Stock: ${viewItem.stock_quantity}`} color="#64748b" />}
                </div>

                {/* Description */}
                {viewItem.description && (
                  <div className="bg-red-50/60 border border-red-100 rounded-xl px-4 py-3">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Description</p>
                    <p className="text-[13px] text-gray-700 leading-relaxed">{viewItem.description}</p>
                  </div>
                )}

                {/* Pricing grid */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <SectionTitle icon={Tag}>Pricing</SectionTitle>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Price", value: viewItem.price ? `₹${viewItem.price}` : "—" },
                      { label: "Offer Price", value: viewItem.offer_price ? `₹${viewItem.offer_price}` : "—" },
                      viewItem.tax_percent && { label: "Tax", value: `${viewItem.tax_percent}%` },
                      viewItem.packaging_charge && { label: "Packaging", value: `₹${viewItem.packaging_charge}` },
                    ].filter(Boolean).map(({ label, value }) => (
                      <div key={label} className="bg-white rounded-xl px-3 py-2.5 border border-gray-100 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{label}</p>
                        <p className="text-[15px] font-black text-gray-800 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <SectionTitle icon={Package}>Details</SectionTitle>
                  <div className="space-y-0">
                    {[
                      { label: "Category", value: getCategoryName(viewItem.category_id) },
                      { label: "Food Type", value: viewItem.food_type },
                      viewItem.stock_quantity != null && { label: "Stock", value: viewItem.stock_quantity },
                      viewItem.calories && { label: "Calories", value: `${viewItem.calories} kcal` },
                      (viewItem.available_from || viewItem.available_to) && { label: "Available Hours", value: `${formatTime(viewItem.available_from)} – ${formatTime(viewItem.available_to)}` },
                      viewItem.preparation_time && { label: "Prep Time", value: `${viewItem.preparation_time} min` },
                    ].filter(Boolean).map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-[12px] text-gray-400 font-semibold">{label}</span>
                        <span className="text-[12.5px] font-bold text-gray-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status flags */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <SectionTitle icon={BadgeCheck}>Status Flags</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Active", val: viewItem.is_active, color: "#10b981" },
                      { label: "Available", val: viewItem.is_available, color: "#E53935" },
                      { label: "Recommended", val: viewItem.is_recommended, color: "#8b5cf6" },
                      { label: "Bestseller", val: viewItem.is_bestseller, color: "#f59e0b" },
                      { label: "Fast Delivery", val: viewItem.is_fast_delivery, color: "#06b6d4" },
                      { label: "Spicy", val: viewItem.is_spicy, color: "#ef4444" },
                      { label: "Customizable", val: viewItem.is_customizable, color: "#3b82f6" },
                    ].map(({ label, val, color }) => (
                      <span key={label}
                        className="text-[11px] font-black px-2.5 py-1 rounded-xl text-white"
                        style={{ backgroundColor: val ? color : "#e5e7eb", color: val ? "white" : "#9ca3af" }}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          <button
            onClick={() => { closeViewModal(); if (viewItem) handleEdit(viewItem); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#E53935]/40 text-[#E53935] text-[13px] font-bold hover:bg-red-50 transition-all"
          >
            <EditIcon style={{ fontSize: 16 }} />Edit Item
          </button>
          <button onClick={closeViewModal}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13px] font-black rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all">
            Close
          </button>
        </div>
      </Dialog>

      {/* ══════════════════════════════════════════════════════
          ADD / EDIT MODAL
      ══════════════════════════════════════════════════════ */}
      <Dialog open={openModal} onClose={closeModal} maxWidth="md" fullWidth scroll="paper" keepMounted
        PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden", fontFamily: "'Plus Jakarta Sans',sans-serif" } }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#E53935] to-[#FF7043] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ChefHat size={20} className="text-white" />
            </div>
            <p className="text-[15px] font-black text-white">
              {mode === "add" ? "Add New Menu Item" : "Edit Menu Item"}
            </p>
          </div>
          <button onClick={closeModal} className="w-8 h-8 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center text-white">
            <X size={15} />
          </button>
        </div>

        <DialogContent sx={{ p: 0 }}>
          <div
            className="px-5 py-5 space-y-5 overflow-y-auto"
            style={{ maxHeight: "65vh", scrollbarWidth: "none", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
          >

            {/* Category & Sub-Category */}
            <div>
              <SectionTitle icon={Tag}>Category</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Category *</label>
                  <select
                    value={selectedCategory}
                    onChange={e => { setSelectedCategory(e.target.value); setSelectedSubCategory(""); if (errors.category) setErrors(p => ({ ...p, category: "" })); }}
                    className={selectCls + (errors.category ? " border-red-400" : "")}
                  >
                    <option value="">Select Category</option>
                    {modalCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                  {errors.category && <p className="text-[11.5px] text-red-500 font-semibold mt-1">{errors.category}</p>}
                </div>
                <div>
                  <label className={labelCls}>Sub-Category *</label>
                  <select
                    value={selectedSubCategory}
                    onChange={e => { setSelectedSubCategory(e.target.value); if (errors.subCategory) setErrors(p => ({ ...p, subCategory: "" })); }}
                    disabled={!selectedCategory}
                    className={selectCls + (errors.subCategory ? " border-red-400" : "") + (!selectedCategory ? " opacity-50 cursor-not-allowed" : "")}
                  >
                    <option value="">Select Sub-Category</option>
                    {subCategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                  </select>
                  {errors.subCategory && <p className="text-[11.5px] text-red-500 font-semibold mt-1">{errors.subCategory}</p>}
                </div>
              </div>
            </div>

            {/* Name & Food Type */}
            <div>
              <SectionTitle icon={UtensilsCrossed}>Basic Info</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Food Name *</label>
                  <input
                    type="text" value={name} placeholder="e.g. Paneer Butter Masala"
                    onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: "" })); }}
                    className={inputCls + (errors.name ? " border-red-400" : "")}
                  />
                  {errors.name && <p className="text-[11.5px] text-red-500 font-semibold mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className={labelCls}>Food Type</label>
                  <select value={foodType} onChange={e => setFoodType(e.target.value)} className={selectCls}>
                    <option value="VEG">Veg</option>
                    <option value="NON_VEG">Non-Veg</option>
                    <option value="(veg,non-veg) BOTH">Both</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className={labelCls}>Description</label>
                <textarea
                  value={description} rows={3}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your delicious dish…"
                  className={inputCls + " resize-none"}
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <SectionTitle icon={Tag}>Pricing</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Price (₹) *", key: "price", val: price, set: setPrice, err: errors.price },
                  { label: "Offer Price (₹)", key: "offerPrice", val: offerPrice, set: setOfferPrice },
                  { label: "Tax %", key: "tax", val: taxPercent, set: setTaxPercent },
                  { label: "Packaging (₹)", key: "pack", val: packagingCharge, set: setPackagingCharge },
                ].map(({ label, key, val, set, err }) => (
                  <div key={key}>
                    <label className={labelCls}>{label}</label>
                    <input type="number" value={val} min={0} step="0.01" placeholder="0.00"
                      onChange={e => { set(e.target.value); if (key === "price" && errors.price) setErrors(p => ({ ...p, price: "" })); }}
                      className={inputCls + (err ? " border-red-400" : "")} />
                    {err && <p className="text-[11.5px] text-red-500 font-semibold mt-1">{err}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Timing & Inventory */}
            <div>
              <SectionTitle icon={Clock}>Timing & Inventory</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Available From", type: "time", val: availableFrom, set: setAvailableFrom },
                  { label: "Available To", type: "time", val: availableTo, set: setAvailableTo },
                  { label: "Prep Time (min)", type: "number", val: preparationTime, set: setPreparationTime, placeholder: "e.g. 20" },
                  { label: "Stock Quantity", type: "number", val: stockQuantity, set: setStockQuantity, placeholder: "e.g. 50" },
                  { label: "Calories (kcal)", type: "number", val: calories, set: setCalories, placeholder: "e.g. 350" },
                ].map(({ label, type, val, set, placeholder }) => (
                  <div key={label}>
                    <label className={labelCls}>{label}</label>
                    <input type={type} value={val} placeholder={placeholder || ""}
                      onChange={e => set(e.target.value)}
                      className={inputCls} />
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div>
              <SectionTitle icon={Sparkles}>Item Properties</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {[
                  { label: "Active", state: isActive, setter: setIsActive, color: "#10b981" },
                  { label: "Available", state: isAvailable, setter: setIsAvailable, color: "#E53935" },
                  { label: "Bestseller", state: isBestseller, setter: setIsBestseller, color: "#f59e0b" },
                  { label: "Recommended", state: isRecommended, setter: setIsRecommended, color: "#8b5cf6" },
                  { label: "Customizable", state: isCustomizable, setter: setIsCustomizable, color: "#3b82f6" },
                  { label: "Spicy", state: isSpicy, setter: setIsSpicy, color: "#ef4444" },
                  { label: "Fast Delivery", state: isFastDelivery, setter: setIsFastDelivery, color: "#06b6d4" },
                ].map(({ label, state, setter, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none"
                    style={{ borderColor: state ? `${color}50` : "#e5e7eb", backgroundColor: state ? `${color}0D` : "#f9fafb" }}
                    onClick={() => setter(!state)}
                  >
                    <span className="text-[12px] font-bold" style={{ color: state ? color : "#6b7280" }}>{label}</span>
                    <div style={{ color: state ? color : "#d1d5db" }}>
                      {state ? <MdToggleOn size={26} /> : <MdToggleOff size={26} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <SectionTitle icon={IoMdCamera}>Food Image</SectionTitle>
              <input type="file" accept="image/*" onChange={handleImageChange} id="food-image-upload" className="hidden" />
              <label htmlFor="food-image-upload">
                <div className={`relative border-2 border-dashed rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:border-[#E53935]/60 hover:bg-red-50/30 ${errors.image ? "border-red-400 bg-red-50/20" : "border-gray-200 bg-gray-50/60"}`}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E53935]/10 to-[#FF7043]/10 border border-[#E53935]/20 flex items-center justify-center mb-2">
                    <IoMdCamera size={24} color="#E53935" opacity={0.6} />
                  </div>
                  <p className="text-[13px] font-bold text-gray-500">
                    {image ? "Change image" : currentImage ? "Update image" : "Click to upload food image"}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG up to 5MB</p>
                </div>
              </label>
              {errors.image && <p className="text-[11.5px] text-red-500 font-semibold mt-1.5">{errors.image}</p>}
              {currentImage && (
                <div className="mt-3 relative inline-block">
                  <img src={currentImage} alt="preview" className="max-h-44 max-w-full rounded-2xl object-cover shadow-md border border-gray-100" />
                  <button
                    onClick={() => { setImage(null); setCurrentImage(""); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-xl shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2.5 sticky bottom-0 bg-white" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          <button onClick={closeModal} disabled={isSaving}
            className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-[13px] font-bold hover:bg-gray-50 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isSaving}
            className="flex items-center gap-2 px-7 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13.5px] font-black rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isSaving
              ? (mode === "add" ? "Creating…" : "Updating…")
              : (mode === "add" ? "Create Item" : "Update Item")}
          </button>
        </div>
      </Dialog>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { -webkit-font-smoothing: antialiased; }
        @keyframes slideRight { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        .line-clamp-2 { overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
      `}</style>
    </div>
  );
};

export default AddFoodItem;