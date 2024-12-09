const User = require("../models/User");
const logger = require("../utils/logger");

// @desc    Get user profile by ID
// @route   GET /api/users/:userId
// @access  Private
const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password").populate("followers following", "username profilePicture");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user profile
// @route   PATCH /api/users/:userId
// @access  Private
const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, email, bio, profilePicture } = req.body;

  try {
    if (userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, bio, profilePicture },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Follow another user
// @route   POST /api/users/:userId/follow
// @access  Private
const followUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToFollow.followers.includes(req.user.id)) {
      return res.status(400).json({ message: "You are already following this user" });
    }

    userToFollow.followers.push(req.user.id);
    currentUser.following.push(userId);

    await userToFollow.save();
    await currentUser.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Unfollow a user
// @route   POST /api/users/:userId/unfollow
// @access  Private
const unfollowUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const userToUnfollow = await User.findById(userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userToUnfollow.followers.includes(req.user.id)) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (followerId) => followerId.toString() !== req.user.id
    );
    currentUser.following = currentUser.following.filter(
      (followingId) => followingId.toString() !== userId
    );

    await userToUnfollow.save();
    await currentUser.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/:userId
// @access  Private
const deleteUserAccount = async (req, res) => {
  const { userId } = req.params;

  try {
    if (userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this account" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  deleteUserAccount,
};
