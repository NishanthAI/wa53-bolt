import { Course, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development, including HTML, CSS, and JavaScript. Build your first responsive website and understand core concepts.',
    instructor: 'Sarah Johnson',
    thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '8 weeks',
    difficulty: 'Beginner',
    category: 'Web Development',
    rating: 4.7,
    modules: [
      {
        id: 'm1',
        title: 'HTML Fundamentals',
        lessons: [
          {
            id: 'l1',
            title: 'Introduction to HTML',
            type: 'video',
            duration: '15:30',
            content: {
              videoId: 'qz0aGYrrlhU',
              description: 'Learn the basics of HTML and how to structure a webpage.'
            }
          },
          {
            id: 'l2',
            title: 'HTML Quiz',
            type: 'quiz',
            content: {
              questions: [
                {
                  id: 'q1',
                  text: 'What does HTML stand for?',
                  options: [
                    'Hyper Text Markup Language',
                    'Highly Typed Modern Language',
                    'Home Tool Markup Language',
                    'Hyper Transfer Method Language'
                  ],
                  correctAnswer: 0
                },
                {
                  id: 'q2',
                  text: 'Which tag is used to create a hyperlink?',
                  options: ['<link>', '<a>', '<href>', '<p>'],
                  correctAnswer: 1
                }
              ]
            }
          }
        ]
      },
      {
        id: 'm2',
        title: 'CSS Styling',
        lessons: [
          {
            id: 'l3',
            title: 'CSS Basics',
            type: 'video',
            duration: '18:45',
            content: {
              videoId: '1PnVor36_40',
              description: 'Learn how to style your HTML elements with CSS.'
            }
          },
          {
            id: 'l4',
            title: 'CSS Quiz',
            type: 'quiz',
            content: {
              questions: [
                {
                  id: 'q3',
                  text: 'Which property is used to change the background color?',
                  options: [
                    'color',
                    'bgcolor',
                    'background-color',
                    'background'
                  ],
                  correctAnswer: 2
                },
                {
                  id: 'q4',
                  text: 'Which CSS property controls the text size?',
                  options: ['font-size', 'text-size', 'font-style', 'text-style'],
                  correctAnswer: 0
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Advanced React Development',
    description: 'Take your React skills to the next level. Learn about hooks, context API, and advanced state management techniques.',
    instructor: 'Michael Chen',
    thumbnail: 'https://images.pexels.com/photos/5483071/pexels-photo-5483071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '10 weeks',
    difficulty: 'Advanced',
    category: 'JavaScript Frameworks',
    rating: 4.9,
    modules: [
      {
        id: 'm3',
        title: 'React Hooks',
        lessons: [
          {
            id: 'l5',
            title: 'Understanding useState and useEffect',
            type: 'video',
            duration: '22:15',
            content: {
              videoId: 'TNhaISOUy6Q',
              description: 'Learn about the most commonly used React hooks and how to implement them effectively.'
            }
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Python for Data Science',
    description: 'Explore data analysis and visualization techniques using Python. Learn libraries such as pandas, numpy, and matplotlib.',
    instructor: 'Alex Rodriguez',
    thumbnail: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '12 weeks',
    difficulty: 'Intermediate',
    category: 'Data Science',
    rating: 4.5,
    modules: [
      {
        id: 'm4',
        title: 'Introduction to Python',
        lessons: [
          {
            id: 'l6',
            title: 'Python Basics',
            type: 'video',
            duration: '19:30',
            content: {
              videoId: 'kqtD5dpn9C8',
              description: 'Learn the fundamentals of Python programming language.'
            }
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'UX/UI Design Fundamentals',
    description: 'Learn the principles of user experience and interface design. Create wireframes, prototypes, and understand user research.',
    instructor: 'Emily Parker',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    duration: '6 weeks',
    difficulty: 'Beginner',
    category: 'Design',
    rating: 4.6,
    modules: [
      {
        id: 'm5',
        title: 'Design Thinking',
        lessons: [
          {
            id: 'l7',
            title: 'Introduction to UX Design',
            type: 'video',
            duration: '17:20',
            content: {
              videoId: 'v4PUm0HbRtU',
              description: 'Understanding the basics of user experience design and the design thinking process.'
            }
          }
        ]
      }
    ]
  }
];

export const createDefaultUser = (): User => {
  return {
    id: uuidv4(),
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123',
    profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    bio: 'Enthusiastic learner',
    enrolledCourses: []
  };
};

// Helper function to get a demo account
export const getDemoUser = (): User | null => {
  const storedUser = localStorage.getItem('demo_user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }

  const newUser = createDefaultUser();
  localStorage.setItem('demo_user', JSON.stringify(newUser));
  return newUser;
};

// Initialize courses in localStorage if not already present
export const initializeMockData = () => {
  if (!localStorage.getItem('courses')) {
    localStorage.setItem('courses', JSON.stringify(mockCourses));
  }
  
  // Initialize demo user if not exists
  if (!localStorage.getItem('demo_user')) {
    localStorage.setItem('demo_user', JSON.stringify(createDefaultUser()));
  }
};