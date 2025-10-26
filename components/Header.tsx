
import React from 'react';

const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.186l.294.882a2 2 0 0 0 3.842 0l.294-.882A1.5 1.5 0 0 1 11.352 2H12.5A1.5 1.5 0 0 1 14 3.5v17A1.5 1.5 0 0 1 12.5 22h-9A1.5 1.5 0 0 1 2 20.5v-17zM11 4H3.5a.5.5 0 0 0-.5.5v16a.5.5 0 0 0 .5.5H11V4z"></path>
        <path d="M12.5 2h.099a1.5 1.5 0 0 1 1.474 1.224l.28.978a2 2 0 0 0 3.896 0l.28-.978A1.5 1.5 0 0 1 19.901 2H20.5A1.5 1.5 0 0 1 22 3.5v17a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 12 20.5v-17A1.5 1.5 0 0 1 12.5 2zm.5 2v16h5a.5.5 0 0 0 .5-.5v-17a.5.5 0 0 0-.5-.5h-.599a.5.5 0 0 0-.49.39L17.13 5.4a1 1 0 0 1-1.948 0L14.4 3.895A.5.5 0 0 0 13.901 3.5H13V4z"></path>
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md w-full p-4 flex items-center z-10">
        <BookIcon className="h-8 w-8 text-thuthuo-blue mr-3" />
        <h1 className="text-2xl font-bold text-thuthuo-blue">
            Thuthuo <span className="font-normal text-thuthuo-green">| Prompt Engineering</span>
        </h1>
    </header>
  );
};

export default Header;
