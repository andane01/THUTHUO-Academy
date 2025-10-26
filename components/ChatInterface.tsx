import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type ChatMessage, ChatMessageRole, type Lesson } from '../types';
import ChatMessageBubble from './ChatMessageBubble';
import { createChat, sendMessageToChat } from '../services/geminiService';
import { type Chat } from '@google/genai';

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

interface ChatInterfaceProps {
    lessons: Lesson[];
    onCompleteLesson: (lessonId: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ lessons, onCompleteLesson }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [quickReplies, setQuickReplies] = useState<string[]>([]);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const checkForQuickReplies = useCallback((responseText: string) => {
        // 1. Check for specific Yes/No question phrases first
        const yesNoQuestionPatterns = [
            /Na u loketse/i,
            /Na re ka tsoela pele/i,
            /o ka rata ho/i,
            /re qale/i,
            /o se o loketse/i, // Added more variations
        ];
        
        if (yesNoQuestionPatterns.some(pattern => pattern.test(responseText) && responseText.includes('?'))) {
            setQuickReplies(['E', 'Che']); // E = Yes, Che = No
            return;
        }

        // 2. Check for multiple-choice questions (e.g., "A) ...", "1. ...")
        // This regex is now more robust, allowing for leading whitespace.
        const choicePattern = /^\s*[A-Z1-9][.)]\s(.+)/;
        const lines = responseText.split(/\r?\n/); // Handles different line endings
        const choices = lines
            .map(line => line.match(choicePattern))
            .filter((match): match is RegExpMatchArray => match !== null)
            // We now use match[0] to get the full text of the choice, e.g., "A) Ntja".
            // This is clearer on the button and provides better context back to the model.
            .map(match => match[0].trim());

        if (choices.length > 1) { // Only show as quick replies if there are at least two options
            setQuickReplies(choices);
        } else {
            setQuickReplies([]);
        }
    }, []);

    const initializeChat = useCallback(() => {
        try {
            const newChat = createChat();
            chatRef.current = newChat;
            setIsLoading(true);
            sendMessageToChat(newChat, "Lumela").then(initialMessage => {
                 setMessages([{ role: ChatMessageRole.MODEL, text: initialMessage }]);
                 checkForQuickReplies(initialMessage);
            }).catch(e => {
                console.error(e);
                setMessages([{ role: ChatMessageRole.ERROR, text: "Ho bile le phoso ha ho qala moqoqo. Hlahloba API key ea hau." }]);
            }).finally(() => {
                 setIsLoading(false);
            });
        } catch (error) {
            console.error("Failed to initialize chat:", error);
            setMessages([{ role: ChatMessageRole.ERROR, text: "Ho hloleha ho qala moqoqo. Ka kopo etsa bonnete ba hore API Key ea hau e nepahetse." }]);
        }
    }, [checkForQuickReplies]);

    useEffect(() => {
        initializeChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const checkAndCompleteLessons = useCallback((textToCheck: string) => {
        const incompleteLessons = lessons.filter(l => !l.completed);
        for (const lesson of incompleteLessons) {
            for (const keyword of lesson.keywords) {
                if (textToCheck.toLowerCase().includes(keyword.toLowerCase())) {
                    onCompleteLesson(lesson.id);
                    // Found a match for this lesson, no need to check other keywords for it
                    break; 
                }
            }
        }
    }, [lessons, onCompleteLesson]);

    const handleSubmit = async (e: React.FormEvent | null, quickReplyText?: string) => {
        if (e) e.preventDefault();
        
        const messageText = quickReplyText || input;
        if (!messageText.trim() || isLoading) return;

        setQuickReplies([]); // Clear replies on any submission

        const userMessage: ChatMessage = { role: ChatMessageRole.USER, text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Check user's input for keywords
        checkAndCompleteLessons(messageText);

        if (chatRef.current) {
            const responseText = await sendMessageToChat(chatRef.current, messageText);
            const modelMessage: ChatMessage = { 
                role: responseText.startsWith("Ke masoabi") ? ChatMessageRole.ERROR : ChatMessageRole.MODEL, 
                text: responseText 
            };
            setMessages(prev => [...prev, modelMessage]);
            // Check model's response for keywords
            checkAndCompleteLessons(responseText);
            checkForQuickReplies(responseText);
        } else {
             const errorMessage: ChatMessage = { role: ChatMessageRole.ERROR, text: "Moqoqo ha o e-so qaloe. Leka ho nchafatsa leqephe." };
             setMessages(prev => [...prev, errorMessage]);
        }
        
        setIsLoading(false);
    };
    
    const handleQuickReplyClick = (reply: string) => {
        handleSubmit(null, reply);
    };

    return (
        <div className="flex-1 flex flex-col bg-thuthuo-light-bg p-4 md:p-6 overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {messages.map((msg, index) => (
                    <ChatMessageBubble key={index} message={msg} />
                ))}
                {isLoading && <ChatMessageBubble message={{ role: ChatMessageRole.MODEL, text: '...' }} />}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-6">
                 {quickReplies.length > 0 && !isLoading && (
                    <div className="flex justify-center flex-wrap gap-3 mb-3 animate-fade-in-up">
                        {quickReplies.map((reply, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickReplyClick(reply)}
                                className="bg-white border border-thuthuo-green text-thuthuo-green font-semibold rounded-full px-5 py-2 hover:bg-thuthuo-green/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-thuthuo-green transition-colors duration-200 shadow-sm"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-full shadow-lg p-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={quickReplies.length > 0 ? "Kgetha karabo ka hodimo..." : "Ngola molaetsa oa hau mona..."}
                        className="w-full bg-transparent border-none focus:ring-0 text-thuthuo-dark-text placeholder-thuthuo-light-text px-4 py-2"
                        disabled={isLoading || quickReplies.length > 0}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-thuthuo-green text-white rounded-full p-3 hover:bg-thuthuo-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-thuthuo-green disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        <SendIcon className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;