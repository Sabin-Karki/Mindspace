import { useState } from "react";
import { useChatsListStore } from "../../store/useChatsListStore";

interface RenameChatModalProps {
    handleHideRenameModal: () => void;
    handleRenameChatTitle: (sessionId: number, title: string) => Promise<void>;
    localSessionId: number;
    localChatTitle: string | null;
  }
const RenameChatModal = ({handleHideRenameModal, handleRenameChatTitle, localSessionId, localChatTitle}: RenameChatModalProps) => {

  const [localTitle, setLocalTitle] = useState<string>(localChatTitle || 'Enter chat title');
  const renameSession = useChatsListStore((state) => state.renameSession);

  const handleKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRenameChatTitle(localSessionId, localTitle);
      handleHideRenameModal();
      renameSession(localSessionId, localTitle);  //update list
    }
  };

  return(
    <>
      <div onClick={handleHideRenameModal} className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-4 w-full max-w-md text-white" >

        <h2 className="text-lg font-semibold mb-4">Rename Chat Title</h2>
        <input type="text" 
         value={localTitle}
         onChange={(e) => setLocalTitle(e.target.value)} 
         onKeyDown={handleKeyEnter}/>

        <button onClick={() => 
          {handleRenameChatTitle(localSessionId, localTitle);
           handleHideRenameModal();
           renameSession(localSessionId, localTitle);
          } }>ok</button>
        <button onClick={handleHideRenameModal}>cancel</button>

      </div>
      </div>
    </>
  )
}

export default RenameChatModal;