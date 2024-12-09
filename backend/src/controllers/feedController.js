const Post = require("../models/Post");
const User = require("../models/User");
const logger = require("../utils/logger");
// @desc    Get posts for the user's feed
// @route   GET /api/feed
// @access  Private
const getFeed = async (req, res) => {
  try {
    // Find the users the logged-in user is following
    const user = await User.findById(req.user.id).select("following");

    // Get posts from the user's own and their following's accounts
    const posts = await Post.find({
      user: { $in: [...user.following, req.user.id] },
    })
      .populate("user", "username profilePicture")
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 }); // Sort by newest posts first

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Like or unlike a post
// @route   PATCH /api/feed/:postId/like
// @access  Private
const toggleLikePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user already liked the post
    const hasLiked = post.likes.includes(req.user.id);

    if (hasLiked) {
      // Unlike the post
      post.likes = post.likes.filter((like) => like.toString() !== req.user.id);
    } else {
      // Like the post
      post.likes.push(req.user.id);
    }

    await post.save();
    res.status(200).json({ message: hasLiked ? "Post unliked" : "Post liked", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/feed/:postId/comment
// @access  Private
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add the comment
    const newComment = {
      user: req.user.id,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    const populatedPost = await Post.findById(postId)
      .populate("comments.user", "username profilePicture");

    res.status(201).json({ message: "Comment added", post: populatedPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a comment from a post
// @route   DELETE /api/feed/:postId/comment/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment and ensure the logged-in user is the author
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId && comment.user.toString() === req.user.id
    );

    if (commentIndex === -1) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    post.comments.splice(commentIndex, 1); // Remove the comment
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/feed
// @access  Private
const createPost = async (req, res) => {
  const { caption, image } = req.body;

  try {
    const newPost = new Post({
      user: req.user.id,
      caption,
      image,
    });

    const savedPost = await newPost.save();
    const populatedPost = await Post.findById(savedPost._id).populate("user", "username profilePicture");

    res.status(201).json({ message: "Post created successfully", post: populatedPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/feed/:postId
// @access  Private
const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getFeed,
  toggleLikePost,
  addComment,
  deleteComment,
  createPost,
  deletePost,
};
