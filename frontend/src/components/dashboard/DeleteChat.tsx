import { useChatListStore } from "../../store/chatListStore";

interface DeleteChatModalProps {
  handleHideDeleteModal: () => void;
  handleDeleteChatSession: (sessionId: number) => void;
  localSessionId: number;
}

const DeleteChatModal = ({handleHideDeleteModal, handleDeleteChatSession, localSessionId}: DeleteChatModalProps) => {

  const deleteSession = useChatListStore((state) => state.deleteSession);
  
  return(
    <>
    <div onClick={handleHideDeleteModal} className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
    <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-4 w-full max-w-md text-white" >

      <h2 className="text-lg font-semibold mb-4">Delete Chat</h2>

      <p className="mb-4">Are you sure you want to delete this chat?</p>
      <button onClick={() => 
          { handleDeleteChatSession(localSessionId);
            handleHideDeleteModal();
            deleteSession(localSessionId);  //update list
          }
        }>ok</button>
      <button onClick={ handleHideDeleteModal }>cancel</button>

    </div>
    </div>
    </>
  )
}

export default DeleteChatModal;