import React, { useEffect, useState, useCallback } from "react";
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
  Divider,
  alpha,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from "@mui/material";

import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import PhoneIcon from "@mui/icons-material/Phone";
import GridViewIcon from "@mui/icons-material/GridView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";

import axiosInstance from "../api/axiosInstance";

// ─── Brand ────────────────────────────────────────────────────────────────────
const BRAND = "#FF5252";
const BRAND_DARK = "#E53935";

// ─── Statuses ─────────────────────────────────────────────────────────────────
const STATUS = {
  ALL: "ALL",
  CREATED: "CREATED",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  READY: "READY",
  CANCELLED: "CANCELLED",
};

const STATUS_CONFIG = {
  [STATUS.ALL]: { color: "#6366f1", bgColor: "#eef2ff", label: "All", icon: GridViewIcon },
  [STATUS.CREATED]: { color: "#f59e0b", bgColor: "#fffbeb", label: "New", icon: NewReleasesIcon },
  [STATUS.ACCEPTED]: { color: "#3b82f6", bgColor: "#eff6ff", label: "Accepted", icon: CheckCircleIcon },
  [STATUS.PREPARING]: { color: "#8b5cf6", bgColor: "#f5f3ff", label: "Preparing", icon: TimelapseIcon },
  [STATUS.READY]: { color: "#06b6d4", bgColor: "#ecfeff", label: "Ready", icon: CheckCircleIcon },
  [STATUS.OUT_FOR_DELIVERY]: { color: "#f97316", bgColor: "#fff7ed", label: "Out for Delivery", icon: LocalShippingIcon },
  [STATUS.DELIVERED]: { color: "#10b981", bgColor: "#ecfdf5", label: "Delivered", icon: LocalShippingIcon },
  [STATUS.CANCELLED]: { color: "#ef4444", bgColor: "#fef2f2", label: "Cancelled", icon: CancelIcon },
};

const TAB_CONFIG = [
  STATUS.ALL,
  STATUS.CREATED,
  STATUS.ACCEPTED,
  STATUS.PREPARING,
  STATUS.READY,
  STATUS.CANCELLED,
];

// ─── Time formatter ───────────────────────────────────────────────────────────
const formatTime = (iso) => {
  if (!iso) return "—";
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

// ─── 4 API Helpers ────────────────────────────────────────────────────────────
// API 1 — GET all orders
const apiGetAllOrders = () =>
  axiosInstance.get("/orders/vendor/orders", { withCredentials: true });

// API 2 — GET order by ID
const apiGetOrderById = (orderId) =>
  axiosInstance.get(`/orders/vendor/orders/${orderId}`, { withCredentials: true });

// API 3 — POST accept order
const apiAcceptOrder = (orderId) =>
  axiosInstance.post(`/orders/${orderId}/accept`, {}, { withCredentials: true });

// API 4 — POST mark ready
const apiMarkReady = (orderId) =>
  axiosInstance.patch(`/orders/${orderId}/statusready`, { status: "READY" }, { withCredentials: true });

// ─── StatusChip ───────────────────────────────────────────────────────────────
const StatusChip = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG[STATUS.CREATED];
  const Icon = cfg.icon;
  return (
    <Chip
      icon={<Icon sx={{ fontSize: "0.85rem !important" }} />}
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: cfg.bgColor,
        color: cfg.color,
        fontWeight: 700,
        fontSize: "0.7rem",
        borderRadius: "6px",
        height: 26,
        border: `1px solid ${alpha(cfg.color, 0.2)}`,
        "& .MuiChip-icon": { color: cfg.color },
      }}
    />
  );
};

// ─── Order Detail Dialog (uses API 2) ─────────────────────────────────────────
const OrderDetailDialog = ({ orderId, open, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !orderId) return;
    setLoading(true);
    setError(null);
    setDetail(null);
    apiGetOrderById(orderId)
      .then((res) => setDetail(res.data.data))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load order details"))
      .finally(() => setLoading(false));
  }, [open, orderId]);

  const addr = detail?.delivery_address || {};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
    >
      {detail && (
        <Box sx={{ height: 5, bgcolor: STATUS_CONFIG[detail.order_status]?.color || BRAND }} />
      )}

      <DialogTitle sx={{ pb: 1, pt: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight={800} letterSpacing="-0.3px">
              Order Details
            </Typography>
            {detail && (
              <Typography variant="caption" color="text.disabled" sx={{ fontFamily: "monospace" }}>
                {detail.order_id}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ borderRadius: "8px" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {loading && (
          <Stack spacing={2} mt={1}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rounded" height={44} sx={{ borderRadius: "10px" }} />
            ))}
          </Stack>
        )}

        {error && <Alert severity="error" sx={{ borderRadius: "10px", mt: 1 }}>{error}</Alert>}

        {detail && (
          <Stack spacing={2} mt={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <StatusChip status={detail.order_status} />
              <Typography variant="caption" color="text.disabled">{formatTime(detail.created_at)}</Typography>
            </Stack>

            <Divider />

            {/* Customer block */}
            <Box p={2} sx={{ bgcolor: alpha(BRAND, 0.04), borderRadius: "10px", border: `1px solid ${alpha(BRAND, 0.1)}` }}>
              <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.62rem" }}>
                Customer
              </Typography>
              <Typography variant="body2" fontWeight={700} mt={0.5}>
                {addr.name || `User #${detail.user_id}`}
              </Typography>
              {addr.phone && (
                <Stack direction="row" spacing={0.5} alignItems="center" mt={0.3}>
                  <PhoneIcon sx={{ fontSize: 12, color: "text.disabled" }} />
                  <Typography variant="caption" color="text.secondary">{addr.phone}</Typography>
                </Stack>
              )}
            </Box>

            {/* Delivery address */}
            {(addr.addressLine1 || addr.city) && (
              <Box p={2} sx={{ bgcolor: "#f8fafc", borderRadius: "10px", border: "1px solid", borderColor: "divider" }}>
                <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.62rem" }}>
                  Delivery Address
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5} lineHeight={1.7}>
                  {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
                </Typography>
              </Box>
            )}

            {/* Payment summary */}
            <Stack direction="row" spacing={1.5}>
              <Box flex={1} p={1.5} sx={{ bgcolor: "#f8fafc", borderRadius: "10px", border: "1px solid", borderColor: "divider" }}>
                <Stack direction="row" spacing={0.5} alignItems="center" mb={0.5}>
                  <PaymentIcon sx={{ fontSize: 13, color: "text.disabled" }} />
                  <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: "0.6rem", letterSpacing: "0.4px" }}>Mode</Typography>
                </Stack>
                <Chip label={detail.payment_mode} size="small" sx={{ bgcolor: detail.payment_mode === "ONLINE" ? alpha("#3b82f6", 0.1) : alpha("#64748b", 0.1), color: detail.payment_mode === "ONLINE" ? "#3b82f6" : "#64748b", fontWeight: 700, fontSize: "0.68rem", height: 22, borderRadius: "5px" }} />
              </Box>
              <Box flex={1} p={1.5} sx={{ bgcolor: "#f8fafc", borderRadius: "10px", border: "1px solid", borderColor: "divider" }}>
                <Stack direction="row" spacing={0.5} alignItems="center" mb={0.5}>
                  <ReceiptIcon sx={{ fontSize: 13, color: "text.disabled" }} />
                  <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: "0.6rem", letterSpacing: "0.4px" }}>Payment</Typography>
                </Stack>
                <Chip label={detail.payment_status} size="small" sx={{ bgcolor: detail.payment_status === "PAID" ? alpha("#10b981", 0.1) : alpha("#f59e0b", 0.1), color: detail.payment_status === "PAID" ? "#10b981" : "#f59e0b", fontWeight: 700, fontSize: "0.68rem", height: 22, borderRadius: "5px" }} />
              </Box>
              <Box flex={1} p={1.5} sx={{ bgcolor: alpha(BRAND, 0.05), borderRadius: "10px", border: `1px solid ${alpha(BRAND, 0.12)}`, textAlign: "center" }}>
                <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: "0.6rem", letterSpacing: "0.4px" }}>Total</Typography>
                <Typography variant="h6" fontWeight={800} color={BRAND} lineHeight={1.4} mt={0.2}>
                  ₹{parseFloat(detail.total_amount).toFixed(0)}
                </Typography>
              </Box>
            </Stack>

            {/* Driver */}
            <Box p={1.5} sx={{ borderRadius: "10px", bgcolor: detail.driver_status !== "NOT_ASSIGNED" ? alpha("#10b981", 0.06) : alpha("#94a3b8", 0.06), border: `1px solid ${alpha(detail.driver_status !== "NOT_ASSIGNED" ? "#10b981" : "#94a3b8", 0.15)}` }}>
              <Typography variant="caption" fontWeight={700} color={detail.driver_status !== "NOT_ASSIGNED" ? "#10b981" : "text.secondary"}>
                🚗 Driver: {detail.driver_status === "NOT_ASSIGNED" ? "Not yet assigned" : detail.driver_status}
              </Typography>
            </Box>

            {/* OTP */}
            {detail.pickup_otp && (
              <Box p={1.5} sx={{ borderRadius: "10px", bgcolor: alpha("#f59e0b", 0.06), border: `1px solid ${alpha("#f59e0b", 0.2)}` }}>
                <Typography variant="caption" color="#f59e0b" fontWeight={700}>
                  Pickup OTP: {detail.pickup_otp} &nbsp;
                  {detail.otp_verified ? "✅ Verified" : "⏳ Awaiting verification"}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, color: "text.secondary" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Orders = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [viewMode, setViewMode] = useState("card");
  const [detailOrderId, setDetailOrderId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ── API 1: Fetch all orders ─────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetAllOrders();
      setOrders(res.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── API 3: Accept order ─────────────────────────────────────────────────────
  const handleAccept = async (order) => {
    setUpdatingId(order.id);
    setActionError(null);
    try {
      await apiAcceptOrder(order.order_id);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, order_status: STATUS.ACCEPTED } : o))
      );
    } catch (err) {
      setActionError(`Accept failed: ${err?.response?.data?.message || "Please try again"}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // ── API 4: Mark ready ───────────────────────────────────────────────────────
  const handleMarkReady = async (order) => {
    setUpdatingId(order.id);
    setActionError(null);
    try {
      await apiMarkReady(order.order_id);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, order_status: STATUS.READY } : o))
      );
    } catch (err) {
      setActionError(`Mark ready failed: ${err?.response?.data?.message || "Please try again"}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Local status step (no API endpoint provided for these transitions) ───────
  const stepStatus = (order, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, order_status: newStatus } : o))
    );
  };

  // ── Filtering ───────────────────────────────────────────────────────────────
  const activeStatus = TAB_CONFIG[activeTab];
  const filteredOrders =
    activeStatus === STATUS.ALL
      ? orders
      : orders.filter((o) => o.order_status === activeStatus);

  const getCount = (status) =>
    status === STATUS.ALL
      ? orders.length
      : orders.filter((o) => o.order_status === status).length;

  // ─── Action Buttons ────────────────────────────────────────────────────────
  const ActionButtons = ({ order, compact = false }) => {
    const status = order.order_status;
    const isUpdating = updatingId === order.id;
    const isTerminal = status === STATUS.DELIVERED || status === STATUS.CANCELLED;

    if (isTerminal) {
      return (
        <Typography variant="caption" color="text.disabled" fontStyle="italic" sx={{ whiteSpace: "nowrap" }}>
          {status === STATUS.DELIVERED ? "✅ Completed" : "❌ Cancelled"}
        </Typography>
      );
    }

    const base = {
      borderRadius: "8px",
      textTransform: "none",
      fontWeight: 700,
      fontSize: compact ? "0.72rem" : "0.82rem",
      py: compact ? 0.5 : 0.9,
      px: compact ? 1.5 : 2,
      boxShadow: "none",
      whiteSpace: "nowrap",
    };

    const Spinner = () =>
      isUpdating ? <CircularProgress size={11} color="inherit" sx={{ mr: 0.5 }} /> : null;

    return (
      <Stack direction="row" spacing={1} justifyContent={compact ? "flex-end" : "stretch"}>
        {/* NEW → Accept (API 3) + Reject */}
        {status === STATUS.CREATED && (
          <>
            <Button
              variant="contained"
              size={compact ? "small" : "medium"}
              disabled={isUpdating}
              onClick={() => handleAccept(order)}
              startIcon={<Spinner />}
              sx={{ ...base, flex: compact ? "none" : 1, bgcolor: BRAND, "&:hover": { bgcolor: BRAND_DARK } }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              size={compact ? "small" : "medium"}
              disabled={isUpdating}
              onClick={() => stepStatus(order, STATUS.CANCELLED)}
              sx={{ ...base, flex: compact ? "none" : 1, borderColor: alpha(theme.palette.error.main, 0.4), color: theme.palette.error.main, "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.06), borderColor: theme.palette.error.main } }}
            >
              Reject
            </Button>
          </>
        )}

        {/* ACCEPTED → Start Preparing */}
        {status === STATUS.ACCEPTED && (
          <Button
            variant="contained"
            size={compact ? "small" : "medium"}
            disabled={isUpdating}
            onClick={() => stepStatus(order, STATUS.PREPARING)}
            sx={{ ...base, flex: compact ? "none" : 1, bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" } }}
          >
            Start Preparing
          </Button>
        )}

        {/* PREPARING → Mark Ready (API 4) */}
        {status === STATUS.PREPARING && (
          <Button
            variant="contained"
            size={compact ? "small" : "medium"}
            disabled={isUpdating}
            onClick={() => handleMarkReady(order)}
            startIcon={<Spinner />}
            sx={{ ...base, flex: compact ? "none" : 1, bgcolor: "#06b6d4", "&:hover": { bgcolor: "#0891b2" } }}
          >
            Mark Ready
          </Button>
        )}

        {/* READY → Out for Delivery */}
        {status === STATUS.READY && (
          <Button
            variant="contained"
            size={compact ? "small" : "medium"}
            disabled={isUpdating}
            onClick={() => stepStatus(order, STATUS.OUT_FOR_DELIVERY)}
            sx={{ ...base, flex: compact ? "none" : 1, bgcolor: "#f97316", "&:hover": { bgcolor: "#ea6c0a" } }}
          >
            Out for Delivery
          </Button>
        )}

        {/* OUT_FOR_DELIVERY → Mark Delivered */}
        {status === STATUS.OUT_FOR_DELIVERY && (
          <Button
            variant="contained"
            size={compact ? "small" : "medium"}
            disabled={isUpdating}
            onClick={() => stepStatus(order, STATUS.DELIVERED)}
            sx={{ ...base, flex: compact ? "none" : 1, bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}
          >
            Mark Delivered
          </Button>
        )}
      </Stack>
    );
  };

  // ─── Order Card ────────────────────────────────────────────────────────────
  const OrderCard = ({ order }) => {
    const cfg = STATUS_CONFIG[order.order_status] || STATUS_CONFIG[STATUS.CREATED];
    const addr = order.delivery_address || {};
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: `1px solid ${alpha(cfg.color, 0.18)}`,
          bgcolor: "#fff",
          transition: "all 0.25s ease",
          display: "flex",
          flexDirection: "column",
          "&:hover": { transform: "translateY(-2px)", boxShadow: `0 10px 30px ${alpha(cfg.color, 0.12)}`, borderColor: alpha(cfg.color, 0.4) },
        }}
      >
        <Box sx={{ height: 4, bgcolor: cfg.color, borderRadius: "16px 16px 0 0", flexShrink: 0 }} />
        <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
            <Box>
              <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                {order.order_id}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" mt={0.3}>
                <AccessTimeIcon sx={{ fontSize: 12, color: "text.disabled" }} />
                <Typography variant="caption" color="text.disabled" fontWeight={500}>{formatTime(order.created_at)}</Typography>
              </Stack>
            </Box>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <StatusChip status={order.order_status} />
              <Tooltip title="View full details">
                <IconButton
                  size="small"
                  onClick={() => setDetailOrderId(order.order_id)}
                  sx={{ borderRadius: "7px", color: "text.disabled", "&:hover": { color: BRAND, bgcolor: alpha(BRAND, 0.06) } }}
                >
                  <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Divider sx={{ my: 1.5, opacity: 0.5 }} />

          {/* Customer */}
          <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
            <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: alpha(BRAND, 0.08), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <PersonIcon sx={{ color: BRAND, fontSize: 18 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.4px", fontSize: "0.6rem" }}>Customer</Typography>
              <Typography variant="body2" fontWeight={700} color="text.primary" lineHeight={1.3}>
                {addr.name || `User #${order.user_id}`}
              </Typography>
              {addr.phone && (
                <Stack direction="row" spacing={0.4} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 11, color: "text.disabled" }} />
                  <Typography variant="caption" color="text.disabled">{addr.phone}</Typography>
                </Stack>
              )}
            </Box>
          </Stack>

          {/* Address */}
          {(addr.addressLine1 || addr.city) && (
            <Stack direction="row" spacing={0.8} alignItems="flex-start" mb={1.5}>
              <LocationOnIcon sx={{ fontSize: 14, color: alpha(BRAND, 0.5), mt: 0.2, flexShrink: 0 }} />
              <Typography variant="caption" color="text.secondary" lineHeight={1.6}>
                {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
              </Typography>
            </Stack>
          )}

          <Divider sx={{ my: 1.5, opacity: 0.5 }} />

          {/* Payment & Total */}
          <Stack direction="row" spacing={1.5} mb={2}>
            <Box flex={1} p={1.2} sx={{ borderRadius: "10px", bgcolor: "#f8fafc", border: "1px solid", borderColor: "divider" }}>
              <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: "0.58rem", letterSpacing: "0.4px" }}>Payment</Typography>
              <Box mt={0.5}>
                <Chip label={order.payment_mode} size="small" sx={{ bgcolor: order.payment_mode === "ONLINE" ? alpha("#3b82f6", 0.1) : alpha("#64748b", 0.1), color: order.payment_mode === "ONLINE" ? "#3b82f6" : "#64748b", fontWeight: 700, fontSize: "0.64rem", height: 20, borderRadius: "5px" }} />
              </Box>
            </Box>
            <Box flex={1} p={1.2} sx={{ borderRadius: "10px", bgcolor: alpha(BRAND, 0.04), border: `1px solid ${alpha(BRAND, 0.12)}`, textAlign: "center" }}>
              <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: "0.58rem", letterSpacing: "0.4px" }}>Total</Typography>
              <Typography variant="h6" fontWeight={800} color={BRAND} lineHeight={1.3} mt={0.2} fontSize="1.05rem">
                ₹{parseFloat(order.total_amount).toFixed(0)}
              </Typography>
            </Box>
          </Stack>

          {/* Driver badge */}
          {order.driver_status && order.driver_status !== "NOT_ASSIGNED" && (
            <Box mb={1.5} p={1.2} sx={{ borderRadius: "10px", bgcolor: alpha("#10b981", 0.06), border: `1px solid ${alpha("#10b981", 0.15)}` }}>
              <Typography variant="caption" color="#10b981" fontWeight={700}>🚗 Driver: {order.driver_status}</Typography>
            </Box>
          )}

          {/* Actions */}
          <Box mt="auto" pt={1}>
            <ActionButtons order={order} />
          </Box>
        </CardContent>
      </Card>
    );
  };

  // ─── Table Row ─────────────────────────────────────────────────────────────
  const OrderTableRow = ({ order }) => {
    const cfg = STATUS_CONFIG[order.order_status] || STATUS_CONFIG[STATUS.CREATED];
    const addr = order.delivery_address || {};
    return (
      <TableRow sx={{ "&:hover": { bgcolor: alpha(cfg.color, 0.025) }, transition: "background 0.2s" }}>
        <TableCell sx={{ py: 2, borderLeft: `3px solid ${cfg.color}` }}>
          <Typography variant="caption" fontWeight={700} sx={{ fontFamily: "monospace", display: "block", fontSize: "0.78rem" }}>{order.order_id}</Typography>
          <Typography variant="caption" color="text.disabled">#{order.id}</Typography>
        </TableCell>
        <TableCell sx={{ py: 2 }}>
          <Typography variant="body2" fontWeight={600}>{addr.name || `User #${order.user_id}`}</Typography>
          {addr.phone && <Typography variant="caption" color="text.disabled" display="block">{addr.phone}</Typography>}
          {addr.city && <Typography variant="caption" color="text.disabled">{addr.city}, {addr.state}</Typography>}
        </TableCell>
        <TableCell sx={{ py: 2 }}>
          <Stack spacing={0.5}>
            <Chip label={order.payment_mode} size="small" sx={{ bgcolor: order.payment_mode === "ONLINE" ? alpha("#3b82f6", 0.1) : alpha("#64748b", 0.1), color: order.payment_mode === "ONLINE" ? "#3b82f6" : "#64748b", fontWeight: 700, fontSize: "0.68rem", borderRadius: "5px", width: "fit-content" }} />
            <Chip label={order.payment_status} size="small" sx={{ bgcolor: order.payment_status === "PAID" ? alpha("#10b981", 0.1) : alpha("#f59e0b", 0.1), color: order.payment_status === "PAID" ? "#10b981" : "#f59e0b", fontWeight: 700, fontSize: "0.68rem", borderRadius: "5px", width: "fit-content" }} />
          </Stack>
        </TableCell>
        <TableCell sx={{ py: 2 }}>
          <Typography fontWeight={800} color={BRAND}>₹{parseFloat(order.total_amount).toFixed(0)}</Typography>
        </TableCell>
        <TableCell sx={{ py: 2 }}><StatusChip status={order.order_status} /></TableCell>
        <TableCell sx={{ py: 2 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 12, color: "text.disabled" }} />
            <Typography variant="caption" color="text.disabled">{formatTime(order.created_at)}</Typography>
          </Stack>
        </TableCell>
        <TableCell align="right" sx={{ py: 2 }}>
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => setDetailOrderId(order.order_id)} sx={{ borderRadius: "8px", color: "text.disabled", "&:hover": { color: BRAND, bgcolor: alpha(BRAND, 0.06) } }}>
                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <ActionButtons order={order} compact />
          </Stack>
        </TableCell>
      </TableRow>
    );
  };

  // ─── Empty State ───────────────────────────────────────────────────────────
  const EmptyState = () => (
    <Box textAlign="center" py={8}>
      <Box sx={{ width: 72, height: 72, borderRadius: "18px", bgcolor: alpha(BRAND, 0.08), display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2, transform: "rotate(-6deg)" }}>
        <ShoppingBagIcon sx={{ fontSize: 36, color: BRAND }} />
      </Box>
      <Typography variant="h6" fontWeight={700} color="text.primary" mb={0.5}>
        No {STATUS_CONFIG[activeStatus]?.label || ""} orders
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Orders will appear here once customers place them
      </Typography>
    </Box>
  );

  // ─── Skeleton ──────────────────────────────────────────────────────────────
  const SkeletonCards = () => (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 2 }}>
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} variant="rounded" height={290} sx={{ borderRadius: "16px" }} />
      ))}
    </Box>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", p: { xs: 1.5, md: 3 } }}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>

        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight={800} color="text.primary" letterSpacing="-0.5px">
              Orders Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.3}>
              {loading ? "Loading..." : `${orders.length} total order${orders.length !== 1 ? "s" : ""}`}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {!isMobile && (
              <>
                <Tooltip title="Card View">
                  <IconButton onClick={() => setViewMode("card")} sx={{ borderRadius: "10px", bgcolor: viewMode === "card" ? alpha(BRAND, 0.1) : "transparent", color: viewMode === "card" ? BRAND : "text.secondary" }}>
                    <GridViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Table View">
                  <IconButton onClick={() => setViewMode("table")} sx={{ borderRadius: "10px", bgcolor: viewMode === "table" ? alpha(BRAND, 0.1) : "transparent", color: viewMode === "table" ? BRAND : "text.secondary" }}>
                    <TableRowsIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Button
              variant="outlined"
              startIcon={loading ? <CircularProgress size={13} /> : <RefreshIcon />}
              onClick={fetchOrders}
              disabled={loading}
              sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, borderColor: alpha(BRAND, 0.3), color: BRAND, "&:hover": { bgcolor: alpha(BRAND, 0.05), borderColor: BRAND } }}
            >
              {!isMobile && "Refresh"}
            </Button>
          </Stack>
        </Stack>

        {/* Fetch error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }} onClose={() => setError(null)}
            action={<Button color="error" size="small" onClick={fetchOrders}>Retry</Button>}>
            {error}
          </Alert>
        )}

        {/* Action error */}
        {actionError && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: "12px" }} onClose={() => setActionError(null)}>
            {actionError}
          </Alert>
        )}

        {/* Tabs */}
        <Paper elevation={0} sx={{ borderRadius: "14px", mb: 3, bgcolor: "#fff", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: { xs: 50, md: 58 },
              "& .MuiTab-root": { minHeight: { xs: 50, md: 58 }, fontWeight: 600, textTransform: "none", fontSize: { xs: "0.78rem", md: "0.87rem" }, px: { xs: 1.5, md: 2.5 }, color: "text.secondary", "&.Mui-selected": { color: BRAND, fontWeight: 800 } },
              "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0", bgcolor: BRAND },
            }}
          >
            {TAB_CONFIG.map((status, idx) => {
              const cfg = STATUS_CONFIG[status];
              const count = getCount(status);
              return (
                <Tab
                  key={status}
                  label={
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <span>{cfg.label}</span>
                      {count > 0 && (
                        <Box sx={{ px: 0.7, py: 0.05, borderRadius: "5px", bgcolor: activeTab === idx ? alpha(cfg.color, 0.15) : alpha(cfg.color, 0.07), color: cfg.color, fontWeight: 800, fontSize: "0.67rem", minWidth: 18, textAlign: "center", lineHeight: 1.7 }}>
                          {count}
                        </Box>
                      )}
                    </Stack>
                  }
                />
              );
            })}
          </Tabs>
        </Paper>

        {/* Content Area */}
        {loading ? (
          <SkeletonCards />
        ) : isMobile || viewMode === "card" ? (
          <Box>
            {filteredOrders.length === 0 ? (
              <Paper elevation={0} sx={{ borderRadius: "14px", bgcolor: "#fff", border: "1px solid", borderColor: "divider" }}>
                <EmptyState />
              </Paper>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 2 }}>
                {filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)}
              </Box>
            )}
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "14px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {["Order ID", "Customer", "Payment", "Total", "Status", "Time", "Actions"].map((h) => (
                    <TableCell key={h} align={h === "Actions" ? "right" : "left"} sx={{ fontWeight: 800, py: 1.8, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow><TableCell colSpan={7} sx={{ border: 0 }}><EmptyState /></TableCell></TableRow>
                ) : (
                  filteredOrders.map((order) => <OrderTableRow key={order.id} order={order} />)
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Detail Dialog — API 2 */}
      <OrderDetailDialog
        orderId={detailOrderId}
        open={Boolean(detailOrderId)}
        onClose={() => setDetailOrderId(null)}
      />
    </Box>
  );
};

export default Orders;