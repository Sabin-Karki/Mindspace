import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSessionStore } from "../../../store/sessionStore";
import { getAudioOverviewsBySessionId } from "../../../api/audioApi";
import type { IAudioResponseDTO } from "../../../types";
import AudioGet from "./AudioGet";
import { useAudioCardStore } from "../../../store/audioStore";

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
      <div onClick={ handleExtendList } className="flex" >
        <div>Audio </div> 
        <div>{audios.length}</div>
        <div> &gt; </div>
      </div>
    )
  }

  return(
    <>

    { audios.length === 0 ? (
      <> 
        <button onClick={ handleCloseList } > &lt; Back </button>
        <div>No audios found</div>
      </>
    ): (
      <>
        <div>
          <button onClick={ (e) => {e.stopPropagation(); handleCloseList();} } > &lt; Back </button>
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