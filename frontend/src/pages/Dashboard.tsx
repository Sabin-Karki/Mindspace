import { useState, useEffect } from "react";
import { AllChats, CreateChat } from "../components/dashboard";
import { Search, X } from "lucide-react";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-pri">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-xl font-semibold text-text-pri">Recent notebooks</h1>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tri" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 h-9 pl-9 pr-8 bg-bg-sec text-sm text-text-pri placeholder-text-tri rounded-full
                border-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-text-tri hover:text-text-sec transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notebooks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CreateChat />
          <AllChats searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
