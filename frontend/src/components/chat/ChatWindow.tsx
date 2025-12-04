import { useEffect, useRef, useState } from "react";
import type { IChatMessage, IChatResponse, MessageRole } from "../../types";
import { askQuestion, getChatHistory } from "../../api/chatApi";
import { useSessionStore } from "../../store/sessionStore";
import { toast } from "sonner";

// interface IDisplayMessage {
//   messageId: string; 
//   message: string;
//   role: 'user' | 'assistant' | 'system';
//   timestamp: Date;
// }

  
const ChatWindow: React.FC = () => {

  const sessionId = useSessionStore((state) => state.sessionId);

  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  

  //scroll animation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });//scroll to bottom
    if (messageInputRef.current) {
      messageInputRef.current.focus();  //focus on input
    }
  }, [messages]);


  useEffect( () =>{
  //chat history
    const getMessageHistory = async() =>{
      if(!sessionId){
        setError("session not found");
        return;
      }
      setError(null);
      setIsLoading(true);
      try {
        //we get response as IChatMessage
        //but to display we have IDisplayMessage
        const history: IChatMessage[] = await getChatHistory(sessionId);

        // const displayMessages: IDisplayMessage[] = history.map(
        //   (msg) =>({
        //     messageId: msg.messageId.toString(),//id needs to be unique //error here// message-2025-11-29
        //     message: msg.message,
        //     role: msg.role === "user" ? "user" : msg.role,
        //     timestamp: new Date(msg.createdAt),
        //     })
        //   );
        
        console.log(history);
        setMessages(history);
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
    
  getMessageHistory();

  },[]);

  const handleSendMessage = async() =>{
    if(!sessionId || !input){
      setError("session or question not found");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const chatResponse: IChatResponse = await askQuestion(sessionId, input);

      //we get response 
      //but only question, answer

      //lets fetch chat history again
      const history = await getChatHistory(sessionId);
      setMessages(history);
      
      console.log("after asking question response and history")
      console.log(chatResponse);
      console.log(chatResponse);

      // const timestamp = Date.now();

      // setMessages( (prev) =>[
      //   ...prev , 
      //     {
      //       id: `message-${timestamp}`,
      //       text: chatResponse.question,
      //       role: "user",
      //       timestamp: new Date(timestamp),
      //     },
      //     {
      //       id: `message-${timestamp + 1 }`,
      //       text: chatResponse.answer,
      //       role: "assistant",
      //       timestamp: new Date(timestamp), 
      //     },
      //   ] 
      // );

    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) =>{
    if(e.key === "Enter"){
      handleSendMessage();
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  //for diplaying messages based on
  const getMessageStyle = (role: MessageRole) => {
    if (role === 'user') {
      return 'bg-blue-500 text-white self-end rounded-br-none'; 
    } else if (role === 'assistant') {
      return 'bg-gray-200 text-gray-800 self-start rounded-tl-none'; 
    } else { // 'system' role
      return 'bg-yellow-100 text-yellow-800 self-center rounded-lg italic text-sm max-w-lg';
    }
  };


return (
  <>
    <div>
      <div>
        <h2>Chat</h2>
        {sessionId && <p>Session: {sessionId}</p>}
        
        {error && (
          <div>
            <p>Error: {error}</p>
          </div>
        )}
        
        {isLoading && <p>Loading...</p>}
        
        {/* <button onClick={getMessageHistory} >
          Load Chat History
        </button> */}
      </div>
      
      <div>
        {messages.length === 0 ? (
          <p>No messages yet. Start a conversation!</p>
        ) : (
          messages.map((message) => (
            <div key={message.messageId}>
              <strong>{message.role}:</strong>
              <p>{message.message}</p>
              <small>{message.createdAt}</small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div>
        <input
          ref={messageInputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />

        <button onClick={handleSendMessage} >
          Send
        </button>
      </div>
    </div>
  </>
);
};


export default ChatWindow;




// const sampleMessages: IDisplayMessage[] = [
//   {
//     id: "msg-1",
//     text: "Hello! Can you summarize the key points from the last quarter's sales report for me?",
//     role: "user",
//     timestamp: new Date("2025-11-18T10:00:00Z"), // User's first message
//   },
//   {
//     id: "msg-2",
//     text: "I am currently processing the request. One moment.",
//     role: "system", // A system message indicating processing or a minor state change
//     timestamp: new Date("2025-11-18T10:00:02Z"), 
//   },
//   {
//     id: "msg-3",
//     text: "Certainly! The key points from the Q3 sales report are: 1. Revenue increased by 15% year-over-year. 2. Product Z was the top seller, accounting for 40% of all units sold. 3. New market penetration in the Asia region exceeded projections by 5%.",
//     role: "model", // The AI model's response
//     timestamp: new Date("2025-11-18T10:00:35Z"),
//   },
//   {
//     id: "msg-4",
//     text: "That's helpful, thank you. What was the exact dollar amount of the Q3 revenue?",
//     role: "user",
//     timestamp: new Date("2025-11-18T10:01:45Z"),
//   },
//   {
//     id: "msg-5",
//     text: "The exact Q3 revenue was $4.5 million USD.",
//     role: "model",
//     timestamp: new Date("2025-11-18T10:01:59Z"),
//   },
// ];