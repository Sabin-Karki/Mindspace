import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import ChatTitle from "./ChatTitle";
import ThemeToggle from "./ThemeToggle"; "./ThemeToggle";


const Navbar = () => {
  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);
  const isAuthenticated = !!token; //check if there is token or not 

  const logout = useAuthStore((state) => state.logout);


  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home page after logout
  };

  const isChatPage = window.location.pathname === "/chat";
  
  return (
    // Sticky navbar for a professional feel
    <nav className="sticky top-0 z-10 w-full bg-bg-pri/95 text-text-pri backdrop-blur-sm border-b border-border-pri ">
      <div className=" mx-auto px-4">

        <div className="flex items-center w-full h-12">
          {/* Logo/Branding */}
          <Link to="/" className="text-2xl font-bold text-text-pri flex items-center">
            <span className="text-blue-600 mr-1">📝</span> Mindspace
          </Link>

          {/* if it is chat page then show chat title in navbar */}
          { isChatPage && (
              <ChatTitle />
          )}

          <div className="flex items-center space-x-4 ml-auto">
            <ThemeToggle />
            {isAuthenticated ? (
              // --- Logged In View ---
              <>      
                <button
                  onClick={handleLogout}
                  className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150"
                >
                  Logout
                </button>
              </>
            ) : (
              // --- Logged Out View ---
              <>
                <Link
                  to="/signin"
                  className="text-text-pri hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition duration-150"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;