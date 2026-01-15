import {  Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { useEffect } from 'react';
import { Dashboard, Home, NotFound, Signin, Signup } from './pages';
import { useAuthStore, useThemeStore, } from './store/index';
import {Navbar} from './components/common/index';
import WorkspaceContainer from './components/workspace/WorkspaceContainer';


//middleware to check if user is authenticated or not
//limit the unauthenticated user
const ProtectedRoute = ( {isAuthenticated}: {isAuthenticated: boolean} ) => {
  //useEffect to use toast which allows to render toast message only once
  useEffect(()=>{
    if(!isAuthenticated){
      toast.info("Please sigin to access")
    }
  },[]);

  if(!isAuthenticated){
    return(
      <Navigate to= "/signin" />
    ) 
  } 
  //if authenticated then user can access the child elements
  return <Outlet />;
}



const App = () => {

  const token = useAuthStore((state) => state.token);
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className="h-screen flex flex-col bg-bg-pri"> 
    <Toaster position="top-left" richColors={true} expand={false} theme={theme} closeButton={true} />
     <Navbar /> 
      <main className="flex-1 overflow-y-auto "> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          <Route element = { <ProtectedRoute isAuthenticated = {!!token}/> } >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<WorkspaceContainer />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;



//notes

{/* flex-1 takes all space 
  overflow-y-auto makes content scrollable
  content-hide is from index.css which hides default scrollbar */}