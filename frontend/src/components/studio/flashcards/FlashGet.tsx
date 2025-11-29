import { useState } from "react";
import type { ICardResponse } from "../../../types";
import FlashCardPopup from "./FlashCardPopup";
import Modal from "react-modal";
import { useFlashCardStore } from "../../../store/flashCardStore";

interface FlashCardProps {
  flashCard: ICardResponse;
}

//getting a specific flash card
const FlashGet = ( {flashCard}: FlashCardProps ) => {

  const setFlashCardName = useFlashCardStore((state) => state.setFlashCardName);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  //clculate 
  //no of questions 
  //which number are we on 
  //show:: 1/12

  const closeModal = () =>{
    setIsModalOpen(false);
  }
  const openModal = () =>{
    setIsModalOpen(true);
  }
  const handleSetFlashCardName = () => {
  setFlashCardName(flashCard.title);
  }

  return(
    <>
      <div onClick={ () => {openModal(); handleSetFlashCardName(); }} className="flex justify-between border-4">
        {flashCard.title}
        {/* we only have 1 sources so not checking no. of sources*/}
        <p>1 sources</p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal} //press esc to close
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
        className="bg-gray-800 rounded-lg outline-none w-full max-w-md mx-4 overflow-hidden shadow-xl" 
        >

        <FlashCardPopup 
          flashCardDetail={flashCard}
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