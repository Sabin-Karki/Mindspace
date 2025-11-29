import { toast } from "sonner";
import {  useEffect, useState } from "react";
import { getFlashCardsBySessionId } from "../../../api/flashApi";
import { useSessionStore } from "../../../store/sessionStore";
import { useFlashCardStore } from "../../../store/flashCardStore";
import type { ICardResponse } from "../../../types";
import FlashGet from "./FlashGet";

const FlashList = () => {
 
  const sessionId = useSessionStore((state) => state.sessionId);
  const flashCards = useFlashCardStore((state) => state.flashCards);
  const setFlashCards = useFlashCardStore((state) => state.setFlashCards);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() =>{
    const handleGetAllFlashList = async() =>{
      try {
        if(!sessionId) return;
        setError(null);
        setIsLoading(true);
        const response: ICardResponse[] = await getFlashCardsBySessionId(sessionId);
        console.log(response);
        
        setFlashCards(response);
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        const axiosMessage = error?.message;
        const message = serverMessage || axiosMessage || "Failed to generate flashcard. Please try again.";
        setError(message);
        toast.error(message);
      }finally{
        setIsLoading(false);
      }
    }
    handleGetAllFlashList();
  },[sessionId ]);


  return (
    <>
    <div>FlashList</div>
    { flashCards.length === 0 ? (
      <div>No flashcards found</div>

      ): flashCards.map( (flashCard) =>(
        //display all flash cards 
        <FlashGet
          key={flashCard.cardOverViewId}
          flashCardDetail={flashCard} />
      ))
    }
    </>
  )
}

export default FlashList;





//notes
// flashCards.map((flashCard) => {
//    <FlashGet ... /> // This returns undefined!
// })
// You have a syntax error in your .map().
//  When using curly braces {} inside a map, you must explicitly write return.
//  Alternatively, use parentheses () for an implicit return.

//what is emplicit return and implicit return


