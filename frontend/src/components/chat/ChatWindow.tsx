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
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  
  // const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  
  // // scroll animation
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });//scroll to bottom
  //   if (messageInputRef.current) {
  //     messageInputRef.current.focus();  //focus on input
  //   }
  // }, []);


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

        const history: IChatMessage[] = await getChatHistory(sessionId);        
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


  // //for diplaying messages based on
  // const getMessageStyle = (role: MessageRole) => {
  //   if (role === 'user') {
  //     return 'bg-blue-500 text-white self-end rounded-br-none'; 
  //   } else if (role === 'assistant') {
  //     return 'bg-gray-200 text-gray-800 self-start rounded-tl-none'; 
  //   } else { // 'system' role
  //     return 'bg-yellow-100 text-yellow-800 self-center rounded-lg italic text-sm max-w-lg';
  //   }
  // };


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
      </div>
      
      {/* message box */}
      <div>
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
      <div>
        <ChatInput 
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  </>
)
};


export default ChatWindow;




// const sampleMessages: IChatMessage[] = [
//   {
//     messageId: 1,
//     message:
//       "Hello! I need your help reviewing our full-year product performance report. We launched several new features this year, including the Smart Recommendations Engine and the Collaborative Workspace Module. I want a clear summary of how these features performed across different user segments, especially focusing on retention and overall engagement patterns. Can you go through the data and provide a high-level analysis for me?",
//     role: "user",
//     createdAt: "2025-12-01",
//   },
//   {
//     messageId: 2,
//     message:
//       "Certainly! Based on the full-year report, the Smart Recommendations Engine significantly improved user satisfaction and overall content discovery. Users who interacted with recommendations spent an average of 37% more time on the platform, and retention improved particularly within the 18–30 age group. Meanwhile, the Collaborative Workspace Module performed strongly among professional and enterprise users, with adoption increasing steadily throughout the year. Overall, both features contributed to higher engagement, extended session durations, and a noticeable improvement in repeat usage.",
//     role: "assistant",
//     createdAt: "2025-12-01",
//   },
//   {
//     messageId: 3,
//     message:
//       "That sounds positive. Could you elaborate more on the Collaborative Workspace Module? Specifically, I'm interested in how often teams used the shared boards, how many tasks were created on average, and whether the real-time sync feature had any measurable effect on user activity during peak hours.",
//     role: "user",
//     createdAt: "2025-12-02",
//   },
//   {
//     messageId: 4,
//     message:
//       "Absolutely. The Collaborative Workspace Module became one of the most frequently used features among teams with more than five members. On average, each team created around 142 shared tasks per month, with activity peaks during midweek, especially Tuesdays and Wednesdays. The real-time sync feature significantly enhanced the user experience by reducing update delays, resulting in smoother collaboration. During peak hours—mostly between 10 AM and 1 PM—overall interaction increased by almost 24% compared to the previous collaboration system. This improvement also reduced user complaints about data mismatches or slow updates.",
//     role: "assistant",
//     createdAt: "2025-12-02",
//   },
//   {
//     messageId: 5,
//     message:
//       "Good to know. Now I want you to give me a comparative overview between the first and second half of the year. Did engagement continue to rise consistently, or were there dips during certain months? Also, were there any major trends related to user churn or acquisition that I should be aware of before preparing my presentation for the board?",
//     role: "user",
//     createdAt: "2025-12-03",
//   },
//   {
//     messageId: 6,
//     message:
//       "Here is the comparative analysis: During the first half of the year, engagement saw a steady rise fueled by the rollout of the upgraded mobile app and the early release of the Recommendations Engine. User acquisition grew fast in Q2, mostly due to aggressive marketing campaigns and seasonal demand. The second half of the year showed more stability but with occasional dips in September and November as competition in the productivity space intensified. However, churn remained lower than expected, primarily because returning users found increased value in the new collaboration tools. Growth was not as steep as in the first half, but retention performance compensated for the slower acquisition rate.",
//     role: "assistant",
//     createdAt: "2025-12-03",
//   },
//   {
//     messageId: 7,
//     message:
//       "That's helpful. Now I also want the exact revenue generated from premium subscriptions this year along with a breakdown of which features influenced conversions the most. Provide a full narrative explanation, not just numbers, because I need to use this in a detailed slide for the revenue growth section.",
//     role: "user",
//     createdAt: "2025-12-03",
//   },
//   {
//     messageId: 8,
//     message:
//       "Premium subscriptions generated **$12.8 million USD** this year, marking a 17% increase compared to the previous year. A large portion of this growth was driven by the introduction of the Smart Recommendations Engine, which encouraged more free users to upgrade after realizing the value of personalized suggestions. The Collaborative Workspace Module also played a major role; once teams experienced smoother real-time synchronization and task sharing, many upgraded to access higher storage limits and cross-team collaboration features. In addition, seasonal discounts in Q2 and Q4 boosted conversion rates by attracting new users who remained subscribed even after the promotional period ended.",
//     role: "assistant",
//     createdAt: "2025-12-03",
//   },
//   {
//     messageId: 9,
//     message:
//       "Nice. One more thing — can you prepare a short but detailed paragraph summarizing the biggest risks we face going into next year? Focus mainly on potential user churn, market competition, and any technical limitations that might slow down product growth.",
//     role: "user",
//     createdAt: "2025-12-04",
//   },
//   {
//     messageId: 10,
//     message:
//       "**With `react-markdown`, your app can automatically handle:**",
//     role: "assistant",
//     createdAt: "2025-12-04",
//   }
// ];
