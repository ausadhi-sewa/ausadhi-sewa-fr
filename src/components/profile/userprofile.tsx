
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../utils/hooks';
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronRight,
  Calendar,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { logoutUser } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../utils/hooks';

interface ProfileMenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const profileMenuItems: ProfileMenuItem[] = [
    {
      id: 'orders',
      title: 'My Orders',
      description: 'View and track your orders',
      icon: <Package className="h-5 w-5" />,
      href: '/profile/orders',
      badge: 'New'
    },
    {
      id: 'addresses',
      title: 'My Addresses',
      description: 'Manage your delivery addresses',
      icon: <MapPin className="h-5 w-5" />,
      href: '/profile/addresses'
    },
    {
      id: 'settings',
      title: 'Account Settings',
      description: 'Update your profile information',
      icon: <Settings className="h-5 w-5" />,
      href: '/profile/settings'
    }
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleMenuItemClick = (href: string) => {
    navigate(href);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Please Log In</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to view your profile.</p>
            <p className="text-sm text-gray-500 mb-4">Use the Login button in the navigation bar to sign in.</p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account and orders</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-medical-green-500 to-medical-green-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name || 'User'}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge variant="secondary" className="mt-1">
                      {user.role || 'Customer'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Access your account features and manage your orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profileMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                      onClick={() => handleMenuItemClick(item.href)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-medical-green-100 rounded-lg flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}