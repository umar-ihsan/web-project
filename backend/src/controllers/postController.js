const Post = require("../models/Post");
const logger = require("../utils/logger");
// @desc    Get a single post by ID
// @route   GET /api/posts/:postId
// @access  Private
const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate("user", "username profilePicture")
      .populate("comments.user", "username profilePicture");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update the caption of a post
// @route   PATCH /api/posts/:postId
// @access  Private
const updateCaption = async (req, res) => {
  const { postId } = req.params;
  const { caption } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure only the owner of the post can update it
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this post" });
    }

    post.caption = caption || post.caption; // Update caption if provided
    const updatedPost = await post.save();

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:postId
// @access  Private
const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure only the owner of the post can delete it
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all posts by a specific user
// @route   GET /api/posts/user/:userId
// @access  Private
const getPostsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ user: userId })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getPostById,
  updateCaption,
  deletePost,
  getPostsByUser,
};
