import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "../store/authStore"; 

const BASE_URL = "http://localhost:8080/api/v1";

//Unauthenticated API instance
export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  
  //axios automatically detects what type of content are u sending 
  //and sets the correct headers
  //no need to set it manually/force here
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Authenticated API instance (for protected routes)
export const credApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// AXIOS REQUEST INTERCEPTOR
// This runs before every request made with 'credApi'
credApi.interceptors.request.use(
  (config) => {
    // Get the current token from the store *dynamically*
    const token = useAuthStore.getState().token; 
    
    if (token) {
      // Inject the Bearer token into the headers
      config.headers.Authorization = `Bearer ${token}`; 
    } 
    // If token is null, the request will likely fail with 401 on the backend, 
    // which is correct behavior for an unauthenticated user on a protected route.
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AXIOS RESPONSE INTERCEPTOR
// This runs after every request made with 'credApi'
credApi.interceptors.response.use(
  //simply send response
  (response) =>{
    return response;
  },

  //but in case of error, if status code is 401, logout 
  (error) =>{
    if(error.response && error.response.status === 401){
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
)