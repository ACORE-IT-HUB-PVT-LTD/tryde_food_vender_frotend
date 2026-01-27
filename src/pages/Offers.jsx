import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Divider,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as OfferIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

/* Small reusable row */
const Row = ({ label, value, bold = false }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      py: 0.4,
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography
      variant="body2"
      fontWeight={bold ? 700 : 600}
      color={bold ? "text.primary" : "text.primary"}
    >
      {value}
    </Typography>
  </Box>
);

const Offers = () => {
  const [offers] = useState([
    {
      id: 1,
      title: "Flat ₹100 OFF",
      description: "On orders above ₹499",
      discount: 100,
      minOrder: 499,
      expiry: "31 Jan 2026",
      code: "FLAT100",
      usageLimit: "Unlimited",
      status: "Active",
    },
    {
      id: 2,
      title: "20% OFF on Pizza",
      description: "Valid on all pizzas",
      discount: 20,
      minOrder: 0,
      expiry: "25 Jan 2026",
      code: "PIZZA20",
      usageLimit: "Once per user",
      status: "Active",
    },
    {
      id: 3,
      title: "Free Delivery",
      description: "No delivery charges on orders above ₹299",
      discount: 0,
      minOrder: 299,
      expiry: "15 Feb 2026",
      code: "FREEDLV",
      usageLimit: "Unlimited",
      status: "Upcoming",
    },
    {
      id: 4,
      title: "₹50 Cashback",
      description: "Via UPI payment",
      discount: 50,
      minOrder: 200,
      expiry: "28 Feb 2026",
      code: "UPI50",
      usageLimit: "Once per user",
      status: "Active",
    },
  ]);

  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    discount: "",
    minOrder: "",
    expiry: "",
    code: "",
    usageLimit: "Unlimited",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({ ...prev, [name]: value }));
  };

  const addNewOffer = () => {
    // Just placeholder — not adding to list in this version
    alert("New offer added (demo)");
    setNewOffer({
      title: "",
      description: "",
      discount: "",
      minOrder: "",
      expiry: "",
      code: "",
      usageLimit: "Unlimited",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return { bg: "#e8f5e9", text: "#2e7d32", label: "Active" };
      case "Upcoming":
        return { bg: "#fff3e0", text: "#e65100", label: "Upcoming" };
      case "Expired":
        return { bg: "#ffebee", text: "#c62828", label: "Expired" };
      default:
        return { bg: "#f5f5f5", text: "#616161", label: status };
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "grey.50",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        fontWeight="bold"
        color="#FF5252"
        gutterBottom
        sx={{ mb: 5 }}
      >
        Manage Offers & Discounts
      </Typography>

      {/* ──────────────── CREATE FORM ──────────────── */}
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 6,
          borderRadius: 3,
          background: "white",
        }}
      >
        <Typography variant="h6" color="#FF5252" gutterBottom sx={{ mb: 3 }}>
          Create New Offer
        </Typography>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Offer Title" size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Promo Code" size="small" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Discount"
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start">₹ / %</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Minimum Order"
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Usage Limit" size="small" defaultValue="Unlimited" />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addNewOffer}
              sx={{
                bgcolor: "#FF5252",
                px: 5,
                py: 1.2,
                fontWeight: 600,
                "&:hover": { bgcolor: "#e04545" },
              }}
            >
              Add New Offer
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ──────────────── CARDS ──────────────── */}
      <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom sx={{ mb: 3 }}>
        Active & Upcoming Offers
      </Typography>

      <Grid container spacing={3}>
        {offers.slice(0, 4).map((offer) => {
          const statusStyle = getStatusColor(offer.status);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={offer.id}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid #ffe6e6",
                  transition: "all 0.28s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 20px 40px rgba(255,82,82,0.18)",
                    borderColor: "#FF5252",
                  },
                }}
              >
                {/* Top accent bar */}
                <Box
                  sx={{
                    height: 8,
                    bgcolor:
                      offer.status === "Active"
                        ? "#4caf50"
                        : offer.status === "Upcoming"
                        ? "#ff9800"
                        : "#f44336",
                  }}
                />

                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "12px",
                        bgcolor: "rgba(255,82,82,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <OfferIcon sx={{ fontSize: 28, color: "#FF5252" }} />
                    </Box>

                    <Box>
                      <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                        {offer.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {offer.code}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2.5, minHeight: 44 }}
                  >
                    {offer.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1.1}>
                    <Row label="Code" value={offer.code} bold />
                    <Row
                      label="Discount"
                      value={
                        typeof offer.discount === "number"
                          ? offer.discount === 0
                            ? "Free Delivery"
                            : `₹${offer.discount}`
                          : offer.discount
                      }
                      bold
                    />
                    <Row
                      label="Min. Order"
                      value={offer.minOrder > 0 ? `₹${offer.minOrder}` : "Any"}
                    />
                    <Row label="Expiry" value={offer.expiry} />
                    <Row label="Usage" value={offer.usageLimit} />
                  </Stack>

                  <Box mt={3}>
                    <Chip
                      label={statusStyle.label}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        px: 1.5,
                        bgcolor: statusStyle.bg,
                        color: statusStyle.text,
                        borderRadius: "16px",
                        minWidth: 90,
                      }}
                    />
                  </Box>
                </CardContent>

                <CardActions
                  sx={{
                    px: 3,
                    pb: 2.5,
                    pt: 0,
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,82,82,0.08)",
                      "&:hover": { bgcolor: "rgba(255,82,82,0.18)" },
                    }}
                  >
                    <EditIcon fontSize="small" sx={{ color: "#FF5252" }} />
                  </IconButton>

                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "rgba(244,67,54,0.08)",
                      "&:hover": { bgcolor: "rgba(244,67,54,0.18)" },
                    }}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Offers;