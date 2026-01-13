import { useState } from "react";
import { signup } from "../api/authApi";
import type { ISignUpRequest } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";

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

    // if (Object.values(form).some(val => !val)) {
    //   setError("Please fill in all fields.");
    //   return;
    // }
    
    if( !form.firstName){
      setError("Please enter your first name.");
      return;
    }
    if( !form.lastName){
      setError("Please enter your last name.");
      return;
    }
    if( form.email.includes('@') === false || form.email.includes('.') === false){
      setError("Please enter a valid email address.");
      return;
    }
    if( !form.password){
      setError("Please enter your password.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const res = await signup(form);
      login(res.token);
      navigate("/dashboard");
      toast.success("Signup successful");

    } catch (err) {
      setError("Signup failed. Please Try again.");
      toast.error("Signup failed. Please Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-bg-pri min-h-[calc(100vh-50px)] ">
      <div className="w-full max-w-lg p-8 space-y-6 bg-bg-sec shadow-xl rounded-2xl border-2 border-border-pri">
        <h2 className="text-3xl font-extrabold text-center text-text-pri">
          Create Your Notebook Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-text-pri">First Name</label>
              <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                className="mt-1 block w-full px-5 py-2 border border-border-sec rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-text-pri">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="mt-1 block w-full px-5 py-2 border border-border-sec rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-sec">Email address</label>
            <input
              id="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 block w-full px-3 py-2 border border-border-sec rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-sec">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className="mt-1 block w-full px-3 py-2 border border-border-sec rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
          <div className="text-text-pri">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-green-600 hover:text-green-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;