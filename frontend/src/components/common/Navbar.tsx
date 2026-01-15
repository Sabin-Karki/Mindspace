import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import ChatTitle from "./ChatTitle";
import ThemeToggle from "./ThemeToggle";


const Navbar = () => {
  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);
  const isAuthenticated = !!token;

  const logout = useAuthStore((state) => state.logout);


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isChatPage = window.location.pathname === "/chat";

  return (
    <nav className="sticky top-0 z-50 w-full h-14 bg-bg-pri border-b border-border-pri">
      <div className="w-full px-6 h-full">
        <div className="flex items-center justify-between h-full">

          {/* Left side - Logo & Chat Title */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-text-pri">MindSpace</span>
            </Link>

            {/* Chat Title - next to logo */}
            {isChatPage && (
              <div className="flex items-center gap-2 text-text-sec">
                <ChatTitle />
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="h-8 px-3 text-sm text-text-sec hover:text-text-pri hover:bg-bg-sec rounded-lg transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  to="/signin"
                  className="h-8 px-3 text-sm text-text-sec hover:text-text-pri hover:bg-bg-sec rounded-lg transition-colors flex items-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="h-8 px-3 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;