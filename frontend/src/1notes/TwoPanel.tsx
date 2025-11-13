import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL_WIDTH = 250;
const MIN_WIDTH = 250;
const MAX_WIDTH = 500;

//handles only one draggable div and two panels
const WindowDrag = () =>{

  const [width, setWidth] = useState(INITIAL_WIDTH);

  //storing isDragging using useRef
  //to persists state even if the component re-renders
  //or isDragging is value is changed it doesn't re-render
  const isDragging = useRef(false); 


  //start drag
  //this is horizontal small div that acts as a drag handle
  //when click we set dragging to true
  const handleMouseDown = useCallback(() =>{
    isDragging.current = true;

    document.body.style.userSelect = 'none';    //this prevents user to select text while dragging
    document.body.style.cursor = 'col-resize';  //this shows resiszing cursor while dragging
    
    //mouse move for dragging
    //mouse up for stopping dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  },[])


  //dragging
  //handle the dragging of the div
  const handleMouseMove = useCallback((e: MouseEvent) =>{
    if(!isDragging.current){
      return;
    }
    //provides the horizontal coordinate within the application's viewport 
    const newWidth = e.clientX;

    //new width needs to be less than max width 
    //and greater than min width
    const maxLimitWidth = Math.min(newWidth, MAX_WIDTH);
    const minLimitWidth = Math.max(maxLimitWidth, MIN_WIDTH);

    setWidth(minLimitWidth);
  },[])


  //stop dragging
  //handling the end of the dragging
  const handleMouseUp = useCallback( () =>{
    if(!isDragging.current){
      return;
    }
    isDragging.current = false;

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


  return  (
    <>
    <div className="flex h-screen">
      <div
        className="bg-gray-100 border border-gray-300 p-4"
        style={{ width: `${width}px` }}>
         content here
      </div>

      {/* the div to be dragged */}
      <div 
        onMouseDown={handleMouseDown}
        title="Drag to resize" 
        className="w-2 cursor-col-resize bg-gray-400 h-full hover:bg-gray-500"
      >
      </div>
    </div>
    </>
  )
}

export default WindowDrag;



//note:

//The useRef hook is used to create a mutable reference to a DOM element
//  or a value that persists across re-renders.
//useRef doesn't trigger a re-render when its value changes
//to access useRef value, use useRef.current