import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Switch,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
  Grid,
  Typography,
  Chip,
  Box,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Search as SearchIcon,
  // Category ke liye common icons import kar liye
  RestaurantMenu,
  LocalPizza,
  Fastfood,
  LocalDrink,
  Icecream,
  SoupKitchen,
  DinnerDining,
  RiceBowl,
  Cake,
  SetMeal,
  LocalBar,
  LunchDining,
} from "@mui/icons-material";

// Pre-defined icons for categories (name + component)
const categoryIcons = [
  { name: "RestaurantMenu", icon: <RestaurantMenu /> },
  { name: "LocalPizza", icon: <LocalPizza /> },
  { name: "Fastfood", icon: <Fastfood /> },
  { name: "LocalDrink", icon: <LocalDrink /> },
  { name: "Icecream", icon: <Icecream /> },
  { name: "Cake", icon: <Cake /> },
  { name: "SoupKitchen", icon: <SoupKitchen /> },
  { name: "DinnerDining", icon: <DinnerDining /> },
  { name: "RiceBowl", icon: <RiceBowl /> },
  { name: "SetMeal", icon: <SetMeal /> },
  { name: "LocalBar", icon: <LocalBar /> },
  { name: "LunchDining", icon: <LunchDining /> },
];

const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("RestaurantMenu"); // default icon

  // Item form state (for add/edit)
  const [itemForm, setItemForm] = useState({
    id: null,
    categoryId: "",
    name: "",
    price: "",
    discount: "",
    desc: "",
    type: "Veg",
    avail: true,
    imagePreview: "", // for preview
    imageBase64: "",  // saved in localStorage
  });

  const [isEditing, setIsEditing] = useState(false);

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, type: "" });

  // Table states: pagination, sorting, filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Load data
  useEffect(() => {
    const savedCats = JSON.parse(localStorage.getItem("categories")) || [];
    const savedItems = JSON.parse(localStorage.getItem("foods")) || [];
    setCategories(savedCats);
    setItems(savedItems);
  }, []);

  // Save categories (ab icon ke saath save hoga)
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // Save items
  useEffect(() => {
    localStorage.setItem("foods", JSON.stringify(items));
  }, [items]);

  // ── Category Add with Icon ──
  const addCategory = () => {
    if (!newCategory.trim()) return;

    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategory.trim(),
        icon: selectedIcon, // icon name save kar rahe hain
      },
    ]);

    setNewCategory("");
    setSelectedIcon("RestaurantMenu"); // reset to default
  };

  // Icon component by name nikalne ke liye helper
  const getIconComponent = (iconName) => {
    const found = categoryIcons.find((i) => i.name === iconName);
    return found ? found.icon : <RestaurantMenu />;
  };

  // ── Item Handlers ── (bilkul same)
  const handleItemChange = (e) => {
    const { name, value, checked, type } = e.target;
    setItemForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setItemForm((prev) => ({
        ...prev,
        imagePreview: URL.createObjectURL(file),
        imageBase64: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const addOrUpdateItem = () => {
    if (!itemForm.name || !itemForm.categoryId || !itemForm.price) return;

    const newItemData = { ...itemForm };

    if (isEditing) {
      setItems(items.map((it) => (it.id === itemForm.id ? newItemData : it)));
      setIsEditing(false);
    } else {
      setItems([...items, { ...newItemData, id: Date.now() }]);
    }

    setItemForm({
      id: null,
      categoryId: "",
      name: "",
      price: "",
      discount: "",
      desc: "",
      type: "Veg",
      avail: true,
      imagePreview: "",
      imageBase64: "",
    });
  };

  const startEdit = (item) => {
    setItemForm({ ...item, imagePreview: "" });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setItemForm({
      id: null,
      categoryId: "",
      name: "",
      price: "",
      discount: "",
      desc: "",
      type: "Veg",
      avail: true,
      imagePreview: "",
      imageBase64: "",
    });
  };

  // ── Delete ──
  const openDeleteDialog = (id, type = "item") => {
    setDeleteDialog({ open: true, id, type });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.type === "item") {
      setItems(items.filter((it) => it.id !== deleteDialog.id));
    }
    setDeleteDialog({ open: false, id: null, type: "" });
  };

  // ── Table Helpers ──
  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || "-";

  // Filtered & Sorted Data
  const filteredItems = items.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const catName = getCategoryName(item.categoryId).toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      catName.includes(searchLower)
    );
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (orderBy === "name") {
      return order === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (orderBy === "price") {
      return order === "asc" ? a.price - b.price : b.price - a.price;
    }
    return 0;
  });

  const paginatedItems = sortedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="mb-6 font-bold text-[#FF5252]">
        Menu Management
      </Typography>

      {/* Category Section - Ab icon ke saath */}
      <Paper className="p-6 mb-8 rounded-xl shadow">
        <Typography variant="h6" className="mb-4 text-[#FF5252]">
          Add Category
        </Typography>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <TextField
            label="Category Name"
            variant="outlined"
            size="small"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />

          <TextField
            select
            label="Icon"
            value={selectedIcon}
            onChange={(e) => setSelectedIcon(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: 180 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {getIconComponent(selectedIcon)}
                </InputAdornment>
              ),
            }}
          >
            {categoryIcons.map((opt) => (
              <MenuItem key={opt.name} value={opt.name}>
                {opt.icon} {opt.name.replace(/([A-Z])/g, " $1").trim()}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addCategory}
            sx={{ backgroundColor: "#FF5252", "&:hover": { backgroundColor: "#e04545" } }}
          >
            Add
          </Button>
        </div>

        <Box className="mt-6 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              icon={getIconComponent(cat.icon)}
              label={cat.name}
              variant="outlined"
              sx={{
                borderColor: "#FF5252",
                color: "#FF5252",
                fontWeight: 500,
                "& .MuiChip-icon": { color: "#FF5252" },
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Add/Edit Food Item Form - bilkul same */}
      <Paper className="p-6 mb-8 rounded-xl shadow">
        <Typography variant="h6" className="mb-4 text-[#FF5252]">
          {isEditing ? "Edit Food Item" : "Add Food Item"}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Category"
              name="categoryId"
              value={itemForm.categoryId}
              onChange={handleItemChange}
              fullWidth
              variant="outlined"
              size="small"
              required
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Name" name="name" value={itemForm.name} onChange={handleItemChange} fullWidth variant="outlined" size="small" required />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Price (₹)" name="price" type="number" value={itemForm.price} onChange={handleItemChange} fullWidth variant="outlined" size="small" required />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Discount (%)" name="discount" type="number" value={itemForm.discount} onChange={handleItemChange} fullWidth variant="outlined" size="small" />
          </Grid>

          <Grid item xs={12}>
            <TextField label="Description" name="desc" value={itemForm.desc} onChange={handleItemChange} multiline rows={2} fullWidth variant="outlined" size="small" />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Food Image
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
            {itemForm.imagePreview && (
              <Box mt={2}>
                <img src={itemForm.imagePreview || itemForm.imageBase64} alt="Preview" style={{ maxWidth: "150px", borderRadius: "8px" }} />
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup row name="type" value={itemForm.type} onChange={handleItemChange}>
                <FormControlLabel value="Veg" control={<Radio />} label="🟢 Veg" />
                <FormControlLabel value="NonVeg" control={<Radio />} label="🔴 Non-Veg" />
              </RadioGroup>
            </FormControl>

            <FormControlLabel
              control={<Switch checked={itemForm.avail} onChange={handleItemChange} name="avail" color="primary" />}
              label={itemForm.avail ? "Available" : "Out of Stock"}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={isEditing ? <EditIcon /> : <AddIcon />}
              onClick={addOrUpdateItem}
              sx={{ backgroundColor: "#FF5252", mr: 2 }}
            >
              {isEditing ? "Update" : "Add Item"}
            </Button>
            {isEditing && (
              <Button variant="outlined" color="inherit" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Table with Search, Sort, Pagination - bilkul same */}
      <Paper className="rounded-xl shadow overflow-hidden">
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" className="text-[#FF5252]">
            Food Items
          </Typography>
          <TextField
            placeholder="Search by name or category..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            sx={{ width: 300 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#FF5252" }}>
              <TableRow>
                <TableCell sx={{ color: "white", cursor: "pointer" }} onClick={() => handleSort("name")}>
                  Item {orderBy === "name" && (order === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell sx={{ color: "white" }}>Category</TableCell>
                <TableCell sx={{ color: "white", cursor: "pointer" }} onClick={() => handleSort("price")}>
                  Price {orderBy === "price" && (order === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell sx={{ color: "white" }}>Type</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }} align="right">Image</TableCell>
                <TableCell sx={{ color: "white" }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{getCategoryName(item.categoryId)}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>{item.type === "Veg" ? "🟢 Veg" : "🔴 Non-Veg"}</TableCell>
                  <TableCell>
                    <Chip label={item.avail ? "Available" : "Out of Stock"} color={item.avail ? "success" : "error"} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    {item.imageBase64 && <img src={item.imageBase64} alt={item.name} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }} />}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => startEdit(item)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => openDeleteDialog(item.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: "gray" }}>
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MenuManagement;