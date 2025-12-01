import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  ArrowRight,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CanadianRetailPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Canadian Retail</h1>
          <p className="text-slate-400">Market analysis and retail pricing for Canadian provinces</p>
        </div>

        {/* Search */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  placeholder="Search by make, model, or VIN..." 
                  className="pl-10 bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Search Market
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Province Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Ontario</p>
                  <p className="text-2xl font-bold text-green-400">Active</p>
                </div>
                <MapPin className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Quebec</p>
                  <p className="text-2xl font-bold text-blue-400">Active</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">British Columbia</p>
                  <p className="text-2xl font-bold text-purple-400">Active</p>
                </div>
                <MapPin className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Alberta</p>
                  <p className="text-2xl font-bold text-cyan-400">Active</p>
                </div>
                <MapPin className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Market Trends
              </CardTitle>
              <CardDescription>Canadian automotive market insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg">
                  <span className="text-slate-300">Average Retail Price</span>
                  <span className="font-bold text-green-400">$32,450</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg">
                  <span className="text-slate-300">Average Days on Market</span>
                  <span className="font-bold text-blue-400">45 days</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg">
                  <span className="text-slate-300">Price Trend (30d)</span>
                  <span className="font-bold text-green-400">+2.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Top Selling Makes
              </CardTitle>
              <CardDescription>Most popular brands in Canada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Hyundai'].map((make, index) => (
                  <div key={make} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-slate-300">{make}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pulse-like Feature Placeholder */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              Retail Pricing Tool
            </CardTitle>
            <CardDescription>Get accurate retail prices based on Canadian market data (Similar to Pulse)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate-400">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Coming Soon</p>
              <p className="text-sm">Advanced market analysis and pricing recommendations</p>
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                Get Notified
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
