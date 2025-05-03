export interface AuthResponse {
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
  token: string;
}

class AuthService {
  // Google Authentication
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      // Mock implementation - in a real app, this would redirect to your backend OAuth endpoint
      const mockUser = {
        uid: 'google-mock-id',
        email: 'google-user@example.com',
        displayName: 'Google User',
        photoURL: 'https://via.placeholder.com/150'
      };
      
      const token = 'mock-google-token';
      
      return {
        user: mockUser,
        token
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  // GitHub Authentication
  async signInWithGithub(): Promise<AuthResponse> {
    try {
      // Mock implementation - in a real app, this would redirect to your backend OAuth endpoint
      const mockUser = {
        uid: 'github-mock-id',
        email: 'github-user@example.com',
        displayName: 'GitHub User',
        photoURL: 'https://via.placeholder.com/150'
      };
      
      const token = 'mock-github-token';
      
      return {
        user: mockUser,
        token
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with GitHub');
    }
  }

  // Email Link Authentication
  async sendSignInLink(email: string): Promise<void> {
    try {
      // Mock implementation - in a real app, this would call your backend API
      console.log(`Magic link would be sent to: ${email}`);
      // Save the email for verification
      localStorage.setItem('emailForSignIn', email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send magic link');
    }
  }

  // Verify Email Link
  async verifyEmailLink(email: string): Promise<AuthResponse | null> {
    // Check for verification token in the URL
    const params = new URLSearchParams(window.location.search);
    const verificationToken = params.get('token');
    
    if (verificationToken) {
      try {
        // Mock implementation - in a real app, this would verify with your backend
        const mockUser = {
          uid: 'email-mock-id',
          email: email,
          displayName: email.split('@')[0],
          photoURL: undefined
        };
        
        return {
          user: mockUser,
          token: verificationToken
        };
      } catch (error: any) {
        throw new Error(error.message || 'Failed to verify email link');
      }
    }
    return null;
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('sessionExpiry');
      localStorage.removeItem('mobileNumber');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }
}

export const authService = new AuthService(); 