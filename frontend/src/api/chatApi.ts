import { credApi } from '../config/axios';
import type { ChatSessionGetDTO, IChatMessage, IChatRenameRequest, IChatRequest, IChatSession } from '../types/index';
import type { AxiosResponse } from 'axios';

//dashboard apis
export const createChatSession = async (): Promise<IChatSession> => {
  const res = await credApi.post('/chat');
  return res.data;
};


export const renameChatTitle = async (sessionId: number, title: string): Promise<IChatSession> => {
  const chatRenameDto: IChatRenameRequest = { title };

  const res: AxiosResponse<IChatSession> = await credApi.patch(`/chat/session/${sessionId}`, chatRenameDto);
  return res.data;
};

export const deleteChat = async (sessionId: number): Promise<void> => {
  await credApi.delete(`/chat/session/${sessionId}`);
};

//get dashboard titles chatsessionId
export const fetchAllChatSessions = async (): Promise<ChatSessionGetDTO[]> => {
  const res: AxiosResponse<ChatSessionGetDTO[]> = await credApi.get('/chat/getAll');
  return res.data;
};


//chat bot apis
export const askQuestion = async (sessionId: number | null, question: string): Promise<IChatMessage> => {
  const chatRequest: IChatRequest = { question };

  const res: AxiosResponse<IChatMessage> = await credApi.post(`/chat/${sessionId}/ask`, chatRequest);
  return res.data;
};


export const getChatHistory = async (sessionId: number | null): Promise<IChatMessage[]> => {

  const res: AxiosResponse<IChatMessage[]> = await credApi.get(`/chat/session/${sessionId}`);
  return res.data;
};