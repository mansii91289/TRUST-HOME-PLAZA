
import express from 'express';
import { 
  deleteUser, 
  test, 
  updateUser,  
  getUserListings, 
  getUser,
  uploadAvatar
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large (max 2MB)'
        });
      }
      if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({
          success: false,
          message: 'Only image files are allowed'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }
    next();
  });
}, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id', getUser);

export default router;
