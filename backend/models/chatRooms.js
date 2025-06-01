import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
   participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
  ],
}, { timestamps: true });

export default mongoose.model('ChatRooms', ChatRoomSchema);
