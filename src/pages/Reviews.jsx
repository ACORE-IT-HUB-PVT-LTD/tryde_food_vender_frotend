import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  Rating,
  Divider,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: 'Amit Sharma',
      avatar: 'A',
      date: 'Jan 18, 2026',
      rating: 5,
      text: 'Best paneer tikka I’ve ever had! Fast delivery and fresh food. Highly recommend!',
      reply: 'Thank you Amit! Glad you loved it 😊 Will make it even better next time!',
      helpful: 12,
    },
    {
      id: 2,
      customer: 'Priya Patel',
      avatar: 'P',
      date: 'Jan 17, 2026',
      rating: 4,
      text: 'Food was tasty but delivery took 15 min extra. Otherwise good experience.',
      reply: '',
      helpful: 8,
    },
    {
      id: 3,
      customer: 'Rahul Verma',
      avatar: 'R',
      date: 'Jan 16, 2026',
      rating: 2,
      text: 'Biryani was too spicy and rice was undercooked. Not happy with quality.',
      reply: 'Sorry for the inconvenience Rahul. We’ll refund 50% of your order. Please reach out to support.',
      helpful: 5,
    },
    {
      id: 4,
      customer: 'Sneha Gupta',
      avatar: 'S',
      date: 'Jan 15, 2026',
      rating: 5,
      text: 'Amazing gulab jamun! Perfectly sweet and soft. Will order again soon ❤️',
      reply: 'Thank you Sneha! Your love for sweets motivates us!',
      helpful: 15,
    },
    {
      id: 5,
      customer: 'Vikram Singh',
      avatar: 'V',
      date: 'Jan 14, 2026',
      rating: 3,
      text: 'Average taste, packaging was good but quantity was less than expected.',
      reply: '',
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

    // Clear input after sending
    setReplyInputs((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="mb-8 font-bold text-[#FF5252]">
        Customer Reviews
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#FF5252' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rating</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Review</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reply</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Helpful</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reviews.map((review) => (
                <TableRow 
                  key={review.id} 
                  hover 
                  sx={{ '&:hover': { bgcolor: '#fff5f5' } }}
                >
                  {/* Customer */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: '#FF5252' }}>
                        {review.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {review.customer}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.date}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Rating */}
                  <TableCell>
                    <Rating 
                      value={review.rating} 
                      readOnly 
                      precision={0.5} 
                      size="small" 
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      {review.rating}/5
                    </Typography>
                  </TableCell>

                  {/* Review Text */}
                  <TableCell sx={{ maxWidth: 400 }}>
                    <Typography variant="body2" color="text.primary">
                      {review.text}
                    </Typography>
                  </TableCell>

                  {/* Reply Section */}
                  <TableCell>
                    {review.reply ? (
                      <Box sx={{ bgcolor: '#f0f9ff', p: 1.5, borderRadius: 2 }}>
                        <Typography variant="body2" fontStyle="italic" color="text.secondary">
                          Vendor Reply:
                        </Typography>
                        <Typography variant="body1">
                          {review.reply}
                        </Typography>
                      </Box>
                    ) : (
                      <Box display="flex" flexDirection="column" gap={1}>
                        <TextField
                          size="small"
                          placeholder="Write your reply..."
                          value={replyInputs[review.id] || ''}
                          onChange={(e) => handleReplyChange(review.id, e.target.value)}
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
                            bgcolor: '#FF5252',
                            '&:hover': { bgcolor: '#e04545' },
                            alignSelf: 'flex-start'
                          }}
                        >
                          Send Reply
                        </Button>
                      </Box>
                    )}
                  </TableCell>

                  {/* Helpful Count */}
                  <TableCell align="center">
                    <Chip
                      label={`${review.helpful} helpful`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Summary */}
        <Divider />
        <Box p={3} textAlign="center" bgcolor="#fff5f5">
          <Typography variant="subtitle1" color="#FF5252" fontWeight="medium">
            Total Reviews: {reviews.length} • Average Rating: 3.8 ⭐
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default Reviews;