
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import { UserIcon, AiIcon } from './icons';

const renderInline = (text: string) => {
  // Use regex to split by **...** to correctly handle bolding
  const parts = text.split(/(\*\*.*?\*\*)/g).filter(part => part);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// Renders markdown content including headings, paragraphs, and lists
const renderMarkdown = (text: string) => {
  // Normalize line endings and split into blocks by one or more empty lines
  const blocks = text.replace(/\r\n/g, '\n').split(/\n\s*\n/);

  return blocks.map((block, index) => {
    const trimmedBlock = block.trim();
    if (trimmedBlock.length === 0) return null;

    if (trimmedBlock.startsWith('# ')) {
      return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{renderInline(trimmedBlock.substring(2))}</h1>;
    }
    if (trimmedBlock.startsWith('## ')) {
      return <h2 key={index} className="text-xl font-bold mt-3 mb-2">{renderInline(trimmedBlock.substring(3))}</h2>;
    }
    if (trimmedBlock.startsWith('### ')) {
      return <h3 key={index} className="text-lg font-semibold mt-3 mb-2">{renderInline(trimmedBlock.substring(4))}</h3>;
    }
    
    // Check for lists (both ordered and unordered)
    const lines = trimmedBlock.split('\n');
    const isUnorderedList = lines.every(line => line.trim().startsWith('* ') || line.trim().startsWith('- '));
    const isOrderedList = lines.every(line => /^\d+\.\s/.test(line.trim()));

    if (isUnorderedList) {
      const listItems = lines.map((item, i) => (
        <li key={i} className="mb-1">{renderInline(item.trim().substring(2))}</li>
      ));
      return <ul key={index} className="list-disc list-outside pl-5 my-2 space-y-1">{listItems}</ul>;
    }
    
    if (isOrderedList) {
      const listItems = lines.map((item, i) => (
        <li key={i} className="mb-1">{renderInline(item.trim().replace(/^\d+\.\s/, ''))}</li>
      ));
      return <ol key={index} className="list-decimal list-outside pl-5 my-2 space-y-1">{listItems}</ol>;
    }
    
    // Make paragraphs that are only bold stand out, like titles
    if (trimmedBlock.startsWith('**') && trimmedBlock.endsWith('**') && !trimmedBlock.slice(2,-2).includes('**')) {
        return <p key={index} className="font-semibold text-primary-text my-2">{renderInline(trimmedBlock)}</p>
    }

    return (
      <p key={index} className="text-primary-text my-2">
        {renderInline(trimmedBlock)}
      </p>
    );
  });
};

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const icon = isUser 
    ? <UserIcon className="w-6 h-6 text-user-icon-fg" /> 
    : <AiIcon className="w-6 h-6 text-ai-icon-fg" />;
  
  const iconBg = isUser ? 'bg-user-icon-bg' : 'bg-ai-icon-bg';

  return (
    <div className="py-6 px-4 md:px-8 flex items-start gap-4 border-b border-border-subtle">
      <div className={`w-10 h-10 flex-shrink-0 rounded-full ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="flex-1 pt-1 min-w-0">
        {isUser ? (
          <div className="text-primary-text text-base font-medium">{message.content}</div>
        ) : (
          <div className="text-primary-text text-base leading-relaxed space-y-4">{renderMarkdown(message.content)}</div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;