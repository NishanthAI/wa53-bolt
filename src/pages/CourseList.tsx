import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';
import { Course } from '../types';

const CourseList: React.FC = () => {
  const { courses } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract unique categories from courses
  const categories = Array.from(new Set(courses.map(course => course.category)));
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    let results = [...courses];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        course => 
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      results = results.filter(course => course.category === selectedCategory);
    }
    
    // Apply difficulty filter
    if (selectedDifficulty) {
      results = results.filter(course => course.difficulty === selectedDifficulty);
    }
    
    setFilteredCourses(results);
  }, [searchTerm, selectedCategory, selectedDifficulty, courses]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Courses</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover a wide range of courses to enhance your skills and advance your career. 
            Filter by category or search for specific topics.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-2/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <button 
              onClick={toggleFilter}
              className="md:hidden w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>
            
            <div className="hidden md:flex gap-4 items-center w-full md:w-1/3 justify-end">
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Levels</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              
              {(selectedCategory || selectedDifficulty || searchTerm) && (
                <button 
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile filters */}
          {isFilterOpen && (
            <div className="md:hidden mt-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Levels</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Clear Filters
                </button>
                <button 
                  onClick={toggleFilter}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
            {(selectedCategory || selectedDifficulty) && ' with the selected filters'}
          </p>
        </div>
        
        {/* Course grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any courses matching your search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;