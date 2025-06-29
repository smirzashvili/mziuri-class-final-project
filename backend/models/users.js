import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  favoriteGenre: {
    type: String,
    required: true
  },
  favoriteInstrument: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  bio: {
    type: String,
  },
  avatarIndex: {
    type: Number
  },
  likedUsers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users' 
  }],
  dislikedUsers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users' 
  }],
  matches: [{ type: 
    mongoose.Schema.Types.ObjectId, 
    ref: 'Users' 
  }],
  isGuest: {
    type: Boolean
  },
  isBot: {
    type: Boolean
  },
  isTest: {
    type: Boolean
  },
  media: [{ 
    type: String, 
  }],
}, { timestamps: true });

export default mongoose.model("Users", UsersSchema);