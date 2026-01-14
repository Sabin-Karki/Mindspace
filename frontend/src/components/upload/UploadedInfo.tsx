import { useEffect, useState } from "react";
import { useSessionStore } from "../../store/sessionStore";
import { getSourcesBySessionId } from "../../api/contentApi";
import UploadSourceDetail from "./UploadSourceDetail";


const UploadedInfo = ({openLeftSideBar} :{ openLeftSideBar: ()=> void; }) => {

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
  // clicking to see summary will open left panel too
  const handleTitleClick = (sourceId: number) =>{
    openLeftSideBar();
    setExpandedSourceId( prevId => prevId === sourceId ? null : sourceId  );
  }

  return (
    <>
    <div className="bg-bg-sec text-text-pri p-2 rounded-lg text-m">
      {/* "Select all sources" Row */}
      <div className="flex justify-between items-start mb-4 p-1 border-b border-border-pri">
        <span className="font-semibold ">
          Select all
        </span>
        <input
          type="checkbox"
          checked={isSelectAllChecked}  //this shows checked or not
          onChange={() => handleSelectAll()}
          className="form-checkbox h-5 w-5 rounded cursor-pointer accent-green-300 hover:accent-green-300"
        />
      </div>

      {/* List of individual sources */}
      {sources.length === 0 ? (
        <p className="">No sources available.</p>
      ) : (
        sources.map((source) => (
          
          <UploadSourceDetail
            source ={source}
            handleTitleClick={handleTitleClick}
            expandedSourceId= {expandedSourceId}
            selectedSourceIds= {selectedSourceIds}
            handleSelectSource= {handleSelectSource}
          />
        ))
      )}
    </div>
    </>
  );
};

export default UploadedInfo;