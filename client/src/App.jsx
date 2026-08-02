import { useState, useCallback } from 'react';
import NamePrompt from './components/NamePrompt';
import ChatWindow from './components/ChatWindow';
import {
  sendMessage,
  getHistory,
  deleteAllMessagesByUserId,
} from './api/chatApi';

function App() {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');

  // Load chat history when user starts a session
  const loadHistory = useCallback(async (name) => {
    try {
      const history = await getHistory(name);
      setMessages(history);

      // Capture the user ID from the first message if available
      if (history.length > 0 && history[0].userId) {
        setUserId(history[0].userId);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Failed to load chat history. Starting a new session.');
    }
  }, []);

  const handleStart = (name) => {
    setUserName(name);
    setError('');
    loadHistory(name);
  };

  const handleLogout = () => {
    setUserName('');
    setUserId(null);
    setMessages([]);
    setError('');
  };

  const handleSend = async (message) => {
    // Optimistically add user message
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsTyping(true);
    setError('');

    try {
      const response = await sendMessage(userName, message);

      // Capture the user ID from the response
      if (response.data.userId) {
        setUserId(response.data.userId);
      }

      // Replace temp user message with server response and add assistant message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== tempUserMsg.id);
        return [
          ...filtered,
          response.data.userMessage,
          response.data.assistantMessage,
        ];
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message. Please try again.');

      // Remove temp message on failure
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMsg.id));
    } finally {
      setIsTyping(false);
    }
  };

  const handleDeleteAllChats = async () => {
    if (!userId) {
      setError('Unable to identify user. Please try again.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete all your chat history? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const result = await deleteAllMessagesByUserId(userId);
      setMessages([]);
      setError('');
      console.log('Delete all chats result:', result);
    } catch (err) {
      console.error('Failed to delete all chats:', err);
      setError(err.message || 'Failed to delete all chats. Please try again.');
    }
  };

  return (
    <div className="app">
      {!userName ? (
        <NamePrompt onStart={handleStart} />
      ) : (
        <ChatWindow
          messages={messages}
          userName={userName}
          onSend={handleSend}
          isTyping={isTyping}
          onLogout={handleLogout}
          onDeleteAllChats={handleDeleteAllChats}
        />
      )}

      {error && (
        <div className="global-error">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}
    </div>
  );
}

export default App;
