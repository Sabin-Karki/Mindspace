import { useState } from "react";
import UploadedInfo from "./UploadedInfo";
import UploadContent from "./UploadContent";

interface IUploadPanelProps {
  closeLeftSideBar: () => void;
  openLeftSideBar: () => void;
  isLeftPanelClose: boolean;
}

const UploadPanel = ({closeLeftSideBar, openLeftSideBar, isLeftPanelClose }: IUploadPanelProps) =>{
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowModal = () => {
    setIsModalOpen(true);
  }

  const handleCLoseModal = () => {
    setIsModalOpen(false);
  }

  return(
    <>
    <div>
      <div>
        <div>Sources</div>

        { isLeftPanelClose ? (
          <>
          {/* if isLeftPanelClose true show open button  */}
          {/* if add button is clicked then show popup modal toupload content */}
          <div className="flex flex-col">

          <button onClick={openLeftSideBar}>open</button>
          <button onClick={handleShowModal} className="bg-green-400"> +</button>
          </div>
          </>
        ):(
          <>
          {/* if isLeftPanelClose is not true then show close button  */}
          {/* if add button is clicked then show popup modal toupload content */}
          <div className="flex flex-col">
            <button onClick={closeLeftSideBar}>close</button>
            <button onClick={handleShowModal} className="bg-green-400"> + Add </button>  
          </div>

          {/* if left panel is open then show upload info  */}
          <UploadedInfo />  
          </>
        )}
      </div>


      {
        isModalOpen && (
          <UploadContent
          onClose = {handleCLoseModal}/>
        )
      }

    </div>
    </>
  )
}

export default UploadPanel;