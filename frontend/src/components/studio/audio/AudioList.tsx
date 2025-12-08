import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSessionStore } from "../../../store/sessionStore";
import { getAudioOverviewsBySessionId } from "../../../api/audioApi";
import type { IAudioResponseDTO } from "../../../types";
import AudioGet from "./AudioGet";

const AudioList = () =>{
  
  const sessionId = useSessionStore((state) => state.sessionId);
  const [audioCards, setAudioCards] = useState<IAudioResponseDTO[]>([]);

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



  return(
    <>
    <div>Audio list</div>
    {
      audioCards.length === 0 ? (
        <>
        <div>No Audios found</div> 
        </>
      ): audioCards.map((card) =>{
        
        <AudioGet key={card.id} card ={card}/>
      })
    }
    </>
  )
}

export default AudioList;