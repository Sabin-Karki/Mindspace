import { toast } from "sonner";
import {  useEffect, useState } from "react";
import { getFlashCardsBySessionId } from "../../../api/flashApi";
import { useSessionStore } from "../../../store/sessionStore";
import { useFlashCardStore } from "../../../store/flashCardStore";
import type { ICardResponse, IFlashCardOverview } from "../../../types";

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
        const response: IFlashCardOverview[] = await getFlashCardsBySessionId(sessionId);
        console.log(response);
        
        //convert??
        const flashCards: ICardResponse[] = [];
        // setFlashCards(response);
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        const axiosMessage = error?.message;
        const message = serverMessage || axiosMessage || "Failed to generate flashcard. Please try again.";
        setError(message);
        toast.error(message);
      }
    }
    handleGetAllFlashList();
  },[]);

  // const calculateNumberOfSources = (flashCard: ICardResponse) =>{
   
  // }

  return (
    <>
    <div>FlashList</div>
    { flashCards.length === 0 ? (
      <div>No flashcards found</div>

    ): flashCards.map( (flashCard) =>{

      <div key={flashCard.cardOverViewId}>
        <div>{flashCard.title}</div>
        <div>{flashCard.sourceId}</div>
        <div>{flashCard.title}</div>
      </div>
    })
    }
    </>
  )
}

export default FlashList;