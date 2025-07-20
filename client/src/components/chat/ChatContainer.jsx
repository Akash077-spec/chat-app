import { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import EmojiPicker from './EmojiPicker';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';

export default function ChatContainer({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket && chatId) {
      socket.emit('join-chat', chatId);

      socket.on('message-received', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on('typing', ({ userId }) => {
        if (userId !== user._id) setIsTyping(true);
      });

      socket.on('stop-typing', () => setIsTyping(false));

      socket.on('message-status', ({ messageId, status }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, status } : msg
          )
        );
      });

      // Fetch initial messages
      fetch(`/api/chat/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => setMessages(data));
    }
  }, [socket, chatId, user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        chat: chatId,
        sender: user._id,
        content: newMessage,
      };
      socket.emit('new-message', message);
      setNewMessage('');
      socket.emit('stop-typing', { chatId, userId: user._id });
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { chatId, userId: user._id });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isOwn={message.sender === user._id}
          />
        ))}
        {isTyping && <div className="text-gray-500">Someone is typing...</div>}
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <EmojiPicker onEmojiSelect={(emoji) => setNewMessage((prev) => prev + emoji)} />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onBlur={() => socket.emit('stop-typing', { chatId, userId: user._id })}
            className="flex-1 p-2 border rounded"
            placeholder="Type a message..."
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}