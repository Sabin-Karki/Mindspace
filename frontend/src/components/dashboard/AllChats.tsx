import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { deleteChat, fetchAllChatSessions, renameChatTitle } from "../../api/chatApi";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";
import DeleteChatModal from "./DeleteChat";
import RenameChatModal from "./RenameChat";
import { useChatListStore } from "../../store/chatListStore";
import { toast } from "sonner";

interface AllChatsProps {
  searchQuery: string;
}

const AllChats = ({ searchQuery }: AllChatsProps) =>{

  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const setSessionId = useSessionStore((state) => state.setSessionId);
  const changeChatTitle = useSessionStore((state) => state.changeChatTitle);

  const sessions = useChatListStore((state) => state.sessions);
  const setSessions = useChatListStore((state) => state.setSessions);

  const [localSessionId, setLocalSessionId] = useState<number>(0);
  const [localChatTitle, setLocalChatTitle] = useState<string | null>(null);
  const [openMenuId, setMenuId] = useState<number | null>(null);//which menu is open
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleUserChats = async() =>{
      try {
        setIsLoading(true);
        setError(null);
  
        const response = await fetchAllChatSessions();

        setSessions(response);  //set all chat sessions

      } catch (error: any) {
        const serverMessage = error?.response?.data?.message; 
        const axiosMessage = error?.message; 
        const message = serverMessage || axiosMessage || "Failed to load all user chats. Please refresh and try again.";
        setError(message);
        toast.error(message);
      }finally {
        setIsLoading(false);
      }
    }
    
    handleUserChats();
  },[token, setSessions])
  
  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (sessions.length === 0) return null; // Don't show anything if there are no sessions at all
  
  const handleChatClick = (sessionId: number, title: string) => {
    setSessionId(sessionId);
    changeChatTitle(title);
    
    navigate(`/chat`);
  };

  const handleSelectSession = (sessionId: number) => {
    setLocalSessionId(sessionId);
  };

  const handleSelectLocalChatTitle = (title: string) => {
    setLocalChatTitle(title);
  };

  const handleDeleteChatSession = async(sessionId: number) =>{
    try {
      await deleteChat(sessionId);
      toast.success("Chat deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete chat. Please try again.");
    }
  }

  const handleRenameChatTitle = async (sessionId: number, title: string) =>{
    try {   
      const response = await renameChatTitle(sessionId, title);
      toast.success("Chat renamed successfully. New title: " + response.title);
    } catch (error) {
      console.log(error);
      toast.error("Failed to rename chat. Please try again.");
    }
  }

  const handleShowMenu = (id: number) => {
    setMenuId( id === openMenuId ? null :id);
  };

  const handleHideMenu = () => {
    setMenuId(null);
  };

  const handleShowDeleteModal = () =>{
    setIsDeleteModalOpen(true);
  }

  const handleHideDeleteModal = () =>{
    setIsDeleteModalOpen(false);
  }

  const handleShowRenameModal = () =>{
    setIsRenameModalOpen(true);
  }
 const handleHideRenameModal = () =>{
    setIsRenameModalOpen(false);
  }

  return (
  <>
    {filteredSessions.length === 0 ? (
      <div className="p-4 text-center text-gray-500">No notebooks found matching your search.</div>
    ) : (
      filteredSessions.map((session) => (
        <div key={session.sessionId} 
          className="w-48 h-48 flex flex-col justify-between rounded-xl border border-pink-300 p-5 text-left shadow-sm transition hover:shadow-md hover:border-pink-400 hover:bg-pink-50 focus:outline-none">
          
          <button className="flex flex-col gap-1 text-left h-full" onClick={() => handleChatClick(session.sessionId, session.title)}> 
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-4">{session.title}</h3>
            <span className="text-xs text-gray-500 mt-auto">{new Date(session.createdAt).toLocaleDateString()}</span>
          </button>

          {/* menu options : for delete and rename */}
          <div className="relative flex flex-col items-end justify-end">
            <button 
              onClick={ () => handleShowMenu(session.sessionId) } 
              className=" flex-center w-8 h-8 text-xl text-gray-600 hover:text-amber-600 -mr-2
                 border border-gray-300 rounded-full hover:bg-gray-100">
              &#x22EE;
            </button> 
            
            {session.sessionId !== null && openMenuId === session.sessionId && (
              <>
              {/* this is invisible div if user click outside menu options they click here which hides the menu options */}
              <div onClick={ (e) =>{ e.stopPropagation(); handleHideMenu(); }} className="relative z-10" > </div>
              {/* actual options */}
              <div className="absolute right-0 z-20 w-32 top-10 bg-white rounded shadow-lg border border-gray-100">
                
                <button onClick={() => {
                  handleShowRenameModal(); 
                  handleHideMenu();
                  handleSelectSession(session.sessionId);
                  handleSelectLocalChatTitle(session.title);
                  }} 
                  className="w-full text-left p-4 text-m text-gray-800 hover:bg-gray-100"> 
                  Rename
                </button>
                <button onClick={() => {
                  handleShowDeleteModal();
                  handleHideMenu();
                  handleSelectSession(session.sessionId);
                  }} 
                  className="w-full text-left p-4 text-m text-red-600 hover:bg-gray-100">
                  Delete
                </button>
                
              </div>
            </>
            )}
          </div>

        </div>
      ))
    )}

    {isDeleteModalOpen && localSessionId && (
      <DeleteChatModal 
        handleHideDeleteModal={handleHideDeleteModal} 
        handleDeleteChatSession={handleDeleteChatSession} 
        localSessionId={localSessionId} />
    )}
    {isRenameModalOpen && (
      <RenameChatModal 
        handleHideRenameModal={handleHideRenameModal}
        handleRenameChatTitle={handleRenameChatTitle}
        localSessionId={localSessionId}
        localChatTitle={localChatTitle}
      />
    )}
    
  </>
  )
}

export default AllChats;
