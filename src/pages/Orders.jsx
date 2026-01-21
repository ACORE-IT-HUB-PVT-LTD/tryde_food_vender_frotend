import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
} from "@mui/material";

const themeColor = "#FF5252";

const STATUS = {
  NEW: "NEW",
  PREPARING: "PREPARING",
  READY: "READY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const Orders = () => {
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState([]);

  // ---------------- LOAD ORDERS ----------------
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("vendorOrders"));

    if (stored && stored.length > 0) {
      setOrders(stored);
    } else {
      const demoOrders = [
        {
          id: "ORD1001",
          customer: "Rahul",
          items: [
            { name: "Burger", qty: 2 },
            { name: "Fries", qty: 1 },
          ],
          total: 340,
          payment: "ONLINE",
          status: STATUS.NEW,
        },
        {
          id: "ORD1002",
          customer: "Priya",
          items: [{ name: "Pizza", qty: 1 }],
          total: 299,
          payment: "COD",
          status: STATUS.PREPARING,
        },
        {
          id: "ORD1003",
          customer: "Aman",
          items: [{ name: "Momos", qty: 3 }],
          total: 210,
          payment: "ONLINE",
          status: STATUS.READY,
        },
      ];

      localStorage.setItem("vendorOrders", JSON.stringify(demoOrders));
      setOrders(demoOrders);
    }
  }, []);

  // ---------------- UPDATE STATUS ----------------
  const updateStatus = (id, newStatus) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );

    setOrders(updated);
    localStorage.setItem("vendorOrders", JSON.stringify(updated));
  };

  // ---------------- FILTER ----------------
  const filteredOrders = () => {
    switch (tab) {
      case 0:
        return orders.filter((o) => o.status === STATUS.NEW);
      case 1:
        return orders.filter((o) => o.status === STATUS.PREPARING);
      case 2:
        return orders.filter((o) => o.status === STATUS.READY);
      case 3:
        return orders.filter((o) => o.status === STATUS.DELIVERED);
      case 4:
        return orders.filter((o) => o.status === STATUS.CANCELLED);
      default:
        return [];
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" color={themeColor} mb={3}>
        Orders Management
      </Typography>

      {/* ================= TABS ================= */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        textColor="inherit"
        indicatorColor="secondary"
        sx={{
          mb: 4,
          "& .Mui-selected": { color: themeColor },
          "& .MuiTabs-indicator": { background: themeColor },
        }}
      >
        <Tab label="New Orders" />
        <Tab label="Preparing" />
        <Tab label="Ready" />
        <Tab label="Delivered" />
        <Tab label="Cancelled" />
      </Tabs>

      {/* ================= ORDERS ================= */}
      <Grid container spacing={3}>
        {filteredOrders().length === 0 ? (
          <Grid item xs={12}>
            <Typography textAlign="center" color="gray">
              No orders found
            </Typography>
          </Grid>
        ) : (
          filteredOrders().map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  borderLeft: `6px solid ${themeColor}`,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography fontWeight="bold">
                      {order.id}
                    </Typography>
                    <Chip
                      label={order.status}
                      size="small"
                      color={
                        order.status === STATUS.NEW
                          ? "warning"
                          : order.status === STATUS.PREPARING
                          ? "info"
                          : order.status === STATUS.READY
                          ? "primary"
                          : order.status === STATUS.DELIVERED
                          ? "success"
                          : "error"
                      }
                    />
                  </Box>

                  <Typography color="text.secondary">
                    Customer: {order.customer}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  {order.items.map((item, i) => (
                    <Typography key={i} variant="body2">
                      {item.name} × {item.qty}
                    </Typography>
                  ))}

                  <Divider sx={{ my: 1.5 }} />

                  <Typography fontWeight="bold">
                    Total: ₹{order.total}
                  </Typography>

                  <Typography variant="body2">
                    Payment: {order.payment}
                  </Typography>

                  {/* ACTION BUTTONS */}
                  <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                    {order.status === STATUS.NEW && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ bgcolor: themeColor }}
                          onClick={() =>
                            updateStatus(order.id, STATUS.PREPARING)
                          }
                        >
                          Accept
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            updateStatus(order.id, STATUS.CANCELLED)
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {order.status === STATUS.PREPARING && (
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ bgcolor: themeColor }}
                        onClick={() =>
                          updateStatus(order.id, STATUS.READY)
                        }
                      >
                        Mark Ready
                      </Button>
                    )}

                    {order.status === STATUS.READY && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() =>
                          updateStatus(order.id, STATUS.DELIVERED)
                        }
                      >
                        Delivered
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Orders;
