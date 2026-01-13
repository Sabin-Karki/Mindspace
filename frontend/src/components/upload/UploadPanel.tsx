import { useState } from "react";
import UploadedInfo from "./UploadedInfo";
import UploadContent from "./UploadContent";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useLayoutStore } from "../../store/layoutStore";

interface IUploadPanelProps {
  closeLeftSideBar: () => void;
  openLeftSideBar: () => void;
}

const UploadPanel = ({closeLeftSideBar, openLeftSideBar}: IUploadPanelProps) =>{
  
  const isLeftPanelClose = useLayoutStore((state) => state.isLeftPanelClose); 
  
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
    <div className="h-full flex flex-col bg-bg-pri p-2" >
      
      {/* horizantal */}
      <div className="px-4 py-3 border-b border-border-pri flex items-center justify-between">
        <h2 className="text-xs font-semibold text-text-pri uppercase tracking-wider">Sources</h2>
        { isLeftPanelClose ? (
          <button onClick={openLeftSideBar} className="text-xs text-text-sec hover:text-text-tri font-medium">
            {/* this is just icon NAME NOT IMPORTANT */}
            <PanelRightClose /> 
          </button>
        ):(
          <button onClick={closeLeftSideBar} className="text-xs text-text-sec hover:text-text-tri font-medium">
            <PanelRightOpen />
          </button>
        )}
      </div>

      <div onClick={handleShowModal} className=" bg-bg-sec hover:bg-bg-sec cursor-pointer p-2 m-2 rounded-lg transition-colors">
        <button  className="text-text-sec"> + Add </button>  
      </div>
      <UploadedInfo 
        openLeftSideBar={openLeftSideBar}
      />  
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