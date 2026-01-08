import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSessionStore } from "../../../store/sessionStore";
import { getAudioOverviewsBySessionId } from "../../../api/audioApi";
import type { IAudioResponseDTO } from "../../../types";
import AudioGet from "./AudioGet";
import { useAudioCardStore } from "../../../store/audioStore";
import { Music } from "lucide-react";

const AudioList = () =>{
  
  const sessionId = useSessionStore((state) => state.sessionId);
  const setAudioCards = useAudioCardStore((state) =>state.setAudioCards);
  const audios = useAudioCardStore((state) =>state.audios);
  const [isExpanded, setIsExpanded] = useState(false);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() =>{
    const handleGetAllAudios = async() =>{
      try {
        if(!sessionId) return;

        setError(null);
        setIsLoading(true);
        const response: IAudioResponseDTO[] = await getAudioOverviewsBySessionId(sessionId);
        console.log(response);
        
        setAudioCards(response);
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        const axiosMessage = error?.message;
        const message = serverMessage || axiosMessage || "Failed to get audio list. Please try again.";
        setError(message);
        toast.error(message);
      }finally{
        setIsLoading(false);
      }
    }
    handleGetAllAudios();
  },[sessionId ]);

  
  const handleExtendList = () =>{
    setIsExpanded(true);
  }
  const handleCloseList = () =>{
    setIsExpanded(false);
  }

  if(!isExpanded){
    return (
      <div onClick={ handleExtendList } className="group green-card">
        <div className="flex items-start justify-between p-2 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors ">
          <Music size={18} className="text-green-600" />
          <p className="font-medium text-green-600" >{audios.length<=1 ? "Audio":"Audios"}</p> 
          <h3 className="px-1 text-green-600">{audios.length}</h3>
        </div>
      </div>
    )
  }

  return(
    <>

    { audios.length === 0 ? (
      <> 
      <div onClick={ handleCloseList } className="green-hover">
        <button  className="text-green-500"> &lt; Back </button>
        <div className="text-green-500 font-medium">No audios found</div>
      </div>
      </>
    ): (
      <>
        <div onClick={ (e) => {e.stopPropagation(); handleCloseList();}} className="green-hover">
          <button className="text-green-500"  > &lt; Back </button>
        </div>
        {audios.map( (audio) =>(
          <AudioGet  
            key={audio.id}
            audio ={audio}
          />
        ))
        }
      </>
    )}
    </>
  )
}

export default AudioList;