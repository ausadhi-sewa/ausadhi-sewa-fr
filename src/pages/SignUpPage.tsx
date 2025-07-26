import { useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { signup, googleSignIn, clearError } from "../features/auth/authSlice";
import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthForm } from "../components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

export default function SignUpPage() {
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

  const handleSignup = async (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: "user" | "admin" | "staff";
  }) => {
    try {
      // Convert phone to number if provided
      const signupData = {
        ...data,
        phone: data.phone ? parseInt(data.phone) : undefined,
      };
      
      await dispatch(signup(signupData)).unwrap();
      // Navigation will be handled by useEffect above
    } catch (error) {
      // Error is handled by Redux slice
      console.error("Signup failed:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('🔵 [SIGNUP PAGE] Google sign-in button clicked');
    try {
      console.log('🔵 [SIGNUP PAGE] Dispatching googleSignIn action');
      await dispatch(googleSignIn()).unwrap();
      console.log('🟢 [SIGNUP PAGE] Google sign-in action completed successfully');
      // The redirect will happen in the thunk itself
    } catch (error) {
      console.error('🔴 [SIGNUP PAGE] Google sign-in failed:', error);
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
        title="Create Account"
        subtitle="Join Ausadhi Sewa to get started"
        onGoogleClick={handleGoogleSignIn}
        googleLoading={loading}
      >
        <AuthForm
          onSubmit={handleSignup as any}
          isSignup={true}
          loading={loading}
          error={getErrorMessage()}
        />
        
        <div className="text-center text-sm text-neutral-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-medical-green-600 hover:text-medical-green-700 font-medium"
          >
            Sign in here
          </Link>
        </div>
      </AuthLayout>
    </div>
  );
}
