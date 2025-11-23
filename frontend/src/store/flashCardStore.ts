import { create } from "zustand";
import type { ICardResponse } from "../types";

interface FlashCardState {
  flashCards: ICardResponse[];

  setFlashCards: (flashCards: ICardResponse[]) => void;
  clearFlashCards: () => void;

  addFlashCard: (flashCard: ICardResponse) => void;
  removeFlashCard: (flashCardId: number) => void;
}

export const useFlashCardStore = create<FlashCardState>(
  (set) =>({

    flashCards: [],
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

  })
) 