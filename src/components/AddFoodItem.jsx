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
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Chip,
//   Switch,
//   FormControlLabel,
//   Grid,
//   Alert,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";

// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import RestaurantIcon from "@mui/icons-material/Restaurant";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import { IoMdCamera, IoMdRestaurant } from "react-icons/io";
// import { FaRegStar, FaPepperHot } from "react-icons/fa";

// import axiosInstance from "../api/axiosInstance";
// import { RestaurantContext } from "../context/getRestaurant";
// import { CategoriesContext } from "../context/GetAllCategories";

// const AddFoodItem = () => {
//   const { restaurant } = useContext(RestaurantContext);
//   const { categories } = useContext(CategoriesContext);

//   const [subCategories, setSubCategories] = useState([]);
//   const [allMenuItems, setAllMenuItems] = useState([]);
//   const [displayedMenuItems, setDisplayedMenuItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filterCategory, setFilterCategory] = useState("all");

//   // Modal & form states
//   const [openModal, setOpenModal] = useState(false);
//   const [mode, setMode] = useState("add"); // "add" | "edit"

//   // Form fields
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedSubCategory, setSelectedSubCategory] = useState("");
//   const [price, setPrice] = useState("");
//   const [offerPrice, setOfferPrice] = useState("");
//   const [foodType, setFoodType] = useState("VEG");
//   const [isAvailable, setIsAvailable] = useState(true);
//   const [isBestseller, setIsBestseller] = useState(false);
//   const [taxPercent, setTaxPercent] = useState("");
//   const [packagingCharge, setPackagingCharge] = useState("");
//   const [isCustomizable, setIsCustomizable] = useState(false);
//   const [availableFrom, setAvailableFrom] = useState("");
//   const [availableTo, setAvailableTo] = useState("");
//   const [isSpicy, setIsSpicy] = useState(false);
//   const [preparationTime, setPreparationTime] = useState("");
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

//   // Fetch all menu items on component mount
//   useEffect(() => {
//     if (restaurant?.id) {
//       fetchAllMenuItems();
//     }
//   }, [restaurant?.id]);

//   // Fetch sub-categories when category is selected
//   useEffect(() => {
//     if (selectedCategory) {
//       fetchSubCategories(selectedCategory);
//     } else {
//       setSubCategories([]);
//       setSelectedSubCategory("");
//     }
//   }, [selectedCategory]);

//   // Apply filter
//   useEffect(() => {
//     if (filterCategory === "all") {
//       setDisplayedMenuItems(allMenuItems);
//     } else {
//       const filtered = allMenuItems.filter((item) => item.category_id === filterCategory);
//       setDisplayedMenuItems(filtered);
//     }
//   }, [filterCategory, allMenuItems]);

//   // Fetch all menu items for the restaurant
//   const fetchAllMenuItems = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await axiosInstance.get(`/menuitems/${restaurant.id}/menu-items`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data && res.data.data) {
//         setAllMenuItems(res.data.data);
//         setDisplayedMenuItems(res.data.data);
//       } else {
//         setAllMenuItems([]);
//         setDisplayedMenuItems([]);
//       }
//     } catch (error) {
//       console.error("Fetch all menu items failed:", error);
//       const msg =
//         error?.response?.data?.message || // backend sends 'message'
//         error?.response?.data?.error ||   // backend might send 'error'
//         error?.message ||                 // network error or axios error
//         "Failed to fetch menu items. Please try again.";
//       setAllMenuItems([]);
//       setDisplayedMenuItems([]);
//       setErrorMsg(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch sub-categories for a specific category
//   const fetchSubCategories = async (categoryId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axiosInstance.get(`/subcategories/${categoryId}/sub-categories`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSubCategories(res.data);
//     } catch (error) {
//       console.error("Fetch sub-categories failed:", error);
//       const msg =
//         error?.response?.data?.message ||  // backend sends 'message'
//         error?.response?.data?.error ||    // backend might send 'error'
//         error?.message ||                  // network or axios error
//         "Failed to fetch sub-categories. Please try again.";
//       setSubCategories([]);
//       setErrorMsg(msg);                   // show message in UI
//     }
//   };

//   const resetForm = () => {
//     setName("");
//     setDescription("");
//     setSelectedCategory("");
//     setSelectedSubCategory("");
//     setPrice("");
//     setOfferPrice("");
//     setFoodType("VEG");
//     setIsAvailable(true);
//     setIsBestseller(false);
//     setTaxPercent("");
//     setPackagingCharge("");
//     setIsCustomizable(false);
//     setAvailableFrom("");
//     setAvailableTo("");
//     setIsSpicy(false);
//     setPreparationTime("");
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

//   const closeModal = () => {
//     setOpenModal(false);
//     resetForm();
//   };

//   const validate = () => {
//     const err = {};
//     if (!name.trim()) err.name = "Food name is required";
//     if (!selectedCategory) err.category = "Please select a category";
//     if (!selectedSubCategory) err.subCategory = "Please select a sub-category";
//     if (!price || Number(price) <= 0) err.price = "Valid price is required";

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

//     if (!image && !currentImage) {
//       setErrors({ image: "Image is required" });
//       setErrorMsg("Please upload an image before submitting");
//       return;
//     }

//     setIsSaving(true);
//     setErrorMsg("");
//     setSuccessMsg("");

//     const formData = new FormData();
//     formData.append("name", name.trim());
//     formData.append("description", description.trim());
//     formData.append("category_id", selectedCategory);
//     formData.append("sub_category_id", selectedSubCategory);
//     formData.append("price", price);
//     if (offerPrice) formData.append("offer_price", offerPrice);
//     formData.append("food_type", foodType);
//     formData.append("is_available", isAvailable);
//     formData.append("is_bestseller", isBestseller);
//     if (taxPercent) formData.append("tax_percent", taxPercent);
//     if (packagingCharge) formData.append("packaging_charge", packagingCharge);
//     formData.append("is_customizable", isCustomizable);
//     if (availableFrom) formData.append("available_from", availableFrom);
//     if (availableTo) formData.append("available_to", availableTo);
//     formData.append("is_spicy", isSpicy);
//     if (preparationTime) formData.append("preparation_time", preparationTime);
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
//           `/menuitems/restaurants/${restaurant?.id}/menu-items`,
//           formData,
//           config
//         );
//         setSuccessMsg("Menu item created successfully!");
//       } else {
//         await axiosInstance.put(`/menuitems/update/menu-items/${editId}`, formData, config);
//         setSuccessMsg("Menu item updated successfully!");
//       }

//       closeModal();
//       await fetchAllMenuItems();
//     } catch (error) {
//       const msg =
//         error?.response?.data?.message ||
//         error?.response?.data?.error || // sometimes backend uses 'error'
//         "Failed to save menu item.";

//       setErrorMsg(msg);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleEdit = async (menuItem) => {
//     try {
//       setEditId(menuItem.id);
//       const token = localStorage.getItem("token");
//       const response = await axiosInstance.get(`/menuitems/viewsingle/${menuItem.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = response.data.data;
//       setName(data.name);
//       setDescription(data.description || "");
//       setSelectedCategory(data.category_id);
//       setSelectedSubCategory(data.sub_category_id);
//       setPrice(data.price);
//       setOfferPrice(data.offer_price || "");
//       setFoodType(data.food_type || "VEG");
//       setIsAvailable(data.is_available);
//       setIsBestseller(data.is_bestseller);
//       setTaxPercent(data.tax_percent || "");
//       setPackagingCharge(data.packaging_charge || "");
//       setIsCustomizable(data.is_customizable);
//       setAvailableFrom(data.available_from || "");
//       setAvailableTo(data.available_to || "");
//       setIsSpicy(data.is_spicy);
//       setPreparationTime(data.preparation_time || "");
//       setCurrentImage(data.image || "");
//       setImage(null);
//       setMode("edit");
//       setOpenModal(true);
//       setErrors({});
//     } catch (error) {
//       console.error("Failed to fetch menu item details:", error);
//       const msg =
//         error?.response?.data?.message ||  // backend sends 'message'
//         error?.response?.data?.error ||    // backend might send 'error'
//         error?.message ||                  // network or axios error
//         "Failed to load menu item details. Please try again.";
//       // Set the extracted message to show in UI
//       setErrorMsg(msg);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this menu item?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       const result = await axiosInstance.delete(`/menuitems/delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setSuccessMsg(result.data.message || "Menu item deleted successfully");
//       await fetchAllMenuItems();
//     } catch (error) {
//       console.error("Delete failed:", error);
//       setErrorMsg(error?.response?.data?.message || "Failed to delete menu item");
//     }
//   };

//   const getCategoryName = (categoryId) => {
//     const category = categories?.find((c) => c.id === categoryId);
//     return category?.name || "Unknown";
//   };

//   if (!restaurant?.id) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md text-center">
//           <RestaurantIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
//           <Typography variant="h5" className="font-bold text-gray-800 mb-2">
//             Restaurant Required
//           </Typography>
//           <Typography variant="body1" className="text-gray-600">
//             Please select or load a restaurant first to manage menu items.
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
//               Menu Items
//             </Typography>
//             <Typography variant="body2" className="text-gray-600">
//               Manage your menu items and availability
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
//             Add Menu Item
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
//                 <em>All Menu Items</em>
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
//         ) : displayedMenuItems.length === 0 ? (
//           <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px" }}>
//             <IoMdRestaurant style={{ fontSize: 80, color: "#FF5252", opacity: 0.4, marginBottom: 16 }} />
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               No menu items found
//             </Typography>
//             <Typography color="text.secondary" sx={{ mb: 3 }}>
//               {filterCategory === "all"
//                 ? "Add your first menu item to get started"
//                 : `No items in ${getCategoryName(filterCategory)}`}
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={openAddModal}
//               sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}
//             >
//               Add Menu Item
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
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name & Description</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Type</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Price</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Time</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tags</TableCell>
//                       <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
//                         Actions
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {displayedMenuItems.map((item, i) => (
//                       <TableRow key={item.id} hover>
//                         <TableCell>{i + 1}</TableCell>
//                         <TableCell>
//                           {item.image ? (
//                             <img
//                               src={item.image}
//                               alt={item.name}
//                               style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
//                               onError={(e) => (e.target.src = "https://via.placeholder.com/80?text=No+Image")}
//                             />
//                           ) : (
//                             <Box
//                               sx={{
//                                 width: 80,
//                                 height: 80,
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
//                           <Typography fontWeight="semibold" color="#FF5252" sx={{ fontSize: "1rem" }}>
//                             {item.name}
//                           </Typography>
//                           {item.description && (
//                             <Typography variant="body2" color="text.secondary" className="line-clamp-2">
//                               {item.description}
//                             </Typography>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <Chip label={getCategoryName(item.category_id)} size="small" color="primary" />
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={item.food_type}
//                             size="small"
//                             sx={{
//                               bgcolor: item.food_type === "VEG" ? "#10b981" : "#ef4444",
//                               color: "white",
//                               fontWeight: 600,
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Typography fontWeight="bold" color="green" sx={{ fontSize: "1rem" }}>
//                             ₹{item.price}
//                           </Typography>
//                           {item.offer_price && (
//                             <Typography variant="body2">
//                               <span style={{ color: "#ef4444", fontWeight: 600 }}>₹{item.offer_price}</span>
//                             </Typography>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           {item.preparation_time ? (
//                             <Chip
//                               icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
//                               label={`${item.preparation_time} min`}
//                               size="small"
//                               sx={{ bgcolor: "#fbbf24", color: "white", fontWeight: 600 }}
//                             />
//                           ) : (
//                             <span className="text-gray-400">-</span>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={item.is_available ? "Available" : "Unavailable"}
//                             size="small"
//                             color={item.is_available ? "success" : "default"}
//                             sx={{ fontWeight: 600 }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Box display="flex" flexWrap="wrap" gap={0.5}>
//                             {item.is_bestseller && (
//                               <Chip
//                                 label="Best"
//                                 size="small"
//                                 sx={{ bgcolor: "#fbbf24", color: "white", fontSize: "0.7rem", fontWeight: 600 }}
//                               />
//                             )}
//                             {item.is_spicy && (
//                               <Chip
//                                 label="Spicy"
//                                 size="small"
//                                 color="error"
//                                 sx={{ fontSize: "0.7rem", fontWeight: 600 }}
//                               />
//                             )}
//                             {item.is_customizable && (
//                               <Chip
//                                 label="Custom"
//                                 size="small"
//                                 color="info"
//                                 sx={{ fontSize: "0.7rem", fontWeight: 600 }}
//                               />
//                             )}
//                           </Box>
//                         </TableCell>
//                         <TableCell align="right">
//                           <IconButton onClick={() => handleEdit(item)} size="small" color="primary">
//                             <EditIcon />
//                           </IconButton>
//                           <IconButton onClick={() => handleDelete(item.id)} size="small" color="error">
//                             <DeleteIcon className="text-green-500" />
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
//               {displayedMenuItems.map((item, i) => (
//                 <Paper key={item.id} elevation={2} sx={{ borderRadius: "16px", p: 3 }}>
//                   <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
//                     <Box flex={1}>
//                       <Typography variant="caption" color="text.secondary">
//                         #{i + 1}
//                       </Typography>
//                       <Typography variant="h6" color="#FF5252" fontWeight="bold">
//                         {item.name}
//                       </Typography>
//                       <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
//                         <Chip label={getCategoryName(item.category_id)} size="small" />
//                         <Chip
//                           label={item.food_type}
//                           size="small"
//                           sx={{
//                             bgcolor: item.food_type === "VEG" ? "#10b981" : "#ef4444",
//                             color: "white",
//                           }}
//                         />
//                         <Chip
//                           label={item.is_available ? "Available" : "Unavailable"}
//                           size="small"
//                           color={item.is_available ? "success" : "default"}
//                         />
//                         {item.preparation_time && (
//                           <Chip
//                             icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
//                             label={`${item.preparation_time} min`}
//                             size="small"
//                             sx={{ bgcolor: "#fbbf24", color: "white" }}
//                           />
//                         )}
//                       </Box>
//                     </Box>

//                     <Box display="flex" gap={1} ml={2}>
//                       <IconButton size="small" onClick={() => handleEdit(item)}>
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton size="small" onClick={() => handleDelete(item.id)} color="error">
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   </Box>

//                   {item.description && (
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                       {item.description}
//                     </Typography>
//                   )}

//                   <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     sx={{ bgcolor: "green.50", p: 2, borderRadius: 2, mb: 2 }}
//                   >
//                     <Box>
//                       <Typography variant="h5" fontWeight="bold" color="green">
//                         ₹{item.price}
//                       </Typography>
//                       {item.offer_price && (
//                         <Typography variant="body2" color="error">
//                           Offer: ₹{item.offer_price}
//                         </Typography>
//                       )}
//                     </Box>
//                     <Box display="flex" gap={0.5}>
//                       {item.is_bestseller && (
//                         <Chip label="⭐ Best" size="small" sx={{ bgcolor: "#fbbf24", color: "white" }} />
//                       )}
//                       {item.is_spicy && <Chip label="🌶️" size="small" color="error" />}
//                       {item.is_customizable && <Chip label="Custom" size="small" color="info" />}
//                     </Box>
//                   </Box>

//                   {item.image && (
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       style={{
//                         width: "100%",
//                         height: 200,
//                         objectFit: "cover",
//                         borderRadius: 12,
//                       }}
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
//       <Dialog
//         open={openModal}
//         onClose={closeModal}
//         maxWidth="md"
//         fullWidth
//         scroll="paper"
//         keepMounted
//         PaperProps={{
//           sx: {
//             borderRadius: "16px",
//             overflow: "hidden",
//           },
//         }}
//       >
//         {/* HEADER */}
//         <DialogTitle
//           sx={{
//             bgcolor: "#FF5252",
//             color: "white",
//             position: "sticky",
//             top: 0,
//             zIndex: 1,
//           }}
//         >
//           <Box display="flex" alignItems="center" gap={2}>
//             <RestaurantIcon />
//             <span>{mode === "add" ? "Add New Menu Item" : "Edit Menu Item"}</span>
//           </Box>
//         </DialogTitle>

//         {/* CONTENT */}
//         <DialogContent
//           sx={{
//             p: 0,
//             overflow: "hidden",
//           }}
//         >
//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             sx={{
//               px: 3,
//               pt: 3,
//               pb: 2,
//               display: "flex",
//               flexDirection: "column",
//               gap: 3,
//               maxHeight: "65vh",
//               overflowY: "auto",
//               scrollbarWidth: "none",
//               "&::-webkit-scrollbar": { display: "none" },
//             }}
//           >
//             {/* Category & Sub-Category */}
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth error={!!errors.category}>
//                   <InputLabel>Select Category *</InputLabel>
//                   <Select
//                     value={selectedCategory}
//                     label="Select Category *"
//                     onChange={(e) => {
//                       setSelectedCategory(e.target.value);
//                       setSelectedSubCategory("");
//                       if (errors.category) setErrors((p) => ({ ...p, category: "" }));
//                     }}
//                     MenuProps={{
//                       disablePortal: false,
//                       container: document.body,
//                       PaperProps: { sx: { maxHeight: 260, zIndex: 2000 } },
//                     }}
//                     className="w-42"

//                   >
//                     {categories?.map((cat) => (
//                       <MenuItem key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {errors.category && (
//                     <Typography color="error" variant="caption">
//                       {errors.category}
//                     </Typography>
//                   )}
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth error={!!errors.subCategory}>
//                   <InputLabel>Select Sub-Category *</InputLabel>
//                   <Select
//                     value={selectedSubCategory}
//                     label="Select Sub-Category *"
//                     onChange={(e) => {
//                       setSelectedSubCategory(e.target.value);
//                       if (errors.subCategory) setErrors((p) => ({ ...p, subCategory: "" }));
//                     }}
//                     disabled={!selectedCategory}
//                     MenuProps={{
//                       disablePortal: false,
//                       container: document.body,
//                       PaperProps: { sx: { maxHeight: 260, zIndex: 2000 } },
//                     }}
//                     className="w-42"

//                   >
//                     {subCategories?.map((sc) => (
//                       <MenuItem key={sc.id} value={sc.id}>
//                         {sc.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {errors.subCategory && (
//                     <Typography color="error" variant="caption">
//                       {errors.subCategory}
//                     </Typography>
//                   )}
//                 </FormControl>
//               </Grid>
//             </Grid>

//             {/* Name & Food Type */}
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Food Name *"
//                   value={name}
//                   onChange={(e) => {
//                     setName(e.target.value);
//                     if (errors.name) setErrors((p) => ({ ...p, name: "" }));
//                   }}
//                   error={!!errors.name}
//                   helperText={errors.name}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Food Type</InputLabel>
//                   <Select
//                     value={foodType}
//                     label="Food Type"
//                     onChange={(e) => setFoodType(e.target.value)}
//                     MenuProps={{
//                       disablePortal: false,
//                       container: document.body,
//                       PaperProps: { sx: { maxHeight: 260, zIndex: 2000 } },
//                     }}
//                   >
//                     <MenuItem value="VEG"> Veg</MenuItem>
//                     <MenuItem value="NON_VEG"> Non-Veg</MenuItem>
//                     <MenuItem value="(veg,non-veg) BOTH">Both</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>

//             {/* Description */}
//             <TextField
//               label="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               multiline
//               rows={3}
//               fullWidth
//               placeholder="Describe your delicious dish..."
//             />

//             {/* Pricing */}
//             <Grid container spacing={2}>
//               <Grid item xs={6} sm={3}>
//                 <TextField
//                   label="Price (₹) *"
//                   type="number"
//                   value={price}
//                   onChange={(e) => {
//                     setPrice(e.target.value);
//                     if (errors.price) setErrors((p) => ({ ...p, price: "" }));
//                   }}
//                   error={!!errors.price}
//                   helperText={errors.price}
//                   fullWidth
//                   inputProps={{ min: 0, step: "0.01" }}
//                 />
//               </Grid>

//               <Grid item xs={6} sm={3}>
//                 <TextField
//                   label="Offer Price (₹)"
//                   type="number"
//                   value={offerPrice}
//                   onChange={(e) => setOfferPrice(e.target.value)}
//                   fullWidth
//                   inputProps={{ min: 0, step: "0.01" }}
//                 />
//               </Grid>

//               <Grid item xs={6} sm={3}>
//                 <TextField
//                   label="Tax %"
//                   type="number"
//                   value={taxPercent}
//                   onChange={(e) => setTaxPercent(e.target.value)}
//                   fullWidth
//                   inputProps={{ min: 0, max: 100, step: "0.01" }}
//                 />
//               </Grid>

//               <Grid item xs={6} sm={3}>
//                 <TextField
//                   label="Packaging (₹)"
//                   type="number"
//                   value={packagingCharge}
//                   onChange={(e) => setPackagingCharge(e.target.value)}
//                   fullWidth
//                   inputProps={{ min: 0, step: "0.01" }}
//                 />
//               </Grid>
//             </Grid>

//             {/* Availability Time & Preparation Time */}
//             <Grid container spacing={2}>
//               <Grid item xs={6} sm={4}>
//                 <TextField
//                   label="Available From"
//                   type="time"
//                   value={availableFrom}
//                   onChange={(e) => setAvailableFrom(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>

//               <Grid item xs={6} sm={4}>
//                 <TextField
//                   label="Available To"
//                   type="time"
//                   value={availableTo}
//                   onChange={(e) => setAvailableTo(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label="Preparation Time (min)"
//                   type="number"
//                   value={preparationTime}
//                   onChange={(e) => setPreparationTime(e.target.value)}
//                   fullWidth
//                   inputProps={{ min: 0 }}
//                 />
//               </Grid>
//             </Grid>

//             {/* Toggles */}
//             <Box>
//               <Typography variant="subtitle2" gutterBottom fontWeight="semibold">
//                 Item Properties
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={6} sm={3}>
//                   <FormControlLabel
//                     control={<Switch checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />}
//                     label="Available"
//                   />
//                 </Grid>

//                 <Grid item xs={6} sm={3}>
//                   <FormControlLabel
//                     control={
//                       <Switch checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} />
//                     }
//                     label={
//                       <Box display="flex" alignItems="center" gap={0.5}>
//                         <FaRegStar style={{ color: "#fbbf24" }} />
//                         <span>Bestseller</span>
//                       </Box>
//                     }
//                   />
//                 </Grid>

//                 <Grid item xs={6} sm={3}>
//                   <FormControlLabel
//                     control={
//                       <Switch checked={isCustomizable} onChange={(e) => setIsCustomizable(e.target.checked)} />
//                     }
//                     label="Customizable"
//                   />
//                 </Grid>

//                 <Grid item xs={6} sm={3}>
//                   <FormControlLabel
//                     control={<Switch checked={isSpicy} onChange={(e) => setIsSpicy(e.target.checked)} />}
//                     label={
//                       <Box display="flex" alignItems="center" gap={0.5}>
//                         <FaPepperHot style={{ color: "#ef4444" }} />
//                         <span>Spicy</span>
//                       </Box>
//                     }
//                   />
//                 </Grid>
//               </Grid>
//             </Box>

//             {/* Image Upload */}
//             <Box>
//               <Typography variant="subtitle2" gutterBottom fontWeight="semibold">
//                 Food Image
//               </Typography>

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 id="food-image-upload"
//                 style={{ display: "none" }}
//               />

//               <label htmlFor="food-image-upload">
//                 <Box
//                   sx={{
//                     border: `2px dashed ${errors.image ? "#ef4444" : "#d1d5db"}`,
//                     borderRadius: "12px",
//                     height: 220, // fixed height for proper centering
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "center",   // vertical center
//                     alignItems: "center",       // horizontal center
//                     textAlign: "center",
//                     cursor: "pointer",
//                     bgcolor: "grey.50",
//                     transition: "all 0.2s ease",
//                     "&:hover": {
//                       borderColor: "#FF5252",
//                       bgcolor: "grey.100",
//                     },
//                   }}
//                 >
//                   <IoMdCamera
//                     size={52}
//                     style={{ color: "#9ca3af", marginBottom: 10 }}
//                   />

//                   <Typography fontWeight={500}>
//                     {image
//                       ? "Change image"
//                       : currentImage
//                         ? "Update image"
//                         : "Click to upload food image"}
//                   </Typography>

//                   <Typography variant="caption" sx={{ color: "#6b7280", mt: 0.5 }}>

//                   </Typography>
//                 </Box>
//               </label>


//               {errors.image && (
//                 <Typography color="error" variant="caption" sx={{ mt: 1 }}>
//                   {errors.image}
//                 </Typography>
//               )}

//               {currentImage && (
//                 <Box sx={{ mt: 3, position: "relative", display: "inline-block" }}>
//                   <img
//                     src={currentImage}
//                     alt="preview"
//                     style={{
//                       maxHeight: 200,
//                       maxWidth: "100%",
//                       borderRadius: 12,
//                       boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//                     }}
//                   />
//                   <IconButton
//                     size="small"
//                     color="error"
//                     sx={{
//                       position: "absolute",
//                       top: 8,
//                       right: 8,
//                       bgcolor: "white",
//                       boxShadow: 1,
//                     }}
//                     onClick={() => {
//                       setImage(null);
//                       setCurrentImage("");
//                     }}
//                   >
//                     <DeleteIcon fontSize="small" />
//                   </IconButton>
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         </DialogContent>

//         {/* FOOTER */}
//         <DialogActions
//           sx={{
//             px: 3,
//             py: 2,
//             position: "sticky",
//             bottom: 0,
//             bgcolor: "white",
//             borderTop: "1px solid #eee",
//           }}
//         >
//           <Button onClick={closeModal} disabled={isSaving}>
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={isSaving}
//             sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}
//             startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
//           >
//             {isSaving ? (mode === "add" ? "Creating..." : "Updating...") : mode === "add" ? "Create" : "Update"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default AddFoodItem;


import React, { useContext, useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, TextField, Box, CircularProgress, Select, MenuItem,
  FormControl, InputLabel, Chip, Switch, FormControlLabel, Grid,
  Alert, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Pagination, Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { IoMdCamera, IoMdRestaurant } from "react-icons/io";
import { FaRegStar, FaPepperHot } from "react-icons/fa";

import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";

const AddFoodItem = () => {
  const { restaurant } = useContext(RestaurantContext);
  const { categories } = useContext(CategoriesContext); // sirf fallback ke liye

  // ─── Saari categories (bina pagination ke) ───
  const [allCategories, setAllCategories] = useState([]);
  // ─── Selected category ki saari subcategories ───
  const [subCategories, setSubCategories] = useState([]);

  const [allMenuItems, setAllMenuItems] = useState([]);
  const [displayedMenuItems, setDisplayedMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  // Backend se aane wala pagination
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  // Modal & form states
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add");
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

  useEffect(() => {
    if (successMsg || errorMsg) {
      const t = setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 5000);
      return () => clearTimeout(t);
    }
  }, [successMsg, errorMsg]);

  // ─── 1. Saari categories fetch karo (pagination ignore) ───
  const fetchAllCategoriesUnpaginated = async () => {
    if (!restaurant?.id) return;
    const token = localStorage.getItem("token");
    try {
      const first = await axiosInstance.get(`/categories/${restaurant.id}`, {
        params: { page: 1, limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = first.data.data || [];
      const pg = first.data.pagination || {};
      if (!pg.totalPages || pg.totalPages <= 1) {
        setAllCategories(data);
        return;
      }
      const rest = await Promise.all(
        Array.from({ length: pg.totalPages - 1 }, (_, i) =>
          axiosInstance.get(`/categories/${restaurant.id}`, {
            params: { page: i + 2, limit: 100 },
            headers: { Authorization: `Bearer ${token}` },
          }).then(r => r.data.data || []).catch(() => [])
        )
      );
      setAllCategories([...data, ...rest.flat()]);
    } catch {
      setAllCategories(categories || []);
    }
  };

  // ─── 2. Menu items fetch karo (backend pagination) ───
  const fetchAllMenuItems = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/menuitems/${restaurant.id}/menu-items`, {
        params: { page, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllMenuItems(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
    } catch (error) {
      setAllMenuItems([]);
      setErrorMsg(error?.response?.data?.message || error?.message || "Failed to fetch menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant?.id) {
      fetchAllCategoriesUnpaginated();
      fetchAllMenuItems(1);
    }
  }, [restaurant?.id]);

  // ─── Filter (current page ke data pe client-side) ───
  useEffect(() => {
    if (filterCategory === "all") {
      setDisplayedMenuItems(allMenuItems);
    } else {
      setDisplayedMenuItems(allMenuItems.filter(item => item.category_id === filterCategory));
    }
  }, [filterCategory, allMenuItems]);

  // ─── 3. Subcategories fetch karo (saari, limit 100) ───
  const fetchSubCategories = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/subcategories/${categoryId}/sub-categories`, {
        params: { page: 1, limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
      });
      // Backend { data: [...] } ya directly array deta hai
      setSubCategories(res.data.data || res.data || []);
    } catch (error) {
      setSubCategories([]);
      setErrorMsg(error?.response?.data?.message || "Failed to fetch sub-categories.");
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    } else {
      setSubCategories([]);
      setSelectedSubCategory("");
    }
  }, [selectedCategory]);

  const resetForm = () => {
    setName(""); setDescription(""); setSelectedCategory(""); setSelectedSubCategory("");
    setPrice(""); setOfferPrice(""); setFoodType("VEG"); setIsAvailable(true);
    setIsBestseller(false); setTaxPercent(""); setPackagingCharge(""); setIsCustomizable(false);
    setAvailableFrom(""); setAvailableTo(""); setIsSpicy(false); setPreparationTime("");
    setImage(null); setCurrentImage(""); setEditId(null); setErrors({}); setMode("add");
  };

  const openAddModal = () => { resetForm(); setOpenModal(true); };
  const closeModal = () => { setOpenModal(false); resetForm(); };

  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = "Food name is required";
    if (!selectedCategory) err.category = "Please select a category";
    if (!selectedSubCategory) err.subCategory = "Please select a sub-category";
    if (!price || Number(price) <= 0) err.price = "Valid price is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setCurrentImage(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { setErrorMsg("Please fix the errors before submitting"); return; }
    if (!image && !currentImage) {
      setErrors({ image: "Image is required" });
      setErrorMsg("Please upload an image before submitting");
      return;
    }
    setIsSaving(true); setErrorMsg(""); setSuccessMsg("");

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
    const config = { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } };

    try {
      if (mode === "add") {
        await axiosInstance.post(`/menuitems/restaurants/${restaurant?.id}/menu-items`, formData, config);
        setSuccessMsg("Menu item created successfully!");
        // Naya item add hua — last page pe jao
        const newTotalPages = Math.ceil((pagination.total + 1) / pagination.limit);
        closeModal();
        await fetchAllMenuItems(newTotalPages);
      } else {
        await axiosInstance.put(`/menuitems/update/menu-items/${editId}`, formData, config);
        setSuccessMsg("Menu item updated successfully!");
        closeModal();
        await fetchAllMenuItems(pagination.page);
      }
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || error?.response?.data?.error || "Failed to save menu item.");
    } finally {
      setIsSaving(false);
    }
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
      setMode("edit");
      setOpenModal(true);
      setErrors({});
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || error?.message || "Failed to load menu item details.");
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
      // Agar current page ka last item delete hua aur page > 1, prev page pe jao
      const targetPage = allMenuItems.length === 1 && pagination.page > 1
        ? pagination.page - 1
        : pagination.page;
      await fetchAllMenuItems(targetPage);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Failed to delete menu item");
    }
  };

  const handlePageChange = (_, newPage) => fetchAllMenuItems(newPage);

  // allCategories use karo everywhere (saari categories)
  const modalCategories = allCategories.length ? allCategories : (categories || []);

  const getCategoryName = (categoryId) =>
    allCategories.find(c => c.id === categoryId)?.name ||
    categories?.find(c => c.id === categoryId)?.name ||
    "Unknown";

  if (!restaurant?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <RestaurantIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
          <Typography variant="h5" className="font-bold text-gray-800 mb-2">Restaurant Required</Typography>
          <Typography variant="body1" className="text-gray-600">Please select or load a restaurant first to manage menu items.</Typography>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <Typography variant="h4" className="font-bold text-gray-800">Menu Items</Typography>
            <Typography variant="body2" className="text-gray-600">Manage your menu items and availability</Typography>
          </div>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal}
            sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" }, borderRadius: "12px", px: 4, py: 1.2, fontWeight: 600 }}>
            Add Menu Item
          </Button>
        </div>

        {/* Filter — allCategories se saari categories */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: "16px" }}>
          <FormControl size="small" sx={{ minWidth: 280 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select value={filterCategory} label="Filter by Category" onChange={e => setFilterCategory(e.target.value)}>
              <MenuItem value="all"><em>All Menu Items</em></MenuItem>
              {modalCategories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {filterCategory !== "all" && (
            <Chip label={`Filtered: ${getCategoryName(filterCategory)}`}
              onDelete={() => setFilterCategory("all")} color="primary" sx={{ ml: 2 }} />
          )}
        </Paper>

        {/* List */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: "#FF5252" }} size={60} />
          </Box>
        ) : displayedMenuItems.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px" }}>
            <IoMdRestaurant style={{ fontSize: 80, color: "#FF5252", opacity: 0.4, marginBottom: 16 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>No menu items found</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {filterCategory === "all" ? "Add your first menu item to get started" : `No items in ${getCategoryName(filterCategory)}`}
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal}
              sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}>Add Menu Item</Button>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: 3 }}>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#FF5252" }}>
                    <TableRow>
                      {["S.No","Image","Name & Description","Category","Type","Price","Time","Status","Tags","Actions"].map((h,idx) => (
                        <TableCell key={h} align={idx===9?"right":"left"} sx={{ color:"white", fontWeight:"bold" }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedMenuItems.map((item, i) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{(pagination.page - 1) * pagination.limit + i + 1}</TableCell>
                        <TableCell>
                          {item.image ? (
                            <img src={item.image} alt={item.name}
                              style={{ width:80, height:80, objectFit:"cover", borderRadius:8 }}
                              onError={e => e.target.src="https://via.placeholder.com/80?text=No+Image"} />
                          ) : (
                            <Box sx={{ width:80,height:80,bgcolor:"grey.100",borderRadius:1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",color:"text.secondary" }}>No image</Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="semibold" color="#FF5252" sx={{ fontSize:"1rem" }}>{item.name}</Typography>
                          {item.description && <Typography variant="body2" color="text.secondary" className="line-clamp-2">{item.description}</Typography>}
                        </TableCell>
                        <TableCell><Chip label={getCategoryName(item.category_id)} size="small" color="primary" /></TableCell>
                        <TableCell>
                          <Chip label={item.food_type} size="small"
                            sx={{ bgcolor: item.food_type==="VEG"?"#10b981":"#ef4444", color:"white", fontWeight:600 }} />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="bold" color="green" sx={{ fontSize:"1rem" }}>₹{item.price}</Typography>
                          {item.offer_price && <Typography variant="body2"><span style={{ color:"#ef4444",fontWeight:600 }}>₹{item.offer_price}</span></Typography>}
                        </TableCell>
                        <TableCell>
                          {item.preparation_time
                            ? <Chip icon={<AccessTimeIcon sx={{ fontSize:16 }} />} label={`${item.preparation_time} min`} size="small" sx={{ bgcolor:"#fbbf24",color:"white",fontWeight:600 }} />
                            : <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell>
                          <Chip label={item.is_available?"Available":"Unavailable"} size="small"
                            color={item.is_available?"success":"default"} sx={{ fontWeight:600 }} />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {item.is_bestseller && <Chip label="Best" size="small" sx={{ bgcolor:"#fbbf24",color:"white",fontSize:"0.7rem",fontWeight:600 }} />}
                            {item.is_spicy && <Chip label="Spicy" size="small" color="error" sx={{ fontSize:"0.7rem",fontWeight:600 }} />}
                            {item.is_customizable && <Chip label="Custom" size="small" color="info" sx={{ fontSize:"0.7rem",fontWeight:600 }} />}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(item)} size="small" color="primary"><EditIcon /></IconButton>
                          <IconButton onClick={() => handleDelete(item.id)} size="small" color="error"><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {displayedMenuItems.map((item, i) => (
                <Paper key={item.id} elevation={2} sx={{ borderRadius:"16px", p:3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                      <Typography variant="caption" color="text.secondary">
                        #{(pagination.page - 1) * pagination.limit + i + 1}
                      </Typography>
                      <Typography variant="h6" color="#FF5252" fontWeight="bold">{item.name}</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        <Chip label={getCategoryName(item.category_id)} size="small" />
                        <Chip label={item.food_type} size="small"
                          sx={{ bgcolor: item.food_type==="VEG"?"#10b981":"#ef4444", color:"white" }} />
                        <Chip label={item.is_available?"Available":"Unavailable"} size="small"
                          color={item.is_available?"success":"default"} />
                        {item.preparation_time && (
                          <Chip icon={<AccessTimeIcon sx={{ fontSize:14 }} />} label={`${item.preparation_time} min`}
                            size="small" sx={{ bgcolor:"#fbbf24",color:"white" }} />
                        )}
                      </Box>
                    </Box>
                    <Box display="flex" gap={1} ml={2}>
                      <IconButton size="small" onClick={() => handleEdit(item)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(item.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                  {item.description && <Typography variant="body2" color="text.secondary" sx={{ mb:2 }}>{item.description}</Typography>}
                  <Box display="flex" justifyContent="space-between" alignItems="center"
                    sx={{ bgcolor:"grey.50", p:2, borderRadius:2, mb:2 }}>
                    <Box>
                      <Typography variant="h5" fontWeight="bold" color="green">₹{item.price}</Typography>
                      {item.offer_price && <Typography variant="body2" color="error">Offer: ₹{item.offer_price}</Typography>}
                    </Box>
                    <Box display="flex" gap={0.5}>
                      {item.is_bestseller && <Chip label="⭐ Best" size="small" sx={{ bgcolor:"#fbbf24",color:"white" }} />}
                      {item.is_spicy && <Chip label="🌶️" size="small" color="error" />}
                      {item.is_customizable && <Chip label="Custom" size="small" color="info" />}
                    </Box>
                  </Box>
                  {item.image && (
                    <img src={item.image} alt={item.name}
                      style={{ width:"100%",height:200,objectFit:"cover",borderRadius:12 }}
                      onError={e => e.target.src="https://via.placeholder.com/300x200?text=No+Image"} />
                  )}
                </Paper>
              ))}
            </div>

            {/* ── Pagination Footer ── */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display:"flex", flexDirection:{ xs:"column",sm:"row" }, alignItems:"center",
                justifyContent:"space-between", px:3, py:2, borderTop:"1px solid #f0f0f0", gap:1 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing{" "}
                  <strong>{(pagination.page-1)*pagination.limit+1}–{Math.min(pagination.page*pagination.limit, pagination.total)}</strong>
                  {" "}of <strong>{pagination.total}</strong> menu items
                </Typography>
                <Stack spacing={2}>
                  <Pagination count={pagination.totalPages} page={pagination.page} onChange={handlePageChange}
                    shape="rounded"
                    sx={{ "& .MuiPaginationItem-root.Mui-selected": { bgcolor:"#FF5252",color:"white","&:hover":{ bgcolor:"#e03e3e" } } }} />
                </Stack>
              </Box>
            )}
          </Paper>
        )}
      </div>

      {/* ─── MODAL ─── */}
      <Dialog open={openModal} onClose={closeModal} maxWidth="md" fullWidth scroll="paper" keepMounted
        PaperProps={{ sx:{ borderRadius:"16px",overflow:"hidden" } }}>
        <DialogTitle sx={{ bgcolor:"#FF5252",color:"white",position:"sticky",top:0,zIndex:1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <RestaurantIcon />
            <span>{mode==="add"?"Add New Menu Item":"Edit Menu Item"}</span>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p:0,overflow:"hidden" }}>
          <Box component="form" onSubmit={handleSubmit}
            sx={{ px:3,pt:3,pb:2,display:"flex",flexDirection:"column",gap:3,
              maxHeight:"65vh",overflowY:"auto",scrollbarWidth:"none","&::-webkit-scrollbar":{ display:"none" } }}>

            {/* Category & Sub-Category */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Select Category *</InputLabel>
                  <Select value={selectedCategory} label="Select Category *"
                    onChange={e => { setSelectedCategory(e.target.value); setSelectedSubCategory(""); if(errors.category) setErrors(p=>({...p,category:""})); }}
                    MenuProps={{ disablePortal:false,container:document.body,PaperProps:{ sx:{ maxHeight:260,zIndex:2000 } } }}>
                    {/* saari categories — allCategories */}
                    {modalCategories.map(cat => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.subCategory}>
                  <InputLabel>Select Sub-Category *</InputLabel>
                  <Select value={selectedSubCategory} label="Select Sub-Category *"
                    onChange={e => { setSelectedSubCategory(e.target.value); if(errors.subCategory) setErrors(p=>({...p,subCategory:""})); }}
                    disabled={!selectedCategory}
                    MenuProps={{ disablePortal:false,container:document.body,PaperProps:{ sx:{ maxHeight:260,zIndex:2000 } } }}>
                    {subCategories.map(sc => (
                      <MenuItem key={sc.id} value={sc.id}>{sc.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.subCategory && <Typography color="error" variant="caption">{errors.subCategory}</Typography>}
                </FormControl>
              </Grid>
            </Grid>

            {/* Name & Food Type */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Food Name *" value={name} fullWidth
                  onChange={e => { setName(e.target.value); if(errors.name) setErrors(p=>({...p,name:""})); }}
                  error={!!errors.name} helperText={errors.name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Food Type</InputLabel>
                  <Select value={foodType} label="Food Type" onChange={e => setFoodType(e.target.value)}
                    MenuProps={{ disablePortal:false,container:document.body,PaperProps:{ sx:{ maxHeight:260,zIndex:2000 } } }}>
                    <MenuItem value="VEG">Veg</MenuItem>
                    <MenuItem value="NON_VEG">Non-Veg</MenuItem>
                    <MenuItem value="(veg,non-veg) BOTH">Both</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Description */}
            <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)}
              multiline rows={3} fullWidth placeholder="Describe your delicious dish..." />

            {/* Pricing */}
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <TextField label="Price (₹) *" type="number" value={price} fullWidth
                  onChange={e => { setPrice(e.target.value); if(errors.price) setErrors(p=>({...p,price:""})); }}
                  error={!!errors.price} helperText={errors.price} inputProps={{ min:0,step:"0.01" }} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField label="Offer Price (₹)" type="number" value={offerPrice}
                  onChange={e => setOfferPrice(e.target.value)} fullWidth inputProps={{ min:0,step:"0.01" }} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField label="Tax %" type="number" value={taxPercent}
                  onChange={e => setTaxPercent(e.target.value)} fullWidth inputProps={{ min:0,max:100,step:"0.01" }} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField label="Packaging (₹)" type="number" value={packagingCharge}
                  onChange={e => setPackagingCharge(e.target.value)} fullWidth inputProps={{ min:0,step:"0.01" }} />
              </Grid>
            </Grid>

            {/* Times */}
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <TextField label="Available From" type="time" value={availableFrom}
                  onChange={e => setAvailableFrom(e.target.value)} fullWidth InputLabelProps={{ shrink:true }} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField label="Available To" type="time" value={availableTo}
                  onChange={e => setAvailableTo(e.target.value)} fullWidth InputLabelProps={{ shrink:true }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Preparation Time (min)" type="number" value={preparationTime}
                  onChange={e => setPreparationTime(e.target.value)} fullWidth inputProps={{ min:0 }} />
              </Grid>
            </Grid>

            {/* Toggles */}
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight="semibold">Item Properties</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <FormControlLabel control={<Switch checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} />} label="Available" />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControlLabel
                    control={<Switch checked={isBestseller} onChange={e => setIsBestseller(e.target.checked)} />}
                    label={<Box display="flex" alignItems="center" gap={0.5}><FaRegStar style={{ color:"#fbbf24" }} /><span>Bestseller</span></Box>} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControlLabel control={<Switch checked={isCustomizable} onChange={e => setIsCustomizable(e.target.checked)} />} label="Customizable" />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControlLabel
                    control={<Switch checked={isSpicy} onChange={e => setIsSpicy(e.target.checked)} />}
                    label={<Box display="flex" alignItems="center" gap={0.5}><FaPepperHot style={{ color:"#ef4444" }} /><span>Spicy</span></Box>} />
                </Grid>
              </Grid>
            </Box>

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight="semibold">Food Image</Typography>
              <input type="file" accept="image/*" onChange={handleImageChange} id="food-image-upload" style={{ display:"none" }} />
              <label htmlFor="food-image-upload">
                <Box sx={{ border:`2px dashed ${errors.image?"#ef4444":"#d1d5db"}`,borderRadius:"12px",height:220,
                  display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",
                  textAlign:"center",cursor:"pointer",bgcolor:"grey.50",transition:"all 0.2s ease",
                  "&:hover":{ borderColor:"#FF5252",bgcolor:"grey.100" } }}>
                  <IoMdCamera size={52} style={{ color:"#9ca3af",marginBottom:10 }} />
                  <Typography fontWeight={500}>
                    {image?"Change image":currentImage?"Update image":"Click to upload food image"}
                  </Typography>
                </Box>
              </label>
              {errors.image && <Typography color="error" variant="caption" sx={{ mt:1 }}>{errors.image}</Typography>}
              {currentImage && (
                <Box sx={{ mt:3,position:"relative",display:"inline-block" }}>
                  <img src={currentImage} alt="preview"
                    style={{ maxHeight:200,maxWidth:"100%",borderRadius:12,boxShadow:"0 4px 10px rgba(0,0,0,0.1)" }} />
                  <IconButton size="small" color="error"
                    sx={{ position:"absolute",top:8,right:8,bgcolor:"white",boxShadow:1 }}
                    onClick={() => { setImage(null); setCurrentImage(""); }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px:3,py:2,position:"sticky",bottom:0,bgcolor:"white",borderTop:"1px solid #eee" }}>
          <Button onClick={closeModal} disabled={isSaving}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isSaving}
            sx={{ bgcolor:"#FF5252","&:hover":{ bgcolor:"#e03e3e" } }}
            startIcon={isSaving?<CircularProgress size={20} color="inherit" />:null}>
            {isSaving?(mode==="add"?"Creating...":"Updating..."):(mode==="add"?"Create":"Update")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFoodItem;