import axios, { type AxiosResponse } from "axios";
import { credApi } from "../config/axios";
import type { IReportRequest, IReportResponse, IReportUpdate } from "../types";

export const generateReport = async(sessionId: number, sourceIds: number[]): Promise<IReportResponse> => {
  const reportRequest: IReportRequest = { sourceIds };
  const response = await credApi.post(`/report/generate/${sessionId}`, reportRequest);
  return response.data;
}

export const getReportById = async(reportId: number): Promise<IReportResponse> => {
  const response = await credApi.get(`/report/get/${reportId}`);
  return response.data;
}

export const getAllReports  = async(sessionId: number): Promise<IReportResponse[]> => {
  const response = await credApi.get(`/report/get/session/${sessionId}`);
  return response.data;
}

export const updateReportTitle  = async(reportId: number, title: string): Promise<IReportResponse> => {
  
  const updatePayload:IReportUpdate = {title};
  const response = await credApi.put(`/report/update/${reportId}`, updatePayload);
  return response.data;
}

export const deleteReport  = async(reportId: number):Promise<void> => {
  await credApi.delete(`/report/delete/${reportId}`);
}



//notes
// const fetchSomething = async() =>{
//   const response: AxiosResponse = await axios.get('https://example.com/api/something');

//   //in response axios has this
//   //  data: T;
//   //   status: number;
//   //   statusText: string;
//   //   headers: H & RawAxiosResponseHeaders | AxiosResponseHeaders;
//   //   config: InternalAxiosRequestConfig<D>;
//   //   request?: any;

//   return response.data;
// }

// const postSomething = async(somethingId: number, data: string) =>{

//   const payloadToSend = {data};
//   const response = await axios.post(`https://example.com/api/something/${somethingId}`, payloadToSend);

//   return response.data;
// }


// const axiosAPi = axios.create( {
//   baseURL: "https://example.com/api",
// });

// //now we ca do this 

// const fetchSomething = async() =>{
//   const response = await axiosAPi.get('https://example.com/api/something');
//   return response.data;
// }