import { useEffect, useState } from "react";
import type { IReportResponse } from "../../../types";
import Modal from "react-modal";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { getReportById } from "../../../api/reportApi";

interface ReportCardPopupProps {
  reportId: number;
  closeModal: () => void;
  report: IReportResponse;
  handleUpdateReportCardName: (input: string) => void;
}

Modal.setAppElement("#root");

const ReportCardPopup = ( {reportId, closeModal, report, handleUpdateReportCardName}: ReportCardPopupProps) => {
  
  const [localReportCardName, setLocalReportCardName] = useState(report.title || "");

  //no need to fetch again 
  //we have full data of report already
  // const [cardDetails, setCardDetails] = useState<IReportResponse>();
  // //fetching specific report card using cardId 
  // useEffect(() =>{
  //   const getReportCard = async(cardId: number) =>{
  //     try {
  //       //get full reportcard response
  //       const response: IReportResponse = await getReportById(reportId);
  //       console.log(response);
  //       setCardDetails(response);
    
  //     } catch (error: any) {
  //       const serverMessage = error?.response?.data?.message;
  //       const axiosMessage = error?.message;
  //       const message = serverMessage || axiosMessage || "Failed to get reportcard details. Please try again.";
  //       toast.error(message);
  //     }
  //   }
  //   getReportCard(reportId);
  // },[]);
  

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
    <div onClick={(e) => e.stopPropagation()} 
      // flex flex-col: Stacks the Header, Content, and Footer vertically.
      className="bg-gray-800 rounded-lg p-4 w-full h-96 flex flex-col text-white" >
      
      <div  className="flex justify-between items-center p-2">
        <div>
          <input type="text" 
            value={localReportCardName} 
            onChange={handleChangeCardName} 
            onKeyDown={handleKeyDown}
            />
        </div>
        <button onClick={closeModal} className="text-xl">&times;</button>
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
    </>
  )
} 

export default ReportCardPopup;