import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, Award, Users } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';

const Home: React.FC = () => {
  const { courses } = useCourses();
  const featuredCourses = courses.slice(0, 3); // Get first 3 courses for featured section

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-fadeIn">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Unlock Your Potential with Online Learning
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Access high-quality courses taught by industry experts. Learn at your own pace and transform your career.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="px-8 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Explore Courses
              </Link>
              <Link
                to="/signup"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                Join For Free
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden md:block absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
          <div className="w-64 h-64 rounded-full bg-blue-500 opacity-20"></div>
        </div>
        <div className="hidden md:block absolute top-20 right-20">
          <div className="w-32 h-32 rounded-full bg-indigo-400 opacity-20"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                <BookOpen size={24} />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">100+</h3>
              <p className="text-gray-600">Courses Available</p>
            </div>
            
            <div className="p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full">
                <Users size={24} />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">25K+</h3>
              <p className="text-gray-600">Active Students</p>
            </div>
            
            <div className="p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full">
                <Video size={24} />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">500+</h3>
              <p className="text-gray-600">Video Lessons</p>
            </div>
            
            <div className="p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-amber-100 text-amber-600 rounded-full">
                <Award size={24} />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">15K+</h3>
              <p className="text-gray-600">Certificates Issued</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our most popular courses and start your learning journey today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              to="/courses"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our learning platform is designed to make online education simple, effective, and enjoyable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Your Course</h3>
              <p className="text-gray-600">
                Browse our catalog of professional courses taught by industry experts.
              </p>
            </div>
            
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Learn at Your Pace</h3>
              <p className="text-gray-600">
                Access course content anytime, anywhere and learn at your own convenience.
              </p>
            </div>
            
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Certified</h3>
              <p className="text-gray-600">
                Complete your course, pass assessments, and receive your certification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning on our platform.
            Create your free account now!
          </p>
          <Link
            to="/signup"
            className="px-8 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 inline-block"
          >
            Sign Up For Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;