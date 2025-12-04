import { AudioGenerator, AudioList } from "./audio";
import { FlashGenerator, FlashList } from "./flashcards";
import { QuizGenerator, QuizList } from "./quiz";
import { ReportGenerator, ReportList } from "./report";

interface StudioPanelProps {
  closeRightSideBar: () => void;
  openRightSideBar: () => void;
  isRightPanelClose: boolean;
}

const StudioPanel = ({closeRightSideBar, openRightSideBar, isRightPanelClose} : StudioPanelProps) =>{

  return(
    <>
    <div>
      <div>
        <div>Studio</div>
      </div>
      
      {/* when right panel is closed then show open button */}
      { isRightPanelClose ? (
        <button onClick={openRightSideBar}>open</button>
      ):(
        <button onClick={closeRightSideBar}>close</button>
      )}

    {/* this section generates  */}
    <div>
      <FlashGenerator />
      <QuizGenerator /> 
      <AudioGenerator />
      <ReportGenerator />
    </div>

    {/* this section gets  */}
    {/* inside this will be Get specific  */}
    <div>
      <FlashList />
      <QuizList /> 
      <AudioList />
      <ReportList />
    </div>
    </div>
    </>
  )

}

export default StudioPanel;