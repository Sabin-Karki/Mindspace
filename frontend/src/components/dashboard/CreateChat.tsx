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
      // Dark background, rounded corners, subtle border/shadow, cursor pointer
      className={`
        w-48 h-48 px-2 flex flex-col justify-center items-center 
        rounded-xl 
        bg-gray-800 
        shadow-lg 
        border border-gray-700 
        text-white 
        transition duration-200 ease-in-out
        ${isLoading || error // Disable interactions if loading or error
          ? 'cursor-not-allowed opacity-60' 
          : 'hover:bg-gray-700 cursor-pointer'
        }
      `}
    >
      <button
        disabled={isLoading || !!error} // Use the entire div as the click target, but the button handles the disabled state visually
        className="flex flex-col justify-center items-center"
      >
        {/* Circular Button/Icon Area */}
        <div 
          className={`
            w-16 h-16 
            rounded-full 
            flex justify-center items-center 
            mb-4 
            transition-all duration-200
            ${isLoading 
              ? 'bg-gray-600 animate-pulse' // Loading state
              : 'bg-indigo-900/70 hover:bg-indigo-800/80' // Active state color
            }
          `}
        >
          {/* Plus Icon / Spinner */}
          {isLoading ? (
            // Simple loading spinner (Tailwind doesn't have one, this is a basic substitute)
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            // Plus Icon
            <span className="text-3xl font-light text-white leading-none">+</span>
          )}
        </div>

        {/* Text Label */}
        <p className="text-xl text-gray-200 font-normal">
          {isLoading ? 'Creating Session...' : 'Create new notebook'}
        </p>
      </button>
    </div>

    {/* Error Display - Placed outside the card but in the component */}
    {error && (
      <div className="mt-4 p-2 bg-red-800 border border-red-600 text-red-200 rounded-md">
        <p className="text-sm font-semibold">Error:</p>
        <p className="text-sm">{error}</p>
      </div>
    )}
  </>
  );
}

export default CreateChat;