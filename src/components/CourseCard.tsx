import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, BarChart3 } from 'lucide-react';
import { Course } from '../types';
import { useCourses } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, showProgress = false }) => {
  const { getCourseProgress } = useCourses();
  const { currentUser, enrollCourse } = useAuth();
  const isEnrolled = currentUser?.enrolledCourses.includes(course.id) || false;
  const progress = getCourseProgress(course.id);

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    enrollCourse(course.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Link to={`/courses/${course.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Course Image with overlay for enrollment status */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {isEnrolled && (
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
              Enrolled
            </div>
          )}
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between mb-2">
            <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-gray-700 ml-1">{course.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          
          <p className="text-gray-600 mb-4 text-sm line-clamp-2 flex-grow">
            {course.description}
          </p>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <User size={16} className="mr-1" />
            <span>{course.instructor}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <Clock size={16} className="mr-1" />
            <span>{course.duration}</span>
          </div>
          
          {showProgress && isEnrolled && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-800 font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          
          {!isEnrolled ? (
            <button
              onClick={handleEnroll}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 mt-auto"
            >
              Enroll Now
            </button>
          ) : (
            <Link 
              to={`/courses/${course.id}`}
              className="w-full py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors duration-300 text-center mt-auto"
            >
              Continue Learning
            </Link>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;