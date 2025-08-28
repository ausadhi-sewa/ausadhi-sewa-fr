import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../utils/hooks';
import { addressApi, type Address } from '../../api/addressApi';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Star,
  Home,
  Building,
  User,
  Phone,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MyAddresses() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const userAddresses = await addressApi.getUserAddresses();
      setAddresses(userAddresses);
    } catch (error: any) {
      console.error('Error loading addresses:', error);
      setError(error.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await addressApi.setDefaultAddress(addressId);
      // Reload addresses to get updated default status
      await loadAddresses();
    } catch (error: any) {
      console.error('Error setting default address:', error);
      setError(error.message || 'Failed to set default address');
    }
  };

  const handleEditAddress = (addressId: string) => {
    navigate(`/profile/addresses/${addressId}/edit`);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressApi.deleteAddress(addressId);
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      } catch (error: any) {
        console.error('Error deleting address:', error);
        setError(error.message || 'Failed to delete address');
      }
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'delivery':
        return <Home className="h-4 w-4" />;
      case 'billing':
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'delivery':
        return 'Delivery Address';
      case 'billing':
        return 'Billing Address';
      default:
        return 'Address';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Please Log In</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to view your addresses.</p>
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
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
              <p className="text-gray-600">Manage your delivery and billing addresses</p>
            </div>
          </div>
          <Button onClick={() => navigate('/checkout')}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Addresses List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
              <p className="text-gray-600 mb-4">
                You haven't added any addresses yet. Add your first address to get started.
              </p>
              <Button onClick={() => navigate('/checkout')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card key={address.id} className="relative">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getAddressIcon(address.type)}
                        <span className="font-medium text-gray-900">
                          {getAddressTypeLabel(address.type)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {address.isDefault && (
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current" />
                            <span>Default</span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{address.fullName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{address.phoneNumber}</span>
                      </div>
                      <div className="space-y-1 text-gray-700">
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>
                          {address.city}, {address.district}, {address.province}
                        </p>
                        {address.postalCode && <p>Postal Code: {address.postalCode}</p>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAddress(address.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Address Management</h3>
                <p className="text-sm text-blue-700">
                  You can have multiple addresses for different purposes. Set one as your default 
                  address for quick checkout. You can edit or delete addresses at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
