import { useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { login, googleSignIn, clearError } from "../features/auth/authSlice";
import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthForm } from "../components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  // Check for auth error from URL params (e.g., from Google OAuth callback)
  const authError = searchParams.get('error');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await dispatch(login(data)).unwrap();
      // Navigation will be handled by useEffect above
    } catch (error) {
      // Error is handled by Redux slice
      console.error("Login failed:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('🔵 [LOGIN PAGE] Google sign-in button clicked');
    try {
      console.log('🔵 [LOGIN PAGE] Dispatching googleSignIn action');
      await dispatch(googleSignIn()).unwrap();
      console.log('🟢 [LOGIN PAGE] Google sign-in action completed successfully');
      // Redux will handle the redirect to Google OAuth
    } catch (error) {
      console.error('🔴 [LOGIN PAGE] Google sign-in failed:', error);
    }
  };

  // Get the error message to display
  const getErrorMessage = () => {
    if (authError === 'auth_failed') {
      return 'Google authentication failed. Please try again.';
    }
    return error;
  };

  return (
    <div className="relative">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800"
        >
          <IconArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <AuthLayout
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
        onGoogleClick={handleGoogleSignIn}
        googleLoading={loading}
      >
        <AuthForm
          onSubmit={handleLogin}
          loading={loading}
          error={getErrorMessage()}
        />
        
        <div className="text-center text-sm text-neutral-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-medical-green-600 hover:text-medical-green-700 font-medium"
          >
            Sign up here
          </Link>
        </div>
      </AuthLayout>
    </div>
  );
}
