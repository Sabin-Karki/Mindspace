import { create } from "zustand";
import type { IUploadResponse } from "../types";
import { createJSONStorage, persist } from "zustand/middleware";

//this is for specific chat session 
//it has sessionId chattitle 
//multiple sources 
interface SessionState {
  sessionId : number | null ;
  chatTitle : string | null;
  sources : IUploadResponse[]; //sources list
  
  setSessionId: (sessionId: number) => void;
  clearSessionId: () => void;
  changeChatTitle: (title: string) => void;

  setSources :(sources: IUploadResponse[]) => void;//set sources list

  addSource: (source: IUploadResponse) => void; //add source to list of sources
  removeSource: (sourceId: number) => void;
  clearSources: () => void;

  selectedSourceIds: number[];
  setSelectedSourceIds: (sourceIds: number[]) => void;
  addSelectedSourceId: (sourceId: number) => void;
  removeSelectedSourceId: (sourceId: number) => void;
  clearSelectedSourceIds: () => void;
}

//that particular chat session id upload sources info
export const useSessionStore = create<SessionState>()(
  persist(
    (set) =>({
      sessionId: null, 
      chatTitle: null,
      sources: [],
      selectedSourceIds: [],
      
      setSessionId: (newSessionId: number) => set({ sessionId: newSessionId }),
      setSources: (sources: IUploadResponse[]) => set({ sources }),
      setSelectedSourceIds: (sourceIds: number[]) => set({ selectedSourceIds: sourceIds }),
      changeChatTitle: (title: string) => set({ chatTitle: title }),


      addSource : (source: IUploadResponse) => set ( 
        (state) => {
          const alreadyExists = state.sources.some( (s) => source.sourceId === s.sourceId);
          if(alreadyExists) return state; //do nothing
          return {sources: [...state.sources, source]}; //add new source
        }
      ),
      addSelectedSourceId: (sourceId: number) => set(
        (state) => {
          const alreadyExists = state.selectedSourceIds.includes(sourceId);
          if(alreadyExists) return state;
          return {selectedSourceIds: [...state.selectedSourceIds, sourceId]}; //add new source id to ids
        }
      ),
      removeSource: (sourceId: number) => set(
        (state) => (
          {
            sources: state.sources.filter((source) => source.sourceId !== sourceId),//remove source obj
            selectedSourceIds: state.selectedSourceIds.filter((id) => id !== sourceId),//remove source id from selectedSourceIds
          }
        )
      ),

      removeSelectedSourceId: (sourceId: number) => set(
        (state) => ({ selectedSourceIds: state.selectedSourceIds.filter((id) => id !== sourceId) })
      ),

      clearSessionId: () => set({ sessionId: null }),
      clearSources: () => set({ sources: [] }),
      clearSelectedSourceIds: () => set({ selectedSourceIds: [] }),
    }),
  {
    name: "session-storage",// A unique name for key in localStorage
    storage: createJSONStorage( () => localStorage),  //tell zustland to use local storage
    partialize: (state) => ({
      sessionId: state.sessionId,
      chatTitle: state.chatTitle,
      // sources: state.sources,  //not making sources persistent
    }),
  })
)






//example for session id only
// import { create } from "zustand";

// interface SessionState {
//   currentSessionId : number | null;
//   setCurrentSessionId: (sessionId: number) => void;
//   clearSessionId: () => void;
// }

// export const useSessionStore = create<SessionState>((set) =>({

//   currentSessionId: null,
//   setCurrentSessionId: (sessionId: number) => set({ currentSessionId: sessionId }),
//   clearSessionId: () => set({ currentSessionId: null }),
// }))