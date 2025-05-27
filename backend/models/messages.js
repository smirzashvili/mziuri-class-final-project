import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: String,
  message: String
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
