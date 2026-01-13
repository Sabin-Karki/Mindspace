import { useState } from 'react';
import { X, RotateCcw, ChevronLeft, ChevronRight, Check, X as XIcon } from 'lucide-react';
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
  
  const handleBlur = () => {
    setLocalQuizCardName(localQuizCardName);
    onClose();
  };

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
        <div onClick={(e) => e.stopPropagation()} className="bg-bg-pri rounded-2xl w-full max-w-md shadow-xl">
          <div className="flex justify-between items-center p-6 border-b border-border-pri">
            <h2 className="text-2xl font-bold text-text-pri">Quiz Complete!</h2>
            <button onClick={onClose} className="text-text-sec hover:text-text-tri transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-8 text-center space-y-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto border-4 border-blue-600">
              <div>
                <p className="text-4xl font-bold text-blue-600">{percentage}%</p>
                <p className="text-xs text-text-sec mt-1">Score</p>
              </div>
            </div>

            <div className="bg-bg-pri rounded-xl p-6">
              <p className="text-5xl font-bold text-text-pri mb-1">{score} / {totalQuestions}</p>
              <p className="text-text-sec font-medium text-sm">Correct Answers</p>
            </div>

            <p className="text-text-pri">
              {percentage >= 80 ? 'Excellent work! You mastered this quiz.' : percentage >= 60 ? 'Good job! Keep practicing to improve.' : 'Keep studying and try again!'}
            </p>

            <div className="flex gap-3">
              <button onClick={handleRestart} className="flex-1 px-4 py-3 bg-bg-pri hover:bg-bg-sec text-text-pri font-medium rounded-xl transition-colors flex-center gap-2">
                <RotateCcw size={18} />
                Retry
              </button>
              <button onClick={onClose} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-text-pri font-medium rounded-xl transition-colors shadow-sm">
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
      <div onClick={(e) => e.stopPropagation()} className="bg-bg-pri rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-border-sec">
          <div className='flex '>
            <input type="text" 
              className='input-pri'
              value={localQuizCardName} 
              onChange={handleChangeCardName} 
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
            />
            <p className="text-sm text-text-sec mt-1">Question {currentIndex + 1} of {totalQuestions}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-bg-sec hover:bg-bg-tri rounded-lg  transition-colors" >
            <X size={24} />
          </button>
        </div>

        <div className="h-1 bg-bg-sec">
          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 text-text-sec bg-bg-sec">
          <h3 className="text-xl font-semibold text-text-pri mb-6 leading-relaxed">{currentQuestion.questionText}</h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQuestion.correctAnswerIndex;
              const showFeedback = selectedAnswer !== null;
              
              let borderColor = 'border-border-sec';
              let bgColor = '';
              let showIcon = false;
              let iconColor = '';
              let icon = null;
              
              if (showFeedback) {
                if (isCorrect) {
                  borderColor = 'border-4 border-green-500';
                  bgColor = 'bg-green-50';
                  showIcon = true;
                  iconColor = 'text-green-600';
                  icon = <Check size={20} />;
                } else if (isSelected && !isCorrect) {
                  borderColor = 'border-4 border-red-500';
                  bgColor = 'bg-red-50';
                  showIcon = true;
                  iconColor = 'text-red-600';
                  icon = <XIcon size={20} />;
                }
              } else if (isSelected) {
                borderColor = 'border-blue-500';
                bgColor = 'bg-blue-50';
              }
              
              return (
                <button 
                  key={idx} 
                  onClick={() => handleSelectAnswer(idx)} 
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all 
                    ${borderColor} ${bgColor} ${selectedAnswer !== null ? 'cursor-default' : 
                    'hover:border-blue-300 hover:bg-bg-pri/50'}`}
                >
                  <div className="flex items-center gap-3 ">
                    {/* options A B C D */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 
                        ${showFeedback && isCorrect ? 'bg-green-600 text-white' :
                        showFeedback && isSelected && !isCorrect ? 'bg-red-600 text-white' :
                        isSelected && !showFeedback ? 'bg-blue-600 text-white' :
                        'bg-gray-200 text-gray-700'}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    {/* actual otpion */}
                    <span className=" font-medium flex-1 ">{option}</span>
                    {showFeedback && (isCorrect || (isSelected && !isCorrect)) && (
                      <div className={iconColor}>
                        {icon}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border-sec p-4 flex justify-between items-center text-text-pri">
          <button onClick={handlePrevious} disabled={currentIndex === 0} 
            className="px-4 py-2 bg-bg-sec text-text-sec hover:bg-bg-tri
               disabled:bg-bg-sec disabled:text-text-sec/50 disabled:hover:bg-transparent
              rounded-lg transition-colors flex items-center gap-2 font-medium disabled:cursor-not-allowed">
            <ChevronLeft size={18} />
            Previous
          </button>
          <button onClick={handleNext} disabled={selectedAnswer === null} 
            className="px-6 py-2 bg-blue-600 text-text-pri hover:bg-blue-700 
              disabled:bg-bg-sec disabled:text-text-sec disabled:hover:bg-transparent
              rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm disabled:cursor-not-allowed">
            {currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizViewer;