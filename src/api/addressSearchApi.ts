import axios from 'axios';

export interface AddressSearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city_district?: string;
    city?: string;
    county?: string;
    state?: string;
    'ISO3166-2-lvl4'?: string;
    postcode?: string;
    country: string;
    country_code: string;
  };
  boundingbox: string[];
}

export interface ParsedAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

class AddressSearchService {
  private baseUrl = 'https://nominatim.openstreetmap.org';
  private searchTimeout: NodeJS.Timeout | null = null;

  // Search addresses with debouncing
  async searchAddresses(query: string, countryCode: string = 'np'): Promise<AddressSearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          format: 'json',
          countrycodes: countryCode,
          q: query,
          limit: 10,
          addressdetails: 1,
        },
      });

      return response.data || [];
    } catch (error) {
      console.error('Error searching addresses:', error);
      return [];
    }
  }

  // Debounced search function
  debouncedSearch(
    query: string,
    callback: (results: AddressSearchResult[]) => void,
    delay: number = 500
  ): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(async () => {
      const results = await this.searchAddresses(query);
      callback(results);
    }, delay);
  }

  // Parse OpenStreetMap result to our address format
  parseAddressResult(result: AddressSearchResult, fullName: string, phoneNumber: string): ParsedAddress {
    const address = result.address;
    
    // Build address line 1
    let addressLine1 = '';
    if (address.road) {
      addressLine1 += address.road;
    }
    if (address.neighbourhood) {
      addressLine1 += addressLine1 ? `, ${address.neighbourhood}` : address.neighbourhood;
    }

    // Build address line 2
    let addressLine2 = '';
    if (address.suburb) {
      addressLine2 += address.suburb;
    }
    if (address.city_district) {
      addressLine2 += addressLine2 ? `, ${address.city_district}` : address.city_district;
    }

    return {
      fullName,
      phoneNumber,
      addressLine1: addressLine1 || result.name || 'Address',
      addressLine2: addressLine2 || undefined,
      city: address.city || address.county || 'Unknown City',
      district: address.county || address.city || 'Unknown District',
      province: address.state || 'Unknown Province',
      postalCode: address.postcode || undefined,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };
  }

  // Get current location using browser geolocation
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(latitude: number, longitude: number): Promise<AddressSearchResult | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/reverse`, {
        params: {
          format: 'json',
          lat: latitude,
          lon: longitude,
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'AusadhiSewa/1.0',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }
}

export const addressSearchService = new AddressSearchService();
