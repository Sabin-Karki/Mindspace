import { useCallback, useEffect, useRef, useState } from "react";
import UploadPanel from "../components/upload/UploadPanel";
import ChatWindow from "../components/chat/ChatWindow";

const InitialWidth = {
  dragpos1: 20,
  dragpos2: 80
};

const MIN_WIDTH = 20;
const MAX_CONTAINER_WIDTH = 100;

//dragging div position
type DragPosition = 'dragpos1' | 'dragpos2' | null;


const ThreeWindowPanel = () =>{

  const [dividerPos, setDividerPos] = useState(InitialWidth);
  const isDragging = useRef<DragPosition>(null); 
  const containerRef = useRef<HTMLDivElement>(null);

  //start drag
  //this is horizontal small div that acts as a drag handle
  //when click we set dragging to true
  const handleMouseDown = useCallback((key: DragPosition) =>{
    if(!key ){
      return;
    }
    isDragging.current = key;

    document.body.style.userSelect = 'none';    
    document.body.style.cursor = 'col-resize';
    
    //mouse move for dragging
    //mouse up for stopping dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  },[])


  //dragging
  const handleMouseMove = useCallback(( e: MouseEvent) =>{
    if(!isDragging.current || !containerRef.current){
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeXPos = e.clientX - containerRect.left;
    const newPos = (relativeXPos / containerRect.width) * 100;
    
    const key = isDragging.current;
    setDividerPos( prev =>{

      if(key === "dragpos1"){
        const min = MIN_WIDTH;   
        const max = prev.dragpos2 - MIN_WIDTH;
      
        //find max from minimum and
        //minimum from max
        const newWidth = Math.min(max, Math.max(min, newPos));
        return {...prev, dragpos1: newWidth};

      }else if(key ==="dragpos2"){

        const min = prev.dragpos1 + MIN_WIDTH;   
        const max = MAX_CONTAINER_WIDTH - MIN_WIDTH;

        const newWidth = Math.min(max, Math.max(min, newPos));
        return {...prev, dragpos2: newWidth};
      }
      return prev;//if key is null  then no change
    });

  },[])


  //stop dragging
  //handling the end of the dragging
  const handleMouseUp = useCallback( () =>{
    if(!isDragging.current){
      return;
    }
    isDragging.current = null;//we have stop dragging

    document.body.style.userSelect = ''; 
    document.body.style.cursor = '';

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  },[handleMouseMove])


  //for removing event listeners on unmount
  useEffect(() =>{
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  },[ handleMouseMove, handleMouseUp]);


  //calculate the width of each panel
  const panel1 = dividerPos.dragpos1;
  const panel2 = dividerPos.dragpos2 - dividerPos.dragpos1;
  const panel3 = MAX_CONTAINER_WIDTH - dividerPos.dragpos2;

  return  (
    <>
    <div className="flex h-screen w-full bg-amber-900"
      ref={containerRef}>
      <div
        className="bg-gray-100 border border-gray-300 p-4 overflow-auto"
        style={{ width: `${panel1}%` }}>
          <UploadPanel />
      </div>
      {/* the div to be dragged */}
      <div 
        onMouseDown={() => handleMouseDown("dragpos1")}
        title="Drag to resize" 
        className="w-2 cursor-col-resize bg-gray-400 h-full hover:bg-gray-500">
      </div>


      {/* another content panel */}
      <div
        className="bg-gray-100 border border-gray-300 p-4 overflow-auto "
        style={{ width: `${panel2}%` }}>
          <ChatWindow />
      </div>
      
      {/* the div to be dragged */}
      <div 
        onMouseDown={() => handleMouseDown("dragpos2")}
        title="Drag to resize" 
        className="w-2 cursor-col-resize bg-gray-400 h-full hover:bg-gray-500"
      >
      </div>

      { /* another content panel */}
      <div
        className="bg-gray-100 border border-gray-300 p-4 overflow-auto"
        style={{ width: `${panel3}%` }}>
        content here
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda, illum. Pariatur assumenda atque tenetur distinctio eligendi voluptatibus autem illum quae. Maxime ullam iste beatae voluptatum autem minus tenetur delectus id.
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda, illum. Pariatur assumenda atque tenetur distinctio eligendi voluptatibus autem illum quae. Maxime ullam iste beatae voluptatum autem minus tenetur delectus id.
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda, illum. Pariatur assumenda atque tenetur distinctio eligendi voluptatibus autem illum quae. Maxime ullam iste beatae voluptatum autem minus tenetur delectus id.
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda, illum. Pariatur assumenda atque tenetur distinctio eligendi voluptatibus autem illum quae. Maxime ullam iste beatae voluptatum autem minus tenetur delectus id. 
      </div>
    </div>
    </>
  )
}

export default ThreeWindowPanel;