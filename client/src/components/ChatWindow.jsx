import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { Trash2, LogOut } from "lucide-react";

const ChatWindow = ({ messages, userName, onSend, isTyping, onLogout, onDeleteAllChats }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-header-avatar">🤖</div>
          <div>
            <h2>AI Support Assistant</h2>
            <span className="online-status">● Online</span>
          </div>
        </div>
        <div className="chat-header-actions">
          <span className="user-badge">👤 {userName}</span>
          <button
            className="delete-all-btn"
            onClick={onDeleteAllChats}
            title="Delete all chat history"
            disabled={messages.length === 0}
          >
          <Trash2 size={14} strokeWidth={2} />
          <span className='clear-chat-btn'>Clear Chat</span> 
          </button>
          <button className="logout-btn" onClick={onLogout} title="End session">
            <LogOut size={14} strokeWidth={2} />
            <span className="logout-text">End Session</span>
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👋</div>
            <p>Hello {userName}! How can I help you today?</p>
            <p className="empty-state-sub">Ask me anything about our products or services.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} userName={userName} />
          ))
        )}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={onSend} disabled={isTyping} />
    </div>
  );
};

export default ChatWindow;