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
  const response = await credApi.get(`/report/get/session${sessionId}`);
  return response.data;
}

export const updateReportTitle  = async(reportId: number, title: string): Promise<IReportResponse> => {
  
  const updatePayload:IReportUpdate = {title};
  const response = await credApi.put(`/report/update${reportId}`, updatePayload);
  return response.data;
}

export const deleteReport  = async(reportId: number):Promise<void> => {
  await credApi.delete(`/report/delete${reportId}`);
}