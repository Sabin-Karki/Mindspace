import {  Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ThreeWindowPanel from './pages/Workspace';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50"> 
    <Toaster position="top-left" richColors={true} expand={false} theme='light' closeButton={true} />
     <Navbar /> 
      <main className="flex-1 overflow-y-auto "> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<ThreeWindowPanel />} />
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