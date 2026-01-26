import { useState } from "react";
import { createChatSession } from "../../api/chatApi";
import { useSessionStore } from "../../store/sessionStore";
import { useNavigate } from "react-router-dom";
import type { IChatSession } from "../../types";
import { toast } from "sonner";


const CreateChat = () => {

  const navigate = useNavigate();
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const changeChatTitle = useSessionStore((state) => state.changeChatTitle);
  const clearSources = useSessionStore((state) => state.clearSources);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleCreateChat = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: IChatSession = await createChatSession();

      if (response && response.sessionId && response.title) {
        //set new id title and clear previous sources
        setSessionId(response.sessionId);
        changeChatTitle(response.title);
        clearSources();

        navigate(`/chat`); //navigate to /chat after creating a chat
      } else {
        setError("Failed to create chat session. Please try again.");
        toast.error("Failed to create chat session. Please try again.");
      }

    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      const axiosMessage = error?.message;
      const message = serverMessage || axiosMessage || "Failed to create chat session. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleCreateChat}
      disabled={isLoading || !!error}
      className={`group h-52 rounded-xl bg-bg-tri border-2 border-border-pri
        flex flex-col items-center justify-center gap-2 transition-all duration-200
        ${isLoading || error
          ? 'cursor-not-allowed opacity-50'
          : 'hover:bg-bg-tri cursor-pointer'}`}
    >
      {/* Plus Icon */}
      <div className={`w-10 h-10 rounded-full border-2 border-dashed border-text-tri
        flex items-center justify-center transition-all duration-200
        ${isLoading ? '' : 'group-hover:border-text-sec group-hover:scale-105'}`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-text-tri border-t-blue-500 rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5 text-text-tri group-hover:text-text-sec transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </div>

      {/* Text */}
      <span className="text-sm text-text-sec">
        {isLoading ? 'Creating...' : 'Create new notebook'}
      </span>
    </button>
  );
}

export default CreateChat;