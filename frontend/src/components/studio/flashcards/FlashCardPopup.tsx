import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { ICardDetailResponse, ICardOverview, ICardResponse } from "../../../types";
import { getFlashCardByCardId } from "../../../api/flashApi";
import Modal from "react-modal";

interface FlashCardPopupProps {
  cardId: number;
  closeModal: () => void;
  flashCard: ICardOverview; //only overview of card
  handleUpdateFlashCardName: (input: string) => void;
}

Modal.setAppElement("#root");

const FlashCardPopup = ( {cardId, closeModal, flashCard, handleUpdateFlashCardName}: FlashCardPopupProps) => {
  
  const [localFlashCardName, setLocalFlashCardName] = useState(flashCard.title || "");

  const [cardDetails, setCardDetails] = useState<ICardDetailResponse[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);//for index of card
  const [isShowQuestion, setIsShowQuestion] = useState(true);//for question or answer


  //fetching specific flash card using cardId 
  useEffect(() =>{
    const getFlashCard = async(cardId: number) =>{
      try {
        //get full flashcard response
        const response: ICardResponse = await getFlashCardByCardId(cardId);
        console.log(response);
        setCardDetails(response.cardDetails);
    
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        const axiosMessage = error?.message;
        const message = serverMessage || axiosMessage || "Failed to get flashcard details. Please try again.";
        toast.error(message);
      }
    }
    getFlashCard(cardId);
  },[]);
  

  //which card to be displayed
  // const cardDetails = flashCard.cardDetails;
  const currentCard: ICardDetailResponse = cardDetails[currentIndex];


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


  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFlashCardName(e.target.value);
  }  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Enter"){
      handleUpdateFlashCardName(localFlashCardName);
    }
  }
  
  const handleShowFlashCard = () => {
    setIsShowQuestion(!isShowQuestion);

  }

  if (!currentCard) return <div>Loading...</div>;

  return (
    <>
      <div onClick={(e) => e.stopPropagation()} 
        // flex flex-col: Stacks the Header, Content, and Footer vertically.
        className="bg-gray-800 rounded-lg p-4 w-full h-96 flex flex-col text-white" >
        
        <div  className="flex justify-between items-center p-2">
          <div>
            <input type="text" 
              value={localFlashCardName} 
              onChange={handleChangeCardName} 
              onKeyDown={handleKeyDown}
              />
          </div>
          <div> {currentIndex+1}/{cardDetails.length} </div>
          <button onClick={closeModal} className="text-xl">&times;</button>
        </div>
        
        {/* flex-1: Tells this div to expand and fill ALL available empty space.
         overflow-y-auto: If text is too long, a scrollbar appears INSIDE here. */}
        <div className="p-4 flex-1 overflow-y-auto" >
          {/* {currentCard.cardId} */}
         
         {/* toggle to flip */}
          {isShowQuestion ? (
            <div onClick={handleShowFlashCard}> {currentCard.question} </div>
            ):(
            <div onClick={handleShowFlashCard}> {currentCard.answer} </div>
            ) 
          }
          {/* <div onClick={handleShowFlashCard}> {currentCard.question} </div>
          <div onClick={handleShowFlashCard}> {currentCard.answer} </div> */}
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