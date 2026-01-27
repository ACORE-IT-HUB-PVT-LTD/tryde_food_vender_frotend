import React, { useState } from "react";
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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Send as SendIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
} from "@mui/icons-material";

const themeColor = "#FF5252";

const Reviews = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: "Amit Sharma",
      avatar: "A",
      date: "Jan 18, 2026",
      rating: 5,
      text: "Best paneer tikka I’ve ever had! Fast delivery and fresh food. Highly recommend!",
      reply: "Thank you Amit! Glad you loved it 😊 Will make it even better next time!",
      helpful: 12,
    },
    {
      id: 2,
      customer: "Priya Patel",
      avatar: "P",
      date: "Jan 17, 2026",
      rating: 4,
      text: "Food was tasty but delivery took 15 min extra. Otherwise good experience.",
      reply: "",
      helpful: 8,
    },
    {
      id: 3,
      customer: "Rahul Verma",
      avatar: "R",
      date: "Jan 16, 2026",
      rating: 2,
      text: "Biryani was too spicy and rice was undercooked. Not happy with quality.",
      reply:
        "Sorry for the inconvenience Rahul. We’ll refund 50% of your order. Please reach out to support.",
      helpful: 5,
    },
    {
      id: 4,
      customer: "Sneha Gupta",
      avatar: "S",
      date: "Jan 15, 2026",
      rating: 5,
      text: "Amazing gulab jamun! Perfectly sweet and soft. Will order again soon ❤️",
      reply: "Thank you Sneha! Your love for sweets motivates us!",
      helpful: 15,
    },
    {
      id: 5,
      customer: "Vikram Singh",
      avatar: "V",
      date: "Jan 14, 2026",
      rating: 3,
      text: "Average taste, packaging was good but quantity was less than expected.",
      reply: "",
      helpful: 3,
    },
  ]);

  const [replyInputs, setReplyInputs] = useState({});

  const handleReplyChange = (id, value) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendReply = (id) => {
    const replyText = replyInputs[id]?.trim();
    if (!replyText) return;

    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, reply: replyText } : review
      )
    );

    setReplyInputs((prev) => ({ ...prev, [id]: "" }));
  };

  const handleDeleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <Box
      className="font-['Poppins']"  // ← Same font as Dashboard, Orders, Profile
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
        Customer Reviews
      </Typography>

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
              {reviews.map((review) => (
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
                        sx={{
                          bgcolor: themeColor,
                          width: 48,
                          height: 48,
                          fontWeight: "bold",
                        }}
                      >
                        {review.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {review.customer}
                        </Typography>
                        {!isMobile && (
                          <Typography variant="caption" color="text.secondary">
                            {review.date}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Date (tablet/desktop only) */}
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {review.date}
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
                    <Tooltip title={review.text} arrow>
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
                        {review.text}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  {/* Reply Section */}
                  <TableCell>
                    {review.reply ? (
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
                          gutterBottom
                        >
                          Vendor Reply:
                        </Typography>
                        <Typography variant="body2">
                          {review.reply}
                        </Typography>
                      </Paper>
                    ) : (
                      <Stack spacing={1.5}>
                        <TextField
                          size="small"
                          placeholder="Write your reply..."
                          value={replyInputs[review.id] || ""}
                          onChange={(e) =>
                            handleReplyChange(review.id, e.target.value)
                          }
                          multiline
                          maxRows={3}
                          fullWidth
                          variant="outlined"
                        />
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<SendIcon />}
                          disabled={!replyInputs[review.id]?.trim()}
                          onClick={() => handleSendReply(review.id)}
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

                  {/* Helpful */}
                  <TableCell align="center">
                    <Chip
                      icon={<ThumbUpIcon fontSize="small" />}
                      label={review.helpful}
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
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Summary */}
        <Divider />
        <Box
          sx={{
            p: 3,
            bgcolor: `${themeColor}05`,
            textAlign: "center",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6" color="text.primary">
              Total Reviews: <strong>{reviews.length}</strong>
            </Typography>
            <Rating
              value={averageRating}
              precision={0.1}
              readOnly
              size="medium"
            />
            <Typography variant="h6" color={themeColor} fontWeight="bold">
              {averageRating.toFixed(1)} / 5
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Reviews;