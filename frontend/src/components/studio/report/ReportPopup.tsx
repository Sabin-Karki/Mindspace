import { useState } from "react";
import type { IReportResponse } from "../../../types";
import Modal from "react-modal";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { X } from "lucide-react";

interface ReportCardPopupProps {
  reportId: number;
  closeModal: () => void;
  report: IReportResponse;
  handleUpdateReportCardName: (input: string) => void;
}

Modal.setAppElement("#root");

const ReportCardPopup = ( {reportId, closeModal, report, handleUpdateReportCardName}: ReportCardPopupProps) => {
  
  const [localReportCardName, setLocalReportCardName] = useState(report.title || "");

  const handleBlur = () => {
    setLocalReportCardName(localReportCardName);
    closeModal();
  };

  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalReportCardName(e.target.value);
  }  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Enter"){
      handleUpdateReportCardName(localReportCardName);
    }
  }
  
  return (
    <>
    <div className="fixed inset-0 bg-black/50 flex-center p-4 z-50">
    <div onClick={(e) => e.stopPropagation()} 
      className="bg-bg-sec text-text-sec rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-xl" >
      
      <div  className="flex justify-between items-center p-4 border-b border-border-sec">
        <div>
          <input type="text" 
            value={localReportCardName} 
            onChange={handleChangeCardName} 
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className='input-pri '
            placeholder="Set name..."
            />
        </div>
        <button
            onClick={closeModal}
            className="p-2 bg-bg-sec hover:bg-bg-tri rounded-lg  transition-colors" >
            <X size={24} />
          </button>
      </div>
      
      {/* flex-1: Tells this div to expand and fill ALL available empty space.
        overflow-y-auto: If text is too long, a scrollbar appears INSIDE here. */}
      <div className="p-4 flex-1 overflow-y-auto" >
        {reportId}
        {report.title}
        based on {report.sourceId.length} sources
        <ReactMarkdown>
          {report.reportContent}
        </ReactMarkdown>
      </div>

    </div>
    </div>
    </>
  )
} 

export default ReportCardPopup;