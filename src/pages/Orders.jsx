import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";

// Status icons
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';

const themeColor = "#FF5252";

const STATUS = {
  NEW: "NEW",
  PREPARING: "PREPARING",
  READY: "READY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const getStatusColor = (status) => {
  switch (status) {
    case STATUS.NEW: return "warning";
    case STATUS.PREPARING: return "info";
    case STATUS.READY: return "primary";
    case STATUS.DELIVERED: return "success";
    case STATUS.CANCELLED: return "error";
    default: return "default";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case STATUS.NEW: return <NewReleasesIcon fontSize="small" />;
    case STATUS.PREPARING: return <TimelapseIcon fontSize="small" />;
    case STATUS.READY: return <CheckCircleIcon fontSize="small" />;
    case STATUS.DELIVERED: return <LocalShippingIcon fontSize="small" />;
    case STATUS.CANCELLED: return <CancelIcon fontSize="small" />;
    default: return null;
  }
};

const Orders = () => {
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("vendorOrders"));

    if (stored && stored.length > 0) {
      setOrders(stored);
    } else {
      const demoOrders = [
        { id: "ORD1001", customer: "Rahul", items: [{ name: "Burger", qty: 2 }, { name: "Fries", qty: 1 }], total: 340, payment: "ONLINE", status: STATUS.NEW },
        { id: "ORD1002", customer: "Priya", items: [{ name: "Pizza", qty: 1 }], total: 299, payment: "COD", status: STATUS.PREPARING },
        { id: "ORD1003", customer: "Aman", items: [{ name: "Momos", qty: 3 }], total: 210, payment: "ONLINE", status: STATUS.READY },
        { id: "ORD1004", customer: "Neha", items: [{ name: "Thali", qty: 1 }], total: 420, payment: "ONLINE", status: STATUS.DELIVERED },
      ];

      localStorage.setItem("vendorOrders", JSON.stringify(demoOrders));
      setOrders(demoOrders);
    }
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    localStorage.setItem("vendorOrders", JSON.stringify(updated));
  };

  const filteredOrders = orders.filter((o) => {
    if (tab === 0) return o.status === STATUS.NEW;
    if (tab === 1) return o.status === STATUS.PREPARING;
    if (tab === 2) return o.status === STATUS.READY;
    if (tab === 3) return o.status === STATUS.DELIVERED;
    if (tab === 4) return o.status === STATUS.CANCELLED;
    return false;
  });

  const tabLabels = ["New", "Preparing", "Ready", "Delivered", "Cancelled"];

  return (
    <Box
      className="font-['Poppins']"   // ← Exactly same font jo Dashboard mein hai
      sx={{
        p: { xs: 2, md: 3 },
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
        Orders Dashboard
      </Typography>

      {/* Tabs */}
      <Paper
  elevation={3}
  sx={{
    borderRadius: 3,
    overflow: "hidden",
    mb: 4,
    border: "1px solid rgba(0,0,0,0.15)", // subtle border
    bgcolor: "#fefefe", // light background
    background: "linear-gradient(90deg, #fff5f5, #ffecec)", // subtle gradient
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)", // slightly stronger shadow
  }}
>
  <Tabs
    value={tab}
    onChange={(_, v) => setTab(v)}
    variant={isMobile ? "scrollable" : "fullWidth"}
    scrollButtons={isMobile ? "auto" : false}
    allowScrollButtonsMobile
    sx={{
      bgcolor: "transparent", // keep gradient from Paper visible
      "& .MuiTab-root": {
        minHeight: 64,
        fontWeight: 600,
        textTransform: "none",
        fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" },
        py: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          bgcolor: `${themeColor}15`, // light hover effect
          transform: "scale(1.05)",
        },
      },
      "& .Mui-selected": {
        color: themeColor,
        bgcolor: `${themeColor}25`, // slightly stronger highlight
        fontWeight: 700,
        borderRadius: 2,
      },
      "& .MuiTabs-indicator": {
        backgroundColor: themeColor,
        height: 4,
        borderRadius: 2,
      },
    }}
  >
    {tabLabels.map((label, i) => (
      <Tab key={i} label={label} />
    ))}
  </Tabs>
</Paper>


      {/* Orders Table */}
      <TableContainer
        component={Paper}
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8f9fa" }}>
              <TableCell sx={{ fontWeight: 700, pl: 4, py: 2 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Customer</TableCell>
              {!isMobile && <TableCell sx={{ fontWeight: 700, py: 2 }}>Items</TableCell>}
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Payment</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, pr: 4, py: 2 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <Typography
                    color="text.secondary"
                    variant="h6"
                    fontWeight={500}
                  >
                    No {tabLabels[tab].toLowerCase()} orders at the moment
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    bgcolor: order.status === STATUS.NEW ? `${themeColor}08` : "inherit",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      bgcolor: `${themeColor}05 !important`,
                    },
                  }}
                >
                  <TableCell sx={{ pl: 4, fontWeight: 600, color: "#333" }}>
                    {order.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{order.customer}</TableCell>

                  {!isMobile && (
                    <TableCell>
                      <Stack direction="column" spacing={0.5}>
                        {order.items.map((item, i) => (
                          <Typography key={i} variant="body2" color="text.secondary">
                            {item.name} × {item.qty}
                          </Typography>
                        ))}
                      </Stack>
                    </TableCell>
                  )}

                  <TableCell>
                    <Typography fontWeight={700} color={themeColor}>
                      ₹{order.total}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={order.payment}
                      size="small"
                      variant="outlined"
                      color={order.payment === "ONLINE" ? "primary" : "default"}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {getStatusIcon(order.status)}
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          minWidth: 100,
                          borderRadius: "16px",
                        }}
                      />
                    </Stack>
                  </TableCell>

                  <TableCell align="right" sx={{ pr: 4 }}>
                    <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                      {order.status === STATUS.NEW && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              bgcolor: themeColor,
                              borderRadius: 2,
                              px: 3,
                              "&:hover": { bgcolor: "#e63939" },
                            }}
                            onClick={() => updateStatus(order.id, STATUS.PREPARING)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            sx={{ borderRadius: 2, px: 3 }}
                            onClick={() => updateStatus(order.id, STATUS.CANCELLED)}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {order.status === STATUS.PREPARING && (
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            bgcolor: themeColor,
                            borderRadius: 2,
                            px: 3
                          }}
                          onClick={() => updateStatus(order.id, STATUS.READY)}
                        >
                          Mark Ready
                        </Button>
                      )}

                      {order.status === STATUS.READY && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          sx={{ borderRadius: 2, px: 3 }}
                          onClick={() => updateStatus(order.id, STATUS.DELIVERED)}
                        >
                          Delivered
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Orders;