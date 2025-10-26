export enum ChatMessageRole {
  USER = 'user',
  MODEL = 'model',
  ERROR = 'error'
}

export interface ChatMessage {
  role: ChatMessageRole;
  text: string;
}

export interface Lesson {
  id: string;
  title: string;
  keywords: string[];
  completed: boolean;
}
