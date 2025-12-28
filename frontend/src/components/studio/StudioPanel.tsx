import { CreditCard, FileQuestion, Music, Newspaper } from 'lucide-react';
import { AudioGenerator, AudioList } from "./audio";
import { FlashGenerator, FlashList } from "./flashcards";
import { QuizGenerator, QuizList } from "./quiz";
import { ReportGenerator, ReportList } from "./report";
import { useFlashCardStore } from '../../store/flashCardStore';
import { useQuizStore } from '../../store/quizStore';
import { useAudioCardStore } from '../../store/audioStore';
import { useReportCardStore } from '../../store/reportStore';

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
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="group bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-3 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-pink-100 group-hover:bg-pink-200 rounded-lg transition-colors">
                <CreditCard size={18} className="text-pink-600" />
              </div>
              <p className='p-1 text-pink-500'>{flashCards.length}</p>
            </div>
            <h3 className="text-xs font-semibold text-pink-900 mb-1">Flashcards</h3>
            <FlashGenerator />
          </div>

          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
                <FileQuestion size={18} className="text-blue-600" />
              </div>
              <p className='p-1 text-xs text-blue-500 font-medium'>{quizzes.length}</p>
            </div>
            <h3 className="text-xs font-semibold text-blue-900 mb-1">Quiz</h3>
            <QuizGenerator />
          </div>

          <div className="group bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors">
                <Music size={18} className="text-green-600" />
              </div>
              <p className='p-1 text-xs text-green-500 font-medium'>{audios.length}</p>
            </div>
            <h3 className="text-xs font-semibold text-green-900 mb-1">Audio</h3>
            <AudioGenerator />
          </div>

          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors">
                <Newspaper size={18} className="text-purple-600" />
              </div>
              <p className='p-1 text-xs text-purple-500 font-medium'>{reports.length}</p>
            </div>
            <h3 className="text-xs font-semibold text-purple-900 mb-1">Report</h3>
            <ReportGenerator />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">Flashcards</h3>
            <FlashList />
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">Quizzes</h3>
            <QuizList />
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">Audio</h3>
            <AudioList />
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">Reports</h3>
            <ReportList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioPanel;