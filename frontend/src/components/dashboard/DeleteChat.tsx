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
    <div onClick={handleHideDeleteModal} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div onClick={(e) => e.stopPropagation()} className="bg-bg-pri rounded-lg p-6 shadow-xl w-full max-w-md text-text-pri" >

      <h2 className="text-xl font-semibold mb-4">Delete Notebook</h2>

      <p className="mb-6 text-text-pri">Are you sure you want to delete this notebook? This action cannot be undone.</p>
      <div className="flex justify-end gap-3">
        <button onClick={handleHideDeleteModal} className="px-4 py-2 text-text-pri rounded-md hover:bg-bg-tri transition duration-150 ease-in-out">
          Cancel
        </button>
        <button onClick={() => 
            { handleDeleteChatSession(localSessionId);
              handleHideDeleteModal();
              deleteSession(localSessionId);
            }
          } className="px-4 py-2 bg-red-600 text-text-pri rounded-md hover:bg-red-700 transition duration-150 ease-in-out">
          Delete
        </button>
      </div>

    </div>
    </div>
    </>
  )
}

export default DeleteChatModal;