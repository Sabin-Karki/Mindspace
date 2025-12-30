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
  <div onClick={(e) => e.stopPropagation()} className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl p-6 w-full h-96 flex flex-col text-white shadow-2xl border border-gray-700">
    
    {/* Header */}
    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
      <div className="flex-1">
        <input type="text" value={localAudioCardName} onChange={handleChangeCardName} onKeyDown={handleKeyDown} placeholder="Audio title" className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition text-sm font-medium" />
      </div>
      <button onClick={closeModal} className="ml-3 p-2 hover:bg-gray-700 rounded-lg transition text-xl text-gray-300 hover:text-white">&times;</button>
    </div>

    {/* Content */}
    <div className="p-5 flex-1 overflow-y-auto space-y-4">
      
      {/* Info Section */}
      <div className="bg-gray-700/40 rounded-lg p-4 space-y-2 border border-gray-600/50">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Information</p>
        <div className="space-y-1">
          <p className="text-sm text-gray-300"><span className="text-gray-400">ID:</span> {audioId}</p>
          <p className="text-sm text-gray-300"><span className="text-gray-400">Title:</span> {audio.title}</p>
        </div>
      </div>

      {/* Audio Player Section */}
      <div className="bg-gray-700/40 rounded-lg p-5 border border-gray-600/50 space-y-3">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Audio Player</p>
        <audio controls className="w-full accent-blue-500 hover:accent-blue-400 transition" onError={(e) => { console.error("Audio error:", e); toast.error("Failed to play audio"); }} onLoadedMetadata={() => { console.log("Audio loaded successfully"); }}>
          <source src={getAudioUrl()} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </div>
 
      {/* URL Section */}
      <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
        <p className="text-xs text-gray-500 break-all font-mono">📎 {getAudioUrl()}</p>
      </div>

    </div>
  </div>
); 
}
export default AudioCardPopup;