import { useState } from "react";
import { useSessionStore } from "../../store/sessionStore";
import { renameChatTitle } from "../../api/chatApi";
import { toast } from "sonner";

const ChatTitle = () =>{
  const sessionId = useSessionStore((state) => state.sessionId);
  const globalChatTitle = useSessionStore((state) => state.chatTitle);
  const changeChatTitle = useSessionStore((state) => state.changeChatTitle);
  const [error, setError ] = useState<string | null>(null);

  const [localTitle, setLocalTitle] = useState<string>(globalChatTitle || "Untitled Notebook");


  //make local title a global title
  const handleRenameChatTitle = async () =>{
    if(!localTitle || localTitle.length === 0){
      setLocalTitle("Untitled Notebook");
    }
    if(!sessionId ){
      console.log("Session ID is missing. Please log in.");
      setError("Session ID is missing. Please log in.");
      return;
    }
    try {   
      //handle rename api
      const response = await renameChatTitle(sessionId, localTitle);
      console.log(response);
      changeChatTitle(response.title);
      toast.success("Chat renamed successfully. New title: " + response.title);
    } catch (error) {
      console.log(error);
      toast.error("Failed to rename chat. Please try again.");
    }
  }

  const handleChatTitle = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setLocalTitle(e.target.value);//change state of local title
  }

  //press enter to change chat title
  const handleKeyDown = (e: React.KeyboardEvent) =>{
    if(e.key === "Enter"){
      handleRenameChatTitle();
    }
  }

  return (
    <>
    <div className="mx-6">
      <input type="text"   value={localTitle} onChange={handleChatTitle} onKeyDown={handleKeyDown} 
        className="flex-grow p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 "/>
      
      { error && <span className="text-red-500">{error}</span>}
    </div>
    </>

  )
}

export default ChatTitle;