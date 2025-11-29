import { useState } from "react";
import type { ICardDetailResponse, ICardResponse } from "../../../types";
import { useFlashCardStore } from "../../../store/flashCardStore";

interface FlashCardPopupProps {
  flashCardDetail: ICardResponse;
  closeModal: () => void;
}

const FlashCardPopup = ({flashCardDetail, closeModal}: FlashCardPopupProps) => {

  const flashCardName = useFlashCardStore((state) => state.flashCardName || "FlashCard");
  const [currentIndex, setCurrentIndex] = useState(0);//for index of card

  //which card to be displayed
  const cardDetails = flashCardDetail.cardDetails;
  const currentCard = cardDetails[currentIndex];


  //handle next btn
  const handleNextButton = () => {
    if(currentIndex === cardDetails.length - 1) return;
    setCurrentIndex( (prevIndex) => prevIndex + 1);
  }

  //handle prev btn
  const handlePrevButton = () => {
    if(currentIndex === 0) return;
    setCurrentIndex( (prevIndex) => prevIndex - 1);
  }

  return (
    <>
      <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-4 w-full max-w-md text-white" >
        
        <div  className="flex justify-between items-center p-2">
          <div>{flashCardName}</div>
          <div> {currentIndex+1}/{cardDetails.length} </div>
          <button onClick={closeModal} className="text-xl">&times;</button>
        </div>
        
        <div className="p-4">
          {/* {currentCard.cardId} */}
          {currentCard.question}
          {currentCard.answer}
        </div>


        <div className="flex justify-between ">
          <button onClick={handlePrevButton}>prev</button>
          <button onClick={handleNextButton}>next</button>
        </div>
      </div>
    </>
  )
} 

export default FlashCardPopup;






//notes 
  // return (
  //   <>
  //     <div onClick={closeModal} className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
  //     <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-4 w-full max-w-md text-white" >
      
  //       {/* {currentCard.cardId} */}
  //       {currentCard.question}
  //       {currentCard.answer}
  //       </div>
  //     </div>
  //   </>
  // )