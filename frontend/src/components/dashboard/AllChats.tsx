import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { deleteChat, fetchAllChatSessions, renameChatTitle } from "../../api/chatApi";
import type { ChatSessionGetDTO } from "../../types";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";
import DeleteChatModal from "./DeleteChat";
import RenameChatModal from "./RenameChat";
import { useChatListStore } from "../../store/chatListStore";
import { toast } from "sonner";

const AllChats = () =>{

  const navigate = useNavigate();
  const loggedInUserId = useAuthStore((state) => state.token);

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

        console.log(response);
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
  },[loggedInUserId])
  

  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (sessions.length === 0) return <div>No chats found.</div>;


  //update global sessionId and chat title
  //before navigation
  //?????????
  
 const handleChatClick = (sessionId: number, title: string) => {
    setSessionId(sessionId);
    changeChatTitle(title);
    
    navigate(`/chat`);
  };

  //set localSessionId for menu options to know which to rename or delete
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

  const handleShowDeleteModal = ( ) =>{
    setIsDeleteModalOpen(true);
  }

  const handleHideDeleteModal = ( ) =>{
    setIsDeleteModalOpen(false);
  }

  const handleShowRenameModal = ( ) =>{
    setIsRenameModalOpen(true);
  }
 const handleHideRenameModal = ( ) =>{
    setIsRenameModalOpen(false);
  }


  return (
  <>
    <div className="flex flex-wrap gap-4 p-4" >
    {sessions.map((session) => (
      // Added 'relative' to the chat item for absolute positioning of the menu
      <div key={session.sessionId} className="flex bg-white rounded-lg border border-amber-400 p-12 relative">
        
        {/* set global sessionId and title and go to chat  */}
        <button 
          className="flex-grow text-left p-2"
          onClick={() => handleChatClick(session.sessionId, session.title)}
        > 
          <div className="text-2xl text-red-800">{session.title}</div>
          <div className="text-2xl text-gray-500">{session.createdAt}</div>
        </button>
        
        {/* 3 dots menu container */}
        <div className="relative flex items-center">
          <button 
          // this shows a drop menu with rename and delete option
            onClick={ () => handleShowMenu(session.sessionId) } 
            className="text-2xl text-gray-700 hover:text-amber-600 px-2 ">
            &#x22EE;
          </button>
          
          {/* Dropdown Menu has delete rename options*/}
          {session.sessionId !== null && openMenuId === session.sessionId && (
            <div className="absolute top-18 right-0 z-10 w-32 bg-white rounded shadow-lg border border-gray-100">
              
              {/* click to see delete modal */}
              <button onClick={() => {
                  handleShowDeleteModal();
                  handleHideMenu(); //hide the dropdown menu
                  handleSelectSession(session.sessionId);
                }} 
                className="w-full text-left p-2 text-sm text-red-600 hover:bg-gray-100">
                Delete
              </button>

              {/* click to see rename modal */}
              <button onClick={() => {
                  handleShowRenameModal(); 
                  handleHideMenu();   //hide the dropdown menu
                  handleSelectSession(session.sessionId);
                  handleSelectLocalChatTitle(session.title);
                }} 
                className="w-full text-left p-2 text-sm text-gray-800 hover:bg-gray-100"> 
                Rename
              </button>
            </div>
          )}
          </div>
        </div>
      ))}
    </div>

    {/* this will be all over the page whole screen */}
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

//   //Eg data
//   const sessions: ChatSessionGetDTO[] = [
//   {
//     sessionId: 101,
//     title: "Project Alpha Planning Notes",
//     createdAt: "2025-11-15"
//   },
//   {
//     sessionId: 102,
//     title: "Untitled notebook",
//     createdAt: "2025-11-18"
//   },
//   {
//     sessionId: 103,
//     title: "Meeting Minutes - Q3 Review",
//     createdAt: "2025-11-10"
//   }
// ];