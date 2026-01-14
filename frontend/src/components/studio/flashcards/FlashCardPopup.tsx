import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import Modal from "react-modal";
import type { ICardDetailResponse, ICardOverview, ICardResponse } from "../../../types";
import { getFlashCardByCardId } from "../../../api/flashApi";

Modal.setAppElement("#root");

interface FlashCardPopupProps {
  cardId: number;
  closeModal: () => void;
  flashCard: ICardOverview;
  handleUpdateFlashCardName: (input: string) => void;
}

const FlashCardPopup = ({
  cardId,
  closeModal,
  flashCard,
  handleUpdateFlashCardName,
}: FlashCardPopupProps) => {
  const [localFlashCardName, setLocalFlashCardName] = useState(flashCard.title || "");
  const [cardDetails, setCardDetails] = useState<ICardDetailResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const getFlashCard = async (cardId: number) => {
      try {
        const response: ICardResponse = await getFlashCardByCardId(cardId);
        setCardDetails(response.cardDetails || []);
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        const axiosMessage = error?.message;
        const message = serverMessage || axiosMessage || "Failed to get flashcard details. Please try again.";
        toast.error(message);
      }
    };
    getFlashCard(cardId);
  }, [cardId]);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const currentCard = cardDetails[currentIndex] ?? {
    question: "No card available",
    answer: "No card available",
  };

  const handleNext = () => {
    if (currentIndex < cardDetails.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSpeak=(text:string)=>{
    window.speechSynthesis.cancel(); // cancel ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);

  }

  const handleBlur = () => {
    setLocalFlashCardName(localFlashCardName);
    closeModal();
  };
  
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFlashCardName(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateFlashCardName(localFlashCardName);
    }
  };

  if (cardDetails.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-bg-pri rounded-2xl w-full max-w-md p-8 text-center">
          <p className="text-text-sec text-lg">Loading flashcard details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg-pri rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border-sec">
          <div >
            <input  
              type="text"
              value={localFlashCardName}
              onChange={handleChangeName}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="input-pri"
              placeholder="Set name..."
            />
          </div>
          <button
            onClick={closeModal}
            className="p-2 bg-bg-sec hover:bg-bg-tri rounded-lg transition-colors" >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-bg-sec">
          <div className="w-full max-w-2xl space-y-8">
            {/* Position indicator */}
            <div className="text-center">
              <p className="text-sm font-medium">
                Card {currentIndex + 1} of {cardDetails.length}
              </p>
            </div>

            {/* Flip card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full cursor-pointer group"
              style={{ perspective: "1000px" }}
            >
              <div
                className="relative transition-transform duration-500 w-full"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  minHeight: "280px",
                }}
              >
                {/* Front - Question */}
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-500 to-slate-200 p-8 flex flex-col items-center justify-center rounded-xl shadow-lg text-text-pri"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <p className="text-center text-xl md:text-2xl font-semibold leading-relaxed select-none">
                    {currentCard.question}
                  </p>
                  <p className="text-gray-500 text-mm mt-6">Click to see answer</p>
                </div>

                {/* Back - Answer */}
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-200 p-8 flex flex-col items-center justify-center rounded-xl shadow-lg border border-emerald-200"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-center text-xl md:text-2xl font-semibold text-text-pri leading-relaxed select-none">
                    {currentCard.answer}
                  </p>
                  <p className="text-gray-500 text-m mt-6">Click to see question</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex-center gap-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                disabled={currentIndex === 0}
                className="p-3 rounded-full hover:bg-bg-tri disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={28} className="text-text-pri" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                disabled={currentIndex === cardDetails.length - 1}
                className="p-3 rounded-full hover:bg-bg-tri disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={28} className="text-text-pri" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCardPopup;
//notes 
  // return (
  //   <>
  //     <div onClick={closeModal} className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
  //     <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-4 w-full max-w-md text-white" >
      
  //       {/* {currentCard.cardId} */}
  //       {currentCard.question}
  //       {currentCard.answer}
  //       </div>
  //     </div>
  //   </>
  // )