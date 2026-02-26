// import React, { useContext, useEffect, useState } from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, Button,
//   Typography, TextField, Box, CircularProgress, Select, MenuItem,
//   FormControl, InputLabel, Chip, Switch, FormControlLabel, Grid,
//   Alert, IconButton, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Pagination, Stack, Divider,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import RestaurantIcon from "@mui/icons-material/Restaurant";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import CloseIcon from "@mui/icons-material/Close";
// import { IoMdCamera, IoMdRestaurant } from "react-icons/io";
// import { FaRegStar, FaPepperHot, FaLeaf, FaDrumstickBite } from "react-icons/fa";
// import { MdVisibility } from "react-icons/md";

// import axiosInstance from "../api/axiosInstance";
// import { RestaurantContext } from "../context/getRestaurant";
// import { CategoriesContext } from "../context/GetAllCategories";

// const AddFoodItem = () => {
//   const { restaurant } = useContext(RestaurantContext);
//   const { categories } = useContext(CategoriesContext);

//   const [allCategories, setAllCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);

//   const [allMenuItems, setAllMenuItems] = useState([]);
//   const [displayedMenuItems, setDisplayedMenuItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filterCategory, setFilterCategory] = useState("all");

//   const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

//   // Modal & form states
//   const [openModal, setOpenModal] = useState(false);
//   const [mode, setMode] = useState("add");

//   // ─── View Detail Modal ───
//   const [openViewModal, setOpenViewModal] = useState(false);
//   const [viewItem, setViewItem] = useState(null);
//   const [viewLoading, setViewLoading] = useState(false);

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

//   useEffect(() => {
//     if (successMsg || errorMsg) {
//       const t = setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 5000);
//       return () => clearTimeout(t);
//     }
//   }, [successMsg, errorMsg]);

//   const fetchAllCategoriesUnpaginated = async () => {
//     if (!restaurant?.id) return;
//     const token = localStorage.getItem("token");
//     try {
//       const first = await axiosInstance.get(`/categories/${restaurant.id}`, {
//         params: { page: 1, limit: 100 },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = first.data.data || [];
//       const pg = first.data.pagination || {};
//       if (!pg.totalPages || pg.totalPages <= 1) { setAllCategories(data); return; }
//       const rest = await Promise.all(
//         Array.from({ length: pg.totalPages - 1 }, (_, i) =>
//           axiosInstance.get(`/categories/${restaurant.id}`, {
//             params: { page: i + 2, limit: 100 },
//             headers: { Authorization: `Bearer ${token}` },
//           }).then(r => r.data.data || []).catch(() => [])
//         )
//       );
//       setAllCategories([...data, ...rest.flat()]);
//     } catch {
//       setAllCategories(categories || []);
//     }
//   };

//   const fetchAllMenuItems = async (page = 1) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await axiosInstance.get(`/menuitems/${restaurant.id}/menu-items`, {
//         params: { page, limit: 10 },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAllMenuItems(res.data.data || []);
//       setPagination(res.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
//     } catch (error) {
//       setAllMenuItems([]);
//       setErrorMsg(error?.response?.data?.message || error?.message || "Failed to fetch menu items.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (restaurant?.id) {
//       fetchAllCategoriesUnpaginated();
//       fetchAllMenuItems(1);
//     }
//   }, [restaurant?.id]);

//   useEffect(() => {
//     if (filterCategory === "all") {
//       setDisplayedMenuItems(allMenuItems);
//     } else {
//       setDisplayedMenuItems(allMenuItems.filter(item => item.category_id === filterCategory));
//     }
//   }, [filterCategory, allMenuItems]);

//   const fetchSubCategories = async (categoryId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axiosInstance.get(`/subcategories/${categoryId}/sub-categories`, {
//         params: { page: 1, limit: 100 },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSubCategories(res.data.data || res.data || []);
//     } catch (error) {
//       setSubCategories([]);
//       setErrorMsg(error?.response?.data?.message || "Failed to fetch sub-categories.");
//     }
//   };

//   useEffect(() => {
//     if (selectedCategory) {
//       fetchSubCategories(selectedCategory);
//     } else {
//       setSubCategories([]);
//       setSelectedSubCategory("");
//     }
//   }, [selectedCategory]);

//   const resetForm = () => {
//     setName(""); setDescription(""); setSelectedCategory(""); setSelectedSubCategory("");
//     setPrice(""); setOfferPrice(""); setFoodType("VEG"); setIsAvailable(true);
//     setIsBestseller(false); setTaxPercent(""); setPackagingCharge(""); setIsCustomizable(false);
//     setAvailableFrom(""); setAvailableTo(""); setIsSpicy(false); setPreparationTime("");
//     setImage(null); setCurrentImage(""); setEditId(null); setErrors({}); setMode("add");
//   };

//   const openAddModal = () => { resetForm(); setOpenModal(true); };
//   const closeModal = () => { setOpenModal(false); resetForm(); };

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
//     setErrors(prev => ({ ...prev, image: "" }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) { setErrorMsg("Please fix the errors before submitting"); return; }
//     if (!image && !currentImage) {
//       setErrors({ image: "Image is required" });
//       setErrorMsg("Please upload an image before submitting");
//       return;
//     }
//     setIsSaving(true); setErrorMsg(""); setSuccessMsg("");

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
//     const config = { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } };

//     try {
//       if (mode === "add") {
//         await axiosInstance.post(`/menuitems/restaurants/${restaurant?.id}/menu-items`, formData, config);
//         setSuccessMsg("Menu item created successfully!");
//         const newTotalPages = Math.ceil((pagination.total + 1) / pagination.limit);
//         closeModal();
//         await fetchAllMenuItems(newTotalPages);
//       } else {
//         await axiosInstance.put(`/menuitems/update/menu-items/${editId}`, formData, config);
//         setSuccessMsg("Menu item updated successfully!");
//         closeModal();
//         await fetchAllMenuItems(pagination.page);
//       }
//     } catch (error) {
//       setErrorMsg(error?.response?.data?.message || error?.response?.data?.error || "Failed to save menu item.");
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
//       setErrorMsg(error?.response?.data?.message || error?.message || "Failed to load menu item details.");
//     }
//   };

//   // ─── View Detail Handler ───
//   const handleViewDetail = async (menuItem) => {
//     setViewLoading(true);
//     setOpenViewModal(true);
//     setViewItem(null);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axiosInstance.get(`/menuitems/viewsingle/${menuItem.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setViewItem(response.data.data);
//     } catch (error) {
//       setErrorMsg(error?.response?.data?.message || error?.message || "Failed to load item details.");
//       setOpenViewModal(false);
//     } finally {
//       setViewLoading(false);
//     }
//   };

//   const closeViewModal = () => {
//     setOpenViewModal(false);
//     setViewItem(null);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this menu item?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       const result = await axiosInstance.delete(`/menuitems/delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuccessMsg(result.data.message || "Menu item deleted successfully");
//       const targetPage = allMenuItems.length === 1 && pagination.page > 1
//         ? pagination.page - 1 : pagination.page;
//       await fetchAllMenuItems(targetPage);
//     } catch (error) {
//       setErrorMsg(error?.response?.data?.message || "Failed to delete menu item");
//     }
//   };

//   const handlePageChange = (_, newPage) => fetchAllMenuItems(newPage);

//   const modalCategories = allCategories.length ? allCategories : (categories || []);

//   const getCategoryName = (categoryId) =>
//     allCategories.find(c => c.id === categoryId)?.name ||
//     categories?.find(c => c.id === categoryId)?.name || "Unknown";

//   const formatTime = (t) => {
//     if (!t) return "—";
//     const [h, m] = t.split(":");
//     const hour = parseInt(h);
//     return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
//   };

//   // ─── Detail Row helper ───
//   const DetailRow = ({ label, value }) => (
//     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
//       <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ minWidth: 140 }}>{label}</Typography>
//       <Typography variant="body2" fontWeight={600} color="text.primary" textAlign="right">{value ?? "—"}</Typography>
//     </Box>
//   );

//   if (!restaurant?.id) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md text-center">
//           <RestaurantIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
//           <Typography variant="h5" className="font-bold text-gray-800 mb-2">Restaurant Required</Typography>
//           <Typography variant="body1" className="text-gray-600">Please select or load a restaurant first to manage menu items.</Typography>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 font-['Poppins'] p-4 sm:p-6 lg:p-8">
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
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <div>
//             <Typography variant="h4" className="font-bold text-gray-800">Menu Items</Typography>
//             <Typography variant="body2" className="text-gray-600">Manage your menu items and availability</Typography>
//           </div>
//           <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal}
//             sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" }, borderRadius: "12px", px: 4, py: 1.2, fontWeight: 600 }}>
//             Add Menu Item
//           </Button>
//         </div>

//         {/* Filter */}
//         <Paper sx={{ p: 3, mb: 4, borderRadius: "16px" }}>
//           <FormControl size="small" sx={{ minWidth: 280 }}>
//             <InputLabel>Filter by Category</InputLabel>
//             <Select value={filterCategory} label="Filter by Category" onChange={e => setFilterCategory(e.target.value)}>
//               <MenuItem value="all"><em>All Menu Items</em></MenuItem>
//               {modalCategories.map(cat => (
//                 <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           {filterCategory !== "all" && (
//             <Chip label={`Filtered: ${getCategoryName(filterCategory)}`}
//               onDelete={() => setFilterCategory("all")} color="primary" sx={{ ml: 2 }} />
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
//             <Typography variant="h6" color="text.secondary" gutterBottom>No menu items found</Typography>
//             <Typography color="text.secondary" sx={{ mb: 3 }}>
//               {filterCategory === "all" ? "Add your first menu item to get started" : `No items in ${getCategoryName(filterCategory)}`}
//             </Typography>
//             <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal}
//               sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}>Add Menu Item</Button>
//           </Paper>
//         ) : (
//           <Paper sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: 3 }}>
//             {/* Desktop Table */}
//             <div className="hidden lg:block">
//               <TableContainer>
//                 <Table>
//                   <TableHead sx={{ bgcolor: "#FF5252" }}>
//                     <TableRow>
//                       {["S.No", "Image", "Name & Description", "Category", "Type", "Price", "Time", "Status", "Tags", "Actions"].map((h, idx) => (
//                         <TableCell key={h} align={idx === 9 ? "right" : "left"} sx={{ color: "white", fontWeight: "bold" }}>{h}</TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {displayedMenuItems.map((item, i) => (
//                       <TableRow key={item.id} hover>
//                         <TableCell>{(pagination.page - 1) * pagination.limit + i + 1}</TableCell>
//                         <TableCell>
//                           {item.image ? (
//                             <img src={item.image} alt={item.name}
//                               style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
//                               onError={e => e.target.src = "https://via.placeholder.com/80?text=No+Image"} />
//                           ) : (
//                             <Box sx={{ width: 80, height: 80, bgcolor: "grey.100", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "text.secondary" }}>No image</Box>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <Typography fontWeight="semibold" color="#FF5252" sx={{ fontSize: "1rem" }}>{item.name}</Typography>
//                           {item.description && <Typography variant="body2" color="text.secondary" className="line-clamp-2">{item.description}</Typography>}
//                         </TableCell>
//                         <TableCell><Chip label={getCategoryName(item.category_id)} size="small" color="primary" /></TableCell>
//                         <TableCell>
//                           <Chip label={item.food_type} size="small"
//                             sx={{ bgcolor: item.food_type === "VEG" ? "#10b981" : "#ef4444", color: "white", fontWeight: 600 }} />
//                         </TableCell>
//                         <TableCell>
//                           {item.offer_price && <Typography variant="body2"><span style={{ color: "green", fontWeight: 600 }}>₹{item.offer_price}</span></Typography>}
//                         </TableCell>
//                         <TableCell>
//                           {item.preparation_time
//                             ? <Chip icon={<AccessTimeIcon sx={{ fontSize: 16 }} />} label={`${item.preparation_time} min`} size="small" sx={{ bgcolor: "#fbbf24", color: "white", fontWeight: 600 }} />
//                             : <span className="text-gray-400">-</span>}
//                         </TableCell>
//                         <TableCell>
//                           <Chip label={item.is_available ? "Available" : "Unavailable"} size="small"
//                             color={item.is_available ? "success" : "default"} sx={{ fontWeight: 600 }} />
//                         </TableCell>
//                         <TableCell>
//                           <Box display="flex" flexWrap="wrap" gap={0.5}>
//                             {item.is_bestseller && <Chip label="Best" size="small" sx={{ bgcolor: "#fbbf24", color: "white", fontSize: "0.7rem", fontWeight: 600 }} />}
//                             {item.is_spicy && <Chip label="Spicy" size="small" color="error" sx={{ fontSize: "0.7rem", fontWeight: 600 }} />}
//                             {item.is_customizable && <Chip label="Custom" size="small" color="info" sx={{ fontSize: "0.7rem", fontWeight: 600 }} />}
//                           </Box>
//                         </TableCell>
//                         <TableCell align="right">
//                           {/* View Detail Button */}
//                           <IconButton
//                             onClick={() => handleViewDetail(item)}
//                             size="small"
//                             title="View Details"
//                             sx={{ color: "#FF5252", "&:hover": { bgcolor: "#FF525215" } }}
//                           >
//                             <MdVisibility size={20} />
//                           </IconButton>
//                           <IconButton onClick={() => handleEdit(item)} size="small" color="primary"><EditIcon /></IconButton>
//                           <IconButton onClick={() => handleDelete(item.id)} size="small" color="error"><DeleteIcon /></IconButton>
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
//                         {(pagination.page - 1) * pagination.limit + i + 1}
//                       </Typography>
//                       <Typography variant="h6" color="#FF5252" fontWeight="bold">{item.name}</Typography>
//                       <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
//                         <Chip label={getCategoryName(item.category_id)} size="small" />
//                         <Chip label={item.food_type} size="small"
//                           sx={{ bgcolor: item.food_type === "VEG" ? "#10b981" : "#ef4444", color: "white" }} />
//                         <Chip label={item.is_available ? "Available" : "Unavailable"} size="small"
//                           color={item.is_available ? "success" : "default"} />
//                         {item.preparation_time && (
//                           <Chip icon={<AccessTimeIcon sx={{ fontSize: 14 }} />} label={`${item.preparation_time} min`}
//                             size="small" sx={{ bgcolor: "#fbbf24", color: "white" }} />
//                         )}
//                       </Box>
//                     </Box>
//                     <Box display="flex" gap={0.5} ml={2}>
//                       {/* View Detail Icon — Mobile */}
//                       <IconButton
//                         size="small"
//                         title="View Details"
//                         onClick={() => handleViewDetail(item)}
//                         sx={{ color: "#FF5252", "&:hover": { bgcolor: "#FF525215" } }}
//                       >
//                         <MdVisibility size={18} />
//                       </IconButton>
//                       <IconButton size="small" onClick={() => handleEdit(item)}><EditIcon fontSize="small" /></IconButton>
//                       <IconButton size="small" onClick={() => handleDelete(item.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
//                     </Box>
//                   </Box>
//                   {item.description && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{item.description}</Typography>}
//                   <Box display="flex" justifyContent="space-between" alignItems="center"
//                     sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2, mb: 2 }}>
//                     <Box>
//                       {item.offer_price && <Typography variant="body2" color="green">Offer: ₹{item.offer_price}</Typography>}
//                     </Box>
//                     <Box display="flex" gap={0.5}>
//                       {item.is_bestseller && <Chip label="⭐ Best" size="small" sx={{ bgcolor: "#fbbf24", color: "white" }} />}
//                       {item.is_spicy && <Chip label="🌶️" size="small" color="error" />}
//                       {item.is_customizable && <Chip label="Custom" size="small" color="info" />}
//                     </Box>
//                   </Box>
//                   {item.image && (
//                     <img src={item.image} alt={item.name}
//                       style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12 }}
//                       onError={e => e.target.src = "https://via.placeholder.com/300x200?text=No+Image"} />
//                   )}
//                 </Paper>
//               ))}
//             </div>

//             {/* Pagination Footer */}
//             {pagination.totalPages > 1 && (
//               <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center",
//                 justifyContent: "space-between", px: 3, py: 2, borderTop: "1px solid #f0f0f0", gap: 1 }}>
//                 <Typography variant="body2" color="text.secondary">
//                   Showing{" "}
//                   <strong>{(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}</strong>
//                   {" "}of <strong>{pagination.total}</strong> menu items
//                 </Typography>
//                 <Stack spacing={2}>
//                   <Pagination count={pagination.totalPages} page={pagination.page} onChange={handlePageChange}
//                     shape="rounded"
//                     sx={{ "& .MuiPaginationItem-root.Mui-selected": { bgcolor: "#FF5252", color: "white", "&:hover": { bgcolor: "#e03e3e" } } }} />
//                 </Stack>
//               </Box>
//             )}
//           </Paper>
//         )}
//       </div>

//       {/* ─── VIEW DETAIL MODAL ─── */}
//       <Dialog
//         open={openViewModal}
//         onClose={closeViewModal}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden" } }}
//       >
//         {/* Header */}
//         <DialogTitle sx={{ p: 0 }}>
//           <Box sx={{ background: "linear-gradient(135deg, #FF5252 0%, #ff8080 100%)", px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <Box display="flex" alignItems="center" gap={1.5}>
//               <MdVisibility size={22} color="white" />
//               <Typography variant="h6" fontWeight={700} color="white">Menu Item Details</Typography>
//             </Box>
//             <IconButton onClick={closeViewModal} size="small" sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle>

//         <DialogContent sx={{ p: 0 }}>
//           {viewLoading ? (
//             <Box display="flex" justifyContent="center" alignItems="center" py={8}>
//               <CircularProgress sx={{ color: "#FF5252" }} size={48} />
//             </Box>
//           ) : viewItem ? (
//             <>
//               {/* Food Image */}
//               {viewItem.image ? (
//                 <Box sx={{ position: "relative", width: "100%", height: 240, overflow: "hidden" }}>
//                   <img
//                     src={viewItem.image}
//                     alt={viewItem.name}
//                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                     onError={e => e.target.src = "https://via.placeholder.com/400x240?text=No+Image"}
//                   />
//                   {/* Food Type Badge on image */}
//                   <Box sx={{ position: "absolute", top: 12, left: 12 }}>
//                     <Chip
//                       icon={viewItem.food_type === "VEG"
//                         ? <FaLeaf style={{ color: "white", fontSize: 13 }} />
//                         : <FaDrumstickBite style={{ color: "white", fontSize: 13 }} />}
//                       label={viewItem.food_type}
//                       size="small"
//                       sx={{ bgcolor: viewItem.food_type === "VEG" ? "#10b981" : "#ef4444", color: "white", fontWeight: 700, fontSize: "0.75rem" }}
//                     />
//                   </Box>
//                   {/* Bestseller badge */}
//                   {viewItem.is_bestseller && (
//                     <Box sx={{ position: "absolute", top: 12, right: 12 }}>
//                       <Chip label="⭐ Bestseller" size="small" sx={{ bgcolor: "#fbbf24", color: "white", fontWeight: 700 }} />
//                     </Box>
//                   )}
//                 </Box>
//               ) : (
//                 <Box sx={{ width: "100%", height: 140, bgcolor: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1 }}>
//                   <IoMdRestaurant size={52} color="#FF525240" />
//                   <Typography variant="body2" color="text.disabled">No image available</Typography>
//                 </Box>
//               )}

//               {/* Content */}
//               <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
//                 {/* Name & Tags */}
//                 <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
//                   <Typography variant="h5" fontWeight={800} color="#FF5252" sx={{ lineHeight: 1.3, flex: 1, mr: 1 }}>
//                     {viewItem.name}
//                   </Typography>
//                   <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5}>
//                     <Chip
//                       label={viewItem.is_available ? "Available" : "Unavailable"}
//                       size="small"
//                       color={viewItem.is_available ? "success" : "default"}
//                       sx={{ fontWeight: 700 }}
//                     />
//                   </Box>
//                 </Box>

//                 {/* Tags row */}
//                 <Box display="flex" flexWrap="wrap" gap={0.8} mb={2}>
//                   {viewItem.is_spicy && (
//                     <Chip icon={<FaPepperHot style={{ color: "white", fontSize: 11 }} />}
//                       label="Spicy" size="small" color="error" sx={{ fontWeight: 600, fontSize: "0.72rem" }} />
//                   )}
//                   {viewItem.is_customizable && (
//                     <Chip label="Customizable" size="small" color="info" sx={{ fontWeight: 600, fontSize: "0.72rem" }} />
//                   )}
//                   {viewItem.preparation_time && (
//                     <Chip icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
//                       label={`${viewItem.preparation_time} min`} size="small"
//                       sx={{ bgcolor: "#fbbf24", color: "white", fontWeight: 600, fontSize: "0.72rem" }} />
//                   )}
//                 </Box>

//                 {/* Description */}
//                 {viewItem.description && (
//                   <Box sx={{ bgcolor: "#fff8f8", border: "1px solid #ffe0e0", borderRadius: 2, px: 2, py: 1.5, mb: 2 }}>
//                     <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>Description</Typography>
//                     <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7 }}>{viewItem.description}</Typography>
//                   </Box>
//                 )}

//                 <Divider sx={{ mb: 2 }} />

//                 {/* Pricing Section */}
//                 <Box sx={{ bgcolor: "#f9fafb", borderRadius: 2, px: 2, py: 1.5, mb: 2 }}>
//                   <Typography variant="subtitle2" fontWeight={700} color="#FF5252" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.72rem" }}>
//                     Pricing
//                   </Typography>
//                   <Grid container spacing={1}>
//                     <Grid item xs={6}>
//                       <Box sx={{ bgcolor: "white", borderRadius: 1.5, p: 1.5, border: "1px solid #f0f0f0", textAlign: "center" }}>
//                         <Typography variant="caption" color="text.secondary" display="block">Price</Typography>
//                         <Typography variant="h6" fontWeight={800} color="text.primary">
//                           {viewItem.price ? `₹${viewItem.price}` : "—"}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Box sx={{ bgcolor: "white", borderRadius: 1.5, p: 1.5, border: "1px solid #f0f0f0", textAlign: "center" }}>
//                         <Typography variant="caption" color="text.secondary" display="block">Offer Price</Typography>
//                         <Typography variant="h6" fontWeight={800} color="green">
//                           {viewItem.offer_price ? `₹${viewItem.offer_price}` : "—"}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     {(viewItem.tax_percent || viewItem.packaging_charge) && (
//                       <>
//                         {viewItem.tax_percent && (
//                           <Grid item xs={6}>
//                             <Box sx={{ bgcolor: "white", borderRadius: 1.5, p: 1.5, border: "1px solid #f0f0f0", textAlign: "center" }}>
//                               <Typography variant="caption" color="text.secondary" display="block">Tax</Typography>
//                               <Typography variant="body1" fontWeight={700}>{viewItem.tax_percent}%</Typography>
//                             </Box>
//                           </Grid>
//                         )}
//                         {viewItem.packaging_charge && (
//                           <Grid item xs={6}>
//                             <Box sx={{ bgcolor: "white", borderRadius: 1.5, p: 1.5, border: "1px solid #f0f0f0", textAlign: "center" }}>
//                               <Typography variant="caption" color="text.secondary" display="block">Packaging</Typography>
//                               <Typography variant="body1" fontWeight={700}>₹{viewItem.packaging_charge}</Typography>
//                             </Box>
//                           </Grid>
//                         )}
//                       </>
//                     )}
//                   </Grid>
//                 </Box>

//                 <Divider sx={{ mb: 2 }} />

//                 {/* Other Details */}
//                 <Box sx={{ bgcolor: "#f9fafb", borderRadius: 2, px: 2, py: 1.5, mb: 2 }}>
//                   <Typography variant="subtitle2" fontWeight={700} color="#FF5252" sx={{ mb: 0.5, textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.72rem" }}>
//                     Details
//                   </Typography>
//                   <DetailRow label="Category" value={getCategoryName(viewItem.category_id)} />
//                   <Divider sx={{ opacity: 0.4 }} />
//                   <DetailRow label="Food Type" value={viewItem.food_type} />
//                   {(viewItem.available_from || viewItem.available_to) && (
//                     <>
//                       <Divider sx={{ opacity: 0.4 }} />
//                       <DetailRow
//                         label="Available Hours"
//                         value={`${formatTime(viewItem.available_from)} – ${formatTime(viewItem.available_to)}`}
//                       />
//                     </>
//                   )}
//                   {viewItem.preparation_time && (
//                     <>
//                       <Divider sx={{ opacity: 0.4 }} />
//                       <DetailRow label="Prep Time" value={`${viewItem.preparation_time} min`} />
//                     </>
//                   )}
//                 </Box>
//               </Box>
//             </>
//           ) : null}
//         </DialogContent>

//         <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #eee", bgcolor: "white" }}>
//           <Button
//             onClick={() => { closeViewModal(); if (viewItem) handleEdit(viewItem); }}
//             startIcon={<EditIcon />}
//             variant="outlined"
//             sx={{ borderColor: "#FF5252", color: "#FF5252", "&:hover": { borderColor: "#e03e3e", bgcolor: "#FF525208" }, borderRadius: "10px", fontWeight: 600 }}
//           >
//             Edit Item
//           </Button>
//           <Button
//             onClick={closeViewModal}
//             variant="contained"
//             sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" }, borderRadius: "10px", fontWeight: 600, px: 3 }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ─── ADD / EDIT MODAL ─── */}
//       <Dialog open={openModal} onClose={closeModal} maxWidth="md" fullWidth scroll="paper" keepMounted
//         PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}>
//         <DialogTitle sx={{ bgcolor: "#FF5252", color: "white", position: "sticky", top: 0, zIndex: 1 }}>
//           <Box display="flex" alignItems="center" gap={2}>
//             <RestaurantIcon />
//             <span>{mode === "add" ? "Add New Menu Item" : "Edit Menu Item"}</span>
//           </Box>
//         </DialogTitle>

//         <DialogContent sx={{ p: 0, overflow: "hidden" }}>
//           <Box component="form" onSubmit={handleSubmit}
//             sx={{ px: 3, pt: 3, pb: 2, display: "flex", flexDirection: "column", gap: 3,
//               maxHeight: "65vh", overflowY: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>

//             {/* Category & Sub-Category */}
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth error={!!errors.category}>
//                   <InputLabel>Select Category *</InputLabel>
//                   <Select value={selectedCategory} label="Select Category *"
//                     onChange={e => { setSelectedCategory(e.target.value); setSelectedSubCategory(""); if (errors.category) setErrors(p => ({ ...p, category: "" })); }}
//                     MenuProps={{ disablePortal: false, container: document.body, PaperProps: { sx: { maxHeight: 260, zIndex: 2000 } } }}>
//                     {modalCategories.map(cat => (
//                       <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
//                     ))}
//                   </Select>
//                   {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth error={!!errors.subCategory}>
//                   <InputLabel>Select Sub-Category *</InputLabel>
//                   <Select value={selectedSubCategory} label="Select Sub-Category *"
//                     onChange={e => { setSelectedSubCategory(e.target.value); if (errors.subCategory) setErrors(p => ({ ...p, subCategory: "" })); }}
//                     disabled={!selectedCategory}
//                     MenuProps={{ disablePortal: false, container: document.body, PaperProps: { sx: { maxHeight: 260, zIndex: 2000 } } }}>
//                     {subCategories.map(sc => (
//                       <MenuItem key={sc.id} value={sc.id}>{sc.name}</MenuItem>
//                     ))}
//                   </Select>
//                   {errors.subCategory && <Typography color="error" variant="caption">{errors.subCategory}</Typography>}
//                 </FormControl>
//               </Grid>
//             </Grid>

//             {/* Name & Food Type */}
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField label="Food Name *" value={name} fullWidth
//                   onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: "" })); }}
//                   error={!!errors.name} helperText={errors.name} />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Food Type</InputLabel>
//                   <Select value={foodType} label="Food Type" onChange={e => setFoodType(e.target.value)}
//                     MenuProps={{ disablePortal: false, container: document.body, PaperProps: { sx: { maxHeight: 260, zIndex: 2000 } } }}>
//                     <MenuItem value="VEG">Veg</MenuItem>
//                     <MenuItem value="NON_VEG">Non-Veg</MenuItem>
//                     <MenuItem value="(veg,non-veg) BOTH">Both</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>

//             {/* Description */}
//             <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)}
//               multiline rows={3} fullWidth placeholder="Describe your delicious dish..." />

//             {/* Pricing */}
//             <Grid container spacing={2}>
//               <Grid item xs={6} sm={3}>
//                 <TextField label="Price (₹) *" type="number" value={price} fullWidth
//                   onChange={e => { setPrice(e.target.value); if (errors.price) setErrors(p => ({ ...p, price: "" })); }}
//                   error={!!errors.price} helperText={errors.price} inputProps={{ min: 0, step: "0.01" }} />
//               </Grid>
//               <Grid item xs={6} sm={3}>
//                 <TextField label="Offer Price (₹)" type="number" value={offerPrice}
//                   onChange={e => setOfferPrice(e.target.value)} fullWidth inputProps={{ min: 0, step: "0.01" }} />
//               </Grid>
//               <Grid item xs={6} sm={3}>
//                 <TextField label="Tax %" type="number" value={taxPercent}
//                   onChange={e => setTaxPercent(e.target.value)} fullWidth inputProps={{ min: 0, max: 100, step: "0.01" }} />
//               </Grid>
//               <Grid item xs={6} sm={3}>
//                 <TextField label="Packaging (₹)" type="number" value={packagingCharge}
//                   onChange={e => setPackagingCharge(e.target.value)} fullWidth inputProps={{ min: 0, step: "0.01" }} />
//               </Grid>
//             </Grid>

//             {/* Times */}
//             <Grid container spacing={2}>
//               <Grid item xs={6} sm={4}>
//                 <TextField label="Available From" type="time" value={availableFrom}
//                   onChange={e => setAvailableFrom(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
//               </Grid>
//               <Grid item xs={6} sm={4}>
//                 <TextField label="Available To" type="time" value={availableTo}
//                   onChange={e => setAvailableTo(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField label="Preparation Time (min)" type="number" value={preparationTime}
//                   onChange={e => setPreparationTime(e.target.value)} fullWidth inputProps={{ min: 0 }} />
//               </Grid>
//             </Grid>

//             {/* Toggles */}
//             <Box>
//               <Typography variant="subtitle2" gutterBottom fontWeight="semibold">Item Properties</Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={6} sm={3}>
//                   <FormControlLabel control={<Switch checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} />} label="Available" />
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                   <FormControlLabel
//                     control={<Switch checked={isBestseller} onChange={e => setIsBestseller(e.target.checked)} />}
//                     label={<Box display="flex" alignItems="center" gap={0.5}><FaRegStar style={{ color: "#fbbf24" }} /><span>Bestseller</span></Box>} />
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                   <FormControlLabel control={<Switch checked={isCustomizable} onChange={e => setIsCustomizable(e.target.checked)} />} label="Customizable" />
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                   <FormControlLabel
//                     control={<Switch checked={isSpicy} onChange={e => setIsSpicy(e.target.checked)} />}
//                     label={<Box display="flex" alignItems="center" gap={0.5}><FaPepperHot style={{ color: "#ef4444" }} /><span>Spicy</span></Box>} />
//                 </Grid>
//               </Grid>
//             </Box>

//             {/* Image Upload */}
//             <Box>
//               <Typography variant="subtitle2" gutterBottom fontWeight="semibold">Food Image</Typography>
//               <input type="file" accept="image/*" onChange={handleImageChange} id="food-image-upload" style={{ display: "none" }} />
//               <label htmlFor="food-image-upload">
//                 <Box sx={{ border: `2px dashed ${errors.image ? "#ef4444" : "#d1d5db"}`, borderRadius: "12px", height: 220,
//                   display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
//                   textAlign: "center", cursor: "pointer", bgcolor: "grey.50", transition: "all 0.2s ease",
//                   "&:hover": { borderColor: "#FF5252", bgcolor: "grey.100" } }}>
//                   <IoMdCamera size={52} style={{ color: "#9ca3af", marginBottom: 10 }} />
//                   <Typography fontWeight={500}>
//                     {image ? "Change image" : currentImage ? "Update image" : "Click to upload food image"}
//                   </Typography>
//                 </Box>
//               </label>
//               {errors.image && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.image}</Typography>}
//               {currentImage && (
//                 <Box sx={{ mt: 3, position: "relative", display: "inline-block" }}>
//                   <img src={currentImage} alt="preview"
//                     style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 12, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
//                   <IconButton size="small" color="error"
//                     sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white", boxShadow: 1 }}
//                     onClick={() => { setImage(null); setCurrentImage(""); }}>
//                     <DeleteIcon fontSize="small" />
//                   </IconButton>
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         </DialogContent>

//         <DialogActions sx={{ px: 3, py: 2, position: "sticky", bottom: 0, bgcolor: "white", borderTop: "1px solid #eee" }}>
//           <Button onClick={closeModal} disabled={isSaving}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit} disabled={isSaving}
//             sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" } }}
//             startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}>
//             {isSaving ? (mode === "add" ? "Creating..." : "Updating...") : (mode === "add" ? "Create" : "Update")}
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
  TableHead, TableRow, Paper, Pagination, Stack, Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import { IoMdCamera, IoMdRestaurant } from "react-icons/io";
import { FaRegStar, FaPepperHot, FaLeaf, FaDrumstickBite, FaBolt } from "react-icons/fa";
import { MdVisibility, MdToggleOn, MdToggleOff } from "react-icons/md";

import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { CategoriesContext } from "../context/GetAllCategories";

const AddFoodItem = () => {
  const { restaurant } = useContext(RestaurantContext);
  const { categories } = useContext(CategoriesContext);

  const [allCategories, setAllCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [displayedMenuItems, setDisplayedMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  /* ── Add / Edit Modal ── */
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add");

  /* ── View Detail Modal ── */
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  /* ── Status Modal ── */
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [statusItem, setStatusItem] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [statusForm, setStatusForm] = useState({
    is_active: true,
    is_available: true,
    is_recommended: false,
    is_bestseller: false,
    is_fast_delivery: false,
  });

  /* ── Form Fields ── */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [foodType, setFoodType] = useState("VEG");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isFastDelivery, setIsFastDelivery] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [taxPercent, setTaxPercent] = useState("");
  const [packagingCharge, setPackagingCharge] = useState("");
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [isSpicy, setIsSpicy] = useState(false);
  const [preparationTime, setPreparationTime] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [calories, setCalories] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /* ── Auto-clear alerts ── */
  useEffect(() => {
    if (successMsg || errorMsg) {
      const t = setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 5000);
      return () => clearTimeout(t);
    }
  }, [successMsg, errorMsg]);

  /* ── Fetch all categories ── */
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
      if (!pg.totalPages || pg.totalPages <= 1) { setAllCategories(data); return; }
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

  /* ── Fetch menu items ── */
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

  /* ── Client-side filter ── */
  useEffect(() => {
    if (filterCategory === "all") setDisplayedMenuItems(allMenuItems);
    else setDisplayedMenuItems(allMenuItems.filter(item => item.category_id === filterCategory));
  }, [filterCategory, allMenuItems]);

  /* ── Fetch subcategories ── */
  const fetchSubCategories = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/subcategories/${categoryId}/sub-categories`, {
        params: { page: 1, limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories(res.data.data || res.data || []);
    } catch (error) {
      setSubCategories([]);
      setErrorMsg(error?.response?.data?.message || "Failed to fetch sub-categories.");
    }
  };

  useEffect(() => {
    if (selectedCategory) fetchSubCategories(selectedCategory);
    else { setSubCategories([]); setSelectedSubCategory(""); }
  }, [selectedCategory]);

  /* ── Reset form ── */
  const resetForm = () => {
    setName(""); setDescription(""); setSelectedCategory(""); setSelectedSubCategory("");
    setPrice(""); setOfferPrice(""); setFoodType("VEG"); setIsAvailable(true);
    setIsBestseller(false); setIsRecommended(false); setIsFastDelivery(false); setIsActive(true);
    setTaxPercent(""); setPackagingCharge(""); setIsCustomizable(false);
    setAvailableFrom(""); setAvailableTo(""); setIsSpicy(false); setPreparationTime("");
    setStockQuantity(""); setCalories(""); setImage(null); setCurrentImage("");
    setEditId(null); setErrors({}); setMode("add");
  };

  const openAddModal = () => { resetForm(); setOpenModal(true); };
  const closeModal = () => { setOpenModal(false); resetForm(); };

  /* ── Validate ── */
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

  /* ── Submit Add / Edit ── */
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
    formData.append("is_recommended", isRecommended);
    formData.append("is_fast_delivery", isFastDelivery);
    formData.append("is_active", isActive);
    if (taxPercent) formData.append("tax_percent", taxPercent);
    if (packagingCharge) formData.append("packaging_charge", packagingCharge);
    formData.append("is_customizable", isCustomizable);
    if (availableFrom) formData.append("available_from", availableFrom);
    if (availableTo) formData.append("available_to", availableTo);
    formData.append("is_spicy", isSpicy);
    if (preparationTime) formData.append("preparation_time", preparationTime);
    if (stockQuantity) formData.append("stock_quantity", stockQuantity);
    if (calories) formData.append("calories", calories);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");
    const config = { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } };

    try {
      if (mode === "add") {
        await axiosInstance.post(`/menuitems/restaurants/${restaurant?.id}/menu-items`, formData, config);
        setSuccessMsg("Menu item created successfully!");
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

  /* ── Edit handler ── */
  const handleEdit = async (menuItem) => {
    try {
      setEditId(menuItem.id);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/menuitems/viewsingle/${menuItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data;
      setName(data.name || "");
      setDescription(data.description || "");
      setSelectedCategory(data.category_id || "");
      setSelectedSubCategory(data.sub_category_id || "");
      setPrice(data.price || "");
      setOfferPrice(data.offer_price || "");
      setFoodType(data.food_type || "VEG");
      setIsAvailable(data.is_available ?? true);
      setIsBestseller(data.is_bestseller ?? false);
      setIsRecommended(data.is_recommended ?? false);
      setIsFastDelivery(data.is_fast_delivery ?? false);
      setIsActive(data.is_active ?? true);
      setTaxPercent(data.tax_percent || "");
      setPackagingCharge(data.packaging_charge || "");
      setIsCustomizable(data.is_customizable ?? false);
      setAvailableFrom(data.available_from || "");
      setAvailableTo(data.available_to || "");
      setIsSpicy(data.is_spicy ?? false);
      setPreparationTime(data.preparation_time || "");
      setStockQuantity(data.stock_quantity || "");
      setCalories(data.calories || "");
      setCurrentImage(data.image || "");
      setImage(null);
      setMode("edit");
      setOpenModal(true);
      setErrors({});
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || error?.message || "Failed to load menu item details.");
    }
  };

  /* ── View Detail ── */
  const handleViewDetail = async (menuItem) => {
    setViewLoading(true);
    setOpenViewModal(true);
    setViewItem(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/menuitems/viewsingle/${menuItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setViewItem(response.data.data);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || error?.message || "Failed to load item details.");
      setOpenViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  const closeViewModal = () => { setOpenViewModal(false); setViewItem(null); };

  /* ── Status Modal ── */
  const handleOpenStatusModal = async (menuItem) => {
    setStatusItem(menuItem);
    setOpenStatusModal(true);
    setStatusLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/menuitems/viewsingle/${menuItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data;
      setStatusForm({
        is_active: data.is_active ?? true,
        is_available: data.is_available ?? true,
        is_recommended: data.is_recommended ?? false,
        is_bestseller: data.is_bestseller ?? false,
        is_fast_delivery: data.is_fast_delivery ?? false,
      });
    } catch {
      setStatusForm({
        is_active: menuItem.is_active ?? true,
        is_available: menuItem.is_available ?? true,
        is_recommended: menuItem.is_recommended ?? false,
        is_bestseller: menuItem.is_bestseller ?? false,
        is_fast_delivery: menuItem.is_fast_delivery ?? false,
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const closeStatusModal = () => { setOpenStatusModal(false); setStatusItem(null); };

  const handleStatusToggle = (field) => {
    setStatusForm(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveStatus = async () => {
    if (!statusItem) return;
    setIsSavingStatus(true);
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.patch(
        `/menuitems/${statusItem.id}/statuses`,
        statusForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg("Status updated successfully!");
      closeStatusModal();
      await fetchAllMenuItems(pagination.page);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Failed to update status.");
    } finally {
      setIsSavingStatus(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const token = localStorage.getItem("token");
      const result = await axiosInstance.delete(`/menuitems/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg(result.data.message || "Menu item deleted successfully");
      const targetPage = allMenuItems.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
      await fetchAllMenuItems(targetPage);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Failed to delete menu item");
    }
  };

  const handlePageChange = (_, newPage) => fetchAllMenuItems(newPage);
  const modalCategories = allCategories.length ? allCategories : (categories || []);
  const getCategoryName = (id) =>
    allCategories.find(c => c.id === id)?.name || categories?.find(c => c.id === id)?.name || "Unknown";
  const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  /* ── Detail Row ── */
  const DetailRow = ({ label, value }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ minWidth: 140 }}>{label}</Typography>
      <Typography variant="body2" fontWeight={600} color="text.primary" textAlign="right">{value ?? "—"}</Typography>
    </Box>
  );

  /* ── Status Toggle Row ── */
  const StatusRow = ({ field, label, description, color }) => (
    <Box sx={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      p: 2, borderRadius: 2, border: "1px solid",
      borderColor: statusForm[field] ? `${color}40` : "#f0f0f0",
      bgcolor: statusForm[field] ? `${color}0D` : "grey.50",
      transition: "all 0.25s ease",
      cursor: "pointer",
    }} onClick={() => handleStatusToggle(field)}>
      <Box>
        <Typography variant="body2" fontWeight={700} color={statusForm[field] ? color : "text.primary"}>{label}</Typography>
        <Typography variant="caption" color="text.secondary">{description}</Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <Chip label={statusForm[field] ? "ON" : "OFF"} size="small"
          sx={{ bgcolor: statusForm[field] ? color : "#9e9e9e", color: "white", fontWeight: 700, fontSize: "0.7rem", minWidth: 42 }} />
        <Box sx={{ color: statusForm[field] ? color : "text.disabled", display: "flex", alignItems: "center" }}>
          {statusForm[field] ? <MdToggleOn size={36} /> : <MdToggleOff size={36} />}
        </Box>
      </Box>
    </Box>
  );

  if (!restaurant?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <RestaurantIcon sx={{ fontSize: 64, color: "#FF5252", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" mb={1}>Restaurant Required</Typography>
          <Typography color="text.secondary">Please select or load a restaurant first to manage menu items.</Typography>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins'] p-4 sm:p-6 lg:p-8">
      {successMsg && <Alert severity="success" sx={{ mb: 3, maxWidth: "lg", mx: "auto" }} onClose={() => setSuccessMsg("")}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 3, maxWidth: "lg", mx: "auto" }} onClose={() => setErrorMsg("")}>{errorMsg}</Alert>}

      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <Typography variant="h4" fontWeight="bold" color="text.primary">Menu Items</Typography>
            <Typography variant="body2" color="text.secondary">Manage your menu items and availability</Typography>
          </div>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal}
            sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" }, borderRadius: "12px", px: 4, py: 1.2, fontWeight: 600 }}>
            Add Menu Item
          </Button>
        </div>

        {/* ── Filter ── */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: "16px" }}>
          <FormControl size="small" sx={{ minWidth: 280 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select value={filterCategory} label="Filter by Category" onChange={e => setFilterCategory(e.target.value)}>
              <MenuItem value="all"><em>All Menu Items</em></MenuItem>
              {modalCategories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
            </Select>
          </FormControl>
          {filterCategory !== "all" && (
            <Chip label={`Filtered: ${getCategoryName(filterCategory)}`}
              onDelete={() => setFilterCategory("all")} color="primary" sx={{ ml: 2 }} />
          )}
        </Paper>

        {/* ── List ── */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}><CircularProgress sx={{ color: "#FF5252" }} size={60} /></Box>
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
                      {["S.No", "Image", "Name & Description", "Category", "Type", "Price", "Time", "Status", "Tags", "Actions"].map((h, idx) => (
                        <TableCell key={h} align={idx === 9 ? "center" : "left"} sx={{ color: "white", fontWeight: "bold", whiteSpace: "nowrap" }}>{h}</TableCell>
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
                              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                              onError={e => e.target.src = "https://via.placeholder.com/80?text=No+Image"} />
                          ) : (
                            <Box sx={{ width: 80, height: 80, bgcolor: "grey.100", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "text.secondary" }}>No image</Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography fontWeight={600} color="#FF5252" sx={{ fontSize: "0.95rem" }}>{item.name}</Typography>
                          {item.description && <Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.description}</Typography>}
                        </TableCell>
                        <TableCell><Chip label={getCategoryName(item.category_id)} size="small" color="primary" /></TableCell>
                        <TableCell>
                          <Chip label={item.food_type} size="small"
                            sx={{ bgcolor: item.food_type === "VEG" ? "#10b981" : "#ef4444", color: "white", fontWeight: 600 }} />
                        </TableCell>
                        <TableCell>
                          {item.price && <Typography variant="body2" fontWeight={700}>₹{item.price}</Typography>}
                          {item.offer_price && <Typography variant="caption" color="green" fontWeight={600}>Offer: ₹{item.offer_price}</Typography>}
                        </TableCell>
                        <TableCell>
                          {item.preparation_time
                            ? <Chip icon={<AccessTimeIcon sx={{ fontSize: 14 }} />} label={`${item.preparation_time} min`} size="small" sx={{ bgcolor: "#fbbf24", color: "white", fontWeight: 600 }} />
                            : <span className="text-gray-400 text-sm">—</span>}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            <Chip label={item.is_available ? "Available" : "Unavailable"} size="small"
                              color={item.is_available ? "success" : "default"} sx={{ fontWeight: 600 }} />
                            {item.is_active === false && <Chip label="Inactive" size="small" color="error" sx={{ fontWeight: 600 }} />}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {item.is_bestseller && <Chip label="⭐ Best" size="small" sx={{ bgcolor: "#fbbf24", color: "white", fontSize: "0.68rem", fontWeight: 600 }} />}
                            {item.is_spicy && <Chip label="🌶️ Spicy" size="small" color="error" sx={{ fontSize: "0.68rem", fontWeight: 600 }} />}
                            {item.is_customizable && <Chip label="Custom" size="small" color="info" sx={{ fontSize: "0.68rem", fontWeight: 600 }} />}
                            {item.is_recommended && <Chip label="Rec" size="small" sx={{ bgcolor: "#8b5cf6", color: "white", fontSize: "0.68rem", fontWeight: 600 }} />}
                            {item.is_fast_delivery && <Chip label="⚡ Fast" size="small" sx={{ bgcolor: "#06b6d4", color: "white", fontSize: "0.68rem", fontWeight: 600 }} />}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center" gap={0.2}>
                            <IconButton onClick={() => handleViewDetail(item)} size="small" title="View Details"
                              sx={{ color: "#FF5252", "&:hover": { bgcolor: "#FF525215" } }}>
                              <MdVisibility size={20} />
                            </IconButton>
                            <IconButton onClick={() => handleOpenStatusModal(item)} size="small" title="Manage Status"
                              sx={{ color: "#8b5cf6", "&:hover": { bgcolor: "#8b5cf615" } }}>
                              <TuneIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleEdit(item)} size="small" color="primary" title="Edit"><EditIcon fontSize="small" /></IconButton>
                            <IconButton onClick={() => handleDelete(item.id)} size="small" color="error" title="Delete"><DeleteIcon fontSize="small" /></IconButton>
                          </Box>
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
                <Paper key={item.id} elevation={2} sx={{ borderRadius: "16px", p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                      <Typography variant="caption" color="text.secondary">{(pagination.page - 1) * pagination.limit + i + 1}</Typography>
                      <Typography variant="h6" color="#FF5252" fontWeight="bold">{item.name}</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        <Chip label={getCategoryName(item.category_id)} size="small" />
                        <Chip label={item.food_type} size="small" sx={{ bgcolor: item.food_type === "VEG" ? "#10b981" : "#ef4444", color: "white" }} />
                        <Chip label={item.is_available ? "Available" : "Unavailable"} size="small" color={item.is_available ? "success" : "default"} />
                        {item.preparation_time && <Chip icon={<AccessTimeIcon sx={{ fontSize: 14 }} />} label={`${item.preparation_time} min`} size="small" sx={{ bgcolor: "#fbbf24", color: "white" }} />}
                      </Box>
                    </Box>
                    <Box display="flex" gap={0.2} ml={1} flexWrap="wrap" justifyContent="flex-end">
                      <IconButton size="small" title="View" onClick={() => handleViewDetail(item)} sx={{ color: "#FF5252" }}><MdVisibility size={18} /></IconButton>
                      <IconButton size="small" title="Status" onClick={() => handleOpenStatusModal(item)} sx={{ color: "#8b5cf6" }}><TuneIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleEdit(item)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(item.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                  {item.description && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{item.description}</Typography>}
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2, mb: 2 }}>
                    <Box>
                      {item.price && <Typography fontWeight={700}>₹{item.price}</Typography>}
                      {item.offer_price && <Typography variant="body2" color="green">Offer: ₹{item.offer_price}</Typography>}
                    </Box>
                    <Box display="flex" flexWrap="wrap" gap={0.5} justifyContent="flex-end">
                      {item.is_bestseller && <Chip label="⭐" size="small" sx={{ bgcolor: "#fbbf24", color: "white" }} />}
                      {item.is_spicy && <Chip label="🌶️" size="small" color="error" />}
                      {item.is_recommended && <Chip label="Rec" size="small" sx={{ bgcolor: "#8b5cf6", color: "white" }} />}
                      {item.is_fast_delivery && <Chip label="⚡" size="small" sx={{ bgcolor: "#06b6d4", color: "white" }} />}
                    </Box>
                  </Box>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12 }} onError={e => e.target.src = "https://via.placeholder.com/300x200?text=No+Image"} />}
                </Paper>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", justifyContent: "space-between", px: 3, py: 2, borderTop: "1px solid #f0f0f0", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing <strong>{(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of <strong>{pagination.total}</strong> menu items
                </Typography>
                <Stack spacing={2}>
                  <Pagination count={pagination.totalPages} page={pagination.page} onChange={handlePageChange} shape="rounded"
                    sx={{ "& .MuiPaginationItem-root.Mui-selected": { bgcolor: "#FF5252", color: "white", "&:hover": { bgcolor: "#e03e3e" } } }} />
                </Stack>
              </Box>
            )}
          </Paper>
        )}
      </div>

      {/* ═══════════════════════════════════════
          STATUS MODAL  (PATCH /menuitems/:id/statuses)
      ═══════════════════════════════════════ */}
      <Dialog open={openStatusModal} onClose={closeStatusModal} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden" } }}>
        <DialogTitle sx={{ p: 0 }}>
          <Box sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)", px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <TuneIcon sx={{ color: "white" }} />
              <Box>
                <Typography variant="h6" fontWeight={700} color="white">Manage Status</Typography>
                {statusItem && <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>{statusItem.name}</Typography>}
              </Box>
            </Box>
            <IconButton onClick={closeStatusModal} size="small" sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 2.5, py: 2.5 }}>
          {statusLoading ? (
            <Box display="flex" justifyContent="center" py={5}><CircularProgress sx={{ color: "#8b5cf6" }} size={44} /></Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={1.5}>
              <StatusRow field="is_active" label="Active" description="Item is visible on the platform" color="#10b981" />
              <StatusRow field="is_available" label="Available" description="Can be ordered right now" color="#FF5252" />
              <StatusRow field="is_recommended" label="Recommended" description="Show in recommended section" color="#8b5cf6" />
              <StatusRow field="is_bestseller" label="Bestseller" description="Mark as a bestselling item" color="#f59e0b" />
              <StatusRow field="is_fast_delivery" label="Fast Delivery" description="Eligible for fast delivery" color="#06b6d4" />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 2, borderTop: "1px solid #eee", bgcolor: "white", gap: 1 }}>
          <Button onClick={closeStatusModal} disabled={isSavingStatus} sx={{ borderRadius: "10px", fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStatus} disabled={isSavingStatus || statusLoading}
            startIcon={isSavingStatus ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" }, borderRadius: "10px", fontWeight: 600, px: 3 }}>
            {isSavingStatus ? "Saving..." : "Save Status"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════
          VIEW DETAIL MODAL
      ═══════════════════════════════════════ */}
      <Dialog open={openViewModal} onClose={closeViewModal} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden" } }}>
        <DialogTitle sx={{ p: 0 }}>
          <Box sx={{ background: "linear-gradient(135deg, #FF5252 0%, #ff8080 100%)", px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <MdVisibility size={22} color="white" />
              <Typography variant="h6" fontWeight={700} color="white">Menu Item Details</Typography>
            </Box>
            <IconButton onClick={closeViewModal} size="small" sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {viewLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress sx={{ color: "#FF5252" }} size={48} />
            </Box>
          ) : viewItem ? (
            <>
              {/* Image */}
              {viewItem.image ? (
                <Box sx={{ position: "relative", width: "100%", height: 240, overflow: "hidden" }}>
                  <img src={viewItem.image} alt={viewItem.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => e.target.src = "https://via.placeholder.com/400x240?text=No+Image"} />
                  <Box sx={{ position: "absolute", top: 12, left: 12 }}>
                    <Chip
                      icon={viewItem.food_type === "VEG" ? <FaLeaf style={{ color: "white", fontSize: 12 }} /> : <FaDrumstickBite style={{ color: "white", fontSize: 12 }} />}
                      label={viewItem.food_type} size="small"
                      sx={{ bgcolor: viewItem.food_type === "VEG" ? "#10b981" : "#ef4444", color: "white", fontWeight: 700 }} />
                  </Box>
                  <Box sx={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 0.5, alignItems: "flex-end" }}>
                    {viewItem.is_bestseller && <Chip label="⭐ Bestseller" size="small" sx={{ bgcolor: "#fbbf24", color: "white", fontWeight: 700 }} />}
                    {viewItem.is_recommended && <Chip label="Recommended" size="small" sx={{ bgcolor: "#8b5cf6", color: "white", fontWeight: 700 }} />}
                    {viewItem.is_fast_delivery && <Chip label="⚡ Fast" size="small" sx={{ bgcolor: "#06b6d4", color: "white", fontWeight: 700 }} />}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ width: "100%", height: 140, bgcolor: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1 }}>
                  <IoMdRestaurant size={52} color="#FF525240" />
                  <Typography variant="body2" color="text.disabled">No image available</Typography>
                </Box>
              )}

              <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
                {/* Name & availability */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h5" fontWeight={800} color="#FF5252" sx={{ lineHeight: 1.3, flex: 1, mr: 1 }}>{viewItem.name}</Typography>
                  <Box display="flex" flexDirection="column" gap={0.5} alignItems="flex-end">
                    <Chip label={viewItem.is_available ? "Available" : "Unavailable"} size="small"
                      color={viewItem.is_available ? "success" : "default"} sx={{ fontWeight: 700 }} />
                    {viewItem.is_active === false && <Chip label="Inactive" size="small" color="error" sx={{ fontWeight: 700 }} />}
                  </Box>
                </Box>

                {/* Tags */}
                <Box display="flex" flexWrap="wrap" gap={0.8} mb={2}>
                  {viewItem.is_spicy && <Chip icon={<FaPepperHot style={{ color: "white", fontSize: 11 }} />} label="Spicy" size="small" color="error" sx={{ fontWeight: 600 }} />}
                  {viewItem.is_customizable && <Chip label="Customizable" size="small" color="info" sx={{ fontWeight: 600 }} />}
                  {viewItem.preparation_time && <Chip icon={<AccessTimeIcon sx={{ fontSize: 13 }} />} label={`${viewItem.preparation_time} min`} size="small" sx={{ bgcolor: "#fbbf24", color: "white", fontWeight: 600 }} />}
                  {viewItem.calories && <Chip label={`🔥 ${viewItem.calories} cal`} size="small" sx={{ bgcolor: "#f97316", color: "white", fontWeight: 600 }} />}
                  {viewItem.stock_quantity != null && <Chip label={`Stock: ${viewItem.stock_quantity}`} size="small" sx={{ bgcolor: "#64748b", color: "white", fontWeight: 600 }} />}
                </Box>

                {/* Description */}
                {viewItem.description && (
                  <Box sx={{ bgcolor: "#fff8f8", border: "1px solid #ffe0e0", borderRadius: 2, px: 2, py: 1.5, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} mb={0.5}>Description</Typography>
                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7 }}>{viewItem.description}</Typography>
                  </Box>
                )}

                <Divider sx={{ mb: 2 }} />

                {/* Pricing */}
                <Box sx={{ bgcolor: "#f9fafb", borderRadius: 2, px: 2, py: 1.5, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#FF5252" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.72rem" }}>Pricing</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Box sx={{ bgcolor: "white", borderRadius: 1.5, p: 1.5, border: "1px solid #f0f0f0", textAlign: "center" }}>
                        <Typography variant="caption" color="text.secondary" display="block">Price</Typography>
                        <Typography variant="h6" fontWeight={800}>{viewItem.price ? `₹${viewItem.price}` : "—"}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ bgcolor: "white", borderRadius: 1.5, p: 1.5, border: "1px solid #f0f0f0", textAlign: "center" }}>
                        <Typography variant="caption" color="text.secondary" display="block">Offer Price</Typography>
                        <Typography variant="h6" fontWeight={800} color="green">{viewItem.offer_price ? `₹${viewItem.offer_price}` : "—"}</Typography>
                      </Box>
                    </Grid>
                    {viewItem.tax_percent && (
                      <Grid item xs={6}>
                        <Box sx={{ bgcolor: "white", borderRadius: 1.5, p: 1.5, border: "1px solid #f0f0f0", textAlign: "center" }}>
                          <Typography variant="caption" color="text.secondary" display="block">Tax</Typography>
                          <Typography variant="body1" fontWeight={700}>{viewItem.tax_percent}%</Typography>
                        </Box>
                      </Grid>
                    )}
                    {viewItem.packaging_charge && (
                      <Grid item xs={6}>
                        <Box sx={{ bgcolor: "white", borderRadius: 1.5, p: 1.5, border: "1px solid #f0f0f0", textAlign: "center" }}>
                          <Typography variant="caption" color="text.secondary" display="block">Packaging</Typography>
                          <Typography variant="body1" fontWeight={700}>₹{viewItem.packaging_charge}</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Details */}
                <Box sx={{ bgcolor: "#f9fafb", borderRadius: 2, px: 2, py: 1.5, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#FF5252" sx={{ mb: 0.5, textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.72rem" }}>Details</Typography>
                  <DetailRow label="Category" value={getCategoryName(viewItem.category_id)} />
                  <Divider sx={{ opacity: 0.4 }} />
                  <DetailRow label="Food Type" value={viewItem.food_type} />
                  {viewItem.stock_quantity != null && <><Divider sx={{ opacity: 0.4 }} /><DetailRow label="Stock Quantity" value={viewItem.stock_quantity} /></>}
                  {viewItem.calories && <><Divider sx={{ opacity: 0.4 }} /><DetailRow label="Calories" value={`${viewItem.calories} kcal`} /></>}
                  {(viewItem.available_from || viewItem.available_to) && <><Divider sx={{ opacity: 0.4 }} /><DetailRow label="Available Hours" value={`${formatTime(viewItem.available_from)} – ${formatTime(viewItem.available_to)}`} /></>}
                  {viewItem.preparation_time && <><Divider sx={{ opacity: 0.4 }} /><DetailRow label="Prep Time" value={`${viewItem.preparation_time} min`} /></>}
                </Box>

                {/* Status flags */}
                <Box sx={{ bgcolor: "#f9fafb", borderRadius: 2, px: 2, py: 1.5, mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#FF5252" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.72rem" }}>Status Flags</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {[
                      { label: "Active", val: viewItem.is_active, color: "#10b981" },
                      { label: "Available", val: viewItem.is_available, color: "#FF5252" },
                      { label: "Recommended", val: viewItem.is_recommended, color: "#8b5cf6" },
                      { label: "Bestseller", val: viewItem.is_bestseller, color: "#f59e0b" },
                      { label: "Fast Delivery", val: viewItem.is_fast_delivery, color: "#06b6d4" },
                      { label: "Spicy", val: viewItem.is_spicy, color: "#ef4444" },
                      { label: "Customizable", val: viewItem.is_customizable, color: "#3b82f6" },
                    ].map(({ label, val, color }) => (
                      <Chip key={label} label={label} size="small"
                        sx={{ bgcolor: val ? color : "#e5e7eb", color: val ? "white" : "#9ca3af", fontWeight: 600, fontSize: "0.7rem" }} />
                    ))}
                  </Box>
                </Box>
              </Box>
            </>
          ) : null}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #eee", bgcolor: "white", gap: 1 }}>
          <Button onClick={() => { closeViewModal(); if (viewItem) handleEdit(viewItem); }}
            startIcon={<EditIcon />} variant="outlined"
            sx={{ borderColor: "#FF5252", color: "#FF5252", "&:hover": { borderColor: "#e03e3e", bgcolor: "#FF525208" }, borderRadius: "10px", fontWeight: 600 }}>
            Edit Item
          </Button>
          <Button onClick={closeViewModal} variant="contained"
            sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" }, borderRadius: "10px", fontWeight: 600, px: 3 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════
          ADD / EDIT MODAL
      ═══════════════════════════════════════ */}
      <Dialog open={openModal} onClose={closeModal} maxWidth="md" fullWidth scroll="paper" keepMounted
        PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}>
        <DialogTitle sx={{ bgcolor: "#FF5252", color: "white", position: "sticky", top: 0, zIndex: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <RestaurantIcon />
            <span>{mode === "add" ? "Add New Menu Item" : "Edit Menu Item"}</span>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflow: "hidden" }}>
          <Box component="form" onSubmit={handleSubmit}
            sx={{ px: 3, pt: 3, pb: 2, display: "flex", flexDirection: "column", gap: 3,
              maxHeight: "65vh", overflowY: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>

            {/* Category & Sub-Category */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Select Category *</InputLabel>
                  <Select value={selectedCategory} label="Select Category *"
                    onChange={e => { setSelectedCategory(e.target.value); setSelectedSubCategory(""); if (errors.category) setErrors(p => ({ ...p, category: "" })); }}
                    MenuProps={{ disablePortal: false, container: document.body, PaperProps: { sx: { maxHeight: 260, zIndex: 2000 } } }}>
                    {modalCategories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                  </Select>
                  {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.subCategory}>
                  <InputLabel>Select Sub-Category *</InputLabel>
                  <Select value={selectedSubCategory} label="Select Sub-Category *"
                    onChange={e => { setSelectedSubCategory(e.target.value); if (errors.subCategory) setErrors(p => ({ ...p, subCategory: "" })); }}
                    disabled={!selectedCategory}
                    MenuProps={{ disablePortal: false, container: document.body, PaperProps: { sx: { maxHeight: 260, zIndex: 2000 } } }}>
                    {subCategories.map(sc => <MenuItem key={sc.id} value={sc.id}>{sc.name}</MenuItem>)}
                  </Select>
                  {errors.subCategory && <Typography color="error" variant="caption">{errors.subCategory}</Typography>}
                </FormControl>
              </Grid>
            </Grid>

            {/* Name & Food Type */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Food Name *" value={name} fullWidth
                  onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: "" })); }}
                  error={!!errors.name} helperText={errors.name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Food Type</InputLabel>
                  <Select value={foodType} label="Food Type" onChange={e => setFoodType(e.target.value)}
                    MenuProps={{ disablePortal: false, container: document.body, PaperProps: { sx: { maxHeight: 260, zIndex: 2000 } } }}>
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
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1} sx={{ textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: 0.5 }}>Pricing</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <TextField label="Price (₹) *" type="number" value={price} fullWidth
                    onChange={e => { setPrice(e.target.value); if (errors.price) setErrors(p => ({ ...p, price: "" })); }}
                    error={!!errors.price} helperText={errors.price} inputProps={{ min: 0, step: "0.01" }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField label="Offer Price (₹)" type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} fullWidth inputProps={{ min: 0, step: "0.01" }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField label="Tax %" type="number" value={taxPercent} onChange={e => setTaxPercent(e.target.value)} fullWidth inputProps={{ min: 0, max: 100, step: "0.01" }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField label="Packaging (₹)" type="number" value={packagingCharge} onChange={e => setPackagingCharge(e.target.value)} fullWidth inputProps={{ min: 0, step: "0.01" }} />
                </Grid>
              </Grid>
            </Box>

            {/* Timing & Inventory */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1} sx={{ textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: 0.5 }}>Timing & Inventory</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <TextField label="Available From" type="time" value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField label="Available To" type="time" value={availableTo} onChange={e => setAvailableTo(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField label="Prep Time (min)" type="number" value={preparationTime} onChange={e => setPreparationTime(e.target.value)} fullWidth inputProps={{ min: 0 }} />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField label="Stock Quantity" type="number" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} fullWidth inputProps={{ min: 0 }} />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField label="Calories (kcal)" type="number" value={calories} onChange={e => setCalories(e.target.value)} fullWidth inputProps={{ min: 0 }} />
                </Grid>
              </Grid>
            </Box>

            {/* Item Properties (Toggles) */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1.5} sx={{ textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: 0.5 }}>Item Properties</Typography>
              <Grid container spacing={1}>
                {[
                  { label: "Active", state: isActive, setter: setIsActive, color: "#10b981" },
                  { label: "Available", state: isAvailable, setter: setIsAvailable, color: "#FF5252" },
                  {
                    label: <Box display="flex" alignItems="center" gap={0.5}><FaRegStar style={{ color: "#fbbf24" }} /><span>Bestseller</span></Box>,
                    state: isBestseller, setter: setIsBestseller, color: "#f59e0b"
                  },
                  {
                    label: <Box display="flex" alignItems="center" gap={0.5}><span style={{ color: "#8b5cf6" }}>★</span><span>Recommended</span></Box>,
                    state: isRecommended, setter: setIsRecommended, color: "#8b5cf6"
                  },
                  { label: "Customizable", state: isCustomizable, setter: setIsCustomizable, color: "#3b82f6" },
                  {
                    label: <Box display="flex" alignItems="center" gap={0.5}><FaPepperHot style={{ color: "#ef4444" }} /><span>Spicy</span></Box>,
                    state: isSpicy, setter: setIsSpicy, color: "#ef4444"
                  },
                  {
                    label: <Box display="flex" alignItems="center" gap={0.5}><FaBolt style={{ color: "#06b6d4" }} /><span>Fast Delivery</span></Box>,
                    state: isFastDelivery, setter: setIsFastDelivery, color: "#06b6d4"
                  },
                ].map((item, idx) => (
                  <Grid item xs={6} sm={4} md={3} key={idx}>
                    <FormControlLabel
                      control={
                        <Switch checked={item.state} onChange={e => item.setter(e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": { color: item.color || "#FF5252" },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: item.color || "#FF5252" }
                          }} />
                      }
                      label={<Typography variant="body2" fontWeight={500}>{item.label}</Typography>}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1} sx={{ textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: 0.5 }}>Food Image</Typography>
              <input type="file" accept="image/*" onChange={handleImageChange} id="food-image-upload" style={{ display: "none" }} />
              <label htmlFor="food-image-upload">
                <Box sx={{
                  border: `2px dashed ${errors.image ? "#ef4444" : "#d1d5db"}`, borderRadius: "12px", height: 180,
                  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                  textAlign: "center", cursor: "pointer", bgcolor: "grey.50", transition: "all 0.2s ease",
                  "&:hover": { borderColor: "#FF5252", bgcolor: "grey.100" }
                }}>
                  <IoMdCamera size={48} style={{ color: "#9ca3af", marginBottom: 8 }} />
                  <Typography fontWeight={500} color="text.secondary">
                    {image ? "Change image" : currentImage ? "Update image" : "Click to upload food image"}
                  </Typography>
                </Box>
              </label>
              {errors.image && <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>{errors.image}</Typography>}
              {currentImage && (
                <Box sx={{ mt: 2, position: "relative", display: "inline-block" }}>
                  <img src={currentImage} alt="preview"
                    style={{ maxHeight: 180, maxWidth: "100%", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
                  <IconButton size="small" color="error"
                    sx={{ position: "absolute", top: 6, right: 6, bgcolor: "white", boxShadow: 1 }}
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
            sx={{ bgcolor: "#FF5252", "&:hover": { bgcolor: "#e03e3e" }, borderRadius: "10px", fontWeight: 600 }}
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : null}>
            {isSaving ? (mode === "add" ? "Creating..." : "Updating...") : (mode === "add" ? "Create Item" : "Update Item")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFoodItem;