const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');
const { analyzeInvoice } = require('../services/formRecognizerService');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and image files are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @route   POST api/invoices
// @desc    Create an invoice
// @access  Private
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File uploaded:', req.file);
    console.log('User ID:', req.user.id);

    let {
      vendorName = '',
      productName = '',
      invoiceNumber = '',
      date = '',
      time = '',
      imeiSku = '',
      warrantyEndDate = '',
    } = req.body;

    try {
      // Process the uploaded file with Azure Form Recognizer
      console.log('Starting Azure Form Recognizer processing');
      const extractedFields = await analyzeInvoice(req.file.path);
      console.log('Form Recognizer processing completed:', extractedFields);

      // Use extracted fields as fallback if manual input is not provided
      vendorName = vendorName || extractedFields.vendorName || '';
      productName = productName || extractedFields.productName || '';
      invoiceNumber = invoiceNumber || extractedFields.invoiceNumber || '';
      date = date || extractedFields.date || '';
      time = time || extractedFields.time || '';
      imeiSku = imeiSku || extractedFields.imeiSku || '';
      warrantyEndDate = warrantyEndDate || extractedFields.warrantyEndDate || '';

      const newInvoice = new Invoice({
        userId: req.user.id,
        vendorName,
        productName,
        invoiceNumber,
        date,
        time,
        imeiSku,
        warrantyEndDate,
        fileUrl: req.file.path,
      });

      const invoice = await newInvoice.save();
      console.log('Invoice saved successfully:', invoice._id);
      
      // Return both the saved invoice and the extracted fields
      res.json({
        invoice,
        extractedFields,
        message: 'Invoice saved successfully'
      });
    } catch (error) {
      console.error('Error processing invoice:', error);
      // Clean up uploaded file if there's an error
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error uploading invoice:', error);
    res.status(500).json({ 
      message: 'Server error while uploading invoice',
      error: error.message 
    });
  }
});

// @route   GET api/invoices
// @desc    Get all invoices for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching invoices for user:', req.user.id);
    const invoices = await Invoice.find({ userId: req.user.id }).sort({ createdAt: -1 });
    console.log('Found invoices:', invoices.length);
    res.json({ data: invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Server error while fetching invoices' });
  }
});

// @route   GET api/invoices/:id
// @desc    Get invoice by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }

    if (invoice.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/invoices/:id
// @desc    Delete an invoice
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }

    if (invoice.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Delete the file
    fs.unlinkSync(invoice.fileUrl);

    await invoice.remove();
    res.json({ msg: 'Invoice removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/invoices/:id/download
// @desc    Download invoice file
// @access  Private
router.get('/:id/download', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }

    if (invoice.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.download(invoice.fileUrl);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 