import React, { createContext, useState, useContext, useEffect } from 'react';
import { Course, UserProgress, QuizResult } from '../types';
import { useAuth } from './AuthContext';
import { mockCourses, initializeMockData } from '../data/mockData';

interface CourseContextType {
  courses: Course[];
  userProgress: UserProgress[];
  getCourse: (id: string) => Course | undefined;
  getEnrolledCourses: () => Course[];
  markLessonCompleted: (courseId: string, lessonId: string) => void;
  saveQuizResult: (courseId: string, lessonId: string, result: QuizResult) => void;
  getLessonCompletion: (courseId: string, lessonId: string) => boolean;
  getCourseProgress: (courseId: string) => number;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Initialize mock data if needed
    initializeMockData();
    
    // Load courses from localStorage
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      setCourses(mockCourses);
      localStorage.setItem('courses', JSON.stringify(mockCourses));
    }

    // Load user progress
    if (currentUser) {
      const storedProgress = localStorage.getItem(`progress_${currentUser.id}`);
      if (storedProgress) {
        setUserProgress(JSON.parse(storedProgress));
      }
    }
  }, [currentUser]);

  const saveUserProgress = (updatedProgress: UserProgress[]) => {
    if (currentUser) {
      setUserProgress(updatedProgress);
      localStorage.setItem(`progress_${currentUser.id}`, JSON.stringify(updatedProgress));
    }
  };

  const getCourse = (id: string): Course | undefined => {
    return courses.find(course => course.id === id);
  };

  const getEnrolledCourses = (): Course[] => {
    if (!currentUser) return [];
    return courses.filter(course => currentUser.enrolledCourses.includes(course.id));
  };

  const getCourseProgress = (courseId: string): number => {
    if (!currentUser) return 0;
    
    const progress = userProgress.find(p => p.userId === currentUser.id && p.courseId === courseId);
    if (!progress) return 0;
    
    return progress.overallProgress;
  };

  const getLessonCompletion = (courseId: string, lessonId: string): boolean => {
    if (!currentUser) return false;
    
    const progress = userProgress.find(p => p.userId === currentUser.id && p.courseId === courseId);
    return progress ? progress.completedLessons.includes(lessonId) : false;
  };

  const markLessonCompleted = (courseId: string, lessonId: string) => {
    if (!currentUser) return;
    
    const course = getCourse(courseId);
    if (!course) return;
    
    // Find or create progress entry for this course
    const existingProgress = userProgress.find(
      p => p.userId === currentUser.id && p.courseId === courseId
    );
    
    // Calculate total lessons in the course
    let totalLessons = 0;
    course.modules.forEach(module => {
      totalLessons += module.lessons.length;
    });
    
    if (existingProgress) {
      // Don't add if already completed
      if (existingProgress.completedLessons.includes(lessonId)) return;
      
      const updatedCompletedLessons = [...existingProgress.completedLessons, lessonId];
      const updatedProgress = {
        ...existingProgress,
        completedLessons: updatedCompletedLessons,
        lastAccessed: new Date().toISOString(),
        overallProgress: Math.round((updatedCompletedLessons.length / totalLessons) * 100)
      };
      
      const newProgress = userProgress.map(p => 
        p.userId === currentUser.id && p.courseId === courseId ? updatedProgress : p
      );
      
      saveUserProgress(newProgress);
    } else {
      // Create new progress entry
      const newProgressEntry: UserProgress = {
        userId: currentUser.id,
        courseId,
        completedLessons: [lessonId],
        quizResults: [],
        lastAccessed: new Date().toISOString(),
        overallProgress: Math.round((1 / totalLessons) * 100)
      };
      
      saveUserProgress([...userProgress, newProgressEntry]);
    }
  };

  const saveQuizResult = (courseId: string, lessonId: string, result: QuizResult) => {
    if (!currentUser) return;
    
    const existingProgress = userProgress.find(
      p => p.userId === currentUser.id && p.courseId === courseId
    );
    
    if (existingProgress) {
      // Update or add quiz result
      const existingQuizIndex = existingProgress.quizResults.findIndex(
        q => q.lessonId === lessonId
      );
      
      let updatedQuizResults;
      
      if (existingQuizIndex >= 0) {
        // Update existing quiz result
        updatedQuizResults = [...existingProgress.quizResults];
        updatedQuizResults[existingQuizIndex] = result;
      } else {
        // Add new quiz result
        updatedQuizResults = [...existingProgress.quizResults, result];
      }
      
      // Mark lesson as completed if quiz is completed
      let updatedCompletedLessons = [...existingProgress.completedLessons];
      if (result.completed && !updatedCompletedLessons.includes(lessonId)) {
        updatedCompletedLessons.push(lessonId);
      }
      
      // Calculate progress
      const course = getCourse(courseId);
      if (!course) return;
      
      let totalLessons = 0;
      course.modules.forEach(module => {
        totalLessons += module.lessons.length;
      });
      
      const updatedProgress = {
        ...existingProgress,
        completedLessons: updatedCompletedLessons,
        quizResults: updatedQuizResults,
        lastAccessed: new Date().toISOString(),
        overallProgress: Math.round((updatedCompletedLessons.length / totalLessons) * 100)
      };
      
      const newProgress = userProgress.map(p => 
        p.userId === currentUser.id && p.courseId === courseId ? updatedProgress : p
      );
      
      saveUserProgress(newProgress);
    } else {
      // Create new progress entry with quiz result
      const course = getCourse(courseId);
      if (!course) return;
      
      let totalLessons = 0;
      course.modules.forEach(module => {
        totalLessons += module.lessons.length;
      });
      
      const newProgressEntry: UserProgress = {
        userId: currentUser.id,
        courseId,
        completedLessons: result.completed ? [lessonId] : [],
        quizResults: [result],
        lastAccessed: new Date().toISOString(),
        overallProgress: result.completed ? Math.round((1 / totalLessons) * 100) : 0
      };
      
      saveUserProgress([...userProgress, newProgressEntry]);
    }
  };

  return (
    <CourseContext.Provider value={{
      courses,
      userProgress,
      getCourse,
      getEnrolledCourses,
      markLessonCompleted,
      saveQuizResult,
      getLessonCompletion,
      getCourseProgress
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};