import { create } from "zustand";
import type { IAudioResponseDTO } from "../types";

interface AudioCardState {
  audios: IAudioResponseDTO[];
  audioCardName: string;
  
  setAudioCards: (audioCards: IAudioResponseDTO[]) => void;
  clearAudioCards: () => void;

  addAudioCard: (audioCard: IAudioResponseDTO) => void;
  removeAudioCard: (audioCardId: number) => void;
  
  updateAudioCardName: (audioCardId: number, audioCardName: string) => void;
}

export const useAudioCardStore = create<AudioCardState>(

  (set) =>({
    audios: [],
    audioCardName: "",
    setAudioCards: (audioCards ) =>set({ audios: audioCards}),
    clearAudioCards:() => set({ audios: []}),

    addAudioCard:(audioCard) => set(
      (state) =>{
        const alreadyExists = state.audios.some( (audio) => { audio.id === audioCard.id});
        if(alreadyExists) return state;
        return { audios : [...state.audios, audioCard]};
      }
    ),
    removeAudioCard:(audioCardId) =>set(
      (state) => ({ audios: state.audios.filter( (a) => a.id !== audioCardId) })
    ),

    updateAudioCardName:(audioCardId, newName) =>set(
      (state) =>({
        audios: state.audios.map( (audio) => (
          audio.id === audioCardId ? {...audio, audioCardName: newName} : audio
        ))
      })
    ),


  })
) 