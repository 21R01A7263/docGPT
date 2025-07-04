
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import { UserIcon, AiIcon } from './icons';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const messageAlignment = isUser ? 'justify-end' : 'justify-start';
  const bubbleColor = isUser ? 'bg-blue-600' : 'bg-brand-accent';
  const icon = isUser ? <UserIcon className="w-5 h-5" /> : <AiIcon className="w-5 h-5" />;
  const iconBg = isUser ? 'bg-blue-500' : 'bg-brand-light/50';

  const renderModelMessage = () => {
    // Split the content by the bold delimiter.
    // e.g., "Hello **world**!" becomes ["Hello ", "world", "!"]
    const parts = message.content.split('**');

    return parts.map((part, index) => {
      // Every odd-indexed part is the one that was inside the asterisks.
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      // Even-indexed parts are plain text. Using a span to provide a key.
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex items-start gap-3 ${messageAlignment}`}>
      {!isUser && (
        <div className={`w-8 h-8 flex-shrink-0 rounded-full ${iconBg} flex items-center justify-center text-white`}>
          {icon}
        </div>
      )}
      <div className={`${bubbleColor} rounded-lg p-3 max-w-xl`}>
        <p className="text-white whitespace-pre-wrap">
          {isUser ? message.content : renderModelMessage()}
        </p>
      </div>
      {isUser && (
        <div className={`w-8 h-8 flex-shrink-0 rounded-full ${iconBg} flex items-center justify-center text-white`}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
