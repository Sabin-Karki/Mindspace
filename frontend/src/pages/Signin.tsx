import { useState } from "react";
import { signin } from "../api/authApi";
import type { ISigninRequest, JwtResponse } from "../types";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";

//for later
// use RHF + Zod
//react-hook-form and zod validation

const Signin = () => {

  const navigate = useNavigate();
  const login = useAuthStore(state => state.login); 
  
  const [form, setForm] = useState<ISigninRequest>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //handle changes in form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
  // The Computed Property Name syntax ([]) is to use the variable's value as the key
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ( !form.email ) {
      setError("Please fill in email field.");
      return;
    }
    if ( !form.password ) {
      setError("Please fill in password field.");
      return;
    }
    if(form.email.includes('@') === false || form.email.includes('.') === false){
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res: JwtResponse = await signin(form);
      login(res.token);
      navigate("/dashboard");
      toast.success("Login successful");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-pri">
      <div className="w-full max-w-md p-8 space-y-6 bg-bg-sec shadow-xl rounded-2xl border-2 border-border-pri">
        <h2 className="text-3xl font-extrabold text-text-pri text-center">
          Sign In to Your Notebook
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-pri">Email address</label>
            <input
              id="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 block w-full px-3 py-2 border border-border-sec rounded-md shadow-sm placeholder-bg-bg-tri focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-pri">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 block w-full px-3 py-2 border border-border-sec text-text-sec rounded-md shadow-sm placeholder-bg-bg-tri focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-text-pri ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm">
          <div className="text-text-pri">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;

