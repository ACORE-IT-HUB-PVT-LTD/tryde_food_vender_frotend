// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Chip,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Avatar,
//   Rating,
//   Button,
//   IconButton,
//   TextField,
//   Tooltip,
//   Stack,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import {
//   Send as SendIcon,
//   Delete as DeleteIcon,
//   Comment as CommentIcon,
//   ThumbUp as ThumbUpIcon,
// } from "@mui/icons-material";

// const themeColor = "#FF5252";

// const Reviews = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const [reviews, setReviews] = useState([
//     {
//       id: 1,
//       customer: "Amit Sharma",
//       avatar: "A",
//       date: "Jan 18, 2026",
//       rating: 5,
//       text: "Best paneer tikka I’ve ever had! Fast delivery and fresh food. Highly recommend!",
//       reply: "Thank you Amit! Glad you loved it 😊 Will make it even better next time!",
//       helpful: 12,
//     },
//     {
//       id: 2,
//       customer: "Priya Patel",
//       avatar: "P",
//       date: "Jan 17, 2026",
//       rating: 4,
//       text: "Food was tasty but delivery took 15 min extra. Otherwise good experience.",
//       reply: "",
//       helpful: 8,
//     },
//     {
//       id: 3,
//       customer: "Rahul Verma",
//       avatar: "R",
//       date: "Jan 16, 2026",
//       rating: 2,
//       text: "Biryani was too spicy and rice was undercooked. Not happy with quality.",
//       reply:
//         "Sorry for the inconvenience Rahul. We’ll refund 50% of your order. Please reach out to support.",
//       helpful: 5,
//     },
//     {
//       id: 4,
//       customer: "Sneha Gupta",
//       avatar: "S",
//       date: "Jan 15, 2026",
//       rating: 5,
//       text: "Amazing gulab jamun! Perfectly sweet and soft. Will order again soon ❤️",
//       reply: "Thank you Sneha! Your love for sweets motivates us!",
//       helpful: 15,
//     },
//     {
//       id: 5,
//       customer: "Vikram Singh",
//       avatar: "V",
//       date: "Jan 14, 2026",
//       rating: 3,
//       text: "Average taste, packaging was good but quantity was less than expected.",
//       reply: "",
//       helpful: 3,
//     },
//   ]);

//   const [replyInputs, setReplyInputs] = useState({});

//   const handleReplyChange = (id, value) => {
//     setReplyInputs((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSendReply = (id) => {
//     const replyText = replyInputs[id]?.trim();
//     if (!replyText) return;

//     setReviews((prev) =>
//       prev.map((review) =>
//         review.id === id ? { ...review, reply: replyText } : review
//       )
//     );

//     setReplyInputs((prev) => ({ ...prev, [id]: "" }));
//   };

//   const handleDeleteReview = (id) => {
//     if (window.confirm("Are you sure you want to delete this review?")) {
//       setReviews((prev) => prev.filter((r) => r.id !== id));
//     }
//   };

//   const averageRating =
//     reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

//   return (
//     <Box
//       className="font-['Poppins']"  // ← Same font as Dashboard, Orders, Profile
//       sx={{
//         p: { xs: 2, sm: 3, md: 4 },
//         bgcolor: "grey.50",
//         minHeight: "100vh",
//         maxWidth: 1400,
//         mx: "auto",
//       }}
//     >
//       <Typography
//         variant="h4"
//         fontWeight="bold"
//         color={themeColor}
//         gutterBottom
//         sx={{ mb: 4 }}
//       >
//         Restaurant Reviews
//       </Typography>
//       <Paper
//         elevation={4}
//         sx={{
//           borderRadius: 3,
//           overflow: "hidden",
//           boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
//         }}
//       >
//         <TableContainer sx={{ overflowX: "auto" }}>
//           <Table sx={{ minWidth: isMobile ? 650 : 900 }}>
//             <TableHead>
//               <TableRow sx={{ bgcolor: themeColor }}>
//                 <TableCell sx={{ color: "white", fontWeight: "bold", pl: 3 }}>
//                   Customer
//                 </TableCell>
//                 {!isMobile && (
//                   <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                     Date
//                   </TableCell>
//                 )}
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                   Rating
//                 </TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                   Review
//                 </TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                   Reply
//                 </TableCell>
//                 <TableCell
//                   sx={{ color: "white", fontWeight: "bold" }}
//                   align="center"
//                 >
//                   Helpful
//                 </TableCell>
//                 <TableCell
//                   sx={{ color: "white", fontWeight: "bold" }}
//                   align="right"
//                   width={120}
//                 >
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {reviews.map((review) => (
//                 <TableRow
//                   key={review.id}
//                   hover
//                   sx={{
//                     "&:hover": { bgcolor: `${themeColor}08` },
//                     transition: "background-color 0.2s",
//                   }}
//                 >
//                   {/* Customer */}
//                   <TableCell sx={{ pl: 3 }}>
//                     <Stack direction="row" spacing={2} alignItems="center">
//                       <Avatar
//                         sx={{
//                           bgcolor: themeColor,
//                           width: 48,
//                           height: 48,
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {review.avatar}
//                       </Avatar>
//                       <Box>
//                         <Typography variant="subtitle1" fontWeight={600}>
//                           {review.customer}
//                         </Typography>
//                         {!isMobile && (
//                           <Typography variant="caption" color="text.secondary">
//                             {review.date}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Stack>
//                   </TableCell>

//                   {/* Date (tablet/desktop only) */}
//                   {!isMobile && (
//                     <TableCell>
//                       <Typography variant="body2" color="text.secondary">
//                         {review.date}
//                       </Typography>
//                     </TableCell>
//                   )}

//                   {/* Rating */}
//                   <TableCell>
//                     <Stack direction="row" spacing={1} alignItems="center">
//                       <Rating
//                         value={review.rating}
//                         readOnly
//                         precision={0.5}
//                         size="small"
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         ({review.rating}/5)
//                       </Typography>
//                     </Stack>
//                   </TableCell>

//                   {/* Review Text */}
//                   <TableCell sx={{ maxWidth: { xs: 200, sm: 300, md: 400 } }}>
//                     <Tooltip title={review.text} arrow>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           display: "-webkit-box",
//                           WebkitLineClamp: 3,
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                         }}
//                       >
//                         {review.text}
//                       </Typography>
//                     </Tooltip>
//                   </TableCell>

//                   {/* Reply Section */}
//                   <TableCell>
//                     {review.reply ? (
//                       <Paper
//                         variant="outlined"
//                         sx={{
//                           p: 2,
//                           borderRadius: 2,
//                           bgcolor: "grey.50",
//                           borderColor: "grey.300",
//                         }}
//                       >
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                           gutterBottom
//                         >
//                           Vendor Reply:
//                         </Typography>
//                         <Typography variant="body2">
//                           {review.reply}
//                         </Typography>
//                       </Paper>
//                     ) : (
//                       <Stack spacing={1.5}>
//                         <TextField
//                           size="small"
//                           placeholder="Write your reply..."
//                           value={replyInputs[review.id] || ""}
//                           onChange={(e) =>
//                             handleReplyChange(review.id, e.target.value)
//                           }
//                           multiline
//                           maxRows={3}
//                           fullWidth
//                           variant="outlined"
//                         />
//                         <Button
//                           variant="contained"
//                           size="small"
//                           startIcon={<SendIcon />}
//                           disabled={!replyInputs[review.id]?.trim()}
//                           onClick={() => handleSendReply(review.id)}
//                           sx={{
//                             bgcolor: themeColor,
//                             "&:hover": { bgcolor: "#e04545" },
//                             alignSelf: "flex-start",
//                             px: 3,
//                           }}
//                         >
//                           Send
//                         </Button>
//                       </Stack>
//                     )}
//                   </TableCell>

//                   {/* Helpful */}
//                   <TableCell align="center">
//                     <Chip
//                       icon={<ThumbUpIcon fontSize="small" />}
//                       label={review.helpful}
//                       size="small"
//                       color="success"
//                       variant="outlined"
//                       sx={{ fontWeight: 600 }}
//                     />
//                   </TableCell>

//                   {/* Actions */}
//                   <TableCell align="right">
//                     <Stack direction="row" spacing={1} justifyContent="flex-end">
//                       <Tooltip title="View Full Review">
//                         <IconButton size="small" color="primary">
//                           <CommentIcon />
//                         </IconButton>
//                       </Tooltip>

//                       <Tooltip title="Delete Review">
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={() => handleDeleteReview(review.id)}
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </Tooltip>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Footer Summary */}
//         <Divider />
//         <Box
//           sx={{
//             p: 3,
//             bgcolor: `${themeColor}05`,
//             textAlign: "center",
//           }}
//         >
//           <Stack
//             direction={{ xs: "column", sm: "row" }}
//             spacing={3}
//             justifyContent="center"
//             alignItems="center"
//           >
//             <Typography variant="h6" color="text.primary">
//               Total Reviews: <strong>{reviews.length}</strong>
//             </Typography>
//             <Rating
//               value={averageRating}
//               precision={0.1}
//               readOnly
//               size="medium"
//             />
//             <Typography variant="h6" color={themeColor} fontWeight="bold">
//               {averageRating.toFixed(1)} / 5
//             </Typography>
//           </Stack>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default Reviews;

import React, { useState, useEffect } from "react";
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
  Button,
  IconButton,
  TextField,
  Tooltip,
  Stack,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Send as SendIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  Restaurant as RestaurantIcon,
  RamenDining as DishIcon,
} from "@mui/icons-material";
import axiosInstance from "../api/axiosInstance";
const themeColor = "#FF5252";

// ── Helpers ────────────────────────────────────────────────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getInitial = (name) =>
  name && name !== "Unknown" ? name[0].toUpperCase() : "U";

// ── Reusable Reviews Table ─────────────────────────────────────────────────────
const ReviewsTable = ({ reviews, isMobile, replyInputs, replies, onReplyChange, onSendReply }) => {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}
    >
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: isMobile ? 650 : 900 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: themeColor }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", pl: 3 }}>
                Customer
              </TableCell>
              {!isMobile && (
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Date
                </TableCell>
              )}
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Rating
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Review
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Reply
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold" }}
                align="center"
              >
                Helpful
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold" }}
                align="right"
                width={120}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {reviews.map((review) => {
              const replyKey = `${review.id}`;
              const currentReply = replies[replyKey] || "";

              return (
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
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={review.user_image || undefined}
                        sx={{
                          bgcolor: themeColor,
                          width: 48,
                          height: 48,
                          fontWeight: "bold",
                        }}
                      >
                        {getInitial(review.user_name)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {review.user_name === "Unknown"
                            ? `User ${review.user_id}`
                            : review.user_name}
                        </Typography>
                        {isMobile && (
                          <Typography variant="caption" color="text.secondary">
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
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Rating
                        value={review.rating}
                        readOnly
                        precision={0.5}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({review.rating}/5)
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Review Text */}
                  <TableCell sx={{ maxWidth: { xs: 200, sm: 300, md: 400 } }}>
                    <Tooltip title={review.comment} arrow>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {review.comment}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  {/* Reply */}
                  <TableCell>
                    {currentReply ? (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "grey.50",
                          borderColor: "grey.300",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          gutterBottom
                        >
                          Vendor Reply:
                        </Typography>
                        <Typography variant="body2">{currentReply}</Typography>
                      </Paper>
                    ) : (
                      <Stack spacing={1.5}>
                        <TextField
                          size="small"
                          placeholder="Write your reply..."
                          value={replyInputs[replyKey] || ""}
                          onChange={(e) => onReplyChange(replyKey, e.target.value)}
                          multiline
                          maxRows={3}
                          fullWidth
                          variant="outlined"
                        />
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<SendIcon />}
                          disabled={!replyInputs[replyKey]?.trim()}
                          onClick={() => onSendReply(replyKey)}
                          sx={{
                            bgcolor: themeColor,
                            "&:hover": { bgcolor: "#e04545" },
                            alignSelf: "flex-start",
                            px: 3,
                          }}
                        >
                          Send
                        </Button>
                      </Stack>
                    )}
                  </TableCell>

                  {/* Helpful (review count placeholder) */}
                  <TableCell align="center">
                    <Chip
                      icon={<ThumbUpIcon fontSize="small" />}
                      label={review.rating}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Full Review">
                        <IconButton size="small" color="primary">
                          <CommentIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Review">
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

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
            Total Reviews: <strong>{reviews.length}</strong>
          </Typography>
          <Rating value={averageRating} precision={0.1} readOnly size="medium" />
          <Typography variant="h6" color={themeColor} fontWeight="bold">
            {averageRating.toFixed(1)} / 5
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
};

// ── Section Header ─────────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title, count, color }) => (
  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 2,
        bgcolor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Typography variant="h5" fontWeight={700} color="text.primary">
      {title}
    </Typography>
    <Chip
      label={`${count} review${count !== 1 ? "s" : ""}`}
      size="small"
      sx={{ bgcolor: `${color}18`, color, fontWeight: 700, border: `1px solid ${color}40` }}
    />
  </Stack>
);

// ── Main Component ─────────────────────────────────────────────────────────────
// Pass restaurantId as prop from your parent / route params
const Reviews = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ── State ──
  const [restaurantReviews, setRestaurantReviews] = useState([]);
  // dishReviewsMap: { [menuitem_id]: review[] }
  const [dishReviewsMap, setDishReviewsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Shared reply state for all tables
  const [replyInputs, setReplyInputs] = useState({});
  const [replies, setReplies] = useState({});

  const handleReplyChange = (key, value) =>
    setReplyInputs((prev) => ({ ...prev, [key]: value }));

  const handleSendReply = (key) => {
    const text = replyInputs[key]?.trim();
    if (!text) return;
    setReplies((prev) => ({ ...prev, [key]: text }));
    setReplyInputs((prev) => ({ ...prev, [key]: "" }));
  };

  // ── Fetch everything on mount ──
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch restaurant reviews
        const restRes = await axiosInstance.get(
          `/restaurants/restaurant/1`
        );
        const restData = restRes.data?.data || [];
        setRestaurantReviews(restData);

        // 2. Get unique menuitem_ids from restaurant reviews
        const menuItemIds = [...new Set(restData.map((r) => r.menuitem_id))];

        const dishResults = await Promise.all(
          menuItemIds.map((id) =>
            axiosInstance
              .get(`/restaurants/dish/${id}`)
              .then((res) => ({ id, data: res.data?.data || [] }))
              .catch(() => ({ id, data: [] })) // don't break if one fails
          )
        );

        const map = {};
        dishResults.forEach(({ id, data }) => {
          map[id] = data;
        });
        setDishReviewsMap(map);
      } catch (e) {
        setError("Failed to load reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [1]);

  // ── Render ──
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
        Reviews
      </Typography>

      {/* ── Loading ── */}
      {loading && (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <CircularProgress sx={{ color: themeColor }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading reviews...
          </Typography>
        </Box>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* ── Content ── */}
      {!loading && !error && (
        <Stack spacing={5}>
          {/* ── SECTION 1: Restaurant Reviews ── */}
          <Box>
            <SectionHeader
              icon={<RestaurantIcon sx={{ color: "white", fontSize: 20 }} />}
              title="Restaurant Reviews"
              count={restaurantReviews.length}
              color={themeColor}
            />

            {restaurantReviews.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography fontSize={40}>🍽️</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  No restaurant reviews yet.
                </Typography>
              </Box>
            ) : (
              <ReviewsTable
                reviews={restaurantReviews}
                isMobile={isMobile}
                replyInputs={replyInputs}
                replies={replies}
                onReplyChange={handleReplyChange}
                onSendReply={handleSendReply}
              />
            )}
          </Box>

          {/* ── SECTION 2: Dish Reviews (one per unique menuitem_id) ── */}
          {Object.entries(dishReviewsMap).map(([menuItemId, dishReviews]) => (
            <Box key={menuItemId}>
              <SectionHeader
                icon={<DishIcon sx={{ color: "white", fontSize: 20 }} />}
                title={`Dish Reviews — Item #${menuItemId}`}
                count={dishReviews.length}
                color="#FC8019"
              />

              {dishReviews.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography fontSize={40}>🍛</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    No reviews for this dish yet.
                  </Typography>
                </Box>
              ) : (
                <ReviewsTable
                  reviews={dishReviews}
                  isMobile={isMobile}
                  replyInputs={replyInputs}
                  replies={replies}
                  onReplyChange={handleReplyChange}
                  onSendReply={handleSendReply}
                />
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Reviews;

