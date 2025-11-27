// import { Layers } from "lucide-react";
// import { useSessionStore } from "../../../store/sessionStore";
// import { generateFlashCard } from "../../../api/flashApi";
// import { toast } from "sonner";
// import { useState } from "react";
// import { useStudioStore } from "../../../store/useStudioStore";

// const FlashGenerator = () => {
//   const { sessionId, sources } = useSessionStore();
//   const { incrementGenerationCounter } = useStudioStore();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleGenerateFlashcards = async () => {
//     if (!sessionId) {
//       toast.error("No active session. Please select a chat session first.");
//       return;
//     }

//     if (!sources || sources.length === 0) {
//       toast.error("No sources available. Please upload a document first.");
//       return;
//     }

//     setIsLoading(true);
//     toast.info("Generating flashcards... This may take a moment.");

//     try {
//       const sourceIds = sources.map(s => s.sourceId);
//       console.log("Generating flashcards with sessionId:", sessionId, "and sourceIds:", sourceIds); // Debugging log
//       await generateFlashCard(sessionId, sourceIds);
      
//       toast.success("Flashcards generated successfully!");
//       incrementGenerationCounter();

//     } catch (error) {
//       console.error("Failed to generate flashcards:", error);
//       toast.error("Failed to generate flashcards. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleGenerateFlashcards}
//       disabled={isLoading}
//       className="relative flex flex-col items-center justify-center p-4 space-y-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//     >
//       <Layers size={32} className="text-blue-500" />
//       <span className="text-sm font-medium text-gray-700">Flashcards</span>
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       )}
//     </button>
//   );
// };

// export default FlashGenerator;