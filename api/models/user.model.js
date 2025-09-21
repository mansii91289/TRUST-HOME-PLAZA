import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar:{
      type: String,
      default: "https://png.pngtree.com/png-clipart/20221228/original/pngtree-girl-profile-picture-avatar-for-character-design-at-social-media-platforms-png-image_8817785.png"
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;