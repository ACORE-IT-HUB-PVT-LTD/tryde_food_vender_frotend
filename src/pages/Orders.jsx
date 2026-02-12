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
  Card,
  CardContent,
  Grid,
  Divider,
  Badge,
  alpha,
} from "@mui/material";

// Status icons
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PaymentIcon from "@mui/icons-material/Payment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const THEME_COLOR = "#FF5252";
const THEME_LIGHT = "#FFE5E5";

const STATUS = {
  All:"ALL",
  NEW: "NEW",
  PREPARING: "PREPARING",
  READY: "READY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const STATUS_CONFIG = {
  [STATUS.All]: {
    color: "#FF9800",
    bgColor: "#FFF3E0",
    label: "All Orders",
    icon: NewReleasesIcon,
  },
  [STATUS.NEW]: {
    color: "#FF9800",
    bgColor: "#FFF3E0",
    label: "New Order",
    icon: NewReleasesIcon,
  },
  [STATUS.PREPARING]: {
    color: "#2196F3",
    bgColor: "#E3F2FD",
    label: "Preparing",
    icon: TimelapseIcon,
  },
  [STATUS.READY]: {
    color: "#9C27B0",
    bgColor: "#F3E5F5",
    label: "Ready",
    icon: CheckCircleIcon,
  },
  [STATUS.DELIVERED]: {
    color: "#4CAF50",
    bgColor: "#E8F5E9",
    label: "Delivered",
    icon: LocalShippingIcon,
  },
  [STATUS.CANCELLED]: {
    color: "#F44336",
    bgColor: "#FFEBEE",
    label: "Cancelled",
    icon: CancelIcon,
  },
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Initialize demo data - Replace with API call
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setLoading(true);
    
    // Simulate API call - Replace with actual API
    const stored = localStorage.getItem("vendorOrders");
    
    if (stored) {
      setOrders(JSON.parse(stored));
    } else {
      const demoOrders = [
        {
          id: "ORD1001",
          customer: "Rahul Sharma",
          items: [
            { name: "Burger", qty: 2 },
            { name: "Fries", qty: 1 },
          ],
          total: 340,
          payment: "ONLINE",
          status: STATUS.NEW,
          time: "2 mins ago",
        },
        {
          id: "ORD1002",
          customer: "Priya Singh",
          items: [{ name: "Pizza", qty: 1 }],
          total: 299,
          payment: "COD",
          status: STATUS.PREPARING,
          time: "15 mins ago",
        },
        {
          id: "ORD1003",
          customer: "Aman Kumar",
          items: [{ name: "Momos", qty: 3 }],
          total: 210,
          payment: "ONLINE",
          status: STATUS.READY,
          time: "28 mins ago",
        },
        {
          id: "ORD1004",
          customer: "Neha Gupta",
          items: [{ name: "Thali", qty: 1 }],
          total: 420,
          payment: "ONLINE",
          status: STATUS.DELIVERED,
          time: "1 hour ago",
        },
        {
          id: "ORD1005",
          customer: "Vikram Patel",
          items: [
            { name: "Biryani", qty: 2 },
            { name: "Raita", qty: 1 },
          ],
          total: 598,
          payment: "COD",
          status: STATUS.NEW,
          time: "5 mins ago",
        },
      ];
      
      localStorage.setItem("vendorOrders", JSON.stringify(demoOrders));
      setOrders(demoOrders);
    }
    
    setLoading(false);
  };

  // Update order status - Replace with API call
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // API call would go here
      // await updateOrderAPI(orderId, newStatus);
      
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      
      setOrders(updatedOrders);
      localStorage.setItem("vendorOrders", JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const getFilteredOrders = () => {
    const statusMap = [STATUS.NEW, STATUS.PREPARING, STATUS.READY, STATUS.DELIVERED, STATUS.CANCELLED];
    return orders.filter((order) => order.status === statusMap[activeTab]);
  };

  const getOrderCount = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  const tabConfig = [
        { label: "All", status: STATUS.All, color: STATUS_CONFIG[STATUS.All].color },
    { label: "New", status: STATUS.NEW, color: STATUS_CONFIG[STATUS.NEW].color },
    { label: "Preparing", status: STATUS.PREPARING, color: STATUS_CONFIG[STATUS.PREPARING].color },
    { label: "Ready", status: STATUS.READY, color: STATUS_CONFIG[STATUS.READY].color },
    { label: "Delivered", status: STATUS.DELIVERED, color: STATUS_CONFIG[STATUS.DELIVERED].color },
    { label: "Cancelled", status: STATUS.CANCELLED, color: STATUS_CONFIG[STATUS.CANCELLED].color },
  ];

  // Mobile Card Component
  const MobileOrderCard = ({ order }) => {
    const statusInfo = STATUS_CONFIG[order.status];
    const StatusIcon = statusInfo.icon;

    return (
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          border: `1px solid ${alpha(statusInfo.color, 0.2)}`,
          bgcolor: "white",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 8px 24px ${alpha(statusInfo.color, 0.15)}`,
            borderColor: statusInfo.color,
          },
        }}
      >
        {/* Status Bar */}
        <Box
          sx={{
            height: 6,
            bgcolor: statusInfo.color,
            borderRadius: "12px 12px 0 0",
          }}
        />

        <CardContent sx={{ p: 2.5 }}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
                {order.id}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {order.time}
                </Typography>
              </Stack>
            </Box>
            <Chip
              icon={<StatusIcon sx={{ fontSize: 16 }} />}
              label={statusInfo.label}
              sx={{
                bgcolor: statusInfo.bgColor,
                color: statusInfo.color,
                fontWeight: 700,
                fontSize: "0.75rem",
                borderRadius: "8px",
                height: 32,
                "& .MuiChip-icon": {
                  color: statusInfo.color,
                },
              }}
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Customer */}
          <Stack direction="row" spacing={1.5} mb={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: alpha(THEME_COLOR, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonIcon sx={{ color: THEME_COLOR, fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                Customer
              </Typography>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {order.customer}
              </Typography>
            </Box>
          </Stack>

          {/* Items */}
          <Stack direction="row" spacing={1.5} mb={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: alpha(THEME_COLOR, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingBagIcon sx={{ color: THEME_COLOR, fontSize: 20 }} />
            </Box>
            <Box flex={1}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                Items
              </Typography>
              <Stack spacing={0.5}>
                {order.items.map((item, idx) => (
                  <Typography key={idx} variant="body2" color="text.primary" fontWeight={500}>
                    {item.name} × {item.qty}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Stack>

          {/* Payment & Total */}
          <Stack direction="row" spacing={2} mb={2.5}>
            <Box
              flex={1}
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                Payment
              </Typography>
              <Chip
                label={order.payment}
                size="small"
                sx={{
                  bgcolor: order.payment === "ONLINE" ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.grey[500], 0.1),
                  color: order.payment === "ONLINE" ? theme.palette.primary.main : theme.palette.grey[700],
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  height: 24,
                }}
              />
            </Box>
            <Box
              flex={1}
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(THEME_COLOR, 0.05),
                border: `1px solid ${alpha(THEME_COLOR, 0.1)}`,
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700} color={THEME_COLOR}>
                ₹{order.total}
              </Typography>
            </Box>
          </Stack>

          {/* Action Buttons */}
          {order.status === STATUS.NEW && (
            <Stack direction="row" spacing={1.5}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: THEME_COLOR,
                  borderRadius: 2,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: `0 4px 12px ${alpha(THEME_COLOR, 0.3)}`,
                  "&:hover": {
                    bgcolor: "#E64545",
                    boxShadow: `0 6px 16px ${alpha(THEME_COLOR, 0.4)}`,
                  },
                }}
                onClick={() => updateOrderStatus(order.id, STATUS.PREPARING)}
              >
                Accept
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: "none",
                  borderColor: alpha(theme.palette.error.main, 0.5),
                  color: theme.palette.error.main,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                    borderColor: theme.palette.error.main,
                  },
                }}
                onClick={() => updateOrderStatus(order.id, STATUS.CANCELLED)}
              >
                Reject
              </Button>
            </Stack>
          )}

          {order.status === STATUS.PREPARING && (
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: THEME_COLOR,
                borderRadius: 2,
                py: 1.2,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: `0 4px 12px ${alpha(THEME_COLOR, 0.3)}`,
                "&:hover": {
                  bgcolor: "#E64545",
                  boxShadow: `0 6px 16px ${alpha(THEME_COLOR, 0.4)}`,
                },
              }}
              onClick={() => updateOrderStatus(order.id, STATUS.READY)}
            >
              Mark as Ready
            </Button>
          )}

          {order.status === STATUS.READY && (
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: theme.palette.success.main,
                borderRadius: 2,
                py: 1.2,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                "&:hover": {
                  bgcolor: theme.palette.success.dark,
                  boxShadow: `0 6px 16px ${alpha(theme.palette.success.main, 0.4)}`,
                },
              }}
              onClick={() => updateOrderStatus(order.id, STATUS.DELIVERED)}
            >
              Mark as Delivered
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const filteredOrders = getFilteredOrders();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8F9FA",
        p: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={700}
            color="text.primary"
            sx={{ mb: 0.5 }}
          >
            Orders Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track all your orders in one place
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            mb: 3,
            bgcolor: "white",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: { xs: 56, md: 64 },
              "& .MuiTabs-flexContainer": {
                gap: { xs: 0, md: 1 },
              },
              "& .MuiTab-root": {
                minHeight: { xs: 56, md: 64 },
                fontWeight: 600,
                textTransform: "none",
                fontSize: { xs: "0.875rem", md: "0.95rem" },
                px: { xs: 2, md: 3 },
                color: "text.secondary",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "text.primary",
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
                "&.Mui-selected": {
                  color: THEME_COLOR,
                  fontWeight: 700,
                },
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
                bgcolor: THEME_COLOR,
              },
            }}
          >
            {tabConfig.map((tab, idx) => (
              <Tab
                key={idx}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>{tab.label}</span>
                    <Badge
                      badgeContent={getOrderCount(tab.status)}
                      sx={{
                        "& .MuiBadge-badge": {
                          bgcolor: activeTab === idx ? tab.color : alpha(tab.color, 0.2),
                          color: activeTab === idx ? "white" : tab.color,
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          minWidth: 20,
                          height: 20,
                        },
                      }}
                    />
                  </Stack>
                }
              />
            ))}
          </Tabs>
        </Paper>

        {/* Content */}
        {isMobile ? (
          // Mobile View
          <Box>
            {filteredOrders.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: alpha(THEME_COLOR, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <ShoppingBagIcon sx={{ fontSize: 40, color: THEME_COLOR }} />
                </Box>
                <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                  No {tabConfig[activeTab].label.toLowerCase()} orders
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Orders will appear here once available
                </Typography>
              </Paper>
            ) : (
              filteredOrders.map((order) => <MobileOrderCard key={order.id} order={order} />)
            )}
          </Box>
        ) : (
          // Desktop View
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: alpha(THEME_COLOR, 0.03),
                  }}
                >
                  <TableCell sx={{ fontWeight: 700, py: 2, color: "text.primary" }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2, color: "text.primary" }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2, color: "text.primary" }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2, color: "text.primary" }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2, color: "text.primary" }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2, color: "text.primary" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2, color: "text.primary" }}>Time</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, py: 2, color: "text.primary" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 10, border: 0 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          bgcolor: alpha(THEME_COLOR, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <ShoppingBagIcon sx={{ fontSize: 40, color: THEME_COLOR }} />
                      </Box>
                      <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                        No {tabConfig[activeTab].label.toLowerCase()} orders
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Orders will appear here once available
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const statusInfo = STATUS_CONFIG[order.status];
                    const StatusIcon = statusInfo.icon;

                    return (
                      <TableRow
                        key={order.id}
                        sx={{
                          "&:hover": {
                            bgcolor: alpha(statusInfo.color, 0.02),
                          },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                          {order.id}
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 2,
                                bgcolor: alpha(THEME_COLOR, 0.1),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <PersonIcon sx={{ fontSize: 18, color: THEME_COLOR }} />
                            </Box>
                            <Typography variant="body2" fontWeight={500}>
                              {order.customer}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Stack spacing={0.3}>
                            {order.items.map((item, idx) => (
                              <Typography key={idx} variant="body2" color="text.secondary">
                                {item.name} × {item.qty}
                              </Typography>
                            ))}
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body1" fontWeight={700} color={THEME_COLOR}>
                            ₹{order.total}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={order.payment}
                            size="small"
                            sx={{
                              bgcolor: order.payment === "ONLINE" ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.grey[500], 0.1),
                              color: order.payment === "ONLINE" ? theme.palette.primary.main : theme.palette.grey[700],
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            icon={<StatusIcon sx={{ fontSize: 16 }} />}
                            label={statusInfo.label}
                            sx={{
                              bgcolor: statusInfo.bgColor,
                              color: statusInfo.color,
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              borderRadius: "8px",
                              "& .MuiChip-icon": {
                                color: statusInfo.color,
                              },
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                              {order.time}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            {order.status === STATUS.NEW && (
                              <>
                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    bgcolor: THEME_COLOR,
                                    borderRadius: 1.5,
                                    px: 2.5,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    boxShadow: "none",
                                    "&:hover": {
                                      bgcolor: "#E64545",
                                      boxShadow: `0 4px 12px ${alpha(THEME_COLOR, 0.3)}`,
                                    },
                                  }}
                                  onClick={() => updateOrderStatus(order.id, STATUS.PREPARING)}
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderRadius: 1.5,
                                    px: 2.5,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderColor: alpha(theme.palette.error.main, 0.5),
                                    color: theme.palette.error.main,
                                    "&:hover": {
                                      bgcolor: alpha(theme.palette.error.main, 0.05),
                                      borderColor: theme.palette.error.main,
                                    },
                                  }}
                                  onClick={() => updateOrderStatus(order.id, STATUS.CANCELLED)}
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
                                  bgcolor: THEME_COLOR,
                                  borderRadius: 1.5,
                                  px: 2.5,
                                  textTransform: "none",
                                  fontWeight: 600,
                                  boxShadow: "none",
                                  "&:hover": {
                                    bgcolor: "#E64545",
                                    boxShadow: `0 4px 12px ${alpha(THEME_COLOR, 0.3)}`,
                                  },
                                }}
                                onClick={() => updateOrderStatus(order.id, STATUS.READY)}
                              >
                                Mark Ready
                              </Button>
                            )}

                            {order.status === STATUS.READY && (
                              <Button
                                size="small"
                                variant="contained"
                                sx={{
                                  bgcolor: theme.palette.success.main,
                                  borderRadius: 1.5,
                                  px: 2.5,
                                  textTransform: "none",
                                  fontWeight: 600,
                                  boxShadow: "none",
                                  "&:hover": {
                                    bgcolor: theme.palette.success.dark,
                                    boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                                  },
                                }}
                                onClick={() => updateOrderStatus(order.id, STATUS.DELIVERED)}
                              >
                                Delivered
                              </Button>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default Orders;









