import type { IChatMessage } from "../../types";
import ReactMarkdown from "react-markdown";

interface ChatMessageBubbleProps {
  message: IChatMessage;
}

const ChatMessageBubble = ( { message }: ChatMessageBubbleProps) => {
  return (
    <> 
    <div>
      <div>
        {message.role}
      </div>
      <div>
        <ReactMarkdown>
          {message.message}
        </ReactMarkdown>
      </div>
      {/* <div>{message.createdAt}</div> */}
    </div>
    </>
  )
};

export default ChatMessageBubble;

