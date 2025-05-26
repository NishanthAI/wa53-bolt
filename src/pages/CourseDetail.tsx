import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Book, BarChart, Award, ChevronDown, ChevronUp, Check, PlayCircle } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';
import { Lesson, Module } from '../types';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourse, getCourseProgress, getLessonCompletion } = useCourses();
  const { currentUser, enrollCourse } = useAuth();
  const navigate = useNavigate();
  
  const [activeModules, setActiveModules] = useState<Record<string, boolean>>({});
  const [course, setCourse] = useState(courseId ? getCourse(courseId) : undefined);
  const progress = courseId ? getCourseProgress(courseId) : 0;
  
  const isEnrolled = currentUser?.enrolledCourses.includes(courseId || '') || false;

  useEffect(() => {
    if (courseId) {
      const courseData = getCourse(courseId);
      if (courseData) {
        setCourse(courseData);
        // Initialize first module as open
        if (courseData.modules.length > 0) {
          setActiveModules({ [courseData.modules[0].id]: true });
        }
      }
    }
  }, [courseId, getCourse]);

  const toggleModule = (moduleId: string) => {
    setActiveModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleEnroll = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (courseId) {
      enrollCourse(courseId);
    }
  };

  const startCourse = () => {
    if (!course || !courseId) return;
    
    const firstModule = course.modules[0];
    if (firstModule && firstModule.lessons.length > 0) {
      navigate(`/courses/${courseId}/lessons/${firstModule.lessons[0].id}`);
    }
  };

  const continueCourse = () => {
    if (!course || !courseId || !currentUser) return;
    
    // Find first incomplete lesson
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!getLessonCompletion(courseId, lesson.id)) {
          navigate(`/courses/${courseId}/lessons/${lesson.id}`);
          return;
        }
      }
    }
    
    // If all lessons are complete, go to the first lesson
    const firstModule = course.modules[0];
    if (firstModule && firstModule.lessons.length > 0) {
      navigate(`/courses/${courseId}/lessons/${firstModule.lessons[0].id}`);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="h-64 overflow-hidden relative">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center px-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {course.title}
                </h1>
                <p className="text-white text-lg opacity-90">{course.instructor}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Clock size={18} className="mr-2" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Book size={18} className="mr-2" />
                <span>
                  {course.modules.length} {course.modules.length === 1 ? 'Module' : 'Modules'}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <BarChart size={18} className="mr-2" />
                <span>{course.difficulty}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Award size={18} className="mr-2" />
                <span className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  {course.rating.toFixed(1)}
                </span>
              </div>
            </div>
            
            {isEnrolled ? (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Your Progress</h3>
                  <span className="font-medium">{progress}% Complete</span>
                </div>
                <ProgressBar progress={progress} />
              </div>
            ) : null}
            
            <p className="text-gray-600 mb-8">
              {course.description}
            </p>
            
            {isEnrolled ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={continueCourse}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-1 flex justify-center items-center gap-2"
                >
                  <PlayCircle size={18} />
                  {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-1 flex justify-center items-center gap-2 w-full sm:w-auto"
              >
                Enroll Now
              </button>
            )}
          </div>
        </div>
        
        {/* Course Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Course Content</h2>
          
          {course.modules.map((module) => (
            <div key={module.id} className="mb-4 border border-gray-100 rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
                onClick={() => toggleModule(module.id)}
              >
                <h3 className="font-medium text-gray-800">{module.title}</h3>
                <div className="flex items-center">
                  <span className="mr-3 text-sm text-gray-500">
                    {module.lessons.length} {module.lessons.length === 1 ? 'lesson' : 'lessons'}
                  </span>
                  {activeModules[module.id] ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </div>
              </div>
              
              {activeModules[module.id] && (
                <div className="px-4 pb-2">
                  {module.lessons.map((lesson) => {
                    const isCompleted = courseId ? getLessonCompletion(courseId, lesson.id) : false;
                    
                    return (
                      <div 
                        key={lesson.id} 
                        className="py-3 border-b border-gray-100 last:border-b-0 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          {isCompleted ? (
                            <div className="w-5 h-5 mr-3 rounded-full bg-green-100 flex items-center justify-center">
                              <Check size={14} className="text-green-600" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 mr-3 rounded-full border border-gray-300"></div>
                          )}
                          
                          <div>
                            <p className="text-gray-800">{lesson.title}</p>
                            <p className="text-xs text-gray-500">
                              {lesson.type === 'video' ? 'Video' : 'Quiz'}
                              {lesson.duration ? ` • ${lesson.duration}` : ''}
                            </p>
                          </div>
                        </div>
                        
                        {isEnrolled ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (courseId) {
                                navigate(`/courses/${courseId}/lessons/${lesson.id}`);
                              }
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {isCompleted ? 'Review' : 'Start'}
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnroll();
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Preview
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;