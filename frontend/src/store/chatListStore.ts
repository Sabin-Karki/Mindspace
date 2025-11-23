import { create } from "zustand";
import type { ChatSessionGetDTO } from "../types";

interface ChatListState{
  sessions: ChatSessionGetDTO[];

  setSessions: (sessions: ChatSessionGetDTO[]) => void;

  addSession: (session: ChatSessionGetDTO) => void;//not used for now//
  renameSession: (sessionId: number, title: string) => void;
  deleteSession: (sessionId: number) => void;
}

export const useChatListStore = create<ChatListState>(
  (set) =>({

    sessions: [],
    setSessions: (sessions: ChatSessionGetDTO[]) => set({ sessions }),
    addSession: (session: ChatSessionGetDTO) => set(
      (state) => {
        const alreadyExists = state.sessions.some((s) => s.sessionId === session.sessionId);
        if(alreadyExists) return state; //do nothing
        return {sessions: [...state.sessions, session]}; //add chatsession to list
      }
    ),
    renameSession: (sessionId: number, title: string) => set(
      (state) => ({ sessions: state.sessions.map((session) =>
       session.sessionId === sessionId ? { ...session, title } : session) })
    ),
    deleteSession: (sessionId: number) => set(
      (state) => ({ sessions: state.sessions.filter((session) => session.sessionId !== sessionId) })
    )
  })
)