import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, HelpCircle, Mail } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 3D Illustration Container */}
        <div className="mb-8">
          <div className="relative mx-auto w-96 h-80 flex items-center justify-center">
            {/* SVG Illustration */}
            <img
              src="/404-computer.svg"
              alt="404 Error Illustration"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback if SVG fails to load
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
            
            {/* Fallback Illustration */}
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg" style={{ display: 'none' }}>
              <div className="text-center">
                <div className="text-6xl mb-4">🖥️</div>
                <div className="text-4xl font-bold text-gray-600">404</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          404 Not Found
        </h1>

        {/* Error Message */}
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Whoops! That page doesn't exist.
        </h2>

        {/* Helpful Links Section */}
        <div className="mb-8">
          <p className="text-lg text-gray-500 mb-6">
            Here are some helpful links instead:
          </p>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleNavigation('/products')}
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleNavigation('/help')}
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleNavigation('/contact')}
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact
            </Button>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
          >
            ← Go Back
          </Button>
          
          <div className="text-sm text-gray-400">
            If you believe this is an error, please contact our support team.
          </div>
        </div>
      </div>
    </div>
  );
}
