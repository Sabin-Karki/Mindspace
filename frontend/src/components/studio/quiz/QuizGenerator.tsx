import { toast } from "sonner";
import { useEffect,useState } from "react";
import { useQuizStore } from "../../../store/quizStore";
import { useSessionStore } from "../../../store/sessionStore";
import { generateQuiz } from "../../../api/quizApi";
import type  { IQuizOverviewResponse } from "../../../types";

const QuizGenerator = () =>{

    //so for quiz generator,i will need according to the backend i designed->sessionId in path variable and selectedSourceIds[] in requestbody

    const sessionId = useSessionStore((state)=>state.sessionId);
    const selectedSourceIds= useSessionStore((state)=>state.selectedSourceIds);

    const addQuiz = useQuizStore((state)=>state.addQuiz);

    const[error,setError] = useState<string|null>(null);
    const[loading,setIsLoading]=useState(false);

    const handleGenerateQuizOverview=async()=>{
      try{
       setError(null);
       setIsLoading(true);
       if(!sessionId)return;

       
        const response : IQuizOverviewResponse= await generateQuiz(sessionId,selectedSourceIds);
        console.log(response);
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