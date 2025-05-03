import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  InputAdornment,
  Chip,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'active' 
    ? theme.palette.success.light 
    : theme.palette.warning.light,
  color: status === 'active' 
    ? theme.palette.success.dark 
    : theme.palette.warning.dark,
  fontWeight: 600,
}));

const Invoices = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/invoices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWarrantyStatus = (warrantyEndDate) => {
    const today = new Date();
    const endDate = new Date(warrantyEndDate);
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) return { status: 'expired', label: 'Expired' };
    if (daysRemaining < 30) return { status: 'warning', label: 'Expiring Soon' };
    return { status: 'active', label: 'Active' };
  };

  const filteredInvoices = invoices
    .filter(invoice =>
      invoice.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      }
      return 0;
    });

  const handleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <Box sx={{ 
      flexGrow: 1,
      minHeight: '100vh',
      background: theme.palette.background.default,
      py: 4,
    }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 2,
            background: theme.palette.background.paper,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              My Invoices
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/upload')}
              sx={{ 
                whiteSpace: 'nowrap',
                borderRadius: 2,
                px: 3,
                py: 1,
              }}
            >
              Add New Invoice
            </Button>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 4,
            flexWrap: 'wrap',
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by vendor or product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
              sx={{ maxWidth: 400 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Sort by date">
                <IconButton onClick={handleSort}>
                  <SortIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter">
                <IconButton>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredInvoices.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              color: theme.palette.text.secondary,
            }}>
              <ReceiptIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No invoices found
              </Typography>
              <Typography variant="body1">
                {searchQuery ? 'Try adjusting your search' : 'Add your first invoice to get started'}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredInvoices.map((invoice) => {
                const warrantyStatus = getWarrantyStatus(invoice.warrantyEndDate);
                return (
                  <Grid item xs={12} sm={6} md={4} key={invoice._id}>
                    <StyledCard 
                      onClick={() => navigate(`/invoice/${invoice._id}`)}
                      sx={{ height: '100%' }}
                    >
                      <CardContent>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 2,
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              color: theme.palette.primary.main,
                            }}
                          >
                            {invoice.vendorName}
                          </Typography>
                          <StatusChip 
                            size="small"
                            label={warrantyStatus.label}
                            status={warrantyStatus.status}
                          />
                        </Box>
                        
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            mb: 2,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {invoice.productName}
                        </Typography>

                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          gap: 1,
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Purchased: {new Date(invoice.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SecurityIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Warranty until: {new Date(invoice.warrantyEndDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Invoices; 