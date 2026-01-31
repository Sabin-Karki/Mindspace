import { useCallback, useEffect, useRef, useState } from "react";
import { useSessionStore } from "../../store/sessionStore";
import { uploadContent } from "../../api/contentApi";
import { fetchAllChatSessions } from "../../api/chatApi";
import { toast } from "sonner";


const UploadContent = ({ onClose }: { onClose: () => void }): any => {

  const sessionId = useSessionStore((state) => state.sessionId);
  const addSource = useSessionStore((state) => state.addSource);
  const sources = useSessionStore((state) => state.sources);
  const changeChatTitle = useSessionStore((state) => state.changeChatTitle);
  const [file, setFile] = useState<File | null>(null);
  const [textValue, setTextValue] = useState('');

  const dragCounterRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const isValidFileType = useCallback((file: File) => {

    if (!file.type) {
      return false;
    }
    const allowedFileTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    return allowedFileTypes.includes(file.type);
  }, []);


  const handleFileOrTextUpload = async () => {
    try {
      setError(null);
      setIsLoading(true);

      if (!sessionId) {
        setError("Session ID is missing. Please log in.");
        return;
      }

      const hasFile = !!file;
      const hasText = !!textValue.trim();
      if (!hasFile && !hasText) {
        console.log("no file or text");
        setError("Please select a file or enter some text content.");
        return;
      }
      if (hasFile && hasText) {
        console.log("file and text");
        setError("Please upload either a file OR enter text content, not both.");
        return;
      }

      //file validation
      if (hasFile) {
        // console.log("has file" + file);
        // console.log(file.type);
        if (!isValidFileType(file)) {
          setError("Invalid file type. Please upload a pdf or txt or doc file.");
          toast.error("Invalid file type. Please upload a pdf or txt or doc file.");
          return;
        }
      }

      // Check if this is the first source being uploaded
      const isFirstSource = sources.length === 0;

      // console.log(sessionId)
      const response = await uploadContent(sessionId, file, textValue);

      setFile(null);
      setTextValue('');

      console.log(response);
      addSource(response);  //add source to list

      // If this is the first source, fetch and update the chat title
      if (isFirstSource) {
        try {
          const allSessions = await fetchAllChatSessions();
          const currentSession = allSessions.find(session => session.sessionId === sessionId);
          if (currentSession && currentSession.title) {
            changeChatTitle(currentSession.title);
            console.log("Chat title updated to:", currentSession.title);
          }
        } catch (titleError) {
          console.error("Failed to fetch updated chat title:", titleError);
          // Don't show error to user as the upload was successful
        }
      }

    } catch (error: any) {
      console.log(error);
      const serverMessage = error?.response?.data?.message;
      const axiosMessage = error?.message;
      const message = serverMessage || axiosMessage || "Failed to create chat session. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }


  // if(error && error.length > 0){
  //   return(
  //     {error}
  //   )
  // }

  //handling file draggin events

  //hovering over dragging area
  const handleDragOver = useCallback((e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  //entering dragging area
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();

    dragCounterRef.current++;
    if (dragCounterRef.current === 1) {
      setIsDragging(true);
      console.log('handleDragEnter');
    }
  }, []);

  //leaving dragging area
  const handleDragLeave = useCallback((e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();

    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
    console.log('handleDragLeave');
  }, []);

  //dropping file 
  const handleDrop = useCallback((e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();

    dragCounterRef.current = 0;
    console.log('handleDrop');

    const droppedFile = e.dataTransfer?.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setIsDragging(false);
    } else {
      setFile(null);
    }

  }, []);

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
  }, []);



  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  const isUploadDisabled = !file && !textValue.trim();

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
        <div onClick={(e) => e.stopPropagation()} className="bg-bg-pri rounded-lg p-4 w-full max-w-md text-text-pri text-m" >

          {error && (
            <div style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '15px' }}>
              {error}
            </div>
          )}
          <div>Upload Content</div>

          {/* text as source */}
          <div>
            <label htmlFor="textSource" className="block mb-2">
              Enter text as source
            </label>
            <textarea name="textSource" id="textSource"
              rows={5}
              onChange={handleTextChange}
              value={textValue}
              disabled={!!file}
              placeholder="Enter text as a source "
              className="block w-full p-1 rounded-md border-2 border-gray-500 shadow-sm
        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
            </textarea>
          </div>

          {/* File upload */}
          <div className="flex items-center text-sm font-medium  my-2" >
            Upload file
          </div>

          <div className="border-gray-500 border-dashed border-2 rounded-md p-10 text-center">
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
              <div className="cursor-pointer">
                {file ? (
                  <p className="text-green-500">Selected: {file.name}</p>
                ) : (
                  <>
                    <p>Click to upload or drag and drop</p>
                    <p className="text-sm mt-1">Files accepted: ( .txt .pdf .docx )</p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Upload Button */}
          <div className="mt-6">
            <button
              onClick={handleFileOrTextUpload}
              disabled={isUploadDisabled}
              className={`w-full py-3 rounded-md font-semibold transition duration-150 ${isUploadDisabled
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
            {!sessionId && <p className="text-sm text-red-500 mt-2">Session is not active. Upload is disabled.</p>}
          </div>

        </div>
      </div>

      {/* when user is dragging file show Full-screen drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] pointer-events-none">
          <div className="text-text-pri text-3xl border-4 border-dashed border-border-pri rounded-lg p-16 bg-black/40">
            <p className="font-bold" >Drop files here</p>
          </div>
        </div>
      )}

    </>
  );
};

export default UploadContent;