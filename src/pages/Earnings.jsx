import React from 'react';
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
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';
import HistoryIcon from '@mui/icons-material/History';

const earningsData = [
  {
    period: 'Today',
    date: '21 Jan 2026',
    gross: 3480,
    commission: 348,
    net: 3132,
    orders: 18,
    status: 'Pending',
  },
  {
    period: 'This Week',
    date: '15 Jan – 21 Jan 2026',
    gross: 18500,
    commission: 1850,
    net: 16650,
    orders: 92,
    status: 'Pending',
  },
  {
    period: 'This Month',
    date: '01 Jan – 21 Jan 2026',
    gross: 68500,
    commission: 6850,
    net: 61650,
    orders: 341,
    status: 'Partially Paid',
  },
  {
    period: 'Last Payout',
    date: 'Dec 2025',
    gross: 92000,
    commission: 9200,
    net: 82800,
    orders: 458,
    status: 'Paid',
    paidOn: '05 Jan 2026',
  },
];

const themeColor = "#FF5252";

const StatCard = ({ icon, label, value, color }) => (
  <Paper
    elevation={0}
    sx={{
      flex: 1,
      p: 2.5,
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      background: 'linear-gradient(135deg, #ffffff, #fafafa)',
      border: '1px solid #f0f0f0',
      transition: 'all 0.2s ease',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transform: 'translateY(-2px)',
      },
    }}
  >
    <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>{icon}</Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={800} color="text.primary">
        {value}
      </Typography>
    </Box>
  </Paper>
);

const Earnings = () => {
  return (
    <Box 
      className="font-['Poppins']"  // ← Same font jo Dashboard mein hai bhai!
      sx={{ 
        p: { xs: 2, md: 4 }, 
        bgcolor: '#f7f8fa', 
        minHeight: '100vh',
        maxWidth: 1400,
        mx: 'auto',
      }}
    >
      {/* Header */}
      <Typography 
        variant="h4" 
        fontWeight={800} 
        mb={3} 
        color={themeColor}
        sx={{ letterSpacing: '-0.02em' }}
      >
        Earnings & Payouts
      </Typography>

      {/* Top Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 5,
        }}
      >
        <StatCard
          icon={<TrendingUpIcon />}
          label="This Month Earnings"
          value="₹61,650"
          color="#4caf50"
        />
        <StatCard
          icon={<ReceiptLongIcon />}
          label="Total Orders"
          value="341"
          color="#2196f3"
        />
        <StatCard
          icon={<PaymentsIcon />}
          label="Commission"
          value="₹6,850"
          color="#FF5252"
        />
        <StatCard
          icon={<HistoryIcon />}
          label="Last Payout"
          value="₹82,800"
          color="#9c27b0"
        />
      </Box>

      {/* Earnings Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid #eee',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            bgcolor: themeColor,
            color: '#fff',
            p: { xs: 2.5, md: 3.5 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            Earnings Summary
          </Typography>
          <Chip
            label="Request Payout"
            clickable
            component="button"
            sx={{
              bgcolor: 'rgba(255,255,255,0.95)',
              color: themeColor,
              fontWeight: 700,
              px: 3,
              py: 1,
              borderRadius: 25,
              fontSize: '0.875rem',
              boxShadow: '0 4px 12px rgba(255,82,82,0.3)',
              '&:hover': {
                bgcolor: '#fff',
                boxShadow: '0 6px 20px rgba(255,82,82,0.4)',
                transform: 'translateY(-1px)',
              },
            }}
          />
        </Box>

        <TableContainer sx={{ bgcolor: 'white' }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafbff' }}>
                <TableCell sx={{ fontWeight: 800, py: 2.5, fontSize: '0.95rem', color: '#374151' }}>
                  Period
                </TableCell>
                <TableCell sx={{ fontWeight: 800, py: 2.5, fontSize: '0.95rem', color: '#374151' }}>
                  Date
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, py: 2.5, fontSize: '0.95rem', color: '#374151' }}>
                  Gross
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, py: 2.5, fontSize: '0.95rem', color: '#374151' }}>
                  Commission
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, py: 2.5, fontSize: '0.95rem', color: '#374151' }}>
                  Net Payout
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, py: 2.5, fontSize: '0.95rem', color: '#374151' }}>
                  Orders
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, py: 2.5, fontSize: '0.95rem', color: '#374151' }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {earningsData.map((row, i) => (
                <TableRow
                  key={i}
                  hover
                  sx={{ 
                    '&:hover': { bgcolor: `${themeColor}04` },
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  <TableCell sx={{ py: 3, fontWeight: 600 }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ bgcolor: `${themeColor}10`, width: 32, height: 32, color: themeColor }}>
                        <HistoryIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700} color="text.primary">{row.period}</Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 3, color: 'text.secondary', fontWeight: 500 }}>
                    {row.date}
                  </TableCell>

                  <TableCell align="right" sx={{ py: 3, fontWeight: 600, color: 'text.primary' }}>
                    ₹{row.gross.toLocaleString()}
                  </TableCell>

                  <TableCell align="right" sx={{ 
                    py: 3, 
                    fontWeight: 600, 
                    color: `${themeColor} !important`,
                  }}>
                    -₹{row.commission.toLocaleString()}
                  </TableCell>

                  <TableCell align="right" sx={{ 
                    py: 3, 
                    fontWeight: 800, 
                    color: '#059669',
                    fontSize: '1.05rem'
                  }}>
                    ₹{row.net.toLocaleString()}
                  </TableCell>

                  <TableCell align="center" sx={{ py: 3 }}>
                    <Chip 
                      label={row.orders} 
                      size="small" 
                      sx={{ 
                        bgcolor: `${themeColor}10`, 
                        color: themeColor,
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }} 
                    />
                  </TableCell>

                  <TableCell align="center" sx={{ py: 3 }}>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: '0.8rem',
                        borderRadius: 20,
                        minWidth: 90,
                        ...(row.status === 'Paid' && {
                          bgcolor: '#dcfce7',
                          color: '#166534',
                        }),
                        ...(row.status === 'Pending' && {
                          bgcolor: '#fef3c7',
                          color: '#d97706',
                        }),
                        ...(row.status === 'Partially Paid' && {
                          bgcolor: '#dbeafe',
                          color: '#1e40af',
                        }),
                      }}
                    />
                    {row.paidOn && (
                      <Typography 
                        variant="caption" 
                        display="block" 
                        mt={0.8}
                        sx={{ color: '#6b7280', fontWeight: 500 }}
                      >
                        Paid on {row.paidOn}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 0, borderColor: '#f0f0f0' }} />

        {/* Footer Summary */}
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            bgcolor: `${themeColor}08`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            borderTop: '1px solid rgba(255,82,82,0.1)',
          }}
        >
          <Typography 
            fontWeight={700} 
            sx={{ 
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              color: 'text.primary'
            }}
          >
            Total Net Earnings (This Month):
            <Box 
              component="span" 
              sx={{ 
                ml: 2, 
                color: themeColor, 
                fontWeight: 900,
                fontSize: { xs: '1.4rem', md: '1.6rem' }
              }}
            >
              ₹61,650
            </Box>
          </Typography>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600} mb={0.5}>
              Commission 10% • Next payout by 05 Feb 2026
            </Typography>
            <Chip
              label="View Payout History"
              size="small"
              sx={{
                bgcolor: themeColor,
                color: 'white',
                fontWeight: 700,
                px: 2.5,
                borderRadius: 20,
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Earnings;