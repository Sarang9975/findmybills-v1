require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin:"*", // Allow requests from your frontend (adjust if deployed)
  credentials: true, // Allow cookies or auth headers if needed
}));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

 
const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
  res.send("Server is healthy")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 