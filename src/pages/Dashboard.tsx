import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Calendar, BarChart, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';

const Dashboard: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { getEnrolledCourses, userProgress } = useCourses();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const enrolledCourses = getEnrolledCourses();

  const getRecentActivity = () => {
    if (!currentUser) return [];
    
    const userCourseProgress = userProgress.filter(p => p.userId === currentUser.id);
    
    // Sort by last accessed, most recent first
    return userCourseProgress.sort((a, b) => {
      return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
    }).slice(0, 3); // Get top 3
  };

  const recentActivity = getRecentActivity();

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (!isAuthenticated || !currentUser) {
    return null; // Don't render anything if not authenticated (redirect will happen)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
              <p className="opacity-90">Here's what's happening with your learning journey.</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/courses"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-opacity-90 transition-colors duration-300"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main dashboard content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - My Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Courses</h2>
                <Link to="/courses" className="text-blue-600 text-sm hover:text-blue-800 transition-colors">
                  View All
                </Link>
              </div>
              
              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.map(course => (
                    <CourseCard key={course.id} course={course} showProgress={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't enrolled in any courses yet.
                  </p>
                  <Link
                    to="/courses"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Right column - Stats & Activity */}
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Learning Stats</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 mb-3 bg-blue-100 rounded-full text-blue-600">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {enrolledCourses.length}
                  </h3>
                  <p className="text-sm text-gray-600">Enrolled Courses</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 mb-3 bg-green-100 rounded-full text-green-600">
                    <Award size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {userProgress.filter(p => p.userId === currentUser.id && p.overallProgress === 100).length}
                  </h3>
                  <p className="text-sm text-gray-600">Completed Courses</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 mb-3 bg-purple-100 rounded-full text-purple-600">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {userProgress.reduce((total, progress) => {
                      if (progress.userId === currentUser.id) {
                        return total + progress.completedLessons.length;
                      }
                      return total;
                    }, 0)}
                  </h3>
                  <p className="text-sm text-gray-600">Completed Lessons</p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 mb-3 bg-yellow-100 rounded-full text-yellow-600">
                    <BarChart size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {userProgress.reduce((total, progress) => {
                      if (progress.userId === currentUser.id) {
                        return total + progress.quizResults.length;
                      }
                      return total;
                    }, 0)}
                  </h3>
                  <p className="text-sm text-gray-600">Quizzes Completed</p>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const course = enrolledCourses.find(c => c.id === activity.courseId);
                    return course ? (
                      <div key={`${activity.courseId}_${index}`} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-800">{course.title}</h3>
                            <p className="text-sm text-gray-500">
                              Last accessed {formatDate(activity.lastAccessed)}
                            </p>
                          </div>
                          <div className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-1">
                            {activity.overallProgress}% Complete
                          </div>
                        </div>
                        <ProgressBar progress={activity.overallProgress} />
                        <div className="mt-2 text-right">
                          <Link 
                            to={`/courses/${course.id}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Continue Learning
                          </Link>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent activity to display
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;