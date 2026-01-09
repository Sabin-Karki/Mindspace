import { useEffect, useState } from "react";
import { useSessionStore } from "../../store/sessionStore";
import { getSourcesBySessionId } from "../../api/contentApi";


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
    <div className="bg-white p-4 rounded-lg text-gray-700 text-m">
      {/* "Select all sources" Row */}
      <div className="flex justify-between items-start mb-4 p-1 border-b border-gray-700">
        <span className="font-semibold ">
          Select all
        </span>
        <input
          type="checkbox"
          checked={isSelectAllChecked}  //this shows checked or not
          onChange={() => handleSelectAll()}
          className="form-checkbox h-5 w-5 rounded cursor-pointer accent-gray-200 hover:accent-gray-200"
        />
      </div>

      {/* List of individual sources */}
      {sources.length === 0 ? (
        <p className="">No sources available.</p>
      ) : (
        sources.map((source) => (
          
          // vertical
          <div
            key={source.sourceId}
            className=" flex flex-col py-2 hover:bg-white-700 rounded-md px-1 "
            onClick={() => handleTitleClick(source.sourceId)}
          >

            {/* //horizontal */}
            <div className="flex items-center justify-between gap-2">
              {/* clickable title */}
              {/*in parent min-w-0 so it allow shrinking (turncate) */}
              <div
                className="flex items-center cursor-pointer  font-medium min-w-0 flex-1"
                title={source.title} 
                >
                  <span className={expandedSourceId === source.sourceId ? "rotate-90 transition-transform" : "transition-transform"}>
                    ▶
                  </span>
                  <span className="truncate ml-1"> {source.title} </span>
              </div>
              
              {/* Checkbox */}
              <div className="  ">
                <input
                  onClick={(e) => e.stopPropagation()}
                  type="checkbox"
                  onChange={() => handleSelectSource(source.sourceId)}
                  checked={selectedSourceIds.includes(source.sourceId)}//checked or not
                  className="form-checkbox h-5 w-5 rounded cursor-pointer accent-gray-200 hover:accent-gray-200 "
                />
              </div>

            </div>

            <div className="flex-center">
              {/* Expanded Summary - positioned outside the main flex container for proper flow */}
              {expandedSourceId === source.sourceId && (
                <p className="text-sm  mt-1 p-2 bg-gray-100 rounded-md w-full">
                  {source.summary}
                </p>
              )}
            </div>

          </div>
        ))
      )}
    </div>
    </>
  );
};

export default UploadedInfo;