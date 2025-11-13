import { useCallback, useEffect, useRef, useState } from "react";

const UploadContents = ( {onClose} : {onClose: () => void} ): any => {

  const [isDragging, setIsDragging] = useState(false);
  const[file, setFile] = useState<File | null>(null);


  const dragCounterRef = useRef(0);
  
  //these events are fired by the browser
  //
  //dragenter when entering over dragging area
  //dragLeave when leaving dragging area
  //dragOver  when hovering over dragging area
  //drop  when dropping file

  //these events changes so fast and the state changes too fast so we need to use useRef
  //without using useRef there is like flickering 

  //solution
  //useRef persists state even if the component re-renders

  //there are default behaviors of the browser
  //when dragging and dropping we need to prevent the default behavior
  // e.preventDefault();
  // e.stopPropagation();


  // ## How the dragCounterRef will work
  // Drag sequence:
  // 1. Enter window     → counter: 0 → 1 ✅ Show overlay
  // 2. Enter modal      → counter: 1 → 2 (overlay stays)
  // 3. Enter textarea   → counter: 2 → 3 (overlay stays)
  // 4. Leave textarea   → counter: 3 → 2 (overlay stays)
  // 5. Leave modal      → counter: 2 → 1 (overlay stays)
  // 6. Leave window     → counter: 1 → 0 ❌ Hide overlay

  //hovering over dragging area
  const handleDragOver = useCallback((e: DragEvent) =>{
    e.stopPropagation();
    e.preventDefault();
  },[]);


  //entering dragging area
  const handleDragEnter = useCallback((e: DragEvent) =>{  
    e.stopPropagation();
    e.preventDefault();

    dragCounterRef.current++;
    if(dragCounterRef.current === 1 ){
      setIsDragging(true);
      console.log('handleDragEnter');
    }
  },[]);


  //leaving dragging area
  const handleDragLeave = useCallback((e: DragEvent) =>{  
    e.stopPropagation();
    e.preventDefault();

    dragCounterRef.current--;
    if(dragCounterRef.current === 0 ){
      setIsDragging(false);
    }
    console.log('handleDragLeave');
  },[]);


  //dropping file 
  const handleDrop = useCallback((e: DragEvent) =>{ 
    e.stopPropagation();
    e.preventDefault();
    
    dragCounterRef.current = 0;
    console.log('handleDrop');

    const droppedFile = e.dataTransfer?.files[0];
    if(droppedFile){
      setFile(droppedFile);
      setIsDragging(false);
    }else{
      setFile(null);
    }

  },[]);

  useEffect(() => {
    
    // Attach event listeners
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      // Remove event listeners
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    }
  },[]);


  return (
  <>
  <div onClick={onClose} className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
  <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-4 w-full max-w-md text-white" >
  <div className="flex justify-between items-center mb-6">

    <div>Upload Content</div>
    {/* text as source */}
    <div>
      <label htmlFor="textSource">Enter text as source</label>
      <textarea name="textSource" id="textSource" rows={5}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
      </textarea>
    </div>

    {/* File upload */}
    <div>
      <p className="block text-sm font-medium mb-2" >
        Upload file
      </p>
      <div className="border-amber-400 border-dashed border-2 rounded-md p-8 text-center">   
        <input
          type="file"
          name="fileSource"
          id="fileSource"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        {/* when clicked on label the input will be triggered then we can add files  */}
        <label htmlFor="fileSource">
          <div className="text-gray-400 cursor-pointer">
            {file ? (
              <p className="text-green-400">Selected: {file.name}</p>
            ) : (
              <>
                <p>Click to upload or drag and drop</p>
                <p className="text-sm mt-1">Files accepted</p>
              </>
            )}
          </div> 
        </label>
      </div>
    </div>
  </div>
  </div>
  </div>

  {/* if user is dragging file show Full-screen drag overlay */}
    {isDragging && (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] pointer-events-none">
      <div className="text-white text-3xl border-4 border-dashed border-white rounded-lg p-16 bg-black/40">
        <p className="font-bold" >Drop files here</p>
      </div>
    </div>
    )}

  </>
  );
};

export default UploadContents;