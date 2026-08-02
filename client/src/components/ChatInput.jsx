import { useState } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError("Please enter a message.");
      return;
    }

    if (trimmedMessage.length > 2000) {
      setError("Message cannot exceed 2000 characters.");
      return;
    }

    setError("");
    setMessage("");
    onSend(trimmedMessage);
  };

  return (
    <div className="chat-input-container">
      {error && <div className="error-message">{error}</div>}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
          disabled={disabled}
          maxLength={2000}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={disabled || !message.trim()}
        >
          <Send size={15} strokeWidth={2.2} />
          <span className="send-btn-text">Send</span>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
