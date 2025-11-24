import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { getFlashCardCardsByOverviewId } from '../../../api/flashApi';
import type { ICardResponse } from '../../../types';
import { toast } from 'sonner';
import { X, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

// Make sure to set the app element for accessibility
Modal.setAppElement('#root');

interface FlashcardViewerProps {
  isOpen: boolean;
  onRequestClose: () => void;
  overviewId: number | null;
}

const FlashcardViewer = ({ isOpen, onRequestClose, overviewId }: FlashcardViewerProps) => {
  const [cards, setCards] = useState<ICardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isOpen && overviewId) {
      const fetchCards = async () => {
        setIsLoading(true);
        try {
          const fetchedCards = await getFlashCardCardsByOverviewId(overviewId);
          console.log("Fetched flashcards:", fetchedCards); // Debugging log
          setCards(fetchedCards);
          // Reset state when new set is loaded
          setCurrentIndex(0);
          setIsFlipped(false);
        } catch (error) {
          console.error('Failed to fetch flashcards:', error);
          toast.error('Failed to load flashcards.');
          onRequestClose(); // Close modal on error
        } finally {
          setIsLoading(false);
        }
      };
      fetchCards();
    }
  }, [isOpen, overviewId, onRequestClose]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl outline-none p-6 w-full max-w-2xl"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Flashcards</h2>
        <button onClick={onRequestClose} className="p-1.5 hover:bg-gray-200 rounded-full">
          <X size={20} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : cards.length > 0 && currentCard ? (
        <div>
          <div
            className="w-full h-64 border-2 border-gray-300 rounded-lg p-4 flex items-center justify-center text-center cursor-pointer perspective"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            >
              <div className="absolute w-full h-full backface-hidden flex items-center justify-center">
                <p className="text-lg">{currentCard.question}</p>
              </div>
              <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-lg">{currentCard.answer}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
            Click card to flip
            <RefreshCw size={14} className="ml-2"/>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              <ArrowLeft size={16} />
              Prev
            </button>
            <span className="text-gray-600">
              {currentIndex + 1} / {cards.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center h-64 flex items-center justify-center">
            <p>No flashcards found for this set.</p>
        </div>
      )}
    </Modal>
  );
};

export default FlashcardViewer;
