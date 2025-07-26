import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "./GoogleButton";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showGoogleButton?: boolean;
  onGoogleClick?: () => void;
  googleLoading?: boolean;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showGoogleButton = true, 
  onGoogleClick,
  googleLoading = false 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-green-50 to-medical-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-medical-green-500 to-medical-blue-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">AS</span>
          </div>
          <CardTitle className="text-2xl font-bold text-neutral-800">{title}</CardTitle>
          {subtitle && (
            <p className="text-neutral-600 text-sm">{subtitle}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
          
          {showGoogleButton && onGoogleClick && (
            <>
              <Separator className="my-6" />
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-4">Or continue with</p>
                <GoogleButton onClick={onGoogleClick} loading={googleLoading} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
