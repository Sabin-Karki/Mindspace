import { useEffect, useRef, useState } from "react";
import type { IChatMessage, IChatResponse, IUploadResponse, MessageRole } from "../../types";
import { askQuestion, getChatHistory } from "../../api/chatApi";
import { useSessionStore } from "../../store/sessionStore";

interface IDisplayMessage {
  id: string; // Unique identifier for React key
  text: string;
  role: 'user' | 'model' | 'system';
  timestamp: Date;
}

const ChatWindow: React.FC = () => {

  const sessionId = useSessionStore((state) => state.sessionId);

  const [messages, setMessages] = useState<IDisplayMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect( () =>{
    getMessageHistory();
  },[messages]);

  //scroll animation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });//scroll to bottom
    if (messageInputRef.current) {
      messageInputRef.current.focus();  //focus on input
    }
  }, [messages]);

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
 
      const displayMessages: IDisplayMessage[] = history.map(
        (msg) =>({
          id: `message-${msg.message}`,
          text: msg.message,
          role: msg.role === "user" ? "user" : msg.role,
          timestamp: new Date(msg.createdAt),
          })
        );
      
      setMessages(displayMessages)
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }



  //for diplaying messages based on
  const getMessageStyle = (role: MessageRole) => {
    if (role === 'user') {
      return 'bg-blue-500 text-white self-end rounded-br-none'; 
    } else if (role === 'model') {
      return 'bg-gray-200 text-gray-800 self-start rounded-tl-none'; 
    } else { // 'system' role
      return 'bg-yellow-100 text-yellow-800 self-center rounded-lg italic text-sm max-w-lg';
    }
  };

// Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

return (
  <>
    <div>
      <div>
        <h2>Chat Window</h2>
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
            <div key={message.id}>
              <strong>{message.role}:</strong>
              <p>{message.text}</p>
              <small>{formatTime(message.timestamp)}</small>
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
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />

        <button onClick={() => {/* add your send handler */}}>
          Send
        </button>
      </div>
    </div>
  </>
);
};


export default ChatWindow;