import { toast } from "sonner";
import { getQuizzesBySessionId } from "../../../api/quizApi";
import { useSessionStore } from "../../../store/sessionStore";
import { useQuizStore } from "../../../store/quizStore";
import { useEffect, useState } from "react";
import QuizGet from "./QuizGet";
import type { IQuizOverviewResponse } from "../../../types";
import { FileQuestion } from "lucide-react";
import { useLayoutStore } from "../../../store/layoutStore";

const QuizList = () => {
  const sessionId = useSessionStore((state) => state.sessionId);
  const setQuizzes = useQuizStore((state) => state.setQuizzes);
  const quizzes = useQuizStore((state) => state.quizzes);
  const isRightPanelClose = useLayoutStore((state) => state.isRightPanelClose);

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
    <div onClick={ handleExtendList } className="group blue-hover text-blue-600 font-medium ">
        <div className="flex items-center justify-between  p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
          <FileQuestion size={18} />
          { !isRightPanelClose && 
            <span >{quizzes.length<=1? "Quiz":"Quizzes"} </span>
          }
          <span className='px-1'>{quizzes.length}</span>
        </div>
    </div>
    )
  }

    return(
    <>
        { quizzes.length === 0 ? (
        <> 
        <div onClick={ handleCloseList } className=" blue-hover font-medium text-blue-600">
          <button > &lt; Back </button>
          <div >No quizzes found</div>
        </div>
        </>
        ): (
        <>
            <div onClick={ (e) => {e.stopPropagation(); handleCloseList();} } 
              className="grid grid-cols-3 blue-hover  p-4 items-center font-medium text-blue-600">
                <button > &lt; Back </button>
                <span className=" text-center">
                  {quizzes.length<=1? "Quiz":"Quizzes"}
              </span>
                <div></div>
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
