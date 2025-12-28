import { toast } from "sonner";
import { getQuizzesBySessionId } from "../../../api/quizApi";
import { useSessionStore } from "../../../store/sessionStore";
import { useQuizStore } from "../../../store/quizStore";
import { useEffect,useState } from "react";
import QuizGet from "./QuizGet";
import type { IQuizOverviewResponse } from "../../../types";


const QuizList = () =>{
    const sessionId = useSessionStore((state)=>state.sessionId) ;
    const setQuizzes =useQuizStore((state)=>state.setQuizzes);
    const quizzes = useQuizStore((state)=>state.quizzes);
    const [error,setError] = useState<string | null >(null);
    const [isLoading , setIsLoading] = useState(false);

    //returning entire Quiz by Session QuizOverview { id title Question{ options correctIntAnswerIndex}}
    useEffect(()=>{
        const handleGetAllQuizList = async()=>{
            try{
                if(!sessionId) return;
                setError(null);
                setIsLoading(true);
                
                const response : IQuizOverviewResponse[] = await getQuizzesBySessionId(sessionId);
                console.log(response);

                setQuizzes(response);
            }catch(err:any){
                const serverMessage =err?.response?.data?.message;
                const axiosMessage=err?.message;
                const message = serverMessage || axiosMessage || "Failed to generate quiz ! Please Try again";
                setError(message);
                toast.error(message);   
            }finally{
                setIsLoading(false);
            }
        }
        handleGetAllQuizList();
    },[sessionId ]);

    return(
        <>
        <div>
            QuizList
        </div>
        {quizzes.length==0 ? (
            <div>No Quiz Found</div>):
            quizzes.map((quiz)=>(
                //display all quiz generated
               <QuizGet   key={quiz.quizId} quiz={quiz} />
            ))
        }
        </>
    )
}
export default QuizList;