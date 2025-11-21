import { create } from "zustand";
import type { ChatSessionGetDTO } from "../types";

interface ChatListState{
  sessions: ChatSessionGetDTO[];

  setSessions: (sessions: ChatSessionGetDTO[]) => void;

  addSession: (session: ChatSessionGetDTO) => void;//not used for now//
  renameSession: (sessionId: number, title: string) => void;
  deleteSession: (sessionId: number) => void;
}

export const useChatsListStore = create<ChatListState>(
  (set) =>({

    sessions: [],
    setSessions: (sessions: ChatSessionGetDTO[]) => set({ sessions }),
    addSession: (session: ChatSessionGetDTO) => set(
      (state) => ({ sessions: [...state.sessions, session] })
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