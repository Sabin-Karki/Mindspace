import { useState } from "react";
import { signup } from "../api/authApi";
import type { ISignUpRequest } from "../types";
import { Link, useNavigate } from "react-router-dom"; // Assuming you use react-router-dom
import { useAuthStore } from "../store/authStore";

//register account
const Signup = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login); 
  
  const [form, setForm] = useState<ISignUpRequest>({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(form).some(val => !val)) {
      setError("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const res = await signup(form);
      login(res.token);
      // Success
      navigate("/dashboard");
    } catch (err) {
      // Handle different error codes for production (e.g., email already exists)
      setError("Signup failed. This email might already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white shadow-xl rounded-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Create Your Notebook Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                required
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm font-medium text-red-600 p-2 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150'
            }`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-green-600 hover:text-green-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;