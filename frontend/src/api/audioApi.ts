import { credApi } from '../config/axios';
import type { IAudioResponseDTO, IAudioUpdateDTO} from '../types/index';
import type { AxiosResponse } from 'axios';


export const generateAudioOverview = async (sourceId: number): Promise<IAudioResponseDTO> => {
  const res: AxiosResponse<IAudioResponseDTO> = await credApi.post(`/audio/generate/${sourceId}`);
  return res.data;
};

export const getAudioOverviewsBySessionId = async (sessionId: number): Promise<IAudioResponseDTO[]> => {
  const res: AxiosResponse<IAudioResponseDTO[]> = await credApi.get(`/audio/session/${sessionId}`);
  return res.data;
};

export const getAudioOverviewById = async (audioId: number): Promise<IAudioResponseDTO> => {
  const res: AxiosResponse<IAudioResponseDTO> = await credApi.get(`/audio/${audioId}`);
  return res.data;
};

export const updateAudioTitle = async (audioId: number, title: string): Promise<IAudioResponseDTO> => {
  const audioUpdateDTO: IAudioUpdateDTO = { title };
  const res: AxiosResponse<IAudioResponseDTO> = await credApi.put(`/audio/${audioId}`, audioUpdateDTO);
  return res.data;
};

export const deleteAudioOverview = async (audioId: number): Promise<void> => {
  await credApi.delete(`/audio/${audioId}`);
};