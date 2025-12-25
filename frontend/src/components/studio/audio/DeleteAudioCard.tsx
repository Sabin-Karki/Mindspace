import { toast } from "sonner";
import { deleteAudioOverview } from "../../../api/audioApi";
import { useAudioCardStore } from "../../../store/audioStore";

const DeleteAudioCard = ( {cardOverViewId, closeDeleteModal} :{cardOverViewId : number, closeDeleteModal: () => void}) => {

  const removeAudioCard = useAudioCardStore((state) => state.removeAudioCard);


  //delete audio card
  const handleDeleteAudioCard = async() =>{
    try {
      await deleteAudioOverview(cardOverViewId);
      toast.success("Chat deleted successfully.");

      //update state
      removeAudioCard(cardOverViewId);
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
          
        <div className="p-4">Are you sure you want to delete this audio card?</div>
        <div className="flex justify-between items-center">
          <button onClick={() =>{ handleDeleteAudioCard(); closeDeleteModal(); } } >Delete</button>
          <button onClick={closeDeleteModal} >Cancel</button>
        </div>
      </div>
    </>
  )
}

export default DeleteAudioCard;