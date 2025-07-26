import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPill, IconTruck, IconShield, IconHeart } from "@tabler/icons-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-green-50 to-medical-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-medical-green-500 to-medical-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AS</span>
              </div>
              <h1 className="text-2xl font-bold text-neutral-800">Ausadhi Sewa</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-medical-green-600 hover:bg-medical-green-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-neutral-800 mb-6">
            Your Health, Our Priority
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Ausadhi Sewa provides reliable pharmaceutical products and healthcare solutions 
            delivered right to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-medical-green-600 hover:bg-medical-green-700">
                Start Shopping
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-neutral-800 mb-12">
            Why Choose Ausadhi Sewa?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-medical-green-100 rounded-full flex items-center justify-center mb-4">
                  <IconPill className="w-6 h-6 text-medical-green-600" />
                </div>
                <CardTitle className="text-lg">Quality Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  Genuine pharmaceutical products from trusted manufacturers
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-medical-blue-100 rounded-full flex items-center justify-center mb-4">
                  <IconTruck className="w-6 h-6 text-medical-blue-600" />
                </div>
                <CardTitle className="text-lg">Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  Quick and reliable delivery to your location
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-medical-orange-100 rounded-full flex items-center justify-center mb-4">
                  <IconShield className="w-6 h-6 text-medical-orange-600" />
                </div>
                <CardTitle className="text-lg">Secure Shopping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  Safe and secure payment processing
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <IconHeart className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  Round-the-clock customer support
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-neutral-800 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-neutral-600 mb-8">
            Join thousands of customers who trust Ausadhi Sewa for their healthcare needs.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-medical-green-600 hover:bg-medical-green-700">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 Ausadhi Sewa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 