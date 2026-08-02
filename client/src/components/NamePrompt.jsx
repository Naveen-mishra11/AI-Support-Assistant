import { useState } from 'react';
import logo from '../assests/logo.png';

const NamePrompt = ({ onStart }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Please enter your name to continue.');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Name cannot exceed 50 characters.');
      return;
    }

    setError('');
    onStart(trimmedName);
  };

  return (
    <div className="name-prompt">
      <div className="name-prompt-card">
        <img src={logo} alt="AI Customer Support Logo" className="name-prompt-logo" />
        <h1>AI Customer Support</h1>
        <p>Welcome! Please enter your name to start chatting with our support assistant.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={50}
            autoFocus
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="primary-btn">
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  );
};

export default NamePrompt;