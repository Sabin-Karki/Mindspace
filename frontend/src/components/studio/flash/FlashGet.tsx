import { useEffect, useState } from "react";
import { useSessionStore } from "../../../store/sessionStore";
import { getFlashCardOverviewsBySessionId } from "../../../api/flashApi";
import type { ICardResponse } from "../../../types"; // Changed from IFlashCardOverview
import { toast } from "sonner";
import { BookOpen } from "lucide-react";
import { useStudioStore } from "../../../store/useStudioStore";
import FlashcardViewer from "./FlashcardViewer";

const FlashGet = () => {
  const { sessionId } = useSessionStore();
  const { generationCounter } = useStudioStore();
  const [flashcardOverviews, setFlashcardOverviews] = useState<ICardResponse[]>([]); // Changed type
  const [isLoading, setIsLoading] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedOverviewId, setSelectedOverviewId] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setFlashcardOverviews([]);
      return;
    }

    const fetchOverviews = async () => {
      setIsLoading(true);
      try {
        const overviews = await getFlashCardOverviewsBySessionId(sessionId);
        setFlashcardOverviews(overviews);
      } catch (error) {
        console.error("Failed to fetch flashcard overviews:", error);
        toast.error("Failed to load flashcard sets.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviews();
  }, [sessionId, generationCounter]);

  const handleOverviewClick = (overviewId: number) => {
    setSelectedOverviewId(overviewId);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setSelectedOverviewId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      {flashcardOverviews.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          No flashcard sets generated for this session yet.
        </div>
      ) : (
        <div className="space-y-3">
          {flashcardOverviews.map((overview) => (
            <div
              key={overview.cardOverViewId} // Changed key
              onClick={() => handleOverviewClick(overview.cardOverViewId)} // Changed ID property
              className="p-3 bg-white border border-gray-200 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-full">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-800">{overview.title}</p>
                {/* Removed createdAt as it's not present in ICardResponse from this endpoint */}
              </div>
            </div>
          ))}
        </div>
      )}

      <FlashcardViewer
        isOpen={isViewerOpen}
        onRequestClose={closeViewer}
        overviewId={selectedOverviewId}
      />
    </>
  );
};

export default FlashGet;