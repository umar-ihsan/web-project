import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import './Chat.css';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { fetchData, error, isLoading } = useApi();

  useEffect(() => {
    fetchData('/chats').then(setChats);
  }, [fetchData]);

  useEffect(() => {
    if (selectedChat) {
      fetchData(`/chats/${selectedChat}/messages`).then(setMessages);
    }
  }, [fetchData, selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedChat || !newMessage.trim()) return;

    try {
      const message = await fetchData(`/chats/${selectedChat}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chat-container">
      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${selectedChat === chat.id ? 'selected' : ''}`}
            onClick={() => setSelectedChat(chat.id)}
          >
            <h3>{chat.name}</h3>
            <p>{chat.lastMessage}</p>
          </div>
        ))}
      </div>
      {selectedChat && (
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className="message">
              <strong>{message.sender}: </strong>
              {message.content}
            </div>
          ))}
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;

