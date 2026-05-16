import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am your Dental Hospital Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault(); // Prevents page reload
        if (!input.trim() || isLoading) return;

        const userMsg = { text: input, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input; // Safeguarding the input value
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/chat/', {
                message: currentInput 
            });

            // Fallback message updated to English
            const botReply = response.data && response.data.reply 
                ? String(response.data.reply) 
                : "I am unable to process your request at the moment.";
            
            const botMsg = { text: botReply, isBot: true };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { text: "Sorry, a connection error occurred.", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, fontFamily: 'Arial' }}>
            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '24px' }}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div style={{ position: 'absolute', bottom: '80px', right: '0', width: '350px', height: '450px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Header Title */}
                    <div style={{ padding: '15px', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Dental Hospital Assistant</div>
                    
                    {/* Messages Area */}
                    <div ref={scrollRef} style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ alignSelf: msg.isBot ? 'flex-start' : 'flex-end', backgroundColor: msg.isBot ? '#f0f0f0' : '#007bff', color: msg.isBot ? 'black' : 'white', padding: '8px 12px', borderRadius: '12px', maxWidth: '80%', fontSize: '14px', whiteSpace: 'pre-line' }}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div style={{ fontSize: '12px', color: '#888' }}>Assistant is typing...</div>}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSend} style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex' }}>
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isLoading}
                            style={{ flex: 1, border: '1px solid #ddd', borderRadius: '20px', padding: '8px 15px', outline: 'none' }}
                        />
                        <button type="submit" disabled={isLoading} style={{ marginLeft: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', opacity: isLoading ? 0.5 : 1 }}>➤</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;