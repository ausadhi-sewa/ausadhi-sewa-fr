import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import type { ParsedAddress } from '../../api/addressSearchApi';
import type { CreateAddressRequest } from '../../api/addressApi';

interface AddressConfirmationStepProps {
  selectedAddress: ParsedAddress | null;
  userDetails: { fullName: string; phoneNumber: string; email: string };
  onConfirm: (address: CreateAddressRequest) => void;
  onBack: () => void;
}

export function AddressConfirmationStep({ 
  selectedAddress, 
  userDetails, 
  onConfirm, 
  onBack 
}: AddressConfirmationStepProps) {
  const [addressForm, setAddressForm] = useState<CreateAddressRequest>({
    fullName: userDetails.fullName,
    phoneNumber: userDetails.phoneNumber,
    addressLine1: selectedAddress?.addressLine1 || '',
    addressLine2: selectedAddress?.addressLine2 || '',
    city: selectedAddress?.city || '',
    district: selectedAddress?.district || '',
    province: selectedAddress?.province || '',
    postalCode: selectedAddress?.postalCode || '',
    isDefault: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!addressForm.addressLine1.trim() || !addressForm.city.trim() || 
        !addressForm.district.trim() || !addressForm.province.trim()) {
      toast.error('Please fill in all required address fields');
      return;
    }

    onConfirm(addressForm);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Confirm Address
        </CardTitle>
        <CardDescription>
          Review and edit your address details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Line 1 - Required */}
          <div>
            <Label htmlFor="addressLine1">Address *</Label>
            <Input
              id="addressLine1"
              placeholder="Street address"
              value={addressForm.addressLine1}
              onChange={(e) => setAddressForm(prev => ({ ...prev, addressLine1: e.target.value }))}
              required
              className="border-green-300 focus:border-green-500"
            />
          </div>

          {/* Address Line 2 - Optional */}
          <div>
            <Label htmlFor="addressLine2">Apartment, suite, etc. (optional)</Label>
            <Input
              id="addressLine2"
              placeholder="Apartment, suite, etc. (optional)"
              value={addressForm.addressLine2}
              onChange={(e) => setAddressForm(prev => ({ ...prev, addressLine2: e.target.value }))}
            />
          </div>

          {/* City, State, PIN Code */}
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
              <Label htmlFor="district">State *</Label>
              <Input
                id="district"
                value={addressForm.district}
                onChange={(e) => setAddressForm(prev => ({ ...prev, district: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="postalCode">PIN code</Label>
              <Input
                id="postalCode"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
              />
            </div>
          </div>

          {/* Set as Default */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={addressForm.isDefault}
              onCheckedChange={(checked) => setAddressForm(prev => ({ ...prev, isDefault: checked as boolean }))}
            />
            <Label htmlFor="isDefault">Save this information for next time</Label>
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
