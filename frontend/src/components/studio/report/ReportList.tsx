import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSessionStore } from "../../../store/sessionStore";
import ReportGet from "./ReportGet";
import { getAllReports } from "../../../api/reportApi";
import type { IReportResponse } from "../../../types";
import { useReportCardStore } from "../../../store/reportStore";

const ReportList = () => {

  const sessionId = useSessionStore((state) => state.sessionId);
  const setReportCards = useReportCardStore((state) =>state.setReportCards);
  const reports = useReportCardStore((state) =>state.reports);
  
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


  return (
    <>
    <div>ReportList</div>
    {
      reports.length === 0 ? (
        <>
        <div>No Report found</div> 
        </>
      ): reports.map((report) =>(
        <ReportGet key={report.reportId} report ={report}/>
      ))
    }
    </>
  )
}

export default ReportList;