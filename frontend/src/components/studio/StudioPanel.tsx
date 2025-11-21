import Audio from "./audio/AudioGenerator";
import AudioGet from "./audio/AudioGet";
import FlashGet from "./flash/FlashGet";
import Flash from "./flash/FlashGet";
import Quiz from "./quiz/QuizGenerator";
import QuizGet from "./quiz/QuizGet";

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
      <Flash />
      <Quiz /> 
      <Audio />
    </div>

    {/* this section gets  */}
    <div>
      <FlashGet />
      <QuizGet /> 
      <AudioGet />
    </div>
    </div>
    </>
  )

}

export default StudioPanel;