// import React, { useContext, useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   TextField,
//   Box,
//   CircularProgress,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   Alert,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Switch,
// } from "@mui/material";

// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
// import { IoMdCamera } from "react-icons/io";

// import axiosInstance from "../api/axiosInstance";
// import { RestaurantContext } from "../context/getRestaurant";
// import { CategoriesContext } from "../context/GetAllCategories";

// const SubCategory = () => {
//   const { restaurant } = useContext(RestaurantContext);
//   const { categories } = useContext(CategoriesContext);
//   console.log("All categoies=>",categories)
//   const [allSubCategories, setAllSubCategories] = useState([]);
//   const [displayedSubCategories, setDisplayedSubCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filterCategory, setFilterCategory] = useState("all");

//   // Modal & form states
//   const [openModal, setOpenModal] = useState(false);
//   const [mode, setMode] = useState("add"); // "add" | "edit"

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
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

//   // Fetch ALL subcategories once restaurant is loaded
//   useEffect(() => {
//     if (restaurant?.id) {
//       fetchAllSubCategories();
//     }
//   }, [restaurant?.id]);

//   // Apply filter
//   useEffect(() => {
//     if (filterCategory === "all") {
//       setDisplayedSubCategories(allSubCategories);
//     } else {
//       const filtered = allSubCategories.filter((sc) => sc.category_id === filterCategory);
//       setDisplayedSubCategories(filtered);
//     }
//   }, [filterCategory, allSubCategories]);

//   const fetchAllSubCategories = async () => {
//     if (!categories?.length) return;

//     setLoading(true);
//     const token = localStorage.getItem("token");

//     try {
//       const promises = categories.map((cat) =>
//         axiosInstance
//           .get(`/subcategories/${cat.id}/sub-categories`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//           .catch(() => ({ data: [] }))
//       );

//       const results = await Promise.all(promises);
//       const combined = results.flatMap((res) => res.data.data || []);
//       setAllSubCategories(combined);
//     } catch (err) {
//       console.error("Failed to load subcategories", err);
//       setAllSubCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setName("");
//     setDescription("");
//     setSelectedCategory("");
//     setImage(null);
//     setCurrentImage("");
//     setEditId(null);
//     setErrors({});
//     setMode("add");
//   };

//   const openAddModal = () => {
//     resetForm();
//     setOpenModal(true);
//   };

//   const handleEdit = async (subcat) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axiosInstance.get(`/subcategories/${subcat.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = res.data;
//       setName(data.name);
//       setDescription(data.description || "");
//       setSelectedCategory(data.category_id);
//       setCurrentImage(data.image || "");
//       setImage(null);
//       setEditId(data.id);
//       setMode("edit");
//       setOpenModal(true);
//       setErrors({});
//     } catch (err) {
//       const msg = err?.response?.data?.message || "Failed to load sub-category details";
//       setErrorMsg(msg);
//     }
//   };

//   const closeModal = () => {
//     setOpenModal(false);
//     resetForm();
//   };

//   const validate = () => {
//     const err = {};
//     if (!name.trim()) err.name = "Sub-category name is required";
//     if (!selectedCategory) err.category = "Please select a category";
//     if (mode === "add" && !image) err.image = "Sub-category image is required";

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setImage(file);
//     setCurrentImage(URL.createObjectURL(file));
//     setErrors((prev) => ({ ...prev, image: "" }));
//   };

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
//     if (image) formData.append("image", image);

//     const token = localStorage.getItem("token");
//     const config = {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     try {
//       if (mode === "add") {
//         await axiosInstance.post(
//           `/subcategories/${restaurant?.id}/categories/${selectedCategory}/sub-categories`,
//           formData,
//           config
//         );
//         setSuccessMsg("Sub-category created successfully!");
//       } else {
//         await axiosInstance.put(`/subcategories/${editId}`, formData, config);
//         setSuccessMsg("Sub-category updated successfully!");
//       }

//       closeModal();
//       await fetchAllSubCategories();
//     } catch (err) {
//        const msg = err?.response?.data?.message || "Something went wrong!";
//       setErrorMsg(msg);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this sub-category?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axiosInstance.delete(`/subcategories/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuccessMsg("Sub-category deleted successfully");
//       await fetchAllSubCategories();
//     } catch (err) {
//       setErrorMsg(err?.response?.data?.message || "Failed to delete sub-category");
//     }
//   };

// //update status Fuction Here

// const UpadateSubCategaryStatus=async (id,currentStatus) => {
//   const newStatus = !currentStatus;
//   const token = localStorage.getItem("token");
//   try {
//     await axiosInstance.patch(`/subcategories/${id}/status`, { is_active: newStatus }, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   } catch (error) {
//      console.log(error);
//   }
// }


//   const getCategoryName = (catId) => {
//     return categories?.find((c) => c.id === catId)?.name || "Unknown";
//   };

//   if (!restaurant?.id) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md text-center">
//           <SubdirectoryArrowRightIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
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
//       {/* Global Messages */}
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
//               Sub-Categories
//             </Typography>
//             <Typography variant="body2" className="text-gray-600">
//               Organize items within the selected category
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
//             Add Sub-Category
//           </Button>
//         </div>

//         {/* Filter */}
//         <Paper sx={{ p: 3, mb: 4, borderRadius: "16px" }}>
//           <FormControl size="small" sx={{ minWidth: 280 }}>
//             <InputLabel>Filter by Category</InputLabel>
//             <Select
//               value={filterCategory}
//               label="Filter by Category"
//               onChange={(e) => setFilterCategory(e.target.value)}
//             >
//               <MenuItem value="all">
//                 <em>All Sub-Categories</em>
//               </MenuItem>
//               {categories?.map((cat) => (
//                 <MenuItem key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {filterCategory !== "all" && (
//             <Chip
//               label={`Filtered: ${getCategoryName(filterCategory)}`}
//               onDelete={() => setFilterCategory("all")}
//               color="primary"
//               sx={{ ml: 2 }}
//             />
//           )}
//         </Paper>

//         {/* List */}
//         {loading ? (
//           <Box display="flex" justifyContent="center" py={10}>
//             <CircularProgress sx={{ color: "#FF5252" }} size={60} />
//           </Box>
//         ) : displayedSubCategories.length === 0 ? (
//           <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px" }}>
//             <SubdirectoryArrowRightIcon sx={{ fontSize: 80, color: "#FF5252", opacity: 0.4, mb: 2 }} />
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               No sub-categories found
//             </Typography>
//             <Typography color="text.secondary" sx={{ mb: 3 }}>
//               {filterCategory === "all"
//                 ? "Add your first sub-category to get started"
//                 : `No sub-categories in ${getCategoryName(filterCategory)}`}
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={openAddModal}
//               sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}
//             >
//               Add Sub-Category
//             </Button>
//           </Paper>
//         ) : (
//           <Paper sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: 3 }}>
//             {/* Desktop Table */}
//             <div className="hidden lg:block">
//               <TableContainer>
//                 <Table>
//                   <TableHead sx={{ bgcolor: "#FF5252" }}>
//                     <TableRow>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Image</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
//                       <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
//                         Actions
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {displayedSubCategories.map((sc, i) => (
//                       <TableRow key={sc.id} hover>
//                         <TableCell>{i + 1}</TableCell>
//                         <TableCell>
//                           {sc.image ? (
//                             <img
//                               src={sc.image}
//                               alt={sc.name}
//                               style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
//                               onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=?")}
//                             />
//                           ) : (
//                             <Box
//                               sx={{
//                                 width: 64,
//                                 height: 64,
//                                 bgcolor: "grey.100",
//                                 borderRadius: 1,
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 fontSize: "0.75rem",
//                                 color: "text.secondary",
//                               }}
//                             >
//                               No image
//                             </Box>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <Typography fontWeight="medium" color="#FF5252">
//                             {sc.name}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           {sc.description || <em className="text-gray-400">No description</em>}
//                         </TableCell>
//                         <TableCell>
//                           <Chip label={getCategoryName(sc.category_id)} size="small" color="primary" />
//                         </TableCell>
//                          <TableCell>
//                          <Typography variant="body2" color="text.secondary">
//                           Active
//                          </Typography>

//                          <Switch
//                             checked={sc.is_active}
//                             color="primary"
//                             onChange={() => updateStatus(sc.id, sc.is_active)}

//                           />

//                          </TableCell>
//                         <TableCell align="right">
//                           <IconButton onClick={() => handleEdit(sc)} size="small" color="primary">
//                             <EditIcon />
//                           </IconButton>
//                           <IconButton onClick={() => handleDelete(sc.id)} size="small" color="error">
//                             <DeleteIcon className="text-green-500"/>
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </div>

//             {/* Mobile Cards */}
//             <div className="lg:hidden space-y-4 p-4">
//               {displayedSubCategories.map((sc, i) => (
//                 <Paper key={sc.id} elevation={2} sx={{ borderRadius: "16px", p: 3 }}>
//                   <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
//                     <Box>
//                       <Typography variant="caption" color="text.secondary">
//                         {i + 1}
//                       </Typography>
//                       <Typography variant="h6" color="#FF5252">
//                         {sc.name}
//                       </Typography>
//                       <Chip
//                         label={getCategoryName(sc.category_id)}
//                         size="small"
//                         sx={{ mt: 1 }}
//                       />
//                     </Box>

//                     <Box>
//                       <IconButton size="small" onClick={() => handleEdit(sc)}>
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton size="small" onClick={() => handleDelete(sc.id)} color="error">
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   </Box>

//                   {sc.description && (
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                       {sc.description}
//                     </Typography>
//                   )}

//                   {sc.image && (
//                     <img
//                       src={sc.image}
//                       alt={sc.name}
//                       style={{
//                         width: "100%",
//                         height: 180,
//                         objectFit: "cover",
//                         borderRadius: 12,
//                         marginTop: 8,
//                       }}
//                       onError={(e) => (e.target.src = "https://via.placeholder.com/300x180?text=No+Image")}
//                     />
//                   )}
//                 </Paper>
//               ))}
//             </div>
//           </Paper>
//         )}
//       </div>

//       {/* ─── ADD / EDIT MODAL ─── */}
//      <Dialog
//   open={openModal}
//   onClose={closeModal}
//   maxWidth="sm"
//   fullWidth
//   scroll="paper"          // 🔥 IMPORTANT: prevents dialog jump
//   keepMounted             // 🔥 IMPORTANT: prevents re-render shift
//   PaperProps={{
//     sx: {
//       borderRadius: "16px",
//       overflow: "hidden",
//     },
//   }}
// >
//   {/* HEADER */}
//   <DialogTitle
//     sx={{
//       bgcolor: "#FF5252",
//       color: "white",
//       position: "sticky",
//       top: 0,
//       zIndex: 1,
//     }}
//   >
//     <Box display="flex" alignItems="center" gap={2}>
//       <SubdirectoryArrowRightIcon />
//       <span>{mode === "add" ? "Add New Sub-Category" : "Edit Sub-Category"}</span>
//     </Box>
//   </DialogTitle>

//   {/* CONTENT */}
//   <DialogContent
//     sx={{
//       p: 0,
//       overflow: "hidden",
//     }}
//   >
//     <Box
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{
//         px: 3,
//         pt: 3,
//         pb: 2,
//         display: "flex",
//         flexDirection: "column",
//         gap: 3,
//         maxHeight: "60vh",
//         overflowY: "auto",
//         scrollbarWidth: "none",
//         "&::-webkit-scrollbar": { display: "none" },
//       }}
//     >
//       {/* Category */}
//       <FormControl fullWidth error={!!errors.category}>
//         <InputLabel>Select Category *</InputLabel>
//         <Select
//           value={selectedCategory}
//           label="Select Category *"
//           onChange={(e) => {
//             setSelectedCategory(e.target.value);
//             if (errors.category) setErrors((p) => ({ ...p, category: "" }));
//           }}
//           MenuProps={{
//             disablePortal: false,
//             container: document.body,     // 🔥 FIX dropdown clipping
//             PaperProps: {
//               sx: {
//                 maxHeight: 260,
//                 zIndex: 2000,
//               },
//             },
//           }}
//         >
//           {categories?.map((cat) => (
//             <MenuItem key={cat.id} value={cat.id}>
//               {cat.name}
//             </MenuItem>
//           ))}
//         </Select>
//         {errors.category && (
//           <Typography color="error" variant="caption">
//             {errors.category}
//           </Typography>
//         )}
//       </FormControl>

//       {/* Name */}
//       <TextField
//         label="Sub-Category Name *"
//         value={name}
//         onChange={(e) => {
//           setName(e.target.value);
//           if (errors.name) setErrors((p) => ({ ...p, name: "" }));
//         }}
//         error={!!errors.name}
//         helperText={errors.name}
//         fullWidth
//       />

//       {/* Description */}
//       <TextField
//         label="Description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         multiline
//         rows={3}
//         fullWidth
//         placeholder="Optional brief description..."
//       />

//       {/* Image */}
//       <Box>
//         <Typography variant="subtitle2" gutterBottom>
//           Sub-Category Image {mode === "add" && <span style={{ color: "red" }}>*</span>}
//         </Typography>

//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           id="subcat-image"
//           style={{ display: "none" }}
//         />

//         <label htmlFor="subcat-image">
//   <Box
//     sx={{
//       border: `2px dashed ${errors.image ? "#ef4444" : "#d1d5db"}`,
//       borderRadius: "12px",
//       height: 200, // fixed height important
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "center",   // vertical center
//       alignItems: "center",       // horizontal center
//       textAlign: "center",
//       cursor: "pointer",
//       bgcolor: "grey.50",
//       transition: "0.2s",
//       "&:hover": {
//         borderColor: "#FF5252",
//         bgcolor: "grey.100",
//       },
//     }}
//   >
//     <IoMdCamera
//       size={50}
//       style={{ color: "#9ca3af", marginBottom: 8 }}
//     />

//     <Typography fontWeight="medium">
//       {image
//         ? "Change image"
//         : currentImage
//         ? "Update image"
//         : "Click to upload image"}
//     </Typography>
//   </Box>
// </label>


//         {errors.image && (
//           <Typography color="error" variant="caption" sx={{ mt: 1 }}>
//             {errors.image}
//           </Typography>
//         )}

//         {currentImage && (
//           <Box sx={{ mt: 3, position: "relative", display: "inline-block" }}>
//             <img
//               src={currentImage}
//               alt="preview"
//               style={{
//                 maxHeight: 180,
//                 borderRadius: 12,
//                 boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//               }}
//             />
//             <IconButton
//               size="small"
//               color="error"
//               sx={{
//                 position: "absolute",
//                 top: 8,
//                 right: 8,
//                 bgcolor: "white",
//                 boxShadow: 1,
//               }}
//               onClick={() => {
//                 setImage(null);
//                 setCurrentImage("");
//               }}
//             >
//               <DeleteIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   </DialogContent>

//   {/* FOOTER */}
//   <DialogActions
//     sx={{
//       px: 3,
//       py: 2,
//       position: "sticky",
//       bottom: 0,
//       bgcolor: "white",
//       borderTop: "1px solid #eee",
//     }}
//   >
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

// export default SubCategory;


import React, { useContext, useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, TextField, Box, CircularProgress, FormControl,
  InputLabel, Select, MenuItem, Chip, Alert, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Switch, Pagination, Stack,
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
  const { categories } = useContext(CategoriesContext); // sirf current page ki categories (filter/modal ke liye)

  // Sabhi categories (pagination ignore karke) — subcategory fetch ke liye
  const [allCategories, setAllCategories] = useState([]);

  const [allSubCategories, setAllSubCategories] = useState([]);
  const [displayedSubCategories, setDisplayedSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  const [paginationMap, setPaginationMap] = useState({});
  const [allPage, setAllPage] = useState(1);
  const ALL_LIMIT = 10;

  // Modal & form states
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add");
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

  useEffect(() => {
    if (successMsg || errorMsg) {
      const t = setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 5000);
      return () => clearTimeout(t);
    }
  }, [successMsg, errorMsg]);

  // ─── Step 1: Sabhi categories fetch karo (bina pagination ke) ───
  // Taaki har category ki subcategories load ho sakein
  const fetchAllCategoriesUnpaginated = async () => {
    if (!restaurant?.id) return [];
    const token = localStorage.getItem("token");
    try {
      // Pehle total count pata karo
      const firstRes = await axiosInstance.get(`/categories/${restaurant.id}`, {
        params: { page: 1, limit: 100 }, // bada limit dalo saari ek baar mein aaye
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = firstRes.data.data || [];
      const pagination = firstRes.data.pagination;

      // Agar ek page mein aa gayi saari toh return
      if (pagination.totalPages <= 1) {
        return data;
      }

      // Warna baaki pages bhi fetch karo
      const remainingPages = [];
      for (let p = 2; p <= pagination.totalPages; p++) {
        remainingPages.push(p);
      }

      const moreResults = await Promise.all(
        remainingPages.map((p) =>
          axiosInstance
            .get(`/categories/${restaurant.id}`, {
              params: { page: p, limit: 100 },
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => r.data.data || [])
            .catch(() => [])
        )
      );

      return [...data, ...moreResults.flat()];
    } catch (err) {
      console.error("Failed to fetch all categories", err);
      return [];
    }
  };

  // ─── Step 2: Har category ki subcategories fetch karo ───
  const fetchSubCategoriesByCategory = async (catId, page = 1) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axiosInstance.get(`/subcategories/${catId}/sub-categories`, {
        params: { page, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        data: res.data.data || [],
        pagination: res.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
      };
    } catch {
      return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } };
    }
  };

  // ─── Main fetch: Saari categories ki page-1 subcategories ───
  const fetchAllSubCategories = async () => {
    setLoading(true);
    try {
      // Pehle saari categories lo (pagination ignore)
      const allCats = await fetchAllCategoriesUnpaginated();
      setAllCategories(allCats);

      if (!allCats.length) {
        setAllSubCategories([]);
        setLoading(false);
        return;
      }

      // Phir har category ki subcategories lo
      const token = localStorage.getItem("token");
      const promises = allCats.map((cat) =>
        axiosInstance
          .get(`/subcategories/${cat.id}/sub-categories`, {
            params: { page: 1, limit: 10 },
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => ({
            catId: cat.id,
            data: res.data.data || [],
            pagination: res.data.pagination,
          }))
          .catch(() => ({
            catId: cat.id,
            data: [],
            pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
          }))
      );

      const results = await Promise.all(promises);
      const combined = results.flatMap((r) => r.data);

      const newPaginationMap = {};
      results.forEach((r) => { newPaginationMap[r.catId] = r.pagination; });

      setAllSubCategories(combined);
      setPaginationMap(newPaginationMap);
      setAllPage(1);
    } catch (err) {
      console.error("Failed to load subcategories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant?.id) {
      fetchAllSubCategories();
    }
  }, [restaurant?.id]);

  // ─── Display filter + pagination ───
  useEffect(() => {
    if (filterCategory === "all") {
      const start = (allPage - 1) * ALL_LIMIT;
      setDisplayedSubCategories(allSubCategories.slice(start, start + ALL_LIMIT));
    } else {
      setDisplayedSubCategories(allSubCategories.filter((sc) => sc.category_id === filterCategory));
    }
  }, [filterCategory, allSubCategories, allPage]);

  useEffect(() => { setAllPage(1); }, [filterCategory]);

  const handleCategoryPageChange = async (_, newPage) => {
    if (filterCategory === "all") {
      setAllPage(newPage);
      return;
    }
    setLoading(true);
    const { data, pagination } = await fetchSubCategoriesByCategory(filterCategory, newPage);
    setAllSubCategories((prev) => {
      const others = prev.filter((sc) => sc.category_id !== filterCategory);
      return [...others, ...data];
    });
    setPaginationMap((prev) => ({ ...prev, [filterCategory]: pagination }));
    setLoading(false);
  };

  const getCurrentPagination = () => {
    if (filterCategory === "all") {
      const total = allSubCategories.length;
      return { page: allPage, totalPages: Math.ceil(total / ALL_LIMIT) || 1, total, limit: ALL_LIMIT };
    }
    return paginationMap[filterCategory] || { page: 1, totalPages: 1, total: 0, limit: 10 };
  };

  const currentPagination = getCurrentPagination();

  // ─── Form helpers ───
  const resetForm = () => {
    setName(""); setDescription(""); setSelectedCategory("");
    setImage(null); setCurrentImage(""); setEditId(null);
    setErrors({}); setMode("add");
  };

  const openAddModal = () => { resetForm(); setOpenModal(true); };

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
      setErrorMsg(err?.response?.data?.message || "Failed to load sub-category details");
    }
  };

  const closeModal = () => { setOpenModal(false); resetForm(); };

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
    setImage(file);
    setCurrentImage(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { setErrorMsg("Please fix the errors before submitting"); return; }
    setIsSaving(true); setErrorMsg(""); setSuccessMsg("");
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    if (image) formData.append("image", image);
    const token = localStorage.getItem("token");
    const config = { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } };
    try {
      if (mode === "add") {
        await axiosInstance.post(
          `/subcategories/${restaurant?.id}/categories/${selectedCategory}/sub-categories`,
          formData, config
        );
        setSuccessMsg("Sub-category created successfully!");
      } else {
        await axiosInstance.put(`/subcategories/${editId}`, formData, config);
        setSuccessMsg("Sub-category updated successfully!");
      }
      closeModal();
      await fetchAllSubCategories();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Something went wrong!");
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

  const updateStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const token = localStorage.getItem("token");
    setAllSubCategories((prev) =>
      prev.map((sc) => sc.id === id ? { ...sc, is_active: newStatus } : sc)
    );
    try {
      await axiosInstance.patch(
        `/subcategories/${id}/status`,
        { is_active: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update status", err);
      setAllSubCategories((prev) =>
        prev.map((sc) => sc.id === id ? { ...sc, is_active: currentStatus } : sc)
      );
      setErrorMsg("Failed to update status. Please try again.");
    }
  };

  // allCategories (unpaginated) use karo getName ke liye
  const getCategoryName = (catId) =>
    allCategories.find((c) => c.id === catId)?.name ||
    categories?.find((c) => c.id === catId)?.name ||
    "Unknown";
//categroires context ki tab use hogi tab getCategory namenhi he tab use hogi 

  const statusSwitch = (sc) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Switch
        checked={Boolean(sc.is_active)}
        onChange={() => updateStatus(sc.id, sc.is_active)}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: "#2563EB" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#2563EB" },
        }}
      />
      <Chip
        label={sc.is_active ? "Active" : "Inactive"}
        size="small"
        sx={{
          bgcolor: sc.is_active ? "#e8f5e9" : "#fce4ec",
          color: sc.is_active ? "#2e7d32" : "#c62828",
          fontWeight: 600, fontSize: "0.7rem",
        }}
      />
    </Box>
  );

  // Modal me dikhane ke liye allCategories use karo
  const modalCategories = allCategories.length ? allCategories : (categories || []);

  if (!restaurant?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <SubdirectoryArrowRightIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
          <Typography variant="h5" className="font-bold text-gray-800 mb-2">Restaurant Required</Typography>
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
            <Typography variant="h4" className="font-bold text-gray-800">Sub-Categories</Typography>
            <Typography variant="body2" className="text-gray-600">Organize items within the selected category</Typography>
          </div>
          <Button
            variant="contained" startIcon={<AddIcon />} onClick={openAddModal}
            sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" }, borderRadius: "12px", px: 4, py: 1.2, fontWeight: 600 }}
          >
            Add Sub-Category
          </Button>
        </div>

        {/* Filter — allCategories use karo saari dikhne ke liye */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: "16px" }}>
          <FormControl size="small" sx={{ minWidth: 280 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={filterCategory}
              label="Filter by Category"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="all"><em>All Sub-Categories</em></MenuItem>
              {modalCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
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

        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: "#FF5252" }} size={60} />
          </Box>
        ) : displayedSubCategories.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px" }}>
            <SubdirectoryArrowRightIcon sx={{ fontSize: 80, color: "#FF5252", opacity: 0.4, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>No sub-categories found</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {filterCategory === "all"
                ? "Add your first sub-category to get started"
                : `No sub-categories in ${getCategoryName(filterCategory)}`}
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal}
              sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}>
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
                      {["S.No", "Image", "Name", "Description", "Category", "Status", "Actions"].map((h, idx) => (
                        <TableCell key={h} align={idx === 6 ? "right" : "left"}
                          sx={{ color: "white", fontWeight: "bold" }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedSubCategories.map((sc, i) => (
                      <TableRow key={sc.id} hover>
                        <TableCell>
                          {filterCategory === "all"
                            ? (allPage - 1) * ALL_LIMIT + i + 1
                            : (currentPagination.page - 1) * currentPagination.limit + i + 1}
                        </TableCell>
                        <TableCell>
                          {sc.image ? (
                            <img src={sc.image} alt={sc.name}
                              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
                              onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=?")} />
                          ) : (
                            <Box sx={{ width: 64, height: 64, bgcolor: "grey.100", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "text.secondary" }}>
                              No image
                            </Box>
                          )}
                        </TableCell>
                        <TableCell><Typography fontWeight="medium" color="#FF5252">{sc.name}</Typography></TableCell>
                        <TableCell>{sc.description || <em className="text-gray-400">No description</em>}</TableCell>
                        <TableCell><Chip label={getCategoryName(sc.category_id)} size="small" color="primary" /></TableCell>
                        <TableCell>{statusSwitch(sc)}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(sc)} size="small" color="primary"><EditIcon /></IconButton>
                          <IconButton onClick={() => handleDelete(sc.id)} size="small" color="error"><DeleteIcon /></IconButton>
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
                        #{filterCategory === "all"
                          ? (allPage - 1) * ALL_LIMIT + i + 1
                          : (currentPagination.page - 1) * currentPagination.limit + i + 1}
                      </Typography>
                      <Typography variant="h6" color="#FF5252">{sc.name}</Typography>
                      <Chip label={getCategoryName(sc.category_id)} size="small" sx={{ mt: 1 }} />
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleEdit(sc)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(sc.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                  {sc.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{sc.description}</Typography>
                  )}
                  {sc.image && (
                    <img src={sc.image} alt={sc.name}
                      style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, marginTop: 8 }}
                      onError={(e) => (e.target.src = "https://via.placeholder.com/300x180?text=No+Image")} />
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, pt: 2, borderTop: "1px solid #f0f0f0" }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    {statusSwitch(sc)}
                  </Box>
                </Paper>
              ))}
            </div>

            {/* Pagination Footer */}
            {currentPagination.totalPages > 1 && (
              <Box sx={{
                display: "flex", flexDirection: { xs: "column", sm: "row" },
                alignItems: "center", justifyContent: "space-between",
                px: 3, py: 2, borderTop: "1px solid #f0f0f0", gap: 1,
              }}>
                <Typography variant="body2" color="text.secondary">
                  Showing{" "}
                  <strong>
                    {(currentPagination.page - 1) * currentPagination.limit + 1}–
                    {Math.min(currentPagination.page * currentPagination.limit, currentPagination.total)}
                  </strong>
                  {" "}of <strong>{currentPagination.total}</strong> sub-categories
                </Typography>
                <Stack spacing={2}>
                  <Pagination
                    count={currentPagination.totalPages}
                    page={currentPagination.page}
                    onChange={handleCategoryPageChange}
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

      {/* Modal */}
      <Dialog open={openModal} onClose={closeModal} maxWidth="sm" fullWidth scroll="paper" keepMounted
        PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}>
        <DialogTitle sx={{ bgcolor: "#FF5252", color: "white", position: "sticky", top: 0, zIndex: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <SubdirectoryArrowRightIcon />
            <span>{mode === "add" ? "Add New Sub-Category" : "Edit Sub-Category"}</span>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflow: "hidden" }}>
          <Box component="form" onSubmit={handleSubmit} sx={{
            px: 3, pt: 3, pb: 2, display: "flex", flexDirection: "column", gap: 3,
            maxHeight: "60vh", overflowY: "auto",
            scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
          }}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Select Category *</InputLabel>
              <Select
                value={selectedCategory}
                label="Select Category *"
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (errors.category) setErrors((p) => ({ ...p, category: "" }));
                }}
                MenuProps={{
                  disablePortal: false,
                  container: document.body,
                  PaperProps: { sx: { maxHeight: 260, zIndex: 2000 } },
                }}
              >
                {/* Modal mein bhi saari categories dikhao */}
                {modalCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
              {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
            </FormControl>

            <TextField
              label="Sub-Category Name *" value={name} fullWidth
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })); }}
              error={!!errors.name} helperText={errors.name}
            />

            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)}
              multiline rows={3} fullWidth placeholder="Optional brief description..." />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Sub-Category Image {mode === "add" && <span style={{ color: "red" }}>*</span>}
              </Typography>
              <input type="file" accept="image/*" onChange={handleImageChange} id="subcat-image" style={{ display: "none" }} />
              <label htmlFor="subcat-image">
                <Box sx={{
                  border: `2px dashed ${errors.image ? "#ef4444" : "#d1d5db"}`,
                  borderRadius: "12px", height: 200,
                  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                  textAlign: "center", cursor: "pointer", bgcolor: "grey.50", transition: "0.2s",
                  "&:hover": { borderColor: "#FF5252", bgcolor: "grey.100" },
                }}>
                  <IoMdCamera size={50} style={{ color: "#9ca3af", marginBottom: 8 }} />
                  <Typography fontWeight="medium">
                    {image ? "Change image" : currentImage ? "Update image" : "Click to upload image"}
                  </Typography>
                </Box>
              </label>
              {errors.image && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.image}</Typography>}
              {currentImage && (
                <Box sx={{ mt: 3, position: "relative", display: "inline-block" }}>
                  <img src={currentImage} alt="preview"
                    style={{ maxHeight: 180, borderRadius: 12, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
                  <IconButton size="small" color="error"
                    sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white", boxShadow: 1 }}
                    onClick={() => { setImage(null); setCurrentImage(""); }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, position: "sticky", bottom: 0, bgcolor: "white", borderTop: "1px solid #eee" }}>
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

export default SubCategory;