import { useState } from "react";
import UploadedInfo from "./UploadedInfo";
import UploadContent from "./UploadContent";

const UploadPanel = ({closeLeftSideBar, openLeftSideBar }:{closeLeftSideBar: () => void; openLeftSideBar: () => void;}) =>{
  
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
        <button onClick={closeLeftSideBar}>close</button>
        <button onClick={openLeftSideBar}>open</button>
      </div>

      <button onClick={handleShowModal}> + Add</button>
      {
        isModalOpen && (
          <UploadContent
          onClose = {handleCLoseModal}/>
        )
      }
      <UploadedInfo />  
    </div>
    </>
  )
}

export default UploadPanel;