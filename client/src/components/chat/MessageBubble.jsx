import { format } from 'date-fns';

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        <p>{message.content}</p>
        {message.media && (
          <img src={message.media} alt="media" className="max-w-full rounded" />
        )}
        <div className="text-xs text-gray-500 mt-1">
          {format(new Date(message.createdAt), 'p')}
          {isOwn && (
            <span className="ml-2">
              {message.status === 'seen' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}