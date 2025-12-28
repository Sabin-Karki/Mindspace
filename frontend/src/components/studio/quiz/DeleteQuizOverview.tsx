import { toast } from "sonner";
import { deleteQuiz } from "../../../api/quizApi";
import { useQuizStore } from "../../../store/quizStore";

interface DeleteQuizOverviewProps{
quizId:number,closeDeleteModal:()=>void
}

 const DeleteQuizOverview = ( {quizId, closeDeleteModal}: DeleteQuizOverviewProps ) =>{
    const removeQuiz = useQuizStore((state)=>state.removeQuiz);

    //delete quiz overview
    const handleDeleteQuizOverview =async()=>{
        try{
            await deleteQuiz(quizId);
            toast.success("Quiz deleted successfully");
            
            console.log("deleted quiz")
            //update state 
            removeQuiz(quizId); //remove from global state
            toast.success("Quiz deleted successfully") ;
        
        }catch(error){
            console.log(error);
            toast.error("Failed to delete quiz");

        }
    }

    return (
        <>
        <div onClick={(e)=>e.stopPropagation()}
         className="bg-gray-800 rounded-lg p-4 w-full flex flex-col text-white">
         
         <div className="p-4" >Are you sure you want to delete this quiz ? </div>
         <div className="flex justify-between items-center">
            <button onClick={()=>{handleDeleteQuizOverview();closeDeleteModal();}}>Delete </button>
            <button onClick={closeDeleteModal}>Cancel</button>
         </div>

         </div>
        </>
    )
}

export default DeleteQuizOverview;