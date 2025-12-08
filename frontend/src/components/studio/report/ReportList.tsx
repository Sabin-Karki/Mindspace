import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSessionStore } from "../../../store/sessionStore";
import ReportGet from "./ReportGet";
import { getAllReports } from "../../../api/reportApi";
import type { IReportResponse } from "../../../types";

const ReportList = () => {

  const sessionId = useSessionStore((state) => state.sessionId);
  const [reportList, setReportList] = useState<IReportResponse[]>([]);
  
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
        
        setReportList(response);
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
      reportList.length === 0 ? (
        <>
        <div>No Report found</div> 
        </>
      ): reportList.map((report) =>(
        <ReportGet key={report.reportId} report ={report}/>
      ))
    }
    </>
  )
}

export default ReportList;