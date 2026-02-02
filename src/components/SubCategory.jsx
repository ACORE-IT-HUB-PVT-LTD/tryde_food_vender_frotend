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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";

const SubCategory = () => {
  const { restaurant } = useContext(RestaurantContext);
  const { categories } = useContext(CategoriesContext);

  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState(null);
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

  // Fetch sub-categories when category is selected
  useEffect(() => {
    if (selectedCategory && !editId) {
      fetchSubCategories(selectedCategory);
    }
  }, [selectedCategory]);

  // Fetch sub-categories for a specific category
  const fetchSubCategories = async (categoryId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get(
        `/subcategories/${categoryId}/sub-categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubCategories(res.data);
    } catch (error) {
      console.error("Fetch failed:", error);
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const err = {};
    if (!name.trim()) {
      err.name = "Sub-category name is required";
    }
    if (!selectedCategory) {
      err.category = "Please select a category";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setImage(null);
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
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");

    try {
      await axiosInstance.post(
        `/subcategories/${restaurant?.id}/categories/${selectedCategory}/sub-categories`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMsg("Sub-category created successfully!");
      clearForm();
      await fetchSubCategories(selectedCategory); // Refresh list
    } catch (error) {
      console.error("Add failed:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to create sub-category");
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
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");

    try {
      await axiosInstance.put(`/subcategories/${editId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMsg("Sub-category updated successfully!");
      clearForm();
      await fetchSubCategories(selectedCategory);
    } catch (error) {
      console.error("Update failed:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to update sub-category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub-category?")) return;

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/subcategories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMsg("Sub-category deleted successfully");
      await fetchSubCategories(selectedCategory);
    } catch (error) {
      console.error("Delete failed:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to delete sub-category");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editId) handleUpdate();
    else handleAdd();
  };

  const handleEdit = async (sc) => {
    try {
      setEditId(sc.id);
      
      // Fetch full sub-category details by ID
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/subcategories/${sc.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const subCategoryData = response.data;
      
      setName(subCategoryData.name);
      setDescription(subCategoryData.description || "");
      setSelectedCategory(subCategoryData.category_id);
      setCurrentImage(subCategoryData.image || "");
      setImage(null);
      setErrors({});
    } catch (error) {
      console.error("Failed to fetch sub-category details:", error);
      setErrorMsg("Failed to load sub-category details");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setCurrentImage(URL.createObjectURL(file));
  };

  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    setSelectedCategory(newCategoryId);
    
    // Clear form when changing category (unless editing)
    if (!editId) {
      setName("");
      setDescription("");
      setImage(null);
      setCurrentImage("");
      setErrors({});
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  if (!restaurant?.id) {
    return <Alert severity="warning">Please select/load a restaurant first</Alert>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 font-['Poppins'] bg-gray-50 min-h-screen">
      {/* ─── FORM ─── */}
      <Paper elevation={3} className="p-6 rounded-2xl shadow-lg">
        <Typography variant="h5" className="mb-6 font-bold text-[#d32f2f]">
          {editId ? "Edit Sub-Category" : "Add New Sub-Category"}
        </Typography>

        {successMsg && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg("")}>
            {successMsg}
          </Alert>
        )}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg("")}>
            {errorMsg}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSave}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Category Selection - Full Width */}
          <FormControl fullWidth size="small" error={!!errors.category}>
            <InputLabel>Select Category *</InputLabel>
            <Select
              value={selectedCategory}
              label="Select Category *"
              onChange={handleCategoryChange}
            >
              {categories?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.category}
              </Typography>
            )}
          </FormControl>

          {/* Name and Description Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <TextField
              label="Sub-Category Name *"
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
              multiline
              rows={3}
              size="small"
            />
          </Box>

          {/* Image Upload and Submit Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              alignItems: { md: "flex-start" },
            }}
          >
            {/* Image Upload Section */}
            <Box sx={{ flex: 1 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="subcategory-image-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="subcategory-image-upload">
                <Button 
                  variant="outlined" 
                  component="span" 
                  fullWidth
                  sx={{
                    borderColor: "#d32f2f",
                    color: "#d32f2f",
                    "&:hover": {
                      borderColor: "#b71c1c",
                      bgcolor: "rgba(211, 47, 47, 0.04)",
                    },
                  }}
                >
                  {image ? "Change Image" : currentImage ? "Update Image" : "Upload Image"}
                </Button>
              </label>

              {currentImage && (
                <Box mt={2} className="flex justify-center">
                  <img
                    src={currentImage}
                    alt="preview"
                    className="h-32 w-auto max-w-full object-cover rounded-lg border-2 border-gray-300 shadow-md"
                  />
                </Box>
              )}
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              {editId && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    clearForm();
                    if (selectedCategory) {
                      fetchSubCategories(selectedCategory);
                    }
                  }}
                  sx={{
                    borderColor: "#d32f2f",
                    color: "#d32f2f",
                    px: 4,
                    py: 1.5,
                    minWidth: 120,
                    "&:hover": {
                      borderColor: "#b71c1c",
                      bgcolor: "rgba(211, 47, 47, 0.04)",
                    },
                  }}
                >
                  Cancel
                </Button>
              )}
              
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving || loading}
                sx={{
                  bgcolor: "#d32f2f",
                  "&:hover": { bgcolor: "#b71c1c" },
                  px: 6,
                  py: 1.5,
                  minWidth: 160,
                  height: "fit-content",
                }}
              >
                {isSaving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : editId ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ─── SUB-CATEGORY LIST ─── */}
      <Paper elevation={3} className="p-6 rounded-2xl shadow-lg">
        <Box className="mb-6 flex flex-wrap items-center gap-3">
          <Typography variant="h5" className="font-bold text-[#d32f2f]">
            All Sub-Categories
          </Typography>
          {selectedCategory && (
            <Chip
              label={`Category: ${getCategoryName(selectedCategory)}`}
              size="small"
              sx={{
                bgcolor: "#ef5350",
                color: "white",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            />
          )}
        </Box>

        {!selectedCategory ? (
          <Alert severity="info">Please select a category to view sub-categories</Alert>
        ) : loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : !subCategories?.length ? (
          <Alert severity="info">No sub-categories created yet for this category</Alert>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#ef5350" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold", width: "60px" }}>S.No</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: "150px" }}>Name</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: "200px" }}>Description</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: "120px" }}>Category</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", width: "100px" }}>Image</TableCell>
                      <TableCell align="right" sx={{ color: "white", fontWeight: "bold", width: "120px" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subCategories.map((sc, i) => (
                      <TableRow key={sc.id} hover sx={{ "&:hover": { bgcolor: "#fef2f2" } }}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium" sx={{ color: "#d32f2f" }}>
                          {sc.name}
                        </TableCell>
                        <TableCell>
                          {sc.description ? (
                            <div className="max-w-xs">
                              <div className="text-sm text-gray-700 line-clamp-2">
                                {sc.description}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-sm">No description</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getCategoryName(sc.category_id)} 
                            size="small"
                            sx={{
                              bgcolor: "#ef5350",
                              color: "white",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {sc.image ? (
                            <img
                              src={sc.image}
                              alt={sc.name}
                              className="h-16 w-16 object-cover rounded-md shadow-md border-2 border-gray-200"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/64?text=No+Image";
                              }}
                            />
                          ) : (
                            <span className="text-gray-400 italic text-sm">No image</span>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            onClick={() => handleEdit(sc)} 
                            size="small"
                            sx={{ 
                              color: "#d32f2f",
                              "&:hover": { bgcolor: "#fef2f2" }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(sc.id)} 
                            size="small"
                            sx={{
                              "&:hover": { bgcolor: "#fef2f2" }
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
            <div className="md:hidden space-y-4">
              {subCategories.map((sc, i) => (
                <div
                  key={sc.id}
                  className="border border-gray-200 rounded-xl p-4 bg-white shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">#{i + 1}</div>
                      <div className="font-semibold text-lg text-[#d32f2f]">{sc.name}</div>
                      <Chip
                        label={getCategoryName(sc.category_id)}
                        size="small"
                        sx={{
                          mt: 1,
                          bgcolor: "#ef5350",
                          color: "white",
                          fontSize: "0.75rem",
                        }}
                      />
                    </div>
                    <div className="flex gap-1">
                      <IconButton 
                        color="primary" 
                        size="small" 
                        onClick={() => handleEdit(sc)}
                        sx={{ color: "#d32f2f" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => handleDelete(sc.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                  
                  {sc.description && (
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                      <span className="font-medium text-gray-800">Description: </span>
                      {sc.description}
                    </div>
                  )}
                  
                  {sc.image && (
                    <div className="flex justify-center mt-3">
                      <img
                        src={sc.image}
                        alt={sc.name}
                        className="h-32 w-auto max-w-full object-cover rounded-lg border-2 border-gray-200 shadow-md"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/128?text=No+Image";
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </Paper>
    </div>
  );
};

export default SubCategory;