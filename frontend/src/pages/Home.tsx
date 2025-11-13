import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  // Simple welcome for logged-in users
  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-10 bg-gray-50">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Welcome Back!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Ready to dive into your notes?
        </p>
        <Link
          to="/dashboard"
          className="px-8 py-3 text-lg font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  // Marketing page for logged-out users (LLM Notebook Style)
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Main Heading/Pitch */}
        <div className="max-w-3xl mx-auto">
          <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
            The <span className="text-blue-600">AI-Powered</span> Notebook for Next-Level Thinking
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Combine your notes with the power of LLMs. Get summaries, context, and instant drafts directly within your workspace.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link
            to="/signup"
            className="px-10 py-4 text-xl font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 transition duration-300 shadow-xl"
          >
            Start Taking Notes — It's Free
          </Link>
          <Link
            to="/signin"
            className="px-10 py-4 text-xl font-semibold rounded-lg text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 transition duration-300"
          >
            Already a User? Sign In
          </Link>
        </div>
        
        {/* Mockup/Feature Block (Visual Appeal) */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Features Designed for Clarity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <FeatureCard 
              icon="✨" 
              title="Instant Summaries" 
              description="Let the LLM condense pages of text into concise, actionable summaries."
            />
            <FeatureCard 
              icon="🧠" 
              title="Contextual Drafts" 
              description="Generate follow-up notes or expand on ideas with AI that understands your context."
            />
            <FeatureCard 
              icon="📂" 
              title="Seamless Sync" 
              description="Secure JWT authentication ensures your data is safe and accessible everywhere."
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// Simple helper component for the Home page
const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transform hover:scale-[1.02] transition duration-300">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;