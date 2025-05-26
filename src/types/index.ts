export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  enrolledCourses: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  modules: Module[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  rating: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz';
  duration?: string;
  content: VideoContent | QuizContent;
}

export interface VideoContent {
  videoId: string; // YouTube video ID
  description: string;
}

export interface QuizContent {
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  quizResults: QuizResult[];
  lastAccessed: string; // ISO date string
  overallProgress: number; // 0-100 percentage
}

export interface QuizResult {
  lessonId: string;
  score: number;
  completed: boolean;
  answers: UserAnswer[];
}

export interface UserAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}