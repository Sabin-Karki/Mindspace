import { toast } from "sonner";
import { deleteReport } from "../../../api/reportApi";
import { useReportCardStore } from "../../../store/reportStore";

const DeleteReportCard = ( {cardOverViewId, closeDeleteModal} :{cardOverViewId : number, closeDeleteModal: () => void}) => {

  const removeReportCard = useReportCardStore((state) => state.removeReportCard);


  //delete report card
  const handleDeleteReportCard = async() =>{
    try {
      await deleteReport(cardOverViewId);
      toast.success("Chat deleted successfully.");

      //update state
      removeReportCard(cardOverViewId);
      toast.success("Chat deleted successfully.");
      // closeDeleteModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete chat. Please try again.");
    }
  }

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-lg p-4 w-full flex flex-col text-white" >
          
        <div className="p-4">Are you sure you want to delete this report card?</div>
        <div className="flex justify-between items-center">
          <button onClick={() =>{ handleDeleteReportCard(); closeDeleteModal(); } } >Delete</button>
          <button onClick={closeDeleteModal} >Cancel</button>
        </div>
      </div>
    </>
  )
}

export default DeleteReportCard;