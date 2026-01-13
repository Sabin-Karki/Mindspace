import { useState } from "react";
import type { ICardOverview } from "../../../types";

interface RenameFlashCardProps {
  handleUpdateFlashCardName: (input: string) => void;
  closeRenameModal: () => void;
  flashCard: ICardOverview;
}

const RenameFlashCard = ({handleUpdateFlashCardName, closeRenameModal, flashCard}: RenameFlashCardProps) => {

  const [localFlashCardName, setLocalFlashCardName] = useState(flashCard.title || ""); //local state
  

  const handleBlur = () => {
    setLocalFlashCardName(localFlashCardName);
    closeRenameModal();
  };
  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFlashCardName(e.target.value);
  }  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Escape"){
      closeRenameModal();
    }
    if(localFlashCardName === flashCard.title || localFlashCardName.trim().length === 0) {
      return;
    }
    if(e.key === "Enter"){
      handleUpdateFlashCardName(localFlashCardName);
      closeRenameModal();
    }
  }
  
  

  return (
    <>
    <input type="text"
      onClick={(e) => e.stopPropagation()}
      value={localFlashCardName} 
      onBlur={handleBlur}
      onChange={handleChangeCardName}
      onKeyDown={handleKeyDown} 
      className=" input-pri"
      autoFocus
      />
    </>
  )
} 

export default RenameFlashCard;