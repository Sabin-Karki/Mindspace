import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSessionStore } from "../../../store/sessionStore";
import ReportGet from "./ReportGet";
import { getAllReports } from "../../../api/reportApi";
import type { IReportResponse } from "../../../types";
import { useReportCardStore } from "../../../store/reportStore";
import { Newspaper } from "lucide-react";

const ReportList = () => {

  const sessionId = useSessionStore((state) => state.sessionId);
  const setReportCards = useReportCardStore((state) =>state.setReportCards);
  const reports = useReportCardStore((state) =>state.reports);
  const [isExpanded, setIsExpanded] = useState(false);

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
      <div onClick={ handleExtendList } className="group purple-card">
        <div className="flex items-start justify-between purple-hover">
          <Newspaper size={18} className="text-purple-600" />
          <div className="font-medium text-purple-500 px-1">{reports.length<=1? "Report":"Reports"} </div> 
          <p className='p-1 text-xs text-purple-500 font-medium'>{reports.length}</p>
        </div>
      </div>
    )
  }

  return (
  <>
    { reports.length === 0 ? (
      <>
      <div onClick={ handleCloseList } className="purple-hover">
        <button className="text-purple-500"> &lt; Back </button>
        <div className="font-medium text-purple-500">No reports found</div>
      </div>
      </>
    ): (
      <>
        <div onClick={ (e) => {e.stopPropagation(); handleCloseList();} } className="purple-hover" >
          <button className="text-purple-600"  > &lt; Back </button>
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