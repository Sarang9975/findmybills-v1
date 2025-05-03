import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { KeyRound, Smartphone } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import PublicLayout from '@/components/PublicLayout';
import { RegisterResponse } from '@/types/invoice';
import { useSession } from '@/contexts/SessionContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth } from "@/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier?: any;
  }
}

const countryCodes = [
  { code: '+91', name: 'India' },
  { code: '+1', name: 'USA' },
  { code: '+44', name: 'UK' },
  { code: '+61', name: 'Australia' },
  { code: '+86', name: 'China' },
  { code: '+49', name: 'Germany' },
  { code: '+33', name: 'France' },
  { code: '+81', name: 'Japan' },
];

const API_URL = 'https://findmybills-backend.vercel.app';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useSession();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    countryCode: '+91'
  });
  const [otpData, setOtpData] = useState({
    otp: '',
    mobileNumber: '', // We'll store this after the first step
    countryCode: '+91'
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const RATE_LIMIT_DELAY = 60000; // 60 seconds

  const recaptchaVerifierRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCountryCodeChange = (value: string) => {
    setFormData({
      ...formData,
      countryCode: value
    });
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value
    });
  };

  const setupRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          }
        }
      );
      recaptchaVerifierRef.current.render();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate mobile number format
      if (formData.mobileNumber.length !== 10 || !/^\d+$/.test(formData.mobileNumber)) {
        toast.error('Please enter a valid 10-digit mobile number');
        setIsLoading(false);
        return;
      }

      // Setup reCAPTCHA
      setupRecaptcha();
      const appVerifier = recaptchaVerifierRef.current;
      if (!appVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      // Format phone number with country code
      const phoneNumber = `${formData.countryCode}${formData.mobileNumber}`;
      console.log('Sending OTP to:', phoneNumber);

      // Send OTP
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      toast.success('Verification code sent to your phone');
      setIsOtpSent(true);
      setOtpData({ 
        ...otpData, 
        mobileNumber: formData.mobileNumber,
        countryCode: formData.countryCode 
      });
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      if (error.code === 'auth/invalid-phone-number') {
        toast.error('Invalid phone number format');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please try again later.');
      } else {
        toast.error(error.message || 'Failed to send verification code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate OTP format
      if (!otpData.otp || otpData.otp.length < 4 || otpData.otp.length > 6) {
        toast.error('Please enter a valid verification code');
        setIsLoading(false);
        return;
      }

      if (!confirmationResult) {
        toast.error('No OTP request in progress. Please try again.');
        setIsLoading(false);
        return;
      }

      console.log('Verifying OTP for number:', otpData.mobileNumber);

      // First verify with Firebase
      const userCredential = await confirmationResult.confirm(otpData.otp);
      const token = await userCredential.user.getIdToken();

      // Then save to MongoDB
      try {
        console.log('Saving user to MongoDB:', otpData.mobileNumber);
        const response = await axios.post<RegisterResponse>(`${API_URL}/api/users/register`, {
          mobileNumber: otpData.mobileNumber
        });

        if (response.data.success) {
          login(token);
          localStorage.setItem('mobileNumber', otpData.mobileNumber);
          localStorage.setItem('countryCode', otpData.countryCode);
          toast.success('Account created successfully!');
          navigate('/invoices');
        } else {
          throw new Error(response.data.msg || 'Failed to create account');
        }
      } catch (error: any) {
        console.error('Error saving to MongoDB:', error);
        if (error.response?.status === 400 && error.response?.data?.msg === 'User already exists') {
          toast.error('This number is already registered. Please login instead.');
          navigate('/login');
        } else {
          toast.error(error.response?.data?.msg || 'Failed to create account');
        }
      }
    } catch (error: any) {
      console.error('Error in handleVerifyOtp:', error);
      if (error.code === 'auth/invalid-verification-code') {
        toast.error('Invalid verification code. Please try again.');
      } else if (error.code === 'auth/code-expired') {
        toast.error('Verification code has expired. Please request a new one.');
      } else {
        toast.error(error.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // Check rate limiting
    const now = Date.now();
    if (now - lastRequestTime < RATE_LIMIT_DELAY) {
      const remainingTime = Math.ceil((RATE_LIMIT_DELAY - (now - lastRequestTime)) / 1000);
      toast.error(`Please wait ${remainingTime} seconds before requesting a new code`);
      return;
    }
    try {
      setIsLoading(true);
      setupRecaptcha();
      const appVerifier = recaptchaVerifierRef.current;
      const phoneNumber = `${otpData.countryCode}${otpData.mobileNumber}`;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setLastRequestTime(Date.now());
      toast.success('Verification code sent to your phone');
    } catch (error: any) {
      console.error('Error in handleResendOtp:', error);
      if (error.code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please try again later.');
      } else {
        toast.error(error.message || 'Failed to send verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-5rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {isOtpSent 
                    ? 'Verify your phone number to complete signup' 
                    : 'Sign up to start managing your bills'}
                </p>
              </div>

              {!isOtpSent ? (
                // Step 1: Enter mobile number
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="mobileNumber">
                      Mobile Number
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="w-24">
                        <Select value={formData.countryCode} onValueChange={handleCountryCodeChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="+91" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.code} {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="relative flex-1">
                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                        <Input
                          id="mobileNumber"
                          name="mobileNumber"
                          type="tel"
                          placeholder="Enter your mobile number"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          className="pl-10"
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-6 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </form>
              ) : (
                // Step 2: OTP verification
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="otp">
                      Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        placeholder="Enter the verification code"
                        value={otpData.otp}
                        onChange={handleOtpChange}
                        className="pl-10"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-6 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Complete Signup'}
                  </Button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-primary text-sm hover:underline"
                      disabled={isLoading}
                    >
                      Didn't receive a code? Resend
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-primary hover:text-primary/80 font-semibold"
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </Card>
          <div id="recaptcha-container"></div>
        </motion.div>
      </div>
    </PublicLayout>
  );
};

export default SignupPage; 