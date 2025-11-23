import type { AxiosResponse } from "axios";
import { credApi } from "../config/axios";
import type { ICardRequestDTO, ICardResponse, ICardUpdate, IFlashCardOverview } from "../types";


export const generateFlashCard = async (sessionId: number, sourceIds: number[]): Promise<ICardResponse> => {
  const cardRequestDTO: ICardRequestDTO = { sourceIds };
  const res: AxiosResponse<ICardResponse> = await credApi.post(`/generate/flash-card/${sessionId}`, cardRequestDTO);
  return res.data;
};

//get specific flash card
export const getFlashCardByCardId = async (cardId: number): Promise<ICardResponse[]> => {
  const res: AxiosResponse<ICardResponse[]> = await credApi.get(`/generate/flash-card/${cardId}`);
  return res.data;
};

//get list of flash cards
export const getFlashCardsBySessionId = async (sessionId: number): Promise<IFlashCardOverview[]> => {
  const res: AxiosResponse<IFlashCardOverview[]> = await credApi.get(`/generate/flash-card/session/${sessionId}`);
  return res.data;
};

export const updateFlashCardOverviewTitle = async (cardId: number, title: string): Promise<ICardResponse> => {
  const cardUpdate: ICardUpdate = { title };
  const res: AxiosResponse<ICardResponse> = await credApi.put(`/generate/flash-card/${cardId}`, cardUpdate);
  return res.data;
};

export const deleteFlashCardOverview = async (cardId: number): Promise<void> => {
  await credApi.delete(`/generate/flash-card/${cardId}`);
};