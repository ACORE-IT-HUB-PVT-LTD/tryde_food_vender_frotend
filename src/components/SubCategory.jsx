// // import React, { useContext, useEffect, useState } from "react";
// // import {
// //   Paper,
// //   TextField,
// //   Button,
// //   Typography,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   IconButton,
// //   Box,
// //   Alert,
// //   CircularProgress,
// //   Select,
// //   MenuItem,
// //   FormControl,
// //   InputLabel,
// //   Chip,
// //   Grid,
// // } from "@mui/material";

// // import EditIcon from "@mui/icons-material/Edit";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import CategoryIcon from "@mui/icons-material/Category";
// // import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

// // import axiosInstance from "../api/axiosInstance";
// // import { RestaurantContext } from "../context/getRestaurant";
// // import { CategoriesContext } from "../context/GetAllCategories";
// // import { IoMdCamera } from "react-icons/io";

// // const SubCategory = () => {
// //   const { restaurant } = useContext(RestaurantContext);
// //   const { categories } = useContext(CategoriesContext);

// //   const [subCategories, setSubCategories] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   const [name, setName] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [selectedCategory, setSelectedCategory] = useState("");
// //   const [image, setImage] = useState(null);
// //   const [currentImage, setCurrentImage] = useState("");
// //   const [editId, setEditId] = useState(null);

// //   const [errors, setErrors] = useState({});
// //   const [successMsg, setSuccessMsg] = useState("");
// //   const [errorMsg, setErrorMsg] = useState("");
// //   const [isSaving, setIsSaving] = useState(false);

// //   // Auto-hide messages
// //   useEffect(() => {
// //     if (successMsg || errorMsg) {
// //       const timer = setTimeout(() => {
// //         setSuccessMsg("");
// //         setErrorMsg("");
// //       }, 5000);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [successMsg, errorMsg]);

// //   // Fetch sub-categories when category is selected
// //   useEffect(() => {
// //     if (selectedCategory && !editId) {
// //       fetchSubCategories(selectedCategory);
// //     }
// //   }, [selectedCategory]);

// //   // Fetch sub-categories for a specific category
// //   const fetchSubCategories = async (categoryId) => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem("token");

// //       const res = await axiosInstance.get(
// //         `/subcategories/${categoryId}/sub-categories`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       setSubCategories(res.data);
// //     } catch (error) {
// //       console.error("Fetch failed:", error);
// //       setSubCategories([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const validate = () => {
// //     const err = {};
// //     if (!name.trim()) {
// //       err.name = "Sub-category name is required";
// //     }
// //     if (!selectedCategory) {
// //       err.category = "Please select a category";
// //     }
// //     if (!editId && !image) {
// //       err.image = "Sub-category image is required";
// //     }


// //     setErrors(err);
// //     return Object.keys(err).length === 0;
// //   };

// //   const clearForm = () => {
// //     setName("");
// //     setDescription("");
// //     setImage(null);
// //     setCurrentImage("");
// //     setEditId(null);
// //     setErrors({});
// //   };

// //   const handleAdd = async () => {
// //     if (!validate()) return;
// //     setIsSaving(true);

// //     const formData = new FormData();
// //     formData.append("name", name.trim());
// //     formData.append("description", description.trim());
// //     if (image) formData.append("image", image);

// //     const token = localStorage.getItem("token");

// //     try {
// //       await axiosInstance.post(
// //         `/subcategories/${restaurant?.id}/categories/${selectedCategory}/sub-categories`,
// //         formData,
// //         {
// //           headers: {
// //             "Content-Type": "multipart/form-data",
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       setSuccessMsg("Sub-category created successfully!");
// //       clearForm();
// //       await fetchSubCategories(selectedCategory);
// //     } catch (error) {
// //       console.error("Add failed:", error);
// //       setErrorMsg(error?.response?.data?.message || "Failed to create sub-category");
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   const handleUpdate = async () => {
// //     if (!validate()) return;
// //     setIsSaving(true);

// //     const formData = new FormData();
// //     formData.append("name", name.trim());
// //     formData.append("description", description.trim());
// //     if (image) formData.append("image", image);

// //     const token = localStorage.getItem("token");

// //     try {
// //       await axiosInstance.put(`/subcategories/${editId}`, formData, {
// //         headers: {
// //           "Content-Type": "multipart/form-data",
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       setSuccessMsg("Sub-category updated successfully!");
// //       clearForm();
// //       await fetchSubCategories(selectedCategory);
// //     } catch (error) {
// //       console.error("Update failed:", error);
// //       setErrorMsg(error?.response?.data?.message || "Failed to update sub-category");
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this sub-category?")) return;

// //     try {
// //       const token = localStorage.getItem("token");
// //       await axiosInstance.delete(`/subcategories/${id}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       setSuccessMsg("Sub-category deleted successfully");
// //       await fetchSubCategories(selectedCategory);
// //     } catch (error) {
// //       console.error("Delete failed:", error);
// //       setErrorMsg(error?.response?.data?.message || "Failed to delete sub-category");
// //     }
// //   };

// //   const handleSave = (e) => {
// //     e.preventDefault();
// //     if (editId) handleUpdate();
// //     else handleAdd();
// //   };

// //   const handleEdit = async (sc) => {
// //     try {
// //       setEditId(sc.id);

// //       const token = localStorage.getItem("token");
// //       const response = await axiosInstance.get(`/subcategories/${sc.id}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       const subCategoryData = response.data;

// //       setName(subCategoryData.name);
// //       setDescription(subCategoryData.description || "");
// //       setSelectedCategory(subCategoryData.category_id);
// //       setCurrentImage(subCategoryData.image || "");
// //       setImage(null);
// //       setErrors({});

// //       // Scroll to top smoothly
// //       window.scrollTo({ top: 0, behavior: 'smooth' });
// //     } catch (error) {
// //       console.error("Failed to fetch sub-category details:", error);
// //       setErrorMsg("Failed to load sub-category details");
// //     }
// //   };

// //   const handleImageChange = (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     setImage(file);
// //     setCurrentImage(URL.createObjectURL(file));
// //   };

// //   const handleCategoryChange = (e) => {
// //     const newCategoryId = e.target.value;
// //     setSelectedCategory(newCategoryId);

// //     if (!editId) {
// //       setName("");
// //       setDescription("");
// //       setImage(null);
// //       setCurrentImage("");
// //       setErrors({});
// //     }
// //   };

// //   const getCategoryName = (categoryId) => {
// //     const category = categories?.find((c) => c.id === categoryId);
// //     return category?.name || "Unknown";
// //   };

// //   if (!restaurant?.id) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fff5f5] to-[#ffecec]">
// //         <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md">
// //           <div className="text-center">
// //             <SubdirectoryArrowRightIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
// //             <Typography variant="h5" className="font-bold text-gray-800 mb-2">
// //               Restaurant Required
// //             </Typography>
// //             <Typography variant="body1" className="text-gray-600">
// //               Please select or load a restaurant first to manage sub-categories.
// //             </Typography>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] to-[#ffecec] font-['Poppins'] p-4 sm:p-6 lg:p-8">
// //       {/* ─── FORM SECTION ─── */}
// //       <div className="max-w-7xl mx-auto mb-8">
// //         <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
// //           {/* Header */}
// //           <div className="bg-gradient-to-r from-[#FF5252] to-[#e03e3e] px-6 sm:px-8 py-6">
// //             <div className="flex items-center gap-4">
// //               <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
// //                 <SubdirectoryArrowRightIcon sx={{ fontSize: 36, color: "white" }} />
// //               </div>
// //               <div>
// //                 <Typography variant="h4" className="font-bold text-white">
// //                   {editId ? "Edit Sub-Category" : "Add New Sub-Category"}
// //                 </Typography>
// //                 <Typography variant="body2" className="text-white/90 mt-1">
// //                   Create sub-categories under main categories
// //                 </Typography>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Form Content */}
// //           <div className="p-6 sm:p-8">
// //             {successMsg && (
// //               <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
// //                 <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
// //                   <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
// //                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
// //                   </svg>
// //                 </div>
// //                 <p className="text-sm font-medium text-green-800 flex-1">{successMsg}</p>
// //                 <button onClick={() => setSuccessMsg("")} className="text-green-600 hover:text-green-800 transition">
// //                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// //                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// //                   </svg>
// //                 </button>
// //               </div>
// //             )}

// //             {errorMsg && (
// //               <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
// //                 <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
// //                   <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
// //                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //                   </svg>
// //                 </div>
// //                 <p className="text-sm font-medium text-red-800 flex-1">{errorMsg}</p>
// //                 <button onClick={() => setErrorMsg("")} className="text-red-600 hover:text-red-800 transition">
// //                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// //                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// //                   </svg>
// //                 </button>
// //               </div>
// //             )}

// //             <Box component="form" onSubmit={handleSave} className="space-y-6">
// //               {/* Category Selection */}
// //               <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
// //                 <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
// //                   <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
// //                   Category
// //                 </Typography>
// //                 <FormControl fullWidth size="small" error={!!errors.category}>
// //                   <InputLabel
// //                     sx={{
// //                       '&.Mui-focused': {
// //                         color: '#FF5252',
// //                       },
// //                     }}
// //                   >
// //                     Select Category *
// //                   </InputLabel>
// //                   <Select
// //                     value={selectedCategory}
// //                     label="Select Category *"
// //                     onChange={handleCategoryChange}
// //                     className="bg-white rounded-xl]"
// //                     sx={{
// //                       '& .MuiOutlinedInput-notchedOutline': {
// //                         borderColor: errors.category ? '#ef4444' : '#e5e7eb',
// //                       },
// //                       '&:hover .MuiOutlinedInput-notchedOutline': {
// //                         borderColor: '#FF5252',
// //                       },
// //                       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
// //                         borderColor: '#FF5252',
// //                         borderWidth: '2px',
// //                       },
// //                     }}
// //                   >
// //                     {categories?.map((cat) => (
// //                       <MenuItem key={cat.id} value={cat.id}>
// //                         {cat.name}
// //                       </MenuItem>
// //                     ))}
// //                   </Select>
// //                   {errors.category && (
// //                     <Typography variant="caption" className="text-red-500 mt-1 ml-1">
// //                       {errors.category}
// //                     </Typography>
// //                   )}
// //                 </FormControl>
// //               </div>

// //               {/* Basic Information */}
// //               <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
// //                 <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
// //                   <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
// //                   Sub-Category Information
// //                 </Typography>
// //                 <Grid container spacing={3}>
// //                   <Grid item xs={12} md={6}>
// //                     <TextField
// //                       label="Sub-Category Name *"
// //                       value={name}
// //                       onChange={(e) => setName(e.target.value)}
// //                       fullWidth
// //                       error={!!errors.name}
// //                       helperText={errors.name}
// //                       size="small"
// //                       className="bg-white rounded-xl"
// //                       sx={{
// //                         '& label.Mui-focused': {
// //                           color: '#FF5252',
// //                         },
// //                         '& .MuiOutlinedInput-root': {
// //                           borderRadius: '12px',
// //                           '& fieldset': {
// //                             borderColor: '#e5e7eb',
// //                           },
// //                           '&:hover fieldset': {
// //                             borderColor: '#FF5252',
// //                           },
// //                           '&.Mui-focused fieldset': {
// //                             borderColor: '#FF5252',
// //                             borderWidth: '2px',
// //                           },
// //                         },
// //                       }}
// //                     />
// //                   </Grid>

// //                   <Grid item xs={12} md={6}>
// //                     <TextField
// //                       label="Description"
// //                       value={description}
// //                       onChange={(e) => setDescription(e.target.value)}
// //                       fullWidth
// //                       size="small"
// //                       multiline
// //                       rows={3}
// //                       className="bg-white rounded-xl"
// //                       placeholder="Brief description of the sub-category"
// //                       sx={{
// //                         '& label.Mui-focused': {
// //                           color: '#FF5252',
// //                         },
// //                         '& .MuiOutlinedInput-root': {
// //                           borderRadius: '12px',
// //                           '& fieldset': {
// //                             borderColor: '#e5e7eb',
// //                           },
// //                           '&:hover fieldset': {
// //                             borderColor: '#FF5252',
// //                           },
// //                           '&.Mui-focused fieldset': {
// //                             borderColor: '#FF5252',
// //                             borderWidth: '2px',
// //                           },
// //                         },
// //                       }}
// //                     />
// //                   </Grid>
// //                 </Grid>
// //               </div>

// //               {/* Image Upload */}
// //               <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
// //                 <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
// //                   <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
// //                   Sub-Category Image
// //                 </Typography>
// //                 <input
// //                   type="file"
// //                   accept="image/*"
// //                   onChange={handleImageChange}
// //                   id="subcategory-image-upload"
// //                   className="hidden"
// //                 />
// //                 <label htmlFor="subcategory-image-upload" className="cursor-pointer">
// //                   <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#FF5252] transition-all bg-white group">
// //                     <IoMdCamera className="text-6xl text-gray-400 group-hover:text-[#FF5252] mx-auto mb-3 transition-colors" />
// //                     <p className="text-gray-600 font-medium mb-1">
// //                       {image ? "Change Image" : currentImage ? "Update Image" : "Click to Upload Sub-Category Image"}
// //                     </p>
// //                     <p className="text-sm text-gray-400">
// //                       Upload a clear sub-category image (PNG, JPG, WEBP)
// //                     </p>
// //                   </div>
// //                 </label>
// //                 {/*  IMAGE ERROR MESSAGE */}
// //                 {errors.image && (
// //                   <Typography variant="caption" className="text-red-500 mt-2 block">
// //                     {errors.image}
// //                   </Typography>
// //                 )}

// //                 {currentImage && (
// //                   <div className="mt-6 flex justify-center">
// //                     <div className="relative group">
// //                       <img
// //                         src={currentImage}
// //                         alt="preview"
// //                         className="h-64 w-auto max-w-full object-cover rounded-2xl border-4 border-[#FF5252] shadow-2xl transition-transform group-hover:scale-105"
// //                       />
// //                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all"></div>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Submit Buttons */}
// //               <div className="flex gap-3 flex-col sm:flex-row">
// //                 {editId && (
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       clearForm();
// //                       if (selectedCategory) {
// //                         fetchSubCategories(selectedCategory);
// //                       }
// //                     }}
// //                     className="px-8 py-3.5 border-2 border-[#FF5252] text-[#FF5252] rounded-xl font-semibold text-base hover:bg-[#FF5252] hover:text-white transition-all duration-200 active:scale-95"
// //                   >
// //                     Cancel Edit
// //                   </button>
// //                 )}

// //                 <button
// //                   type="submit"
// //                   disabled={isSaving || loading}
// //                   className={`flex-1 px-8 py-3.5 bg-[#FF5252] text-white rounded-xl font-semibold text-base shadow-lg transition-all duration-200 ${isSaving || loading
// //                     ? "opacity-70 cursor-not-allowed"
// //                     : "hover:bg-[#e03e3e] hover:shadow-xl active:scale-95"
// //                     }`}
// //                 >
// //                   {isSaving ? (
// //                     <span className="flex items-center justify-center gap-2">
// //                       <CircularProgress size={20} sx={{ color: 'white' }} />
// //                       {editId ? "Updating..." : "Creating..."}
// //                     </span>
// //                   ) : editId ? (
// //                     "✓ Update Sub-Category"
// //                   ) : (
// //                     "✓ Create Sub-Category"
// //                   )}
// //                 </button>
// //               </div>
// //             </Box>
// //           </div>
// //         </div>
// //       </div>

// //       {/* ─── SUB-CATEGORY LIST ─── */}
// //       <div className="max-w-7xl mx-auto">
// //         <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
// //           {/* List Header */}
// //           <div className="bg-gradient-to-r from-[#FF5252] to-[#e03e3e] px-6 sm:px-8 py-6">
// //             <div className="flex flex-wrap items-center justify-between gap-4">
// //               <div className="flex items-center gap-3">
// //                 <Typography variant="h5" className="flex items-center gap-2 font-bold text-white">
// //                   <SubdirectoryArrowRightIcon className="text-xl" />
// //                   <span>All Sub-Categories</span>
// //                 </Typography>
// //                 {selectedCategory && (
// //                   <Chip
// //                     label={`${getCategoryName(selectedCategory)}`}
// //                     size="small"
// //                     sx={{
// //                       bgcolor: "rgba(255, 255, 255, 0.2)",
// //                       color: "white",
// //                       fontWeight: 600,
// //                       backdropFilter: 'blur(10px)',
// //                     }}
// //                   />
// //                 )}
// //               </div>
// //               {subCategories.length > 0 && (
// //                 <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
// //                   <Typography variant="body2" className="font-semibold text-white">
// //                     {subCategories.length} {subCategories.length === 1 ? 'Sub-Category' : 'Sub-Categories'}
// //                   </Typography>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* List Content */}
// //           <div className="p-6 sm:p-8">
// //             {!selectedCategory ? (
// //               <div className="text-center py-16">
// //                 <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 max-w-md mx-auto">
// //                   <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                   </svg>
// //                   <Typography variant="h6" className="font-bold text-gray-800 mb-2">
// //                     Select a Category
// //                   </Typography>
// //                   <Typography variant="body2" className="text-gray-600">
// //                     Please select a category above to view and manage its sub-categories
// //                   </Typography>
// //                 </div>
// //               </div>
// //             ) : loading ? (
// //               <div className="flex flex-col items-center justify-center py-16">
// //                 <CircularProgress sx={{ color: '#FF5252', mb: 2 }} size={48} />
// //                 <Typography variant="body1" className="text-gray-600">
// //                   Loading sub-categories...
// //                 </Typography>
// //               </div>
// //             ) : !subCategories?.length ? (
// //               <div className="text-center py-16">
// //                 <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 max-w-md mx-auto">
// //                   <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //                   </svg>
// //                   <Typography variant="h6" className="font-bold text-gray-800 mb-2">
// //                     No Sub-Categories Yet
// //                   </Typography>
// //                   <Typography variant="body2" className="text-gray-600">
// //                     Start by adding your first sub-category for this category!
// //                   </Typography>
// //                 </div>
// //               </div>
// //             ) : (
// //               <>
// //                 {/* Desktop Table */}
// //                 <div className="hidden lg:block overflow-x-auto">
// //                   <TableContainer className="rounded-2xl border border-gray-200">
// //                     <Table>
// //                       <TableHead>
// //                         <TableRow sx={{ bgcolor: "#FF5252" }}>
// //                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>S.No</TableCell>
// //                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Image</TableCell>
// //                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Sub-Category Name</TableCell>
// //                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Description</TableCell>
// //                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}> Category</TableCell>
// //                           <TableCell align="right" sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>
// //                             Actions
// //                           </TableCell>
// //                         </TableRow>
// //                       </TableHead>
// //                       <TableBody>
// //                         {subCategories.map((sc, i) => (
// //                           <TableRow
// //                             key={sc.id}
// //                             hover
// //                             sx={{
// //                               "&:hover": { bgcolor: "#fff5f5" },
// //                               transition: 'all 0.2s'
// //                             }}
// //                           >
// //                             <TableCell>
// //                               <div className="font-semibold text-gray-700">{i + 1}</div>
// //                             </TableCell>
// //                             <TableCell>
// //                               {sc.image ? (
// //                                 <img
// //                                   src={sc.image}
// //                                   alt={sc.name}
// //                                   className="h-20 w-20 object-cover rounded-xl shadow-md border-2 border-red-100 transition-transform hover:scale-110"
// //                                   onError={(e) => {
// //                                     e.target.src = "https://via.placeholder.com/80?text=No+Image";
// //                                   }}
// //                                 />
// //                               ) : (
// //                                 <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-xl border-2 border-gray-200">
// //                                   <span className="text-gray-400 text-xs">No image</span>
// //                                 </div>
// //                               )}
// //                             </TableCell>
// //                             <TableCell>
// //                               <div className="font-semibold text-[#FF5252] text-base">{sc.name}</div>
// //                             </TableCell>
// //                             <TableCell>
// //                               <div className="text-sm text-gray-600 max-w-xs">
// //                                 {sc.description || <span className="italic text-gray-400">No description</span>}
// //                               </div>
// //                             </TableCell>
// //                             <TableCell>
// //                               <Chip
// //                                 label={getCategoryName(sc.category_id)}
// //                                 size="small"
// //                                 sx={{
// //                                   bgcolor: "#fb923c",
// //                                   color: "white",
// //                                   fontWeight: 600,
// //                                 }}
// //                               />
// //                             </TableCell>
// //                             <TableCell align="right">
// //                               <IconButton
// //                                 onClick={() => handleEdit(sc)}
// //                                 size="small"
// //                                 sx={{
// //                                   color: "#FF5252",
// //                                   bgcolor: '#fff5f5',
// //                                   "&:hover": { bgcolor: "#ffe5e5" },
// //                                   mr: 1
// //                                 }}
// //                               >
// //                                 <EditIcon />
// //                               </IconButton>
// //                               <IconButton
// //                                 color="error"
// //                                 onClick={() => handleDelete(sc.id)}
// //                                 size="small"
// //                                 sx={{
// //                                   bgcolor: '#fff5f5',
// //                                   "&:hover": { bgcolor: "#ffe5e5" },
// //                                 }}
// //                               >
// //                                 <DeleteIcon />
// //                               </IconButton>
// //                             </TableCell>
// //                           </TableRow>
// //                         ))}
// //                       </TableBody>
// //                     </Table>
// //                   </TableContainer>
// //                 </div>

// //                 {/* Mobile Cards */}
// //                 <div className="lg:hidden space-y-4">
// //                   {subCategories.map((sc, i) => (
// //                     <div
// //                       key={sc.id}
// //                       className="border-2 border-red-100 rounded-2xl p-5 bg-white shadow-lg hover:shadow-xl transition-all"
// //                     >
// //                       <div className="flex justify-between items-start mb-4">
// //                         <div className="flex-1">
// //                           <div className="text-xs font-semibold text-gray-500 mb-1">#{i + 1}</div>
// //                           <div className="font-bold text-xl text-[#FF5252] mb-2">{sc.name}</div>
// //                           <Chip
// //                             label={getCategoryName(sc.category_id)}
// //                             size="small"
// //                             sx={{
// //                               bgcolor: "#fb923c",
// //                               color: "white",
// //                               fontWeight: 600,
// //                               fontSize: "0.75rem",
// //                             }}
// //                           />
// //                         </div>
// //                         <div className="flex gap-2 ml-3">
// //                           <button
// //                             onClick={() => handleEdit(sc)}
// //                             className="p-2 bg-[#fff5f5] text-[#FF5252] rounded-xl hover:bg-[#ffe5e5] transition-colors"
// //                           >
// //                             <EditIcon fontSize="small" />
// //                           </button>
// //                           <button
// //                             onClick={() => handleDelete(sc.id)}
// //                             className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
// //                           >
// //                             <DeleteIcon fontSize="small" />
// //                           </button>
// //                         </div>
// //                       </div>

// //                       {sc.description && (
// //                         <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl mb-3 border border-gray-100">
// //                           {sc.description}
// //                         </div>
// //                       )}

// //                       {sc.image && (
// //                         <div className="flex justify-center">
// //                           <img
// //                             src={sc.image}
// //                             alt={sc.name}
// //                             className="h-52 w-auto max-w-full object-cover rounded-2xl border-4 border-red-100 shadow-lg"
// //                             onError={(e) => {
// //                               e.target.src = "https://via.placeholder.com/200?text=No+Image";
// //                             }}
// //                           />
// //                         </div>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SubCategory;



// import React, { useContext, useEffect, useState } from "react";
// import {
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Box,
//   Alert,
//   CircularProgress,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Chip,
//   Grid,
// } from "@mui/material";

// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CategoryIcon from "@mui/icons-material/Category";
// import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

// import axiosInstance from "../api/axiosInstance";
// import { RestaurantContext } from "../context/getRestaurant";
// import { CategoriesContext } from "../context/GetAllCategories";
// import { IoMdCamera } from "react-icons/io";

// const SubCategory = () => {
//   const { restaurant } = useContext(RestaurantContext);
//   const { categories } = useContext(CategoriesContext);

//   const [subCategories, setSubCategories] = useState([]);
//   const [allSubCategories, setAllSubCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [filterCategory, setFilterCategory] = useState("all");
//   const [image, setImage] = useState(null);
//   const [currentImage, setCurrentImage] = useState("");
//   const [editId, setEditId] = useState(null);

//   const [errors, setErrors] = useState({});
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [isSaving, setIsSaving] = useState(false);

//   // Auto-hide messages
//   useEffect(() => {
//     if (successMsg || errorMsg) {
//       const timer = setTimeout(() => {
//         setSuccessMsg("");
//         setErrorMsg("");
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMsg, errorMsg]);

//   // Fetch all sub-categories on component mount
//   useEffect(() => {
//     if (restaurant?.id) {
//       fetchAllSubCategories();
//     }
//   }, [restaurant?.id]);

//   // Filter subcategories when filter changes
//   useEffect(() => {
//     if (filterCategory === "all") {
//       setSubCategories(allSubCategories);
//     } else {
//       const filtered = allSubCategories.filter(
//         (sc) => sc.category_id === filterCategory
//       );
//       setSubCategories(filtered);
//     }
//   }, [filterCategory, allSubCategories]);

//   // Fetch ALL sub-categories across all categories
//   const fetchAllSubCategories = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // Fetch subcategories for each category and combine them
//       const allSubCategoriesPromises = categories?.map((category) =>
//         axiosInstance.get(
//           `/subcategories/${category.id}/sub-categories`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         ).catch(() => ({ data: [] })) // Handle errors gracefully
//       ) || [];

//       const responses = await Promise.all(allSubCategoriesPromises);
      
//       // Combine all subcategories from all categories
//       const combinedSubCategories = responses.reduce((acc, response) => {
//         return [...acc, ...response.data];
//       }, []);

//       setAllSubCategories(combinedSubCategories);
//       setSubCategories(combinedSubCategories);
//     } catch (error) {
//       console.error("Failed to fetch all sub-categories:", error);
//       setAllSubCategories([]);
//       setSubCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch sub-categories for a specific category
//   const fetchSubCategoriesByCategory = async (categoryId) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axiosInstance.get(
//         `/subcategories/${categoryId}/sub-categories`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       return res.data;
//     } catch (error) {
//       console.error("Fetch failed:", error);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validate = () => {
//     const err = {};
//     if (!name.trim()) {
//       err.name = "Sub-category name is required";
//     }
//     if (!selectedCategory) {
//       err.category = "Please select a category";
//     }
//     if (!editId && !image) {
//       err.image = "Sub-category image is required";
//     }

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   const clearForm = () => {
//     setName("");
//     setDescription("");
//     setSelectedCategory("");
//     setImage(null);
//     setCurrentImage("");
//     setEditId(null);
//     setErrors({});
//   };

//   const handleAdd = async () => {
//     if (!validate()) return;
//     setIsSaving(true);

//     const formData = new FormData();
//     formData.append("name", name.trim());
//     formData.append("description", description.trim());
//     if (image) formData.append("image", image);

//     const token = localStorage.getItem("token");

//     try {
//       await axiosInstance.post(
//         `/subcategories/${restaurant?.id}/categories/${selectedCategory}/sub-categories`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSuccessMsg("Sub-category created successfully!");
//       clearForm();
//       await fetchAllSubCategories();
//     } catch (error) {
//       console.error("Add failed:", error);
//       setErrorMsg(error?.response?.data?.message || "Failed to create sub-category");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!validate()) return;
//     setIsSaving(true);

//     const formData = new FormData();
//     formData.append("name", name.trim());
//     formData.append("description", description.trim());
//     if (image) formData.append("image", image);

//     const token = localStorage.getItem("token");

//     try {
//       await axiosInstance.put(`/subcategories/${editId}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setSuccessMsg("Sub-category updated successfully!");
//       clearForm();
//       await fetchAllSubCategories();
//     } catch (error) {
//       console.error("Update failed:", error);
//       setErrorMsg(error?.response?.data?.message || "Failed to update sub-category");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this sub-category?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axiosInstance.delete(`/subcategories/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setSuccessMsg("Sub-category deleted successfully");
//       await fetchAllSubCategories();
//     } catch (error) {
//       console.error("Delete failed:", error);
//       setErrorMsg(error?.response?.data?.message || "Failed to delete sub-category");
//     }
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     if (editId) handleUpdate();
//     else handleAdd();
//   };

//   const handleEdit = async (sc) => {
//     try {
//       setEditId(sc.id);

//       const token = localStorage.getItem("token");
//       const response = await axiosInstance.get(`/subcategories/${sc.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const subCategoryData = response.data;

//       setName(subCategoryData.name);
//       setDescription(subCategoryData.description || "");
//       setSelectedCategory(subCategoryData.category_id);
//       setCurrentImage(subCategoryData.image || "");
//       setImage(null);
//       setErrors({});

//       // Scroll to top smoothly
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } catch (error) {
//       console.error("Failed to fetch sub-category details:", error);
//       setErrorMsg("Failed to load sub-category details");
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setImage(file);
//     setCurrentImage(URL.createObjectURL(file));
//   };

//   const handleCategoryChange = (e) => {
//     const newCategoryId = e.target.value;
//     setSelectedCategory(newCategoryId);
//   };

//   const handleFilterChange = (e) => {
//     const newFilterValue = e.target.value;
//     setFilterCategory(newFilterValue);
//   };

//   const getCategoryName = (categoryId) => {
//     const category = categories?.find((c) => c.id === categoryId);
//     return category?.name || "Unknown";
//   };

//   if (!restaurant?.id) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fff5f5] to-[#ffecec]">
//         <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md">
//           <div className="text-center">
//             <SubdirectoryArrowRightIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
//             <Typography variant="h5" className="font-bold text-gray-800 mb-2">
//               Restaurant Required
//             </Typography>
//             <Typography variant="body1" className="text-gray-600">
//               Please select or load a restaurant first to manage sub-categories.
//             </Typography>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] to-[#ffecec] font-['Poppins'] p-4 sm:p-6 lg:p-8">
//       {/* ─── FORM SECTION ─── */}
//       <div className="max-w-7xl mx-auto mb-8">
//         <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#FF5252] to-[#e03e3e] px-6 sm:px-8 py-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
//                 <SubdirectoryArrowRightIcon sx={{ fontSize: 36, color: "white" }} />
//               </div>
//               <div>
//                 <Typography variant="h4" className="font-bold text-white">
//                   {editId ? "Edit Sub-Category" : "Add New Sub-Category"}
//                 </Typography>
//                 <Typography variant="body2" className="text-white/90 mt-1">
//                   Create sub-categories under main categories
//                 </Typography>
//               </div>
//             </div>
//           </div>

//           {/* Form Content */}
//           <div className="p-6 sm:p-8">
//             {successMsg && (
//               <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
//                 <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <p className="text-sm font-medium text-green-800 flex-1">{successMsg}</p>
//                 <button onClick={() => setSuccessMsg("")} className="text-green-600 hover:text-green-800 transition">
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             )}

//             {errorMsg && (
//               <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
//                 <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <p className="text-sm font-medium text-red-800 flex-1">{errorMsg}</p>
//                 <button onClick={() => setErrorMsg("")} className="text-red-600 hover:text-red-800 transition">
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             )}

//             <Box component="form" onSubmit={handleSave} className="space-y-6">
//               {/* Category Selection */}
//               <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
//                 <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
//                   Category
//                 </Typography>
//                 <FormControl fullWidth size="small" error={!!errors.category}>
//                   <InputLabel
//                     sx={{
//                       '&.Mui-focused': {
//                         color: '#FF5252',
//                       },
//                     }}
//                   >
//                     Select Category *
//                   </InputLabel>
//                   <Select
//                     value={selectedCategory}
//                     label="Select Category *"
//                     onChange={handleCategoryChange}
//                     className="bg-white rounded-xl"
//                     sx={{
//                       '& .MuiOutlinedInput-notchedOutline': {
//                         borderColor: errors.category ? '#ef4444' : '#e5e7eb',
//                       },
//                       '&:hover .MuiOutlinedInput-notchedOutline': {
//                         borderColor: '#FF5252',
//                       },
//                       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                         borderColor: '#FF5252',
//                         borderWidth: '2px',
//                       },
//                     }}
//                   >
//                     {categories?.map((cat) => (
//                       <MenuItem key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {errors.category && (
//                     <Typography variant="caption" className="text-red-500 mt-1 ml-1">
//                       {errors.category}
//                     </Typography>
//                   )}
//                 </FormControl>
//               </div>

//               {/* Basic Information */}
//               <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
//                 <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
//                   Sub-Category Information
//                 </Typography>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Sub-Category Name *"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       fullWidth
//                       error={!!errors.name}
//                       helperText={errors.name}
//                       size="small"
//                       className="bg-white rounded-xl"
//                       sx={{
//                         '& label.Mui-focused': {
//                           color: '#FF5252',
//                         },
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: '12px',
//                           '& fieldset': {
//                             borderColor: '#e5e7eb',
//                           },
//                           '&:hover fieldset': {
//                             borderColor: '#FF5252',
//                           },
//                           '&.Mui-focused fieldset': {
//                             borderColor: '#FF5252',
//                             borderWidth: '2px',
//                           },
//                         },
//                       }}
//                     />
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Description"
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                       fullWidth
//                       size="small"
//                       multiline
//                       rows={3}
//                       className="bg-white rounded-xl"
//                       placeholder="Brief description of the sub-category"
//                       sx={{
//                         '& label.Mui-focused': {
//                           color: '#FF5252',
//                         },
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: '12px',
//                           '& fieldset': {
//                             borderColor: '#e5e7eb',
//                           },
//                           '&:hover fieldset': {
//                             borderColor: '#FF5252',
//                           },
//                           '&.Mui-focused fieldset': {
//                             borderColor: '#FF5252',
//                             borderWidth: '2px',
//                           },
//                         },
//                       }}
//                     />
//                   </Grid>
//                 </Grid>
//               </div>

//               {/* Image Upload */}
//               <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
//                 <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
//                   Sub-Category Image
//                 </Typography>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   id="subcategory-image-upload"
//                   className="hidden"
//                 />
//                 <label htmlFor="subcategory-image-upload" className="cursor-pointer">
//                   <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#FF5252] transition-all bg-white group">
//                     <IoMdCamera className="text-6xl text-gray-400 group-hover:text-[#FF5252] mx-auto mb-3 transition-colors" />
//                     <p className="text-gray-600 font-medium mb-1">
//                       {image ? "Change Image" : currentImage ? "Update Image" : "Click to Upload Sub-Category Image"}
//                     </p>
//                     <p className="text-sm text-gray-400">
//                       Upload a clear sub-category image (PNG, JPG, WEBP)
//                     </p>
//                   </div>
//                 </label>
//                 {errors.image && (
//                   <Typography variant="caption" className="text-red-500 mt-2 block">
//                     {errors.image}
//                   </Typography>
//                 )}

//                 {currentImage && (
//                   <div className="mt-6 flex justify-center">
//                     <div className="relative group">
//                       <img
//                         src={currentImage}
//                         alt="preview"
//                         className="h-64 w-auto max-w-full object-cover rounded-2xl border-4 border-[#FF5252] shadow-2xl transition-transform group-hover:scale-105"
//                       />
//                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all"></div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Submit Buttons */}
//               <div className="flex gap-3 flex-col sm:flex-row">
//                 {editId && (
//                   <button
//                     type="button"
//                     onClick={clearForm}
//                     className="px-8 py-3.5 border-2 border-[#FF5252] text-[#FF5252] rounded-xl font-semibold text-base hover:bg-[#FF5252] hover:text-white transition-all duration-200 active:scale-95"
//                   >
//                     Cancel Edit
//                   </button>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isSaving || loading}
//                   className={`flex-1 px-8 py-3.5 bg-[#FF5252] text-white rounded-xl font-semibold text-base shadow-lg transition-all duration-200 ${isSaving || loading
//                     ? "opacity-70 cursor-not-allowed"
//                     : "hover:bg-[#e03e3e] hover:shadow-xl active:scale-95"
//                     }`}
//                 >
//                   {isSaving ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <CircularProgress size={20} sx={{ color: 'white' }} />
//                       {editId ? "Updating..." : "Creating..."}
//                     </span>
//                   ) : editId ? (
//                     "✓ Update Sub-Category"
//                   ) : (
//                     "✓ Create Sub-Category"
//                   )}
//                 </button>
//               </div>
//             </Box>
//           </div>
//         </div>
//       </div>

//       {/* ─── SUB-CATEGORY LIST ─── */}
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
//           {/* List Header */}
//           <div className="bg-gradient-to-r from-[#FF5252] to-[#e03e3e] px-6 sm:px-8 py-6">
//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <div className="flex items-center gap-3">
//                 <Typography variant="h5" className="flex items-center gap-2 font-bold text-white">
//                   <SubdirectoryArrowRightIcon className="text-xl" />
//                   <span>All Sub-Categories</span>
//                 </Typography>
//               </div>
//               {subCategories.length > 0 && (
//                 <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
//                   <Typography variant="body2" className="font-semibold text-white">
//                     {subCategories.length} {subCategories.length === 1 ? 'Sub-Category' : 'Sub-Categories'}
//                   </Typography>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Filter Section */}
//           <div className="px-6 sm:px-8 py-5 bg-gradient-to-br from-gray-50 to-red-50/30 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//               <Typography variant="subtitle1" className="font-semibold text-gray-800 flex items-center gap-2">
//                 <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
//                 Filter by Category
//               </Typography>
//               <FormControl size="small" sx={{ minWidth: 250 }}>
//                 <InputLabel
//                   sx={{
//                     '&.Mui-focused': {
//                       color: '#FF5252',
//                     },
//                   }}
//                 >
//                   Select Category
//                 </InputLabel>
//                 <Select
//                   value={filterCategory}
//                   label="Select Category"
//                   onChange={handleFilterChange}
//                   className="bg-white rounded-xl"
//                   sx={{
//                     '& .MuiOutlinedInput-notchedOutline': {
//                       borderColor: '#e5e7eb',
//                     },
//                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                       borderColor: '#FF5252',
//                     },
//                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                       borderColor: '#FF5252',
//                       borderWidth: '2px',
//                     },
//                   }}
//                 >
//                   <MenuItem value="all">
//                     <span className="font-semibold text-[#FF5252]">All Sub-Categories</span>
//                   </MenuItem>
//                   {categories?.map((cat) => (
//                     <MenuItem key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               {filterCategory !== "all" && (
//                 <Chip
//                   label={`Showing: ${getCategoryName(filterCategory)}`}
//                   onDelete={() => setFilterCategory("all")}
//                   size="small"
//                   sx={{
//                     bgcolor: "#FF5252",
//                     color: "white",
//                     fontWeight: 600,
//                     '& .MuiChip-deleteIcon': {
//                       color: 'white',
//                       '&:hover': {
//                         color: 'rgba(255, 255, 255, 0.8)',
//                       },
//                     },
//                   }}
//                 />
//               )}
//             </div>
//           </div>

//           {/* List Content */}
//           <div className="p-6 sm:p-8">
//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-16">
//                 <CircularProgress sx={{ color: '#FF5252', mb: 2 }} size={48} />
//                 <Typography variant="body1" className="text-gray-600">
//                   Loading sub-categories...
//                 </Typography>
//               </div>
//             ) : !subCategories?.length ? (
//               <div className="text-center py-16">
//                 <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 max-w-md mx-auto">
//                   <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                   <Typography variant="h6" className="font-bold text-gray-800 mb-2">
//                     No Sub-Categories Yet
//                   </Typography>
//                   <Typography variant="body2" className="text-gray-600">
//                     {filterCategory === "all" 
//                       ? "Start by adding your first sub-category!"
//                       : `No sub-categories found for ${getCategoryName(filterCategory)}`
//                     }
//                   </Typography>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {/* Desktop Table */}
//                 <div className="hidden lg:block overflow-x-auto">
//                   <TableContainer className="rounded-2xl border border-gray-200">
//                     <Table>
//                       <TableHead>
//                         <TableRow sx={{ bgcolor: "#FF5252" }}>
//                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>S.No</TableCell>
//                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Image</TableCell>
//                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Sub-Category Name</TableCell>
//                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Description</TableCell>
//                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Category</TableCell>
//                           <TableCell align="right" sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>
//                             Actions
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {subCategories.map((sc, i) => (
//                           <TableRow
//                             key={sc.id}
//                             hover
//                             sx={{
//                               "&:hover": { bgcolor: "#fff5f5" },
//                               transition: 'all 0.2s'
//                             }}
//                           >
//                             <TableCell>
//                               <div className="font-semibold text-gray-700">{i + 1}</div>
//                             </TableCell>
//                             <TableCell>
//                               {sc.image ? (
//                                 <img
//                                   src={sc.image}
//                                   alt={sc.name}
//                                   className="h-20 w-20 object-cover rounded-xl shadow-md border-2 border-red-100 transition-transform hover:scale-110"
//                                   onError={(e) => {
//                                     e.target.src = "https://via.placeholder.com/80?text=No+Image";
//                                   }}
//                                 />
//                               ) : (
//                                 <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-xl border-2 border-gray-200">
//                                   <span className="text-gray-400 text-xs">No image</span>
//                                 </div>
//                               )}
//                             </TableCell>
//                             <TableCell>
//                               <div className="font-semibold text-[#FF5252] text-base">{sc.name}</div>
//                             </TableCell>
//                             <TableCell>
//                               <div className="text-sm text-gray-600 max-w-xs">
//                                 {sc.description || <span className="italic text-gray-400">No description</span>}
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <Chip
//                                 label={getCategoryName(sc.category_id)}
//                                 size="small"
//                                 sx={{
//                                   bgcolor: "#fb923c",
//                                   color: "white",
//                                   fontWeight: 600,
//                                 }}
//                               />
//                             </TableCell>
//                             <TableCell align="right">
//                               <IconButton
//                                 onClick={() => handleEdit(sc)}
//                                 size="small"
//                                 sx={{
//                                   color: "#FF5252",
//                                   bgcolor: '#fff5f5',
//                                   "&:hover": { bgcolor: "#ffe5e5" },
//                                   mr: 1
//                                 }}
//                               >
//                                 <EditIcon className="text-blue-500" />
//                               </IconButton>
//                               <IconButton
//                                 color="error"
//                                 onClick={() => handleDelete(sc.id)}
//                                 size="small"
//                                 sx={{
//                                   bgcolor: '#fff5f5',
//                                   "&:hover": { bgcolor: "#ffe5e5" },
//                                 }}
//                               >
//                                 <DeleteIcon className="text-green-500" />
//                               </IconButton>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </div>

//                 {/* Mobile Cards */}
//                 <div className="lg:hidden space-y-4">
//                   {subCategories.map((sc, i) => (
//                     <div
//                       key={sc.id}
//                       className="border-2 border-red-100 rounded-2xl p-5 bg-white shadow-lg hover:shadow-xl transition-all"
//                     >
//                       <div className="flex justify-between items-start mb-4">
//                         <div className="flex-1">
//                           <div className="text-xs font-semibold text-gray-500 mb-1">#{i + 1}</div>
//                           <div className="font-bold text-xl text-[#FF5252] mb-2">{sc.name}</div>
//                           <Chip
//                             label={getCategoryName(sc.category_id)}
//                             size="small"
//                             sx={{
//                               bgcolor: "#fb923c",
//                               color: "white",
//                               fontWeight: 600,
//                               fontSize: "0.75rem",
//                             }}
//                           />
//                         </div>
//                         <div className="flex gap-2 ml-3">
//                           <button
//                             onClick={() => handleEdit(sc)}
//                             className="p-2 bg-[#fff5f5] text-[#FF5252] rounded-xl hover:bg-[#ffe5e5] transition-colors"
//                           >
//                             <EditIcon fontSize="small" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(sc.id)}
//                             className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
//                           >
//                             <DeleteIcon fontSize="small" />
//                           </button>
//                         </div>
//                       </div>

//                       {sc.description && (
//                         <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl mb-3 border border-gray-100">
//                           {sc.description}
//                         </div>
//                       )}

//                       {sc.image && (
//                         <div className="flex justify-center">
//                           <img
//                             src={sc.image}
//                             alt={sc.name}
//                             className="h-52 w-auto max-w-full object-cover rounded-2xl border-4 border-red-100 shadow-lg"
//                             onError={(e) => {
//                               e.target.src = "https://via.placeholder.com/200?text=No+Image";
//                             }}
//                           />
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubCategory;



import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { IoMdCamera } from "react-icons/io";

import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";

const SubCategory = () => {
  const { restaurant } = useContext(RestaurantContext);
  const { categories } = useContext(CategoriesContext);

  const [allSubCategories, setAllSubCategories] = useState([]);
  const [displayedSubCategories, setDisplayedSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  // Modal & form states
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add"); // "add" | "edit"

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

  // Fetch ALL subcategories once restaurant is loaded
  useEffect(() => {
    if (restaurant?.id) {
      fetchAllSubCategories();
    }
  }, [restaurant?.id]);

  // Apply filter
  useEffect(() => {
    if (filterCategory === "all") {
      setDisplayedSubCategories(allSubCategories);
    } else {
      const filtered = allSubCategories.filter((sc) => sc.category_id === filterCategory);
      setDisplayedSubCategories(filtered);
    }
  }, [filterCategory, allSubCategories]);

  const fetchAllSubCategories = async () => {
    if (!categories?.length) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const promises = categories.map((cat) =>
        axiosInstance
          .get(`/subcategories/${cat.id}/sub-categories`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() => ({ data: [] }))
      );

      const results = await Promise.all(promises);
      const combined = results.flatMap((res) => res.data || []);
      setAllSubCategories(combined);
    } catch (err) {
      console.error("Failed to load subcategories", err);
      setAllSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedCategory("");
    setImage(null);
    setCurrentImage("");
    setEditId(null);
    setErrors({});
    setMode("add");
  };

  const openAddModal = () => {
    resetForm();
    setOpenModal(true);
  };

  const handleEdit = async (subcat) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/subcategories/${subcat.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setName(data.name);
      setDescription(data.description || "");
      setSelectedCategory(data.category_id);
      setCurrentImage(data.image || "");
      setImage(null);
      setEditId(data.id);
      setMode("edit");
      setOpenModal(true);
      setErrors({});
    } catch (err) {
      setErrorMsg("Failed to load sub-category details");
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = "Sub-category name is required";
    if (!selectedCategory) err.category = "Please select a category";
    if (mode === "add" && !image) err.image = "Sub-category image is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Only JPG, PNG, WEBP allowed" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image size must not exceed 5MB" }));
      return;
    }

    setImage(file);
    setCurrentImage(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setErrorMsg("Please fix the errors before submitting");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (mode === "add") {
        await axiosInstance.post(
          `/subcategories/${restaurant?.id}/categories/${selectedCategory}/sub-categories`,
          formData,
          config
        );
        setSuccessMsg("Sub-category created successfully!");
      } else {
        await axiosInstance.put(`/subcategories/${editId}`, formData, config);
        setSuccessMsg("Sub-category updated successfully!");
      }

      closeModal();
      await fetchAllSubCategories();
    } catch (err) {
      let msg = "Failed to save sub-category.";
      if (err?.response?.data?.message) msg = err.response.data.message;
      else if (err?.response?.status === 413) msg = "Image is too large.";
      else if (err?.response?.status === 401) msg = "Please login again.";
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sub-category?")) return;

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/subcategories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("Sub-category deleted successfully");
      await fetchAllSubCategories();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to delete sub-category");
    }
  };

  const getCategoryName = (catId) => {
    return categories?.find((c) => c.id === catId)?.name || "Unknown";
  };

  if (!restaurant?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <SubdirectoryArrowRightIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
          <Typography variant="h5" className="font-bold text-gray-800 mb-2">
            Restaurant Required
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Please select or load a restaurant first.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins'] p-4 sm:p-6 lg:p-8">
      {/* Global Messages */}
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
        {/* Header + Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <Typography variant="h4" className="font-bold text-gray-800">
              Sub-Categories
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Organize dishes into more specific groups under main categories
            </Typography>
          </div>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddModal}
            sx={{
              bgcolor: "#FF5252",
              "&:hover": { bgcolor: "#e03e3e" },
              borderRadius: "12px",
              px: 4,
              py: 1.2,
              fontWeight: 600,
            }}
          >
            Add Sub-Category
          </Button>
        </div>

        {/* Filter */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: "16px" }}>
          <FormControl size="small" sx={{ minWidth: 280 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={filterCategory}
              label="Filter by Category"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="all">
                <em>All Sub-Categories</em>
              </MenuItem>
              {categories?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {filterCategory !== "all" && (
            <Chip
              label={`Filtered: ${getCategoryName(filterCategory)}`}
              onDelete={() => setFilterCategory("all")}
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </Paper>

        {/* List */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: "#FF5252" }} size={60} />
          </Box>
        ) : displayedSubCategories.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px" }}>
            <SubdirectoryArrowRightIcon sx={{ fontSize: 80, color: "#FF5252", opacity: 0.4, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sub-categories found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {filterCategory === "all"
                ? "Add your first sub-category to get started"
                : `No sub-categories in ${getCategoryName(filterCategory)}`}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddModal}
              sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}
            >
              Add Sub-Category
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
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Image</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
                      <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedSubCategories.map((sc, i) => (
                      <TableRow key={sc.id} hover>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          {sc.image ? (
                            <img
                              src={sc.image}
                              alt={sc.name}
                              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
                              onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=?")}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 64,
                                height: 64,
                                bgcolor: "grey.100",
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem",
                                color: "text.secondary",
                              }}
                            >
                              No image
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="medium" color="#FF5252">
                            {sc.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {sc.description || <em className="text-gray-400">No description</em>}
                        </TableCell>
                        <TableCell>
                          <Chip label={getCategoryName(sc.category_id)} size="small" color="primary" />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(sc)} size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(sc.id)} size="small" color="error">
                            <DeleteIcon className="text-green-500"/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {displayedSubCategories.map((sc, i) => (
                <Paper key={sc.id} elevation={2} sx={{ borderRadius: "16px", p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        #{i + 1}
                      </Typography>
                      <Typography variant="h6" color="#FF5252">
                        {sc.name}
                      </Typography>
                      <Chip
                        label={getCategoryName(sc.category_id)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>

                    <Box>
                      <IconButton size="small" onClick={() => handleEdit(sc)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(sc.id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {sc.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {sc.description}
                    </Typography>
                  )}

                  {sc.image && (
                    <img
                      src={sc.image}
                      alt={sc.name}
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 12,
                        marginTop: 8,
                      }}
                      onError={(e) => (e.target.src = "https://via.placeholder.com/300x180?text=No+Image")}
                    />
                  )}
                </Paper>
              ))}
            </div>
          </Paper>
        )}
      </div>

      {/* ─── ADD / EDIT MODAL ─── */}
      <Dialog
        open={openModal}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ bgcolor: "#FF5252", color: "white" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <SubdirectoryArrowRightIcon />
            <span>{mode === "add" ? "Add New Sub-Category" : "Edit Sub-Category"}</span>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Category */}
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Select Category *</InputLabel>
              <Select
                value={selectedCategory}
                label="Select Category *"
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (errors.category) setErrors((p) => ({ ...p, category: "" }));
                }}
              >
                {categories?.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && <Typography color="error">{errors.category}</Typography>}
            </FormControl>

            {/* Name */}
            <TextField
              label="Sub-Category Name *"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: "" }));
              }}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            {/* Description */}
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              placeholder="Optional brief description..."
            />

            {/* Image */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Sub-Category Image {mode === "add" && <span style={{ color: "red" }}>*</span>}
              </Typography>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="subcat-image"
                style={{ display: "none" }}
              />
              <label htmlFor="subcat-image">
                <Box
                  sx={{
                    border: `2px dashed ${errors.image ? "#ef4444" : "#d1d5db"}`,
                    borderRadius: "12px",
                    p: 5,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: "grey.50",
                    "&:hover": { borderColor: "#FF5252", bgcolor: "grey.100" },
                  }}
                >
                  <IoMdCamera size={52} style={{ margin: "0 auto 12px", color: "#9ca3af" }} />
                  <Typography variant="body1" fontWeight="medium">
                    {image ? "Change image" : currentImage ? "Update image" : "Click to upload image"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    JPG, PNG, WEBP • Max 5MB
                  </Typography>
                </Box>
              </label>

              {errors.image && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                  {errors.image}
                </Typography>
              )}

              {currentImage && (
                <Box sx={{ mt: 3, position: "relative", display: "inline-block" }}>
                  <img
                    src={currentImage}
                    alt="preview"
                    style={{ maxHeight: 180, borderRadius: 12, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "white",
                      boxShadow: 1,
                    }}
                    onClick={() => {
                      setImage(null);
                      setCurrentImage("");
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeModal} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSaving}
            sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSaving ? (mode === "add" ? "Creating..." : "Updating...") : mode === "add" ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubCategory;