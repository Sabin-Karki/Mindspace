import { useState, useEffect } from "react";
import { AllChats, CreateChat } from "../components/dashboard";
import { Search } from "lucide-react";

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

  return(
    <div className="p-6 bg-bg-pri">
      <div className="flex justify-between items-center mb-4 bg-bg-pri text-text-pri">
        <h1 className="text-2xl font-bold text-text-pri">My Notebooks</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-pri" />
          <input
            type="text"
            placeholder="Search notebooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 p-2 pl-10 border-2 border-border-pri bg-bg-pri rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <CreateChat />
        <AllChats searchQuery={searchQuery} />
      </div>
    </div>
  )
}

export default Dashboard;
