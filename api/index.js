import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

// Ensure uploads directories exist with proper permissions
const uploadsDir = path.join(process.cwd(), 'uploads', 'listings');
const listingsDir = path.join(process.cwd(), 'uploads/listings');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
}
if (!fs.existsSync(listingsDir)) {
  fs.mkdirSync(listingsDir, { recursive: true, mode: 0o755 });
}

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files statically - ensure both paths work
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/uploads/listings', express.static(path.join(process.cwd(), 'uploads', 'listings')));

// Test route to check if static files are working
app.get('/api/test-image', (req, res) => {
  const testImagePath = path.join(process.cwd(), 'uploads/listings/test-image.jpg');
  
  if (fs.existsSync(testImagePath)) {
    res.json({ 
      exists: true, 
      message: 'File exists on server',
      path: testImagePath
    });
  } else {
    res.json({ 
      exists: false, 
      message: 'File does not exist on server',
      path: testImagePath
    });
  }
});
// Debug: List uploads directory contents
app.get('/api/debug-uploads', (req, res) => {
  const uploadsPath = path.join(process.cwd(), 'uploads');
  
  try {
    const items = fs.readdirSync(uploadsPath, { withFileTypes: true });
    const structure = items.map(item => ({
      name: item.name,
      isDirectory: item.isDirectory(),
      path: path.join(uploadsPath, item.name)
    }));
    
    res.json({ uploadsPath, structure });
  } catch (error) {
    res.json({ error: error.message, uploadsPath });
  }
});
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000!');
  console.log('Static files served from:', uploadsDir);
});