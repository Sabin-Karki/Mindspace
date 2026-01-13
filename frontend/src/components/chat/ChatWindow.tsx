import { useEffect, useRef, useState } from "react";
import type { IChatMessage } from "../../types";
import { askQuestion, getChatHistory } from "../../api/chatApi";
import { useSessionStore } from "../../store/sessionStore";
import { toast } from "sonner";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatInput from "./ChatInput";


//for later
//use zod validation for input
  
const ChatWindow: React.FC = () => {

  const sessionId = useSessionStore((state) => state.sessionId);
  const currentSessionSources = useSessionStore((state)=>state.sources);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  
  // const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  
  // // scroll animation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });//scroll to bottom
   
  }, [messages]);


  useEffect( () =>{
  // yes this is retrieving chat history of the session from database,but firstly i need the summary of the 1st source uploaded to be pinned in top of chat window,just like system message but it should look like normal message in the same container as other messages
  //chat history
    const initialChat = async()=>{
      //i need to declare intialMessage of type chatmessage [] ,so it stores objects of chatmessage type for summary of first source uploaded
      try{
      let initialMessage :IChatMessage[] = [];
      if(currentSessionSources!=null && currentSessionSources.length>0){
        const summaryOfFirstSource = currentSessionSources[0].summary;
        if(summaryOfFirstSource){
          initialMessage = [{
          messageId:"UUID_System",
          role:"system",
          message:`Summary  : \n\n${summaryOfFirstSource}`,
          createdAt:new Date().toISOString(),
        }]
      }}
      
      try {

        const history: IChatMessage[] = await getChatHistory(sessionId);  
        const formattedMessages : IChatMessage[] = history.map(msg=>({
          messageId:msg.messageId,
          message:msg.message,
          role:msg.role as 'user' | 'assistant',
          createdAt:msg.createdAt,
        }));
        initialMessage=[...initialMessage,...formattedMessages]; //spread operator...so the summary is followed by the messages from user or the assistant   
      }catch(historyErr){
        console.error("No history found ", historyErr);
      }
      setMessages(initialMessage);
      } catch (error: any) {
        console.log(error);
        const serverMessage = error?.response?.data?.message; 
        const axiosMessage = error?.message; 
        const message = serverMessage || axiosMessage || "Failed to get Message History. Please try again.";
        setError(message);
        toast.error(message);
      }finally{
        setIsLoading(false);
      }
    }
    if(sessionId){
      initialChat();
    }
  },[sessionId,currentSessionSources]);

  const handleSendMessage = async(input: string) =>{
    if(!sessionId || !input){
      setError("session or question not found");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      //create users temporary message
      const newMessage: IChatMessage = {
        messageId: self.crypto.randomUUID(),
        role: 'user',
        message: input,
        createdAt: new Date().toISOString(),
      }

      //immediately show user message 
      //instead of waiting for server to respond
      setMessages([...messages, newMessage]);

      const chatResponse: IChatMessage = await askQuestion(sessionId, input);

      //if proper response from server with id 
      //set messages using ids  
      //create assistant temporary message
      const assistantMessage: IChatMessage = {
        messageId: chatResponse.messageId,
        role: 'assistant',
        message: chatResponse.message,
        createdAt: new Date().toISOString()
      }

      setMessages([...messages, newMessage, assistantMessage]);
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }



return (
  <>
    <div className=" flex flex-col bg-bg-pri text-text-pri text-m relative min-h-[calc(100vh-50px)] "> 
      
      <div className="p-1 border-b border-border-pri">
        <h2>Chat</h2>
        {/* {sessionId && <p>Session: {sessionId}</p>} */}
        {error && (
          <div>
            <p>Error: {error}</p>
          </div>
        )}
        {isLoading && <p>Loading...</p>}
      </div>
      
      {/* message box */}
      <div className="flex-1 overflow-y-auto p-2">
        {messages.length === 0 ? (
          <>
          <div>No messages yet. Start a conversation!</div>
          </>
        ) : (
          messages.map((mess) => (
            <ChatMessageBubble 
              key={mess.messageId}
              message={mess}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* input box */}
      <div className="">
        <ChatInput 
          handleSendMessage={handleSendMessage}
          />
      </div>

    </div>
  </>
  )
};


export default ChatWindow;



// min-h-[calc(100vh-40px)]