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

  const handleKeyDown = (e: React.KeyboardEvent) =>{
    if(e.key === "Enter"){
      handleSendClick();
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInput(e.target.value);
  };

  const handleSendClick = () =>{
    if(localInput.trim().length === 0 ) return;
    handleSendMessage(localInput);
    setLocalInput('');
  }

  return (
    <>
     <input

          autoFocus
          type="text"
          value={localInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="fixed bottom-2 bg-amber-600"
        />

        <button onClick={() =>handleSendClick() } >
          Send
        </button>
    </>
  );
};

export default ChatInput;