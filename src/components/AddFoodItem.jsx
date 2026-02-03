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
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";
import { IoMdCamera } from "react-icons/io";
import { IoMdRestaurant } from "react-icons/io";
import { FaRegStar } from "react-icons/fa6";
import { FaPepperHot } from "react-icons/fa";

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
  const [preparationTime, setPreparationTime] = useState("");
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

      if (res.data && res.data.data) {
        setMenuItems(res.data.data);
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error("Fetch menu items failed:", error);
      setMenuItems([]);
      setErrorMsg("Failed to fetch menu items");
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
    setPreparationTime("");
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
    if (preparationTime) formData.append("preparation_time", preparationTime);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");

    try {
      const result = await axiosInstance.post(
        `/menuitems/restaurants/${restaurant?.id}/menu-items`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Menu item created =>", result.data);
      setSuccessMsg(result.data.message || "Menu item created successfully!");
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
    if (preparationTime) formData.append("preparation_time", preparationTime);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");

    try {
      const result = await axiosInstance.put(
        `/menuitems/update/menu-items/${editId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMsg(result.data.message || "Menu item updated successfully!");
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
      const result = await axiosInstance.delete(`/menuitems/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMsg(result.data.message || "Menu item deleted successfully");
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

      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/menuitems/viewsingle/${menuItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data;

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
      setPreparationTime(data.preparation_time || "");
      setCurrentImage(data.image || "");
      setImage(null);
      setErrors({});

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

    if (!editId) {
      setSelectedSubCategory("");
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const getSubCategoryName = (subCategoryId) => {
    const subCategory = subCategories?.find((sc) => sc.id === subCategoryId);
    return subCategory?.name || "Unknown";
  };

  if (!restaurant?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fff5f5] to-[#ffecec]">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md">
          <div className="text-center">
            <RestaurantIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
              Restaurant Required
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Please select or load a restaurant first to manage menu items.
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
                <RestaurantIcon sx={{ fontSize: 36, color: "white" }} />
              </div>
              <div>
                <Typography variant="h4" className="font-bold text-white">
                  {editId ? "Edit Menu Item" : "Add New Menu Item"}
                </Typography>
                <Typography variant="body2" className="text-white/90 mt-1">
                  Manage your restaurant's delicious offerings
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
              {/* Category & Sub-Category Selection */}
              <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
                  Category Selection
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small" error={!!errors.category}>
                      <InputLabel
                        sx={{
                          '&.Mui-focused': {
                            color: '#FF5252',
                          },
                        }}
                      >
                        Select Category *
                      </InputLabel>
                      <Select
                        value={selectedCategory}
                        label="Select Category *"
                        onChange={handleCategoryChange}
                        className="bg-white rounded-xl w-[150px]"
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: errors.category ? '#ef4444' : '#e5e7eb',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FF5252',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FF5252',
                            borderWidth: '2px',
                          },
                        }}
                      >
                        {categories?.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.category && (
                        <Typography variant="caption" className="text-red-500 mt-1 ml-1">
                          {errors.category}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small" error={!!errors.subCategory}>
                      <InputLabel
                        sx={{
                          '&.Mui-focused': {
                            color: '#FF5252',
                          },
                        }}
                      >
                        Select Sub-Category *
                      </InputLabel>
                      <Select
                        value={selectedSubCategory}
                        label="Select Sub-Category *"
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        disabled={!selectedCategory}
                        className="bg-white rounded-xl w-[150px]"
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: errors.subCategory ? '#ef4444' : '#e5e7eb',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FF5252',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FF5252',
                            borderWidth: '2px',
                          },
                        }}
                      >
                        {subCategories?.map((sc) => (
                          <MenuItem key={sc.id} value={sc.id}>
                            {sc.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.subCategory && (
                        <Typography variant="caption" className="text-red-500 mt-1 ml-1">
                          {errors.subCategory}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </div>

              {/* Basic Information */}
              <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
                  Basic Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Food Name *"
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
                    <FormControl fullWidth size="small">
                      <InputLabel
                        sx={{
                          '&.Mui-focused': {
                            color: '#FF5252',
                          },
                        }}
                      >
                        Food Type
                      </InputLabel>
                      <Select
                        value={foodType}
                        label="Food Type"
                        onChange={(e) => setFoodType(e.target.value)}
                        className="bg-white rounded-xl"
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FF5252',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FF5252',
                            borderWidth: '2px',
                          },
                        }}
                      >
                        <MenuItem value="VEG"> Veg</MenuItem>
                        <MenuItem value="NON_VEG"> Non-Veg</MenuItem>
                        <MenuItem value="(veg,non-veg) BOTH">Veg & Non-Veg</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      className="bg-white rounded-xl"
                      placeholder="Describe your delicious dish in detail..."
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

              {/* Price Information */}
              <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
                  Pricing Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Price (₹) *"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      fullWidth
                      error={!!errors.price}
                      helperText={errors.price}
                      size="small"
                      inputProps={{ min: 0, step: "0.01" }}
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

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Offer Price (₹)"
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      fullWidth
                      size="small"
                      inputProps={{ min: 0, step: "0.01" }}
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

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Tax Percent (%)"
                      type="number"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(e.target.value)}
                      fullWidth
                      size="small"
                      inputProps={{ min: 0, max: 100, step: "0.01" }}
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

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Packaging Charge (₹)"
                      type="number"
                      value={packagingCharge}
                      onChange={(e) => setPackagingCharge(e.target.value)}
                      fullWidth
                      size="small"
                      inputProps={{ min: 0, step: "0.01" }}
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
                </Grid>
              </div>

              {/* Availability Time & Preparation Time */}
              <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
                  Availability & Timing
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Available From"
                      type="time"
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
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

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Available To"
                      type="time"
                      value={availableTo}
                      onChange={(e) => setAvailableTo(e.target.value)}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
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

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Preparation Time (minutes)"
                      type="number"
                      value={preparationTime}
                      onChange={(e) => setPreparationTime(e.target.value)}
                      fullWidth
                      size="small"
                      inputProps={{ min: 0 }}
                      className="bg-white rounded-xl"
                      InputProps={{
                        startAdornment: <AccessTimeIcon sx={{ mr: 1, color: '#FF5252' }} />,
                      }}
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

              {/* Toggles */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
                  Item Properties
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#FF5252] transition-colors">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#10b981',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#10b981',
                              },
                            }}
                          />
                        }
                        label={<span className="font-medium text-gray-700">Available</span>}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#FF5252] transition-colors">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isBestseller}
                            onChange={(e) => setIsBestseller(e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#fbbf24',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#fbbf24',
                              },
                            }}
                          />
                        }
                        label={
                          <span className="flex items-center gap-2 font-medium text-gray-700">
                            <FaRegStar className="text-yellow-500 text-[18px]" />
                            Bestseller
                          </span>
                        }
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#FF5252] transition-colors">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isCustomizable}
                            onChange={(e) => setIsCustomizable(e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#3b82f6',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#3b82f6',
                              },
                            }}
                          />
                        }
                        label={<span className="font-medium text-gray-700">Customizable</span>}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#FF5252] transition-colors">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isSpicy}
                            onChange={(e) => setIsSpicy(e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#ef4444',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#ef4444',
                              },
                            }}
                          />
                        }
                        label={
                          <span className="flex items-center gap-2 font-medium text-gray-700">
                            <FaPepperHot className="text-red-600 text-[18px]" />
                            Spicy
                          </span>
                        }
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>

              {/* Image Upload */}
              <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
                  Food Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="food-image-upload"
                  className="hidden"
                />
                <label htmlFor="food-image-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#FF5252] transition-all bg-white group">
                    <IoMdCamera className="text-6xl text-gray-400 group-hover:text-[#FF5252] mx-auto mb-3 transition-colors" />
                    <p className="text-gray-600 font-medium mb-1">
                      {image ? "Change Image" : currentImage ? "Update Image" : "Click to Upload Food Image"}
                    </p>
                    <p className="text-sm text-gray-400">
                      Upload a clear food image (PNG, JPG, WEBP)
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
                      if (selectedSubCategory) {
                        fetchMenuItems(selectedSubCategory);
                      }
                    }}
                    className="px-8 py-3.5 border-2 border-[#FF5252] text-[#FF5252] rounded-xl font-semibold text-base hover:bg-[#FF5252] hover:text-white transition-all duration-200 active:scale-95"
                  >
                    Cancel Edit
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSaving || loading}
                  className={`flex-1 px-8 py-3.5 bg-[#FF5252] text-white rounded-xl font-semibold text-base shadow-lg transition-all duration-200 ${isSaving || loading
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
                    "✓ Update Menu Item"
                  ) : (
                    "✓ Create Menu Item"
                  )}
                </button>
              </div>
            </Box>
          </div>
        </div>
      </div>

      {/* ─── MENU ITEMS LIST ─── */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* List Header */}
          <div className="bg-gradient-to-r from-[#FF5252] to-[#e03e3e] px-6 sm:px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Typography
                  variant="h5"
                  className="flex items-center gap-2 font-bold text-white"
                >
                  <IoMdRestaurant className="text-xl" />
                  <span>All Menu Items</span>
                </Typography>
                {selectedCategory && (
                  <Chip
                    label={`${getCategoryName(selectedCategory)}`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                )}
                {selectedSubCategory && (
                  <Chip
                    label={`${getSubCategoryName(selectedSubCategory)}`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.3)",
                      color: "white",
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                )}
              </div>
              {menuItems.length > 0 && (
                <Chip
                  label={`${menuItems.length} Items`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                  }}
                />
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="p-6 sm:p-8">
            {!selectedSubCategory ? (
              <div className="text-center py-16">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 max-w-md mx-auto">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <Typography variant="h6" className="font-bold text-gray-800 mb-2">
                    Select Category & Sub-Category
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Please select a category and sub-category above to view and manage menu items
                  </Typography>
                </div>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <CircularProgress sx={{ color: '#FF5252', mb: 2 }} size={48} />
                <Typography variant="body1" className="text-gray-600">
                  Loading menu items...
                </Typography>
              </div>
            ) : !menuItems?.length ? (
              <div className="text-center py-16">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 max-w-md mx-auto">
                  <svg className="w-16 h-16 text-orange-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <Typography variant="h6" className="font-bold text-gray-800 mb-2">
                    No Menu Items Yet
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Start by adding your first delicious menu item for this sub-category!
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
                          <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Name & Description</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Type</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Price</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Time</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Status</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Tags</TableCell>
                          <TableCell align="right" sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {menuItems.map((item, i) => (
                          <TableRow
                            key={item.id}
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
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
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
                              <div className="font-semibold text-[#FF5252] text-base">{item.name}</div>
                              {item.description && (
                                <div className="text-sm text-gray-600 max-w-xs line-clamp-2 mt-1">{item.description}</div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={item.food_type}
                                size="small"
                                sx={{
                                  bgcolor: item.food_type === "VEG" ? "#10b981" : "#ef4444",
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-bold text-green-700 text-base">₹{item.price}</div>
                              {item.offer_price && (
                                <div className="text-sm">
                                  <span className="text-red-600 font-semibold">₹{item.offer_price}</span>
                                  <span className="text-gray-400 line-through ml-1 text-xs">₹{item.price}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {item.preparation_time ? (
                                <Chip
                                  icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                                  label={`${item.preparation_time} min`}
                                  size="small"
                                  sx={{
                                    bgcolor: "#fbbf24",
                                    color: "white",
                                    fontWeight: 600,
                                  }}
                                />
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={item.is_available ? "Available" : "Unavailable"}
                                size="small"
                                color={item.is_available ? "success" : "default"}
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box className="flex flex-wrap gap-1">
                                {item.is_bestseller && (
                                  <Chip
                                    label="⭐ Best"
                                    size="small"
                                    sx={{ bgcolor: "#fbbf24", color: "white", fontSize: "0.7rem", fontWeight: 600 }}
                                  />
                                )}
                                {item.is_spicy && (
                                  <Chip
                                    label="🌶️ Spicy"
                                    size="small"
                                    color="error"
                                    sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                                  />
                                )}
                                {item.is_customizable && (
                                  <Chip
                                    label="Custom"
                                    size="small"
                                    color="info"
                                    sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={() => handleEdit(item)}
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
                                onClick={() => handleDelete(item.id)}
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
                  {menuItems.map((item, i) => (
                    <div
                      key={item.id}
                      className="border-2 border-red-100 rounded-2xl p-5 bg-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-500 mb-1">#{i + 1}</div>
                          <div className="font-bold text-xl text-[#FF5252] mb-2">{item.name}</div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Chip
                              label={item.food_type}
                              size="small"
                              sx={{
                                bgcolor: item.food_type === "VEG" ? "#10b981" : "#ef4444",
                                color: "white",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            />
                            <Chip
                              label={item.is_available ? "Available" : "Unavailable"}
                              size="small"
                              color={item.is_available ? "success" : "default"}
                              sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                            />
                            {item.preparation_time && (
                              <Chip
                                icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                                label={`${item.preparation_time} min`}
                                size="small"
                                sx={{
                                  bgcolor: "#fbbf24",
                                  color: "white",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 bg-[#fff5f5] text-[#FF5252] rounded-xl hover:bg-[#ffe5e5] transition-colors"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </div>

                      {item.description && (
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl mb-3 border border-gray-100">
                          {item.description}
                        </div>
                      )}

                      <div className="flex justify-between items-center mb-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                        <div>
                          <div className="text-2xl font-bold text-green-700">₹{item.price}</div>
                          {item.offer_price && (
                            <div className="text-sm mt-1">
                              <span className="text-red-600 font-semibold">Offer: ₹{item.offer_price}</span>
                            </div>
                          )}
                        </div>
                        <Box className="flex flex-wrap gap-1 justify-end">
                          {item.is_bestseller && (
                            <Chip
                              label="⭐ Best"
                              size="small"
                              sx={{ bgcolor: "#fbbf24", color: "white", fontSize: "0.7rem", fontWeight: 600 }}
                            />
                          )}
                          {item.is_spicy && (
                            <Chip
                              label="🌶️"
                              size="small"
                              color="error"
                              sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                            />
                          )}
                          {item.is_customizable && (
                            <Chip
                              label="Custom"
                              size="small"
                              color="info"
                              sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                            />
                          )}
                        </Box>
                      </div>

                      {item.image && (
                        <div className="flex justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
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

export default AddFoodItem;