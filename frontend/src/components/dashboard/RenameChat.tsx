import { useState } from "react";
import { useChatListStore } from "../../store/chatListStore";

interface RenameChatModalProps {
    handleHideRenameModal: () => void;
    handleRenameChatTitle: (sessionId: number, title: string) => Promise<void>;
    localSessionId: number;
    localChatTitle: string | null;
  }
const RenameChatModal = ({handleHideRenameModal, handleRenameChatTitle, localSessionId, localChatTitle}: RenameChatModalProps) => {

  const [localTitle, setLocalTitle] = useState<string>(localChatTitle || 'Enter chat title');
  const renameSession = useChatListStore((state) => state.renameSession);

  const handleBlur = () => {
    setLocalTitle(localTitle);
    handleHideRenameModal();
  };

  const handleKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Escape') {
      handleHideRenameModal();
    }
    if(localTitle === localChatTitle || localTitle.trim().length === 0) {
      return;
    } 
    if (e.key === 'Enter') {
      handleRenameChatTitle(localSessionId, localTitle);
      handleHideRenameModal();
      renameSession(localSessionId, localTitle);  //update list
    }
  };

  return(
    <>
      <div onClick={handleHideRenameModal} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md text-gray-800" >

        <h2 className="text-xl font-semibold mb-4">Rename Notebook</h2>
        <input 
          type="text" 
          value={localTitle}
          onBlur={handleBlur}
          onChange={(e) => setLocalTitle(e.target.value)} 
          onKeyDown={handleKeyEnter}
          className="w-full p-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <div className="flex justify-end gap-3">
          <button onClick={handleHideRenameModal} className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition duration-150 ease-in-out">
            Cancel
          </button>
          <button onClick={() => {
            handleRenameChatTitle(localSessionId, localTitle);
            handleHideRenameModal();
            renameSession(localSessionId, localTitle);
          }} className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition duration-150 ease-in-out">
            OK
          </button>
        </div>
      </div>
      </div>
    </>
  )
}

export default RenameChatModal;