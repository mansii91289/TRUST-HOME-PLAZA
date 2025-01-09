import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
    default: "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-1024.png"
  },
},
{ timestamps: true});

const User = mongoose.model('User',userSchema);

export default User; 