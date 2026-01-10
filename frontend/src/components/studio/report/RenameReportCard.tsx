import { useState } from "react";
import type { IReportResponse } from "../../../types";

interface RenameReportCardProps {
  handleUpdateReportCardName: (input: string) => void;
  closeRenameModal: () => void;
  report: IReportResponse;
}

const RenameReportCard = ({handleUpdateReportCardName, closeRenameModal, report}: RenameReportCardProps) => {

  const [localReportCardName, setLocalReportCardName] = useState(report.title || ""); //local state
  
  const handleBlur = () => {
    setLocalReportCardName(localReportCardName);
    closeRenameModal();
  };
  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalReportCardName(e.target.value);
  }  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Escape"){
      closeRenameModal();
    }
    if(localReportCardName === report.title || localReportCardName.trim().length === 0) {
      return;
    }
    if(e.key === "Enter"){
      handleUpdateReportCardName(localReportCardName);
      closeRenameModal();
    }
  }
  
  

  return (
    <>
    <input type="text"
      onClick={(e) => e.stopPropagation()}
      value={localReportCardName} 
      onChange={handleChangeCardName}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown} 
      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
      autoFocus
      />
    </>
  )
} 

export default RenameReportCard;