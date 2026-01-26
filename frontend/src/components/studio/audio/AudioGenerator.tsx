import { useState } from "react";
import { useSessionStore } from "../../../store/sessionStore";
import type { IAudioResponseDTO, IUploadResponse } from "../../../types";
import { generateAudioOverview } from "../../../api/audioApi";
import { toast } from "sonner";
import { Loader, Music } from "lucide-react";
import { useLayoutStore } from "../../../store/layoutStore";

const AudioGenerator = () =>{
  
  const sessionId = useSessionStore((state) => state.sessionId);
  const sources: IUploadResponse[] = useSessionStore((state) => state.sources);
  const selectedSourceIds = useSessionStore((state) => state.selectedSourceIds);
  const [audioCards, setAudioCards] = useState<IAudioResponseDTO>();
  const isRightPanelClose = useLayoutStore((state) => state.isRightPanelClose);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
 
  const handleGenerateAudio = async() =>{
    try {
      setError(null);
      setIsLoading(true);
      if(!sessionId) return;

      if(sources.length === 0) {
        toast.error("No sources available. Please upload a document first.");
        return;
      }

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
    <div className="group green-card p-2">
        <div onClick={handleGenerateAudio} title="Generate Audio" className="">
          <Music size={18} className="text-green-600" />
          { isLoading && (
            <Loader  className="animate-spin text-green-600"/>
          )}
          { !isRightPanelClose &&
            <div  text-xs font-semibold text-pink-900 mb-1>Audio</div>
          }
        </div>
      </div>
    </>
  )
}

export default AudioGenerator;