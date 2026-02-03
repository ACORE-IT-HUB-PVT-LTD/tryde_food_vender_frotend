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
  Grid,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";

import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";
import { IoMdCamera } from "react-icons/io";

const Category = () => {
  const { restaurant } = useContext(RestaurantContext);
  const { categories, loading: contextLoading, fetchCategories } = useContext(CategoriesContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
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
      await fetchCategories();
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
    setCurrentImage(cat.categoryImage || "");
    setCategoryImage(null);
    setEditId(cat.id);
    setErrors({});
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCategoryImage(file);
    setCurrentImage(URL.createObjectURL(file));
  };

  if (!restaurant?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fff5f5] to-[#ffecec]">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md">
          <div className="text-center">
            <CategoryIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
              Restaurant Required
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Please select or load a restaurant first to manage categories.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] to-[#ffecec] font-['Poppins'] p-4 sm:p-6 lg:p-8">
      {/* ─── FORM SECTION ─── */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF5252] to-[#e03e3e] px-6 sm:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <CategoryIcon sx={{ fontSize: 36, color: "white" }} />
              </div>
              <div>
                <Typography variant="h4" className="font-bold text-white">
                  {editId ? "Edit Category" : "Add New Category"}
                </Typography>
                <Typography variant="body2" className="text-white/90 mt-1">
                  Organize your menu with categories
                </Typography>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {successMsg && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-green-800 flex-1">{successMsg}</p>
                <button onClick={() => setSuccessMsg("")} className="text-green-600 hover:text-green-800 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-red-800 flex-1">{errorMsg}</p>
                <button onClick={() => setErrorMsg("")} className="text-red-600 hover:text-red-800 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            <Box component="form" onSubmit={handleSave} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
                  Category Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Category Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name}
                      size="small"
                      className="bg-white rounded-xl"
                      sx={{
                        '& label.Mui-focused': {
                          color: '#FF5252',
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#FF5252',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#FF5252',
                            borderWidth: '2px',
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      className="bg-white rounded-xl"
                      placeholder="Brief description of the category"
                      sx={{
                        '& label.Mui-focused': {
                          color: '#FF5252',
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#FF5252',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#FF5252',
                            borderWidth: '2px',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </div>

              {/* Image Upload */}
              <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
                  Category Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="category-image-upload"
                  className="hidden"
                />
                <label htmlFor="category-image-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#FF5252] transition-all bg-white group">
                    <IoMdCamera className="text-6xl text-gray-400 group-hover:text-[#FF5252] mx-auto mb-3 transition-colors" />
                    <p className="text-gray-600 font-medium mb-1">
                      {categoryImage ? "Change Image" : currentImage ? "Update Image" : "Click to Upload Category Image"}
                    </p>
                    <p className="text-sm text-gray-400">
                      Upload a clear category image (PNG, JPG, WEBP)
                    </p>
                  </div>
                </label>

                {currentImage && (
                  <div className="mt-6 flex justify-center">
                    <div className="relative group">
                      <img
                        src={currentImage}
                        alt="preview"
                        className="h-64 w-auto max-w-full object-cover rounded-2xl border-4 border-[#FF5252] shadow-2xl transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 flex-col sm:flex-row">
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      clearForm();
                      fetchCategories();
                    }}
                    className="px-8 py-3.5 border-2 border-[#FF5252] text-[#FF5252] rounded-xl font-semibold text-base hover:bg-[#FF5252] hover:text-white transition-all duration-200 active:scale-95"
                  >
                    Cancel Edit
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSaving || contextLoading}
                  className={`flex-1 px-8 py-3.5 bg-[#FF5252] text-white rounded-xl font-semibold text-base shadow-lg transition-all duration-200 ${
                    isSaving || contextLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-[#e03e3e] hover:shadow-xl active:scale-95"
                  }`}
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      {editId ? "Updating..." : "Creating..."}
                    </span>
                  ) : editId ? (
                    "✓ Update Category"
                  ) : (
                    "✓ Create Category"
                  )}
                </button>
              </div>
            </Box>
          </div>
        </div>
      </div>

      {/* ─── CATEGORY LIST ─── */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* List Header */}
          <div className="bg-gradient-to-r from-[#FF5252] to-[#e03e3e] px-6 sm:px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Typography variant="h5" className="flex items-center gap-2 font-bold text-white">
                  <CategoryIcon className="text-xl" />
                  <span>All Categories</span>
                </Typography>
              </div>
              {categories.length > 0 && (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Typography variant="body2" className="font-semibold text-white">
                    {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="p-6 sm:p-8">
            {contextLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <CircularProgress sx={{ color: '#FF5252', mb: 2 }} size={48} />
                <Typography variant="body1" className="text-gray-600">
                  Loading categories...
                </Typography>
              </div>
            ) : !categories?.length ? (
              <div className="text-center py-16">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 max-w-md mx-auto">
                  <svg className="w-16 h-16 text-orange-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <Typography variant="h6" className="font-bold text-gray-800 mb-2">
                    No Categories Yet
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Start by adding your first category to organize your menu!
                  </Typography>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <TableContainer className="rounded-2xl border border-gray-200">
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#FF5252" }}>
                          <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>S.No</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Image</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Category Name</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Description</TableCell>
                          <TableCell align="right" sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categories.map((cat, i) => (
                          <TableRow
                            key={cat.id}
                            hover
                            sx={{
                              "&:hover": { bgcolor: "#fff5f5" },
                              transition: 'all 0.2s'
                            }}
                          >
                            <TableCell>
                              <div className="font-semibold text-gray-700">{i + 1}</div>
                            </TableCell>
                            <TableCell>
                              {cat.categoryImage ? (
                                <img
                                  src={cat.categoryImage}
                                  alt={cat.name}
                                  className="h-20 w-20 object-cover rounded-xl shadow-md border-2 border-red-100 transition-transform hover:scale-110"
                                  onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/80?text=No+Image";
                                  }}
                                />
                              ) : (
                                <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-xl border-2 border-gray-200">
                                  <span className="text-gray-400 text-xs">No image</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold text-[#FF5252] text-base">{cat.name}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600 max-w-xs">
                                {cat.description || <span className="italic text-gray-400">No description</span>}
                              </div>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={() => handleEdit(cat)}
                                size="small"
                                sx={{
                                  color: "#FF5252",
                                  bgcolor: '#fff5f5',
                                  "&:hover": { bgcolor: "#ffe5e5" },
                                  mr: 1
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(cat.id)}
                                size="small"
                                sx={{
                                  bgcolor: '#fff5f5',
                                  "&:hover": { bgcolor: "#ffe5e5" },
                                }}
                              >
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
                <div className="lg:hidden space-y-4">
                  {categories.map((cat, i) => (
                    <div
                      key={cat.id}
                      className="border-2 border-red-100 rounded-2xl p-5 bg-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-500 mb-1">#{i + 1}</div>
                          <div className="font-bold text-xl text-[#FF5252] mb-2">{cat.name}</div>
                          {cat.description && (
                            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl mb-3 border border-gray-100">
                              {cat.description}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-2 bg-[#fff5f5] text-[#FF5252] rounded-xl hover:bg-[#ffe5e5] transition-colors"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </div>

                      {cat.categoryImage && (
                        <div className="flex justify-center">
                          <img
                            src={cat.categoryImage}
                            alt={cat.name}
                            className="h-52 w-auto max-w-full object-cover rounded-2xl border-4 border-red-100 shadow-lg"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/200?text=No+Image";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;