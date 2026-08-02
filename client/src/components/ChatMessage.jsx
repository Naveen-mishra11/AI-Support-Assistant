const ChatMessage = ({ message, userName }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="message-avatar">{isUser ? '👤' : '🤖'}</div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">
            {isUser ? userName : 'Kiara (AI Support Assistant)'}
          </span>
          <span className="message-time">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="message-text">{message.content}</div>
      </div>
    </div>
  );
};

export default ChatMessage;