import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #008080, #003333)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
      },
    },
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  background: 'linear-gradient(45deg, #008080, #003333)',
  '&:hover': {
    background: 'linear-gradient(45deg, #006666, #002222)',
  },
}));

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [showConfirmPasscode, setShowConfirmPasscode] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: '',
    passcode: '',
    confirmPasscode: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.passcode !== formData.confirmPasscode) {
      setError('Passcodes do not match');
      return;
    }

    if (formData.mobileNumber.length !== 10 || !/^\d+$/.test(formData.mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (formData.passcode.length !== 4 || !/^\d+$/.test(formData.passcode)) {
      setError('Please enter a valid 4-digit passcode');
      return;
    }

    try {
      const response = await axios.post('https://findmybills-backend.vercel.app/api/users/register', {
        mobileNumber: formData.mobileNumber,
        passcode: formData.passcode
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setError(error.response?.data?.msg || 'An error occurred during signup');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: { xs: 4, md: 8 },
        mb: { xs: 4, md: 8 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <StyledPaper elevation={3}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 3,
            }}
          >
            Create an Account
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 1,
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              margin="normal"
              required
              type="tel"
              inputProps={{ pattern: "[0-9]{10}" }}
              helperText="Enter 10-digit mobile number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    +91
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              label="Passcode"
              name="passcode"
              type={showPasscode ? 'text' : 'password'}
              value={formData.passcode}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ minLength: 4, maxLength: 4 }}
              helperText="Enter 4-digit passcode"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasscode(!showPasscode)}
                      edge="end"
                    >
                      {showPasscode ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              label="Confirm Passcode"
              name="confirmPasscode"
              type={showConfirmPasscode ? 'text' : 'password'}
              value={formData.confirmPasscode}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ minLength: 4, maxLength: 4 }}
              helperText="Confirm 4-digit passcode"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPasscode(!showConfirmPasscode)}
                      edge="end"
                    >
                      {showConfirmPasscode ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Sign Up
            </SubmitButton>
          </form>
          <Typography 
            variant="body2" 
            align="center" 
            sx={{ 
              mt: 3,
              color: 'text.secondary',
            }}
          >
            Already have an account?{' '}
            <Button 
              color="primary" 
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Login here
            </Button>
          </Typography>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default Signup; 