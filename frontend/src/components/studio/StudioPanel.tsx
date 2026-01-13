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
    <div className="h-full flex flex-col bg-bg-pri">
      <div className="px-4 py-3 border-b border-border-pri flex items-center justify-between">
        <h2 className="text-xs font-semibold text-text-pri uppercase tracking-wider">Studio</h2>
        { isRightPanelClose ? (
          <button onClick={openRightSideBar} className="text-xs text-text-sec hover:text-text-tri font-medium">
            <PanelRightOpen />
          </button>
        ):(
          <button onClick={closeRightSideBar} className="text-xs text-text-sec hover:text-text-tri font-medium">
            <PanelRightClose />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {/* generators */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <FlashGenerator />
          <QuizGenerator />
          <AudioGenerator />
          <ReportGenerator />
        </div>

        <div className='border-b border-border-sec m-2 '></div>
          {/* lists */}
          <div className="space-y-2" onClick={openRightSideBar}>
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