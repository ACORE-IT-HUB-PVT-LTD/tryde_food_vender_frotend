import React, { useContext, useEffect, useState, useRef } from "react";
import { Switch, Pagination, Stack } from "@mui/material";
import { IoMdCamera } from "react-icons/io";
import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";
import {
  Plus, Pencil, Trash2, MoreVertical, Search, X, AlertTriangle,
  CheckCircle2, ImageOff, ChevronDown, FolderTree, Tag, Layers,
} from "lucide-react";

/* ══════════════════════════════════════════ 3-dot Menu ══ */
const ActionMenu = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((p) => !p)}
        className={`h-8 w-8 flex items-center justify-center rounded-xl transition-all duration-200
          ${open ? "bg-red-50 text-[#E53935]" : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"}`}>
        <MoreVertical size={17} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl border border-gray-100 z-50 overflow-hidden"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12)", animation: "menuIn 0.15s ease" }}>
          <button onClick={() => { onEdit(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Pencil size={13} className="text-blue-500" />
            </div>
            Edit
          </button>
          <div className="h-px bg-gray-100 mx-3" />
          <button onClick={() => { onDelete(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-gray-700 hover:bg-red-50 hover:text-[#E53935] transition-colors">
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
              <Trash2 size={13} className="text-[#E53935]" />
            </div>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════ Toast ══ */
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

/* ══════════════════════════════════════════ Delete Modal ══ */
const DeleteModal = ({ open, name, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]" onClick={onCancel} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[160] w-[90%] max-w-sm"
        style={{ animation: "scaleUp 0.22s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.14)" }}>
          <div className="bg-gradient-to-br from-[#E53935] to-[#FF7043] px-6 py-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }} />
            <div className="relative w-12 h-12 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trash2 className="text-white w-5 h-5" />
            </div>
            <h3 className="relative text-base font-bold text-white">Delete Sub-Category</h3>
          </div>
          <div className="p-5">
            <p className="text-gray-600 text-[13.5px] text-center mb-5">
              Delete <span className="font-bold text-gray-800">"{name}"</span>? This cannot be undone.
            </p>
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

/* ══════════════════════════════════════════ Custom Select ══ */
const CustomSelect = ({ value, onChange, options, placeholder, error }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const selected = options.find((o) => o.value === value);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-[13.5px] text-left transition-all duration-200
          ${error ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 hover:bg-white hover:border-[#E53935]/40"}
          ${open ? "bg-white border-[#E53935]/50 ring-2 ring-[#E53935]/10" : ""}`}>
        <span className={selected ? "text-gray-800 font-medium" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-gray-100 z-[300] overflow-auto"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12)", animation: "menuIn 0.15s ease", maxHeight: 240 }}>
          {options.map((opt) => (
            <button key={opt.value} type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors
                ${opt.value === value ? "bg-red-50 text-[#E53935] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════ MAIN ══ */
const SubCategory = () => {
  const { restaurant } = useContext(RestaurantContext);
  const { categories } = useContext(CategoriesContext);

  const [allCategories, setAllCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [displayedSubCategories, setDisplayedSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [paginationMap, setPaginationMap] = useState({});
  const [allPage, setAllPage] = useState(1);
  const ALL_LIMIT = 10;

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (successMsg || errorMsg) {
      const t = setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg, errorMsg]);

  const fetchAllCategoriesUnpaginated = async () => {
    if (!restaurant?.id) return [];
    const token = localStorage.getItem("token");
    try {
      const firstRes = await axiosInstance.get(`/categories/${restaurant.id}`, {
        params: { page: 1, limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = firstRes.data.data || [];
      const pagination = firstRes.data.pagination;
      if (pagination.totalPages <= 1) return data;
      const remainingPages = [];
      for (let p = 2; p <= pagination.totalPages; p++) remainingPages.push(p);
      const moreResults = await Promise.all(
        remainingPages.map((p) =>
          axiosInstance.get(`/categories/${restaurant.id}`, { params: { page: p, limit: 100 }, headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.data.data || []).catch(() => [])
        )
      );
      return [...data, ...moreResults.flat()];
    } catch { return []; }
  };

  const fetchAllSubCategories = async () => {
    setLoading(true);
    try {
      const allCats = await fetchAllCategoriesUnpaginated();
      setAllCategories(allCats);
      if (!allCats.length) { setAllSubCategories([]); setLoading(false); return; }
      const token = localStorage.getItem("token");
      const promises = allCats.map((cat) =>
        axiosInstance.get(`/subcategories/${cat.id}/sub-categories`, { params: { page: 1, limit: 10 }, headers: { Authorization: `Bearer ${token}` } })
          .then((res) => ({ catId: cat.id, data: res.data.data || [], pagination: res.data.pagination }))
          .catch(() => ({ catId: cat.id, data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }))
      );
      const results = await Promise.all(promises);
      const combined = results.flatMap((r) => r.data);
      const newPaginationMap = {};
      results.forEach((r) => { newPaginationMap[r.catId] = r.pagination; });
      setAllSubCategories(combined);
      setPaginationMap(newPaginationMap);
      setAllPage(1);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (restaurant?.id) fetchAllSubCategories(); }, [restaurant?.id]);

  useEffect(() => {
    let filtered = filterCategory === "all"
      ? allSubCategories
      : allSubCategories.filter((sc) => sc.category_id === filterCategory);
    if (search.trim()) filtered = filtered.filter((sc) => sc.name?.toLowerCase().includes(search.toLowerCase()));
    if (filterCategory === "all") {
      const start = (allPage - 1) * ALL_LIMIT;
      setDisplayedSubCategories(filtered.slice(start, start + ALL_LIMIT));
    } else {
      setDisplayedSubCategories(filtered);
    }
  }, [filterCategory, allSubCategories, allPage, search]);

  useEffect(() => { setAllPage(1); }, [filterCategory]);

  const handleCategoryPageChange = async (_, newPage) => {
    if (filterCategory === "all") { setAllPage(newPage); return; }
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axiosInstance.get(`/subcategories/${filterCategory}/sub-categories`, {
        params: { page: newPage, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data || [];
      const pagination = res.data.pagination;
      setAllSubCategories((prev) => [...prev.filter((sc) => sc.category_id !== filterCategory), ...data]);
      setPaginationMap((prev) => ({ ...prev, [filterCategory]: pagination }));
    } catch { }
    finally { setLoading(false); }
  };

  const getCurrentPagination = () => {
    if (filterCategory === "all") {
      let total = search.trim()
        ? allSubCategories.filter((sc) => sc.name?.toLowerCase().includes(search.toLowerCase())).length
        : allSubCategories.length;
      return { page: allPage, totalPages: Math.ceil(total / ALL_LIMIT) || 1, total, limit: ALL_LIMIT };
    }
    return paginationMap[filterCategory] || { page: 1, totalPages: 1, total: 0, limit: 10 };
  };

  const currentPagination = getCurrentPagination();

  const resetForm = () => {
    setName(""); setDescription(""); setSelectedCategory("");
    setImage(null); setCurrentImage(""); setEditId(null); setErrors({}); setMode("add");
  };

  const openAddModal = () => { resetForm(); setOpenModal(true); };

  const handleEdit = async (subcat) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/subcategories/${subcat.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data;
      setName(data.name); setDescription(data.description || ""); setSelectedCategory(data.category_id);
      setCurrentImage(data.image || ""); setImage(null); setEditId(data.id);
      setMode("edit"); setOpenModal(true); setErrors({});
    } catch (err) { setErrorMsg(err?.response?.data?.message || "Failed to load details"); }
  };

  const closeModal = () => { setOpenModal(false); resetForm(); };

  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = "Sub-category name is required";
    if (!selectedCategory) err.category = "Please select a category";
    if (mode === "add" && !image) err.image = "Image is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file); setCurrentImage(URL.createObjectURL(file));
    setErrors((p) => ({ ...p, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { setErrorMsg("Please fix the errors before submitting"); return; }
    setIsSaving(true); setErrorMsg(""); setSuccessMsg("");
    const formData = new FormData();
    formData.append("name", name.trim()); formData.append("description", description.trim());
    if (image) formData.append("image", image);
    const token = localStorage.getItem("token");
    const config = { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } };
    try {
      if (mode === "add") {
        await axiosInstance.post(`/subcategories/${restaurant?.id}/categories/${selectedCategory}/sub-categories`, formData, config);
        setSuccessMsg("Sub-category created successfully!");
      } else {
        await axiosInstance.put(`/subcategories/${editId}`, formData, config);
        setSuccessMsg("Sub-category updated successfully!");
      }
      closeModal();
      await fetchAllSubCategories();
    } catch (err) { setErrorMsg(err?.response?.data?.message || "Something went wrong!"); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/subcategories/${deleteTarget.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSuccessMsg("Sub-category deleted successfully");
      await fetchAllSubCategories();
    } catch (err) { setErrorMsg(err?.response?.data?.message || "Failed to delete"); }
    finally { setDeleteTarget(null); }
  };

  const updateStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const token = localStorage.getItem("token");
    setAllSubCategories((prev) => prev.map((sc) => sc.id === id ? { ...sc, is_active: newStatus } : sc));
    try {
      await axiosInstance.patch(`/subcategories/${id}/status`, { is_active: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
    } catch {
      setAllSubCategories((prev) => prev.map((sc) => sc.id === id ? { ...sc, is_active: currentStatus } : sc));
      setErrorMsg("Failed to update status.");
    }
  };

  const getCategoryName = (catId) =>
    allCategories.find((c) => c.id === catId)?.name ||
    categories?.find((c) => c.id === catId)?.name || "Unknown";

  const modalCategories = (allCategories.length ? allCategories : (categories || []));
  const categoryOptions = modalCategories.map((c) => ({ value: c.id, label: c.name }));
  const filterOptions = [{ value: "all", label: "All Sub-Categories" }, ...categoryOptions];

  if (!restaurant?.id) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-sm text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
          <FolderTree size={28} className="text-[#E53935]" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Restaurant Required</h3>
        <p className="text-[13px] text-gray-400">Please select or load a restaurant first.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      <Toast msg={successMsg} type="success" onClose={() => setSuccessMsg("")} />
      <Toast msg={errorMsg} type="error" onClose={() => setErrorMsg("")} />
      <DeleteModal open={!!deleteTarget} name={deleteTarget?.name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center shadow-md shadow-red-500/25">
              <FolderTree size={20} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sub-Categories</h1>
              </div>
              <p className="text-[12.5px] text-gray-400 ml-3">Organize items within each menu category</p>
            </div>
          </div>
          <button onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043]
              text-white text-[13.5px] font-bold rounded-2xl shadow-md shadow-red-500/30
              hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-200">
            <Plus size={17} strokeWidth={2.5} /> Add Sub-Category
          </button>
        </div>

        {/* ── Stats Bar ── */}
   
        {/* ── Filter + Search Row ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-64 flex-shrink-0">
            <CustomSelect
              value={filterCategory}
              onChange={setFilterCategory}
              options={filterOptions}
              placeholder="Filter by category"
            />
          </div>
          <div className="flex-1 flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm
            focus-within:border-[#E53935]/40 focus-within:shadow-[0_0_0_3px_rgba(229,57,53,0.08)] transition-all duration-200">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Search sub-categories…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[13.5px] text-gray-700 placeholder-gray-400" />
            {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>}
          </div>
          {filterCategory !== "all" && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-[#E53935]/20 rounded-2xl">
              <span className="text-[12.5px] font-semibold text-[#E53935]">{getCategoryName(filterCategory)}</span>
              <button onClick={() => setFilterCategory("all")} className="text-[#E53935]/60 hover:text-[#E53935]"><X size={13} /></button>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-red-100 animate-spin border-t-[#E53935]" />
            <p className="text-[13px] text-gray-400 font-medium">Loading sub-categories…</p>
          </div>
        ) : displayedSubCategories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-5 bg-red-50 rounded-3xl flex items-center justify-center">
              <FolderTree size={36} className="text-[#E53935] opacity-60" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No sub-categories found</h3>
            <p className="text-[13px] text-gray-400 mb-6">
              {filterCategory === "all" ? "Add your first sub-category to get started" : `No sub-categories in "${getCategoryName(filterCategory)}"`}
            </p>
            <button onClick={openAddModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E53935] to-[#FF7043]
                text-white text-[13.5px] font-bold rounded-2xl shadow-md shadow-red-500/30 hover:scale-105 transition-all duration-200">
              <Plus size={17} strokeWidth={2.5} /> Add Sub-Category
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* ── Desktop Table ── */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#E53935] to-[#FF7043]">
                    {["#", "Image", "Name", "Description", "Category", "Status", ""].map((h, i) => (
                      <th key={i} className={`px-5 py-3.5 text-left text-[12px] font-bold text-white uppercase tracking-wider ${i === 6 ? "text-right w-14" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayedSubCategories.map((sc, i) => (
                    <tr key={sc.id} className="hover:bg-red-50/20 transition-colors duration-150 group">
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] font-bold text-gray-400">
                          {filterCategory === "all"
                            ? (allPage - 1) * ALL_LIMIT + i + 1
                            : (currentPagination.page - 1) * currentPagination.limit + i + 1}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {sc.image ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <img src={sc.image} alt={sc.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=?")} />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <ImageOff size={18} className="text-gray-300" />
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[13.5px] font-bold text-gray-800 group-hover:text-[#E53935] transition-colors">{sc.name}</span>
                      </td>
                      <td className="px-5 py-3.5 max-w-[160px]">
                        <span className="text-[12.5px] text-gray-500 truncate block">
                          {sc.description || <em className="text-gray-300 not-italic">No description</em>}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11.5px] font-bold">
                          <Tag size={10} />
                          {getCategoryName(sc.category_id)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={Boolean(sc.is_active)}
                            onChange={() => updateStatus(sc.id, sc.is_active)}
                            size="small"
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": { color: "#E53935" },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#E53935" },
                            }}
                          />
                          <span className={`text-[11.5px] font-bold px-2.5 py-0.5 rounded-full
                            ${sc.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                            {sc.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <ActionMenu
                          onEdit={() => handleEdit(sc)}
                          onDelete={() => setDeleteTarget({ id: sc.id, name: sc.name })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="lg:hidden space-y-3 p-4">
              {displayedSubCategories.map((sc, i) => (
                <div key={sc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-[#E53935]/20 transition-all duration-200">
                  <div className="flex gap-3 p-4">
                    {sc.image ? (
                      <img src={sc.image} alt={sc.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=?")} />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <ImageOff size={18} className="text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-gray-400 block mb-0.5">
                            #{filterCategory === "all"
                              ? (allPage - 1) * ALL_LIMIT + i + 1
                              : (currentPagination.page - 1) * currentPagination.limit + i + 1}
                          </span>
                          <h4 className="text-[14px] font-bold text-gray-900 truncate">{sc.name}</h4>
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10.5px] font-bold">
                            <Tag size={9} />{getCategoryName(sc.category_id)}
                          </span>
                        </div>
                        <ActionMenu
                          onEdit={() => handleEdit(sc)}
                          onDelete={() => setDeleteTarget({ id: sc.id, name: sc.name })}
                        />
                      </div>
                      {sc.description && <p className="text-[12px] text-gray-400 mt-1 line-clamp-2">{sc.description}</p>}
                      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-50">
                        <Switch
                          checked={Boolean(sc.is_active)}
                          onChange={() => updateStatus(sc.id, sc.is_active)}
                          size="small"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": { color: "#E53935" },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#E53935" },
                          }}
                        />
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full
                          ${sc.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                          {sc.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pagination ── */}
            {currentPagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-gray-50 gap-2">
                <p className="text-[12.5px] text-gray-400 font-medium">
                  Showing{" "}
                  <span className="font-bold text-gray-700">
                    {(currentPagination.page - 1) * currentPagination.limit + 1}–{Math.min(currentPagination.page * currentPagination.limit, currentPagination.total)}
                  </span>{" "}of <span className="font-bold text-gray-700">{currentPagination.total}</span> sub-categories
                </p>
                <Stack spacing={2}>
                  <Pagination
                    count={currentPagination.totalPages}
                    page={currentPagination.page}
                    onChange={handleCategoryPageChange}
                    shape="rounded" size="small"
                    sx={{
                      "& .MuiPaginationItem-root.Mui-selected": {
                        bgcolor: "#E53935", color: "white",
                        "&:hover": { bgcolor: "#c62828" },
                      },
                    }}
                  />
                </Stack>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════ ADD/EDIT MODAL ══ */}
      {openModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={closeModal} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[95%] max-w-lg max-h-[90vh] overflow-hidden"
            style={{ animation: "scaleUp 0.22s cubic-bezier(0.16,1,0.3,1)" }}>
            <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.16)" }}>

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#E53935] to-[#FF7043] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <FolderTree size={16} className="text-white" />
                  </div>
                  <h2 className="text-[15px] font-bold text-white">
                    {mode === "add" ? "Add New Sub-Category" : "Edit Sub-Category"}
                  </h2>
                </div>
                <button onClick={closeModal} className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <X size={14} className="text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]" style={{ scrollbarWidth: "none" }}>

                {/* Category Select */}
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">
                    Parent Category <span className="text-[#E53935]">*</span>
                  </label>
                  <CustomSelect
                    value={selectedCategory}
                    onChange={(v) => { setSelectedCategory(v); if (errors.category) setErrors((p) => ({ ...p, category: "" })); }}
                    options={categoryOptions}
                    placeholder="Select a category"
                    error={!!errors.category}
                  />
                  {errors.category && (
                    <p className="text-[12px] text-[#E53935] mt-1 flex items-center gap-1"><AlertTriangle size={11} /> {errors.category}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">
                    Sub-Category Name <span className="text-[#E53935]">*</span>
                  </label>
                  <input type="text" value={name}
                    onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })); }}
                    placeholder="e.g. Veg Starters, Mocktails…"
                    className={`w-full px-4 py-3 rounded-xl border text-[13.5px] outline-none transition-all duration-200
                      ${errors.name ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:bg-white focus:border-[#E53935]/50 focus:ring-2 focus:ring-[#E53935]/10"}`}
                  />
                  {errors.name && (
                    <p className="text-[12px] text-[#E53935] mt-1 flex items-center gap-1"><AlertTriangle size={11} /> {errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    rows={3} placeholder="Optional brief description…"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[13.5px] outline-none resize-none
                      focus:bg-white focus:border-[#E53935]/50 focus:ring-2 focus:ring-[#E53935]/10 transition-all duration-200" />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">
                    Image {mode === "add" && <span className="text-[#E53935]">*</span>}
                  </label>
                  <input type="file" accept="image/*" onChange={handleImageChange} id="subcat-image" hidden />
                  {!currentImage ? (
                    <label htmlFor="subcat-image"
                      className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 group
                        ${errors.image ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-[#E53935]/40 hover:bg-red-50/30"}`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                        ${errors.image ? "bg-red-100" : "bg-gray-100 group-hover:bg-red-100"}`}>
                        <IoMdCamera size={24} className={errors.image ? "text-red-400" : "text-gray-400 group-hover:text-[#E53935]"} />
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] font-semibold text-gray-700">Click to upload image</p>
                        <p className="text-[11.5px] text-gray-400 mt-0.5">PNG, JPG, WEBP supported</p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative inline-block">
                      <img src={currentImage} alt="preview" className="max-h-48 rounded-2xl border border-gray-100 shadow-md object-cover" />
                      <button onClick={() => { setImage(null); setCurrentImage(""); }}
                        className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:text-[#E53935] transition-colors">
                        <X size={13} />
                      </button>
                      <label htmlFor="subcat-image"
                        className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-md text-[11.5px] font-bold text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                        <Pencil size={11} /> Change
                      </label>
                    </div>
                  )}
                  {errors.image && (
                    <p className="text-[12px] text-[#E53935] mt-1.5 flex items-center gap-1"><AlertTriangle size={11} /> {errors.image}</p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-50">
                <button onClick={closeModal} disabled={isSaving}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[13px] font-semibold rounded-xl transition-all duration-200 disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={isSaving}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13px] font-bold rounded-xl
                    shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 active:scale-95 transition-all duration-200 disabled:opacity-70
                    flex items-center justify-center gap-2">
                  {isSaving ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {mode === "add" ? "Creating…" : "Updating…"}</>
                  ) : (mode === "add" ? "Create Sub-Category" : "Save Changes")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes menuIn { from { opacity:0; transform:translateY(-6px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes slideRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes scaleUp { from { opacity:0; transform:translate(-50%,-48%) scale(0.95); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }
      `}</style>
    </div>
  );
};

export default SubCategory;