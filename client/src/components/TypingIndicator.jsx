const TypingIndicator = () => {
  return (
    <div className="message message-assistant">
      <div className="message-avatar">🤖</div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">Support Assistant</span>
        </div>
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;