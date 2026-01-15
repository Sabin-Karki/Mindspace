import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (newToken: string, firstName?: string, lastName?: string) => void; 
  logout: () => void;
  hasHydrated: boolean;

  firstName :string | null;
  lastName :string | null;
  setFirstName: (newName: string) => void;
  setLastName: (newName: string) => void;
}


export const useAuthStore = create<AuthState>()(
  persist(

    (set) => ({
      token: null,
      isAuthenticated: false,
      hasHydrated: false,   //data hasnot loaded from local storage yet so false 

      firstName : null,
      lastName : null,

      //login fn
      login: (newToken: string, firstName?: string, lastName?: string) => 
        set( () => ({
          token: newToken,
          isAuthenticated: true,
          firstName: firstName || null,
          lastName: lastName || null,
        })
      ),

      logout: () => 
        set( () => ({
          token: null,
          isAuthenticated: false,
          firstName: null,
          lastName: null 
          })
      ),

      setFirstName: (newName: string) => set(
        () => ({firstName: newName, })
      ),
      setLastName: (newName: string) => set(
        () => ({lastName: newName, })
      ),
    }),

    {
      name: "auth-token-storage",
      storage: createJSONStorage( () => localStorage),

      //save token and names
      partialize: (state) =>({
        token: state.token, firstName: state.firstName, lastName: state.lastName
      }),

      // onRehydrateStorage It gives a place to run code after the localStorage data has successfully loaded.
      onRehydrateStorage:() =>{
        return (state, error) =>{
          // This callback runs after data is pulled from LocalStorage

          //check if we have a token in the restored state
          const hasToken  = state?.token;
          
          //say "Search is over" (hydrated: true) regardless of result
          //and if there is token then we are authenticated
          useAuthStore.setState({
            isAuthenticated: !!hasToken,
            hasHydrated: true,
          });
        }
      },
    }

  )
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



// hasHydrated: false (Start)
// Meaning: "I just woke up. I haven't looked in the backpack (LocalStorage) yet.
//  I don't know if I have a token or not."
// Effect: If you use this flag in UI, you usually show a spinner.

// hasHydrated: true (End)
// Meaning: "I have finished looking in the backpack."
// Scenario A: I found a token. Great, log the user in.
// Scenario B: The backpack was empty. Okay, that's fine. The search is still finished. The user is definitely logged out.