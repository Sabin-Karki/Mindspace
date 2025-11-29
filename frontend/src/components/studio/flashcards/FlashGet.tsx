import { useState } from "react";
import type { ICardResponse } from "../../../types";
import FlashCardPopup from "./FlashCardPopup";
import Modal from "react-modal";
import { useFlashCardStore } from "../../../store/flashCardStore";
import { toast } from "sonner";
import { deleteFlashCardOverview, updateFlashCardOverviewTitle } from "../../../api/flashApi";
import { useSessionStore } from "../../../store/sessionStore";

interface FlashCardProps {
  flashCard: ICardResponse;
}

//getting a specific flash card
const FlashGet = ( {flashCard}: FlashCardProps ) => {

  const setFlashCardName = useFlashCardStore((state) => state.setFlashCardName);
  const flashCardName = useFlashCardStore((state) => state.flashCardName || "FlashCard");//global state
  const [localFlashCardName, setLocalFlashCardName] = useState(flashCardName || ""); //local state
  const updateFlashCardName = useFlashCardStore((state) => state.updateFlashCardName);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setMenuId] = useState<number | null>(null);//which menu is open
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  //clculate 
  //no of questions 
  //which number are we on 
  //show:: 1/12

  //rename flash card
  const handleUpdateFlashCardName = async() =>{
    try {
      const response = await updateFlashCardOverviewTitle(flashCard.cardOverViewId, localFlashCardName);
      updateFlashCardName(flashCard.cardOverViewId, response.title);

      toast.success("Flashcard name updated successfully.");
    } catch (error) {
      toast.error("Failed to update flashcard name. Please try again.");
      return;
    }
  }
  
  //delete flash card
  const handleDeleteChatSession = async() =>{
    try {
      await deleteFlashCardOverview(flashCard.cardOverViewId);
      toast.success("Chat deleted successfully.");

      //update state
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete chat. Please try again.");
    }
  }



  //change local state of flash card
  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFlashCardName(e.target.value);
  }  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Enter"){
      handleUpdateFlashCardName();
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

  const handleShowDeleteModal = () =>{
    setIsDeleteModalOpen(true);
  }

  const handleHideDeleteModal = () =>{
    setIsDeleteModalOpen(false);
  }

  const handleShowRenameModal = () =>{
    setIsRenameModalOpen(true);
  }
 const handleHideRenameModal = () =>{
    setIsRenameModalOpen(false);
  }

  //when clicked it changes global state of flashcard title
  const handleSetFlashCardName = () => {
    setFlashCardName(flashCard.title);
  }

  return(
    <>
      <div onClick={ () => {openModal(); handleSetFlashCardName(); }} className="flex justify-between border-4">
        {flashCard.title}
        {/* we only have 1 sources so not checking no. of sources*/}
        <p>1 sources</p>
        <button 
          // this shows a drop menu with rename and delete option
            onClick={ () => handleShowMenu(flashCard.cardOverViewId) } 
            className="text-2xl text-gray-700 hover:text-amber-600 px-2 " >
            &#x22EE;
          </button>

          {openMenuId === flashCard.cardOverViewId && (
            <div className="absolute bg-white border border-gray-300 rounded-md shadow-md z-50" >
              <div>rename</div>
              <div>delete</div>
            </div>
          )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal} //press esc to close
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
        className=" outline-none w-full max-w-md mx-4 overflow-hidden shadow-xl" 
        >

        <FlashCardPopup 
          flashCard={flashCard}
          closeModal={closeModal}     
            
        />
      </Modal>

    </>
  )
}

export default FlashGet;  


//notes 
//prev modal way
//  return(
//     <>
//       <div onClick={openModal}>
//         {flashCardDetail.title}
//         {/* we can only have 1 sources */}
//         {/* so not checking no. of sources */}
//         <p>1 sources</p>
//       </div>

//       {isModalOpen && (
//         <FlashCardPopup 
//           flashCardDetail={flashCardDetail.cardDetails}
//           closeModal={closeModal} />
//       )}
//     </>
//   )