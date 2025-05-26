import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Image, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { isAuthenticated, currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load user data
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setBio(currentUser.bio || '');
      setProfilePicture(currentUser.profilePicture || '');
    }
  }, [currentUser]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
    
    // Reset form when canceling
    if (isEditing && currentUser) {
      setName(currentUser.name || '');
      setBio(currentUser.bio || '');
      setProfilePicture(currentUser.profilePicture || '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      updateUserProfile({
        name,
        bio,
        profilePicture
      });
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  if (!isAuthenticated || !currentUser) {
    return null; // Don't render anything if not authenticated (redirect will happen)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={handleEditToggle}
              className={`px-4 py-2 rounded-md ${
                isEditing 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition-colors`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Image size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="profilePicture"
                    type="text"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Enter a URL for your profile picture
                </p>
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-32 mx-auto md:mx-0 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {profilePicture ? (
                    <img src={profilePicture} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User size={48} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{name}</h2>
                  <div className="flex items-center justify-center md:justify-start text-gray-500 mb-4">
                    <Mail size={16} className="mr-2" />
                    <span>{currentUser.email}</span>
                  </div>
                  
                  {bio ? (
                    <p className="text-gray-700">{bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">No bio provided</p>
                  )}
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Account Details</h3>
                <p className="text-sm text-gray-600">
                  Account created: {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Not available'}
                </p>
                <p className="text-sm text-gray-600">
                  Enrolled courses: {currentUser.enrolledCourses.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;