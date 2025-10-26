import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { type Lesson } from './types';
import { initialLessons } from './data/lessons';

const App: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const handleCompleteLesson = (lessonId: string) => {
    setLessons(prevLessons =>
      prevLessons.map(lesson =>
        lesson.id === lessonId && !lesson.completed
          ? { ...lesson, completed: true }
          : lesson
      )
    );
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-thuthuo-light-bg text-thuthuo-dark-text">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar lessons={lessons} />
        <main className="flex-1 flex flex-col">
          <ChatInterface lessons={lessons} onCompleteLesson={handleCompleteLesson} />
        </main>
      </div>
    </div>
  );
};

export default App;
