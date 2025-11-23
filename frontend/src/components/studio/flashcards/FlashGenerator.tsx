import { toast } from "sonner";
import { generateFlashCard } from "../../../api/flashApi";
import { useSessionStore } from "../../../store/sessionStore";
import { useState } from "react";
import { useFlashCardStore } from "../../../store/flashCardStore";

const FlashGenerator = () => {
  
  const sessionId = useSessionStore((state) => state.sessionId);
  const addFlashCard = useFlashCardStore((state) => state.addFlashCard);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateFlashCard = async() =>{
    try {
      setError(null);
      setIsLoading(true);

      if(!sessionId) return;
      //if no source ids 
      //then find and use all sources ids of that sessionId
      //setSourceIds([1, 2, 3]);
      const response = await generateFlashCard(sessionId, [1, 2, 3]);
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