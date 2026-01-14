import React, {  useState } from 'react';

interface ChatInputProps {
  handleSendMessage: (input: string) => Promise<void>;
}

const ChatInput = ({handleSendMessage }: ChatInputProps) => {

  //changing useState value on every key press
  //causes the component to re-render
  //if this localInput state was in the parent component
  //it would cause the parent component to re-render every keystroke
  //every key press will rerender the chat history component
  
  //so using this local input seperate from parent component
  //  which only rerenders its own component not parent component
  const [localInput, setLocalInput] = useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) =>{
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      handleSendClick();
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalInput(e.target.value);
  };

  const handleSendClick = () =>{
    if(localInput.trim().length === 0 ) return;
    handleSendMessage(localInput);
    setLocalInput('');
  }

  return (
    <>
    <div className="flex items-center space-x-2 p-2 border-t-2 border-border-pri ">
      <textarea
          autoFocus
          value={localInput}
          onChange={handleInputChange}
          rows={1}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className=" flex-grow-1 px-3 py-1 focus:outline-none "
        />

        <button onClick={() =>handleSendClick() }>
          Send
        </button>
    </div>
    </>
  );
};

export default ChatInput;