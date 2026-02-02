import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
}

export default function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      const { error } = mode === 'login' 
        ? await signIn(data.email, data.password)
        : await signUp(data.email, data.password);

      if (error) {
        let message = error.message;
        
        // User-friendly error messages
        if (message.includes('User already registered')) {
          message = 'This email is already registered. Try logging in instead.';
        } else if (message.includes('Invalid login credentials')) {
          message = 'Invalid email or password. Please try again.';
        } else if (message.includes('Password should be')) {
          message = 'Password must be at least 6 characters long.';
        }
        
        toast({
          title: mode === 'login' ? 'Login failed' : 'Sign up failed',
          description: message,
          variant: 'destructive',
        });
        return;
      }

      if (mode === 'signup') {
        toast({
          title: 'Account created!',
          description: 'Check your email to confirm your account, or log in directly.',
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have been logged in successfully.',
        });
        navigate('/');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/90">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-fuchsia-500/50 focus:ring-fuchsia-500/20"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/90">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-fuchsia-500/50 focus:ring-fuchsia-500/20"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-medium py-6"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === 'login' ? 'Logging in...' : 'Creating account...'}
          </>
        ) : (
          mode === 'login' ? 'Log In' : 'Create Account'
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          {mode === 'login' ? (
            <>Don't have an account? <span className="text-fuchsia-400">Sign up</span></>
          ) : (
            <>Already have an account? <span className="text-fuchsia-400">Log in</span></>
          )}
        </button>
      </div>
    </form>
  );
}
