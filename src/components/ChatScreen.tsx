
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import { SendIcon, NewChatIcon, FileIcon } from './icons';
import ChatMessage from './ChatMessage';

interface ChatScreenProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => Promise<void>;
  isModelTyping: boolean;
  onNewChat: () => void;
  fileName: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ messages, onSendMessage, isModelTyping, onNewChat, fileName }) => {
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
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b border-brand-accent/50">
        <div className="flex items-center gap-3">
            <FileIcon className="w-6 h-6 text-brand-light" />
            <h1 className="text-lg font-semibold truncate text-brand-text" title={fileName}>
                Chatting with: {fileName}
            </h1>
        </div>
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-brand-accent text-white font-semibold rounded-lg hover:bg-opacity-80 transition-colors"
          title="Start new chat"
        >
          <NewChatIcon className="w-5 h-5" />
          <span>New Chat</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isModelTyping && (
           <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand-accent flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
              <div className="bg-brand-accent/50 rounded-lg p-3 max-w-lg">
                  <p className="text-brand-light italic">Thinking...</p>
              </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <footer className="p-4 border-t border-brand-accent/50">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your document..."
            disabled={isModelTyping}
            className="flex-1 p-3 bg-brand-primary border border-brand-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light text-brand-text disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isModelTyping}
            className="p-3 bg-brand-accent text-white rounded-full hover:bg-opacity-80 transition-colors disabled:bg-brand-accent/50 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatScreen;
