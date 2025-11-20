import { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Car as CarIcon,
  Building2,
  MapPin,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Fuel,
  Gauge,
  Settings2,
  Palette,
  CheckCircle2,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dealership, Car } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useInventory } from "@/lib/inventory-context";
import { useLocation } from "wouter";

export default function Inventory() {
  const { dealerships, addDealership, updateDealership, deleteDealership, updateCar, deleteCar, toggleSoldStatus } = useInventory();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  
  const [selectedDealership, setSelectedDealership] = useState<Dealership | null>(null);
  const [showAddDealership, setShowAddDealership] = useState(false);
  const [editingDealership, setEditingDealership] = useState<Dealership | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Advanced Filters
  const [filterMake, setFilterMake] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterVin, setFilterVin] = useState("");
  const [filterVinStart, setFilterVinStart] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [filterTrim, setFilterTrim] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [filterKmsMin, setFilterKmsMin] = useState("");
  const [filterKmsMax, setFilterKmsMax] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  
  // New Filters
  const [filterTransmission, setFilterTransmission] = useState("");
  const [filterDrivetrain, setFilterDrivetrain] = useState("");
  const [filterFuelType, setFilterFuelType] = useState("");
  const [filterBodyType, setFilterBodyType] = useState("");
  const [filterEngineCylinders, setFilterEngineCylinders] = useState("");

  const [sortBy, setSortBy] = useState("addedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Form states
  const [newDealership, setNewDealership] = useState<Partial<Dealership>>({
    name: "",
    location: "",
    province: "",
    address: "",
    postalCode: "",
    phone: "",
  });

  const handleAddDealership = () => {
    if (!newDealership.name || !newDealership.address) {
        toast({ title: "Error", description: "Required fields missing", variant: "destructive" });
        return;
    }
    addDealership({
        ...newDealership as Dealership,
        id: Math.random().toString(36).substr(2, 9),
        inventory: []
    });
    setNewDealership({ name: "", location: "", province: "", address: "", postalCode: "", phone: "" });
    setShowAddDealership(false);
  };

  const handleUpdateDealership = () => {
    if (!editingDealership) return;
    updateDealership(editingDealership);
    if (selectedDealership?.id === editingDealership.id) {
        setSelectedDealership(editingDealership);
    }
    setEditingDealership(null);
  };

  const handleDeleteDealership = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!window.confirm("Delete this dealership and all its cars?")) return;
      deleteDealership(id);
      if (selectedDealership?.id === id) setSelectedDealership(null);
  };

  const handleUpdateCar = () => {
      if (!editingCar) return;
      updateCar(editingCar);
      setEditingCar(null);
  };

  const handleDeleteCar = (dealershipId: string, carId: string) => {
      if (!window.confirm("Delete this car?")) return;
      deleteCar(dealershipId, carId);
  };


  const getAllCars = () => {
    return dealerships.flatMap(d =>
      d.inventory.map(car => ({
        ...car,
        dealershipName: d.name,
        dealershipId: d.id,
        dealershipLocation: d.location,
        dealershipProvince: d.province
      }))
    );
  };

  const getFilteredCars = () => {
    let cars = getAllCars();

    if (selectedDealership) {
      cars = cars.filter(c => c.dealershipId === selectedDealership.id);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      cars = cars.filter(car =>
        car.vin?.toLowerCase().includes(term) ||
        car.make?.toLowerCase().includes(term) ||
        car.model?.toLowerCase().includes(term) ||
        car.color?.toLowerCase().includes(term) ||
        car.dealershipName?.toLowerCase().includes(term) ||
        // @ts-ignore
        car.dealershipProvince?.toLowerCase().includes(term) ||
        car.transmission?.toLowerCase().includes(term) || 
        car.year?.toString().includes(term) ||
        car.trim?.toLowerCase().includes(term)
      );
    }

    if (filterMake) cars = cars.filter(c => c.make?.toLowerCase().includes(filterMake.toLowerCase()));
    if (filterModel) cars = cars.filter(c => c.model?.toLowerCase().includes(filterModel.toLowerCase()));
    if (filterVin) cars = cars.filter(c => c.vin?.toLowerCase().includes(filterVin.toLowerCase()));
    if (filterVinStart) cars = cars.filter(c => c.vin?.toUpperCase().startsWith(filterVinStart.toUpperCase()));
    if (filterColor) cars = cars.filter(c => c.color?.toLowerCase().includes(filterColor.toLowerCase()));
    if (filterTrim) cars = cars.filter(c => c.trim?.toLowerCase().includes(filterTrim.toLowerCase()));
    if (filterYear) cars = cars.filter(c => c.year?.toString().includes(filterYear));
    if (filterPriceMin) cars = cars.filter(c => parseFloat(c.price || "0") >= parseFloat(filterPriceMin));
    if (filterPriceMax) cars = cars.filter(c => parseFloat(c.price || "0") <= parseFloat(filterPriceMax));
    if (filterKmsMin) cars = cars.filter(c => parseFloat(c.kilometers || "0") >= parseFloat(filterKmsMin));
    if (filterKmsMax) cars = cars.filter(c => parseFloat(c.kilometers || "0") <= parseFloat(filterKmsMax));
    // @ts-ignore
    if (filterProvince) cars = cars.filter(c => c.dealershipProvince?.toLowerCase().includes(filterProvince.toLowerCase()));

    // New Filters
    if (filterTransmission && filterTransmission !== 'all') cars = cars.filter(c => c.transmission?.toLowerCase() === filterTransmission.toLowerCase());
    if (filterDrivetrain && filterDrivetrain !== 'all') cars = cars.filter(c => c.drivetrain?.toLowerCase() === filterDrivetrain.toLowerCase());
    if (filterFuelType && filterFuelType !== 'all') cars = cars.filter(c => c.fuelType?.toLowerCase() === filterFuelType.toLowerCase());
    if (filterBodyType && filterBodyType !== 'all') cars = cars.filter(c => c.bodyType?.toLowerCase() === filterBodyType.toLowerCase());
    if (filterEngineCylinders && filterEngineCylinders !== 'all') cars = cars.filter(c => c.engineCylinders === filterEngineCylinders);


    cars.sort((a, b) => {
        // @ts-ignore
      let aVal = a[sortBy];
       // @ts-ignore
      let bVal = b[sortBy];

      if (sortBy === "price" || sortBy === "kilometers") {
        aVal = parseFloat(aVal || "0");
        bVal = parseFloat(bVal || "0");
      } else if (sortBy === "year") {
        aVal = parseInt(aVal || "0");
        bVal = parseInt(bVal || "0");
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return cars;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterMake("");
    setFilterModel("");
    setFilterVin("");
    setFilterVinStart("");
    setFilterColor("");
    setFilterTrim("");
    setFilterYear("");
    setFilterPriceMin("");
    setFilterPriceMax("");
    setFilterKmsMin("");
    setFilterKmsMax("");
    setFilterProvince("");
    setFilterTransmission("");
    setFilterDrivetrain("");
    setFilterFuelType("");
    setFilterBodyType("");
    setFilterEngineCylinders("");
  };

  const totalInventory = dealerships.reduce((sum, d) => sum + d.inventory.length, 0);
  const filteredCars = getFilteredCars();

  return (
    <div className="p-4 md:p-8 font-sans animate-in fade-in duration-500">
      <div className="max-w-[1800px] mx-auto space-y-8">
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
              Inventory
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm font-normal bg-gray-200 text-gray-700">
                {filteredCars.length} Vehicles
              </Badge>
            </h1>
            <p className="text-gray-500 mt-2 text-lg font-medium">
              Manage {dealerships.length} dealerships and {totalInventory} total cars across your network.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowAddDealership(true)} variant="outline" size="lg" className="rounded-full h-12 px-6 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all">
              <Building2 className="w-4 h-4 mr-2" />
              New Dealership
            </Button>
            <Button onClick={() => setLocation("/upload")} size="lg" className="rounded-full h-12 px-6 shadow-lg hover:shadow-xl transition-all bg-black hover:bg-gray-900">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>

        {/* Modern Search Bar */}
        <div className="relative max-w-2xl">
          <div className="relative group flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-primary" />
                <Input
                placeholder="Search by VIN, make, model, or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg bg-white border-0 shadow-sm rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all hover:shadow-md"
                />
            </div>
            <div className="flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-14 px-4 rounded-2xl border-0 shadow-sm bg-white hover:bg-gray-50">
                            {sortBy === 'price' ? (
                                sortOrder === 'asc' ? <ArrowUpWideNarrow className="w-5 h-5 mr-2" /> : <ArrowDownWideNarrow className="w-5 h-5 mr-2" />
                            ) : (
                                <ChevronDown className="w-5 h-5 mr-2" />
                            )}
                            Sort
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => { setSortBy('price'); setSortOrder('desc'); }}>
                            Price: High to Low
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSortBy('price'); setSortOrder('asc'); }}>
                            Price: Low to High
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSortBy('year'); setSortOrder('desc'); }}>
                            Year: Newest
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSortBy('year'); setSortOrder('asc'); }}>
                            Year: Oldest
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSortBy('kilometers'); setSortOrder('asc'); }}>
                            Mileage: Low to High
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className="h-14 px-4 rounded-2xl border-0 shadow-sm bg-white hover:bg-gray-50">
                            <SlidersHorizontal className="w-5 h-5 mr-2" />
                            Filters
                        </Button>
                    </CollapsibleTrigger>
                </Collapsible>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        <Collapsible open={showAdvancedFilters}>
            <CollapsibleContent className="animate-in slide-in-from-top-5 fade-in duration-200 pt-4">
                <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                            {/* Standard Text Filters */}
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Make</Label>
                                <Input placeholder="Any Make" value={filterMake} onChange={(e) => setFilterMake(e.target.value)} className="h-9" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Model</Label>
                                <Input placeholder="Any Model" value={filterModel} onChange={(e) => setFilterModel(e.target.value)} className="h-9" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Year</Label>
                                <Input placeholder="Any Year" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="h-9" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">VIN Contains</Label>
                                <Input placeholder="Search VIN" value={filterVin} onChange={(e) => setFilterVin(e.target.value)} className="h-9" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">VIN Starts With</Label>
                                <Input placeholder="e.g. 1, 2, J" value={filterVinStart} onChange={(e) => setFilterVinStart(e.target.value)} className="h-9" maxLength={3} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Trim</Label>
                                <Input placeholder="Any Trim" value={filterTrim} onChange={(e) => setFilterTrim(e.target.value)} className="h-9" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Province</Label>
                                <Input placeholder="Any Prov" value={filterProvince} onChange={(e) => setFilterProvince(e.target.value)} className="h-9" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Color</Label>
                                <Input placeholder="Any Color" value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="h-9" />
                            </div>
                        </div>

                        {/* Dropdown Filters */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 pt-4 border-t border-gray-100">
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Transmission</Label>
                                <Select value={filterTransmission} onValueChange={setFilterTransmission}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="All" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Transmissions</SelectItem>
                                        <SelectItem value="automatic">Automatic</SelectItem>
                                        <SelectItem value="manual">Manual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Drivetrain</Label>
                                <Select value={filterDrivetrain} onValueChange={setFilterDrivetrain}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="All" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Drivetrains</SelectItem>
                                        <SelectItem value="fwd">FWD</SelectItem>
                                        <SelectItem value="rwd">RWD</SelectItem>
                                        <SelectItem value="awd">AWD</SelectItem>
                                        <SelectItem value="4wd">4WD</SelectItem>
                                        <SelectItem value="4x4">4x4</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Fuel Type</Label>
                                <Select value={filterFuelType} onValueChange={setFilterFuelType}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="All" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Fuel Types</SelectItem>
                                        <SelectItem value="gasoline">Gasoline</SelectItem>
                                        <SelectItem value="diesel">Diesel</SelectItem>
                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                        <SelectItem value="electric">Electric</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Body Type</Label>
                                <Select value={filterBodyType} onValueChange={setFilterBodyType}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="All" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Body Types</SelectItem>
                                        <SelectItem value="sedan">Sedan</SelectItem>
                                        <SelectItem value="suv">SUV</SelectItem>
                                        <SelectItem value="truck">Truck</SelectItem>
                                        <SelectItem value="coupe">Coupe</SelectItem>
                                        <SelectItem value="hatchback">Hatchback</SelectItem>
                                        <SelectItem value="van">Van</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-500">Cylinders</Label>
                                <Select value={filterEngineCylinders} onValueChange={setFilterEngineCylinders}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="All" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Cylinders</SelectItem>
                                        <SelectItem value="3">3 Cyl</SelectItem>
                                        <SelectItem value="4">4 Cyl</SelectItem>
                                        <SelectItem value="5">5 Cyl</SelectItem>
                                        <SelectItem value="6">6 Cyl</SelectItem>
                                        <SelectItem value="8">8 Cyl</SelectItem>
                                        <SelectItem value="10">10 Cyl</SelectItem>
                                        <SelectItem value="12">12 Cyl</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                             <Button variant="ghost" onClick={clearFilters} className="text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                                <X className="w-4 h-4 mr-2" />
                                Clear All Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </CollapsibleContent>
        </Collapsible>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Clean Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Dealerships</h3>
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">{dealerships.length}</Badge>
            </div>
            
            <div className="space-y-3">
                 <button
                    onClick={() => setSelectedDealership(null)}
                    className={cn(
                        "w-full p-4 text-left transition-all rounded-2xl border group relative overflow-hidden",
                        !selectedDealership
                        ? "bg-white border-gray-200 shadow-md ring-2 ring-black ring-offset-2"
                        : "bg-white/50 border-transparent hover:bg-white hover:shadow-sm"
                    )}
                  >
                    <div className="relative z-10">
                        <div className="font-bold text-gray-900">All Inventory</div>
                        <div className="text-sm text-gray-500 mt-1">View all {totalInventory} vehicles</div>
                    </div>
                  </button>

                  {dealerships.map(dealership => (
                    <div
                      key={dealership.id}
                      className={cn(
                        "group relative p-4 rounded-2xl border transition-all cursor-pointer",
                        selectedDealership?.id === dealership.id
                          ? "bg-white border-gray-200 shadow-md ring-2 ring-black ring-offset-2"
                          : "bg-white/50 border-transparent hover:bg-white hover:shadow-sm"
                      )}
                      onClick={() => setSelectedDealership(dealership)}
                    >
                      <div className="pr-8">
                        <div className="font-bold text-gray-900 mb-1">{dealership.name}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{dealership.location}, {dealership.province}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                                {dealership.inventory.length} Cars
                            </Badge>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); setEditingDealership(dealership); }}>
                            <Edit2 className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-50" onClick={(e) => handleDeleteDealership(dealership.id, e)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          {/* Modern Grid */}
          <div className="lg:col-span-9">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map(car => (
                    <Card key={`${car.dealershipId}-${car.id}`} className={cn(
                        "group border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden rounded-2xl relative",
                        car.status === 'sold' && "opacity-80 hover:opacity-100"
                    )}>
                        {car.status === 'sold' && (
                            <div className="absolute top-0 right-0 z-20 p-4">
                                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-0 uppercase tracking-wider">
                                    Sold
                                </div>
                            </div>
                        )}
                        
                        <CardHeader className="p-0">
                            <div className={cn(
                                "h-3 transition-all duration-500",
                                car.status === 'sold' 
                                    ? "bg-gray-200" 
                                    : "bg-gradient-to-r from-gray-100 to-gray-50 group-hover:from-blue-500 group-hover:to-purple-500"
                            )} />
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-1">{car.year}</div>
                                    <h3 className="font-bold text-xl text-gray-900 leading-tight">
                                        {car.make} {car.model}
                                    </h3>
                                    <div className="text-sm text-gray-500 font-medium mt-1">{car.trim}</div>
                                </div>
                                <Badge variant="outline" className="font-mono text-xs tracking-wide border-gray-200 text-gray-500">
                                    {car.vin.slice(-6)}
                                </Badge>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <Badge variant="secondary" className="bg-gray-50 text-gray-600 hover:bg-gray-100 border-0">
                                    <Palette className="w-3 h-3 mr-1" /> {car.color}
                                </Badge>
                                <Badge variant="secondary" className="bg-gray-50 text-gray-600 hover:bg-gray-100 border-0">
                                    <Settings2 className="w-3 h-3 mr-1" /> {car.transmission}
                                </Badge>
                                <Badge variant="secondary" className="bg-gray-50 text-gray-600 hover:bg-gray-100 border-0">
                                    <Fuel className="w-3 h-3 mr-1" /> {car.fuelType}
                                </Badge>
                                {car.drivetrain && (
                                    <Badge variant="secondary" className="bg-gray-50 text-gray-600 hover:bg-gray-100 border-0 uppercase">
                                        {car.drivetrain}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-50">
                                <div>
                                    <div className="text-sm text-gray-400 font-medium mb-0.5">Price</div>
                                    <div className={cn(
                                        "text-2xl font-bold tracking-tight",
                                        car.status === 'sold' ? "text-gray-400 line-through decoration-2" : "text-gray-900"
                                    )}>
                                        ${parseFloat(car.price).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-400 font-medium mb-0.5">Mileage</div>
                                    <div className="text-lg font-semibold text-gray-700 flex items-center justify-end gap-1">
                                        <Gauge className="w-4 h-4 text-gray-400" />
                                        {parseFloat(car.kilometers).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                             {/* Hover Actions */}
                             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 z-30">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className={cn(
                                        "h-8 px-3 rounded-full backdrop-blur shadow-sm text-xs font-medium",
                                        car.status === 'sold' 
                                            ? "bg-green-50 text-green-700 hover:bg-green-100" 
                                            : "bg-gray-900 text-white hover:bg-black"
                                    )}
                                    onClick={() => toggleSoldStatus(car)}
                                >
                                    {car.status === 'sold' ? 'Mark Available' : 'Mark Sold'}
                                </Button>
                                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-blue-50" onClick={() => { setEditingCar({ ...car, dealershipId: car.dealershipId }); }}>
                                    <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                                </Button>
                                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-red-50" onClick={() => handleDeleteCar(car.dealershipId!, car.id)}>
                                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                </Button>
                            </div>

                            {!selectedDealership && (
                                <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                                    <Building2 className="w-3 h-3" />
                                    {car.dealershipName}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
