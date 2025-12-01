import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Car, 
  ArrowRight,
  ShoppingCart,
  Tag
} from "lucide-react";
import { Link } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: carCounts = {} as any } = useQuery({
    queryKey: ['/api/cars/counts'],
    retry: false,
  });

  const { data: dealerships = [] } = useQuery<any[]>({
    queryKey: ['/api/dealerships'],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName || 'Dealer'}
          </h1>
          <p className="text-slate-400">Here's an overview of your dealership activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Vehicles</p>
                  <p className="text-3xl font-bold">{carCounts?.total || 0}</p>
                </div>
                <Car className="w-10 h-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Available</p>
                  <p className="text-3xl font-bold text-green-400">{carCounts?.available || 0}</p>
                </div>
                <Package className="w-10 h-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Sold</p>
                  <p className="text-3xl font-bold text-cyan-400">{carCounts?.sold || 0}</p>
                </div>
                <DollarSign className="w-10 h-10 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Dealerships</p>
                  <p className="text-3xl font-bold text-purple-400">{dealerships.length}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-400" />
                List as Available Wholesale
              </CardTitle>
              <CardDescription>Mark vehicles available for wholesale buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">
                Make your inventory visible to wholesale buyers and dealers looking to purchase in bulk.
              </p>
              <Link href="/inventory">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Go to Inventory
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                Want to Buy More Like These
              </CardTitle>
              <CardDescription>Find similar vehicles to add to your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">
                Search for vehicles matching your inventory profile and expand your selection.
              </p>
              <Link href="/inventory">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Browse Inventory
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest inventory changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-400">
              <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start by adding vehicles to your inventory</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
