import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/components/AuthLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  FileText,
  Upload,
  Download,
  Clock,
  Package,
  Hash,
  Search,
  Filter,
  X,
  Shield,
  CalendarDays,
  Sparkles,
  CheckCircle,
  ChevronDown,
  Smartphone,
  XCircle,
  RotateCcw,
  File,
  Image,
  AlertCircle,
  PictureInPicture,
  FilePlus2
} from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from 'sonner';
import { Invoice } from '@/types/invoice';
import { Badge } from "@/components/ui/badge";
import SharedNav from '@/components/SharedNav';

// Define file upload modal component
const FileUploadModal = ({ isOpen, onClose, onUpload, isUploading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSelectedFile(null);
        setFilePreview(null);
        setFileError('');
        setIsDragging(false);
      }, 300);
    }
  }, [isOpen]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file) => {
    // Check file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setFileError('Please select a PDF or image file (JPG, JPEG, PNG)');
      return false;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size should be less than 10MB');
      return false;
    }

    setFileError('');
    return true;
  };

  const processFile = (file) => {
    if (!validateFile(file)) return;
    
    setSelectedFile(file);
    
    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, just show the icon
      setFilePreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile && !fileError) {
      onUpload(selectedFile);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <FilePlus2 size={48} className="text-primary/50" />;
    
    if (selectedFile.type === 'application/pdf') {
      return <FileText size={48} className="text-red-500" />;
    } else if (selectedFile.type.startsWith('image/')) {
      return <Image size={48} className="text-blue-500" />;
    }
    
    return <File size={48} className="text-gray-500" />;
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-0 right-0 top-0 bottom-0 m-auto h-fit w-[95%] max-w-md z-[60]"
            style={{ position: 'fixed', right: '0%', top: '20%', transform: 'translate(-25%, -50%)' }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto w-full">
              {/* Header */}
              <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Upload className="mr-2 h-5 w-5 text-primary" />
                    Upload Invoice
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose}
                    className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </Button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {/* Drag & Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-colors duration-300 text-center ${
                    isDragging 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                      : fileError 
                        ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                        : 'border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary/70 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  
                  <div className="py-4">
                    {selectedFile ? (
                      <div className="flex flex-col items-center">
                        <div className="mb-4 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm">
                          {filePreview ? (
                            <img 
                              src={filePreview} 
                              alt="Preview" 
                              className="max-h-40 object-contain rounded-lg" 
                            />
                          ) : (
                            getFileIcon()
                          )}
                        </div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                          {selectedFile.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 inline-block">
                          <Upload size={32} className="text-primary/70" />
                        </div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                          {isDragging ? 'Drop your file here' : 'Drag & Drop your file here'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          or click to browse your files
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Supports PDF, JPG, JPEG, PNG (max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Error Message */}
                {fileError && (
                  <div className="mt-3 text-red-500 dark:text-red-400 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1 flex-shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}
                
                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg"
                    onClick={onClose}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg"
                    onClick={handleUpload}
                    disabled={isUploading || !selectedFile || !!fileError}
                  >
                    {isUploading ? (
                      <>
                        <span className="mr-2 h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin inline-block"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface FilterState {
  vendor: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  invoiceNumber: string;
  warrantyStatus: string;
  productName: string;
}

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    vendor: 'all',
    dateFrom: undefined,
    dateTo: undefined,
    invoiceNumber: '',
    warrantyStatus: 'all',
    productName: ''
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
    updateActiveFilters();
  }, [searchTerm, filters, invoices]);

  // Add custom scrollbar styles to the document
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        height: 6px;
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 20px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.7);
      }
      .dark .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(75, 85, 99, 0.5);
      }
      .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(75, 85, 99, 0.7);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const updateActiveFilters = () => {
    const active: string[] = [];
    if (filters.vendor !== 'all') active.push('Vendor');
    if (filters.dateFrom || filters.dateTo) active.push('Date Range');
    if (filters.invoiceNumber) active.push('Invoice Number');
    if (filters.warrantyStatus !== 'all') active.push('Warranty Status');
    if (filters.productName) active.push('Product');
    setActiveFilters(active);
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.productName.toLowerCase().includes(searchLower) ||
        invoice.vendorName.toLowerCase().includes(searchLower) ||
        invoice.invoiceNumber.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters.vendor !== 'all') {
      filtered = filtered.filter(invoice => invoice.vendorName === filters.vendor);
    }

    if (filters.productName) {
      filtered = filtered.filter(invoice => 
        invoice.productName.toLowerCase().includes(filters.productName.toLowerCase())
      );
    }

    if (filters.invoiceNumber) {
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(filters.invoiceNumber.toLowerCase())
      );
    }

    if (filters.dateFrom || filters.dateTo) {
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        if (filters.dateFrom && invoiceDate < filters.dateFrom) return false;
        if (filters.dateTo && invoiceDate > filters.dateTo) return false;
        return true;
      });
    }

    if (filters.warrantyStatus !== 'all') {
      const today = new Date();
      filtered = filtered.filter(invoice => {
        const warrantyDate = new Date(invoice.warrantyEndDate);
        if (filters.warrantyStatus === 'active') {
          return warrantyDate > today;
        } else {
          return warrantyDate <= today;
        }
      });
    }

    setFilteredInvoices(filtered);
  };

  const getUniqueVendors = () => {
    const vendors = new Set(invoices.map(invoice => invoice.vendorName));
    return Array.from(vendors);
  };

  const resetFilters = () => {
    setFilters({
      vendor: 'all',
      dateFrom: undefined,
      dateTo: undefined,
      invoiceNumber: '',
      warrantyStatus: 'all',
      productName: ''
    });
    setSearchTerm('');
  };

  const removeFilter = (filterName: string) => {
    switch (filterName) {
      case 'Vendor':
        setFilters(prev => ({ ...prev, vendor: 'all' }));
        break;
      case 'Date Range':
        setFilters(prev => ({ ...prev, dateFrom: undefined, dateTo: undefined }));
        break;
      case 'Invoice Number':
        setFilters(prev => ({ ...prev, invoiceNumber: '' }));
        break;
      case 'Warranty Status':
        setFilters(prev => ({ ...prev, warrantyStatus: 'all' }));
        break;
      case 'Product':
        setFilters(prev => ({ ...prev, productName: '' }));
        break;
    }
  };

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view invoices');
        navigate('/login');
        return;
      }

      const response = await axios.get<{ data: Invoice[] }>('https://findmybills-server-v1.onrender.com/api/invoices', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setInvoices(response.data.data);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      } else {
        toast.error(error.response?.data?.msg || 'Failed to fetch invoices');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://findmybills-server-v1.onrender.com/api/invoices', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Invoice uploaded successfully');
      setIsUploadModalOpen(false); // Close modal on success
      fetchInvoices(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to upload invoice');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (invoiceId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Blob>(`https://findmybills-server-v1.onrender.com/api/invoices/${invoiceId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`; // You might want to use the actual filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error('Failed to download invoice');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getWarrantyStatus = (warrantyDate: string) => {
    if (!warrantyDate) return { status: 'none', label: '-' };
    
    const today = new Date();
    const warranty = new Date(warrantyDate);
    
    if (warranty > today) {
      return { 
        status: 'active', 
        label: formatDate(warrantyDate),
        color: 'text-green-600 dark:text-green-400'
      };
    } else {
      return { 
        status: 'expired', 
        label: formatDate(warrantyDate),
        color: 'text-red-500 dark:text-red-400'
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SharedNav />
      <AuthLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent rounded-2xl p-6 md:p-8 border border-primary/10 dark:border-primary/20 shadow-sm"
            >
              <div>
                <div className="flex items-center mb-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Your Invoices
                </h1>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Badge className="ml-4 bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40">
                      <Shield size={14} className="mr-1" /> Secure Storage
                    </Badge>
                  </motion.div>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                  Manage and track all your bills in one place
                </p>
              </div>
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                <Button 
                  size="lg"
                    className="flex items-center space-x-2 px-8 py-6 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
                    onClick={() => setIsUploadModalOpen(true)}
                  disabled={isUploading}
                >
                  <Upload size={20} />
                    <span className="font-medium">{isUploading ? 'Uploading...' : 'Upload Invoice'}</span>
                </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* File Upload Modal */}
            <FileUploadModal 
              isOpen={isUploadModalOpen}
              onClose={() => setIsUploadModalOpen(false)}
              onUpload={handleFileUpload}
              isUploading={isUploading}
            />

            {/* Search and Filter Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Search by product, vendor, or invoice number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/50 focus:border-primary dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  {activeFilters.length > 0 && (
                    <Button 
                      variant="ghost" 
                      className="h-12 px-6 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      onClick={resetFilters}
                    >
                      <X className="mr-2 h-5 w-5" />
                      Clear All Filters
                    </Button>
                  )}
                </div>

                {/* Horizontal Filter Bar */}
                <div className="w-full">
                  <div className="overflow-x-auto pb-2 custom-scrollbar">
                    <div className="flex space-x-2 min-w-max">
                      {/* Vendor Filter */}
                    <Popover>
                      <PopoverTrigger asChild>
                          <Button 
                            variant={filters.vendor !== 'all' ? "default" : "outline"} 
                            className={`h-10 whitespace-nowrap ${filters.vendor !== 'all' ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30' : 'border-gray-300 dark:border-gray-600'} rounded-full px-4`}
                          >
                            <Package size={16} className="mr-2" />
                            {filters.vendor !== 'all' ? filters.vendor : 'Vendor'}
                            <ChevronDown size={16} className="ml-2" />
                        </Button>
                      </PopoverTrigger>
                        <PopoverContent className="w-60 p-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Select Vendor</h4>
                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
                              <div 
                                className={`px-3 py-2 rounded-lg cursor-pointer ${filters.vendor === 'all' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                onClick={() => setFilters(prev => ({ ...prev, vendor: 'all' }))}
                              >
                                All Vendors
                              </div>
                                  {getUniqueVendors().map((vendor) => (
                                <div 
                                  key={vendor} 
                                  className={`px-3 py-2 rounded-lg cursor-pointer ${filters.vendor === vendor ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                  onClick={() => setFilters(prev => ({ ...prev, vendor: vendor }))}
                                >
                                  {vendor}
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Product Name Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant={filters.productName ? "default" : "outline"} 
                            className={`h-10 whitespace-nowrap ${filters.productName ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30' : 'border-gray-300 dark:border-gray-600'} rounded-full px-4`}
                          >
                            <Smartphone size={16} className="mr-2" />
                            {filters.productName ? `Product: ${filters.productName.slice(0, 15)}${filters.productName.length > 15 ? '...' : ''}` : 'Product Name'}
                            <ChevronDown size={16} className="ml-2" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Filter by Product Name</h4>
                              <Input
                              placeholder="Enter product name..."
                                value={filters.productName}
                                onChange={(e) => setFilters(prev => ({ ...prev, productName: e.target.value }))}
                              className="h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                            />
                            {filters.productName && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="w-full mt-2 text-gray-600 dark:text-gray-400"
                                onClick={() => setFilters(prev => ({ ...prev, productName: '' }))}
                              >
                                <X size={14} className="mr-1" />
                                Clear
                              </Button>
                            )}
                            </div>
                        </PopoverContent>
                      </Popover>

                      {/* Invoice Number Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant={filters.invoiceNumber ? "default" : "outline"} 
                            className={`h-10 whitespace-nowrap ${filters.invoiceNumber ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30' : 'border-gray-300 dark:border-gray-600'} rounded-full px-4`}
                          >
                            <Hash size={16} className="mr-2" />
                            {filters.invoiceNumber ? `Invoice: ${filters.invoiceNumber.slice(0, 10)}${filters.invoiceNumber.length > 10 ? '...' : ''}` : 'Invoice #'}
                            <ChevronDown size={16} className="ml-2" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Filter by Invoice Number</h4>
                              <Input
                              placeholder="Enter invoice number..."
                                value={filters.invoiceNumber}
                                onChange={(e) => setFilters(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                              className="h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                            />
                            {filters.invoiceNumber && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="w-full mt-2 text-gray-600 dark:text-gray-400"
                                onClick={() => setFilters(prev => ({ ...prev, invoiceNumber: '' }))}
                              >
                                <X size={14} className="mr-1" />
                                Clear
                              </Button>
                            )}
                            </div>
                        </PopoverContent>
                      </Popover>

                      {/* Date Range Filter */}
                                <Popover>
                                  <PopoverTrigger asChild>
                          <Button 
                            variant={(filters.dateFrom || filters.dateTo) ? "default" : "outline"} 
                            className={`h-10 whitespace-nowrap ${(filters.dateFrom || filters.dateTo) ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30' : 'border-gray-300 dark:border-gray-600'} rounded-full px-4`}
                          >
                            <CalendarDays size={16} className="mr-2" />
                            {filters.dateFrom && filters.dateTo 
                              ? `${format(filters.dateFrom, "MMM d")} - ${format(filters.dateTo, "MMM d, yy")}`
                              : filters.dateFrom 
                                ? `From ${format(filters.dateFrom, "MMM d")}`
                                : filters.dateTo
                                  ? `Until ${format(filters.dateTo, "MMM d")}`
                                  : 'Date Range'}
                            <ChevronDown size={16} className="ml-2" />
                                    </Button>
                                  </PopoverTrigger>
                        <PopoverContent className="w-auto p-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Select Date Range</h4>
                            <div className="flex flex-col gap-3">
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">From</span>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      className="w-full justify-start text-left font-normal h-9 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                      {filters.dateFrom ? format(filters.dateFrom, "MMM d, y") : "Select start date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0 border border-gray-200 dark:border-gray-700 rounded-lg" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={filters.dateFrom}
                                      onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                                      initialFocus
                                      className="rounded-lg"
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">To</span>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      className="w-full justify-start text-left font-normal h-9 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                      {filters.dateTo ? format(filters.dateTo, "MMM d, y") : "Select end date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0 border border-gray-200 dark:border-gray-700 rounded-lg" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={filters.dateTo}
                                      onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                                      initialFocus
                                      className="rounded-lg"
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                            {(filters.dateFrom || filters.dateTo) && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="w-full mt-2 text-gray-600 dark:text-gray-400"
                                onClick={() => setFilters(prev => ({ ...prev, dateFrom: undefined, dateTo: undefined }))}
                              >
                                <X size={14} className="mr-1" />
                                Clear Dates
                              </Button>
                            )}
                            </div>
                        </PopoverContent>
                      </Popover>

                      {/* Warranty Status Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                            <Button 
                            variant={filters.warrantyStatus !== 'all' ? "default" : "outline"} 
                            className={`h-10 whitespace-nowrap ${filters.warrantyStatus !== 'all' ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30' : 'border-gray-300 dark:border-gray-600'} rounded-full px-4`}
                            >
                            <Shield size={16} className="mr-2" />
                            {filters.warrantyStatus !== 'all' ? (filters.warrantyStatus === 'active' ? 'Active Warranty' : 'Expired Warranty') : 'Warranty Status'}
                            <ChevronDown size={16} className="ml-2" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-52 p-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Warranty Status</h4>
                            <div className="space-y-1">
                              <div 
                                className={`px-3 py-2 rounded-lg cursor-pointer flex items-center ${filters.warrantyStatus === 'all' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                onClick={() => setFilters(prev => ({ ...prev, warrantyStatus: 'all' }))}
                              >
                                <Shield size={16} className="mr-2 opacity-70" />
                                <span>All</span>
                              </div>
                              <div 
                                className={`px-3 py-2 rounded-lg cursor-pointer flex items-center ${filters.warrantyStatus === 'active' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                onClick={() => setFilters(prev => ({ ...prev, warrantyStatus: 'active' }))}
                              >
                                <CheckCircle size={16} className="mr-2 text-green-500" />
                                <span>Active</span>
                              </div>
                              <div 
                                className={`px-3 py-2 rounded-lg cursor-pointer flex items-center ${filters.warrantyStatus === 'expired' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                onClick={() => setFilters(prev => ({ ...prev, warrantyStatus: 'expired' }))}
                              >
                                <XCircle size={16} className="mr-2 text-red-500" />
                                <span>Expired</span>
                              </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                      {/* Reset Button */}
                      <Button 
                        variant="ghost" 
                        className="h-10 whitespace-nowrap border border-gray-300 dark:border-gray-600 rounded-full px-4 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={resetFilters}
                      >
                        <RotateCcw size={16} className="mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                <AnimatePresence>
                {activeFilters.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap items-center gap-3 pt-2"
                    >
                    <span className="text-sm text-gray-500 dark:text-gray-400">Active Filters:</span>
                    {activeFilters.map((filter) => (
                        <motion.div
                        key={filter}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                        variant="secondary"
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        {filter}
                        <button
                          onClick={() => removeFilter(filter)}
                              className="ml-1 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </Badge>
                        </motion.div>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Table Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-800">
                {isLoading ? (
                  <div className="p-12 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-6"
                    ></motion.div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your invoices...</p>
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="p-12 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="bg-primary/10 dark:bg-primary/20 rounded-full p-6 mx-auto mb-6 w-24 h-24 flex items-center justify-center"
                    >
                      <FileText size={40} className="text-primary mx-auto" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {searchTerm || filters.vendor !== 'all' ? 'No matching invoices found' : 'No Invoices Yet'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      {searchTerm || filters.vendor !== 'all' 
                        ? "Try adjusting your search or filters to find what you're looking for"
                        : 'Upload your first invoice to start organizing your bills and receipts in one secure place'}
                    </p>
                    {!searchTerm && filters.vendor === 'all' && (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button 
                          onClick={() => setIsUploadModalOpen(true)}
                          className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 py-5 font-medium shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                        >
                        <Upload size={20} className="mr-2" />
                          Upload Your First Invoice
                      </Button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                  <Table>
                      <TableHeader className="bg-gray-50 dark:bg-gray-900">
                        <TableRow className="border-b border-gray-200 dark:border-gray-700">
                          <TableHead className="py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Product</TableHead>
                          <TableHead className="py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Vendor</TableHead>
                          <TableHead className="py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Invoice #</TableHead>
                          <TableHead className="py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Date</TableHead>
                          <TableHead className="py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Time</TableHead>
                          <TableHead className="py-4 text-sm font-medium text-gray-700 dark:text-gray-300">IMEI/SKU</TableHead>
                          <TableHead className="py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Warranty</TableHead>
                          <TableHead className="py-4 text-sm font-medium text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                          {filteredInvoices.map((invoice, index) => {
                            const warrantyInfo = getWarrantyStatus(invoice.warrantyEndDate);
                            return (
                              <motion.tr
                                key={invoice._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="border-b border-gray-200 dark:border-gray-700 group transition-all duration-200"
                              >
                                <TableCell className="py-4 font-medium text-gray-900 dark:text-white group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors duration-200 first:rounded-l-lg">
                            <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 h-10 w-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-200 shadow-sm group-hover:shadow">
                                      <Package size={20} className="text-primary" />
                                    </div>
                                    <span className="font-medium">{invoice.productName || '-'}</span>
                            </div>
                          </TableCell>
                                <TableCell className="py-4 text-gray-700 dark:text-gray-300 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors duration-200">
                                  {invoice.vendorName || '-'}
                                </TableCell>
                                <TableCell className="py-4 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors duration-200">
                            <div className="flex items-center space-x-2">
                                    <div className="flex-shrink-0 h-6 w-6 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-all duration-200 shadow-sm group-hover:shadow">
                                      <Hash size={14} className="text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{invoice.invoiceNumber || '-'}</span>
                            </div>
                          </TableCell>
                                <TableCell className="py-4 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors duration-200">
                            <div className="flex items-center space-x-2">
                                    <div className="flex-shrink-0 h-6 w-6 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-all duration-200 shadow-sm group-hover:shadow">
                                      <CalendarIcon size={14} className="text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{formatDate(invoice.date)}</span>
                            </div>
                          </TableCell>
                                <TableCell className="py-4 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors duration-200">
                            <div className="flex items-center space-x-2">
                                    <div className="flex-shrink-0 h-6 w-6 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-all duration-200 shadow-sm group-hover:shadow">
                                      <Clock size={14} className="text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{invoice.time || '-'}</span>
                            </div>
                          </TableCell>
                                <TableCell className="py-4 text-gray-700 dark:text-gray-300 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors duration-200">
                                  {invoice.imeiSku || '-'}
                                </TableCell>
                                <TableCell className="py-4 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors duration-200">
                                  {warrantyInfo.status !== 'none' && (
                                    <div className="flex items-center">
                                      {warrantyInfo.status === 'active' ? (
                                        <div className="mr-2 p-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        </div>
                                      ) : (
                                        <div className="mr-2 p-1 bg-red-100 dark:bg-red-900/20 rounded-full">
                                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                        </div>
                                      )}
                                      <span className={warrantyInfo.color}>{warrantyInfo.label}</span>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="py-4 text-right group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors duration-200 last:rounded-r-lg">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-block"
                                  >
                            <Button 
                                      variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(invoice._id)}
                                      className="bg-white dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20 border border-gray-300 dark:border-gray-600 text-primary hover:text-primary dark:text-primary dark:hover:text-primary rounded-lg transition-all duration-200 opacity-90 group-hover:opacity-100 group-hover:border-primary/50 dark:group-hover:border-primary/50 shadow-sm hover:shadow group-hover:shadow"
                            >
                              <Download size={16} className="mr-2" />
                              Download
                            </Button>
                                  </motion.div>
                          </TableCell>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                    </TableBody>
                  </Table>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
};

export default InvoicesPage; 