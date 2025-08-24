import React, { useState } from 'react';
import { addressSearchService, type AddressSearchResult } from '../../api/addressSearchApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Loader2 } from 'lucide-react';

export default function AddressSearchDemo() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResults = await addressSearchService.searchAddresses(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Address Search Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Search for address (e.g., Pashupati Marga, Kathmandu)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Search Results:</h3>
            {results.map((result) => (
              <Card key={result.place_id} className="p-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{result.name || result.display_name.split(',')[0]}</p>
                    <p className="text-sm text-gray-600">{result.display_name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">{result.type}</Badge>
                      {result.address.postcode && (
                        <Badge variant="outline">{result.address.postcode}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Lat: {result.lat}, Lon: {result.lon}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
