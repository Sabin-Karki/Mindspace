import { useState } from "react";
import { useReportCardStore } from "../../../store/reportStore";
import type { IReportResponse } from "../../../types";
import { updateReportTitle } from "../../../api/reportApi";
import { toast } from "sonner";
import Modal from "react-modal";
import RenameReportCard from "./RenameReportCard";
import ReportCardPopup from "./ReportPopup";
import DeleteReportCard from "./DeleteReportCard";
import { useLayoutStore } from "../../../store/layoutStore";

const ReportGet = ({report}: {report: IReportResponse}) => {

    const updateReportCardName = useReportCardStore((state) => state.updateReportCardName);
    const isRightPanelClose = useLayoutStore((state) => state.isRightPanelClose);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openMenuId, setMenuId] = useState<number | null>(null);//which menu is open
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  
    const [error, setError ] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

     //rename flash card
  const handleUpdateReportCardName = async( localFlashCardName: string ) =>{
    try {
      const response  = await updateReportTitle(report.reportId, localFlashCardName);
      updateReportCardName(response.reportId, response.title);  //update global state after flashcard name change

      toast.success("Flashcard name updated successfully.");
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      const axiosMessage = error?.message;
      const message = serverMessage || axiosMessage || "Failed to generate flashcard. Please try again.";
      setError(message);
      toast.error("Failed to update flashcard name. Please try again.");
      return;
    }
  }

  //show popup modal or close popup modal 
  const closeModal = () =>{
    setIsModalOpen(false);
  }
  const openModal = () =>{
    setIsModalOpen(true);
  }

  //handling individual menu options for flashcard
  //shows delete rename
  const handleShowMenu = (id: number) => {
    setMenuId( id === openMenuId ? null :id);
  };
  
  const handleHideMenu = () => {
    setMenuId(null);
  };

  const openDeleteModal = () =>{
    setIsDeleteModalOpen(true);
  }

  const closeDeleteModal = () =>{
    setIsDeleteModalOpen(false);
  }

  const openRenameModal = () => {
    setIsRenameModalOpen(true);
  }

  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
  }

  return (
    <>
    <div className="relative p-0">
      <div onClick={ openModal } className="flex justify-between purple-hover">
        
        <div className="relative flex items-center" >
          {/* this not a popup  just editing mode flash card name */}
          {isRenameModalOpen ?(
            <RenameReportCard 
              handleUpdateReportCardName={handleUpdateReportCardName}
              closeRenameModal={closeRenameModal}
              report={report}
            />
          ):(
            <p className="font-light text-purple-700">
              {report.title}
            </p>
          )}
        </div>

        {/* we only have 1 sources so not checking no. of sources*/}
        {/* <p>{report.sourceId.length ?? 0}</p> */}
        
        {/* menu options */}
        {!isRightPanelClose &&(
          <button         
            onClick={ (e) => { e.stopPropagation(); handleShowMenu(report.reportId); } } 
            className="flex-center three-dots bg-bg-tri/50 text-text-pri text-xl" >
            &#x22EE;
          </button>
        )}
      </div>
    
      {openMenuId === report.reportId && (
        <>

        {/* invisible backdrop for menu // covers whole screen //closes menu on click */}
        <div className="fixed inset-0 z-10" onClick={(e) =>{ e.stopPropagation(); handleHideMenu(); }}></div>

        {/* menu options on top of invisible backdrop */}
        <div className=" absolute top-10 right-0 z-20 w-32 rounded shadow-lg bg-bg-sec border border-border-pri " >
          <button onClick={(e) =>{ e.stopPropagation(); openDeleteModal(); handleHideMenu(); }} 
            className="w-full text-left p-2 text-m font-bold text-red-600 hover:bg-bg-tri">
            Delete
          </button>
          {/* when rename is clicked i get old value after i renamed */}
          <button onClick={(e) =>{ e.stopPropagation(); openRenameModal(); handleHideMenu(); }} 
            className="w-full text-left p-2 text-m text-text-sec hover:bg-bg-tri">
            Rename
          </button>
        </div>
        </>
      )}
      
    </div>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal} //press esc to close
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
        className=" outline-none w-full max-w-md mx-4 overflow-hidden shadow-xl" 
      >
        <DeleteReportCard
          closeDeleteModal={closeDeleteModal}
          cardOverViewId={report.reportId}
        />
      </Modal>
    
      {/* popup modal for showing flashcard details like QnA */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal} //press esc to close
        overlayClassName="fixed inset-0 bg-white/50 flex items-center justify-center z-50" 
        className=" outline-none w-full max-w-5xl max-h-[90vh] mx-4 overflow-hidden shadow-xl" 
      >
        <ReportCardPopup 
          reportId={report.reportId}
          closeModal={closeModal}   
          report={report}
          handleUpdateReportCardName={handleUpdateReportCardName}
        />
      </Modal>

    
    </>
  )
}

export default ReportGet;