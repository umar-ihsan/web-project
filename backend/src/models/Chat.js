const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, trim: true, required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who have read the message
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);


const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    isGroupChat: { type: Boolean, default: false },
    groupName: { type: String, trim: true }, // Only relevant for group chats
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Reference to the most recent message
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);



const mongoose = require("mongoose");

const followRequestSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who sent the request
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User receiving the request
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FollowRequest", followRequestSchema);
