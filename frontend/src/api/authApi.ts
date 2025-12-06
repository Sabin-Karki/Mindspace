import type { ISigninRequest, ISignUpRequest, JwtResponse } from "../types";
import { api } from "../config/axios";


//sending ISignUpRequest or ISigninRequest to backend //both gets accepted //wrong
//todo in backend 
//input validation
export const signup = async (data: ISignUpRequest): Promise<JwtResponse> => {
  const res = await api.post<JwtResponse>("/auth/signup", data);
  return res.data;
};


export const signin = async (data: ISigninRequest): Promise<JwtResponse> => {
  const res = await api.post<JwtResponse>("/auth/signin", data);
  return res.data;
};
