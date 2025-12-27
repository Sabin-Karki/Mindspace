import { useState } from "react";
import type { IAudioResponseDTO } from "../../../types";
import Modal from "react-modal";
import { toast } from "sonner";

interface AudioCardPopupProps {
  audioId: number;
  closeModal: () => void;
  audio: IAudioResponseDTO;
  handleUpdateAudioCardName: (input: string) => void;
}

Modal.setAppElement("#root");

const AudioCardPopup = ({ audioId, closeModal, audio, handleUpdateAudioCardName }: AudioCardPopupProps) => {
  
  const [localAudioCardName, setLocalAudioCardName] = useState(audio.title || "");

  const getAudioUrl = () => {
    if (audio.audioUrl.startsWith('http')) {
      return audio.audioUrl;
    }
    return `http://localhost:8080${audio.audioUrl}`;
  };

  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAudioCardName(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateAudioCardName(localAudioCardName);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-4 w-full h-96 flex flex-col text-white">
      <div className="flex justify-between items-center p-2">
        <div>
          <input type="text" value={localAudioCardName} onChange={handleChangeCardName} onKeyDown={handleKeyDown} className="px-2 py-1 text-black rounded" />
        </div>
        <button onClick={closeModal} className="text-xl">&times;</button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">ID: {audioId}</p>
          <p className="text-sm text-gray-400 mb-2">Title: {audio.title}</p>
        </div>

        <div>
          <audio controls style={{ width: "100%", maxWidth: "320px" }} onError={(e) => { console.error("Audio error:", e); toast.error("Failed to play audio"); }} onLoadedMetadata={() => { console.log("Audio loaded successfully"); }}>
            <source src={getAudioUrl()} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>

        <p className="text-xs text-gray-500 mt-2">URL: {getAudioUrl()}</p>
      </div>
    </div>
  );
};

export default AudioCardPopup;