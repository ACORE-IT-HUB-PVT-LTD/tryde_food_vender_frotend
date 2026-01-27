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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Category = () => {
  const [name, setName] = useState("");
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
    if (!name.trim()) return;

    if (editId) {
      const updated = categories.map((cat) =>
        cat.id === editId ? { ...cat, name } : cat
      );
      saveToStorage(updated);
      setEditId(null);
    } else {
      saveToStorage([...categories, { id: Date.now(), name }]);
    }

    setName("");
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this category?")) return;
    saveToStorage(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="p-3 sm:p-6 space-y-6">
      {/* ================= Add Category ================= */}
      <Paper className="p-4 sm:p-6 rounded-xl shadow">
        <Typography
          variant="h6"
          className="mb-4 text-[#FF5252] text-center sm:text-left"
        >
          {editId ? "Edit Category" : "Add Category"}
        </Typography>

        <div className="flex flex-col sm:flex-row gap-4">
          <TextField
            label="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
          />

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
        </div>
      </Paper>

      {/* ================= Category List ================= */}
      <Paper className="p-4 sm:p-6 rounded-xl shadow">
        <Typography
          variant="h6"
          className="mb-4 text-[#FF5252] text-center sm:text-left"
        >
          Category List
        </Typography>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell>#</TableCell>
                  <TableCell>Category Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat, index) => (
                    <TableRow key={cat.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{cat.name}</TableCell>
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
                  ))
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
            categories.map((cat, index) => (
              <div
                key={cat.id}
                className="border rounded-lg p-4 flex justify-between items-center shadow-sm"
              >
                <div>
                  <p className="text-sm text-gray-500">
                    #{index + 1}
                  </p>
                  <p className="font-semibold">{cat.name}</p>
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
            ))
          )}
        </div>
      </Paper>
    </div>
  );
};

export default Category;
