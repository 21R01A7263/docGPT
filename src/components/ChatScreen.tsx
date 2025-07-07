
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import { SendIcon, AiIcon } from './icons';
import ChatMessage from './ChatMessage';

interface ChatScreenProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => Promise<void>;
  isModelTyping: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ messages, onSendMessage, isModelTyping }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isModelTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isModelTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isModelTyping && (
           <div className="py-6 px-4 md:px-8 flex items-start gap-4 border-b border-border-subtle">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-ai-icon-bg flex items-center justify-center">
                  <AiIcon className="w-6 h-6 text-ai-icon-fg" />
              </div>
              <div className="flex-1 pt-2 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-secondary-text rounded-full animate-pulse"></div>
                  <div className="w-2.5 h-2.5 bg-secondary-text rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2.5 h-2.5 bg-secondary-text rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <footer className="p-4 bg-chat-bg">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your document..."
            disabled={isModelTyping}
            className="flex-1 p-3 bg-white border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary-text disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={ isModelTyping}
            className="p-2 bg-accent text-black rounded-full hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-8 h-8 pl-1" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatScreen;