const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const logger = require("../utils/logger");

// @desc    Create a new chat (private or group)
// @route   POST /api/chats
// @access  Private
const createChat = async (req, res) => {
  const { isGroupChat, participants, groupName } = req.body;

  try {
    // For private chats, ensure only 2 participants are provided
    if (!isGroupChat && participants.length !== 2) {
      return res.status(400).json({ message: "A private chat must have exactly 2 participants." });
    }

    // Check if a chat between the same participants already exists (for private chats)
    if (!isGroupChat) {
      const existingChat = await Chat.findOne({
        isGroupChat: false,
        participants: { $all: participants, $size: 2 },
      });
      if (existingChat) {
        return res.status(200).json({ message: "Chat already exists", chat: existingChat });
      }
    }

    // Create a new chat
    const newChat = new Chat({
      isGroupChat,
      participants,
      groupName: isGroupChat ? groupName : undefined,
    });

    const savedChat = await newChat.save();
    res.status(201).json({ message: "Chat created successfully", chat: savedChat });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "username profilePicture")
      .populate("latestMessage");

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Send a message in a chat
// @route   POST /api/chats/:chatId/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  try {
    // Create the new message
    const newMessage = new Message({
      chat: chatId,
      sender: req.user.id,
      content,
    });

    const savedMessage = await newMessage.save();

    // Update the chat's latest message
    await Chat.findByIdAndUpdate(chatId, { latestMessage: savedMessage._id });

    res.status(201).json({ message: "Message sent successfully", messageData: savedMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all messages for a chat
// @route   GET /api/chats/:chatId/messages
// @access  Private
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username profilePicture")
      .sort({ createdAt: 1 }); // Sort messages by creation date (oldest first)

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update group chat name
// @route   PUT /api/chats/:chatId
// @access  Private
const updateGroupName = async (req, res) => {
  const { chatId } = req.params;
  const { groupName } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat || !chat.isGroupChat) {
      return res.status(404).json({ message: "Group chat not found." });
    }

    // Update the group name
    chat.groupName = groupName;
    const updatedChat = await chat.save();

    res.status(200).json({ message: "Group name updated successfully", chat: updatedChat });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add or remove participants in a group chat
// @route   PATCH /api/chats/:chatId/participants
// @access  Private
const updateParticipants = async (req, res) => {
  const { chatId } = req.params;
  const { participants } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat || !chat.isGroupChat) {
      return res.status(404).json({ message: "Group chat not found." });
    }

    // Update the participants
    chat.participants = participants;
    const updatedChat = await chat.save();

    res.status(200).json({ message: "Participants updated successfully", chat: updatedChat });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createChat,
  getUserChats,
  sendMessage,
  getMessages,
  updateGroupName,
  updateParticipants,
};
