import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const Category = () => {
  const { restaurant } = useContext(RestaurantContext);
  const { categories, loading: contextLoading, fetchCategories } = useContext(CategoriesContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(""); // for preview & edit
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Auto-hide messages
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  const validate = () => {
    const err = {};
    if (!name.trim()) {
      err.name = "Category name is required";
    }
    if (categoryImage && categoryImage.size > MAX_IMAGE_SIZE) {
      err.image = "Image size must be less than 2MB";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setCategoryImage(null);
    setCurrentImage("");
    setEditId(null);
    setErrors({});
  };

  const handleAdd = async () => {
    if (!validate()) return;
    setIsSaving(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    if (categoryImage) formData.append("categoryImage", categoryImage);

    const token = localStorage.getItem("token");

    try {
      await axiosInstance.post(`/categories/${restaurant?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMsg("Category created successfully!");
      clearForm();
      await fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Add failed:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to create category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setIsSaving(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    if (categoryImage) formData.append("categoryImage", categoryImage);

    const token = localStorage.getItem("token");

    try {
      await axiosInstance.put(`/categories/${editId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMsg("Category updated successfully!");
      clearForm();
      await fetchCategories();
    } catch (error) {
      console.error("Update failed:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to update category");
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
      await fetchCategories();
    } catch (error) {
      console.error("Delete failed:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to delete category");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editId) handleUpdate();
    else handleAdd();
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setDescription(cat.description || "");
    setCurrentImage(cat.categoryImage || ""); // ← FIXED HERE
    setCategoryImage(null);
    setEditId(cat.id);
    setErrors({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCategoryImage(file);
    setCurrentImage(URL.createObjectURL(file));
  };

  if (!restaurant?.id) {
    return <Alert severity="warning">Please select/load a restaurant first</Alert>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 font-['Poppins'] bg-gray-50 min-h-screen">
      {/* ─── FORM ─── */}
      <Paper elevation={3} className="p-6 rounded-2xl shadow-lg">
        <Typography variant="h5" className="mb-6 font-bold text-[#d32f2f]">
          {editId ? "Edit Category" : "Add New Category"}
        </Typography>

        {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg("")}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg("")}>{errorMsg}</Alert>}

        <Box
          component="form"
          onSubmit={handleSave}
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, alignItems: "flex-end" }}
        >
          <TextField
            label="Category Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            size="small"
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            size="small"
          />

          <Box sx={{ minWidth: { xs: "100%", sm: 240 } }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="category-image-upload"
              style={{ display: "none" }}
            />
            <label htmlFor="category-image-upload">
              <Button variant="outlined" component="span" fullWidth>
                {categoryImage ? "Change Image" : "Upload Image"}
              </Button>
            </label>

            {errors.image && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5, display: "block" }}>
                {errors.image}
              </Typography>
            )}

            {currentImage && (
              <Box mt={2}>
                <img
                  src={currentImage}
                  alt="preview"
                  className="h-28 w-auto object-cover rounded-lg border border-gray-300 shadow-md"
                />
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={isSaving || contextLoading}
            sx={{
              bgcolor: "#d32f2f",
              "&:hover": { bgcolor: "#b71c1c" },
              px: 6,
              py: 1.5,
              minWidth: 140,
            }}
          >
            {isSaving ? <CircularProgress size={24} color="inherit" /> : editId ? "Update" : "Create"}
          </Button>
        </Box>
      </Paper>

      {/* ─── CATEGORY LIST ─── */}
      <Paper elevation={3} className="p-6 rounded-2xl shadow-lg">
        <Typography variant="h5" className="mb-6 font-bold text-[#d32f2f]">
          All Categories
        </Typography>

        {contextLoading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : !categories?.length ? (
          <Alert severity="info">No categories created yet</Alert>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#ef5350" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Images</TableCell>
                      <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((cat, i) => (
                      <TableRow key={cat.id} hover>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell>{cat.description || "—"}</TableCell>
                        <TableCell>
                          {cat.categoryImage ? ( // ← FIXED HERE
                            <img
                              src={cat.categoryImage}
                              alt={cat.name}
                              className="h-16 w-16 object-cover rounded-md shadow-md"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/64?text=No+Image";
                              }}
                            />
                          ) : (
                            <span className="text-gray-500 italic">No image</span>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleEdit(cat)} size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(cat.id)} size="small">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {categories.map((cat, i) => (
                <div
                  key={cat.id}
                  className="border border-gray-200 rounded-xl p-4 bg-white shadow-md flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">#{i + 1}</div>
                    <div className="font-semibold text-lg">{cat.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {cat.description || "No description"}
                    </div>
                    {cat.categoryImage && (
                      <img
                        src={cat.categoryImage}
                        alt={cat.name}
                        className="mt-3 h-28 w-28 object-cover rounded-lg border border-gray-200 shadow"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/112?text=No+Image";
                        }}
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <IconButton color="primary" size="small" onClick={() => handleEdit(cat)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDelete(cat.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Paper>
    </div>
  );
};

export default Category;