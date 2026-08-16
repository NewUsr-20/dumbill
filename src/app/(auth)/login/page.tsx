'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, LogIn, MailCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Updated to match your (auth) route group structure!
            emailRedirectTo: `${window.location.origin}/callback`,
          }
        });
        
        if (error) throw error;

        if (data?.user?.identities?.length === 0) {
          toast.error('This email is already registered! Please sign in.');
          setLoading(false);
          return;
        }

        if (data.user && !data.session) {
          setNeedsVerification(true);
          return;
        }

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast.success('Welcome back!');
        router.refresh();
        router.push('/billing'); // Matches your (app)/billing route
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (needsVerification) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-12 px-8 shadow-xl shadow-black/5 sm:rounded-3xl border border-gray-100 text-center">
          <MailCheck size={64} className="mx-auto text-blue-600 mb-6" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Check your email</h2>
          <p className="text-gray-600 mb-8 text-lg">
            We sent a verification link to <span className="font-bold text-black">{email}</span>. 
            Please click the link to verify your account.
          </p>
          <button 
            onClick={() => setNeedsVerification(false)}
            className="text-sm font-bold text-gray-500 hover:text-black transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors w-fit mx-auto">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {isSignUp ? 'Create your account' : 'Sign in to Segmentics'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-black/5 sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-black"
                  placeholder="shop@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-black"
                  placeholder="At least 6 characters"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : <><LogIn size={18} /> Sign In</>)}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}