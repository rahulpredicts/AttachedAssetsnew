import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  FileDown, 
  FileSpreadsheet, 
  FileText,
  Download,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ExportPage() {
  const { toast } = useToast();
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [includeFields, setIncludeFields] = useState({
    basic: true,
    pricing: true,
    specs: true,
    features: false,
    history: false,
  });

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting inventory as ${selectedFormat.toUpperCase()}...`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Export Data</h1>
          <p className="text-slate-400">Export your inventory data in various formats</p>
        </div>

        {/* Format Selection */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle>Select Format</CardTitle>
            <CardDescription>Choose your preferred export format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedFormat('csv')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedFormat === 'csv' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <FileSpreadsheet className={`w-10 h-10 mx-auto mb-3 ${
                  selectedFormat === 'csv' ? 'text-blue-400' : 'text-slate-400'
                }`} />
                <p className="font-semibold">CSV</p>
                <p className="text-xs text-slate-400 mt-1">Comma-separated values</p>
              </button>

              <button
                onClick={() => setSelectedFormat('excel')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedFormat === 'excel' 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <FileSpreadsheet className={`w-10 h-10 mx-auto mb-3 ${
                  selectedFormat === 'excel' ? 'text-green-400' : 'text-slate-400'
                }`} />
                <p className="font-semibold">Excel</p>
                <p className="text-xs text-slate-400 mt-1">Microsoft Excel format</p>
              </button>

              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedFormat === 'pdf' 
                    ? 'border-red-500 bg-red-500/10' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <FileText className={`w-10 h-10 mx-auto mb-3 ${
                  selectedFormat === 'pdf' ? 'text-red-400' : 'text-slate-400'
                }`} />
                <p className="font-semibold">PDF</p>
                <p className="text-xs text-slate-400 mt-1">Portable document format</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Field Selection */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle>Select Fields</CardTitle>
            <CardDescription>Choose which data to include in your export</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="basic" 
                  checked={includeFields.basic}
                  onCheckedChange={(checked) => setIncludeFields({...includeFields, basic: !!checked})}
                />
                <Label htmlFor="basic" className="text-slate-300">
                  Basic Info (Make, Model, Year, VIN, Stock #)
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="pricing" 
                  checked={includeFields.pricing}
                  onCheckedChange={(checked) => setIncludeFields({...includeFields, pricing: !!checked})}
                />
                <Label htmlFor="pricing" className="text-slate-300">
                  Pricing (List Price, Cost, Profit Margin)
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="specs" 
                  checked={includeFields.specs}
                  onCheckedChange={(checked) => setIncludeFields({...includeFields, specs: !!checked})}
                />
                <Label htmlFor="specs" className="text-slate-300">
                  Specifications (Engine, Transmission, Drivetrain)
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="features" 
                  checked={includeFields.features}
                  onCheckedChange={(checked) => setIncludeFields({...includeFields, features: !!checked})}
                />
                <Label htmlFor="features" className="text-slate-300">
                  Features List
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="history" 
                  checked={includeFields.history}
                  onCheckedChange={(checked) => setIncludeFields({...includeFields, history: !!checked})}
                />
                <Label htmlFor="history" className="text-slate-300">
                  Vehicle History (Carfax Status)
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Button */}
        <Button 
          size="lg" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleExport}
        >
          <Download className="w-5 h-5 mr-2" />
          Export Inventory
        </Button>
      </div>
    </div>
  );
}
