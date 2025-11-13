





import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (p: string): string | null => {
    if (p.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(p)) return "Password must include an uppercase letter";
    if (!/[a-z]/.test(p)) return "Password must include a lowercase letter";
    if (!/[^A-Za-z0-9]/.test(p)) return "Password must include a special character";
    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPasswordError(null);
    
    const err = validatePassword(password);
    if (err) {
      setPasswordError(err);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.errors?.[0]?.msg || data?.message || 'Registration failed');
      }

      if (data.token) {
        await login(data.token);
      } else {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in.',
            email: email
          },
          replace: true 
        });
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              Create your account
            </h1>
            <p className="mt-2 text-muted-foreground text-sm md:text-base">
              Sign up to contribute and manage your profile
            </p>
          </div>

          <form onSubmit={onSubmit} className="rounded-xl border bg-card/80 backdrop-blur p-6 space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="Your name"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    setPasswordError(validatePassword(val));
                  }}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-red-600">{passwordError}</p>
              )}
              {!passwordError && password && (
                <p className="text-xs text-green-600">Password meets requirements</p>
              )}
              <p className="text-xs text-muted-foreground">
                At least 8 characters, include uppercase, lowercase, and a special character
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !!passwordError}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to our consent-first community principles
            </p>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-primary hover:underline"
              >
                Already have an account? Log in
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
