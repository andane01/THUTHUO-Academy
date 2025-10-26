

import React from 'react';
import { type ChatMessage, ChatMessageRole } from '../types';

const ModelIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-thuthuo-blue text-white ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a5.5 5.5 0 0 1 5.5 5.5c0 1.44-.57 2.75-1.5 3.74v.01A5.5 5.5 0 0 1 12 17a5.5 5.5 0 0 1-4-9.25v-.01A5.5 5.5 0 0 1 12 2zm0 2A3.5 3.5 0 0 0 8.5 7.5a3.5 3.5 0 0 0 2.04 3.23l.18.08a.5.5 0 0 1 0 .86l-.18.08A3.5 3.5 0 0 0 8.5 14.5a3.5 3.5 0 0 0 6.96-1.25H16.5A5.5 5.5 0 0 1 12 17a3.5 3.5 0 0 0-1.54-2.92l-.18-.08a.5.5 0 0 1 0-.86l.18-.08A3.5 3.5 0 0 0 12 9.5c1.1 0 2.08-.51 2.74-1.26h-1.24a1.5 1.5 0 1 1 0-3H15.5A3.5 3.5 0 0 0 12 4z"></path>
        </svg>
    </div>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-thuthuo-green text-white ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3zm-6 9a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1zm1 3a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H7z"></path>
        </svg>
    </div>
);

// Helper function to convert markdown bold to HTML
const createMarkup = (text: string) => {
    const boldedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: boldedText };
};


const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const { role, text } = message;
    const isUser = role === ChatMessageRole.USER;
    const isError = role === ChatMessageRole.ERROR;

    const wrapperClasses = isUser ? 'justify-end' : 'justify-start';
    
    // Loading state bubble
    if (text === '...') {
        return (
             <div className="flex items-start gap-3 justify-start">
                <ModelIcon />
                <div className="bg-white text-thuthuo-dark-text rounded-2xl rounded-tl-none p-4 max-w-lg shadow-sm animate-pulse">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                </div>
            </div>
        )
    }

    const bubbleClasses = [
        'rounded-2xl',
        'p-4',
        'max-w-lg',
        'shadow-sm',
        'prose',
        'prose-strong:text-inherit',
        isUser 
            ? 'rounded-br-none bg-thuthuo-green text-white' 
            : 'rounded-bl-none',
        !isUser && !isError && 'bg-white text-thuthuo-dark-text border border-gray-200',
        isError && 'bg-red-100 text-red-800 border border-red-200',
    ].filter(Boolean).join(' ');


    return (
        <div className={`flex items-start gap-3 ${wrapperClasses} animate-fade-in-up`}>
            {!isUser && <ModelIcon className={isError ? 'bg-red-500' : ''}/>}
            <div className={bubbleClasses}>
                 {isUser ? (
                    <p className="whitespace-pre-wrap">{text}</p>
                ) : (
                    <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={createMarkup(text)} />
                )}
            </div>
            {isUser && <UserIcon />}
        </div>
    );
};

export default ChatMessageBubble;