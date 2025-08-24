import React, { useState, useEffect, useRef } from 'react';
import { addressSearchService, type AddressSearchResult, type ParsedAddress } from '../../api/addressSearchApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search,
  MapPin,
  Navigation,
  Loader2,
  CheckCircle,
  X,
  Plus,
  Edit,
} from 'lucide-react';

interface AddressSearchProps {
  onAddressSelect: (address: ParsedAddress) => void;
  onManualAddress: () => void;
}

export default function AddressSearch({ 
  onAddressSelect, 
  onManualAddress
}: AddressSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    addressSearchService.debouncedSearch(searchQuery, (results) => {
      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    }, 500);
  }, [searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddressSelect = (result: AddressSearchResult) => {
    const parsedAddress = addressSearchService.parseAddressResult(result, '', '');
    onAddressSelect(parsedAddress);
    setSearchQuery(result.display_name);
    setShowResults(false);
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    setError(null);

    try {
      const location = await addressSearchService.getCurrentLocation();
      
      if (location) {
        const reverseResult = await addressSearchService.reverseGeocode(
          location.latitude,
          location.longitude
        );

        if (reverseResult) {
          const parsedAddress = addressSearchService.parseAddressResult(
            reverseResult,
            '',
            ''
          );
          onAddressSelect(parsedAddress);
          setSearchQuery(reverseResult.display_name);
        } else {
          setError('Could not get address for current location');
        }
      } else {
        setError('Could not get current location. Please enable location access.');
      }
    } catch (error) {
      setError('Error getting current location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setError(null);
  };

  return (
    <div className="space-y-4" ref={searchRef}>
      <div>
        <Label htmlFor="address-search">Search Address</Label>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="address-search"
              type="text"
              placeholder="Search for your address (e.g., Pashupati Marga, Kathmandu)"
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Current Location Button */}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
          className="flex items-center space-x-2"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          <span>{isGettingLocation ? 'Getting Location...' : 'Use Current Location'}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onManualAddress}
          className="flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Enter Manually</span>
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <Card className="absolute z-50 w-full max-h-64 overflow-y-auto">
          <CardContent className="p-0">
            <div className="divide-y">
              {searchResults.map((result) => (
                <div
                  key={result.place_id}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleAddressSelect(result)}
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {result.name || result.display_name.split(',')[0]}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {result.display_name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {result.type}
                        </Badge>
                        {result.address.postcode && (
                          <Badge variant="outline" className="text-xs">
                            {result.address.postcode}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showResults && searchResults.length === 0 && searchQuery.trim().length >= 3 && !isSearching && (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-600">No addresses found for "{searchQuery}"</p>
            <p className="text-sm text-gray-500 mt-1">
              Try a different search term or enter your address manually
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      {!searchQuery && (
        <div className="text-sm text-gray-500 space-y-1">
          <p>💡 <strong>Search tips:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Enter street name, area, or landmark</li>
            <li>Include city name for better results</li>
            <li>Use current location for automatic detection</li>
            <li>Or enter your address manually</li>
          </ul>
        </div>
      )}
    </div>
  );
}
