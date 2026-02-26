import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Rating,
  IconButton,
  Tooltip,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardMedia,
  CardContent,
  Badge,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  RateReview as RateReviewIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  LocalOffer as OfferIcon,
  Whatshot as SpicyIcon,
  Star as StarIcon,
  EmojiEvents as BestsellerIcon,
} from "@mui/icons-material";
import { RestaurantContext } from "../context/getRestaurant";
import axiosInstance from "../api/axiosInstance";

const themeColor = "#FF5252";

const Reviews = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { restaurant } = useContext(RestaurantContext);

  const [activeTab, setActiveTab] = useState(0);
  const [restaurantReviews, setRestaurantReviews] = useState([]);
  const [dishReviews, setDishReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menu item dialog state
  const [menuItemDialog, setMenuItemDialog] = useState({
    open: false,
    item: null,
    loading: false,
  });

  // Cache fetched menu items to avoid re-fetching
  const [menuItemCache, setMenuItemCache] = useState({});

  // ─── API: Fetch Restaurant Reviews ────────────────────────────────────────
  const fetchRestaurantReviews = async () => {
    try {
      const result = await axiosInstance.get(
        `/restaurants/restaurant/${restaurant.id}`,
        { withCredentials: true }
      );
      if (result.data.success) {
        setRestaurantReviews(result.data.data);
      }
    } catch (error) {
      console.error("Error fetching restaurant reviews:", error);
    }
  };

  // ─── API: Fetch Dish Reviews by menuitem_id ────────────────────────────────
  const fetchDishReviews = async (menuItemIds) => {
    try {
      const uniqueIds = [...new Set(menuItemIds)];
      const promises = uniqueIds.map((id) =>
        axiosInstance.get(`/restaurants/dish/${id}`, { withCredentials: true })
      );
      const results = await Promise.all(promises);
      const allDishReviews = results.flatMap((r) =>
        r.data.success ? r.data.data : []
      );
      const seen = new Set();
      const unique = allDishReviews.filter((r) => {
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
      });
      setDishReviews(unique);
    } catch (error) {
      console.error("Error fetching dish reviews:", error);
    }
  };

  // ─── API: Fetch Single Menu Item by ID ────────────────────────────────────
  const fetchMenuItemById = async (menuItemId) => {
    // Use cache if available
    if (menuItemCache[menuItemId]) {
      setMenuItemDialog({ open: true, item: menuItemCache[menuItemId], loading: false });
      return;
    }

    setMenuItemDialog({ open: true, item: null, loading: true });
    try {
      const result = await axiosInstance.get(
        `/menuitems/viewsingle/${menuItemId}`,
        { withCredentials: true }
      );
      if (result.data && result.data.data) {
        const item = result.data.data;
        setMenuItemCache((prev) => ({ ...prev, [menuItemId]: item }));
        setMenuItemDialog({ open: true, item, loading: false });
      } else {
        setMenuItemDialog({ open: true, item: null, loading: false });
      }
    } catch (error) {
      console.error("Error fetching menu item:", error);
      setMenuItemDialog({ open: true, item: null, loading: false });
    }
  };

  // ─── Load Data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchRestaurantReviews();
      setLoading(false);
    };
    if (restaurant?.id) loadData();
  }, [restaurant?.id]);

  useEffect(() => {
    if (restaurantReviews.length > 0) {
      const menuItemIds = restaurantReviews
        .map((r) => r.menuitem_id)
        .filter(Boolean);
      if (menuItemIds.length > 0) fetchDishReviews(menuItemIds);
    }
  }, [restaurantReviews]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleDeleteReview = (id, type) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const setter = type === "restaurant" ? setRestaurantReviews : setDishReviews;
      setter((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const closeDialog = () =>
    setMenuItemDialog({ open: false, item: null, loading: false });

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  const currentReviews = activeTab === 0 ? restaurantReviews : dishReviews;
  const reviewType = activeTab === 0 ? "restaurant" : "dish";

  const averageRating =
    currentReviews.length > 0
      ? currentReviews.reduce((sum, r) => sum + r.rating, 0) /
        currentReviews.length
      : 0;

  // ─── Menu Item Detail Dialog ───────────────────────────────────────────────
  const MenuItemDialog = () => {
    const item = menuItemDialog.item;

    return (
      <Dialog open={menuItemDialog.open} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: themeColor,
            color: "white",
            py: 1.5,
          }}
        >
          <Typography fontWeight="bold" fontSize={18}>
            Menu Item Details
          </Typography>
          <IconButton onClick={closeDialog} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {menuItemDialog.loading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <CircularProgress sx={{ color: themeColor }} />
              <Typography mt={2} color="text.secondary">
                Fetching item details...
              </Typography>
            </Box>
          ) : item ? (
            <Box>
              {/* Image */}
              {item.image && (
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={item.image}
                    alt={item.name}
                    sx={{ objectFit: "cover", width: "100%" }}
                  />
                  {/* Badges on image */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ position: "absolute", top: 10, left: 10 }}
                  >
                    {item.is_bestseller && (
                      <Chip
                        icon={<BestsellerIcon style={{ color: "white", fontSize: 14 }} />}
                        label="Bestseller"
                        size="small"
                        sx={{ bgcolor: "#FF9800", color: "white", fontWeight: "bold" }}
                      />
                    )}
                    {item.is_recommended && (
                      <Chip
                        icon={<StarIcon style={{ color: "white", fontSize: 14 }} />}
                        label="Recommended"
                        size="small"
                        sx={{ bgcolor: "#4CAF50", color: "white", fontWeight: "bold" }}
                      />
                    )}
                  </Stack>
                  {/* Food type badge */}
                  <Chip
                    label={item.food_type}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: item.food_type === "VEG" ? "#4CAF50" : "#F44336",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              )}

              <Box sx={{ p: 2.5 }}>
                {/* Name + availability */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {item.name}
                    </Typography>
                    {item.description && (
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {item.description}
                      </Typography>
                    )}
                  </Box>
                  <Chip
                    label={item.is_available ? "Available" : "Unavailable"}
                    color={item.is_available ? "success" : "error"}
                    size="small"
                    sx={{ ml: 1, mt: 0.5 }}
                  />
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                {/* Price section */}
                <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                  {item.offer_price && parseFloat(item.offer_price) < parseFloat(item.price) ? (
                    <>
                      <Typography variant="h6" fontWeight="bold" color={themeColor}>
                        ₹{parseFloat(item.offer_price).toFixed(2)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        ₹{parseFloat(item.price).toFixed(2)}
                      </Typography>
                      <Chip
                        icon={<OfferIcon style={{ fontSize: 12 }} />}
                        label={`${Math.round(
                          ((parseFloat(item.price) - parseFloat(item.offer_price)) /
                            parseFloat(item.price)) *
                            100
                        )}% OFF`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </>
                  ) : (
                    <Typography variant="h6" fontWeight="bold" color={themeColor}>
                      ₹{parseFloat(item.price).toFixed(2)}
                    </Typography>
                  )}
                </Stack>

                {/* Info Grid */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1.5,
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <InfoRow label="Rating" value={`⭐ ${parseFloat(item.rating).toFixed(1)} / 5`} />
                  <InfoRow label="Prep Time" value={`${item.preparation_time} min`} />
                  <InfoRow
                    label="Tax"
                    value={`${parseFloat(item.tax_percent).toFixed(0)}%`}
                  />
                  <InfoRow
                    label="Packaging"
                    value={`₹${parseFloat(item.packaging_charge).toFixed(2)}`}
                  />
                  <InfoRow label="Total Orders" value={item.total_orders} />
                  <InfoRow
                    label="Available"
                    value={`${item.available_from?.slice(0, 5)} - ${item.available_to?.slice(0, 5)}`}
                  />
                  {item.calories && <InfoRow label="Calories" value={`${item.calories} kcal`} />}
                </Box>

                {/* Tags */}
                <Stack direction="row" spacing={1} mt={1.5} flexWrap="wrap" gap={1}>
                  {item.is_spicy && (
                    <Chip
                      icon={<SpicyIcon style={{ color: "white", fontSize: 14 }} />}
                      label="Spicy"
                      size="small"
                      sx={{ bgcolor: "#FF5722", color: "white" }}
                    />
                  )}
                  {item.is_customizable && (
                    <Chip label="Customizable" size="small" color="primary" variant="outlined" />
                  )}
                  {item.is_fast_delivery && (
                    <Chip label="Fast Delivery" size="small" color="info" variant="outlined" />
                  )}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary" textAlign="center" py={6}>
              Item not found or failed to load.
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2 }}>
          <Button onClick={closeDialog} sx={{ color: themeColor }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Small helper component for dialog info rows
  const InfoRow = ({ label, value }) => (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value ?? "—"}
      </Typography>
    </Box>
  );

  // ─── Review Table ──────────────────────────────────────────────────────────
  const ReviewTable = ({ reviews, type }) => (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: isMobile ? 500 : 800 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: themeColor }}>
            <TableCell sx={{ color: "white", fontWeight: "bold", pl: 3 }}>
              Customer
            </TableCell>
            {!isMobile && (
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
            )}
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Rating</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Comment</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              {type === "restaurant" ? "Menu Item" : "Dish ID"}
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold" }}
              align="right"
              width={80}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                <RateReviewIcon sx={{ fontSize: 52, color: "grey.300", mb: 1 }} />
                <Typography color="text.secondary" variant="h6">
                  No reviews yet.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow
                key={review.id}
                hover
                sx={{
                  "&:hover": { bgcolor: `${themeColor}08` },
                  transition: "background-color 0.2s",
                }}
              >
                {/* Customer */}
                <TableCell sx={{ pl: 3 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    {review.user_image ? (
                      <Avatar src={review.user_image} sx={{ width: 42, height: 42 }} />
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: themeColor,
                          width: 42,
                          height: 42,
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        {getInitial(review.user_name)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {review.user_name || "Anonymous"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        User #{review.user_id}
                      </Typography>
                      {isMobile && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {formatDate(review.created_at)}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </TableCell>

                {/* Date */}
                {!isMobile && (
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(review.created_at)}
                    </Typography>
                  </TableCell>
                )}

                {/* Rating */}
                <TableCell>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Rating value={review.rating} readOnly precision={0.5} size="small" />
                    <Typography variant="caption" color="text.secondary">
                      ({review.rating}/5)
                    </Typography>
                  </Stack>
                </TableCell>

                {/* Comment */}
                <TableCell sx={{ maxWidth: { xs: 140, sm: 200, md: 320 } }}>
                  <Tooltip title={review.comment || ""} arrow>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {review.comment || (
                        <em style={{ color: "#aaa" }}>No comment</em>
                      )}
                    </Typography>
                  </Tooltip>
                </TableCell>

                {/* Menu Item — clickable chip to open dialog */}
                <TableCell>
                  {review.menuitem_id ? (
                    <Tooltip title="Click to view dish details" arrow>
                      <Chip
                        label={`Dish #${review.menuitem_id}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                        icon={<VisibilityIcon style={{ fontSize: 13 }} />}
                        onClick={() => fetchMenuItemById(review.menuitem_id)}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          "&:hover": {
                            bgcolor: "primary.50",
                            borderColor: "primary.main",
                          },
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Chip label="N/A" size="small" variant="outlined" />
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <Tooltip title="Delete Review">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteReview(review.id, type)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // ─── Main Render ───────────────────────────────────────────────────────────
  return (
    <Box
      className="font-['Poppins']"
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "grey.50",
        minHeight: "100vh",
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        color={themeColor}
        gutterBottom
        sx={{ mb: 4 }}
      >
        Reviews Dashboard
      </Typography>

      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root.Mui-selected": { color: themeColor },
            "& .MuiTabs-indicator": { bgcolor: themeColor },
            px: 2,
            pt: 1,
          }}
        >
          <Tab label={`Restaurant Reviews (${restaurantReviews.length})`} />
          <Tab label={`Dish Reviews (${dishReviews.length})`} />
        </Tabs>

        {loading ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <CircularProgress sx={{ color: themeColor }} />
            <Typography mt={2} color="text.secondary">
              Loading reviews...
            </Typography>
          </Box>
        ) : (
          <ReviewTable reviews={currentReviews} type={reviewType} />
        )}

        {/* Footer Summary */}
        <Divider />
        <Box sx={{ p: 3, bgcolor: `${themeColor}05`, textAlign: "center" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6" color="text.primary">
              Total Reviews: <strong>{currentReviews.length}</strong>
            </Typography>
            {currentReviews.length > 0 && (
              <>
                <Rating
                  value={averageRating}
                  precision={0.1}
                  readOnly
                  size="medium"
                />
                <Typography variant="h6" color={themeColor} fontWeight="bold">
                  {averageRating.toFixed(1)} / 5
                </Typography>
              </>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Menu Item Detail Dialog */}
      <MenuItemDialog />
    </Box>
  );
};

export default Reviews;