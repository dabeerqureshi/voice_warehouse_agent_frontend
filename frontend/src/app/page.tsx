"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
  isTable?: boolean;
}

// Helper function to format JSON responses as tables
const formatResponse = (response: any): { content: string; isTable: boolean } => {
  // If it's not an object, return as regular text
  if (typeof response !== 'object' || response === null) {
    return { content: String(response), isTable: false };
  }

  // Check if it's a warehouse data response with 'data' array
  if (response.data && Array.isArray(response.data) && response.data.length > 0) {
    const data = response.data;
    const headers = Object.keys(data[0]);
    
    // Create table header
    let tableHtml = `
      <div class="table-container">
        <div class="table-header">
          ✅ Successfully retrieved your warehouse inventory (${response.count || data.length} products found)
        </div>
        <table class="warehouse-table">
          <thead>
            <tr>
              ${headers.map(header => `<th>${header.replace(/_/g, ' ').toUpperCase()}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    // Create table rows
    data.forEach((item: any) => {
      tableHtml += '<tr>';
      headers.forEach(header => {
        const value = item[header];
        // Format numbers with commas
        const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
        tableHtml += `<td>${formattedValue}</td>`;
      });
      tableHtml += '</tr>';
    });

    tableHtml += `
          </tbody>
        </table>
      </div>
    `;

    return { content: tableHtml, isTable: true };
  }

  // For single item responses or other structured data
  if (response.product_name || response.product_id) {
    const item = response;
    const headers = Object.keys(item);
    
    let tableHtml = `
      <div class="table-container">
        <div class="table-header">
          📦 Product Information
        </div>
        <table class="warehouse-table">
          <thead>
            <tr>
              ${headers.map(header => `<th>${header.replace(/_/g, ' ').toUpperCase()}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
    `;

    headers.forEach(header => {
      const value = item[header];
      const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
      tableHtml += `<td>${formattedValue}</td>`;
    });

    tableHtml += `
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return { content: tableHtml, isTable: true };
  }

  // For success/failure messages
  if (response.status) {
    const statusEmoji = response.status === 'success' ? '✅' : '❌';
    const message = response.message || response.reply || 'Operation completed';
    return { 
      content: `<div class="status-message ${response.status}">
        ${statusEmoji} ${message}
      </div>`, 
      isTable: false 
    };
  }

  // Fallback to JSON string for other objects
  return { content: JSON.stringify(response, null, 2), isTable: false };
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userInput }]);

    try {
      const res = await axios.post("http://127.0.0.1:8001/chat", { message: userInput });
      const formattedResponse = formatResponse(res.data.reply);
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: formattedResponse.content,
        isTable: formattedResponse.isTable
      }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "⚠ Error connecting to AI middleware. Please ensure the AI middleware is running on http://127.0.0.1:8001" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectExample = (example: string) => {
    setInput(example);
  };

  return (
    <div className="min-h-screen">
      <div className="container">
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <div className="header-content">
              <div className="avatar">
                <span className="robot-icon">🤖</span>
              </div>
              <div className="header-text">
                <h1>Warehouse AI Assistant</h1>
                <p>Your intelligent warehouse management partner</p>
              </div>
              <div className="status-indicator">
                <div className="status-dot"></div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Online</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="messages-area">
            {messages.length === 0 && (
              <div className="welcome-screen">
                <span className="welcome-icon">🤖</span>
                <h2 className="welcome-title">Welcome to Warehouse AI</h2>
                <p className="welcome-subtitle">Use natural language to manage your warehouse inventory</p>
                
                <div className="examples-grid">
                  <div className="example-card" onClick={() => selectExample("Add 50 Wireless Mouse at location A-01-01")}>
                    <div className="example-title">Add Product</div>
                    <div className="example-text">"Add 50 Wireless Mouse at location A-01-01"</div>
                  </div>
                  
                  <div className="example-card" onClick={() => selectExample("Show all products")}>
                    <div className="example-title">View Inventory</div>
                    <div className="example-text">"Show all products"</div>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`message ${msg.role} ${msg.isTable ? 'message-table' : ''}`}
              >
                <div className={`message-header ${msg.role}-label`}>
                  <span>🤖</span>
                  <span>{msg.role === "user" ? "You" : "AI Assistant"}</span>
                </div>
                <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.content }} />
              </div>
            ))}
            
            {isLoading && (
              <div className="typing-indicator">
                <div className="robot-icon" style={{ fontSize: '16px' }}>🤖</div>
                <span className="typing-text">AI is thinking</span>
                <div className="dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-container">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your warehouse command... (e.g., 'Add 50 Wireless Mouse at location A-01-01')"
                className="input-field"
                disabled={isLoading}
                rows={1}
              />
              <button 
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="send-btn"
              >
                <span className="send-icon">➤</span>
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
