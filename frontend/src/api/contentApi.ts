import { credApi } from '../config/axios';
import type { IUploadResponse, ISourceUpdateDTO, } from '../types/index';
import type { AxiosResponse } from 'axios';


export const uploadContent = async (sessionId: number, file: File | null, textContent: string | null): Promise<IUploadResponse> => {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }
  if (textContent) {
    formData.append('textContent', textContent);
  }

  const res: AxiosResponse<IUploadResponse> = await credApi.post(`/upload/content/${sessionId}`, formData, {
    headers: {
      // Axios will correctly set the boundary for multipart/form-data when passing FormData
      'Content-Type': 'multipart/form-data', 
    },
  });

  return res.data;
};

export const getSourceById = async (sourceId: number): Promise<IUploadResponse> => {
  const res: AxiosResponse<IUploadResponse> = await credApi.get(`/upload/get/${sourceId}`);
  return res.data;
};

export const updateSourceTitle = async (sourceId: number, title: string): Promise<IUploadResponse> => {
  const sourceUpdateDTO: ISourceUpdateDTO = { title };
  const res: AxiosResponse<IUploadResponse> = await credApi.put(`/upload/${sourceId}`, sourceUpdateDTO);
  return res.data;
};

export const deleteSource = async (sourceId: number): Promise<void> => {
  await credApi.delete(`/upload/${sourceId}`);
};

export const getSourcesBySessionId = async (sessionId: number): Promise<IUploadResponse[]> => {
  const res: AxiosResponse<IUploadResponse[]> = await credApi.get(`/upload/session/${sessionId}`);
  return res.data;
};



