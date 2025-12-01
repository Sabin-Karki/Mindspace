import { toast } from "sonner";
import { deleteFlashCardOverview } from "../../../api/flashApi";
import { useFlashCardStore } from "../../../store/flashCardStore";

const DeleteFlashCard = ( {cardOverViewId, closeDeleteModal} :{cardOverViewId : number, closeDeleteModal: () => void}) => {

  const removeFlashCard = useFlashCardStore((state) => state.removeFlashCard);


  //delete flash card
  const handleDeleteFlashCard = async() =>{
    try {
      await deleteFlashCardOverview(cardOverViewId);
      toast.success("Chat deleted successfully.");

      //update state
      removeFlashCard(cardOverViewId);
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
          
        <div className="p-4">Are you sure you want to delete this flash card?</div>
        <div className="flex justify-between items-center">
          <button onClick={() =>{ handleDeleteFlashCard(); closeDeleteModal(); } } >Delete</button>
          <button onClick={closeDeleteModal} >Cancel</button>
        </div>
      </div>
    </>
  )
}

export default DeleteFlashCard;