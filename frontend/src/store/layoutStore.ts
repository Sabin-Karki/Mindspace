import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type InitialWidthType = {
  dragpos1: number,
  dragpos2: number
};

interface LayoutState {
  isLeftPanelClose: boolean;
  isRightPanelClose: boolean;
  setIsLeftPanelClose: (booleanValue: boolean) => void;
  setIsRightPanelClose: (booleanValue: boolean) => void;

  dividerPos :InitialWidthType;

  //it either takes InitialWidthType or 
  // a function that takes InitialWidthType and returns InitialWidthType
  setDividerPos: (pos: InitialWidthType | ((prev: InitialWidthType) => InitialWidthType) ) => void;
}


//this is for workspacer container layout
//to remember the dragging state
//left panel and right panel
export const useLayoutStore = create<LayoutState>()( 
  persist(

    (set) => ({ 
      isLeftPanelClose: false,
      isRightPanelClose: false,
      setIsLeftPanelClose: (value: boolean) => set({ isLeftPanelClose: value }),
      setIsRightPanelClose: (value: boolean) => set({ isRightPanelClose: value }),
      
      dividerPos: { dragpos1: 20, dragpos2: 80 }, //initial width value

      setDividerPos: (value : InitialWidthType | ((prev: InitialWidthType) => InitialWidthType)) => set(
        (state) => {
          return {
            dividerPos: typeof value === "function" ? value(state.dividerPos) : value
          }
        }

      ),
    }),

    {
      name: "layout-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isLeftPanelClose: state.isLeftPanelClose,
        isRightPanelClose: state.isRightPanelClose,
        dividerPos: state.dividerPos,
      }),
    }
    
  )
);