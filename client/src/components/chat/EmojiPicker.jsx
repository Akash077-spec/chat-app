import { useState } from 'react';
import Picker from 'emoji-picker-react';
import { FaSmile } from 'react-icons/fa';

export default function EmojiPicker({ onEmojiSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    onEmojiSelect(emojiObject.emoji); // Pass selected emoji to parent component
    setIsOpen(false); // Close picker after selection
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Toggle emoji picker"
      >
        <FaSmile size={24} />
      </button>
      {isOpen && (
        <div className="absolute bottom-12 left-0 z-10">
          <Picker
            onEmojiClick={handleEmojiClick}
            theme="auto"
            width={300}
            height={400}
            className="shadow-lg border rounded"
          />
        </div>
      )}
    </div>
  );
}