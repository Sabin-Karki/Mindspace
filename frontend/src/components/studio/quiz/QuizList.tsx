import { toast } from "sonner";
import { getQuizzesBySessionId } from "../../../api/quizApi";
import { useSessionStore } from "../../../store/sessionStore";
import { useQuizStore } from "../../../store/quizStore";
import { useEffect, useState } from "react";
import QuizGet from "./QuizGet";
import type { IQuizOverviewResponse } from "../../../types";
import { FileQuestion } from "lucide-react";

const QuizList = () => {
  const sessionId = useSessionStore((state) => state.sessionId);
  const setQuizzes = useQuizStore((state) => state.setQuizzes);
  const quizzes = useQuizStore((state) => state.quizzes);

  console.log("Quizzes in store : " , quizzes);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleGetAllQuizList = async () => {
      try {
        if (!sessionId) return;

        setError(null);
        setIsLoading(true);

        const response: IQuizOverviewResponse[] =
          await getQuizzesBySessionId(sessionId);

        setQuizzes(response);
      } catch (err: any) {
        const serverMessage = err?.response?.data?.message;
        const axiosMessage = err?.message;
        const message =
          serverMessage || axiosMessage || "Failed to generate quiz! Please try again";

        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    handleGetAllQuizList();
  }, [sessionId, setQuizzes]);

  const handleExtendList = () => setIsExpanded(true);
  const handleCloseList = () => setIsExpanded(false);

  if(!isExpanded){
    return (
    <div onClick={ handleExtendList } className="group blue-card">
        <div className="flex items-start justify-between  p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
          <FileQuestion size={18} className="text-blue-600" />
          <div className="font-medium text-blue-500 px-1">{quizzes.length<=1? "Quiz":"Quizzes"} </div> 
          <p className='font-medium p-1 text-xs text-blue-500 '>{quizzes.length}</p>
        </div>
    </div>
    )
  }

    return(
    <>
        { quizzes.length === 0 ? (
        <> 
        <div onClick={ handleCloseList } className="blue-hover">
            <button className="text-blue-500"  > &lt; Back </button>
            <div className="font-medium text-blue-600">No quizzes found</div>
        </div>
        </>
        ): (
        <>
            <div onClick={ (e) => {e.stopPropagation(); handleCloseList();} } className="blue-hover">
                <button className="text-blue-500" > &lt; Back </button>
            </div>
            {quizzes.map( (quiz) =>(
            <QuizGet
                key={quiz.quizId} 
                quiz={quiz} 
                quizId={quiz.quizId}
            />
            ))
            }
        </>
        )}
    </> 
    )
}
export default QuizList;
