import { create } from "zustand";
import type { IUploadResponse } from "../types";
import { createJSONStorage, persist } from "zustand/middleware";

interface SessionState {
  sources : IUploadResponse[]; //array of sources
  sessionId : number | null;
  
  setSessionId: (sessionId: number) => void;
  clearSessionId: () => void;
  addSource: (source: IUploadResponse) => void;
}

//that particular chat session id upload sources info
export const useSessionStore = create<SessionState>()(
  persist(
    (set) =>({

      sessionId: null,
      sources: [],

      setSessionId: (newSessionId: number) => set({ sessionId: newSessionId }),
      
      clearSessionId: () => set({ sessionId: null }),

      addSource : (source: IUploadResponse) => set ( 
        (state) => ({
          sources : state.sources? [...state.sources, source] : [source]
        })
      ),
    }),
  {
    name: "session-storage",// A unique name for key in localStorage
    storage: createJSONStorage( () => localStorage),  //tell zustland to use local storage
    partialize: (state) => ({sessionId: state.sessionId}),  //only persist store session id 
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