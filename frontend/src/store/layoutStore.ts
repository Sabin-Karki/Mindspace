import { create } from "zustand";

interface LayoutState {
  isLeftPanelClose: boolean;
  isRightPanelClose: boolean;
  setIsLeftPanelClose: (booleanValue: boolean) => void;
  setIsRightPanelClose: (booleanValue: boolean) => void;

}


//this is for workspacer container layout
//to remember the dragging state
//left panel and right panel
export const useLayoutStore = create<LayoutState>( (set) => ({

  isLeftPanelClose: false,
  isRightPanelClose: false,
  setIsLeftPanelClose: (booleanValue: boolean) => set({ isLeftPanelClose: booleanValue }),
  setIsRightPanelClose: (booleanValue: boolean) => set({ isRightPanelClose: booleanValue }),

}));