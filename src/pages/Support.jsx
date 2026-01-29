// src/pages/Support.jsx
import React, { useState } from "react";
import { Box, Typography, Paper, TextField, Button, Stack, Divider } from "@mui/material";
// Import React Icons
import { RiCustomerService2Fill } from "react-icons/ri"; // support agent icon
import { AiFillThunderbolt, AiFillPushpin, AiFillFileText } from "react-icons/ai"; // info icons

const Support = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) {
      alert("Please enter your issue!");
      return;
    }
    alert("Ticket Submitted Successfully!");
    setMessage("");
  };

  return (
    <Box className="font-['Poppins']" sx={{ p: { xs: 3, md: 6 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" mb={5}>
        <RiCustomerService2Fill style={{ fontSize: 40, color: "#FF5252" }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#FF5252" }}>
          Vendor Support
        </Typography>
      </Stack>

      {/* Support Form Card */}
      <Paper
        elevation={8}
        sx={{
          maxWidth: 700,
          mx: "auto",
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          bgcolor: "white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg,#FF5252,#FF8A65)",
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: "#FF5252" }}>
          Submit Your Issue
        </Typography>

        <TextField
          multiline
          minRows={4}
          maxRows={8}
          fullWidth
          placeholder="Describe your issue in detail..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#fff",
              "& fieldset": { borderColor: "#ddd" },
              "&:hover fieldset": { borderColor: "#FF5252" },
              "&.Mui-focused fieldset": {
                borderColor: "#FF5252",
                boxShadow: "0 0 0 2px rgba(255,82,82,0.15)",
              },
            },
          }}
        />

        <Button
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#FF5252",
            "&:hover": { bgcolor: "#e04545" },
            py: 1.5,
            fontWeight: 700,
            borderRadius: 3,
            fontSize: "1rem",
            transition: "all 0.3s ease",
            boxShadow: "0 6px 20px rgba(255,82,82,0.25)",
          }}
        >
          Submit Ticket
        </Button>

        <Divider sx={{ my: 4, opacity: 0.2 }} />

        {/* Extra Info / Tips */}
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AiFillThunderbolt style={{ color: "#FF5252" }} /> Our support team responds within 24 hours.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AiFillPushpin style={{ color: "#FF5252" }} /> Provide screenshots if possible to help us resolve faster.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AiFillFileText style={{ color: "#FF5252" }} /> Track all submitted tickets in the "My Tickets" section.
          </Typography>
        </Stack>
      </Paper>

      {/* Footer Note */}
      <Box sx={{ mt: 6, maxWidth: 700, mx: "auto", textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Designed for vendors, optimized for quick support experience.
        </Typography>
      </Box>
    </Box>
  );
};

export default Support;
