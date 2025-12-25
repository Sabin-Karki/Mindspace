import { useState } from "react";
import type { IAudioResponseDTO } from "../../../types";

interface RenameAudioCardProps {
  handleUpdateAudioCardName: (input: string) => void;
  closeRenameModal: () => void;
  audio: IAudioResponseDTO;
}

const RenameAudioCard = ({handleUpdateAudioCardName, closeRenameModal, audio}: RenameAudioCardProps) => {

  const [localAudioCardName, setLocalAudioCardName] = useState(audio.title || ""); //local state
  

  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAudioCardName(e.target.value);
  }  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Escape"){
      closeRenameModal();
    }
    if(localAudioCardName === audio.title || localAudioCardName.trim().length === 0) {
      return;
    }
    if(e.key === "Enter"){
      handleUpdateAudioCardName(localAudioCardName);
      closeRenameModal();
    }
  }
  
  

  return (
    <>
    <input type="text"
      onClick={(e) => e.stopPropagation()}
      value={localAudioCardName} 
      onChange={handleChangeCardName}
      onKeyDown={handleKeyDown} 
      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
      autoFocus
      />
    </>
  )
} 

export default RenameAudioCard;