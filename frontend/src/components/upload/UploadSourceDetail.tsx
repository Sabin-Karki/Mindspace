import { useState } from "react";
import type { IUploadResponse } from "../../types";
import { CircleChevronRight } from "lucide-react";
import Modal from "react-modal";
import DeleteUpload from "./DeleteUpload";
import RenameUpload from "./RenameUpload";
import { updateSourceTitle } from "../../api/contentApi";
import { toast } from "sonner";
import { useSessionStore } from "../../store/sessionStore";
import { useLayoutStore } from "../../store/layoutStore";

interface UploadSourceDetailProps{
  source: IUploadResponse;
  handleTitleClick: (id: any) => void;
  expandedSourceId: any;
  selectedSourceIds: any;
  handleSelectSource: (id: any) => void;
}

const UploadSourceDetail =({source, handleTitleClick, expandedSourceId, selectedSourceIds, handleSelectSource}: UploadSourceDetailProps) =>{

  const changeUploadTitle = useSessionStore( (state) => state.changeUploadTitle);
  const isLeftPanelClose = useLayoutStore((state) => state.isLeftPanelClose);

  const [openMenuId, setMenuId] = useState<number | null>(null);//which menu is open
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateUploadName = async( localUploadName: string ) =>{
    try {
      const response: IUploadResponse = await updateSourceTitle(source.sourceId, localUploadName);
      changeUploadTitle(source.sourceId, response.title);  //update global state after flashcard name change

      toast.success("Uploaded soruce title updated successfully.");
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      const axiosMessage = error?.message;
      const message = serverMessage || axiosMessage || "Failed to generate flashcard. Please try again.";
      setError(message);
      toast.error("Failed to update flashcard name. Please try again.");
      return;
    }
  }

  const handleShowMenu = (id: number) => {
    setMenuId( id === openMenuId ? null :id);
  };
  const handleHideMenu = () => {
    setMenuId(null);
  };
  const openDeleteModal = () =>{
    setIsDeleteModalOpen(true);
  }
  const closeDeleteModal = () =>{
    setIsDeleteModalOpen(false);
  }
    const openRenameModal = () => {
    setIsRenameModalOpen(true);
  }
  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
  }
 

return (
  // vertical
  <div
    key={source.sourceId}
    className=" flex flex-col py-2 hover:bg-bg-tri rounded-md px-1 "
    onClick={() => handleTitleClick(source.sourceId)} >

    {/* //horizontal */}
    <div className="flex items-center justify-between gap-2">

      {/* clickable title */}
      {/*in parent min-w-0 so it allow shrinking (turncate) */}
      <div className="relative flex items-center cursor-pointer font-medium min-w-0 flex-1" title={source.title} >

        <span className={expandedSourceId === source.sourceId ? "rotate-90 transition-transform" : "transition-transform"}>
          <CircleChevronRight />
        </span>
        {isRenameModalOpen  ? (
          <div className="truncate ml-1">

          <RenameUpload 
            handleUpdateUploadName={handleUpdateUploadName}
            closeRenameModal={closeRenameModal}
            source={source}
            />
          </div>
        ):(
          <span className=" truncate ml-1">
            {source.title}
          </span>
        )}
        {/* <span className="truncate ml-1"> {source.title} </span> */}

        {/* if left panel not close then show  */}
        {/* menu options for delete and rename*/} 
        
        <div className=" flex-center " onClick={(e) => e.stopPropagation()} >
          { !isLeftPanelClose && (
            <button 
              onClick={ () => handleShowMenu(source.sourceId) } 
              className="mx-1 flex-center w-7 h-7 hover:text-gray-500  bg-bg-tri/50 text-text-pri text-xl">
              &#x22EE;
            </button>
          )} 
          
          { source.sourceId !== null && openMenuId === source.sourceId && (
            <>
            {/* this is invisible div if user click outside menu options they click here which hides the menu options */}
            <div onClick={ (e) =>{ e.stopPropagation(); handleHideMenu(); }} className="fixed inset-0 z-10" ></div> 
              
            {/* actual options  */}
            <div className="absolute right-0 top-8 z-20 w-32 bg-bg-sec rounded shadow-lg border border-border-sec">
              <button onClick={() => {
                openDeleteModal();
                handleHideMenu();
                }} 
                className="w-full text-left p-2 text-m text-red-600 hover:bg-bg-tri">
                Delete
              </button>

              <button onClick={() => {
                openRenameModal(); 
                handleHideMenu();
                }} 
                className="w-full text-left p-2 text-m text-text-sec hover:bg-bg-tri"> 
                Rename
              </button>
            </div>
            </>
          )}
        </div>
        

      </div>
      
      {/* Checkbox */}
      <div className=" flex-center ">
        <input
          onClick={(e) => e.stopPropagation()}
          type="checkbox"
          onChange={ () => {handleSelectSource(source.sourceId)} }
          checked={selectedSourceIds.includes(source.sourceId)}//checked or not
          className="form-checkbox h-5 w-5 rounded cursor-pointer accent-green-300 hover:accent-green-300 " 
        />
      </div>

    </div>

    <div className="flex-center">
      {/* Expanded Summary - positioned outside the main flex container for proper flow */}
      {expandedSourceId === source.sourceId && (
        <p className="text-sm  mt-1 p-2 bg-bg-sec rounded-md w-full">
          {source.summary}
        </p>
      )}
    </div>


    <Modal
      isOpen={isDeleteModalOpen}
      onRequestClose={closeDeleteModal} //press esc to close
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      className=" outline-none w-full max-w-md mx-4 overflow-hidden shadow-xl" 
    >
      <DeleteUpload
        sourceId={source.sourceId}
        closeDeleteModal={closeDeleteModal}
      />
    </Modal>
  
  </div>

  )
}

export default UploadSourceDetail;