import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import logoImage from '../../imports/zee_tech_logo_transparent.png';

type Tab = 'login' | 'signup';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<Tab>((location.state as any)?.tab || 'login');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', privacy: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    const result = await login(loginForm.email, loginForm.password);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.isAdmin ? 'Welcome back, Admin!' : 'Welcome back!');
      navigate(result.isAdmin ? '/admin' : '/', { replace: true });
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (signupForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (signupForm.password !== signupForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (!signupForm.privacy) {
      toast.error('Please accept the Privacy Policy to continue');
      return;
    }
    setIsLoading(true);
    const result = await signup(signupForm.name, signupForm.email, signupForm.password, signupForm.phone);
    setIsLoading(false);
    if (result.success) {
      toast.success('Account created! Welcome to Zeetech Distribution!');
      navigate('/', { replace: true });
    } else {
      toast.error(result.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-block">
            <img src={logoImage} alt="Zeetech Distribution" className="h-20 w-auto object-contain mx-auto drop-shadow-xl" />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-3 tracking-tight">Zeetech Distribution</h1>
          <p className="text-[#b91c1c] text-sm mt-1 font-medium">Your Trusted Tech Partner in Nigeria</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-4 font-bold transition-colors text-sm sm:text-base ${
                tab === 'login'
                  ? 'text-[#b91c1c] border-b-2 border-[#b91c1c] bg-red-50/50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-4 font-bold transition-colors text-sm sm:text-base ${
                tab === 'signup'
                  ? 'text-[#b91c1c] border-b-2 border-[#b91c1c] bg-red-50/50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-[#b91c1c]/50" size={18} />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-[#b91c1c]/50" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Your password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-[#b91c1c]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#b91c1c] to-[#991b1b] hover:from-[#991b1b] hover:to-[#7f1d1d] text-white py-3 rounded-xl font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Don&apos;t have an account?{' '}
                  <button type="button" onClick={() => setTab('signup')} className="text-[#b91c1c] font-bold hover:underline">
                    Sign up free
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-[#b91c1c]/50" size={18} />
                    <input
                      type="text"
                      value={signupForm.name}
                      onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-[#b91c1c]/50" size={18} />
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-[#b91c1c]/50" size={18} />
                    <input
                      type="tel"
                      value={signupForm.phone}
                      onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })}
                      placeholder="08012345678"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-[#b91c1c]/50" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-[#b91c1c]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-[#b91c1c]/50" size={18} />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={signupForm.confirm}
                      onChange={e => setSignupForm({ ...signupForm, confirm: e.target.value })}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-[#b91c1c]"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signupForm.privacy}
                    onChange={e => setSignupForm({ ...signupForm, privacy: e.target.checked })}
                    className="mt-0.5 w-4 h-4 accent-red-600 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-600 leading-snug">
                    I agree to the{' '}
                    <Link to="/privacy" target="_blank" className="text-[#b91c1c] font-semibold hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    and consent to Zeetech Distribution storing my personal data.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#b91c1c] to-[#991b1b] hover:from-[#991b1b] hover:to-[#7f1d1d] text-white py-3 rounded-xl font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? 'Creating account...' : 'Create My Account'}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setTab('login')} className="text-[#b91c1c] font-bold hover:underline">
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>

          <div className="px-6 pb-6 pt-2 bg-red-50/50 border-t border-red-100">
            <div className="flex items-center gap-2 justify-center text-xs text-gray-500">
              <ShieldCheck size={14} className="text-green-500" />
              Your data is safe and secure with Zeetech Distribution
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          &copy; 2026 Zeetech Distribution. All rights reserved.
        </p>
      </div>
    </div>
  );
}