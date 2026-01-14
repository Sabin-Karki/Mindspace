import { useState } from "react";
import { createChatSession } from "../../api/chatApi";
import { useSessionStore } from "../../store/sessionStore";
import { useNavigate } from "react-router-dom";
import type { IChatSession } from "../../types";
import { toast } from "sonner";


const CreateChat = () =>{

  const navigate = useNavigate(); 
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const changeChatTitle = useSessionStore((state) => state.changeChatTitle);
  const clearSources = useSessionStore((state) => state.clearSources);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleCreateChat = async() =>{
    try {
      setIsLoading(true);
      setError(null);
      const response: IChatSession = await createChatSession();
      
      if(response && response.sessionId && response.title){
        //set new id title and clear previous sources
        setSessionId(response.sessionId);
        changeChatTitle(response.title);
        clearSources();

        navigate(`/chat`); //navigate to /chat after creating a chat
      }else {
        setError("Failed to create chat session. Please try again.");
        toast.error("Failed to create chat session. Please try again.");
      }

    } catch (error: any) {
      const serverMessage = error?.response?.data?.message; 
      const axiosMessage = error?.message; 
      const message = serverMessage || axiosMessage || "Failed to create chat session. Please try again.";
      setError(message);
      toast.error(message);
    }finally {
      setIsLoading(false);
    }
  }

  return (
  <>
    <div 
      onClick={handleCreateChat}
      className={`w-48 h-48 px-2 flex flex-col justify-center items-center rounded-xl bg-bg-pri shadow-lg
        border-2 border-border-pri text-text-pri transition duration-200 ease-in-out 
        ${isLoading || error ? 'cursor-not-allowed opacity-60' : 'hover:bg-bg-tri cursor-pointer'}`}
    >
      <button
        disabled={isLoading || !!error}
        className="flex flex-col justify-center items-center"
      >
        <div 
          className={`w-16 h-16 rounded-full flex-center mb-4 transition-all duration-200 ${isLoading ? 'bg-bg-pri animate-pulse' : 'bg-bg-pri hover:bg-bg-pri'}`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-border-pri border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="text-3xl font-light leading-none">+</span>
          )}
        </div>

        <p className="text-xl text-text-sec font-medium">
          {isLoading ? 'Creating Session...' : 'Create new notebook'}
        </p>
      </button>
    </div>

    {/* Error Display - Placed outside the card but in the component */}
    {error && (
      <div className="mt-4 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md">
        <p className="text-sm font-semibold">Error:</p>
        <p className="text-sm">{error}</p>
      </div>
    )}
  </>
  );
}

export default CreateChat;