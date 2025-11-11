// import { useEffect, useMemo, useState } from "react";

// function useQueryToken() {
//   return useMemo(() => {
//     try {
//       const url = new URL(window.location.href);
//       return url.searchParams.get("token") || "";
//     } catch {
//       return "";
//     }
//   }, []);
// }

// const ResetPassword = () => {
//   const token = useQueryToken();
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [ready, setReady] = useState(false);
//   const [showPw, setShowPw] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   useEffect(() => {
//     setReady(true);
//   }, []);

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password.length < 6) return alert("Password must be at least 6 characters");
//     if (password !== confirm) return alert("Passwords do not match");
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/auth/reset-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, password }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.errors?.[0]?.msg || "Request failed");
//       alert("Password has been reset. You can now log in.");
//       window.location.href = "/login";
//     } catch (err: any) {
//       alert(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!ready) return null;

//   return (
//     <div className="max-w-md mx-auto py-12 px-4">
//       <h1 className="text-2xl font-semibold mb-6">Reset Password</h1>
//       {!token ? (
//         <div className="text-sm text-red-600">Missing token in URL.</div>
//       ) : (
//         <form onSubmit={onSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm mb-1">New Password</label>
//             <div className="relative">
//               <input
//                 type={showPw ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="••••••••"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPw((s) => !s)}
//                 className="absolute inset-y-0 right-2 my-auto text-sm text-blue-600 underline"
//                 aria-label={showPw ? 'Hide password' : 'Show password'}
//               >
//                 {showPw ? 'Hide' : 'Show'}
//               </button>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm mb-1">Confirm Password</label>
//             <div className="relative">
//               <input
//                 type={showConfirm ? 'text' : 'password'}
//                 value={confirm}
//                 onChange={(e) => setConfirm(e.target.value)}
//                 required
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="••••••••"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirm((s) => !s)}
//                 className="absolute inset-y-0 right-2 my-auto text-sm text-blue-600 underline"
//                 aria-label={showConfirm ? 'Hide password' : 'Show password'}
//               >
//                 {showConfirm ? 'Hide' : 'Show'}
//               </button>
//             </div>
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
//           >
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ResetPassword;






import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";

function useQueryToken() {
  return useMemo(() => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get("token") || "";
    } catch {
      return "";
    }
  }, []);
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const token = useQueryToken();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const validatePassword = (p: string): string | null => {
    if (p.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(p)) return "Must include an uppercase letter";
    if (!/[a-z]/.test(p)) return "Must include a lowercase letter";
    if (!/[^A-Za-z0-9]/.test(p)) return "Must include a special character";
    return null;
  };

  const passwordError = password ? validatePassword(password) : null;
  const matchError = confirm && password !== confirm ? "Passwords do not match" : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (matchError) {
      setError(matchError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.errors?.[0]?.msg || data?.message || "Request failed");
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Password reset successful! Please log in with your new password." }
        });
      }, 2000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Password Reset Successful!</h2>
              <p className="text-muted-foreground">Redirecting to login...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading text-primary">
              Reset Password
            </CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!token ? (
              <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                Invalid or missing reset token. Please request a new password reset link.
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="pr-10"
                      placeholder="••••••••"
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
                    <p className="text-xs text-green-600">Password meets requirements ✓</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters, include uppercase, lowercase, and a special character
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      disabled={loading}
                      className="pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {matchError && (
                    <p className="text-xs text-red-600">{matchError}</p>
                  )}
                  {!matchError && confirm && password === confirm && (
                    <p className="text-xs text-green-600">Passwords match ✓</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading || !!passwordError || !!matchError || !password || !confirm}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-primary hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;