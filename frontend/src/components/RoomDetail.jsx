import React, { useState } from 'react';
import '../RoomDetail.css'; // Your CSS file for styling
import WebPlayback from './WebPlayback';

const RoomDetail = () => {
  const [messages, setMessages] = useState([]); // Placeholder for chat messages
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      const timestamp = new Date().toISOString();
      setMessages([...messages, { text: newMessage, timestamp }]);
      setNewMessage(''); // Reset input field
    }
  };

  return (
    <div className="room-detail-container">
      <div className="room-header">
        {/* Room Header Content */}
        <h1>Room Name</h1>
        {/* Other controls */}
        <div className="music-player">
        <div>
          <WebPlayback token={ window.localStorage.getItem('access_token') } />
        </div>
      </div>
      </div>
      <div className="chat-box">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <span>{message.text}</span>
              <span className="timestamp">{message.timestamp}</span>
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
