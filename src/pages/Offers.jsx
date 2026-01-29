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
      id: 2,
      title: "Free Delivery",
      description: "No delivery charges on orders above ₹299",
      discount: 0,
      minOrder: 299,
      expiry: "15 Feb 2026",
      code: "FREEDLV",
      usageLimit: "Unlimited",
      status: "Upcoming",
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
    className="font-['Poppins']"
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

      {/* CREATE FORM */}
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 6,
          borderRadius: 3,
          background: "white",
        }}
      >
        <Typography variant="h6" color="#FF5252"  gutterBottom sx={{ mb: 3,fontWeight:600 }}>
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
            <TextField fullWidth label="Description" multiline rows={2} size="small" />
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

      {/* CARDS */}
      <Typography
        variant="h5"
        fontWeight={600}
        color="text.primary"
        gutterBottom
        sx={{ mb: 3 }}
      >
        Active & Upcoming Offers
      </Typography>

      <Grid container spacing={3}>
        {offers.slice(0, 4).map((offer) => {
          const statusStyle = getStatusColor(offer.status);

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={offer.id}
              sx={{ display: "flex" }} // ensures Card stretches full height
            >
              <Card
                elevation={0}
                sx={{
                  flex: "1 1 0", // full width & height in grid item
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 14px 36px rgba(255,82,82,0.16)",
                    // borderColor: "primary.light",
                  },
                }}
              >
                {/* Top gradient accent bar */}
                <Box
                  sx={{
                    height: 6,
                    background:
                      offer.status === "Active"
                        ? "linear-gradient(90deg, #4caf50, #81c784)"
                        : offer.status === "Upcoming"
                          ? "linear-gradient(90deg, #ff9800, #ffb74d)"
                          : "linear-gradient(90deg, #f44336, #e57373)",
                  }}
                />

                {/* Card Content */}
                <CardContent
                  sx={{
                    p: 3,
                    pb: 2.5,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Header: Icon + Title */}
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        bgcolor: "rgba(255,82,82,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <OfferIcon sx={{ fontSize: 26, color: "#FF5252" }} />
                    </Box>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        lineHeight={1.2}
                        noWrap
                        sx={{ mb: 0.5 }}
                      >
                        {offer.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {offer.code}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2.5,
                      lineHeight: 1.45,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: 60,
                    }}
                  >
                    {offer.description}
                  </Typography>

                  <Divider sx={{ my: 2, opacity: 0.5 }} />

                  {/* Details */}
                  <Stack spacing={1.1} sx={{ mt: "auto", mb: 2 }}>
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
                      value={offer.minOrder > 0 ? `₹${offer.minOrder}` : "Any amount"}
                    />
                    <Row label="Expiry" value={offer.expiry} />
                    <Row label="Usage" value={offer.usageLimit} />
                  </Stack>

                  {/* Status chip */}
                  <Box sx={{ mt: "auto" }}>
                    <Chip
                      label={statusStyle.label}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        px: 1.8,
                        height: 26,
                        bgcolor: statusStyle.bg,
                        color: statusStyle.text,
                        borderRadius: "14px",
                        border: `1px solid ${statusStyle.text}22`,
                      }}
                    />
                  </Box>
                </CardContent>

                {/* Card Actions */}
                <CardActions
                  sx={{
                    px: 3,
                    py: 1.5,
                    pt: 0,
                    justifyContent: "flex-end",
                    borderTop: "1px solid",
                    borderColor: "divider",
                    bgcolor: "action.hover",
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      color: "primary.main",
                      "&:hover": { bgcolor: "primary.50" },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    sx={{
                      "&:hover": { bgcolor: "error.50" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
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
