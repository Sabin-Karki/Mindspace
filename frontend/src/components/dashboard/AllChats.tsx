import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { fetchAllChatSessions } from "../../api/chatApi";
import type { ChatSessionGetDTO } from "../../types";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";

const AllChats = () =>{
  const loggedInUserId = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const { sessionId, setSessionId } = useSessionStore();
  const [sessions, setSessions] = useState<ChatSessionGetDTO[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleUserChats = async() =>{
      try {
        setIsLoading(true);
        setError(null);
  
        const response = await fetchAllChatSessions();
        console.log(response);
        setSessions(response)
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message; 
        const axiosMessage = error?.message; 
        const message = serverMessage || axiosMessage || "Failed to load all user chats. Please refresh and try again.";
        setError(message);
      }finally {
        setIsLoading(false);
      }
    }
    
    handleUserChats();
  },[loggedInUserId])
  
 const handleChatClick = (sessionId: number) => {
    setSessionId(sessionId);
    navigate(`/chat`);
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (sessions.length === 0) return <div>No chats found.</div>;

  return (
    <>
    {sessions.map((session) => (
      <button className="border-amber-500 "
        key={session.sessionId}
        onClick={() => handleChatClick(session.sessionId)}
      >
        <div>{session.title}</div>
        <div>{session.createdAt}</div>
      </button>
    ))}
    </>
  )
}

export default AllChats;