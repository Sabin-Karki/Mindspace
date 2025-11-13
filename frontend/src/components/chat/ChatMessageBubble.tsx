import React from 'react';
import type { IChatMessage } from '../../types';

interface ChatMessageBubbleProps {
  message: IChatMessage;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = true;

  // Tailwind classes for user/assistant messages
  const bubbleClasses = isUser
    ? 'bg-indigo-500 text-white rounded-br-none self-end'
    : 'bg-gray-200 text-gray-800 rounded-tl-none self-start';
  
  const containerClasses = isUser ? 'justify-end' : 'justify-start';
  const roleText = isUser ? 'You' : 'Assistant';

  return (
    <div className={`flex w-full mt-2 space-x-3 ${containerClasses}`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
      )}
      
      <div className='max-w-[80%]'>
        <div className={`p-3 rounded-xl shadow-md ${bubbleClasses}`}>
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none pl-1">
          {roleText} • {new Date(message.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
          U
        </div>
      )}
    </div>
  );
};

export default ChatMessageBubble;