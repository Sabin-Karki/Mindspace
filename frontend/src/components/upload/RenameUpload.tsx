import { useState } from "react";
import type { IUploadResponse } from "../../types";

interface RenameUploadProps {
  handleUpdateUploadName: (input: string) => void;
  closeRenameModal: () => void;
  source: IUploadResponse;
}

const RenameUpload = ({handleUpdateUploadName, closeRenameModal, source}: RenameUploadProps) => {

  const [localUploadName, setLocalUploadName] = useState(source.title || ""); //local state
  
  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUploadName(e.target.value);
  } 

  //when user loses focus reset title
  const handleBlur = () => {
    setLocalUploadName(source.title);
    closeRenameModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Escape"){
      closeRenameModal();
    }
    if(localUploadName === source.title || localUploadName.trim().length === 0) {
      return;
    }
    if(e.key === "Enter"){
      handleUpdateUploadName(localUploadName);
      closeRenameModal();
    }
  }

  return (
    <>
    <input type="text"
      onClick={(e) => e.stopPropagation()}
      value={localUploadName} 
      onBlur={handleBlur}
      onChange={handleChangeCardName}
      onKeyDown={handleKeyDown} 
      className="p-2 border border-border-tri rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
      autoFocus
      />
    </>
  )
} 

export default RenameUpload;