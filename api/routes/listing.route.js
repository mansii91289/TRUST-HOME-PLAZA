
import express from 'express';
import { 
  createListing, 
  deleteListing, 
  updateListing, 
  getListing, 
  getListings,
  uploadListingImages,
  deleteListingImage
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads/listings');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
// Configure multer for file uploads - ensure correct directory name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'listings'); // Ensure 'listings' (plural)
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});
// Serve individual images with better error handling
router.get('/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(process.cwd(), 'uploads', 'listings', filename);
  
  console.log('Looking for image at:', imagePath);
  
  if (fs.existsSync(imagePath)) {
    // Set proper headers for images
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }
    
    res.sendFile(imagePath);
  } else {
    console.log('Image not found:', filename);
    res.status(404).json({ message: 'Image not found', filename, path: imagePath });
  }
});
// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large (max 5MB)' });
    }
  }
  next(err);
};

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

// Image upload routes
router.post('/upload-images', verifyToken, upload.array('images', 6), handleMulterError, uploadListingImages);
router.delete('/delete-image', verifyToken, deleteListingImage);

export default router;