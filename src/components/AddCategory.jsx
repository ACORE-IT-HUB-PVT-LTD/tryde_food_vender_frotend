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
//   Grid,
// } from "@mui/material";

// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CategoryIcon from "@mui/icons-material/Category";

// import axiosInstance from "../api/axiosInstance";
// import { RestaurantContext } from "../context/getRestaurant";
// import { CategoriesContext } from "../context/GetAllCategories";
// import { IoMdCamera } from "react-icons/io";

// const Category = () => {
//   const { restaurant } = useContext(RestaurantContext);
//   const { categories, loading: contextLoading, fetchCategories } = useContext(CategoriesContext);

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [categoryImage, setCategoryImage] = useState(null);
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

//   const validate = () => {
//     const err = {};
    
//     // Name validation
//     if (!name.trim()) {
//       err.name = "Category name is required";
//     } else if (name.trim().length < 2) {
//       err.name = "Category name must be at least 2 characters";
//     } else if (name.trim().length > 50) {
//       err.name = "Category name must not exceed 50 characters";
//     }

//     // Image validation - ONLY required when creating new category
//     if (!editId && !categoryImage) {
//       err.categoryImage = "Category image is required";
//     }

//     // Image file type validation
//     if (categoryImage) {
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
//       if (!validTypes.includes(categoryImage.type)) {
//         err.categoryImage = "Please upload a valid image (JPG, PNG, WEBP, or GIF)";
//       }

//     }

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   const clearForm = () => {
//     setName("");
//     setDescription("");
//     setCategoryImage(null);
//     setCurrentImage("");
//     setEditId(null);
//     setErrors({});
//   };

//   const handleAdd = async () => {
//     if (!validate()) {
//       setErrorMsg("Please fix the errors before submitting");
//       return;
//     }
    
//     setIsSaving(true);
//     setErrorMsg("");
//     setSuccessMsg("");

//     const formData = new FormData();
//     formData.append("name", name.trim());
//     formData.append("description", description.trim());
//     if (categoryImage) {
//       formData.append("categoryImage", categoryImage);
//     }

//     const token = localStorage.getItem("token");

//     try {
//       await axiosInstance.post(`/categories/${restaurant?.id}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setSuccessMsg("Category created successfully!");
//       clearForm();
//       await fetchCategories();
//     } catch (error) {
//       console.error("Add failed:", error);
      
//       // Handle different types of backend errors
//       if (error?.response?.data?.message) {
//         setErrorMsg(error.response.data.message);
//       } else if (error?.response?.data?.error) {
//         setErrorMsg(error.response.data.error);
//       } else if (error?.response?.status === 413) {
//         setErrorMsg("Image file is too large. Please upload a smaller image.");
//       } else if (error?.response?.status === 400) {
//         setErrorMsg("Invalid data provided. Please check all fields.");
//       } else if (error?.response?.status === 401) {
//         setErrorMsg("Authentication failed. Please login again.");
//       } else if (error?.response?.status === 500) {
//         setErrorMsg("Server error occurred. Please try again later.");
//       } else if (error?.message === "Network Error") {
//         setErrorMsg("Network error. Please check your internet connection.");
//       } else {
//         setErrorMsg("Failed to create category. Please try again.");
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!validate()) {
//       setErrorMsg("Please fix the errors before submitting");
//       return;
//     }
    
//     setIsSaving(true);
//     setErrorMsg("");
//     setSuccessMsg("");

//     const formData = new FormData();
//     formData.append("name", name.trim());
//     formData.append("description", description.trim());
//     if (categoryImage) {
//       formData.append("categoryImage", categoryImage);
//     }

//     const token = localStorage.getItem("token");

//     try {
//       await axiosInstance.put(`/categories/${editId}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setSuccessMsg("Category updated successfully!");
//       clearForm();
//       await fetchCategories();
//     } catch (error) {
//       console.error("Update failed:", error);
      
//       // Handle different types of backend errors
//       if (error?.response?.data?.message) {
//         setErrorMsg(error.response.data.message);
//       } else if (error?.response?.data?.error) {
//         setErrorMsg(error.response.data.error);
//       } else if (error?.response?.status === 413) {
//         setErrorMsg("Image file is too large. Please upload a smaller image.");
//       } else if (error?.response?.status === 400) {
//         setErrorMsg("Invalid data provided. Please check all fields.");
//       } else if (error?.response?.status === 401) {
//         setErrorMsg("Authentication failed. Please login again.");
//       } else if (error?.response?.status === 404) {
//         setErrorMsg("Category not found. It may have been deleted.");
//       } else if (error?.response?.status === 500) {
//         setErrorMsg("Server error occurred. Please try again later.");
//       } else if (error?.message === "Network Error") {
//         setErrorMsg("Network error. Please check your internet connection.");
//       } else {
//         setErrorMsg("Failed to update category. Please try again.");
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this category?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axiosInstance.delete(`/categories/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setSuccessMsg("Category deleted successfully");
//       await fetchCategories();
//     } catch (error) {
//       console.error("Delete failed:", error);
      
//       // Handle different types of backend errors
//       if (error?.response?.data?.message) {
//         setErrorMsg(error.response.data.message);
//       } else if (error?.response?.data?.error) {
//         setErrorMsg(error.response.data.error);
//       } else if (error?.response?.status === 400) {
//         setErrorMsg("Cannot delete category. It may be associated with menu items.");
//       } else if (error?.response?.status === 401) {
//         setErrorMsg("Authentication failed. Please login again.");
//       } else if (error?.response?.status === 404) {
//         setErrorMsg("Category not found. It may have been already deleted.");
//       } else if (error?.response?.status === 500) {
//         setErrorMsg("Server error occurred. Please try again later.");
//       } else if (error?.message === "Network Error") {
//         setErrorMsg("Network error. Please check your internet connection.");
//       } else {
//         setErrorMsg("Failed to delete category. Please try again.");
//       }
//     }
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     if (editId) handleUpdate();
//     else handleAdd();
//   };


//   const handleEdit = (cat) => {
//     setName(cat.name);
//     setDescription(cat.description || "");
//     setCurrentImage(cat.categoryImage || "");
//     setCategoryImage(null);
//     setEditId(cat.id);
//     setErrors({});
//     setErrorMsg("");
//     setSuccessMsg("");
    
//     // Scroll to top smoothly
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Clear previous errors
//     setErrors(prev => ({ ...prev, categoryImage: "" }));

//     // Validate file type
//     const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
//     if (!validTypes.includes(file.type)) {
//       setErrors(prev => ({ 
//         ...prev, 
//         categoryImage: "Please upload a valid image (JPG, PNG, WEBP, or GIF)" 
//       }));
//       return ;
//     }

//     // Validate file size (max 5MB)
//     const maxSize = 5 * 1024 * 1024;
//     if (file.size > maxSize) {
//       setErrors(prev => ({ 
//         ...prev, 
//         categoryImage: "Image size must not exceed 5MB" 
//       }));
//       return;
//     }

//     setCategoryImage(file);
//     setCurrentImage(URL.createObjectURL(file));
//   };

//   if (!restaurant?.id) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md">
//           <div className="text-center">
//             <CategoryIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
//             <Typography variant="h5" className="font-bold text-gray-800 mb-2">
//               Restaurant Required
//             </Typography>
//             <Typography variant="body1" className="text-gray-600">
//               Please select or load a restaurant first to manage categories.
//             </Typography>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white font-['Poppins'] p-4 sm:p-6 lg:p-8">
//       {/* ─── FORM SECTION ─── */}
//       <div className="max-w-7xl mx-auto mb-8">
//         <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#FF5252] to-[#e03e3e] px-6 sm:px-8 py-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
//                 <CategoryIcon sx={{ fontSize: 36, color: "white" }} />
//               </div>
//               <div>
//                 <Typography variant="h4" className="font-bold text-white">
//                   {editId ? "Edit Category" : "Add New Category"}
//                 </Typography>
//                 <Typography variant="body2" className="text-white/90 mt-1">
//                   Organize your menu with categories
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
//               {/* Basic Information */}
//               <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-200">
//                 <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="w-1.5 h-6 bg-[#FF5252] rounded-full"></span>
//                   Category Information
//                 </Typography>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Category Name *"
//                       value={name}
//                       onChange={(e) => {
//                         setName(e.target.value);
//                         if (errors.name) {
//                           setErrors(prev => ({ ...prev, name: "" }));
//                         }
//                       }}
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
//                       placeholder="Brief description of the category"
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
//                   Category Image {!editId && <span className="text-red-500">*</span>}
//                 </Typography>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   id="category-image-upload"
//                   className="hidden"
//                 />
//                 <label htmlFor="category-image-upload" className="cursor-pointer">
//                   <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-white group ${
//                     errors.categoryImage 
//                       ? 'border-red-400 hover:border-red-500' 
//                       : 'border-gray-300 hover:border-[#FF5252]'
//                   }`}>
//                     <IoMdCamera className={`text-6xl mx-auto mb-3 transition-colors ${
//                       errors.categoryImage 
//                         ? 'text-red-400 group-hover:text-red-500' 
//                         : 'text-gray-400 group-hover:text-[#FF5252]'
//                     }`} />
//                     <p className="text-gray-600 font-medium mb-1">
//                       {categoryImage ? "Change Image" : currentImage ? "Update Image" : "Click to Upload Category Image"}
//                     </p>
//                     <p className="text-sm text-gray-400">
//                       Upload a clear category image (PNG, JPG, WEBP) - Max 5MB
//                     </p>
//                   </div>
//                 </label>

//                 {errors.categoryImage && (
//                   <div className="mt-3 text-sm text-red-600 flex items-center gap-2">
//                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     <span>{errors.categoryImage}</span>
//                   </div>
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
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           setCategoryImage(null);
//                           setCurrentImage("");
//                           setErrors(prev => ({ ...prev, categoryImage: "" }));
//                         }}
//                         className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                       >
//                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Submit Buttons */}
//               <div className="flex gap-3 flex-col sm:flex-row">
//                 {editId && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       clearForm();
//                       fetchCategories();
//                     }}
//                     className="px-8 py-3.5 border-2 border-[#FF5252] text-[#FF5252] rounded-xl font-semibold text-base hover:bg-[#FF5252] hover:text-white transition-all duration-200 active:scale-95"
//                   >
//                     Cancel Edit
//                   </button>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isSaving || contextLoading}
//                   className={`flex-1 px-8 py-3.5 bg-[#FF5252] text-white rounded-xl font-semibold text-base shadow-lg transition-all duration-200 ${
//                     isSaving || contextLoading
//                       ? "opacity-70 cursor-not-allowed"
//                       : "hover:bg-[#e03e3e] hover:shadow-xl active:scale-95"
//                   }`}
//                 >
//                   {isSaving ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <CircularProgress size={20} sx={{ color: 'white' }} />
//                       {editId ? "Updating..." : "Creating..."}
//                     </span>
//                   ) : editId ? (
//                     "✓ Update Category"
//                   ) : (
//                     "✓ Create Category"
//                   )}
//                 </button>
//               </div>
//             </Box>
//           </div>
//         </div>
//       </div>

//       {/* ─── CATEGORY LIST ─── */}
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
//           {/* List Content */}
//           <div className="p-6 sm:p-8">
//             {contextLoading ? (
//               <div className="flex flex-col items-center justify-center py-16">
//                 <CircularProgress sx={{ color: '#FF5252', mb: 2 }} size={48} />
//                 <Typography variant="body1" className="text-gray-600">
//                   Loading categories...
//                 </Typography>
//               </div>
//             ) : !categories?.length ? (
//               <div className="text-center py-16">
//                 <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 max-w-md mx-auto">
//                   <svg className="w-16 h-16 text-orange-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                   <Typography variant="h6" className="font-bold text-gray-800 mb-2">
//                     No Categories Yet
//                   </Typography>
//                   <Typography variant="body2" className="text-gray-600">
//                     Start by adding your first category to organize your menu!
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
//                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Category Name</TableCell>
//                           <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>Description</TableCell>
//                           <TableCell align="right" sx={{ color: "white", fontWeight: "bold", fontSize: '0.95rem' }}>
//                             Actions
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {categories.map((cat, i) => (
//                           <TableRow
//                             key={cat.id}
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
//                               {cat.categoryImage ? (
//                                 <img
//                                   src={cat.categoryImage}
//                                   alt={cat.name}
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
//                               <div className="font-semibold text-[#FF5252] text-base">{cat.name}</div>
//                             </TableCell>
//                             <TableCell>
//                               <div className="text-sm text-gray-600 max-w-xs">
//                                 {cat.description || <span className="italic text-gray-400">No description</span>}
//                               </div>
//                             </TableCell>
//                             <TableCell align="right">
//                               <IconButton
//                                 onClick={() => handleEdit(cat)}
//                                 size="small"
//                                 sx={{
//                                   color: "#FF5252",
//                                   bgcolor: '#fff5f5',
//                                   "&:hover": { bgcolor: "#ffe5e5" },
//                                   mr: 1
//                                 }}
//                               >
//                                 <EditIcon className="text-blue-600"/>
//                               </IconButton>
//                               <IconButton
//                                 color="error"
//                                 onClick={() => handleDelete(cat.id)}
//                                 size="small"
//                                 sx={{
//                                   bgcolor: '#fff5f5',
//                                   "&:hover": { bgcolor: "#ffe5e5" },
//                                 }}
//                               >
//                                 <DeleteIcon  className="text-green-500"/>
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
//                   {categories.map((cat, i) => (
//                     <div
//                       key={cat.id}
//                       className="border-2 border-red-100 rounded-2xl p-5 bg-white shadow-lg hover:shadow-xl transition-all"
//                     >
//                       <div className="flex justify-between items-start mb-4">
//                         <div className="flex-1">
//                           <div className="text-xs font-semibold text-gray-500 mb-1">{i + 1}</div>
//                           <div className="font-bold text-xl text-[#FF5252] mb-2">{cat.name}</div>
//                           {cat.description && (
//                             <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl mb-3 border border-gray-100">
//                               {cat.description}
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex gap-2 ml-3">
//                           <button
//                             onClick={() => handleEdit(cat)}
//                             className="p-2 bg-[#fff5f5] text-[#FF5252] rounded-xl hover:bg-[#ffe5e5] transition-colors"
//                           >
//                             <EditIcon fontSize="small" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(cat.id)}
//                             className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
//                           >
//                             <DeleteIcon fontSize="small" />
//                           </button>
//                         </div>
//                       </div>

//                       {cat.categoryImage && (
//                         <div className="flex justify-center">
//                           <img
//                             src={cat.categoryImage}
//                             alt={cat.name}
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

// export default Category;


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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
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
  const { categories, loading: contextLoading, fetchCategories } = useContext(CategoriesContext);

  // Modal & form states
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add"); // "add" | "edit"

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

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategoryImage(null);
    setCurrentImage("");
    setEditId(null);
    setErrors({});
    setMode("add");
  };

  const openAddModal = () => {
    resetForm();
    setOpenModal(true);
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setDescription(cat.description || "");
    setCurrentImage(cat.categoryImage || "");
    setCategoryImage(null);
    setEditId(cat.id);
    setMode("edit");
    setOpenModal(true);
    setErrors({});
    setErrorMsg("");
    setSuccessMsg("");
  };

  const closeModal = () => {
    setOpenModal(false);
    resetForm();
  };

  // ─── VALIDATION ───
  const validate = () => {
    const err = {};

    if (!name.trim()) {
      err.name = "Category name is required";
    } else if (name.trim().length < 2) {
      err.name = "Category name must be at least 2 characters";
    } else if (name.trim().length > 50) {
      err.name = "Category name must not exceed 50 characters";
    }

    if (mode === "add" && !categoryImage) {
      err.categoryImage = "Category image is required";
    }

    if (categoryImage) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(categoryImage.type)) {
        err.categoryImage = "Please upload a valid image (JPG, PNG, WEBP, or GIF)";
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ─── IMAGE HANDLER ───
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrors((prev) => ({ ...prev, categoryImage: "" }));

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        categoryImage: "Please upload a valid image (JPG, PNG, WEBP, or GIF)",
      }));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        categoryImage: "Image size must not exceed 5MB",
      }));
      return;
    }

    setCategoryImage(file);
    setCurrentImage(URL.createObjectURL(file));
  };

  // ─── API CALLS ───
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
    if (categoryImage) {
      formData.append("categoryImage", categoryImage);
    }

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (mode === "add") {
        await axiosInstance.post(`/categories/${restaurant?.id}`, formData, config);
        setSuccessMsg("Category created successfully!");
      } else {
        await axiosInstance.put(`/categories/${editId}`, formData, config);
        setSuccessMsg("Category updated successfully!");
      }

      closeModal();
      await fetchCategories();
    } catch (error) {
      console.error("Error:", error);

      let msg = "Failed to save category. Please try again.";
      if (error?.response?.data?.message) msg = error.response.data.message;
      else if (error?.response?.status === 413) msg = "Image file is too large.";
      else if (error?.response?.status === 401) msg = "Authentication failed. Please login again.";
      else if (error?.message === "Network Error") msg = "Network error. Check your connection.";

      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── DELETE ─── (same as before)
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
      let msg = "Failed to delete category.";
      if (error?.response?.status === 400) msg = "Cannot delete — category may have menu items.";
      else if (error?.response?.status === 401) msg = "Please login again.";
      setErrorMsg(msg);
    }
  };

  if (!restaurant?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <CategoryIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
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
      {/* Messages (global) */}
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
              Menu Categories
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Organize your dishes into meaningful groups
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
            Add Category
          </Button>
        </div>

        {/* ─── CATEGORIES LIST ─── */}
        {contextLoading ? (
          <div className="flex justify-center items-center py-20">
            <CircularProgress sx={{ color: "#FF5252" }} size={60} />
          </div>
        ) : !categories?.length ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px", bgcolor: "white" }}>
            <CategoryIcon sx={{ fontSize: 80, color: "orange", mb: 2, opacity: 0.6 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No categories yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Create your first category to start organizing your menu
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddModal}
              sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}
            >
              Add Your First Category
            </Button>
          </Paper>
        ) : (
          // Your existing table + mobile cards (kept same, just showing structure)
          <Paper sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: 3 }}>
            {/* Desktop Table - same as your original */}
            <div className="hidden lg:block">
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#FF5252" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Image</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
                      <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((cat, i) => (
                      <TableRow key={cat.id} hover>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          {cat.categoryImage ? (
                            <img
                              src={cat.categoryImage}
                              alt={cat.name}
                              className="h-16 w-16 object-cover rounded-lg"
                              onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=?")}
                            />
                          ) : (
                            <Box className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="medium" color="#FF5252">
                            {cat.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {cat.description || <em className="text-gray-400">No description</em>}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(cat)} size="small" color="primary">
                            <EditIcon className="text-blue-500"/>
                          </IconButton>
                          <IconButton onClick={() => handleDelete(cat.id)} size="small" color="error">
                            <DeleteIcon className="text-green-500"/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Mobile cards - same as your original */}
            <div className="lg:hidden space-y-4 p-4">
              {categories.map((cat, i) => (
                <Paper key={cat.id} elevation={2} sx={{ borderRadius: "16px", p: 3 }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography variant="caption" color="text.secondary">
                        #{i + 1}
                      </Typography>
                      <Typography variant="h6" color="#FF5252">
                        {cat.name}
                      </Typography>
                      {cat.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {cat.description}
                        </Typography>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <IconButton size="small" onClick={() => handleEdit(cat)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(cat.id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                  {cat.categoryImage && (
                    <img
                      src={cat.categoryImage}
                      alt={cat.name}
                      className="mt-3 h-48 w-full object-cover rounded-xl"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")}
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
        PaperProps={{ sx: { borderRadius: "16px" ,overflow:"hidden"} }}
      >
        <DialogTitle sx={{ bgcolor: "#FF5252", color: "white", pb: 1 }}>
          <div className="flex items-center gap-3">
            <CategoryIcon />
            <span>{mode === "add" ? "Add New Category" : "Edit Category"}</span>
          </div>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Category Name *"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              placeholder="Optional brief description..."
            />

            <div>
              <Typography variant="subtitle2" gutterBottom>
                Category Image {mode === "add" && <span style={{ color: "red" }}>*</span>}
              </Typography>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="category-image"
                style={{ display: "none" }}
              />
              <label htmlFor="category-image">
                <Box
                  sx={{
                    border: `2px dashed ${errors.categoryImage ? "#ef4444" : "#d1d5db"}`,
                    borderRadius: "12px",
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: "grey.50",
                    "&:hover": { bgcolor: "grey.100", borderColor: "#FF5252" },
                  }}
                >
                  <IoMdCamera size={48} className="mx-auto mb-2 text-gray-400" />
                  <Typography variant="body1" fontWeight="medium">
                    {categoryImage ? "Change image" : currentImage ? "Update image" : "Click to upload image"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG, WEBP 
                  </Typography>
                </Box>
              </label>

              {errors.categoryImage && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                  {errors.categoryImage}
                </Typography>
              )}

              {currentImage && (
                <Box sx={{ mt: 3, position: "relative", display: "inline-block" }}>
                  <img
                    src={currentImage}
                    alt="preview"
                    style={{ maxHeight: "180px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
                  />
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      minWidth: "auto",
                      p: 0.5,
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      setCategoryImage(null);
                      setCurrentImage("");
                    }}
                  >
                    ×
                  </Button>
                </Box>
              )}
            </div>
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

export default Category;