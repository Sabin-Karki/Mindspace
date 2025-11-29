import { useState } from "react";
import type { ICardResponse } from "../../../types";
import FlashCardPopup from "./FlashCardPopup";

//getting a specific flash card
const FlashGet = ( {flashCardDetail}: {flashCardDetail: ICardResponse} ) => {

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  // const handleGetFlashCard = async({key, data} :{ key: number; data: ICardResponse; }) =>{
  //   try {
  //     setError(null);
  //     setIsLoading(true);

  //     const response: ICardResponse = await getFlashCardByCardId(1);
  //     console.log(response);
      
  //   } catch (error: any) {
  //     const serverMessage = error?.response?.data?.message;
  //     const axiosMessage = error?.message;
  //     const message = serverMessage || axiosMessage || "Failed to fetch flashcard. Please try again.";
  //     setError(message);
  //     toast.error(message);
  //   }finally{
  //     setIsLoading(false);
  //   }
  // }

  //calculate total no. of sources this card has 
  // const calculateNumberOfSources = (flashCard: ICardResponse) =>{
   
  // }

  //clculate 
  //no of questions 
  //which number are we on 
  //show:: 1/12

const closeModal = () =>{
  console.log("close modal");
}

  return(
    <>
    {/* do we need to key here or not */}
      {/* <div key={flashCardDetail.cardOverViewId}> */} 
      <div >
        {flashCardDetail.title}
        <p>67 sources</p>

        {/*  now when this is clicked there will be a popup  showing question and answer */}
        {flashCardDetail.CardDetailResponse.map( (flashCardQA) =>(

          <FlashCardPopup 
            key={flashCardQA.cardId}
            flashCardQA={flashCardQA}
            closeModal={closeModal} />
        ))}
      </div>

    </>
  )
}

export default FlashGet;  