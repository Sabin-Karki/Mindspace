import { toast } from "sonner";
import {  useEffect, useState } from "react";
import { getFlashCardsBySessionId } from "../../../api/flashApi";
import { useSessionStore } from "../../../store/sessionStore";
import { useFlashCardStore } from "../../../store/flashCardStore";
import type { ICardOverview } from "../../../types";
import FlashGet from "./FlashGet";
import { CreditCard } from "lucide-react";
import { useLayoutStore } from "../../../store/layoutStore";

const FlashList = () => {
 
  const sessionId = useSessionStore((state) => state.sessionId);
  const setFlashCards = useFlashCardStore((state) => state.setFlashCards);
  const flashCards = useFlashCardStore((state) => state.flashCards);
  const [isExpanded, setIsExpanded] = useState(false);
  const isRightPanelClose = useLayoutStore((state) => state.isRightPanelClose);

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
      <>
      <div onClick={ handleExtendList } className="group pink-hover text-pink-600 font-medium">
          <div className="flex items-center justify-between p-2 bg-pink-100 group-hover:bg-pink-200 rounded-lg transition-colors"> 
            <CreditCard size={18}  />
              { !isRightPanelClose &&
                <span > {flashCards.length<=1?"Flashcard":"Flashcards"} </span>
              }
            <span className="px-1"> {flashCards.length} </span>
        </div>
      </div>
      </>
    )
  }

  return (
    <>
    { flashCards.length === 0 ? (
      <> 
      <div onClick={ handleCloseList } className="pink-hover font-medium text-pink-600">
        <button> &lt; Back </button>
        <div >No flashcards found</div>
      </div>
      </>
    ): (
      <>
        <div onClick={ (e) => {e.stopPropagation(); handleCloseList();} }
          className="pink-hover grid grid-cols-3 p-4 items-center font-medium text-pink-600">
          <button > &lt; Back </button>
          <span className=" text-center">
            {flashCards.length<=1?"Flashcard":"Flashcards"}
          </span>
          <div></div>
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
