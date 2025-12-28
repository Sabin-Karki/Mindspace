import { toast } from "sonner";
import { useEffect,useState } from "react";
import { useQuizStore } from "../../../store/quizStore";
import { useSessionStore } from "../../../store/sessionStore";
import { generateQuiz } from "../../../api/quizApi";
import type  { IQuizOverviewResponse, IUploadResponse } from "../../../types";

const QuizGenerator = () =>{

    //so for quiz generator,i will need according to the backend i designed->sessionId in path variable and selectedSourceIds[] in requestbody

    const sessionId = useSessionStore((state)=>state.sessionId);
    const selectedSourceIds= useSessionStore((state)=>state.selectedSourceIds);//selected sources
    const sources: IUploadResponse[] = useSessionStore((state) => state.sources);//all uploaded sources
    const addQuiz = useQuizStore((state)=>state.addQuiz);

    const[error,setError] = useState<string|null>(null);
    const[loading,setIsLoading]=useState(false);

    const handleGenerateQuizOverview=async()=>{
      try{
       setError(null);
       setIsLoading(true);
       if(!sessionId)return;

      if(sources.length === 0) {
        toast.error("No sources available. Please upload a source first to generate.");
        return;
      }
      let sIds:number[] = [];
      if(selectedSourceIds.length === 0){
        //if nothing selected then get all source ids
        const sourceIds = sources.map(s => s.sourceId);
        sIds = sourceIds;
      }else{
        //if there is selected source ids then use it 
        sIds = selectedSourceIds;
      }
       
        const response : IQuizOverviewResponse= await generateQuiz(sessionId, sIds);
        console.log(response);
        //the questions are nulll here so 
        //fecthing at specific quiz at quiz viewer
        addQuiz(response);
       
      }catch(err:any){
          const serverMessage=err?.response?.data?.message;
          const axiosMessage=err?.message;
          const message=serverMessage||axiosMessage||"Error generating Quiz . Please try again !";
          setError(message);
          toast.error(message);
      }finally{
        setIsLoading(false);
      }
    }

    return (
      <>
      <div onClick={handleGenerateQuizOverview}>Quiz </div>
      </>
    )
}

export default QuizGenerator;