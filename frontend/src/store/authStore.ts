import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void; 
  logout: () => void;
  hasHydrated: boolean;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      hasHydrated: false,   //data hasnot loaded from local storage yet so false 
      //login fn
      login: (token: string) =>{
        //set token and isAuthenticated true if there is token
        set({ token, isAuthenticated: !!token });
      },

      //logout fn
      logout : ()=>{
        set({token: null, isAuthenticated: false, hasHydrated: true });
      }
    }),
    {
      name: "auth-token-storage",
      storage: createJSONStorage( ()=> localStorage),

      partialize: (state) =>({token: state.token}),

      // onRehydrateStorage It gives a place to run code after the localStorage data has successfully loaded.
      onRehydrateStorage:() =>{
        return (state, error) =>{

          if(state && !error){
            state.isAuthenticated = !!state.token; 
            //I have now loaded the token from localStorage and calculated the final isAuthenticated state. 
            useAuthStore.setState({hasHydrated: true});
          }
        }
      },

    }
  ),
);



//using local storage to persist the token 
//
// const getInitialToken = () => typeof window !== 'undefined' ? localStorage.getItem("token") : null;

// export const useAuthStore = create<AuthState>((set) => {
//   const initialToken = getInitialToken();
//   return {
//     token: initialToken,
//     isAuthenticated: !!initialToken,

//     // Action to handle sign-in/sign-up
//     login: (token: string) => {
//       set({ token, isAuthenticated: !!token });
//       localStorage.setItem("token", token);
//     },

//     // Action to handle sign-out
//     logout: () => {
//       set({ token: null, isAuthenticated: false });
//       localStorage.removeItem("token");
//     },
//   };
// });


//zustland eg
// export const useAuthStore = create<AuthState>((set) => ({
//   token: null,
//   isAuthenticated: false,
//   login: (token: string) => set({ token, isAuthenticated: true }),
//   logout: () => set({ token: null, isAuthenticated: false }),
// }));


//notes//
// Hydration: Is the process of loading the saved state from the slower storage medium (localStorage)
//  and merging it into the fast, in-memory store.
//
//React Render (Fast/Synchronous):
//  The Navbar component runs instantly. It sees the store's default state: { token: null, isAuthenticated: false }.
//  It immediately renders the "Sign In" button.

// Zustand Persistence (Slow/Asynchronous):
//  In the background, the persist middleware is slowly reading the token from localStorage.

//problem :The fast render wins the race and shows the "Logged Out" UI

//what happens without hydration
//when we first load the page, the token is null and isAuthenticated is false 
//and our react render sees this and renders no token and not authenticated
//but 
//we are loggedin and there is also token in local storage using persist
//but our zustland persist is slow to read local storage and so we see no token and isAuthenticated is false
//
//after using hydration and onRehydrateStorage
// The Navbar now says: "If hasHydrated is false, I'll wait.
//  If hasHydrated is true, I'll trust the isAuthenticated value and render the final links."