import { toast } from "sonner";
import {  useEffect, useState } from "react";
import { getFlashCardsBySessionId } from "../../../api/flashApi";
import { useSessionStore } from "../../../store/sessionStore";
import { useFlashCardStore } from "../../../store/flashCardStore";
import type { ICardOverview } from "../../../types";
import FlashGet from "./FlashGet";

const FlashList = () => {
 
  const sessionId = useSessionStore((state) => state.sessionId);
  const setFlashCards = useFlashCardStore((state) => state.setFlashCards);
  const flashCards = useFlashCardStore((state) => state.flashCards);
  const [isExpanded, setIsExpanded] = useState(false);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() =>{
    const handleGetAllFlashList = async() =>{
      try {
        if(!sessionId) return;
        setError(null);
        setIsLoading(true);
        const response: ICardOverview[] = await getFlashCardsBySessionId(sessionId);
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


  const handleExtendList = () =>{
    setIsExpanded(true);
  }
  const handleCloseList = () =>{
    setIsExpanded(false);
  }

  //if not expanded show this Flash > 
  if(!isExpanded){
    return (
      <div onClick={ handleExtendList } className="flex" >
        <div className="font-light text-pink-600">{flashCards.length<=1?"Flashcard":"Flashcards"} </div> 
        <div className="px-1 text-pink-500">{flashCards.length}</div>
        <div> &gt; </div>
      </div>
    )
  }

  return (
    <>
    { flashCards.length === 0 ? (
      <> 
        <button onClick={ handleCloseList } className="text-pink-500"> &lt; Back </button>
        <div className="font-light text-pink-600">No flashcards found</div>
      </>
    ): (
      <>
        <div>
          <button className="text-pink-500" onClick={ (e) => {e.stopPropagation(); handleCloseList();} } > &lt; Back </button>
        </div>
        {flashCards.map( (flashCard) =>(
          <FlashGet
            key={flashCard.cardOverViewId}
            flashCard={flashCard} 
          />
        ))
        }
      </>
    )}
    </>
  )
}

export default FlashList;

// is expanded false show Flash 1 > 

// isexpanded and isflashcards.length === 0 then show no cards found

// isexpanded true then show one back button and flashcards
