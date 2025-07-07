
import React, { useState, useCallback } from 'react';
import type { ChatMessage } from './types';
import { AppState } from './types';
import { parseDocument } from './services/docParser';
import { getChatResponse } from './services/geminiService';
import UploadScreen from './components/UploadScreen';
import ChatScreen from './components/ChatScreen';
import { ErrorIcon } from './components/icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [documentText, setDocumentText] = useState<string | null>(null);
  // const [fileName, setFileName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isModelTyping, setIsModelTyping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewChat = useCallback(() => {
    setAppState(AppState.UPLOAD);
    setDocumentText(null);
    // setFileName(null);
    setMessages([]);
    setError(null);
    setIsModelTyping(false);
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setError(null);
    setAppState(AppState.PARSING);
    try {
      const text = await parseDocument(file);
      setDocumentText(text);
      // setFileName(file.name);
      setMessages([
        {
          role: 'model',
          content: `Document "${file.name}" loaded successfully.`,
        },
      ]);
      setAppState(AppState.CHATTING);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during parsing.';
      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!documentText) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: message }];
    setMessages(newMessages);
    setIsModelTyping(true);
    setError(null);

    try {
      const response = await getChatResponse(documentText, message);
      setMessages([...newMessages, { role: 'model', content: response }]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred communicating with the AI.';
      setError(errorMessage);
       setMessages([...newMessages, { role: 'model', content: `Sorry, I encountered an error: ${errorMessage}` }]);
    } finally {
      setIsModelTyping(false);
    }
  }, [documentText, messages]);

  const renderContent = () => {
    switch (appState) {
      case AppState.UPLOAD:
      case AppState.PARSING:
        return <UploadScreen onFileUpload={handleFileUpload} isParsing={appState === AppState.PARSING} />;
      case AppState.CHATTING:
        return (
          <ChatScreen
            messages={messages}
            onSendMessage={handleSendMessage}
            isModelTyping={isModelTyping}
          />
        );
      case AppState.ERROR:
        return (
          <div className="flex flex-col items-center justify-center h-full text-primary-text">
            <ErrorIcon className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
            <p className="text-secondary-text mb-6 text-center max-w-md">{error}</p>
            <button
              onClick={handleNewChat}
              className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-opacity-80 transition-colors"
            >
              Start Over
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-page-bg min-h-screen font-sans text-primary-text flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-4xl h-[90vh] bg-chat-bg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;