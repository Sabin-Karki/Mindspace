import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void; 
  logout: () => void;
}


const getInitialToken = () => typeof window !== 'undefined' ? localStorage.getItem("token") : null;

export const useAuthStore = create<AuthState>((set) => {
  const initialToken = getInitialToken();
  
  return {
    token: initialToken,
    isAuthenticated: !!initialToken,

    // Action to handle sign-in/sign-up
    login: (token: string) => {
      set({ token, isAuthenticated: !!token });
      localStorage.setItem("token", token);
    },

    // Action to handle sign-out
    logout: () => {
      set({ token: null, isAuthenticated: false });
      localStorage.removeItem("token");
    },
  };
});


// export const useAuthStore = create<AuthState>((set) => ({
//   token: null,
//   isAuthenticated: false,
//   login: (token: string) => set({ token, isAuthenticated: true }),
//   logout: () => set({ token: null, isAuthenticated: false }),
// }));