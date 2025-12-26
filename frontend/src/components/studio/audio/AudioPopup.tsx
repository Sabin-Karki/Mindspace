import { useEffect, useState } from "react";
import type {  IAudioResponseDTO } from "../../../types";
import Modal from "react-modal";
import ReactPlayer from 'react-player';
import { toast } from "sonner";
import { getAudioOverviewById } from "../../../api/audioApi";

interface AudioCardPopupProps {
  audioId: number;
  closeModal: () => void;
  audio: IAudioResponseDTO;
  handleUpdateAudioCardName: (input: string) => void;
}

Modal.setAppElement("#root");

const AudioCardPopup = ( {audioId, closeModal, audio, handleUpdateAudioCardName}: AudioCardPopupProps) => {
  
  const [localAudioCardName, setLocalAudioCardName] = useState(audio.title || "");

  const concatUrl = "http://localhost:8080" + audio.audioUrl;
  console.log(audio.audioUrl);
  console.log(concatUrl);
  const audioUrlExample = "http://localhost:8080/audio/overview_352_68da75e4-0de8-43e4-ab6c-7c89b6dc34cb.wav";
  const audioUrlExample2 = "https://www.youtube.com/watch?v=L3t4-_EJySQ";

  //no need to fetch again 
  // we have full data of audio already
  // const [cardDetails, setCardDetails] = useState<IAudioResponseDTO>();
  // //fetching specific audio card using cardId 
  // useEffect(() =>{
  //   const getAudioCard = async(cardId: number) =>{
  //     try {
  //       //get full audiocard response
  //       const response: IAudioResponseDTO = await getAudioOverviewById(audioId);
  //       console.log(response);
  //       setCardDetails(response);
    
  //     } catch (error: any) {
  //       const serverMessage = error?.response?.data?.message;
  //       const axiosMessage = error?.message;
  //       const message = serverMessage || axiosMessage || "Failed to get audiocard details. Please try again.";
  //       toast.error(message);
  //     }
  //   }
  //   getAudioCard(audioId);
  // },[]);
  

  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAudioCardName(e.target.value);
  }  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Enter"){
      handleUpdateAudioCardName(localAudioCardName);
    }
  }
  
  return (
    <>
    <div onClick={(e) => e.stopPropagation()} 
      // flex flex-col: Stacks the Header, Content, and Footer vertically.
      className="bg-gray-800 rounded-lg p-4 w-full h-96 flex flex-col text-white" >
      
      <div  className="flex justify-between items-center p-2">
        <div>
          <input type="text" 
            value={localAudioCardName} 
            onChange={handleChangeCardName} 
            onKeyDown={handleKeyDown}
            />
        </div>
        <button onClick={closeModal} className="text-xl">&times;</button>
      </div>
      
      {/* flex-1: Tells this div to expand and fill ALL available empty space.
        overflow-y-auto: If text is too long, a scrollbar appears INSIDE here. */}
      <div className="p-4 flex-1 overflow-y-auto" >
        
        {audioId}
        {audio.title}
        {audio.audioUrl}
        <div>
          <ReactPlayer 
            slot="media"
            src={audioUrlExample}
            controls={true}    // Necessary to see Play/Pause/Volume
            height="50px"
            width="320px"
          />
        </div>
      </div>

    </div>
    </>
  )
} 

export default AudioCardPopup;