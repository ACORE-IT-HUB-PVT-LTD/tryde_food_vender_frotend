import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';

const Earnings = () => {
  // Realistic mock earnings data
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

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Typography 
        variant="h4" 
        component="h1" 
        className="mb-10 font-bold text-[#FF5252]"  // ← yahan mb-6 se mb-10 kar diya (niche space badha)
      >
        Earnings & Payouts
      </Typography>

      {/* Main Content Card */}
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          maxWidth: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        {/* Header Bar */}
        <Box 
          sx={{ 
            bgcolor: '#FF5252', 
            color: 'white', 
            p: { xs: 2.5, md: 3 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Earnings Summary
          </Typography>

          <Chip
            label="Request Payout"
            clickable
            sx={{
              bgcolor: 'white',
              color: '#FF5252',
              fontWeight: 'bold',
              px: 2,
              '&:hover': {
                bgcolor: '#ffebee',
              }
            }}
          />
        </Box>

        {/* Thoda space table ke upar */}
        <Box sx={{ height: 20 }} />  {/* ← yahan extra space diya table ke shuru hone se pehle */}

        {/* Table */}
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Period</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Date / Range</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }} align="right">Gross Earnings</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }} align="right">Commission (10%)</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }} align="right">Net Payout</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">Orders</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {earningsData.map((row, index) => (
                <TableRow 
                  key={index}
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: '#fff5f5' }
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <HistoryIcon 
                        fontSize="small" 
                        sx={{ color: '#FF5252' }} 
                      />
                      <Typography variant="body1" fontWeight={500}>
                        {row.period}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.date}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body1" fontWeight={600}>
                      ₹{row.gross.toLocaleString()}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body1" color="error.main" fontWeight={500}>
                      ₹{row.commission.toLocaleString()}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body1" fontWeight={600} color="#2e7d32">
                      ₹{row.net.toLocaleString()}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip 
                      label={row.orders} 
                      size="small"
                      color="primary"
                      sx={{ minWidth: 60 }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={row.status}
                      size="small"
                      color={
                        row.status === 'Paid' ? 'success' :
                        row.status === 'Pending' ? 'warning' :
                        row.status === 'Partially Paid' ? 'info' : 'default'
                      }
                      sx={{ 
                        fontWeight: 500,
                        minWidth: 100 
                      }}
                    />
                    {row.paidOn && (
                      <Typography 
                        variant="caption" 
                        display="block" 
                        color="text.secondary" 
                        mt={0.5}
                      >
                        Paid: {row.paidOn}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Summary */}
        <Divider />
        
        <Box 
          p={3} 
          sx={{ 
            bgcolor: '#fff5f5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            Total Net Earnings (This Month): 
            <Box component="span" sx={{ color: '#FF5252', fontWeight: 'bold', ml: 1 }}>
              ₹61,650
            </Box>
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Commission rate: 10% • Next payout expected by 05 Feb 2026
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default Earnings;