import { create } from "zustand";
import type { ICardOverview } from "../types";

interface FlashCardState {
  flashCards: ICardOverview[];
 
  flashCardName: string;
  
  setFlashCards: (flashCards: ICardOverview[]) => void;
  clearFlashCards: () => void;
  
  
  addFlashCard: (flashCard: ICardOverview) => void;//adding flash card used in generator
  removeFlashCard: (flashCardId: number) => void;
  

  //update and remove flash card from list
  updateFlashCardName: (flashCardId: number, flashCardName: string) => void;
}

export const useFlashCardStore = create<FlashCardState>(
  (set) =>({

    flashCards: [],
    sourceSessionId: null,
    flashCardName: "",

    setFlashCards: (flashCards: ICardOverview[]) => set({ flashCards}),
    clearFlashCards: () => set({flashCards :[]}),
    addFlashCard:(flashCard : ICardOverview) =>set(
      (state) => {
        const alreadyExists = state.flashCards.some(
          (c) => c.cardOverViewId === flashCard.cardOverViewId); //prevent duplicate
        
        if(alreadyExists) return state; //no change
        return {flashCards: [...state.flashCards, flashCard] }; //add new flashcard
      }
    ),
    removeFlashCard: (flashCardId: number) => set((state) => (
      ({
        flashCards: state.flashCards.filter(
          (flashCard) => flashCardId !== flashCard.cardOverViewId
        ),
      })
    )),
    //update list
    updateFlashCardName: (flashCardId: number, flashCardName: string) => set((state) => ({
      flashCards: state.flashCards.map((flashCard) => {

        if (flashCard.cardOverViewId === flashCardId) {
          return { ...flashCard, title: flashCardName };
        }
        return flashCard;
      }),
    })),

  })
) 