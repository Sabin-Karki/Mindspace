import { CreditCard, FileQuestion, Music, Newspaper } from 'lucide-react';
import { AudioGenerator, AudioList } from "./audio";
import { FlashGenerator, FlashList } from "./flashcards";
import { QuizGenerator, QuizList } from "./quiz";
import { ReportGenerator, ReportList } from "./report";
import { useFlashCardStore } from '../../store/flashCardStore';
import { useQuizStore } from '../../store/quizStore';
import { useAudioCardStore } from '../../store/audioStore';
import { useReportCardStore } from '../../store/reportStore';
import { useState } from 'react';

interface StudioPanelProps {
  closeRightSideBar: () => void;
  openRightSideBar: () => void;
  isRightPanelClose: boolean;
}

const StudioPanel = ({ closeRightSideBar, openRightSideBar, isRightPanelClose }: StudioPanelProps) => {
  const flashCards = useFlashCardStore((state)=>state.flashCards);
  const quizzes=useQuizStore((state)=>state.quizzes);
  const audios=useAudioCardStore((state)=>state.audios);
  const reports=useReportCardStore((state)=>state.reports);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Studio</h2>
        {isRightPanelClose ? (
          <button onClick={openRightSideBar} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Open
          </button>
        ) : (
          <button onClick={closeRightSideBar} className="text-xs text-gray-600 hover:text-gray-700 font-medium">
            Close
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {/* generators */}
        <div className="grid grid-cols-2 gap-2 mb-6">
            <FlashGenerator />
            <QuizGenerator />
            <AudioGenerator />
            <ReportGenerator />
        </div>

        {/* lists */}
        <div className="space-y-4">
            <FlashList />
            <QuizList />
            <AudioList />
            <ReportList />
        </div>

      </div>
    </div>
  );
};

export default StudioPanel;