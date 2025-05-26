import React, { useState, useEffect } from 'react';
import { Question, QuizResult, UserAnswer } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface QuizProps {
  questions: Question[];
  lessonId: string;
  onComplete: (result: QuizResult) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, lessonId, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswerChecked) return; // Prevent changing after checking
    setSelectedOption(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption: selectedOption,
      isCorrect
    };
    
    setUserAnswers([...userAnswers, userAnswer]);
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    setIsAnswerChecked(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      const finalScore = ((score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0)) / questions.length) * 100;
      
      const quizResult: QuizResult = {
        lessonId,
        score: finalScore,
        completed: true,
        answers: [
          ...userAnswers,
          {
            questionId: currentQuestion.id,
            selectedOption: selectedOption || 0,
            isCorrect: selectedOption === currentQuestion.correctAnswer
          }
        ]
      };
      
      setQuizCompleted(true);
      onComplete(quizResult);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    }
  };

  const getOptionClassName = (index: number) => {
    if (!isAnswerChecked || selectedOption !== index) {
      return `p-4 border rounded-lg cursor-pointer transition-all ${
        selectedOption === index 
          ? 'bg-blue-50 border-blue-300' 
          : 'hover:bg-gray-50 border-gray-200'
      }`;
    }

    // After checking
    if (index === currentQuestion.correctAnswer) {
      return 'p-4 border border-green-500 bg-green-50 rounded-lg cursor-default';
    } else if (selectedOption === index) {
      return 'p-4 border border-red-500 bg-red-50 rounded-lg cursor-default';
    }

    return 'p-4 border border-gray-200 rounded-lg cursor-default';
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
      {!quizCompleted ? (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Quiz</h2>
              <span className="text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={getOptionClassName(index)}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-6 h-6 border rounded-full mr-3 flex items-center justify-center ${
                        selectedOption === index 
                          ? 'border-blue-500 bg-blue-500 text-white' 
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === index && (
                          <span className="text-xs">✓</span>
                        )}
                      </div>
                      <div>{option}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    selectedOption === null
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg mb-6">
            Your score: <span className="font-bold">{Math.round((score / questions.length) * 100)}%</span>
          </p>
          <div className="mb-8 w-48 h-48 mx-auto">
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - ((score / questions.length) * 283)}
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-3xl font-bold">
                {Math.round((score / questions.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;