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
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Divider,
// } from "@mui/material";

// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CategoryIcon from "@mui/icons-material/Category";
// import AddIcon from "@mui/icons-material/Add";

// import axiosInstance from "../api/axiosInstance";
// import { RestaurantContext } from "../context/getRestaurant";
// import { CategoriesContext } from "../context/GetAllCategories";
// import { IoMdCamera } from "react-icons/io";
// import { MdDelete } from "react-icons/md";

// const Category = () => {
//   const { restaurant } = useContext(RestaurantContext);
//   const { categories, loading: contextLoading, fetchCategories } = useContext(CategoriesContext);

//   // Modal & form states
//   const [openModal, setOpenModal] = useState(false);
//   const [mode, setMode] = useState("add"); // "add" | "edit"

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

//   const resetForm = () => {
//     setName("");
//     setDescription("");
//     setCategoryImage(null);
//     setCurrentImage("");
//     setEditId(null);
//     setErrors({});
//     setMode("add");
//   };

//   const openAddModal = () => {
//     resetForm();
//     setOpenModal(true);
//   };

//   const handleEdit = (cat) => {
//     setName(cat.name);
//     setDescription(cat.description || "");
//     setCurrentImage(cat.categoryImage || "");
//     setCategoryImage(null);
//     setEditId(cat.id);
//     setMode("edit");
//     setOpenModal(true);
//     setErrors({});
//     setErrorMsg("");
//     setSuccessMsg("");
//   };

//   const closeModal = () => {
//     setOpenModal(false);
//     resetForm();
//   };

//   // ─── VALIDATION ───
//   const validate = () => {
//     const err = {};

//     if (!name.trim()) {
//       err.name = "Category name is required";
//     } else if (name.trim().length < 2) {
//       err.name = "Category name must be at least 2 characters";
//     } else if (name.trim().length > 50) {
//       err.name = "Category name must not exceed 50 characters";
//     }

//     if (mode === "add" && !categoryImage) {
//       err.categoryImage = "Category image is required";
//     }

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   // ─── IMAGE HANDLER ───
//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setErrors((prev) => ({ ...prev, categoryImage: "" }));

//     const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
//     if (!validTypes.includes(file.type)) {
//       setErrors((prev) => ({
//         ...prev,
//         categoryImage: "Please upload a valid image (JPG, PNG, WEBP, or GIF)",
//       }));
//       return;
//     }

//     const maxSize = 5 * 1024 * 1024;
//     if (file.size > maxSize) {
//       setErrors((prev) => ({
//         ...prev,
//         categoryImage: "Image size must not exceed 5MB",
//       }));
//       return;
//     }

//     setCategoryImage(file);
//     setCurrentImage(URL.createObjectURL(file));
//   };

//   // ─── API CALLS ───
//   const handleSubmit = async (e) => {
//     e.preventDefault();
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
//     const config = {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     try {
//       if (mode === "add") {
//         await axiosInstance.post(`/categories/${restaurant?.id}`, formData, config);
//         setSuccessMsg("Category created successfully!");
//       } else {
//         await axiosInstance.put(`/categories/${editId}`, formData, config);
//         setSuccessMsg("Category updated successfully!");
//       }

//       closeModal();
//       await fetchCategories();
//     } catch (error) {
//       console.error("Error:", error);

//       let msg = "Failed to save category. Please try again.";
//       if (error?.response?.data?.message) msg = error.response.data.message;
//       else if (error?.response?.status === 413) msg = "Image file is too large.";
//       else if (error?.response?.status === 401) msg = "Authentication failed. Please login again.";
//       else if (error?.message === "Network Error") msg = "Network error. Check your connection.";

//       setErrorMsg(msg);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ─── DELETE ─── (same as before)
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
//       let msg = "Failed to delete category.";
//       if (error?.response?.status === 400) msg = "Cannot delete — category may have menu items.";
//       else if (error?.response?.status === 401) msg = "Please login again.";
//       setErrorMsg(msg);
//     }
//   };

//   if (!restaurant?.id) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md text-center">
//           <CategoryIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
//           <Typography variant="h5" className="font-bold text-gray-800 mb-2">
//             Restaurant Required
//           </Typography>
//           <Typography variant="body1" className="text-gray-600">
//             Please select or load a restaurant first.
//           </Typography>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 font-['Poppins'] p-4 sm:p-6 lg:p-8">
//       {/* Messages (global) */}
//       {successMsg && (
//         <Alert severity="success" sx={{ mb: 3, maxWidth: "lg", mx: "auto" }} onClose={() => setSuccessMsg("")}>
//           {successMsg}
//         </Alert>
//       )}
//       {errorMsg && (
//         <Alert severity="error" sx={{ mb: 3, maxWidth: "lg", mx: "auto" }} onClose={() => setErrorMsg("")}>
//           {errorMsg}
//         </Alert>
//       )}

//       <div className="max-w-7xl mx-auto">
//         {/* Header + Add Button */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <div>
//             <Typography variant="h4" className="font-bold text-gray-800">
//               Menu your Categories
//             </Typography>
//             <Typography variant="body2" className="text-gray-600">
//               Organize your dishes into meaningful groups
//             </Typography>
//           </div>

//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={openAddModal}
//             sx={{
//               bgcolor: "#FF5252",
//               "&:hover": { bgcolor: "#e03e3e" },
//               borderRadius: "12px",
//               px: 4,
//               py: 1.2,
//               fontWeight: 600,
//             }}
//           >
//             Add Category
//           </Button>
//         </div>

//         {/* ─── CATEGORIES LIST ─── */}
//         {contextLoading ? (
//           <div className="flex justify-center items-center py-20">
//             <CircularProgress sx={{ color: "#FF5252" }} size={60} />
//           </div>
//         ) : !categories?.length ? (
//           <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px", bgcolor: "white" }}>
//             <CategoryIcon sx={{ fontSize: 80, color: "orange", mb: 2, opacity: 0.6 }} />
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               No categories yet
//             </Typography>
//             <Typography color="text.secondary" sx={{ mb: 3 }}>
//               Create your first category to start organizing your menu
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={openAddModal}
//               sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}
//             >
//               Add Your First Category
//             </Button>
//           </Paper>
//         ) : (
//           // Your existing table + mobile cards (kept same, just showing structure)
//           <Paper sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: 3 }}>
//             {/* Desktop Table - same as your original */}
//             <div className="hidden lg:block">
//               <TableContainer>
//                 <Table>
//                   <TableHead sx={{ bgcolor: "#FF5252" }}>
//                     <TableRow>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Image</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
//                       <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
//                         Actions
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {categories.map((cat, i) => (
//                       <TableRow key={cat.id} hover>
//                         <TableCell>{i + 1}</TableCell>
//                         <TableCell>
//                           {cat.categoryImage ? (
//                             <img
//                               src={cat.categoryImage}
//                               alt={cat.name}
//                               className="h-16 w-16 object-cover rounded-lg"
//                               onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=?")}
//                             />
//                           ) : (
//                             <Box className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
//                               No image
//                             </Box>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <Typography fontWeight="medium" color="#FF5252">
//                             {cat.name}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           {cat.description || <em className="text-gray-400">No description</em>}
//                         </TableCell>
//                         <TableCell align="right">
//                           <IconButton onClick={() => handleEdit(cat)} size="small" color="primary">
//                             <EditIcon className="text-blue-500" />
//                           </IconButton>
//                           <IconButton onClick={() => handleDelete(cat.id)} size="small" color="error">
//                             <DeleteIcon className="text-green-500" />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </div>

//             {/* Mobile cards - same as your original */}
//             <div className="lg:hidden space-y-4 p-4">
//               {categories.map((cat, i) => (
//                 <Paper key={cat.id} elevation={2} sx={{ borderRadius: "16px", p: 3 }}>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <Typography variant="caption" color="text.secondary">
//                         {i + 1}
//                       </Typography>
//                       <Typography variant="h6" color="#FF5252">
//                         {cat.name}
//                       </Typography>
//                       {cat.description && (
//                         <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                           {cat.description}
//                         </Typography>
//                       )}
//                     </div>
//                     <div className="flex gap-1">
//                       <IconButton size="small" onClick={() => handleEdit(cat)}>
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton size="small" onClick={() => handleDelete(cat.id)} color="error">
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </div>
//                   </div>
//                   {cat.categoryImage && (
//                     <img
//                       src={cat.categoryImage}
//                       alt={cat.name}
//                       className="mt-3 h-48 w-full object-cover rounded-xl"
//                       onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")}
//                     />
//                   )}
//                 </Paper>
//               ))}
//             </div>
//           </Paper>
//         )}
//       </div>

//       {/* ─── ADD / EDIT MODAL ─── */}
// <Dialog
//   open={openModal}
//   onClose={closeModal}
//   maxWidth="sm"
//   fullWidth
//   scroll="paper"   // ✅ correct scroll behavior
//   PaperProps={{
//     sx: {
//       borderRadius: "16px",
//       overflow: "hidden",
//     },
//   }}
// >
//   {/* HEADER */}
//   <DialogTitle sx={{ bgcolor: "#FF5252", color: "white", pb: 1 }}>
//     <div className="flex items-center gap-3">
//       <CategoryIcon />
//       <span>{mode === "add" ? "Add New Category" : "Edit Category"}</span>
//     </div>
//   </DialogTitle>

//   {/* CONTENT */}
//   <DialogContent
//     dividers
//     sx={{
//       pt: 3,
//       maxHeight: "60vh",
//       overflowY: "auto",

//       /* 🔥 HIDE SCROLLBAR */
//       scrollbarWidth: "none",            // Firefox
//       "&::-webkit-scrollbar": {
//         display: "none",                 // Chrome, Safari
//       },
//     }}
//   >
//     <Box
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 3,
//       }}
//     >
//       <TextField
//         label="Category Name *"
//         value={name}
//         onChange={(e) => {
//           setName(e.target.value);
//           if (errors.name) {
//             setErrors((prev) => ({ ...prev, name: "" }));
//           }
//         }}
//         error={!!errors.name}
//         helperText={errors.name}
//         fullWidth
//       />

//       <TextField
//         label="Description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         multiline
//         rows={3}
//         fullWidth
//         placeholder="Optional brief description..."
//       />

//       <div>
//         <Typography variant="subtitle2" gutterBottom>
//           Category Image {mode === "add" && <span style={{ color: "red" }}>*</span>}
//         </Typography>

//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           id="category-image"
//           hidden
//         />

//         <label htmlFor="category-image">
//           <Box
//             sx={{
//               border: `2px dashed ${errors.categoryImage ? "#ef4444" : "#d1d5db"}`,
//               borderRadius: "12px",
//               p: 4,
//               textAlign: "center",
//               cursor: "pointer",
//               bgcolor: "grey.50",
//               "&:hover": { bgcolor: "grey.100", borderColor: "#FF5252" },
//             }}
//           >
//             <IoMdCamera size={48} className="mx-auto mb-2 text-gray-400" />
//             <Typography variant="body1" fontWeight="medium">
//               {categoryImage
//                 ? "Change image"
//                 : currentImage
//                 ? "Update image"
//                 : "Click to upload image"}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               PNG, JPG, WEBP
//             </Typography>
//           </Box>
//         </label>

//         {errors.categoryImage && (
//           <Typography
//             color="error"
//             variant="caption"
//             sx={{ mt: 1, display: "block" }}
//           >
//             {errors.categoryImage}
//           </Typography>
//         )}

//         {currentImage && (
//           <Box sx={{ mt: 3, position: "relative", display: "inline-block" }}>
//             <img
//               src={currentImage}
//               alt="preview"
//               style={{
//                 maxHeight: "180px",
//                 borderRadius: "12px",
//                 boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//               }}
//             />
//             <Button
//               size="small"
//               color="error"
//               variant="contained"
//               sx={{
//                 position: "absolute",
//                 top: 8,
//                 right: 8,
//                 minWidth: "auto",
//                 p: 0.5,
//                 borderRadius: "50%",
//               }}
//               onClick={() => {
//                 setCategoryImage(null);
//                 setCurrentImage("");
//               }}
//             >
//               <MdDelete size={20}/>
//             </Button>
//           </Box>
//         )}
//       </div>
//     </Box>
//   </DialogContent>

//   {/* FOOTER */}
//   <DialogActions sx={{ px: 3, py: 2 }}>
//     <Button onClick={closeModal} disabled={isSaving}>
//       Cancel
//     </Button>

//     <Button
//       variant="contained"
//       onClick={handleSubmit}
//       disabled={isSaving}
//       sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}
//       startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
//     >
//       {isSaving
//         ? mode === "add"
//           ? "Creating..."
//           : "Updating..."
//         : mode === "add"
//         ? "Create"
//         : "Update"}
//     </Button>
//   </DialogActions>
// </Dialog>


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
import { MdDelete } from "react-icons/md";

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

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ─── IMAGE HANDLER ───
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrors((prev) => ({ ...prev, categoryImage: "" }));

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
      const msg = error?.response?.data?.message || "Something went wrong.";
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
      const msg =error?.response?.data?.message ||"Something went wrong. Please try again.";
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
              Add, edit and organize your menu categories
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
                            <EditIcon className="text-blue-500" />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(cat.id)} size="small" color="error">
                            <DeleteIcon className="text-green-500" />
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
                        {i + 1}
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
        scroll="paper"   // ✅ correct scroll behavior
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle sx={{ bgcolor: "#FF5252", color: "white", pb: 1 }}>
          <div className="flex items-center gap-3">
            <CategoryIcon />
            <span>{mode === "add" ? "Add New Category" : "Edit Category"}</span>
          </div>
        </DialogTitle>

        {/* CONTENT */}
        <DialogContent
          dividers
          sx={{
            pt: 3,
            maxHeight: "60vh",
            overflowY: "auto",

            /* 🔥 HIDE SCROLLBAR */
            scrollbarWidth: "none",            // Firefox
            "&::-webkit-scrollbar": {
              display: "none",                 // Chrome, Safari
            },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              label="Category Name *"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
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
                hidden
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
                    {categoryImage
                      ? "Change image"
                      : currentImage
                        ? "Update image"
                        : "Click to upload image"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                  
                  </Typography>
                </Box>
              </label>

              {errors.categoryImage && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ mt: 1, display: "block" }}
                >
                  {errors.categoryImage}
                </Typography>
              )}

              {currentImage && (
                <Box sx={{ mt: 3, position: "relative", display: "inline-block" }}>
                  <img
                    src={currentImage}
                    alt="preview"
                    style={{
                      maxHeight: "180px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
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
                      setCategoryImage(null);
                      setCurrentImage("");
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>

                </Box>
              )}
            </div>
          </Box>
        </DialogContent>

        {/* FOOTER */}
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
            {isSaving
              ? mode === "add"
                ? "Creating..."
                : "Updating..."
              : mode === "add"
                ? "Create"
                : "Update"}
          </Button>
        </DialogActions>
      </Dialog>


    </div>
  );
};

export default Category;