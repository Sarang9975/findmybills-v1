import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Mail } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

interface AuthProvidersProps {
  isLoading?: boolean;
  onEmailClick?: () => void;
  onGoogleClick?: () => void;
  onGithubClick?: () => void;
}

export function AuthProviders({
  isLoading,
  onEmailClick,
  onGoogleClick,
  onGithubClick,
}: AuthProvidersProps) {
  return (
    <div className="grid gap-4 w-full">
      <Button
        variant="outline"
        onClick={onGoogleClick}
        disabled={isLoading}
        className="bg-background"
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        onClick={onGithubClick}
        disabled={isLoading}
        className="bg-background"
      >
        <Github className="mr-2 h-5 w-5" />
        Continue with GitHub
      </Button>
      <Button
        variant="outline"
        onClick={onEmailClick}
        disabled={isLoading}
        className="bg-background"
      >
        <Mail className="mr-2 h-5 w-5" />
        Continue with Email
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
 