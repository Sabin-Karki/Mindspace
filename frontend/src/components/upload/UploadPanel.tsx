import { useState } from "react";
import UploadedInfo from "./UploadedInfo";
import UploadContent from "./UploadContent";

const UploadPanel = () =>{
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowModal = () => {
    setIsModalOpen(true);
  }

  const handleCLoseModal = () => {
    setIsModalOpen(false);
  }

  return(
    <>
    <div>Sources</div>
    
    <button onClick={handleShowModal}> + Add</button>
    {
      isModalOpen && (
        <UploadContent
        onClose = {handleCLoseModal}/>
      )
    }
    
    <UploadedInfo />  

    </>
  )
}

export default UploadPanel;