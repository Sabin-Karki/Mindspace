import { useState } from "react";
import { useAudioCardStore } from "../../../store/audioStore";
import type { IAudioResponseDTO } from "../../../types";
import { updateAudioTitle } from "../../../api/audioApi";
import { toast } from "sonner";
import DeleteAudioCard from "./DeleteAudioCard";
import Modal from "react-modal";
import RenameAudioCard from "./RenameAudioCard";
import AudioCardPopup from "./AudioPopup";
import { useLayoutStore } from "../../../store/layoutStore";

const AudioGet = ({audio}: {audio: IAudioResponseDTO}) =>{
  
  const updateAudioCardName = useAudioCardStore((state) => state.updateAudioCardName);
  const isRightPanelClose = useLayoutStore((state) => state.isRightPanelClose);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setMenuId] = useState<number | null>(null);//which menu is open
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //rename audio card
  const handleUpdateAudioCardName = async( localFlashCardName: string ) =>{
    try {
      const response  = await updateAudioTitle(audio.id, localFlashCardName);
      updateAudioCardName(response.id, response.title);  //update global state after flashcard name change

      toast.success("Flashcard name updated successfully.");
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      const axiosMessage = error?.message;
      const message = serverMessage || axiosMessage || "Failed to generate flashcard. Please try again.";
      setError(message);
      toast.error("Failed to update flashcard name. Please try again.");
      return;
    }
  }
  
    //show popup modal or close popup modal 
    const closeModal = () =>{
      setIsModalOpen(false);
    }
    const openModal = () =>{
      setIsModalOpen(true);
    }
  
    //handling individual menu options for flashcard
    //shows delete rename
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
  
  
  return(
  <>
  <div className="relative ">
    <div onClick={ openModal } className="flex justify-between green-hover">
      
      <div className="relative flex items-center" >
        {/* this not a popup  just editing mode flash card name */}
        {isRenameModalOpen ?(
          <RenameAudioCard 
            handleUpdateAudioCardName={handleUpdateAudioCardName}
            closeRenameModal={closeRenameModal}
            audio={audio}
          />
        ):(
          <p className="text-green-700 font-light">
            {audio.title}
          </p>
        )}
      </div>

      {!isRightPanelClose &&(
        <button         
          onClick={ (e) => { e.stopPropagation(); handleShowMenu(audio.id); } } 
          className=" flex-center three-dots " >
          &#x22EE;
        </button>
      )}
    </div>
    
    {openMenuId === audio.id && (
      <>

      {/* invisible backdrop for menu // covers whole screen //closes menu on click */}
      <div className="fixed inset-0 z-10" onClick={(e) =>{ e.stopPropagation(); handleHideMenu(); }}></div>

      {/* menu options on top of invisible backdrop */}
      <div className=" absolute top-10 right-0 z-20 w-32 bg-white rounded shadow-lg border border-gray-100 " >
        <button onClick={(e) =>{ e.stopPropagation(); openDeleteModal(); handleHideMenu(); }} 
          className="w-full text-left p-2 text-sm text-red-600 hover:bg-gray-100">
          Delete
        </button>
        {/* when rename is clicked i get old value after i renamed */}
        <button onClick={(e) =>{ e.stopPropagation(); openRenameModal(); handleHideMenu(); }} 
          className="w-full text-left p-2 text-sm text-gray-800 hover:bg-gray-100">
          Rename
        </button>
      </div>
      </>
    )}

    {/* Delete Modal */}
    <Modal
      isOpen={isDeleteModalOpen}
      onRequestClose={closeDeleteModal} //press esc to close
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      className=" outline-none w-full max-w-md mx-4 overflow-hidden shadow-xl" 
    >
      <DeleteAudioCard
        closeDeleteModal={closeDeleteModal}
        cardOverViewId={audio.id}
      />
    </Modal>
  
    {/* popup modal for showing flashcard details like QnA */}
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal} //press esc to close
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      className=" outline-none w-full max-w-md mx-4 overflow-hidden shadow-xl" 
    >
      <AudioCardPopup 
        audioId={audio.id}
        closeModal={closeModal}   
        audio={audio}
        handleUpdateAudioCardName={handleUpdateAudioCardName}
      />
    </Modal>

  </div>
  </>
    
  )
}

export default AudioGet;