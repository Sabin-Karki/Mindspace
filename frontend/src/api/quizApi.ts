import { credApi } from '../config/axios';
import type { 
  IQuizRequestDTO, 
  IQuizOverviewResponse, 
  IQuizUpdate,
} from '../types/index';
import type { AxiosResponse } from 'axios';


export const generateQuiz = async (sessionId: number, sourceIds: number[]): Promise<IQuizOverviewResponse> => {
  const quizRequestDTO: IQuizRequestDTO = { sourceIds };
  const res: AxiosResponse<IQuizOverviewResponse> = await credApi.post(`/quizzes/generate/${sessionId}`, quizRequestDTO);
  return res.data;
};

export const getQuizById = async (quizId: number): Promise<IQuizOverviewResponse> => {
  const res: AxiosResponse<IQuizOverviewResponse> = await credApi.get(`/quizzes/${quizId}`);
  return res.data;
};

export const getQuizzesBySessionId = async (sessionId: number): Promise<IQuizOverviewResponse[]> => {
  const res: AxiosResponse<IQuizOverviewResponse[]> = await credApi.get(`/quizzes/session/${sessionId}`);
  return res.data;
};

export const updateQuizTitle = async (quizId: number, title: string): Promise<IQuizOverviewResponse> => {
  const quizUpdate: IQuizUpdate = { title };
  const res: AxiosResponse<IQuizOverviewResponse> = await credApi.put(`/quizzes/${quizId}`, quizUpdate);
  return res.data;
};

export const deleteQuiz = async (quizId: number): Promise<void> => {
  await credApi.delete(`/quizzes/delete/${quizId}`);
};

