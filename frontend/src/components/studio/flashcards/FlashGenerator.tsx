import { toast } from "sonner";
import { generateFlashCard } from "../../../api/flashApi";
import { useSessionStore } from "../../../store/sessionStore";
import {  useState } from "react";
import { useFlashCardStore } from "../../../store/flashCardStore";
import type { ICardOverview, IUploadResponse } from "../../../types";

const FlashGenerator = () => {
  
  const sessionId = useSessionStore((state) => state.sessionId);
  const sources: IUploadResponse[] = useSessionStore((state) => state.sources);
  const selectedSourceIds = useSessionStore((state) => state.selectedSourceIds);
  
  const addFlashCard = useFlashCardStore((state) => state.addFlashCard);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  
  const handleGenerateFlashCard = async() =>{
    try {
      setError(null);
      setIsLoading(true);
      if(!sessionId) return;

      let sId:number[] = [];
      if(selectedSourceIds.length === 0){
        //if nothing selected then get all source ids
        const sourceIds = sources.map(s => s.sourceId);
        sId = sourceIds;
      }else{
        //if there is selected source ids then use it 
        sId = selectedSourceIds;
      }

      const response: ICardOverview = await generateFlashCard(sessionId, sId);
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