document.addEventListener('DOMContentLoaded', () => {
  // Get references to DOM elements
  const chatContainer = document.getElementById('chat-container');
  if (!chatContainer) return; // Exit if chat container not found

  // Retrieve Django-passed variables from data attributes
  const roomName = chatContainer.dataset.roomName;
  const username = chatContainer.dataset.username;

  const messagesDiv = document.getElementById('messages');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');

  if (!roomName || !username) {
    console.warn('Missing roomName or username data attributes.');
    return;
  }

  // Initialize WebSocket connection
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const chatSocket = new WebSocket(`${protocol}${window.location.host}/ws/chats/${roomName}/`);

  // Helper function to append messages to chat window
  function appendMessage(sender, message, isSentByCurrentUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isSentByCurrentUser ? 'sent' : 'received');
    messageDiv.innerHTML = `<strong>${sender}:</strong> <p>${message}</p>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
  }

  // Handle incoming WebSocket messages
  chatSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const { message, sender } = data;

    // Avoid duplicating messages sent by current user (optional)
    if (sender !== username) {
      appendMessage(sender, message, false);
    }
  };

  chatSocket.onclose = (event) => {
    console.error('Chat socket closed unexpectedly:', event);
  };

  chatSocket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  // Send message on button click
  sendButton.addEventListener('click', (event) => {
    event.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;

    // Append message immediately for instant feedback
    appendMessage(username, message, true);

    // Send message to server
    chatSocket.send(JSON.stringify({ message, sender: username }));

    messageInput.value = '';
  });

  // Optional: Send message on Enter key press
  messageInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      sendButton.click();
    }
  });
});
