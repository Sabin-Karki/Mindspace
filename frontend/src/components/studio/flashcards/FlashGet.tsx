import { useState } from "react";
import { getFlashCardByCardId } from "../../../api/flashApi";
import { toast } from "sonner";

//getting a specific flash card
const FlashGet = () => {

  // const cardId = 

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateFlashCard = async() =>{
    try {
      setError(null);
      setIsLoading(true);

      const response = await getFlashCardByCardId(1);
      console.log(response);
      
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      const axiosMessage = error?.message;
      const message = serverMessage || axiosMessage || "Failed to fetch flashcard. Please try again.";
      setError(message);
      toast.error(message);
    }finally{
      setIsLoading(false);
    }
  }
  return(
    <>
      <div onClick={handleGenerateFlashCard} >Get Flash</div>
    </>
  )
}

export default FlashGet;  