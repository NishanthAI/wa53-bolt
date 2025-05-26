import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import Quiz from '../components/Quiz';
import { ChevronLeft, ChevronRight, Menu, CheckCircle, List } from 'lucide-react';
import { Lesson, Module, QuizContent, VideoContent } from '../types';

const LessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { getCourse, markLessonCompleted, getLessonCompletion, saveQuizResult } = useCourses();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(courseId ? getCourse(courseId) : undefined);
  const [currentModule, setCurrentModule] = useState<Module | undefined>();
  const [currentLesson, setCurrentLesson] = useState<Lesson | undefined>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Set course and lesson data
  useEffect(() => {
    if (courseId && lessonId) {
      const courseData = getCourse(courseId);
      if (courseData) {
        setCourse(courseData);
        
        // Find the current module and lesson
        let foundModule: Module | undefined;
        let foundLesson: Lesson | undefined;
        
        for (const module of courseData.modules) {
          const lesson = module.lessons.find(l => l.id === lessonId);
          if (lesson) {
            foundModule = module;
            foundLesson = lesson;
            break;
          }
        }
        
        setCurrentModule(foundModule);
        setCurrentLesson(foundLesson);
      }
    }
  }, [courseId, lessonId, getCourse]);

  // Check if user is enrolled in this course
  const isEnrolled = currentUser?.enrolledCourses.includes(courseId || '') || false;

  // Check if the lesson is completed
  const isLessonCompleted = courseId && lessonId ? getLessonCompletion(courseId, lessonId) : false;

  if (!course || !currentLesson || !currentModule) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lesson not found</h1>
          <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const handleVideoComplete = () => {
    if (!isAuthenticated || !courseId || !lessonId) return;
    markLessonCompleted(courseId, lessonId);
  };

  const handleQuizComplete = (result: any) => {
    if (!isAuthenticated || !courseId || !lessonId) return;
    saveQuizResult(courseId, lessonId, result);
  };

  // Navigation between lessons
  const findAdjacentLesson = (direction: 'prev' | 'next'): { moduleId: string; lessonId: string } | null => {
    const allModules = course.modules;
    let currentModuleIndex = allModules.findIndex(m => m.id === currentModule.id);
    let currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);
    
    if (direction === 'next') {
      // Try next lesson in current module
      if (currentLessonIndex < currentModule.lessons.length - 1) {
        return {
          moduleId: currentModule.id,
          lessonId: currentModule.lessons[currentLessonIndex + 1].id
        };
      }
      
      // Try first lesson in next module
      if (currentModuleIndex < allModules.length - 1) {
        const nextModule = allModules[currentModuleIndex + 1];
        if (nextModule.lessons.length > 0) {
          return {
            moduleId: nextModule.id,
            lessonId: nextModule.lessons[0].id
          };
        }
      }
    } else {
      // Try previous lesson in current module
      if (currentLessonIndex > 0) {
        return {
          moduleId: currentModule.id,
          lessonId: currentModule.lessons[currentLessonIndex - 1].id
        };
      }
      
      // Try last lesson in previous module
      if (currentModuleIndex > 0) {
        const prevModule = allModules[currentModuleIndex - 1];
        if (prevModule.lessons.length > 0) {
          return {
            moduleId: prevModule.id,
            lessonId: prevModule.lessons[prevModule.lessons.length - 1].id
          };
        }
      }
    }
    
    return null;
  };

  const goToNextLesson = () => {
    const nextLesson = findAdjacentLesson('next');
    if (nextLesson && courseId) {
      navigate(`/courses/${courseId}/lessons/${nextLesson.lessonId}`);
    }
  };

  const goToPrevLesson = () => {
    const prevLesson = findAdjacentLesson('prev');
    if (prevLesson && courseId) {
      navigate(`/courses/${courseId}/lessons/${prevLesson.lessonId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className={`bg-white shadow-md fixed inset-y-16 left-0 z-20 w-80 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:inset-y-0 lg:translate-x-0`}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Course Content</h2>
              <button 
                className="lg:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            {course.modules.map((module) => (
              <div key={module.id} className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">{module.title}</h3>
                <ul className="space-y-2">
                  {module.lessons.map((lesson) => {
                    const isCurrentLesson = lesson.id === currentLesson.id;
                    const isCompleted = courseId ? getLessonCompletion(courseId, lesson.id) : false;
                    
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => {
                            if (courseId) {
                              navigate(`/courses/${courseId}/lessons/${lesson.id}`);
                              setIsMenuOpen(false);
                            }
                          }}
                          className={`w-full flex items-center py-2 px-3 rounded-md transition-colors ${
                            isCurrentLesson 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="mr-3 flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle size={16} className="text-green-500" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-gray-300" />
                            )}
                          </div>
                          <div className="text-left">
                            <span className={`text-sm ${isCurrentLesson ? 'font-medium' : 'text-gray-700'}`}>
                              {lesson.title}
                            </span>
                            <p className="text-xs text-gray-500">
                              {lesson.type === 'video' ? 'Video' : 'Quiz'}
                              {lesson.duration ? ` • ${lesson.duration}` : ''}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto h-full p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Menu size={20} className="mr-2" />
                <span>View Lesson List</span>
              </button>
            </div>

            {/* Lesson Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={goToPrevLesson}
                disabled={!findAdjacentLesson('prev')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
                  findAdjacentLesson('prev') 
                    ? 'hover:bg-gray-100 text-gray-700' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-800">{currentLesson.title}</h1>
              </div>
              
              <button
                onClick={goToNextLesson}
                disabled={!findAdjacentLesson('next')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
                  findAdjacentLesson('next') 
                    ? 'hover:bg-gray-100 text-gray-700' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="md:hidden mb-4">
              <h1 className="text-xl font-bold text-gray-800">{currentLesson.title}</h1>
            </div>
            
            {/* Lesson Content */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
              {isLessonCompleted && (
                <div className="flex items-center gap-2 mb-4 text-green-700 bg-green-50 px-4 py-2 rounded-md">
                  <CheckCircle size={16} />
                  <span>You've completed this lesson</span>
                </div>
              )}
              
              {currentLesson.type === 'video' ? (
                <VideoPlayer 
                  videoId={(currentLesson.content as VideoContent).videoId}
                  title={currentLesson.title}
                  description={(currentLesson.content as VideoContent).description}
                  onComplete={handleVideoComplete}
                />
              ) : (
                <Quiz 
                  questions={(currentLesson.content as QuizContent).questions}
                  lessonId={currentLesson.id}
                  onComplete={handleQuizComplete}
                />
              )}
            </div>
            
            {/* Navigation Buttons (Bottom) */}
            <div className="flex justify-between mt-6">
              <button
                onClick={goToPrevLesson}
                disabled={!findAdjacentLesson('prev')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                  findAdjacentLesson('prev') 
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={18} />
                Previous Lesson
              </button>
              
              <button
                onClick={goToNextLesson}
                disabled={!findAdjacentLesson('next')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                  findAdjacentLesson('next') 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-300 text-white cursor-not-allowed'
                }`}
              >
                Next Lesson
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonPage;