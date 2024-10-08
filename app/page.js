// /app/page.js

'use client'
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! How can I help you today?" },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    const userMessage = message;
    setMessage('');
    setMessages((messages) => [
        ...messages,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: '' },
    ]);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMessages((messages) => {
            let lastMessage = messages[messages.length - 1];
            let otherMessages = messages.slice(0, messages.length - 1);
            return [
                ...otherMessages,
                { ...lastMessage, content: data.message },
            ];
        });
    } catch (error) {
        console.error('Error:', error);
        setMessages((messages) => [
            ...messages,
            { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
        ]);
    } finally {
        setIsLoading(false);
    }
};

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <div className="flex flex-col w-[500px] h-[700px] border border-gray-800 bg-gray-800 p-4 space-y-4 rounded-lg">
        <div className="flex flex-col space-y-4 flex-grow overflow-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`${
                  msg.role === 'assistant' ? 'bg-gray-700' : 'bg-green-700'
                } text-white rounded-lg p-4 max-w-[80%]`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-2 bg-gray-700 text-white rounded-lg outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
