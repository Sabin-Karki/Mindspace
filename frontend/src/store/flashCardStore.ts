import { create } from "zustand";
import type { ICardResponse } from "../types";

interface FlashCardState {
  flashCards: ICardResponse[];
  flashCardName: string;
  
  setFlashCards: (flashCards: ICardResponse[]) => void;
  clearFlashCards: () => void;
  
  
  addFlashCard: (flashCard: ICardResponse) => void;
  removeFlashCard: (flashCardId: number) => void;

  setFlashCardName: (flashCardName: string) => void;
  updateFlashCardName: (flashCardId: number, flashCardName: string) => void;
}

export const useFlashCardStore = create<FlashCardState>(
  (set) =>({

    flashCards: [],
    flashCardName: "",

    setFlashCards: (flashCards: ICardResponse[]) =>set({ flashCards }),
    clearFlashCards: () => set({flashCards :[]}),
    addFlashCard:(flashCard : ICardResponse) =>set(
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
    setFlashCardName: (flashCardName: string) => set({ flashCardName }),

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