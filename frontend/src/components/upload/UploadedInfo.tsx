import { useEffect, useState } from "react";
import { useSessionStore } from "../../store/sessionStore";
import { getSourcesBySessionId } from "../../api/contentApi";


const UploadedInfo = () => {

  const sessionId = useSessionStore((state) => state.sessionId);
  const sources = useSessionStore((state) => state.sources);
  const setSources = useSessionStore((state) => state.setSources);
  
  const selectedSourceIds = useSessionStore((state) => state.selectedSourceIds);
  const setSelectedSourceIds = useSessionStore((state) => state.setSelectedSourceIds);
  const addSelectedSourceId = useSessionStore((state) => state.addSelectedSourceId);
  const removeSelectedSourceId = useSessionStore((state) => state.removeSelectedSourceId);
  const clearSelectedSourceIds = useSessionStore((state) => state.clearSelectedSourceIds);


  const [expandedSourceId, setExpandedSourceId] = useState<number| null>(null);

  //fetch all sources of specific sessionId
  useEffect( () =>{
    const fetchSources = async(sessionId: number) =>{   
      try {
        const response = await getSourcesBySessionId(sessionId);

        setSources(response); //set sources in session store
    } catch (error) {
      console.log(error);
    }
  }
  if(!sessionId) {
    return;
  }
  fetchSources(sessionId)
  },[]);

  //calculate if all selected is checked or not
  const isSelectAllChecked = sources.length > 0 && selectedSourceIds.length === sources.length;

  //handle selectall checkbox
  const handleSelectAll = () =>{
    //if all selected then remove all
    //else add all
    if(isSelectAllChecked) {
      clearSelectedSourceIds();
    }else{
      setSelectedSourceIds(sources.map(source => source.sourceId));
    }
  };

  //handle select specific sources using checkbox
  //add and remove sources
  const handleSelectSource = (sourceId: number) =>{  
    if(selectedSourceIds.includes(sourceId)){
      removeSelectedSourceId(sourceId);
    }else{
      addSelectedSourceId(sourceId);
    }
  } 
  
  //check whether the title is clicked or not
  //to toggle visibility for summary
  const handleTitleClick = (sourceId: number) =>{
    setExpandedSourceId(prevId => prevId === sourceId ? null : sourceId);
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white shadow-xl max-w-sm">
      {/* "Select all sources" Row */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
        <span className="text-sm font-semibold text-gray-300">
          Select all sources
        </span>
        <input
          type="checkbox"
          checked={isSelectAllChecked}  //this shows checked or not
          onChange={() => handleSelectAll()}
          className="form-checkbox h-5 w-5 text-blue-500 bg-gray-700 border-gray-600 rounded cursor-pointer"
        />
      </div>

      {/* List of individual sources */}
      {sources.length === 0 ? (
        <p className="text-gray-400 text-sm">No sources available.</p>
      ) : (
        sources.map((source) => (
          <div
            key={source.sourceId}
            className="flex justify-between items-center py-2 hover:bg-gray-700 rounded-md px-1 transition-colors"
          >
            <div className="flex items-center space-x-2">
              {/* YouTube Icon (Mocked with a simple div) */}
              <div className="flex-shrink-0 w-4 h-4 bg-red-600 rounded flex items-center justify-center text-xs">
                ▶
              </div>
              
              {/* Title - Clickable to toggle summary */}
              <span
                onClick={() => handleTitleClick(source.sourceId)}
                className="cursor-pointer text-sm font-medium truncate max-w-[200px]"
                title={source.title} // Use title attribute for full name on hover
              >
                {source.title}
              </span>
            </div>
            
            {/* Checkbox */}
            <input
              type="checkbox"
              onChange={() => handleSelectSource(source.sourceId)}
              checked={selectedSourceIds.includes(source.sourceId)}//checked or not
              className="form-checkbox h-5 w-5 text-blue-500 bg-gray-700 border-gray-600 rounded cursor-pointer"
            />

            {/* Expanded Summary - positioned outside the main flex container for proper flow */}
            {expandedSourceId === source.sourceId && (
              <p className="text-xs text-gray-400 mt-1 p-2 bg-gray-700/50 rounded-md w-full">
                {source.summary}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UploadedInfo;


//data eg

// const sources: IUploadResponse[] = [
//   {
//     sourceId: 501,
//     chunksSize: 125, // This could represent the number of chunks/segments the file was broken into
//     summary: "A brief summary of the 'Annual Budget 2025' document, highlighting key allocations and growth projections for Q1.",
//     title: "Annual Budget 2025.pdf",
//   },
//   {
//     sourceId: 502,
//     chunksSize: 82,
//     summary: "The main points from the customer feedback survey for Q4, focusing on satisfaction scores for the mobile application.",
//     title: "Q4 Customer Survey Results.docx",
//   },
//   {
//     sourceId: 503,
//     chunksSize: 450,
//     summary: "Full transcript and summary of the 'Future of AI in Web Development' webinar held on November 10th.",
//     title: "Webinar Transcript - AI Future.txt",
//   }
// ];