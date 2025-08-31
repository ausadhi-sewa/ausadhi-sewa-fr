import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../utils/hooks/useCart';
import { useAppSelector } from '../utils/hooks';
import { addressApi, type Address, type CreateAddressRequest } from '../api/addressApi';
import { orderApi, type CreateOrderRequest } from '../api/orderApi';
import AddressSearch from '../components/checkout/AddressSearch';
import { AddressConfirmationStep } from '../components/checkout/AddressConfirmationStep';
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
  Navigation,
  Mail,
  Tag,
  Shield,
} from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { toast } from 'sonner';

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

// Step enum for the checkout flow
enum CheckoutStep {
  USER_DETAILS = 'user_details',
  ADDRESS_SEARCH = 'address_search',
  ADDRESS_CONFIRM = 'address_confirm',
  PAYMENT = 'payment',
  REVIEW = 'review',
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { items, subtotal, totalItems, clearCart } = useCart();

  // Checkout flow state
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.USER_DETAILS);
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
  });
  const [selectedParsedAddress, setSelectedParsedAddress] = useState<ParsedAddress | null>(null);
  const [finalAddress, setFinalAddress] = useState<CreateAddressRequest | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Existing state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'online_payment'>('cash_on_delivery');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load user addresses
  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

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
    }
  };

  // Handle user details submission
  const handleUserDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userDetails.fullName.trim() || !userDetails.phoneNumber.trim()) {
      toast.error('Please enter your full name and phone number');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^(\+977|977)?[0-9]{10}$/;
    if (!phoneRegex.test(userDetails.phoneNumber.trim())) {
      toast.error('Please enter a valid phone number (10 digits)');
      return;
    }

    setCurrentStep(CheckoutStep.ADDRESS_SEARCH);
  };

  // Handle address selection from search
  const handleAddressSelect = (parsedAddress: ParsedAddress) => {
    setSelectedParsedAddress(parsedAddress);
    setCurrentStep(CheckoutStep.ADDRESS_CONFIRM);
  };

  // Handle address confirmation and finalization
  const handleAddressConfirm = (confirmedAddress: CreateAddressRequest) => {
    setFinalAddress(confirmedAddress);
    setCurrentStep(CheckoutStep.PAYMENT);
  };

  // Handle discount code application
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    setIsApplyingDiscount(true);
    try {
      // Simulate discount application (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, apply a 10% discount
      const discount = subtotal * 0.1;
      setDiscountAmount(discount);
      toast.success(`Discount applied! You saved ₹${discount.toFixed(2)}`);
    } catch (error) {
      toast.error('Invalid discount code');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!finalAddress) {
      toast.error('Please complete address setup');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create address first
      const newAddress = await addressApi.createAddress({
        ...finalAddress,
        type: 'delivery',
        isDefault: false,
      });

      const orderData: CreateOrderRequest = {
        addressId: newAddress.id,
        paymentMethod,
        specialInstructions: specialInstructions.trim() || undefined,
        deliveryFee: 50,
        discount: discountAmount,
      };

      const order = await orderApi.createOrder(orderData);
      
      clearCart();
      setSuccess(true);
      
      toast.success('Order placed successfully!');
      
      setTimeout(() => {
        navigate(`/orders/${order.id}`);
      }, 2000);
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = 50;
  const total = subtotal + deliveryFee - discountAmount;

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
      {/* Header */}
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

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {Object.values(CheckoutStep).map((step, index) => {
            const isActive = currentStep === step;
            const isCompleted = Object.values(CheckoutStep).indexOf(currentStep) > index;
            
            return (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isActive 
                    ? 'border-primary bg-primary text-white' 
                    : isCompleted 
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < Object.values(CheckoutStep).length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-gray-600">
            {currentStep === CheckoutStep.USER_DETAILS && 'Contact Information'}
            {currentStep === CheckoutStep.ADDRESS_SEARCH && 'Address Search'}
            {currentStep === CheckoutStep.ADDRESS_CONFIRM && 'Address Confirmation'}
            {currentStep === CheckoutStep.PAYMENT && 'Payment Method'}
            {currentStep === CheckoutStep.REVIEW && 'Review Order'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Checkout Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: User Details */}
          {currentStep === CheckoutStep.USER_DETAILS && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Contact & Delivery
                </CardTitle>
                <CardDescription>
                  Enter your contact information to proceed with checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserDetailsSubmit} className="space-y-6">
                  {/* Email Section */}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={userDetails.email}
                      onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox id="emailUpdates" />
                      <Label htmlFor="emailUpdates" className="text-sm">
                        Email me with updates and offers
                      </Label>
                    </div>
                  </div>

                  {/* Name Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First name *</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={userDetails.fullName.split(' ')[0] || ''}
                        onChange={(e) => {
                          const firstName = e.target.value;
                          const lastName = userDetails.fullName.split(' ').slice(1).join(' ') || '';
                          setUserDetails(prev => ({ 
                            ...prev, 
                            fullName: `${firstName} ${lastName}`.trim() 
                          }));
                        }}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={userDetails.fullName.split(' ').slice(1).join(' ') || ''}
                        onChange={(e) => {
                          const firstName = userDetails.fullName.split(' ')[0] || '';
                          const lastName = e.target.value;
                          setUserDetails(prev => ({ 
                            ...prev, 
                            fullName: `${firstName} ${lastName}`.trim() 
                          }));
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Section */}
                  <div>
                    <Label htmlFor="phoneNumber">Phone *</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="+91 98765 43210"
                      value={userDetails.phoneNumber}
                      onChange={(e) => setUserDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Continue to Address
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Address Search */}
          {currentStep === CheckoutStep.ADDRESS_SEARCH && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Address
                </CardTitle>
                <CardDescription>
                  Search for your address or use current location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddressSearch
                  onAddressSelect={handleAddressSelect}
                  onManualAddress={() => setCurrentStep(CheckoutStep.ADDRESS_CONFIRM)}
                />
                
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(CheckoutStep.USER_DETAILS)}
                    className="mr-2"
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Address Confirmation */}
          {currentStep === CheckoutStep.ADDRESS_CONFIRM && (
            <AddressConfirmationStep
              selectedAddress={selectedParsedAddress}
              userDetails={userDetails}
              onConfirm={handleAddressConfirm}
              onBack={() => setCurrentStep(CheckoutStep.ADDRESS_SEARCH)}
            />
          )}

          {/* Step 4: Payment Method */}
          {currentStep === CheckoutStep.PAYMENT && (
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

                {/* Special Instructions */}
                <div className="mt-6">
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    placeholder="e.g., Leave at front door, Call before delivery, etc."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(CheckoutStep.ADDRESS_CONFIRM)}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(CheckoutStep.REVIEW)}
                    className="flex-1"
                  >
                    Continue to Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Review Order */}
          {currentStep === CheckoutStep.REVIEW && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
                <CardDescription>
                  Please review your order details before placing it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Contact Information */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <p className="text-sm text-gray-600">{userDetails.fullName}</p>
                    <p className="text-sm text-gray-600">{userDetails.phoneNumber}</p>
                    {userDetails.email && <p className="text-sm text-gray-600">{userDetails.email}</p>}
                  </div>

                  {/* Delivery Address */}
                  {finalAddress && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Delivery Address</h4>
                      <p className="text-sm text-gray-600">{finalAddress.fullName}</p>
                      <p className="text-sm text-gray-600">{finalAddress.phoneNumber}</p>
                      <p className="text-sm text-gray-600">{finalAddress.addressLine1}</p>
                      {finalAddress.addressLine2 && <p className="text-sm text-gray-600">{finalAddress.addressLine2}</p>}
                      <p className="text-sm text-gray-600">
                        {finalAddress.city}, {finalAddress.district}, {finalAddress.province}
                        {finalAddress.postalCode && ` ${finalAddress.postalCode}`}
                      </p>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Payment Method</h4>
                    <p className="text-sm text-gray-600">
                      {paymentMethods.find(m => m.id === paymentMethod)?.name}
                    </p>
                  </div>

                  {specialInstructions && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Special Instructions</h4>
                      <p className="text-sm text-gray-600">{specialInstructions}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(CheckoutStep.PAYMENT)}
                  >
                    Back
                  </Button>
                  <LiquidButton
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Place Order - ₹{total.toFixed(2)}
                  </LiquidButton>
                </div>
              </CardContent>
            </Card>
          )}
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
                        ₹{(parseFloat(item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Discount Code */}
              <div className="space-y-2">
                <Label htmlFor="discountCode">Discount Code</Label>
                <div className="flex space-x-2">
                  <Input
                    id="discountCode"
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyDiscount}
                    disabled={isApplyingDiscount || !discountCode.trim()}
                    className="px-4"
                  >
                    {isApplyingDiscount ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">INR</div>
                    <div>₹{total.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
