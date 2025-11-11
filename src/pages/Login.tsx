// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import Footer from "@/components/Footer";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAuth } from "@/context/AuthContext";
// import { Eye, EyeOff } from "lucide-react";
// import { authFetch } from "@/lib/api";

// const Login = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const searchParams = new URLSearchParams(window.location.search);
//   const redirectTo = searchParams.get('redirect') || '/profile';
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isLogin) {
//       // keep register UI here, but prefer dedicated signup page
//       navigate("/signup");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await authFetch('/api/auth/login', {
//         method: 'POST',
//         body: JSON.stringify({ email, password })
//       });
      
//       const data = await res.json();
      
//       if (!res.ok) {
//         throw new Error(data?.errors?.[0]?.msg || 'Login failed');
//       }
      
//       if (data && data.token) {
//         login(data.token);
//         // The login function will handle the redirect to the profile page
//       }
//     } catch (err: any) {
//       alert(err.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="flex-1 flex items-center justify-center px-4 py-12">
//       <Card className="w-full max-w-md shadow-xl card-texture">
//         <CardHeader className="text-center">
//           <CardTitle className="text-3xl font-heading text-primary">
//             {isLogin ? "Welcome Back" : "Create Account"}
//           </CardTitle>
//           <CardDescription>
//             {isLogin 
//               ? "Sign in to upload and manage content" 
//               : "Register to contribute to the archive"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && (
//               <div className="space-y-2">
//                 <Label htmlFor="full-name">Full Name</Label>
//                 <Input 
//                   id="full-name" 
//                   type="text" 
//                   placeholder="Enter your full name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>
//             )}
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input 
//                 id="email" 
//                 type="email" 
//                 placeholder="your.email@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input 
//                   id="password" 
//                   type={showPassword ? "text" : "password"} 
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="pr-10"
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   onClick={() => setShowPassword(!showPassword)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="text-right -mt-2">
//               <button
//                 type="button"
//                 onClick={() => navigate('/forgot-password')}
//                 className="text-sm text-primary hover:underline"
//               >
//                 Forgot Password?
//               </button>
//             </div>

//             {/* Confirm password removed as requested */}

//             <Button type="submit" className="w-full" size="lg" disabled={loading}>
//               {loading ? (isLogin ? 'Logging in...' : 'Continuing...') : (isLogin ? "Login" : "Register")}
//             </Button>

//             <div className="text-center pt-4">
//               <button
//                 type="button"
//                 onClick={() => setIsLogin(!isLogin)}
//                 className="text-sm text-primary hover:underline"
//               >
//                 {isLogin 
//                   ? "Don't have an account? Register" 
//                   : "Already have an account? Login"}
//               </button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Login;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.errors?.[0]?.msg || data?.message || 'Login failed');
      }
      
      if (data.token) {
        await login(data.token);
      } else {
        throw new Error('No token received');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-xl card-texture">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading text-primary">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to upload and manage content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-sm text-primary hover:underline"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;