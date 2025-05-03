import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Mail, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';

interface SocialAuthProps {
  isLoading: boolean;
  mode: 'login' | 'signup';
}

const SocialAuth: React.FC<SocialAuthProps> = ({ isLoading: parentLoading, mode }) => {
  const navigate = useNavigate();
  const { login } = useSession();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleAuth = async (provider: 'google' | 'github') => {
    setIsLoading(provider);
    try {
      const authMethod = provider === 'google' ? authService.signInWithGoogle : authService.signInWithGithub;
      const response = await authMethod();
      
      if (response.token) {
        login(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        toast.success(`Successfully signed in with ${provider}`);
        navigate('/invoices');
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
    } finally {
      setIsLoading(null);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading('email');
    try {
      await authService.sendSignInLink(email);
      setEmailSent(true);
      toast.success('Magic link sent! Please check your email.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send magic link');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => handleAuth('google')}
            disabled={parentLoading || !!isLoading}
            className="hover:bg-gray-50"
          >
            {isLoading === 'google' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FcGoogle className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAuth('github')}
            disabled={parentLoading || !!isLoading}
            className="hover:bg-gray-50"
          >
            {isLoading === 'github' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Github className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setEmailDialogOpen(true)}
            disabled={parentLoading || !!isLoading}
            className="hover:bg-gray-50"
          >
            {isLoading === 'email' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Mail className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in with Email</DialogTitle>
            <DialogDescription>
              {emailSent 
                ? "We've sent you a magic link. Please check your email to continue."
                : "Enter your email address and we'll send you a magic link to sign in."}
            </DialogDescription>
          </DialogHeader>

          {!emailSent && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading === 'email'}
              >
                {isLoading === 'email' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Magic Link'
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SocialAuth; 