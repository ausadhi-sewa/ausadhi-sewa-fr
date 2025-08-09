import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart,
  Shield,
  Truck,
  Award
} from 'lucide-react';
import logo from '../../assets/AusadhiSewa.logo.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' }
  ];

  const exploreLinks = [
    { name: 'All Products', path: '/products' },
    { name: 'Prescription', path: '/category/prescription' },
    { name: 'OTC', path: '/category/otc' },
    { name: 'Wellness', path: '/category/wellness' }
  ];

  const resourcesLinks = [
    { name: 'Blog', path: '/blog' },
    { name: 'How To Order', path: '/how-to-order' },
    { name: 'Support', path: '/support' }
  ];

  return (
    <footer className="bg-gradient-to-r from-transparent via-medical-green-200-50 to-transparent text-neutral-800 shadow-lg">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-6">
              <div className="flex items-center mb-3">
                <img 
                  src={logo} 
                  alt="Ausadhi Sewa" 
                  className="h-24 w-auto mr-3"
                />
                <div>
                  <h3 className="text-xl font-bold text-medical-green-700">AusadhiSewa</h3>
                  <p className="text-sm text-medical-green-600 font-medium">MEDICINE DELIVERY</p>
                </div>
              </div>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Logo and Contact Info */}
          <div className="lg:col-span-1">
            
            
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold text-neutral-800 mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-button-color rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-neutral-700">44 Lalitpur Rd, Buddhanagar, Kathmandu 44600, Nepal</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-button-color rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-neutral-700">+977 1-591-2222</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-button-color rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-neutral-700">info@ausadhisewa.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold text-neutral-800 mb-4">Company</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-neutral-700 hover:text-medical-green-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-lg font-bold text-neutral-800 mb-4">Explore</h4>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-neutral-700 hover:text-medical-green-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-bold text-neutral-800 mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourcesLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-neutral-700 hover:text-medical-green-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              © {currentYear} AusadhiSewa. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
