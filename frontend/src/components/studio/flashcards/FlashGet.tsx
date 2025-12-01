import { useState } from "react";
import type { ICardOverview } from "../../../types";
import FlashCardPopup from "./FlashCardPopup";
import Modal from "react-modal";
import { useFlashCardStore } from "../../../store/flashCardStore";
import { toast } from "sonner";
import { deleteFlashCardOverview, getFlashCardByCardId, updateFlashCardOverviewTitle } from "../../../api/flashApi";
import DeleteFlashCard from "./DeleteFlashCard";

interface FlashCardProps {
  flashCard: ICardOverview;
}

//getting a specific flash card
const FlashGet = ( {flashCard}: FlashCardProps ) => {
  
  const [localFlashCardName, setLocalFlashCardName] = useState(flashCard.title || ""); //local state
  const updateFlashCardName = useFlashCardStore((state) => state.updateFlashCardName);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setMenuId] = useState<number | null>(null);//which menu is open
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  //rename flash card
  const handleUpdateFlashCardName = async() =>{
    try {
      const response = await updateFlashCardOverviewTitle(flashCard.cardOverViewId, localFlashCardName);
      updateFlashCardName(flashCard.cardOverViewId, response.title);  //update global state after flashcard name change

      toast.success("Flashcard name updated successfully.");
    } catch (error) {
      toast.error("Failed to update flashcard name. Please try again.");
      return;
    }
  }
  

  //change local state of flash card
  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFlashCardName(e.target.value);
  }  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Enter"){
      handleUpdateFlashCardName();
      closeRenameModal();
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
    <div className="relative">
      <div onClick={ openModal } className="flex justify-between border-4">
        
        <div className="relative flex items-center" >
          {/* flash card name */}
        {isRenameModalOpen ?(
          <input type="text"
          onClick={(e) => e.stopPropagation()}
          value={localFlashCardName} 
          onChange={handleChangeCardName}
          onKeyDown={handleKeyDown} 
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
          autoFocus
          />
        ):(
          <p>
            {flashCard.title}
          </p>
        )}
        </div>

        {/* we only have 1 sources so not checking no. of sources*/}
        <p>1 sources</p>
        {/* menu options ||| rename and delete option */}
        <button         
          onClick={ (e) => { e.stopPropagation(); handleShowMenu(flashCard.cardOverViewId); } } 
          className="text-2xl text-gray-700 hover:text-amber-600 px-2 " >
          &#x22EE;
        </button>
      </div>

      {openMenuId === flashCard.cardOverViewId && (
        <>

        {/* invisible backdrop for menu // covers whole screen //closes menu on click */}
        <div className="fixed inset-0 z-10" onClick={(e) =>{ e.stopPropagation(); handleHideMenu(); }}></div>

        {/* menu options on top of invisible backdrop */}
        <div className=" absolute top-10 right-0 z-20 w-32 bg-white rounded shadow-lg border border-gray-100 " >
          <button onClick={(e) =>{ e.stopPropagation(); openDeleteModal(); handleHideMenu(); }} 
            className="w-full text-left p-2 text-sm text-red-600 hover:bg-gray-100">
            Delete
          </button>
          <button onClick={(e) =>{ e.stopPropagation(); openRenameModal(); handleHideMenu(); }} 
            className="w-full text-left p-2 text-sm text-gray-800 hover:bg-gray-100">
            Rename
          </button>
        </div>
        </>
      )}
    </div>
    
    {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal} //press esc to close
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
        className=" outline-none w-full max-w-md mx-4 overflow-hidden shadow-xl" 
      >
        <DeleteFlashCard
          closeDeleteModal={closeDeleteModal}
          cardOverViewId={flashCard.cardOverViewId}
        />
      </Modal>
    
      {/* popup modal for showing flashcard details like QnA */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal} //press esc to close
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
        className=" outline-none w-full max-w-md mx-4 overflow-hidden shadow-xl" 
      >
        <FlashCardPopup 
          cardId={flashCard.cardOverViewId}
          flashCardName={localFlashCardName}
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