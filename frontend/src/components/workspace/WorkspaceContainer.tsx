import { useCallback, useEffect, useRef } from "react";
import { ChatWindow } from "../chat";
import { UploadPanel } from "../upload";
import { useLayoutStore } from "../../store/layoutStore";
import StudioPanel from "../studio/StudioPanel";


// const InitialWidth = {
//   dragpos1: 20,
//   dragpos2: 80
// };

const MIN_WIDTH = 20;
const MAX_CONTAINER_WIDTH = 100;

//dragging div position
type DragPosition = 'dragpos1' | 'dragpos2' | null;


const WorkspaceContainer = () =>{

  const isDragging = useRef<DragPosition>(null); 
  const containerRef = useRef<HTMLDivElement>(null);

  const isLeftPanelClose = useLayoutStore((state) => state.isLeftPanelClose);
  const setIsLeftPanelClose = useLayoutStore((state) => state.setIsLeftPanelClose);
  const isRightPanelClose = useLayoutStore((state) => state.isRightPanelClose);
  const setIsRightPanelClose = useLayoutStore((state) => state.setIsRightPanelClose);

  // const [dividerPos, setDividerPos] = useState(InitialWidth);
  const dividerPos = useLayoutStore((state) => state.dividerPos);
  const setDividerPos = useLayoutStore((state) => state.setDividerPos); 


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

        // console.log(newPos);
        const min = MIN_WIDTH;   
        const max = prev.dragpos2 - MIN_WIDTH;
        
        //if new pos is 0 or closer to 0 //then we close left panel
        if(newPos === 0 || newPos < 10){
          setIsLeftPanelClose(true);
          return {...prev, dragpos1: 5};
        }
        setIsLeftPanelClose(false);

        //else we find the min width of left container(panel)
        //find max from minimum and
        //minimum from max
        const newWidth = Math.min(max, Math.max(min, newPos));
        // console.log(newWidth);
        return {...prev, dragpos1: newWidth};
        
      }else if(key ==="dragpos2"){
        
        // console.log(newPos);
        const min = prev.dragpos1 + MIN_WIDTH;   
        const max = MAX_CONTAINER_WIDTH - MIN_WIDTH;

        //if new pos is 100 or closer to 100 close right panel
         if(newPos === 100 || newPos > 90){
          setIsRightPanelClose(true);
          return {...prev, dragpos2: 100};
        }
        setIsRightPanelClose(false);

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

 


  const closeLeftSideBar = useCallback(() => {
    console.log("close left sidebar");
    setIsLeftPanelClose(true);

    setDividerPos( (prev) =>{
      return {...prev, dragpos1: 5};
    });
  },[]); 

  const closeRightSideBar = useCallback(() => {
    console.log("close right sidebar");
    setIsRightPanelClose(true);

    setDividerPos( (prev) =>{
      return {...prev, dragpos2: 100};
    });
  },[]);

  const openLeftSideBar = useCallback(() => {
    console.log("open left sidebar");
    setIsLeftPanelClose(false);

    setDividerPos( (prev) =>{
      return {...prev, dragpos1: MIN_WIDTH};
    });
  },[]);

  const openRightSideBar = useCallback(() => {
    console.log("open right sidebar");
    setIsRightPanelClose(false);

    setDividerPos( (prev) =>{
      return {...prev, dragpos2: MAX_CONTAINER_WIDTH - MIN_WIDTH};
     });
  },[]);

  //calculate the width of each panel
  let panel1 = dividerPos.dragpos1;
  let panel2 = dividerPos.dragpos2 - dividerPos.dragpos1;
  let panel3 = MAX_CONTAINER_WIDTH - dividerPos.dragpos2;

  return  (
    <>
    <div className="flex h-full w-full"  
      ref={containerRef}>
      {/* first content panel */}
      <div
        className="bg-gray-100 border-gray-300 overflow-auto"
        // className="overflow-auto"
        style={{ width: `${panel1}%` }}>
          <UploadPanel 
          closeLeftSideBar={closeLeftSideBar}
          openLeftSideBar={openLeftSideBar} 
          isLeftPanelClose={isLeftPanelClose}/>

         {/* if isLeftPanelClose then show buttons */}
         {/* if isLeftPanelClose false then show UploadPanel */}
      </div>
      {/* the div to be dragged */}
      <div 
        onMouseDown={() => handleMouseDown("dragpos1")}
        title="Drag to resize" 
        className="p-0 m-0 w-2 cursor-col-resize bg-gray-400 h-full hover:bg-gray-500">
      </div>


      {/* another content panel */}
      <div
        className="bg-gray-100 border-gray-300 overflow-auto scrollbar-hide "
        style={{ width: `${panel2}%` }}>
          <ChatWindow />
      </div>
      
      {/* the div to be dragged */}
      <div 
        onMouseDown={() => handleMouseDown("dragpos2")}
        title="Drag to resize" 
        className="w-2 cursor-col-resize bg-gray-400 h-full hover:bg-gray-500">
      </div>

      { /* another content panel */}
      <div
        className="bg-gray-100 border-gray-300 overflow-auto "
        style={{ width: `${panel3}%` }}>
          <StudioPanel 
          closeRightSideBar={closeRightSideBar}
          openRightSideBar={openRightSideBar} 
          isRightPanelClose={isRightPanelClose}/>
      </div>
    </div>
    </>
  )
}

export default WorkspaceContainer;