import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeType = 'dark' | "light";

interface IThemeStore{
  theme: ThemeType;
  setTheme: (themeInput: ThemeType) => void;
  toggleTheme: () => void;

}

export const useThemeStore = create<IThemeStore>()(
  persist(

    (set, get) =>({

      theme: 'dark',
      setTheme: (themeInput: ThemeType) => {
        set( {theme: themeInput } )
        updateDOMTheme(themeInput)
      },

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";//get opposite of existing theme 
        set( {theme: newTheme } ); //and set theme
        updateDOMTheme(newTheme);   //update dom to render
      },
      
    }),
    // persist second argument
    {
      name:"theme-storage",

      onRehydrateStorage: () => (state) => {
        if(state){
          updateDOMTheme(state.theme);
        }
      },

    }
  )
)

const updateDOMTheme = (theme: ThemeType) =>{
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

//first
//check the local storage to see what is the theme first 
//if there is theme then use that 
//
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        if (parsed.state?.theme) {
          updateDOMTheme(parsed.state.theme);
        }
      } catch (e) {
        console.error('Failed to parse theme from localStorage', e);
      }
    }
  }