import React, { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Button,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";

const AddFoodItem = () => {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    discount: "",
    finalPrice: "",
    categoryId: "",
    description: "",
    image: "",
    type: "veg",
    available: true,
  });

  // ===============================
  // Load categories
  // ===============================
  useEffect(() => {
    setCategories(JSON.parse(localStorage.getItem("categories")) || []);
  }, []);

  // ===============================
  // Auto price calculation
  // ===============================
  useEffect(() => {
    const price = Number(form.price);
    const discount = Number(form.discount);

    if (!price) {
      setForm((prev) => ({ ...prev, finalPrice: "" }));
      return;
    }

    const final =
      discount > 0 ? price - (price * discount) / 100 : price;

    setForm((prev) => ({
      ...prev,
      finalPrice: final.toFixed(0),
    }));
  }, [form.price, form.discount]);

  // ===============================
  // Add food item
  // ===============================
  const addItem = () => {
    if (!form.name || !form.price || !form.categoryId) {
      alert("Please fill required fields");
      return;
    }

    const foods = JSON.parse(localStorage.getItem("foods")) || [];

    foods.push({
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem("foods", JSON.stringify(foods));

    setForm({
      name: "",
      price: "",
      discount: "",
      finalPrice: "",
      categoryId: "",
      description: "",
      image: "",
      type: "veg",
      available: true,
    });

    alert("Food item added successfully");
  };

  return (
    <div className="p-3 sm:p-6">
      <Paper className="p-4 sm:p-6 rounded-xl shadow max-w-5xl mx-auto">
        <Typography
          variant="h6"
          className="mb-6 text-[#FF5252] text-center sm:text-left"
        >
          Add Food Item
        </Typography>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Food name */}
          <TextField
            label="Food name *"
            size="small"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            fullWidth
          />

          {/* Category */}
          <TextField
            select
            label="Category *"
            size="small"
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
            fullWidth
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Price */}
          <TextField
            label="Price (₹)"
            type="number"
            size="small"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            fullWidth
          />

          {/* Discount */}
          <TextField
            label="Discount (%)"
            type="number"
            size="small"
            value={form.discount}
            onChange={(e) =>
              setForm({ ...form, discount: e.target.value })
            }
            fullWidth
          />

          {/* Final price */}
          <TextField
            label="Final price"
            size="small"
            value={form.finalPrice}
            disabled
            fullWidth
          />

          {/* Image URL */}
          <TextField
            label="Food image URL"
            size="small"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
            fullWidth
          />
        </div>

        {/* ✅ IMAGE PREVIEW */}
        {form.image && (
          <div className="mt-4 flex justify-center sm:justify-start">
            <img
              src={form.image}
              alt="Food preview"
              className="w-full sm:w-64 h-44 object-cover rounded-xl border shadow"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=Image+Not+Found";
              }}
            />
          </div>
        )}

        {/* Description */}
        <TextField
          label="Description"
          multiline
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          fullWidth
          className="mt-4"
        />

        {/* Switch + Veg NonVeg */}
        <div className="flex flex-col sm:flex-row justify-between mt-4 gap-3">
          <FormControlLabel
            control={
              <Switch
                checked={form.available}
                onChange={(e) =>
                  setForm({
                    ...form,
                    available: e.target.checked,
                  })
                }
              />
            }
            label={form.available ? "Available" : "Out of stock"}
          />

          <div className="flex gap-4">
            <Button
              variant={
                form.type === "veg" ? "contained" : "outlined"
              }
              color="success"
              onClick={() =>
                setForm({ ...form, type: "veg" })
              }
            >
              Veg
            </Button>

            <Button
              variant={
                form.type === "non-veg"
                  ? "contained"
                  : "outlined"
              }
              color="error"
              onClick={() =>
                setForm({ ...form, type: "non-veg" })
              }
            >
              Non-Veg
            </Button>
          </div>
        </div>

        {/* Save button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 4,
            backgroundColor: "#FF5252",
            height: "45px",
            fontSize: "16px",
          }}
          onClick={addItem}
        >
          Save Food Item
        </Button>
      </Paper>
    </div>
  );
};

export default AddFoodItem;
