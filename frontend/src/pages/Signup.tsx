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
  const [showPassword, setShowPassword] = useState(false);

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

    if (!form.firstName) {
      setError("Please enter your first name.");
      return;
    }
    if (!form.lastName) {
      setError("Please enter your last name.");
      return;
    }
    if (form.email.includes('@') === false || form.email.includes('.') === false) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.password) {
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
    <div className="min-h-[calc(100vh-60px)] flex">
      {/* Left Panel - Decorative with subtle pattern */}
      <div className="hidden lg:flex lg:w-[45%] bg-bg-sec relative overflow-hidden">
        {/* Abstract geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-16 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-teal-500/5 rounded-full blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <div className="max-w-sm">
            <h1 className="text-3xl font-bold text-text-pri mb-4">
              Join MindSpace
            </h1>
            <p className="text-text-sec text-base leading-relaxed mb-12">
              Start transforming the way you learn. AI-powered tools designed to help you study smarter.
            </p>

            {/* Minimal feature indicators */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-text-sec">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-sm">Upload any document or paste text</span>
              </div>
              <div className="flex items-center gap-3 text-text-sec">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-sm">Generate quizzes and flashcards instantly</span>
              </div>
              <div className="flex items-center gap-3 text-text-sec">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-sm">Chat with AI about your content</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decoration line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-pri to-transparent" />
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-bg-pri">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-text-pri mb-2">Create account</h2>
            <p className="text-text-sec text-sm">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-text-pri mb-2">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-4 py-2.5 bg-bg-sec border border-border-pri rounded-lg text-text-pri placeholder-text-tri focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-text-pri mb-2">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-2.5 bg-bg-sec border border-border-pri rounded-lg text-text-pri placeholder-text-tri focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-pri mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-bg-sec border border-border-pri rounded-lg text-text-pri placeholder-text-tri focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-pri mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-2.5 pr-11 bg-bg-sec border border-border-pri rounded-lg text-text-pri placeholder-text-tri focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tri hover:text-text-sec transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${loading
                  ? 'bg-blue-500/50 text-white/70 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-bg-pri'
                }`}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            {/* Terms */}
            <p className="text-center text-xs text-text-tri pt-2">
              By signing up, you agree to our{' '}
              <a href="#" className="text-text-sec hover:text-blue-500 transition-colors">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-text-sec hover:text-blue-500 transition-colors">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;