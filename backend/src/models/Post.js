const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String, trim: true, maxlength: 300 },
    image: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);


const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User receiving the notification
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User triggering the notification
    type: { 
      type: String, 
      enum: ["like", "comment", "follow", "mention"], 
      required: true 
    }, // Notification type
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // Relevant post (if applicable)
    isRead: { type: Boolean, default: false }, // Mark as read/unread
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);


const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true },
    caption: { type: String, trim: true, maxlength: 100 },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who have viewed the story
    expiresAt: { type: Date, required: true }, // Automatically delete after a certain time
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);


const mongoose = require("mongoose");

const savedPostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedPost", savedPostSchema);
