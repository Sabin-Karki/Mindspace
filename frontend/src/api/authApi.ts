import type { ISigninRequest, JwtResponse } from "../types";
import { api } from "../config/axios";

export const signup = async (data: ISigninRequest): Promise<JwtResponse> => {
  const res = await api.post<JwtResponse>("/auth/signup", data);
  return res.data;
};


export const signin = async (data: ISigninRequest): Promise<JwtResponse> => {
  const res = await api.post<JwtResponse>("/auth/signin", data);
  return res.data;
};
