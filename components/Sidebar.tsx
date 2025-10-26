

import React from 'react';
import { type Lesson } from '../types';

const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9 9 0 0 1 9 9c0 2.27-.85 4.37-2.27 5.95A8.003 8.003 0 0 1 12 22a8.003 8.003 0 0 1-6.73-3.05A9 9 0 0 1 12 2zm0 2a7 7 0 0 0-6.96 6.55L5 12v.5a7 7 0 0 0 11.96 4.54l.04.05A7 7 0 0 0 19 11a7 7 0 0 0-7-7zM11 18h2v2h-2v-2zm-1-2h4v-1h-4v1zm1-11a3 3 0 0 1 3 3 1 1 0 1 0 2 0 5 5 0 0 0-5-5 1 1 0 1 0 0 2z"></path></svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
);

const CircleIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" className={className}><circle cx="10" cy="10" r="7.5" strokeWidth="1.5"/></svg>
);

const Example: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div className="bg-white/60 rounded-lg p-3">
    <p className="font-semibold text-thuthuo-blue text-sm">{title}</p>
    <p className="text-sm text-thuthuo-dark-text italic">"{text}"</p>
  </div>
);

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-thuthuo-blue">Tsoelopele ea Hau</span>
            <span className="text-sm font-medium text-thuthuo-blue">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-thuthuo-green h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);


const Sidebar: React.FC<{ lessons: Lesson[] }> = ({ lessons }) => {
    const completedCount = lessons.filter(l => l.completed).length;
    const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

    return (
        <aside className="hidden md:block w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
            <div className="mb-8">
                <ProgressBar progress={progress} />
            </div>

            <h3 className="text-lg font-bold text-thuthuo-blue mb-4">Lithuto tsa Sebopeho-puo 📚</h3>
            <div className="space-y-3 mb-8">
                {lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-3">
                        {lesson.completed 
                            ? <CheckCircleIcon className="h-5 w-5 text-thuthuo-green" />
                            : <CircleIcon className="h-5 w-5 text-gray-400" />
                        }
                        <span className={`text-sm ${lesson.completed ? 'text-gray-400 line-through' : 'text-thuthuo-dark-text'}`}>
                            {lesson.title}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex items-center mb-6">
                <LightbulbIcon className="h-6 w-6 text-yellow-500 mr-3" />
                <h2 className="text-xl font-bold text-thuthuo-blue">Mehlala</h2>
            </div>
            <div className="space-y-4 text-thuthuo-light-text text-sm">
                 <p>Botsa tichere lipotso tse kang tsena ho qala ho ithuta le ho phethela lithuto tsa hau!</p>
            </div>

            <h3 className="text-lg font-bold text-thuthuo-blue mt-8 mb-4">Seo u ka se botsang 👇</h3>
            <div className="space-y-3">
                <Example title="Botsa ka Lereho" text="Lereho ke eng? Mph'e mohlala oa lereho polelong." />
                <Example title="Botsa ka Leetsi" text="Leetsi 'ho matha' le ka sebelisoa joang polelong ea nako ea joale?" />
                <Example title="Botsa ka Sephafi" text="Sephafi se thusa ka eng polelong? Nketsetse mohlala." />
                <Example title="Botsa ka Seboleli" text="Tlhaloso ea seboleli ke efe?" />
            </div>
        </aside>
    );
};

export default Sidebar;