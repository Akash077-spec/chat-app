import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ChatList({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // Prevent fetch if user is not authenticated

    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chat', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }

        const data = await response.json();
        setChats(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching chats:', err);
      }
    };

    fetchChats();
  }, [user]); // Add user to dependency array to refetch if user changes

  if (error) {
    return <div className="w-1/4 border-r p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-1/4 border-r p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      {chats.length === 0 ? (
        <p className="text-gray-500">No chats available</p>
      ) : (
        chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat._id)}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            <p>
              {chat.isGroupChat
                ? chat.name
                : chat.participants?.find((p) => p._id !== user?._id)?.username || 'Unknown User'}
            </p>
            <p className="text-sm text-gray-500">
              {chat.lastMessage?.content || 'No messages yet'}
            </p>
          </div>
        ))
      )}
    </div>
  );
}