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

// Card background colors - soft pastels like NotebookLM
const cardColors = [
  "bg-amber-900/80  hover:bg-amber-800",
  "bg-sky-900/80    hover:bg-sky-800",
  "bg-violet-900/80 hover:bg-violet-800",
  "bg-emerald-900/80 hover:bg-emerald-800",
  "bg-rose-900/80   hover:bg-rose-800",
  "bg-orange-900/80 hover:bg-orange-800",
];

// Topic-based emojis for variety
const cardEmojis = ["📚", "💡", "🎯", "📝", "🔬", "💻", "🎨", "📊", "🧠", "⚡"];

const getCardColor = (id: number) => cardColors[id % cardColors.length];
const getCardEmoji = (id: number) => cardEmojis[id % cardEmojis.length];

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

const AllChats = ({ searchQuery }: AllChatsProps) => {

  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const setSessionId = useSessionStore((state) => state.setSessionId);
  const changeChatTitle = useSessionStore((state) => state.changeChatTitle);

  const sessions = useChatListStore((state) => state.sessions);
  const setSessions = useChatListStore((state) => state.setSessions);

  const [localSessionId, setLocalSessionId] = useState<number>(0);
  const [localChatTitle, setLocalChatTitle] = useState<string | null>(null);
  const [openMenuId, setMenuId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleUserChats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchAllChatSessions();
        setSessions(response);

      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        const axiosMessage = error?.message;
        const message = serverMessage || axiosMessage || "Failed to load all user chats. Please refresh and try again.";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }

    handleUserChats();
  }, [token, setSessions])

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-52 rounded-xl bg-bg-sec animate-pulse" />
        ))}
      </>
    );
  }

  if (error) return <div className="col-span-full text-center py-8 text-text-sec text-sm">{error}</div>;
  if (sessions.length === 0) return null;

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

  const handleDeleteChatSession = async (sessionId: number) => {
    try {
      await deleteChat(sessionId);
      toast.success("Chat deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete chat. Please try again.");
    }
  }

  const handleRenameChatTitle = async (sessionId: number, title: string) => {
    try {
      const response = await renameChatTitle(sessionId, title);
      toast.success("Chat renamed successfully. New title: " + response.title);
    } catch (error) {
      console.log(error);
      toast.error("Failed to rename chat. Please try again.");
    }
  }

  const handleShowMenu = (id: number) => {
    setMenuId(id === openMenuId ? null : id);
  };

  const handleHideMenu = () => {
    setMenuId(null);
  };

  const handleShowDeleteModal = () => {
    setIsDeleteModalOpen(true);
  }

  const handleHideDeleteModal = () => {
    setIsDeleteModalOpen(false);
  }

  const handleShowRenameModal = () => {
    setIsRenameModalOpen(true);
  }

  const handleHideRenameModal = () => {
    setIsRenameModalOpen(false);
  }

  // No search results
  if (filteredSessions.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-sm text-text-sec">No notebooks matching "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <>
      {filteredSessions.map((session) => (
        <div
          key={session.sessionId}
          className={`group relative h-52 rounded-xl ${getCardColor(session.sessionId)}
            transition-all duration-200 hover:shadow-lg hover: cursor-pointer`}
          onClick={() => handleChatClick(session.sessionId, session.title)}
        >
          {/* Card Content */}
          <div className="h-full p-4 flex flex-col">
            {/* Large Emoji */}
            <span className="text-4xl mb-3">{getCardEmoji(session.sessionId)}</span>

            {/* Title */}
            <h3 className="text-gray-100  font-medium text-sm leading-snug line-clamp-3 flex-1">
              {session.title}
            </h3>

            {/* Date */}
            <span className="text-gray-100 text-xs">{formatDate(session.createdAt)}</span>
          </div>

          {/* Menu button - top right */}
          <button         
            onClick={(e) => { e.stopPropagation(); handleShowMenu(session.sessionId); }}
            className={`
              inline-flex items-center justify-center shrink-0 absolute top-3 right-3 w-8 h-8 p-4
              border-none rounded-full cursor-pointer  transition-all duration-200 text-gray-100
              opacity-100 md:opacity-0 md:group-hover:opacity-100 
               ${openMenuId === session.sessionId // Keep visible if menu is open else hover
                ? 'bg-black/10 '
                : 'hover:bg-black/10 '}
              `}>
            <span className="text-white text-xl font-bold">&#x22EE;</span>
          </button>  

          {/* Dropdown Menu */}
          {openMenuId === session.sessionId && (
            <>
              <div onClick={(e) => { e.stopPropagation(); handleHideMenu(); }} className="fixed inset-0 z-10" />
              <div className="absolute right-3 top-11 z-20 w-28 py-1 bg-bg-pri rounded-lg shadow-lg border border-border-pri overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowRenameModal();
                    handleHideMenu();
                    handleSelectSession(session.sessionId);
                    handleSelectLocalChatTitle(session.title);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-text-pri hover:bg-bg-sec transition-colors"
                >
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowDeleteModal();
                    handleHideMenu();
                    handleSelectSession(session.sessionId);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50  transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}

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
