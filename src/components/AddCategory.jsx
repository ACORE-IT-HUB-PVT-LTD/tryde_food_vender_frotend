import React, { useContext, useEffect, useState, useRef } from "react";
import {
  CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Switch, Pagination, Stack,
} from "@mui/material";

import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";
import { IoMdCamera } from "react-icons/io";
import {
  Plus, Pencil, Trash2, MoreVertical, Tag, Search,
  ImageOff, CheckCircle2, XCircle, AlertTriangle, X, Layers,
} from "lucide-react";

/* ── 3-dot dropdown per row ── */
const ActionMenu = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`h-8 w-8 flex items-center justify-center rounded-xl transition-all duration-200
          ${open ? "bg-red-50 text-[#E53935]" : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"}`}
      >
        <MoreVertical size={17} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl border border-gray-100 z-50 overflow-hidden"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)", animation: "menuIn 0.15s ease" }}
        >
          <button
            onClick={() => { onEdit(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-gray-700
              hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Pencil size={13} className="text-blue-500" />
            </div>
            Edit Category
          </button>
          <div className="h-px bg-gray-100 mx-3" />
          <button
            onClick={() => { onDelete(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-gray-700
              hover:bg-red-50 hover:text-[#E53935] transition-colors duration-150"
          >
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

/* ── Toast notification ── */
const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const isSuccess = type === "success";
  return (
    <div
      className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border max-w-sm
        ${isSuccess ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-[#E53935]"}`}
      style={{ animation: "slideRight 0.3s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {isSuccess
        ? <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
        : <AlertTriangle size={18} className="text-[#E53935] flex-shrink-0" />
      }
      <p className="text-[13px] font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
        <X size={15} />
      </button>
    </div>
  );
};

/* ── Delete confirm modal ── */
const DeleteConfirmModal = ({ open, catName, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]" onClick={onCancel} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[160] w-[90%] max-w-sm"
        style={{ animation: "scaleUp 0.22s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100"
          style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.14)" }}>
          <div className="bg-gradient-to-br from-[#E53935] to-[#FF7043] px-6 py-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }} />
            <div className="relative w-12 h-12 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trash2 className="text-white w-5 h-5" />
            </div>
            <h3 className="relative text-base font-bold text-white">Delete Category</h3>
          </div>
          <div className="p-5">
            <p className="text-gray-600 text-[13.5px] text-center mb-5">
              Are you sure you want to delete <span className="font-bold text-gray-800">"{catName}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-2.5">
              <button onClick={onCancel}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[13px] font-semibold rounded-xl transition-all duration-200">
                Cancel
              </button>
              <button onClick={onConfirm}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13px] font-semibold rounded-xl
                  hover:shadow-lg hover:shadow-red-500/30 active:scale-95 transition-all duration-200">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const Category = () => {
  const { restaurant } = useContext(RestaurantContext);
  const { categories, pagination, loading: contextLoading, fetchCategories, setCategories } =
    useContext(CategoriesContext);

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

  useEffect(() => {
    if (successMsg || errorMsg) {
      const t = setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg, errorMsg]);

  const resetForm = () => {
    setName(""); setDescription(""); setCategoryImage(null);
    setCurrentImage(""); setEditId(null); setErrors({}); setMode("add");
  };

  const openAddModal = () => { resetForm(); setOpenModal(true); };

  const handleEdit = (cat) => {
    setName(cat.name);
    setDescription(cat.description || "");
    setCurrentImage(cat.categoryImage || "");
    setCategoryImage(null);
    setEditId(cat.id);
    setMode("edit");
    setOpenModal(true);
    setErrors({}); setErrorMsg(""); setSuccessMsg("");
  };

  const closeModal = () => { setOpenModal(false); resetForm(); };

  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = "Category name is required";
    else if (name.trim().length < 2) err.name = "Minimum 2 characters required";
    else if (name.trim().length > 50) err.name = "Maximum 50 characters allowed";
    if (mode === "add" && !categoryImage) err.categoryImage = "Category image is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrors((p) => ({ ...p, categoryImage: "" }));
    setCategoryImage(file);
    setCurrentImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { setErrorMsg("Please fix the errors before submitting"); return; }
    setIsSaving(true); setErrorMsg(""); setSuccessMsg("");
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    if (categoryImage) formData.append("categoryImage", categoryImage);
    const token = localStorage.getItem("token");
    const config = { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } };
    try {
      if (mode === "add") {
        await axiosInstance.post(`/categories/${restaurant?.id}`, formData, config);
        setSuccessMsg("Category created successfully!");
        const newTotal = pagination.total + 1;
        const newTotalPages = Math.ceil(newTotal / pagination.limit);
        closeModal();
        await fetchCategories(newTotalPages);
      } else {
        await axiosInstance.put(`/categories/${editId}`, formData, config);
        setSuccessMsg("Category updated successfully!");
        closeModal();
        await fetchCategories(pagination.page);
      }
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/categories/${deleteTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("Category deleted successfully");
      const remainingOnPage = categories.length - 1;
      const targetPage = remainingOnPage === 0 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
      await fetchCategories(targetPage);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const updateStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const token = localStorage.getItem("token");
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, is_active: newStatus } : c));
    try {
      await axiosInstance.patch(
        `/categories/${id}/status`,
        { is_active: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setCategories((prev) => prev.map((c) => c.id === id ? { ...c, is_active: currentStatus } : c));
      setErrorMsg("Failed to update status. Please try again.");
    }
  };

  const handlePageChange = (_, newPage) => fetchCategories(newPage);

  const filteredCategories = categories.filter(
    (c) => c.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!restaurant?.id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
            <Tag size={28} className="text-[#E53935]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Restaurant Required</h3>
          <p className="text-[13px] text-gray-400">Please select or load a restaurant first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>

      {/* ── Toast ── */}
      <Toast msg={successMsg} type="success" onClose={() => setSuccessMsg("")} />
      <Toast msg={errorMsg} type="error" onClose={() => setErrorMsg("")} />

      {/* ── Delete Confirm ── */}
      <DeleteConfirmModal
        open={!!deleteTarget}
        catName={deleteTarget?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center shadow-md shadow-red-500/25">
              <Layers size={20} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Menu Categories</h1>
              </div>
              <p className="text-[12.5px] text-gray-400 ml-3">Add, edit and organize your menu categories</p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043]
              text-white text-[13.5px] font-bold rounded-2xl shadow-md shadow-red-500/30
              hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Plus size={17} strokeWidth={2.5} />
            Add Category
          </button>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: pagination.total || 0, color: "from-[#E53935] to-[#FF7043]", icon: <Tag size={16} /> },
            { label: "Active", value: categories.filter(c => c.is_active).length, color: "from-emerald-500 to-teal-400", icon: <CheckCircle2 size={16} /> },
            { label: "Inactive", value: categories.filter(c => !c.is_active).length, color: "from-gray-400 to-gray-500", icon: <XCircle size={16} /> },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900 leading-tight">{s.value}</p>
                <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search Bar ── */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm
          focus-within:border-[#E53935]/40 focus-within:shadow-[0_0_0_3px_rgba(229,57,53,0.08)] transition-all duration-200">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[13.5px] text-gray-700 placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          )}
        </div>

        {/* ── Content ── */}
        {contextLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-red-100 animate-spin border-t-[#E53935]" />
            </div>
            <p className="text-[13px] text-gray-400 font-medium">Loading categories…</p>
          </div>
        ) : !categories?.length ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-5 bg-red-50 rounded-3xl flex items-center justify-center">
              <Tag size={36} className="text-[#E53935] opacity-60" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No categories yet</h3>
            <p className="text-[13px] text-gray-400 mb-6">Create your first category to start organizing your menu</p>
            <button onClick={openAddModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E53935] to-[#FF7043]
                text-white text-[13.5px] font-bold rounded-2xl shadow-md shadow-red-500/30
                hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 transition-all duration-200">
              <Plus size={17} strokeWidth={2.5} /> Add Your First Category
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* ── Desktop Table ── */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#E53935] to-[#FF7043]">
                    {["#", "Image", "Name", "Description", "Status", ""].map((h, i) => (
                      <th key={i}
                        className={`px-5 py-3.5 text-left text-[12px] font-bold text-white uppercase tracking-wider
                          ${i === 5 ? "text-right w-14" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCategories.map((cat, i) => (
                    <tr key={cat.id} className="hover:bg-red-50/30 transition-colors duration-150 group">
                      {/* S.No */}
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] font-bold text-gray-400">
                          {(pagination.page - 1) * pagination.limit + i + 1}
                        </span>
                      </td>

                      {/* Image */}
                      <td className="px-5 py-3.5">
                        {cat.categoryImage ? (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <img src={cat.categoryImage} alt={cat.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=?")} />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <ImageOff size={18} className="text-gray-300" />
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-5 py-3.5">
                        <span className="text-[13.5px] font-bold text-gray-800 group-hover:text-[#E53935] transition-colors">
                          {cat.name}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="px-5 py-3.5 max-w-[200px]">
                        <span className="text-[12.5px] text-gray-500 truncate block">
                          {cat.description || <em className="text-gray-300 not-italic">No description</em>}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={Boolean(cat.is_active)}
                            onChange={() => updateStatus(cat.id, cat.is_active)}
                            size="small"
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": { color: "#E53935" },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#E53935" },
                            }}
                          />
                          <span className={`text-[11.5px] font-bold px-2.5 py-0.5 rounded-full
                            ${cat.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                            {cat.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>

                      {/* 3-dot Action */}
                      <td className="px-5 py-3.5 text-right">
                        <ActionMenu
                          onEdit={() => handleEdit(cat)}
                          onDelete={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="lg:hidden space-y-3 p-4">
              {filteredCategories.map((cat, i) => (
                <div key={cat.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-[#E53935]/20 transition-all duration-200">
                  <div className="flex gap-3 p-4">
                    {/* Image */}
                    {cat.categoryImage ? (
                      <img src={cat.categoryImage} alt={cat.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=?")} />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <ImageOff size={18} className="text-gray-300" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-gray-400 block mb-0.5">
                            #{(pagination.page - 1) * pagination.limit + i + 1}
                          </span>
                          <h4 className="text-[14px] font-bold text-gray-900 truncate">{cat.name}</h4>
                          {cat.description && (
                            <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-2">{cat.description}</p>
                          )}
                        </div>
                        <ActionMenu
                          onEdit={() => handleEdit(cat)}
                          onDelete={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                        />
                      </div>

                      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-50">
                        <Switch
                          checked={Boolean(cat.is_active)}
                          onChange={() => updateStatus(cat.id, cat.is_active)}
                          size="small"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": { color: "#E53935" },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#E53935" },
                          }}
                        />
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full
                          ${cat.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                          {cat.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pagination Footer ── */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-gray-50 gap-2">
                <p className="text-[12.5px] text-gray-400 font-medium">
                  Showing{" "}
                  <span className="font-bold text-gray-700">
                    {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>
                  {" "}of <span className="font-bold text-gray-700">{pagination.total}</span> categories
                </p>
                <Stack spacing={2}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    shape="rounded"
                    size="small"
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

      {/* ─── ADD / EDIT MODAL ─── */}
      {openModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={closeModal} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[95%] max-w-lg max-h-[90vh] overflow-hidden"
            style={{ animation: "scaleUp 0.22s cubic-bezier(0.16,1,0.3,1)" }}>
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100"
              style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.16)" }}>

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#E53935] to-[#FF7043] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Tag size={16} className="text-white" />
                  </div>
                  <h2 className="text-[15px] font-bold text-white">
                    {mode === "add" ? "Add New Category" : "Edit Category"}
                  </h2>
                </div>
                <button onClick={closeModal}
                  className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <X size={14} className="text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]" style={{ scrollbarWidth: "none" }}>

                {/* Name */}
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">
                    Category Name <span className="text-[#E53935]">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })); }}
                    placeholder="e.g. Starters, Main Course…"
                    className={`w-full px-4 py-3 rounded-xl border text-[13.5px] outline-none transition-all duration-200
                      ${errors.name
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 bg-gray-50 focus:bg-white focus:border-[#E53935]/50 focus:ring-2 focus:ring-[#E53935]/10"
                      }`}
                  />
                  {errors.name && (
                    <p className="text-[12px] text-[#E53935] mt-1 flex items-center gap-1">
                      <AlertTriangle size={11} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Optional brief description…"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[13.5px] outline-none resize-none
                      focus:bg-white focus:border-[#E53935]/50 focus:ring-2 focus:ring-[#E53935]/10 transition-all duration-200"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">
                    Category Image {mode === "add" && <span className="text-[#E53935]">*</span>}
                  </label>

                  <input type="file" accept="image/*" onChange={handleImageChange} id="category-image" hidden />

                  {!currentImage ? (
                    <label htmlFor="category-image"
                      className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer
                        transition-all duration-200 group
                        ${errors.categoryImage
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-gray-50 hover:border-[#E53935]/40 hover:bg-red-50/30"
                        }`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                        ${errors.categoryImage ? "bg-red-100" : "bg-gray-100 group-hover:bg-red-100"}`}>
                        <IoMdCamera size={24} className={errors.categoryImage ? "text-red-400" : "text-gray-400 group-hover:text-[#E53935]"} />
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] font-semibold text-gray-700">Click to upload image</p>
                        <p className="text-[11.5px] text-gray-400 mt-0.5">PNG, JPG, WEBP supported</p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative inline-block">
                      <img src={currentImage} alt="preview"
                        className="max-h-48 rounded-2xl border border-gray-100 shadow-md object-cover" />
                      <button
                        onClick={() => { setCategoryImage(null); setCurrentImage(""); }}
                        className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center
                          hover:bg-red-50 hover:text-[#E53935] transition-colors"
                      >
                        <X size={13} />
                      </button>
                      <label htmlFor="category-image"
                        className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-md
                          text-[11.5px] font-bold text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                        <Pencil size={11} /> Change
                      </label>
                    </div>
                  )}

                  {errors.categoryImage && (
                    <p className="text-[12px] text-[#E53935] mt-1.5 flex items-center gap-1">
                      <AlertTriangle size={11} /> {errors.categoryImage}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-50">
                <button onClick={closeModal} disabled={isSaving}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[13px] font-semibold rounded-xl transition-all duration-200 disabled:opacity-50">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13px] font-bold rounded-xl
                    shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35
                    active:scale-95 transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {mode === "add" ? "Creating…" : "Updating…"}
                    </>
                  ) : (
                    <>{mode === "add" ? "Create Category" : "Save Changes"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Category;