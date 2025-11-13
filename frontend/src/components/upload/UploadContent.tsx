import { useCallback, useEffect, useRef, useState } from "react";
import { useSessionStore } from "../../store/sessionStore";
import { uploadContent } from "../../api/contentApi";

const UploadContent = ( {onClose} : {onClose: () => void} ): any => {

  const sessionId = useSessionStore((state) => state.sessionId);
  const { addSource } = useSessionStore();

  const[file, setFile] = useState<File | null>(null);
  const [textValue, setTextValue] = useState('');
  
  const dragCounterRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleFileOrTextUpload = async() =>{
    try {
      if (!sessionId) {
        setError("Session ID is missing. Please log in.");
        return;
      }

      const hasFile = !!file;
      const hasText = !!textValue.trim();
      if (!hasFile && !hasText) {
        setError("Please select a file or enter some text content.");
        return;
      }
      if (hasFile && hasText) {
        setError("Please upload either a file OR enter text content, not both.");
        return;
      }
      setIsLoading(true);
      setError(null);
      
      const response = await uploadContent(sessionId, file, textValue );
      setFile(null);
      setTextValue('');

      //handle response 
      console.log(response);
      addSource(response);

    } catch (error: any) {
      const serverMessage = error?.response?.data?.message; 
      const axiosMessage = error?.message; 
      const message = serverMessage || axiosMessage || "Failed to create chat session. Please try again.";
      setError(message);
    } finally{
      setIsLoading(false);
    }
  }

  if(error) return <div>{error}</div>;


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


  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  const isUploadDisabled = !file && !textValue.trim();

  return (
  <>
  <div onClick={onClose} className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
  <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-4 w-full max-w-md text-white" >

    <div>Upload Content</div>
    <div>session:{sessionId}</div>
    {/* text as source */}
    <div>
      <label htmlFor="textSource">Enter text as source</label>
      <textarea name="textSource" id="textSource" rows={5} onChange={handleTextChange} value={textValue} disabled={!!file}
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
          disabled={!!textValue.trim()} //disabled file input if textValue is empty
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

    {/* Upload Button */}
    <div className="mt-6">
      <button
        onClick={handleFileOrTextUpload}
        disabled={isUploadDisabled}
        className={`w-full py-3 rounded-md font-semibold transition duration-150 ${
          isUploadDisabled
            ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>
      {!sessionId && <p className="text-sm text-red-500 mt-2">Session is not active. Upload is disabled.</p>}
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

export default UploadContent;