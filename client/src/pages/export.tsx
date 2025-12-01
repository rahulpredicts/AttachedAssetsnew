import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileDown,
  FileText,
  Download,
  Plus,
  X,
  TrendingUp,
  Car
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VehicleExport {
  vin: string;
  odometer: string;
  name: string;
  status: 'pending' | 'ready';
}

export default function ExportPage() {
  const { toast } = useToast();
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [vehicles, setVehicles] = useState<VehicleExport[]>([
    { vin: '5N1DL1FS5PC330227', odometer: '45000', name: '2023 Hyundai Tucson', status: 'ready' }
  ]);
  const [vinInput, setVinInput] = useState('');
  const [odometerInput, setOdometerInput] = useState('');

  const addVehicle = () => {
    if (vinInput && odometerInput) {
      setVehicles([...vehicles, {
        vin: vinInput,
        odometer: odometerInput,
        name: `Vehicle - ${vinInput.slice(-6)}`,
        status: 'ready'
      }]);
      setVinInput('');
      setOdometerInput('');
      toast({
        title: "Vehicle Added",
        description: "Vehicle added to export queue",
      });
    }
  };

  const removeVehicle = (index: number) => {
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  const handleExport = () => {
    if (vehicles.length === 0) {
      toast({
        title: "No Vehicles",
        description: "Add at least one vehicle to export",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Export Started",
      description: `Exporting ${vehicles.length} vehicle(s) as ${selectedFormat.toUpperCase()}...`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <FileDown className="w-8 h-8 text-blue-400" />
            Export Vehicles
          </h1>
          <p className="text-slate-400">Add vehicles by VIN and prepare export reports</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Vehicle Management */}
          <div className="space-y-6">
            {/* Add Vehicle Section */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plus className="w-5 h-5 text-blue-400" />
                  Add Vehicle for Export
                </CardTitle>
                <CardDescription>Enter VIN and odometer reading to add vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="vin" className="text-slate-300 block mb-2 font-semibold">VIN Number</Label>
                    <Input
                      id="vin"
                      placeholder="e.g., 5N1DL1FS5PC330227"
                      value={vinInput}
                      onChange={(e) => setVinInput(e.target.value)}
                      data-testid="input-vin-export"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="odometer" className="text-slate-300 block mb-2 font-semibold">Odometer (km)</Label>
                    <Input
                      id="odometer"
                      placeholder="e.g., 45000"
                      value={odometerInput}
                      onChange={(e) => setOdometerInput(e.target.value)}
                      data-testid="input-odometer-export"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                  <Button
                    onClick={addVehicle}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6"
                    data-testid="button-add-vehicle"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Queue */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Car className="w-5 h-5 text-slate-300" />
                  Export Queue ({vehicles.length})
                </CardTitle>
                <CardDescription>Vehicles ready for export</CardDescription>
              </CardHeader>
              <CardContent>
                {vehicles.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No vehicles added yet. Add one above to get started.</p>
                ) : (
                  <div className="space-y-3">
                    {vehicles.map((vehicle, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-slate-700/70 rounded-lg border border-slate-600"
                        data-testid={`row-vehicle-export-${idx}`}
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-white text-base">{vehicle.name}</p>
                          <p className="text-xs text-slate-400">VIN: {vehicle.vin} • Odometer: {vehicle.odometer} km</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {vehicle.status === 'ready' && (
                            <span className="text-xs bg-green-500/30 text-green-300 px-3 py-1 rounded font-semibold">Ready</span>
                          )}
                          <button
                            onClick={() => removeVehicle(idx)}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                            data-testid={`button-remove-vehicle-${idx}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Export Options */}
          <div className="space-y-6">
            {/* Format Selection */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Export Format
                </CardTitle>
                <CardDescription>Choose format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { format: 'csv', label: 'CSV', icon: '📊' },
                    { format: 'excel', label: 'Excel', icon: '📈' },
                    { format: 'pdf', label: 'PDF', icon: '📄' }
                  ].map(({ format, label, icon }) => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format as any)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left font-semibold ${
                        selectedFormat === format
                          ? 'border-blue-500 bg-blue-600/20 text-white'
                          : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                      }`}
                      data-testid={`button-format-${format}`}
                    >
                      <p className="text-base">{icon} {label}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export Summary */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Export Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Vehicles:</span>
                    <span className="font-semibold text-white">{vehicles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Format:</span>
                    <span className="font-semibold text-white">{selectedFormat.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-green-400 font-semibold">Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Button */}
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6"
              onClick={handleExport}
              data-testid="button-export-vehicles"
            >
              <Download className="w-5 h-5 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
