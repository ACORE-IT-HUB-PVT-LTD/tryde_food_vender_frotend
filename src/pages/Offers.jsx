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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as OfferIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

/* ===============================
   Small reusable row component
================================= */
const Row = ({ label, value, bold }) => (
  <Box display="flex" justifyContent="space-between">
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={bold ? 700 : 500}>
      {value}
    </Typography>
  </Box>
);

const Offers = () => {
  const [offers, setOffers] = useState([
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
      title: "Buy 1 Get 1 Free Momos",
      description: "On veg & non-veg momos",
      discount: "B1G1",
      minOrder: 0,
      expiry: "20 Jan 2026",
      code: "MOMOSB1G1",
      usageLimit: "5 times per day",
      status: "Expired",
    },
    {
      id: 5,
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
    if (!newOffer.title || !newOffer.code) return;

    setOffers([
      ...offers,
      {
        id: Date.now(),
        ...newOffer,
        discount: newOffer.discount
          ? Number(newOffer.discount)
          : "B1G1",
        minOrder: newOffer.minOrder
          ? Number(newOffer.minOrder)
          : 0,
        status: "Active",
      },
    ]);

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

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" mb={4} fontWeight="bold" color="#FF5252">
        Manage Offers & Discounts
      </Typography>

      {/* ================= FORM ================= */}
      <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 4 }}>
        <Typography variant="h6" color="#FF5252" mb={2}>
          Create New Offer
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Offer Title"
              name="title"
              size="small"
              value={newOffer.title}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Promo Code"
              name="code"
              size="small"
              value={newOffer.code}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Discount"
              name="discount"
              size="small"
              value={newOffer.discount}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹ / %</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Minimum Order"
              name="minOrder"
              size="small"
              value={newOffer.minOrder}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiry"
              name="expiry"
              size="small"
              value={newOffer.expiry}
              onChange={handleInputChange}
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
            <TextField
              fullWidth
              label="Usage Limit"
              name="usageLimit"
              size="small"
              value={newOffer.usageLimit}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={2}
              value={newOffer.description}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addNewOffer}
              sx={{
                bgcolor: "#FF5252",
                px: 4,
                "&:hover": { bgcolor: "#e04848" },
              }}
            >
              Add Offer
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ================= CARDS ================= */}
      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid #ffe2e2",
                background:
                  "linear-gradient(180deg, #ffffff 0%, #fff5f5 100%)",
                transition: "0.35s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 25px 45px rgba(255,82,82,0.25)",
                },
              }}
            >
              {/* Top strip */}
              <Box height={6} bgcolor="#FF5252" />

              <CardContent sx={{ p: 3 }}>
                <Box display="flex" gap={1.5} mb={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      background: "rgba(255,82,82,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <OfferIcon sx={{ color: "#FF5252" }} />
                  </Box>

                  <Box>
                    <Typography fontWeight={700}>
                      {offer.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Promotional Offer
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={2}
                >
                  {offer.description}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box display="flex" flexDirection="column" gap={1.2}>
                  <Row label="Code" value={offer.code} bold />
                  <Row
                    label="Discount"
                    value={
                      typeof offer.discount === "number"
                        ? `₹${offer.discount}`
                        : offer.discount
                    }
                  />
                  <Row
                    label="Min Order"
                    value={
                      offer.minOrder > 0
                        ? `₹${offer.minOrder}`
                        : "Any"
                    }
                  />
                  <Row label="Expiry" value={offer.expiry} />
                  <Row label="Usage" value={offer.usageLimit} />
                </Box>

                <Box mt={3}>
                  <Chip
                    label={offer.status}
                    sx={{
                      fontWeight: 600,
                      background:
                        offer.status === "Active"
                          ? "rgba(76,175,80,0.2)"
                          : offer.status === "Upcoming"
                          ? "rgba(255,193,7,0.25)"
                          : "rgba(244,67,54,0.25)",
                      color:
                        offer.status === "Active"
                          ? "success.main"
                          : offer.status === "Upcoming"
                          ? "warning.main"
                          : "error.main",
                    }}
                  />
                </Box>
              </CardContent>

              <CardActions
                sx={{
                  px: 3,
                  pb: 2,
                  pt: 0,
                  justifyContent: "flex-end",
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "rgba(255,82,82,0.15)",
                    mr: 1,
                  }}
                >
                  <EditIcon sx={{ color: "#FF5252" }} />
                </IconButton>

                <IconButton
                  sx={{
                    bgcolor: "rgba(244,67,54,0.15)",
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Offers;
