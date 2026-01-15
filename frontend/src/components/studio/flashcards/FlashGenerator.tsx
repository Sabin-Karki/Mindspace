import { toast } from "sonner";
import { generateFlashCard } from "../../../api/flashApi";
import { useSessionStore } from "../../../store/sessionStore";
import {  useState } from "react";
import { useFlashCardStore } from "../../../store/flashCardStore";
import type { ICardOverview, IUploadResponse } from "../../../types";
import { CreditCard } from "lucide-react";
import { useLayoutStore } from "../../../store/layoutStore";

const FlashGenerator = () => {
  
  const sessionId = useSessionStore((state) => state.sessionId);
  const sources: IUploadResponse[] = useSessionStore((state) => state.sources);
  const selectedSourceIds = useSessionStore((state) => state.selectedSourceIds);
  
  const addFlashCard = useFlashCardStore((state) => state.addFlashCard);
  const isRightPanelClose = useLayoutStore((state) => state.isRightPanelClose);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  
  const handleGenerateFlashCard = async() =>{
    try {
      setError(null);
      setIsLoading(true);
      if(!sessionId) return;

      //what if there are no uploaded sources ??
      if(sources.length === 0) {
        toast.error("No sources available. Please upload a document first.");
        return;
      }
      if(sources.length > 3){
        toast.error("Please select only 3 documents.");
        return;
      }
      let sId:number[] = [];
      if(selectedSourceIds.length === 0){
        //if nothing selected then get 3 source ids
        const sourceIds = sources.slice(0,3).map(s => s.sourceId);
        sId = sourceIds;
      }else{
        //if there is selected source ids then use it 
        sId = selectedSourceIds;
      }

      const response: ICardOverview = await generateFlashCard(sessionId, sId);
      console.log(response);
      addFlashCard(response);
      // toast.promise("");
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
    <div className="group pink-card p-2">
      <div onClick={handleGenerateFlashCard} title="Generate Flashcarrd" className="">
        <CreditCard size={18} className="text-pink-600" />
          { !isRightPanelClose &&
            <div  text-xs font-semibold text-pink-900 mb-1>FlashCard</div>
          }
      </div>
    </div>
    </>
  )
}

export default FlashGenerator;  