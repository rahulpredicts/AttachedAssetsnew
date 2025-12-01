import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  MapPin, 
  Flag,
  ArrowRight,
  Check,
  Clock
} from "lucide-react";

export default function ReferencePage() {
  const [selectedCountry, setSelectedCountry] = useState<'canada' | 'usa' | null>('canada');

  const countries = [
    { 
      id: 'canada', 
      name: 'Canada', 
      status: 'active',
      description: 'Full market data and pricing available',
      features: ['Provincial pricing', 'Dealer network', 'Wholesale market', 'Retail analysis']
    },
    { 
      id: 'usa', 
      name: 'United States', 
      status: 'coming_soon',
      description: 'Similar to Signal/Pulse - Coming Soon',
      features: ['State-by-state pricing', 'Auction data', 'Market trends', 'Dealer connections']
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Reference Markets</h1>
          <p className="text-slate-400">Select a country to access market data and pricing tools</p>
        </div>

        {/* Country Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {countries.map((country) => (
            <Card 
              key={country.id}
              className={`bg-slate-800 border-2 cursor-pointer transition-all ${
                selectedCountry === country.id 
                  ? 'border-blue-500' 
                  : 'border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => country.status === 'active' && setSelectedCountry(country.id as 'canada' | 'usa')}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Flag className={`w-5 h-5 ${country.id === 'canada' ? 'text-red-400' : 'text-blue-400'}`} />
                    {country.name}
                  </CardTitle>
                  <Badge className={country.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'}>
                    {country.status === 'active' ? (
                      <><Check className="w-3 h-3 mr-1" /> Active</>
                    ) : (
                      <><Clock className="w-3 h-3 mr-1" /> Coming Soon</>
                    )}
                  </Badge>
                </div>
                <CardDescription>{country.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {country.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-400 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${country.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Country Details */}
        {selectedCountry === 'canada' && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Canadian Market Reference
              </CardTitle>
              <CardDescription>Access Canadian automotive market data and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Available Regions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick'].map((province) => (
                      <div key={province} className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg text-sm">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300">{province}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Market Participants</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-900 rounded-lg">
                      <p className="font-medium text-blue-400">Retail Dealers</p>
                      <p className="text-sm text-slate-400">All signed up dealers with contact information</p>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-lg">
                      <p className="font-medium text-green-400">Wholesalers</p>
                      <p className="text-sm text-slate-400">Wholesale buyers across provinces</p>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-lg">
                      <p className="font-medium text-purple-400">Transporters</p>
                      <p className="text-sm text-slate-400">Vehicle transport and shipping services</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-700">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Access Canadian Market Data
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedCountry === 'usa' && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                US Market Reference
              </CardTitle>
              <CardDescription>Similar to Signal/Pulse - Coming Soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-slate-400 mb-6">
                  US market reference with Signal/Pulse-like features is under development.
                </p>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  Get Notified When Available
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
