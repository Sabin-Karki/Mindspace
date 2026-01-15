//this is to make these things visibile->title,sourcelength , menu for rename and delete and also view quiz<the popup modal>
import { useState } from "react";
import type { IQuizOverviewResponse } from "../../../types";
import Modal from "react-modal";
import { toast } from "sonner";
import { useQuizStore } from "../../../store/quizStore";
import { getQuizById, updateQuizTitle } from "../../../api/quizApi";
import RenameQuizOverview from "./RenameQuizOverview";
import DeleteQuizOverview from "./DeleteQuizOverview";
import { QuizViewer } from "./QuizViewer";
import { useLayoutStore } from "../../../store/layoutStore";

interface QuizProps {
    quiz:IQuizOverviewResponse;
    quizId: number;
}

//get specific quiz
//what this does is,quiz which is of type iquizoverviewresponse,its object is destructured here and i can now do quiz.title,quiz.quizId;
 const QuizGet=({quiz, quizId }:QuizProps)=>{

    const updateQuiz = useQuizStore((state)=>state.updateQuiz);
    const isRightPanelClose = useLayoutStore((state) => state.isRightPanelClose);
    const [isModalOpen,setIsModalOpen]=useState(false);
    const [openMenuId,setMenuId]=useState<number|null>(null);
    const [isRenameModalOpen,setIsRenameModalOpen]=useState(false);
    const [isDeleteModalOpen,setIsDeleteModalOpen]=useState(false);

    const quizzes = useQuizStore((state)=>state.quizzes);
    const addQuiz = useQuizStore((state)=>state.addQuiz);

    const [error,setError] = useState<string|null>(null);
    const [isLoading,setIsLoading]=useState(false);
    

    //the newly generated quiz doesnot have all data
    //so
    //finding specific quiz
    const specificQuiz = quizzes.find((q) => q.quizId === quiz.quizId);

    const handleGetQuizById = async() => {
      try{
      setError(null);
      setIsLoading(true);

      const response : IQuizOverviewResponse= await getQuizById(quizId);
      console.log(response);
      //now we have all data of this specific quiz
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
  
    const openModal = ()=>{
      setIsModalOpen(true);
      //if length is 0, null, or undefined, then fetch
      if ( !specificQuiz?.questions?.length ) {
        handleGetQuizById();
      }
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
      <div onClick={openModal} className="flex justify-between blue-hover">
        <div className="relative flex items-center">
          {isRenameModalOpen ? (
            <RenameQuizOverview 
              handleUpdateQuizTitle={handleUpdateQuizName}
              closeRenameModal={closeRenameModal}
              quiz={quiz}
            />
          ) : (
            <p className="font-light text-blue-700">{quiz.title}</p>
          )}
        </div>

        
        {/* {quiz.sourceId.length > 0 && (
          <span className="font-light text-xs text-blue-700 ">
            {quiz.sourceId.length} {quiz.sourceId.length === 1 ? 'source' : 'sources'}
          </span>
        )} */}
        
        {!isRightPanelClose &&(
          <button onClick={(e) => { e.stopPropagation(); handleShowMenu(quiz.quizId); }} 
            className=" flex-center three-dots bg-bg-tri/50 text-text-pri text-xl">
            &#x22EE;
          </button>
        )}
      </div>

      {openMenuId === quiz.quizId && (
      <>
        <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); handleHideMenu(); }}></div>
        
        <div className="absolute top-10 right-0 z-20 w-32 rounded shadow-lg bg-bg-sec border border-border-pri">

          <button onClick={(e) => { e.stopPropagation(); openDeleteModal(); handleHideMenu(); }} 
            className="w-full text-left p-2 text-m font-bold text-red-600 hover:bg-bg-tri">
            Delete
          </button>

          <button onClick={(e) => { e.stopPropagation(); openRenameModal(); handleHideMenu(); }} 
            className="w-full text-left p-2 text-m text-text-sec hover:bg-bg-tri">
            Rename
          </button>
        </div>
      </>
      )}
    </div>
      
    <Modal
      isOpen={isDeleteModalOpen} //changes done here only
      onRequestClose={closeDeleteModal} 
      overlayClassName="fixed inset-0 bg-black/50 flex-center z-50" 
      className="outline-none w-full max-w-md mx-4 overflow-hidden shadow-xl" >

      <DeleteQuizOverview 
        quizId={quiz.quizId} 
        closeDeleteModal={closeDeleteModal}
      />
    </Modal>

    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal} //press esc to close
      overlayClassName="fixed inset-0 bg-black/50 flex-center z-50" 
      className=" outline-none w-full max-w-5xl max-h-[90vh] mx-4 overflow-hidden shadow-xl" >
      
      {specificQuiz && specificQuiz.questions && specificQuiz.questions.length > 0 ? (
        <QuizViewer
          quiz={specificQuiz}
          onClose={closeModal}
          handleUpdateQuizName={handleUpdateQuizName}
          
          />
      ):(
        <div>Error while occure while getting quiz </div>
      )}
        
    </Modal>
    
    </>  


  )
};

export default QuizGet;