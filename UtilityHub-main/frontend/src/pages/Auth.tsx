import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();
  
  const [isLoginTab, setIsLoginTab] = useState(searchParams.get('mode') !== 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }

    if (!isLoginTab) {
      if (!name) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    setIsLoading(true);

    try {
      let success = false;
      if (isLoginTab) {
        success = await login(email, password);
      } else {
        success = await register(name, email, password);
      }

      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Authentication failed. Please verify your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden bg-white/70 dark:bg-[#0c101d]/70 shadow-2xl p-8">
        
        {/* Decorative Top Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 to-indigo-600" />

        <div className="text-center mb-8">
          <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 inline-flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {isLoginTab ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isLoginTab ? 'Access your dashboard, favorites, and AI credits.' : 'Join UtilityHub AI to secure your usage statistics.'}
          </p>
        </div>

        {/* Form error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-2.5 text-xs font-semibold leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLoginTab && (
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <Button type="submit" className="w-full text-xs font-bold py-3 mt-4" isLoading={isLoading}>
            {isLoginTab ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        {/* Tab Toggle */}
        <div className="border-t border-slate-200/50 dark:border-slate-800/50 mt-8 pt-6 text-center">
          <button
            onClick={() => {
              setIsLoginTab(!isLoginTab);
              setError('');
            }}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-sky-400 transition-colors font-semibold"
          >
            {isLoginTab ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

      </Card>
    </div>
  );
};
export default Auth;
