import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSessionStore } from "../../../store/sessionStore";
import ReportGet from "./ReportGet";
import { getAllReports } from "../../../api/reportApi";
import type { IReportResponse } from "../../../types";
import { useReportCardStore } from "../../../store/reportStore";
import { Newspaper } from "lucide-react";
import { useLayoutStore } from "../../../store/layoutStore";

const ReportList = () => {

  const sessionId = useSessionStore((state) => state.sessionId);
  const setReportCards = useReportCardStore((state) =>state.setReportCards);
  const reports = useReportCardStore((state) =>state.reports);
  const [isExpanded, setIsExpanded] = useState(false);
  const isRightPanelClose = useLayoutStore((state) => state.isRightPanelClose);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() =>{
    const handleGetAllReportList = async() =>{
      try {
        if(!sessionId) return;
        setError(null);
        setIsLoading(true);

        const response: IReportResponse[] = await getAllReports(sessionId);
        console.log(response);
        
        setReportCards(response);
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        const axiosMessage = error?.message;
        const message = serverMessage || axiosMessage || "Failed to get report list. Please try again.";
        setError(message);
        toast.error(message);
      }finally{
        setIsLoading(false);
      }
    }
    handleGetAllReportList();
  },[sessionId ]);

  const handleExtendList = () =>{
    setIsExpanded(true);
  }
  const handleCloseList = () =>{
    setIsExpanded(false);
  }

  if(!isExpanded){
    return (
      <div onClick={ handleExtendList } className="group purple-hover font-medium text-purple-600">
        <div className="flex items-center justify-between p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors">
          <Newspaper size={18} />
          { !isRightPanelClose && 
            <span >{reports.length<=1? "Report":"Reports"} </span> 
          }
          <span className='px-1 '>{reports.length}</span>
        </div>
      </div>
    )
  }

  return (
  <>
    { reports.length === 0 ? (
      <>
      <div onClick={ handleCloseList } className="purple-hover font-medium text-purple-600">
        <button > &lt; Back </button>
        <div >No reports found</div>
      </div>
      </>
    ): (
      <>
        <div onClick={ (e) => {e.stopPropagation(); handleCloseList();} }
          className="purple-hover grid grid-cols-3 p-4 items-center font-medium text-purple-600" >
          <button > &lt; Back </button>
          <span className="text-center ">
            {reports.length<=1? "Report":"Reports"}
          </span>
          <div></div>
        </div>
        {reports.map( (report) =>(
          <ReportGet 
            key={report.reportId} 
            report ={report}
          />
        ))
        }
      </>
    )}
  </>
  )
}

export default ReportList;