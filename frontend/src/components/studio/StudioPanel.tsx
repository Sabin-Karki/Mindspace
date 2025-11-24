import AudioGenerator from "./audio/AudioGenerator";
import AudioGet from "./audio/AudioGet";
import FlashGet from "./flash/FlashGet";
import FlashGenerator from "./flash/FlashGenerator";
import QuizGenerator from "./quiz/QuizGenerator";
import QuizGet from "./quiz/QuizGet";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

const StudioPanel = ({closeRightSideBar, openRightSideBar} :{closeRightSideBar: () => void; openRightSideBar: () => void;}) =>{

  return(
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <h2 className="text-lg font-semibold">Studio</h2>
        <div className="flex gap-2">
          <button onClick={openRightSideBar} className="p-1.5 hover:bg-gray-200 rounded">
            <PanelRightOpen size={20} />
          </button>
          <button onClick={closeRightSideBar} className="p-1.5 hover:bg-gray-200 rounded">
            <PanelRightClose size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <h3 className="text-md font-semibold">Generation Tools</h3>
        <div className="grid grid-cols-2 gap-4">
          <FlashGenerator />
          <QuizGenerator /> 
          <AudioGenerator />
        </div>
      </div>

      <div className="flex-grow p-4 border-t overflow-y-auto">
        <h3 className="text-md font-semibold mb-4">Generated Content</h3>
        <div className="space-y-4">
          <FlashGet />
          <QuizGet /> 
          <AudioGet />
        </div>
      </div>
    </div>
  )

}

export default StudioPanel;