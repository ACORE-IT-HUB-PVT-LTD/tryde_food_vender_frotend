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
  Switch,
  FormControlLabel,
  Grid,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestaurantIcon from "@mui/icons-material/Restaurant";

import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";

const AddFoodItem = () => {
  const { restaurant } = useContext(RestaurantContext);
  const { categories } = useContext(CategoriesContext);

  const [subCategories, setSubCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [foodType, setFoodType] = useState("VEG");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [taxPercent, setTaxPercent] = useState("");
  const [packagingCharge, setPackagingCharge] = useState("");
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [isSpicy, setIsSpicy] = useState(false);
  const [image, setImage] = useState(null);
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

  // Fetch sub-categories when category is selected
  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    } else {
      setSubCategories([]);
      setSelectedSubCategory("");
    }
  }, [selectedCategory]);

  // Fetch menu items when sub-category is selected
  useEffect(() => {
    if (selectedSubCategory && restaurant?.id) {
      fetchMenuItems(selectedSubCategory);
    }
  }, [selectedSubCategory, restaurant?.id]);

  // Fetch sub-categories for a specific category
  const fetchSubCategories = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/subcategories/${categoryId}/sub-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories(res.data);
    } catch (error) {
      console.error("Fetch sub-categories failed:", error);
      setSubCategories([]);
    }
  };

  // Fetch menu items for a specific sub-category
  const fetchMenuItems = async (subCategoryId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(
        `/menuitems/${restaurant.id}/sub-category/${subCategoryId}/menu-items`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMenuItems(res.data);
    } catch (error) {
      console.error("Fetch menu items failed:", error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = "Food name is required";
    if (!selectedCategory) err.category = "Please select a category";
    if (!selectedSubCategory) err.subCategory = "Please select a sub-category";
    if (!price || Number(price) <= 0) err.price = "Valid price is required";
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setOfferPrice("");
    setFoodType("VEG");
    setIsAvailable(true);
    setIsBestseller(false);
    setTaxPercent("");
    setPackagingCharge("");
    setIsCustomizable(false);
    setAvailableFrom("");
    setAvailableTo("");
    setIsSpicy(false);
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
    formData.append("category_id", selectedCategory);
    formData.append("sub_category_id", selectedSubCategory);
    formData.append("price", price);
    if (offerPrice) formData.append("offer_price", offerPrice);
    formData.append("food_type", foodType);
    formData.append("is_available", isAvailable);
    formData.append("is_bestseller", isBestseller);
    if (taxPercent) formData.append("tax_percent", taxPercent);
    if (packagingCharge) formData.append("packaging_charge", packagingCharge);
    formData.append("is_customizable", isCustomizable);
    if (availableFrom) formData.append("available_from", availableFrom);
    if (availableTo) formData.append("available_to", availableTo);
    formData.append("is_spicy", isSpicy);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");

    try {
      await axiosInstance.post(
        `/menuitems/restaurants/${restaurant?.id}/menu-items`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMsg("Menu item created successfully!");
      clearForm();
      await fetchMenuItems(selectedSubCategory);
    } catch (error) {
      console.error("Add failed:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to create menu item");
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
    formData.append("category_id", selectedCategory);
    formData.append("sub_category_id", selectedSubCategory);
    formData.append("price", price);
    if (offerPrice) formData.append("offer_price", offerPrice);
    formData.append("food_type", foodType);
    formData.append("is_available", isAvailable);
    formData.append("is_bestseller", isBestseller);
    if (taxPercent) formData.append("tax_percent", taxPercent);
    if (packagingCharge) formData.append("packaging_charge", packagingCharge);
    formData.append("is_customizable", isCustomizable);
    if (availableFrom) formData.append("available_from", availableFrom);
    if (availableTo) formData.append("available_to", availableTo);
    formData.append("is_spicy", isSpicy);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");

    try {
      await axiosInstance.put(`/menuitems/update/menu-items/${editId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMsg("Menu item updated successfully!");
      clearForm();
      await fetchMenuItems(selectedSubCategory);
    } catch (error) {
      console.error("Update failed:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to update menu item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/menuitems/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMsg("Menu item deleted successfully");
      await fetchMenuItems(selectedSubCategory);
    } catch (error) {
      console.error("Delete failed:", error);
      setErrorMsg(error?.response?.data?.message || "Failed to delete menu item");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editId) handleUpdate();
    else handleAdd();
  };

  const handleEdit = async (menuItem) => {
    try {
      setEditId(menuItem.id);

      // Fetch full menu item details by ID
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/menuitems/viewsingle/${menuItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      setName(data.name);
      setDescription(data.description || "");
      setSelectedCategory(data.category_id);
      setSelectedSubCategory(data.sub_category_id);
      setPrice(data.price);
      setOfferPrice(data.offer_price || "");
      setFoodType(data.food_type || "VEG");
      setIsAvailable(data.is_available);
      setIsBestseller(data.is_bestseller);
      setTaxPercent(data.tax_percent || "");
      setPackagingCharge(data.packaging_charge || "");
      setIsCustomizable(data.is_customizable);
      setAvailableFrom(data.available_from || "");
      setAvailableTo(data.available_to || "");
      setIsSpicy(data.is_spicy);
      setCurrentImage(data.image || "");
      setImage(null);
      setErrors({});
    } catch (error) {
      console.error("Failed to fetch menu item details:", error);
      setErrorMsg("Failed to load menu item details");
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

    // Clear sub-category and form when changing category (unless editing)
    if (!editId) {
      setSelectedSubCategory("");
      clearForm();
      setSelectedCategory(newCategoryId);
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  // Get sub-category name by ID
  const getSubCategoryName = (subCategoryId) => {
    const subCategory = subCategories?.find((sc) => sc.id === subCategoryId);
    return subCategory?.name || "Unknown";
  };

  if (!restaurant?.id) {
    return <Alert severity="warning">Please select/load a restaurant first</Alert>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 font-['Poppins'] bg-gray-50 min-h-screen">
      {/* ─── FORM ─── */}
      <Paper elevation={3} className="p-6 rounded-2xl shadow-lg">
        <Box className="mb-6 flex items-center gap-3">
          <RestaurantIcon sx={{ fontSize: 32, color: "#ff5252" }} />
          <Typography variant="h5" className="font-bold text-[#ff5252] p-4">
            {editId ? "Edit Menu Item" : "Add New Menu Item"}
          </Typography>
        </Box>

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

        <Box component="form" onSubmit={handleSave}>
          {/* Category & Sub-Category Selection */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small" error={!!errors.category}>
                <InputLabel>Select Category *</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Select Category *"
                  onChange={handleCategoryChange}
                >
                  {categories?.map((cat) =>(
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
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small" error={!!errors.subCategory}>
                <InputLabel>Select Sub-Category *</InputLabel>
                <Select
                  value={selectedSubCategory}
                  label="Select Sub-Category *"
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  disabled={!selectedCategory}
                >
                  {subCategories?.map((sc) => (
                    <MenuItem key={sc.id} value={sc.id}>
                      {sc.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.subCategory && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.subCategory}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>

          {/* Basic Information */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Food Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Food Type</InputLabel>
                <Select value={foodType} label="Food Type" onChange={(e) => setFoodType(e.target.value)}>
                  <MenuItem value="VEG">Veg</MenuItem>
                  <MenuItem value="NON_VEG">Non-Veg</MenuItem>
                  <MenuItem value="(veg,non-veg) BOTH">Veg & Non-Veg</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Description */}
          <Box sx={{ mb: 3 }}>
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

          {/* Price Information */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Price (₹)*"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                error={!!errors.price}
                helperText={errors.price}
                size="small"
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Offer Price (₹)"
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                fullWidth
                size="small"
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Tax Percent (%)"
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                fullWidth
                size="small"
                inputProps={{ min: 0, max: 100, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Packaging Charge (₹)"
                type="number"
                value={packagingCharge}
                onChange={(e) => setPackagingCharge(e.target.value)}
                fullWidth
                size="small"
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
          </Grid>

          {/* Availability Time */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Available From"
                type="time"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Available To"
                type="time"
                value={availableTo}
                onChange={(e) => setAvailableTo(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {/* Toggles */}
          <Box sx={{ mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={<Switch checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />}
                  label="Available"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={<Switch checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} />}
                  label="Bestseller"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={<Switch checked={isCustomizable} onChange={(e) => setIsCustomizable(e.target.checked)} />}
                  label="Customizable"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={<Switch checked={isSpicy} onChange={(e) => setIsSpicy(e.target.checked)} />}
                  label="Spicy"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Image Upload */}
          <Box sx={{ mb: 3 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="food-image-upload"
              style={{ display: "none" }}
            />
            <label htmlFor="food-image-upload">
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
                {image ? "Change Image" : currentImage ? "Update Image" : "Upload Food Image"}
              </Button>
            </label>

            {currentImage && (
              <Box mt={2} className="flex justify-center">
                <img
                  src={currentImage}
                  alt="preview"
                  className="h-48 w-auto max-w-full object-cover rounded-lg border-2 border-gray-300 shadow-md"
                />
              </Box>
            )}
          </Box>

          {/* Submit Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
            {editId && (
              <Button
                variant="outlined"
                onClick={() => {
                  clearForm();
                  if (selectedSubCategory) {
                    fetchMenuItems(selectedSubCategory);
                  }
                }}
                sx={{
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  px: 4,
                  py: 1.5,
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
              fullWidth={!editId}
              sx={{
                bgcolor: "#d32f2f",
                "&:hover": { bgcolor: "#b71c1c" },
                px: 6,
                py: 1.5,
              }}
            >
              {isSaving ? <CircularProgress size={24} color="inherit" /> : editId ? "Update" : "Create Menu Item"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* ─── MENU ITEMS LIST ─── */}
      <Paper elevation={3} className="p-6 rounded-2xl shadow-lg">
        <Box className="mb-6 flex flex-wrap items-center gap-3">
          <Typography variant="h5" className="font-bold text-[#d32f2f]">
            All Menu Items
          </Typography>
          {selectedCategory && (
            <Chip
              label={`Category: ${getCategoryName(selectedCategory)}`}
              size="small"
              sx={{
                bgcolor: "#ef5350",
                color: "white",
                fontWeight: 500,
              }}
            />
          )}
          {selectedSubCategory && (
            <Chip
              label={`Sub-Category: ${getSubCategoryName(selectedSubCategory)}`}
              size="small"
              sx={{
                bgcolor: "#ff7043",
                color: "white",
                fontWeight: 500,
              }}
            />
          )}
        </Box>

        {!selectedSubCategory ? (
          <Alert severity="info">Please select a category and sub-category to view menu items</Alert>
        ) : loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : !menuItems?.length ? (
          <Alert severity="info">No menu items created yet for this sub-category</Alert>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#ef5350" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Image</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Type</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Price</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tags</TableCell>
                      <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {menuItems.map((item, i) => (
                      <TableRow key={item.id} hover sx={{ "&:hover": { bgcolor: "#fef2f2" } }}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16 object-cover rounded-md shadow-md border-2 border-gray-200"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/64?text=No+Image";
                              }}
                            />
                          ) : (
                            <span className="text-gray-400 italic text-sm">No image</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-[#d32f2f]">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-600 max-w-xs line-clamp-2">{item.description}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.food_type}
                            size="small"
                            sx={{
                              bgcolor: item.food_type === "VEG" ? "#4caf50" : "#f44336",
                              color: "white",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-green-700">₹{item.price}</div>
                          {item.offer_price && (
                            <div className="text-xs text-gray-500">
                              Offer: <span className="text-red-600 font-medium">₹{item.offer_price}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.is_available ? "Available" : "Unavailable"}
                            size="small"
                            color={item.is_available ? "success" : "default"}
                          />
                        </TableCell>
                        <TableCell>
                          <Box className="flex flex-wrap gap-1">
                            {item.is_bestseller && (
                              <Chip label="Bestseller" size="small" sx={{ bgcolor: "#ffd700", fontSize: "0.7rem" }} />
                            )}
                            {item.is_spicy && (
                              <Chip label="Spicy" size="small" color="error" sx={{ fontSize: "0.7rem" }} />
                            )}
                            {item.is_customizable && (
                              <Chip label="Customizable" size="small" color="info" sx={{ fontSize: "0.7rem" }} />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleEdit(item)}
                            size="small"
                            sx={{
                              color: "#d32f2f",
                              "&:hover": { bgcolor: "#fef2f2" },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(item.id)}
                            size="small"
                            sx={{
                              "&:hover": { bgcolor: "#fef2f2" },
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
              {menuItems.map((item, i) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">#{i + 1}</div>
                      <div className="font-semibold text-lg text-[#d32f2f]">{item.name}</div>
                      <div className="flex gap-2 mt-2">
                        <Chip
                          label={item.food_type}
                          size="small"
                          sx={{
                            bgcolor: item.food_type === "VEG" ? "#4caf50" : "#f44336",
                            color: "white",
                            fontSize: "0.75rem",
                          }}
                        />
                        <Chip
                          label={item.is_available ? "Available" : "Unavailable"}
                          size="small"
                          color={item.is_available ? "success" : "default"}
                          sx={{ fontSize: "0.75rem" }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(item)}
                        sx={{ color: "#d32f2f" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDelete(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>

                  {item.description && (
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                      {item.description}
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-lg font-bold text-green-700">₹{item.price}</div>
                      {item.offer_price && (
                        <div className="text-sm text-red-600 font-medium">Offer: ₹{item.offer_price}</div>
                      )}
                    </div>
                    <Box className="flex flex-wrap gap-1">
                      {item.is_bestseller && (
                        <Chip label="⭐ Best" size="small" sx={{ bgcolor: "#ffd700", fontSize: "0.7rem" }} />
                      )}
                      {item.is_spicy && (
                        <Chip label="🌶️ Spicy" size="small" color="error" sx={{ fontSize: "0.7rem" }} />
                      )}
                      {item.is_customizable && (
                        <Chip label="Custom" size="small" color="info" sx={{ fontSize: "0.7rem" }} />
                      )}
                    </Box>
                  </div>

                  {item.image && (
                    <div className="flex justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-40 w-auto max-w-full object-cover rounded-lg border-2 border-gray-200 shadow-md"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/160?text=No+Image";
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

export default AddFoodItem