import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import ChatTitle from "./chat/ChatTitle";


const Navbar = () => {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);


  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home page after logout
  };

  const isChatPage =window.location.pathname === "/chat";

  // If the store hasn't finished loading from local storage,
  // render a minimal/loading UI (to prevent flickering)
  // if (!hasHydrated) {
  //   return (
  //     <nav className="sticky top-0 z-10 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //           <div className="flex justify-between items-center h-16">
  //               <Link to="/" className="text-2xl font-bold text-gray-900 flex items-center">
  //                   <span className="text-blue-600 mr-1">📝</span> Mindspace
  //               </Link>
  //               Loading...
  //           </div>
  //       </div>
  //     </nav>
  //   );
  // }


  return (
    // Sticky navbar for a professional feel
    <nav className="sticky top-0 z-10 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className=" mx-auto px-4">

        <div className="flex items-center w-full h-16">
          {/* Logo/Branding */}
          <Link to="/" className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="text-blue-600 mr-1">📝</span> Mindspace
          </Link>

          { isChatPage && (
            <div className="flex items-center p-4">
              <ChatTitle />
            </div>
          )}

          <div className="flex items-center space-x-4 ml-auto">
            {isAuthenticated ? (
              // --- Logged In View ---
              <>
                <Link
                  to="/chat"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                >
                  chat
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150"
                >
                  Logout
                </button>
              </>
            ) : (
              // --- Logged Out View ---
              <>
                <Link
                  to="/signin"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
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