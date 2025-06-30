import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000'); // Adjust if needed

export default function DealChat({ dealId, userId, username }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join the deal room
    socket.emit('joinDeal', dealId);

    // Fetch existing messages
    axios.get(`http://localhost:5000/api/messages/${dealId}`)
      .then(res => setMessages(res.data));

    // Listen for new messages
    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [dealId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const message = {
      deal: dealId,
      sender: userId,
      text
    };
    // Save to DB
    const res = await axios.post('http://localhost:5000/api/messages', message);
    // Emit to room
    socket.emit('sendMessage', { dealId, message: { ...res.data, sender: { _id: userId, username } } });
    setText('');
  };

  return (
    <div className="border rounded p-2 h-64 flex flex-col bg-white mt-4">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-1 ${msg.sender._id === userId ? 'text-right' : 'text-left'}`}>
            <span className="font-bold">{msg.sender.username}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="ml-2 px-4 py-1 bg-blue-600 text-white rounded" type="submit">Send</button>
      </form>
    </div>
  );
} 