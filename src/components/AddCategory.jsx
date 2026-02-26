import React, { useContext, useEffect, useState } from "react";
import {
  Paper, TextField, Button, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Box, Alert, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Switch, Pagination, Stack, Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";
import AddIcon from "@mui/icons-material/Add";

import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";
import { IoMdCamera } from "react-icons/io";

const Category = () => {
  const { restaurant } = useContext(RestaurantContext);
  const { categories, pagination, loading: contextLoading, fetchCategories, setCategories } =
    useContext(CategoriesContext);

  // ─── Modal & form ───
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

  useEffect(() => {
    if (successMsg || errorMsg) {
      const t = setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 5000);
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
    else if (name.trim().length < 2) err.name = "Min 2 characters";
    else if (name.trim().length > 50) err.name = "Max 50 characters";
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
        // Naya item add hone ke baad last page pe jao
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("Category deleted successfully");
      // Agar current page ke last item ko delete kiya aur page > 1 toh prev page pe jao
      const remainingOnPage = categories.length - 1;
      const targetPage = remainingOnPage === 0 && pagination.page > 1
        ? pagination.page - 1
        : pagination.page;
      await fetchCategories(targetPage);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Something went wrong.");
    }
  };

  // Optimistic status toggle
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
      console.error("Failed to update status", err);
      setCategories((prev) => prev.map((c) => c.id === id ? { ...c, is_active: currentStatus } : c));
      setErrorMsg("Failed to update status. Please try again.");
    }
  };

  // Page change — backend ko naya page bhejo
  const handlePageChange = (_, newPage) => {
    fetchCategories(newPage);
  };

  const statusSwitch = (cat) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Switch
        checked={Boolean(cat.is_active)}
        onChange={() => updateStatus(cat.id, cat.is_active)}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: "2563EB" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#2563EB" },
        }}
      />
      <Chip
        label={cat.is_active ? "Active" : "Inactive"}
        size="small"
        sx={{
          bgcolor: cat.is_active ? "#e8f5e9" : "#fce4ec",
          color: cat.is_active ? "#2e7d32" : "#c62828",
          fontWeight: 600, fontSize: "0.7rem",
        }}
      />
    </Box>
  );

  if (!restaurant?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <CategoryIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
          <Typography variant="h5">Restaurant Required</Typography>
          <Typography variant="body1" className="text-gray-600">Please select or load a restaurant first.</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins'] p-4 sm:p-6 lg:p-8">
      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, maxWidth: "lg", mx: "auto" }} onClose={() => setSuccessMsg("")}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: "lg", mx: "auto" }} onClose={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <Typography variant="h4" className="font-bold text-gray-800">Menu Categories</Typography>
            <Typography variant="body2" className="text-gray-600">Add, edit and organize your menu categories</Typography>
          </div>
          <Button
            variant="contained" startIcon={<AddIcon />} onClick={openAddModal}
            sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" }, borderRadius: "12px", px: 4, py: 1.2, fontWeight: 600 }}
          >
            Add Category
          </Button>
        </div>

        {contextLoading ? (
          <div className="flex justify-center items-center py-20">
            <CircularProgress sx={{ color: "#FF5252" }} size={60} />
          </div>
        ) : !categories?.length ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px" }}>
            <CategoryIcon sx={{ fontSize: 80, color: "orange", mb: 2, opacity: 0.6 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>No categories yet</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Create your first category to start organizing your menu</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal}
              sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}>
              Add Your First Category
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: 3 }}>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#FF5252" }}>
                    <TableRow>
                      {["S.No", "Image", "Name", "Description", "Status", "Actions"].map((h, idx) => (
                        <TableCell key={h} align={idx === 5 ? "right" : "left"}
                          sx={{ color: "white", fontWeight: "bold" }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((cat, i) => (
                      <TableRow key={cat.id} hover>
                        {/* S.No — current page ke hisab se */}
                        <TableCell>{(pagination.page - 1) * pagination.limit + i + 1}</TableCell>
                        <TableCell>
                          {cat.categoryImage ? (
                            <img src={cat.categoryImage} alt={cat.name}
                              className="h-16 w-16 object-cover rounded-lg"
                              onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=?")} />
                          ) : (
                            <Box className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">No image</Box>
                          )}
                        </TableCell>
                        <TableCell><Typography fontWeight="medium" color="#FF5252">{cat.name}</Typography></TableCell>
                        <TableCell>{cat.description || <em className="text-gray-400">No description</em>}</TableCell>
                        <TableCell>{statusSwitch(cat)}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(cat)} size="small" color="primary"><EditIcon /></IconButton>
                          <IconButton onClick={() => handleDelete(cat.id)} size="small" color="error"><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {categories.map((cat, i) => (
                <Paper key={cat.id} elevation={2} sx={{ borderRadius: "16px", p: 3 }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography variant="caption" color="text.secondary">
                        {(pagination.page - 1) * pagination.limit + i + 1}
                      </Typography>
                      <Typography variant="h6" color="#FF5252">{cat.name}</Typography>
                      {cat.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{cat.description}</Typography>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <IconButton size="small" onClick={() => handleEdit(cat)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(cat.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </div>
                  </div>
                  {cat.categoryImage && (
                    <img src={cat.categoryImage} alt={cat.name}
                      className="mt-3 h-48 w-full object-cover rounded-xl"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")} />
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, pt: 2, borderTop: "1px solid #f0f0f0" }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    {statusSwitch(cat)}
                  </Box>
                </Paper>
              ))}
            </div>

            {/* ── Pagination Footer ── */}
            {pagination.totalPages > 1 && (
              <Box sx={{
                display: "flex", flexDirection: { xs: "column", sm: "row" },
                alignItems: "center", justifyContent: "space-between",
                px: 3, py: 2, borderTop: "1px solid #f0f0f0", gap: 1,
              }}>
                <Typography variant="body2" color="text.secondary">
                  Showing{" "}
                  <strong>
                    {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}
                  </strong>
                  {" "}of <strong>{pagination.total}</strong> categories
                </Typography>
                <Stack spacing={2}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    shape="rounded"
                    sx={{
                      "& .MuiPaginationItem-root.Mui-selected": {
                        bgcolor: "#FF5252", color: "white",
                        "&:hover": { bgcolor: "#e03e3e" },
                      },
                    }}
                  />
                </Stack>
              </Box>
            )}
          </Paper>
        )}
      </div>

      {/* ─── Modal ─── */}
      <Dialog open={openModal} onClose={closeModal} maxWidth="sm" fullWidth scroll="paper"
        PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}>
        <DialogTitle sx={{ bgcolor: "#FF5252", color: "white", pb: 1 }}>
          <div className="flex items-center gap-3">
            <CategoryIcon />
            <span>{mode === "add" ? "Add New Category" : "Edit Category"}</span>
          </div>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3, maxHeight: "60vh", overflowY: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Category Name *" value={name} fullWidth
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })); }}
              error={!!errors.name} helperText={errors.name}
            />
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)}
              multiline rows={3} fullWidth placeholder="Optional brief description..." />
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Category Image {mode === "add" && <span style={{ color: "red" }}>*</span>}
              </Typography>
              <input type="file" accept="image/*" onChange={handleImageChange} id="category-image" hidden />
              <label htmlFor="category-image">
                <Box sx={{
                  border: `2px dashed ${errors.categoryImage ? "#ef4444" : "#d1d5db"}`,
                  borderRadius: "12px", p: 4, textAlign: "center", cursor: "pointer",
                  bgcolor: "grey.50", "&:hover": { bgcolor: "grey.100", borderColor: "#FF5252" },
                }}>
                  <IoMdCamera size={48} className="mx-auto mb-2 text-gray-400" />
                  <Typography variant="body1" fontWeight="medium">
                    {categoryImage ? "Change image" : currentImage ? "Update image" : "Click to upload image"}
                  </Typography>
                </Box>
              </label>
              {errors.categoryImage && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>{errors.categoryImage}</Typography>
              )}
              {currentImage && (
                <Box sx={{ mt: 3, position: "relative", display: "inline-block" }}>
                  <img src={currentImage} alt="preview"
                    style={{ maxHeight: "180px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
                  <IconButton size="small" color="error"
                    sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white", boxShadow: 1 }}
                    onClick={() => { setCategoryImage(null); setCurrentImage(""); }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </div>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeModal} disabled={isSaving}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isSaving}
            sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}>
            {isSaving ? (mode === "add" ? "Creating..." : "Updating...") : (mode === "add" ? "Create" : "Update")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Category;