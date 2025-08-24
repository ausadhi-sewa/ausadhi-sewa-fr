import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../utils/hooks/useCart';
import { useAppSelector } from '../utils/hooks';
import { addressApi, type Address, type CreateAddressRequest } from '../api/addressApi';
import { orderApi, type CreateOrderRequest } from '../api/orderApi';
import AddressSearch from '../components/checkout/AddressSearch';
import { type ParsedAddress } from '../api/addressSearchApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Checkbox } from '@/components/ui/checkbox';
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Truck,
  Package,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
} from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

interface PaymentMethod {
  id: 'cash_on_delivery' | 'online_payment';
  name: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'cash_on_delivery',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: <Truck className="h-5 w-5" />,
    available: true,
  },
  {
    id: 'online_payment',
    name: 'Online Payment',
    description: 'Pay securely with card or digital wallet',
    icon: <CreditCard className="h-5 w-5" />,
    available: false, // Disabled for now
  },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { items, subtotal, totalItems, clearCart } = useCart();

  // State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'online_payment'>('cash_on_delivery');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Address form state
  const [addressForm, setAddressForm] = useState<CreateAddressRequest>({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    province: '',
    postalCode: '',
    isDefault: false,
  });

  // State for address selection flow
  const [selectedParsedAddress, setSelectedParsedAddress] = useState<ParsedAddress | null>(null);
  const [showUserDetailsForm, setShowUserDetailsForm] = useState(false);

  // State for edit address
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // State for delete confirmation
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load user addresses
  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  // Debug state changes
  useEffect(() => {
    console.log('State changed:', {
      showAddressForm,
      showAddressSearch,
      showUserDetailsForm,
      selectedParsedAddress: selectedParsedAddress ? 'has data' : 'null'
    });
  }, [showAddressForm, showAddressSearch, showUserDetailsForm, selectedParsedAddress]);


  const loadAddresses = async () => {
    try {
      const userAddresses = await addressApi.getUserAddresses();
      setAddresses(userAddresses);
      
      // Set default address if available
      const defaultAddress = userAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setError('Failed to load addresses');
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newAddress = await addressApi.createAddress(addressForm);
      setAddresses(prev => [...prev, newAddress]);
      setSelectedAddress(newAddress);
      setShowAddressForm(false);
      setShowAddressSearch(false);
      setAddressForm({
        fullName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        district: '',
        province: '',
        postalCode: '',
        isDefault: false,
      });
    } catch (error: any) {
      setError(error.message || 'Failed to create address');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (parsedAddress: ParsedAddress) => {
    console.log('=== Address Selection Debug ===');
    console.log('Address selected:', parsedAddress);
    console.log('Current state before update:', {
      showAddressForm,
      showAddressSearch,
      showUserDetailsForm,
      selectedParsedAddress: selectedParsedAddress ? 'has data' : 'null'
    });
    
    // Store the selected address and show user details form
    setSelectedParsedAddress(parsedAddress);
    setShowUserDetailsForm(true);
    setShowAddressSearch(false);
    setError(null);
    
    console.log('State update commands sent:');
    console.log('- setSelectedParsedAddress:', parsedAddress);
    console.log('- setShowUserDetailsForm: true');
    console.log('- setShowAddressSearch: false');
    console.log('=== End Debug ===');
  };

  const handleSaveAddressWithUserDetails = async (userDetails: { fullName: string; phoneNumber: string }) => {
    if (!selectedParsedAddress) {
      setError('No address selected');
      return;
    }

    if (!userDetails.fullName.trim() || !userDetails.phoneNumber.trim()) {
      setError('Please enter your full name and phone number');
      return;
    }

    // Basic phone number validation (Nepal format)
    const phoneRegex = /^(\+977|977)?[0-9]{10}$/;
    if (!phoneRegex.test(userDetails.phoneNumber.trim())) {
      setError('Please enter a valid phone number (10 digits)');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create address from parsed data with user details
      const newAddress = await addressApi.createAddress({
        type: 'delivery',
        fullName: userDetails.fullName.trim(),
        phoneNumber: userDetails.phoneNumber.trim(),
        addressLine1: selectedParsedAddress.addressLine1,
        addressLine2: selectedParsedAddress.addressLine2,
        city: selectedParsedAddress.city,
        district: selectedParsedAddress.district,
        province: selectedParsedAddress.province,
        postalCode: selectedParsedAddress.postalCode,
        latitude: selectedParsedAddress.latitude,
        longitude: selectedParsedAddress.longitude,
        isDefault: false,
      });

      // Add to addresses list and select it
      setAddresses(prev => [...prev, newAddress]);
      setSelectedAddress(newAddress);
      setShowUserDetailsForm(false);
      setSelectedParsedAddress(null);
      
      console.log('Address saved with user details:', newAddress);
    } catch (error: any) {
      setError(error.message || 'Failed to save address');
      console.error('Error saving address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualAddress = () => {
    setShowAddressSearch(false);
    setShowAddressForm(true);
    setSelectedParsedAddress(null);
    setShowUserDetailsForm(false);
  };

  const handleBackToAddressSearch = () => {
    setShowUserDetailsForm(false);
    setSelectedParsedAddress(null);
    setShowAddressSearch(true);
  };

  // Handle edit address
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      district: address.district,
      province: address.province,
      postalCode: address.postalCode || '',
      isDefault: address.isDefault,
    });
    setShowEditForm(true);
    setShowAddressForm(false);
    setShowAddressSearch(false);
    setShowUserDetailsForm(false);
  };

  // Handle update address
  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;

    setLoading(true);
    setError(null);

    try {
      const updatedAddress = await addressApi.updateAddress(editingAddress.id, addressForm);
      
      // Update addresses list
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id ? updatedAddress : addr
      ));
      
      // Update selected address if it was the one being edited
      if (selectedAddress?.id === editingAddress.id) {
        setSelectedAddress(updatedAddress);
      }
      
      setShowEditForm(false);
      setEditingAddress(null);
      setAddressForm({
        fullName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        district: '',
        province: '',
        postalCode: '',
        isDefault: false,
      });
      
      // Show success message
      setError(null); // Clear any existing errors
      setSuccessMessage('Address updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Update address error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update address';
      setError(errorMessage);
      setSuccessMessage(null); // Clear success message on error
    } finally {
      setLoading(false);
    }
  };

  // Handle delete address confirmation
  const handleDeleteAddressClick = (address: Address) => {
    setAddressToDelete(address);
    setShowDeleteConfirm(true);
  };

  // Handle delete address
  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    setLoading(true);
    setError(null);

    try {
      await addressApi.deleteAddress(addressToDelete.id);
      
      // Remove from addresses list
      setAddresses(prev => prev.filter(addr => addr.id !== addressToDelete.id));
      
      // Clear selected address if it was the one being deleted
      if (selectedAddress?.id === addressToDelete.id) {
        setSelectedAddress(null);
      }
      
      // Clear editing state if it was the one being deleted
      if (editingAddress?.id === addressToDelete.id) {
        setShowEditForm(false);
        setEditingAddress(null);
      }
      
      // Show success message
      setError(null); // Clear any existing errors
      setSuccessMessage('Address deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Delete address error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete address';
      setError(errorMessage);
      setSuccessMessage(null); // Clear success message on error
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setAddressToDelete(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Placing order with address:', selectedAddress);
      console.log('Payment method:', paymentMethod);
      console.log('Special instructions:', specialInstructions);

      const orderData: CreateOrderRequest = {
        addressId: selectedAddress.id,
        paymentMethod,
        specialInstructions: specialInstructions.trim() || undefined,
        deliveryFee: 50, // Fixed delivery fee for now
        discount: 0, // No discount for now
      };

      console.log('Order data being sent:', orderData);

      const order = await orderApi.createOrder(orderData);
      
      console.log('Order created successfully:', order);
      
      // Clear cart after successful order
      clearCart();
      
      setSuccess(true);
      
      // Redirect to order confirmation page after 2 seconds
      setTimeout(() => {
        navigate(`/orders/${order.id}`);
      }, 2000);
    } catch (error: any) {
      console.error('Error placing order:', error);
      setError(error.response?.data?.error || error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = 50; // Fixed delivery fee
  const total = subtotal + deliveryFee;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to proceed with checkout.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            Your cart is empty. Please add some items before checkout.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/')} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600">Redirecting to order details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Checkout Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Delivery Address
              </CardTitle>
              <CardDescription>
                Choose your delivery address or add a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddress?.id === address.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <User className="h-4 w-4 mr-2" />
                            <span className="font-medium">{address.fullName}</span>
                            {address.isDefault && (
                              <Badge variant="secondary" className="ml-2">
                                Default
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center mb-1">
                            <Phone className="h-4 w-4 mr-2" />
                            <span className="text-sm text-gray-600">{address.phoneNumber}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.district}, {address.province}
                            {address.postalCode && ` ${address.postalCode}`}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(address);
                            }}
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddressClick(address);
                            }}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showAddressForm && !showAddressSearch && !showUserDetailsForm && !showEditForm ? (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddressSearch(true)}
                    className="w-full"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search Address
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddressForm(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address Manually
                  </Button>
                </div>
              ) : showAddressSearch ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Search Address</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddressSearch(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <AddressSearch
                    onAddressSelect={handleAddressSelect}
                    onManualAddress={handleManualAddress}
                  />
                </div>
              ) : showUserDetailsForm ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Enter Your Details</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToAddressSearch}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {selectedParsedAddress && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected Address:</p>
                      <p className="text-sm text-gray-600">
                        {selectedParsedAddress.addressLine1}
                        {selectedParsedAddress.addressLine2 && `, ${selectedParsedAddress.addressLine2}`}
                        <br />
                        {selectedParsedAddress.city}, {selectedParsedAddress.district}, {selectedParsedAddress.province}
                      </p>
                    </div>
                  )}

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSaveAddressWithUserDetails({
                      fullName: formData.get('fullName') as string,
                      phoneNumber: formData.get('phoneNumber') as string,
                    });
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          placeholder="e.g., 9841234567"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter 10-digit phone number (e.g., 9841234567)
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBackToAddressSearch}
                      >
                        Back to Search
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowUserDetailsForm(false);
                          setSelectedParsedAddress(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              ) : showEditForm ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Edit Address</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditingAddress(null);
                        setAddressForm({
                          fullName: '',
                          phoneNumber: '',
                          addressLine1: '',
                          addressLine2: '',
                          city: '',
                          district: '',
                          province: '',
                          postalCode: '',
                          isDefault: false,
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <form onSubmit={handleUpdateAddress} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="editFullName">Full Name *</Label>
                        <Input
                          id="editFullName"
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="editPhoneNumber">Phone Number *</Label>
                        <Input
                          id="editPhoneNumber"
                          value={addressForm.phoneNumber}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="editAddressLine1">Address Line 1 *</Label>
                      <Input
                        id="editAddressLine1"
                        value={addressForm.addressLine1}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, addressLine1: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="editAddressLine2">Address Line 2</Label>
                      <Input
                        id="editAddressLine2"
                        value={addressForm.addressLine2}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, addressLine2: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="editCity">City *</Label>
                        <Input
                          id="editCity"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="editDistrict">District *</Label>
                        <Input
                          id="editDistrict"
                          value={addressForm.district}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, district: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="editProvince">Province *</Label>
                        <Input
                          id="editProvince"
                          value={addressForm.province}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, province: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="editPostalCode">Postal Code</Label>
                      <Input
                        id="editPostalCode"
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="editIsDefault"
                        checked={addressForm.isDefault}
                        onCheckedChange={(checked) => setAddressForm(prev => ({ ...prev, isDefault: checked as boolean }))}
                      />
                      <Label htmlFor="editIsDefault">Set as default address</Label>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Update Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowEditForm(false);
                          setEditingAddress(null);
                          setAddressForm({
                            fullName: '',
                            phoneNumber: '',
                            addressLine1: '',
                            addressLine2: '',
                            city: '',
                            district: '',
                            province: '',
                            postalCode: '',
                            isDefault: false,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        value={addressForm.phoneNumber}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={addressForm.addressLine1}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, addressLine1: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={addressForm.addressLine2}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, addressLine2: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">District *</Label>
                      <Input
                        id="district"
                        value={addressForm.district}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, district: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province *</Label>
                      <Input
                        id="province"
                        value={addressForm.province}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, province: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isDefault"
                      checked={addressForm.isDefault}
                      onCheckedChange={(checked) => setAddressForm(prev => ({ ...prev, isDefault: checked as boolean }))}
                    />
                    <Label htmlFor="isDefault">Set as default address</Label>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save Address
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </CardTitle>
              <CardDescription>
                Choose how you want to pay for your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 p-4 border rounded-lg ${
                      !method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'
                    } ${paymentMethod === method.id ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => method.available && setPaymentMethod(method.id)}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      disabled={!method.available}
                      onChange={() => method.available && setPaymentMethod(method.id)}
                      className="h-4 w-4 text-primary"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      {method.icon}
                      <div className="flex-1">
                        <Label htmlFor={method.id} className="font-medium">
                          {method.name}
                        </Label>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    {!method.available && (
                      <Badge variant="secondary">Coming Soon</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
              <CardDescription>
                Add any special instructions for delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Leave at front door, Call before delivery, etc."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.product.profileImgUrl ? (
                        <img
                          src={item.product.profileImgUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        ₹{parseFloat(item.product.discountPrice || item.product.price) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <LiquidButton
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
                className="w-full"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Place Order - ₹{total}
              </LiquidButton>

              {!selectedAddress && (
                <p className="text-sm text-red-600 text-center">
                  Please select a delivery address
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && addressToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trash2 className="h-5 w-5 mr-2 text-red-500" />
                Delete Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the address for <strong>{addressToDelete.fullName}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAddress}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setAddressToDelete(null);
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
