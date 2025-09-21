
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import path from 'path';
import fs from 'fs';

export const createListing = async (req, res, next) => {
  try {
    const listingData = { ...req.body };
    
    // Parse imageUrls if it's a string (from form data)
    if (typeof listingData.imageUrls === 'string') {
      try {
        listingData.imageUrls = JSON.parse(listingData.imageUrls);
      } catch (parseError) {
        listingData.imageUrls = [];
      }
    }
    
    // Ensure imageUrls is an array
    if (!Array.isArray(listingData.imageUrls)) {
      listingData.imageUrls = [];
    }
    
    const listing = await Listing.create(listingData);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    // Delete associated image files
    if (listing.imageUrls && listing.imageUrls.length > 0) {
      listing.imageUrls.forEach(imageUrl => {
        if (imageUrl.startsWith('/uploads/listings/')) {
          const imagePath = path.join(process.cwd(), imageUrl);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const uploadListingImages = async (req, res, next) => {
  try {
    console.log('Upload request received');
    console.log('Files:', req.files);
    
    if (!req.files || req.files.length === 0) {
      console.log('No files received');
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const imageUrls = req.files.map(file => {
      console.log('Processing file:', file.filename);
      // Ensure correct path: /uploads/listings/ (with 's')
      return `/uploads/listings/${file.filename}`;
    });
    
    console.log('Returning image URLs:', imageUrls);
    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error('Upload error:', error);
    next(errorHandler(500, 'Image upload failed'));
  }
};

export const deleteListingImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    
    // Remove image from filesystem
    if (imageUrl.startsWith('/uploads/listings/')) {
      const imagePath = path.join(process.cwd(), imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};