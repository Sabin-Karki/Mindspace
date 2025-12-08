import { useState } from "react";
import { useSessionStore } from "../../../store/sessionStore";
import type { IReportResponse, IUploadResponse } from "../../../types";
import { toast } from "sonner";
import { generateReport } from "../../../api/reportApi";

const ReportGenerator = () => {
  
  const sessionId = useSessionStore((state) => state.sessionId);
  const sources: IUploadResponse[] = useSessionStore((state) => state.sources);
  const selectedSourceIds = useSessionStore((state) => state.selectedSourceIds);
  
  const [report, setReport] = useState<IReportResponse>();
  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
    

  const handleGenerateReport = async() =>{
    try {
      setError(null);
      setIsLoading(true);
      if(!sessionId) return;

      let sIds: number[] = [];
      if(selectedSourceIds.length === 0){
        //if nothing selected then get all source ids
        const sourceIds = sources.map(s => s.sourceId);
        sIds = sourceIds;
      }else{
        //if there is selected source ids then use it 
        sIds = selectedSourceIds;
      }

      const response: IReportResponse = await generateReport(sessionId, sIds);
      console.log(response);
      setReport(response);

      // toast.promise("");
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      const axiosMessage = error?.message;
      const message = serverMessage || axiosMessage || "Failed to generate report. Please try again.";
      setError(message);
      toast.error(message);
    }finally{
      setIsLoading(false);
    }
  }

  return (
     <div onClick={handleGenerateReport}>Audio</div>
  )
}

export default ReportGenerator;