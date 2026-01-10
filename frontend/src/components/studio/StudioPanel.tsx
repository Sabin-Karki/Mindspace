import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { AudioGenerator, AudioList } from "./audio";
import { FlashGenerator, FlashList } from "./flashcards";
import { QuizGenerator, QuizList } from "./quiz";
import { ReportGenerator, ReportList } from "./report";
import { useLayoutStore } from '../../store/layoutStore';


interface StudioPanelProps {
  closeRightSideBar: () => void;
  openRightSideBar: () => void;
}

const StudioPanel = ({ closeRightSideBar, openRightSideBar }: StudioPanelProps) => {

  const isRightPanelClose = useLayoutStore((state) => state.isRightPanelClose); 

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Studio</h2>
        { isRightPanelClose ? (
          <button onClick={openRightSideBar} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
            <PanelRightOpen />
          </button>
        ):(
          <button onClick={closeRightSideBar} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
            <PanelRightClose />
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
        <div className="space-y-4" onClick={openRightSideBar}>
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