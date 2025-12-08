import { useState } from "react";
import { useSessionStore } from "../../../store/sessionStore";
import type { IAudioResponseDTO } from "../../../types";
import { generateAudioOverview } from "../../../api/audioApi";
import { toast } from "sonner";

const AudioGenerator = () =>{
  
  const sessionId = useSessionStore((state) => state.sessionId);
  const selectedSourceIds = useSessionStore((state) => state.selectedSourceIds);
  const [audioCards, setAudioCards] = useState<IAudioResponseDTO>();

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
 
  const handleGenerateAudio = async() =>{
    try {
      setError(null);
      setIsLoading(true);
      if(!sessionId) return;

      let sId: number;

      //only source id is needed for audio generation
      //if there is no selected source or more than 1 // show error
      if(selectedSourceIds.length === 0 || selectedSourceIds.length > 1){
        toast.message("Please select only one source");
        return;
      }else{
        sId = selectedSourceIds[0];
      }

      const response: IAudioResponseDTO = await generateAudioOverview(sId);
      console.log(response);
      setAudioCards(response);

      // toast.promise("");
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      const axiosMessage = error?.message;
      const message = serverMessage || axiosMessage || "Failed to generate audio. Please try again.";
      setError(message);
      toast.error(message);
    }finally{
      setIsLoading(false);
    }
  }

  return(
    <>
      <div onClick={handleGenerateAudio}>Audio</div>
    </>
  )
}

export default AudioGenerator;