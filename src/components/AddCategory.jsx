import React, { useEffect, useState } from "react";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Example icons

import { CakeIcon, IceCreamIcon } from "lucide-react";

// Icon list
const iconList = [
  { name: "Cake", component: <CakeIcon /> },
  { name: "Icecream", component: <IceCreamIcon /> },
 
];

const Category = () => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("categories")) || [];
    setCategories(stored);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem("categories", JSON.stringify(data));
    setCategories(data);
  };

  const handleSave = () => {
    if (!name.trim() || !icon) {
      alert("Please fill category name and select an icon!");
      return;
    }

    if (editId) {
      const updated = categories.map((cat) =>
        cat.id === editId ? { ...cat, name, icon } : cat
      );
      saveToStorage(updated);
      setEditId(null);
    } else {
      saveToStorage([...categories, { id: Date.now(), name, icon }]);
    }

    setName("");
    setIcon("");
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setIcon(cat.icon);
    setEditId(cat.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this category?")) return;
    saveToStorage(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 font-['Poppins'] ">
      {/* ================= Add Category ================= */}
      <Paper className="p-4 sm:p-6 rounded-xl shadow">
        <Typography
          variant="h6"
          className="mb-4 text-[#FF5252] text-center sm:text-left"
          sx={{fontWeight:600}}
        >
          {editId ? "Edit Category" : "Add Category"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            label="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel id="icon-select-label">Icon</InputLabel>
            <Select
              labelId="icon-select-label"
              id="icon-select"
              value={icon}
              label="Icon"
              onChange={(e) => setIcon(e.target.value)}
            >
              {iconList.map((ic) => (
                <MenuItem key={ic.name} value={ic.name}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {ic.component} {ic.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#FF5252",
              minWidth: "140px",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {editId ? "Update" : "Save"}
          </Button>
        </Box>
      </Paper>

      {/* ================= Category List ================= */}
      <Paper className="p-4 sm:p-6 rounded-xl shadow">
        <Typography
          variant="h6"
          className="mb-4 text-[#FF5252] text-center sm:text-left "
          sx={{fontWeight:600}}
        >
          Category List
        </Typography>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <TableContainer>
            <Table>
              <TableHead>
  <TableRow className="bg-[#FF5252] shadow-md">
    <TableCell className="!text-white font-bold text-sm uppercase">#</TableCell>
    <TableCell className="!text-white font-bold text-sm uppercase">Category Name</TableCell>
    <TableCell className="!text-white font-bold text-sm uppercase">Icon</TableCell>
    <TableCell align="right" className="!text-white font-bold text-sm uppercase">
      Actions
    </TableCell>
  </TableRow>
</TableHead>



              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat, index) => {
                    const iconObj = iconList.find((i) => i.name === cat.icon);
                    return (
                      <TableRow key={cat.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{cat.name}</TableCell>
                        <TableCell>{iconObj?.component}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(cat)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(cat.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {categories.length === 0 ? (
            <Typography align="center">No categories found</Typography>
          ) : (
            categories.map((cat, index) => {
              const iconObj = iconList.find((i) => i.name === cat.icon);
              return (
                <div
                  key={cat.id}
                  className="border rounded-lg p-4 flex justify-between items-center shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    {iconObj?.component}
                    <div>
                      <p className="text-sm text-gray-500">#{index + 1}</p>
                      <p className="font-semibold">{cat.name}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(cat)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Paper>
    </div>
  );
};

export default Category;
