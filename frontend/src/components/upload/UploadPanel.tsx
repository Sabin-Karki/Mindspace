import { useState } from "react";
import UploadedInfo from "./UploadedInfo";
import UploadContent from "./UploadContent";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

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
    {/* vertical */}
    <div className="h-full flex flex-col bg-gray-50" >
      
      {/* horizantal */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Sources</h2>
        { isLeftPanelClose ? (
          <button onClick={openLeftSideBar} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
            <PanelRightClose />
          </button>
        ):(
          <button onClick={closeLeftSideBar} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
            <PanelRightOpen />
          </button>
        )}
      </div>

      <div onClick={handleShowModal} className="gray-hover m-2">
        <button  className="text-grey-600"> + Add </button>  
      </div>
      <UploadedInfo />  
    </div>

    {
      isModalOpen && (
        <UploadContent
        onClose = {handleCLoseModal}/>
      )
    }
    </>
  )
}

export default UploadPanel;

//  if isLeftPanelClose true show open button  
//  if add button is clicked then show popup modal toupload content 