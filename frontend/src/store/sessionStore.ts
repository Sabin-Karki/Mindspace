import { create } from "zustand";
import type { IUploadResponse } from "../types";
import { createJSONStorage, persist } from "zustand/middleware";

//this is for specific chat session 
//it has sessionId chattitle 
//multiple sources
interface SessionState {
  sessionId : number | null;
  chatTitle : string | null;
  sources : IUploadResponse[]; //sources list
  
  setSessionId: (sessionId: number) => void;
  clearSessionId: () => void;
  changeChatTitle: (title: string) => void;

  setSources :(sources: IUploadResponse[]) => void;//set sources list

  addSource: (source: IUploadResponse) => void; //add source to list of sources
  removeSource: (sourceId: number) => void;
  clearSources: () => void;
}

//that particular chat session id upload sources info
export const useSessionStore = create<SessionState>()(
  persist(
    (set) =>({
      sessionId: null, 
      chatTitle: null,
      sources: [],

      setSessionId: (newSessionId: number) => set({ sessionId: newSessionId }),
      clearSessionId: () => set({ sessionId: null }),

      changeChatTitle: (title: string) => set({ chatTitle: title }),

      setSources: (sources: IUploadResponse[]) => set({ sources }),
      addSource : (source: IUploadResponse) => set ( 
        (state) => ({
          sources : state.sources? [...state.sources, source] : [source]
        })
      ),
      removeSource: (sourceId: number) => set(
        (state) => ({ sources: state.sources.filter((source) => source.sourceId !== sourceId) })
      ),

      clearSources: () => set({ sources: [] }),
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