'use client';

import { useState } from 'react';
import { Mail, Lock, User, Chrome, Calendar, FileText, HelpCircle, CheckSquare } from 'lucide-react';
import { VideoBackground } from '../components';
import { useAuth } from '../contexts/AuthContext';

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.displayName);
      } else {
        await signIn(formData.email, formData.password);
      }
      
      // Redirect or handle success
      console.log('Authentication successful!');
      
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      console.log('Google authentication successful!');
      // Redirect or handle success
      
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Background Animation with Feature Cards */}
      <div className="w-full lg:w-3/5 relative overflow-hidden">
        <VideoBackground />
        
        {/* Fade Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/30"></div>
        
        {/* Feature Cards Container - Hidden on mobile, shown on desktop */}
        <div className="relative z-10 p-8 h-full hidden lg:flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Feature Card 1 */}
            <div className="bg-card/80 backdrop-blur-sm border border-primary/50 rounded-2xl p-6 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Schedule Meeting</h3>
              <p className="text-sm text-muted">Schedule meetings on Calendly</p>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-card/80 backdrop-blur-sm border border-primary/50 rounded-2xl p-6 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Write Notes</h3>
              <p className="text-sm text-muted">Create notes on Trello/Notion</p>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-card/80 backdrop-blur-sm border border-primary/50 rounded-2xl p-6 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Ask Anything</h3>
              <p className="text-sm text-muted">Get answers to your questions</p>
            </div>
            
            {/* Feature Card 4 */}
            <div className="bg-card/80 backdrop-blur-sm border border-primary/50 rounded-2xl p-6 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                <CheckSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Prioritize Tasks</h3>
              <p className="text-sm text-muted">Organize and prioritize your work</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */} 
      <div className="w-full lg:w-2/5 bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </h1>
            <p className="text-muted text-sm">
              {isSignUp ? 'Create your account to get started' : 'Welcome back to your AI assistant'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  name="displayName"
                  placeholder="Full Name"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-sm text-foreground
                  placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                  transition-all duration-300 [&:-webkit-autofill]:!bg-card [&:-webkit-autofill]:!text-foreground"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-sm text-foreground
                  placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                  transition-all duration-300 [&:autofill]:bg-card [&:autofill]:text-foreground 
                    [&:autofill]:outline-none [&:autofill]:shadow-[0_0_0_1000px_theme(colors.card)_inset] 
                    [&:autofill]:-webkit-text-fill-color-[theme(colors.foreground)] [&:autofill]:text-foreground 
                    [&:autofill]:-webkit-text-fill-color-foreground [&:autofill]:!text-foreground 
                    [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary"
                />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-sm
                  text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary 
                  focus:border-transparent transition-all duration-300 [&:autofill]:bg-card [&:autofill]:text-foreground 
                    [&:autofill]:outline-none [&:autofill]:shadow-[0_0_0_1000px_theme(colors.card)_inset] 
                    [&:autofill]:-webkit-text-fill-color-[theme(colors.foreground)] [&:autofill]:text-foreground 
                    [&:autofill]:-webkit-text-fill-color-foreground [&:autofill]:!text-foreground 
                    [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary"
                />
            </div>

            {isSignUp && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-sm text-foreground
                   placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-300 [&:autofill]:bg-card [&:autofill]:text-foreground 
                    [&:autofill]:outline-none [&:autofill]:shadow-[0_0_0_1000px_theme(colors.card)_inset] 
                    [&:autofill]:-webkit-text-fill-color-[theme(colors.foreground)] [&:autofill]:text-foreground 
                    [&:autofill]:-webkit-text-fill-color-foreground [&:autofill]:!text-foreground 
                    [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary"
                />
              </div>
            )}

            {/* Action Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full text-sm group relative cursor-pointer inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-accent text-foreground font-semibold rounded-full transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-background text-muted">or</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex text-sm cursor-pointer items-center justify-center gap-3 px-8 py-4 bg-card border border-border text-foreground font-medium rounded-full transition-all duration-300 hover:bg-card/80 hover:border-primary/50 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome className="w-4 h-4 text-muted group-hover:text-primary transition-colors duration-300" />
            <span>{loading ? 'Loading...' : 'Continue with Google'}</span>
          </button>

          {/* Toggle Mode */}
          <div className="text-center">
            <p className="text-muted text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary cursor-pointer hover:text-link-hover font-medium transition-colors duration-300"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Mobile Features Section - Shown below sign-in on mobile */}
      <div className="lg:hidden bg-card/50 backdrop-blur-sm border-t border-border/50 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            AI Assistant Features
          </h2>
          <p className="text-muted text-sm">Discover what your AI assistant can do for you</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
            <h3 className="text-sm font-semibold text-foreground mb-1">Schedule Meeting</h3>
            <p className="text-xs text-muted">On Calendly</p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
            <h3 className="text-sm font-semibold text-foreground mb-1">Write Notes</h3>
            <p className="text-xs text-muted">Trello/Notion</p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
            <h3 className="text-sm font-semibold text-foreground mb-1">Ask Anything</h3>
            <p className="text-xs text-muted">AI assistance</p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
            <h3 className="text-sm font-semibold text-foreground mb-1">Prioritize Tasks</h3>
            <p className="text-xs text-muted">Workflow</p>
          </div>
        </div>
      </div>
    </div>
  );
}
