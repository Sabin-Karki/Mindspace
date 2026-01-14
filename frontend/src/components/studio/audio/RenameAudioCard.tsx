import { useState } from "react";
import type { IAudioResponseDTO } from "../../../types";

interface RenameAudioCardProps {
  handleUpdateAudioCardName: (input: string) => void;
  closeRenameModal: () => void;
  audio: IAudioResponseDTO;
}

const RenameAudioCard = ({handleUpdateAudioCardName, closeRenameModal, audio}: RenameAudioCardProps) => {

  const [localAudioCardName, setLocalAudioCardName] = useState(audio.title || ""); //local state
  
  const handleBlur = () => {
    setLocalAudioCardName(localAudioCardName);
    closeRenameModal();
  };

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
      onBlur={handleBlur}
      onChange={handleChangeCardName}
      onKeyDown={handleKeyDown} 
      className="input-pri"
      autoFocus
      />
    </>
  )
} 

export default RenameAudioCard;