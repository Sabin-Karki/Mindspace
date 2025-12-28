//this is to make these things visibile->title,sourcelength , menu for rename and delete and also view quiz<the popup modal>
import { useState } from "react";
import type { IQuizOverviewResponse } from "../../../types";
import Modal from "react-modal";
import { toast } from "sonner";
import { useQuizStore } from "../../../store/quizStore";
import { updateQuizTitle } from "../../../api/quizApi";
import RenameQuizOverview from "./RenameQuizOverview";
import DeleteQuizOverview from "./DeleteQuizOverview";
import { QuizViewer } from "./QuizViewer";

interface QuizProps {
    quiz:IQuizOverviewResponse;
}

//get specific quiz
//what this does is,quiz which is of type iquizoverviewresponse,its object is destructured here and i can now do quiz.title,quiz.quizId;
 const QuizGet=({quiz}:QuizProps)=>{

    const updateQuiz = useQuizStore((state)=>state.updateQuiz);

    const [isModalOpen,setIsModalOpen]=useState(false);
    const [openMenuId,setMenuId]=useState<number|null>(null);
    const [isRenameModalOpen,setIsRenameModalOpen]=useState(false);
    const [isDeleteModalOpen,setIsDeleteModalOpen]=useState(false);

    const [error,setError] = useState<string|null>(null);
    const [isLoading,setIsLoading]=useState(false);

    //rename quiz overview
    const handleUpdateQuizName=async(localQuizName:string)=>{
        try{
           const response:IQuizOverviewResponse= await updateQuizTitle(quiz.quizId,localQuizName);
           updateQuiz(response.quizId,response.title);

           toast.success("Quiz name updated successfully");
        }catch(error: any){
            const serverMessage= error?.response?.data?.message;
            const axiosMessage=error?.message;
            const message=serverMessage||axiosMessage||"failed to update quiz title. please try again ";
            setError(message);
            toast.error("Failed to update quiz name.");
            return;
        }
    }

        const closeModal=()=>{
            setIsModalOpen(false);
        }
        const openModal=()=>{
            setIsModalOpen(true);
        }

        //handling individual menu options for quiz
        const handleShowMenu=(id:number)=>{
            if(openMenuId===id){
                setMenuId(null);
            }else{
                setMenuId(id);
            }
        }

        const handleHideMenu=()=>{
            setMenuId(null);
        }

        const openDeleteModal=()=>{
            setIsDeleteModalOpen(true);
        }

        const closeDeleteModal=()=>{
            setIsDeleteModalOpen(false);
        }

        const openRenameModal=()=>{
            setIsRenameModalOpen(true);
        }
        
        const closeRenameModal=()=>{
            setIsRenameModalOpen(false);
        }
       
  return (
    <>
    <div className="relative">
      <div onClick={openModal} className="flex justify-between border-4">
        <div className="relative flex items-center">
          {isRenameModalOpen ? (
            <RenameQuizOverview 
              handleUpdateQuizTitle={handleUpdateQuizName}
              closeRenameModal={closeRenameModal}
              quiz={quiz}
            />
          ) : (
            <p>{quiz.title}</p>
          )}
        </div>

        <p>{quiz.sourceId?.length ?? 0}</p>

        <button onClick={(e) => { e.stopPropagation(); handleShowMenu(quiz.quizId); }} 
          className="text-2xl text-gray-700 hover:text-amber-600 px-2">
          &#x22EE;
        </button>
      </div>

      {openMenuId === quiz.quizId && (
      <>
        <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); handleHideMenu(); }}></div>

        <div className="absolute top-10 right-0 z-20 w-32 bg-white rounded shadow-lg border border-gray-100">

          <button onClick={(e) => { e.stopPropagation(); openDeleteModal(); handleHideMenu(); }} 
            className="w-full text-left p-2 text-sm text-red-600 hover:bg-gray-100">
            Delete
          </button>

          <button onClick={(e) => { e.stopPropagation(); openRenameModal(); handleHideMenu(); }} 
            className="w-full text-left p-2 text-sm text-gray-800 hover:bg-gray-100">
            Rename
          </button>
        </div>
      </>
      )}
    </div>
      
    <Modal
      isOpen={isDeleteModalOpen} //changes done here only
      onRequestClose={closeDeleteModal} 
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      className="outline-none w-full max-w-md mx-4 overflow-hidden shadow-xl" >

      <DeleteQuizOverview 
        quizId={quiz.quizId} 
        closeDeleteModal={closeDeleteModal}
      />
    </Modal>

    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal} //press esc to close
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      className=" outline-none w-full max-w-md mx-4 overflow-hidden shadow-xl" >
      <QuizViewer
        quiz={quiz}
        onClose={closeModal}
        handleUpdateQuizName={handleUpdateQuizName}
        
      />
    </Modal>
    
    </>  


  )
};

export default QuizGet;