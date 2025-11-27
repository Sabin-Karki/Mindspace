import { AudioGenerator, AudioList } from "./audio";
import { FlashGenerator, FlashList } from "./flashcards";
import { QuizGenerator, QuizList } from "./quiz";
import { ReportGenerator, ReportList } from "./report";

const StudioPanel = ({closeRightSideBar, openRightSideBar} :{closeRightSideBar: () => void; openRightSideBar: () => void;}) =>{

  return(
    <>
    <div>
      <div>
        <div>Studio</div>
        <button onClick={closeRightSideBar}>close</button>
        <button onClick={openRightSideBar}>open</button>
      </div>

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