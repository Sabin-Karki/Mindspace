import { credApi } from '../config/axios'; 
import type{ ChatSessionGetDTO, IChatMessage, IChatRenameRequest, IChatRequest, IChatResponse, IChatSession } from '../types/index';
import type{ AxiosResponse } from 'axios';


export const createChatSession = async (): Promise<IChatSession> => {
  const res: AxiosResponse<IChatSession> = await credApi.post('/chat');
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

export const fetchAllChatSessions = async (): Promise<ChatSessionGetDTO[]> => {

  const res: AxiosResponse<ChatSessionGetDTO[]> = await credApi.get('/chat/getAll');
  return res.data;
};


export const askQuestion = async (sessionId: number, question: string): Promise<IChatResponse> => {
  const chatRequest: IChatRequest = { question };

  const res: AxiosResponse<IChatResponse> = await credApi.post(`/chat/${sessionId}/ask`, chatRequest);
  return res.data;
};


export const getChatHistory = async (sessionId: number): Promise<IChatMessage[]> => {

  const res: AxiosResponse<IChatMessage[]> = await credApi.get(`/chat/session/${sessionId}`);
  return res.data;
};