import { toast } from "sonner";
import { deleteSource } from "../../api/contentApi";
import { useSessionStore } from "../../store/sessionStore";

const DeleteUpload = ( {sourceId, closeDeleteModal} :{sourceId : number, closeDeleteModal: () => void}) => {

  const removeSource = useSessionStore((state) => state.removeSource);


  //delete flash card
  const handleDeleteUploadSource = async() =>{
    try {
      await deleteSource(sourceId);
      toast.success("Card deleted successfully.");

      //update state
      removeSource(sourceId);
      toast.success("Card deleted successfully.");
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
          
        <div className="p-4">Are you sure you want to delete this upload source?</div>
        <div className="flex justify-between items-center">
          <button onClick={() =>{ handleDeleteUploadSource(); closeDeleteModal(); } } >Delete</button>
          <button onClick={closeDeleteModal} >Cancel</button>
        </div>
      </div>
    </>
  )
}

export default DeleteUpload;