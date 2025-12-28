import { useState } from 'react';
import { X, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { IQuizOverviewResponse } from '../../../types'

interface QuizViewerProps {
  quiz: IQuizOverviewResponse;
  onClose: () => void;
  handleUpdateQuizName: (localQuizName: string) => Promise<void>;
}

export const QuizViewer = ({ quiz, onClose, handleUpdateQuizName }: QuizViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);
  const [localQuizCardName, setLocalQuizCardName] = useState(quiz.title || "");

  //for name rename
  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuizCardName(e.target.value);
  }  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Enter"){
      handleUpdateQuizName(localQuizCardName);
    }
  }

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const calculateScore = () => {
    return userAnswers.filter((ans, idx) => ans === quiz.questions[idx].correctAnswerIndex).length;
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(newAnswers[currentIndex + 1]);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(userAnswers[currentIndex - 1]);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(totalQuestions).fill(null));
    setIsFinished(false);
  };

  const score = calculateScore();
  const percentage = Math.round((score / totalQuestions) * 100);

  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md shadow-xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Quiz Complete!</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-8 text-center space-y-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto border-4 border-blue-600">
              <div>
                <p className="text-4xl font-bold text-blue-600">{percentage}%</p>
                <p className="text-xs text-gray-600 mt-1">Score</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-5xl font-bold text-gray-900 mb-1">{score} / {totalQuestions}</p>
              <p className="text-gray-600 font-medium text-sm">Correct Answers</p>
            </div>

            <p className="text-gray-700">
              {percentage >= 80 ? 'Excellent work! You mastered this quiz.' : percentage >= 60 ? 'Good job! Keep practicing to improve.' : 'Keep studying and try again!'}
            </p>

            <div className="flex gap-3">
              <button onClick={handleRestart} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                <RotateCcw size={18} />
                Retry
              </button>
              <button onClick={onClose} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className='flex '>
            <input type="text" 
              className='text-xl font-bold text-gray-900 focus:ring-0 '
              value={localQuizCardName} 
              onChange={handleChangeCardName} 
              onKeyDown={handleKeyDown}
            />
            <p className="text-sm text-gray-600 mt-1">Question {currentIndex + 1} of {totalQuestions}</p>
          </div>
          <button onClick={onClose} className="flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="h-1 bg-gray-200">
          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">{currentQuestion.questionText}</h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              return (
                <button key={idx} onClick={() => handleSelectAnswer(idx)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-gray-900 font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 flex justify-between items-center bg-gray-50">
          <button onClick={handlePrevious} disabled={currentIndex === 0} className="px-4 py-2 text-gray-700 hover:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent rounded-lg transition-colors flex items-center gap-2 font-medium disabled:cursor-not-allowed">
            <ChevronLeft size={18} />
            Previous
          </button>
          <button onClick={handleNext} disabled={selectedAnswer === null} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm disabled:cursor-not-allowed">
            {currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizViewer;