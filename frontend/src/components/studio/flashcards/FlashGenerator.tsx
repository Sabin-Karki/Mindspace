import { toast } from "sonner";
import { generateFlashCard } from "../../../api/flashApi";
import { useSessionStore } from "../../../store/sessionStore";
import { useState } from "react";
import { useFlashCardStore } from "../../../store/flashCardStore";
import type { IUploadResponse } from "../../../types";

const FlashGenerator = () => {
  
  const sessionId = useSessionStore((state) => state.sessionId);
  const addFlashCard = useFlashCardStore((state) => state.addFlashCard);

  const sources: IUploadResponse[] = useSessionStore((state) => state.sources);
  const sourceIds = sources.map(s => s.sourceId);//getting all sources ids of that sessionId
  
  
  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  
  const handleGenerateFlashCard = async() =>{
    try {
      setError(null);
      setIsLoading(true);

      if(!sessionId) return;

      //for betterness

      //if no source ids 
      //then find and use all sources ids of that sessionId

      //generate flash card using selecting source ids

      const response = await generateFlashCard(sessionId, sourceIds);
      console.log(response);
      
      addFlashCard(response);
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

  return(
    <>
      <div onClick={handleGenerateFlashCard}>Flash</div>
    </>
  )
}

export default FlashGenerator;  