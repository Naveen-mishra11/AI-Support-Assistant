const API_BASE = '/api';

/**
 * Send a chat message to the backend
 * @param {string} name - User's name
 * @param {string} message - User's message
 * @returns {Promise<Object>} - Response with user and assistant messages
 */
export const sendMessage = async (name, message) => {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, message }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to send message');
  }

  return data;
};

/**
 * Fetch chat history, optionally filtered by user name
 * @param {string} [name] - Optional user name filter
 * @returns {Promise<Array>} - Array of messages
 */
export const getHistory = async (name) => {
  const query = name ? `?name=${encodeURIComponent(name)}` : '';
  const response = await fetch(`${API_BASE}/chat/history${query}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch history');
  }

  return data.data;
};

/**
 * Delete a specific message by ID
 * @param {string} id - Message ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteMessage = async (id) => {
  const response = await fetch(`${API_BASE}/chat/history/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete message');
  }

  return data;
};

/**
 * Delete all messages for a user by user ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteAllMessagesByUserId = async (id) => {
  const response = await fetch(`${API_BASE}/chat/history/user/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete all messages');
  }

  return data;
};

/**
 * Delete all messages for a user by name
 * @param {string} name - User name
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteAllMessagesByUserName = async (name) => {
  const query = `?name=${encodeURIComponent(name)}`;
  const response = await fetch(`${API_BASE}/chat/history${query}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete all messages');
  }

  return data;
};
