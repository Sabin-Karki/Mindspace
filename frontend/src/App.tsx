import {  Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ThreeWindowPanel from './pages/ThreeWindowPanel';
import Dashboard from './pages/Dashboard';
import ChatWindow from './components/chat/ChatWindow';
import ChatMessageBubble from './components/chat/ChatMessageBubble';
import ChatInput from './components/chat/ChatInput';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50"> 
     <Navbar /> 
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<ThreeWindowPanel />} />
          <Route path="/c" element={<ChatWindow />} />
          {/* <Route path="/chat" element={<ChatMessageBubble  />} />
          <Route path="/chat" element={<ChatInput />} /> */}
        </Routes>
      </main>
    </div>
  );
};

export default App;