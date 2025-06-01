import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRooms',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Messages', MessageSchema);
