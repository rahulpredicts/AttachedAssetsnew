import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2, Download, Link as LinkIcon, Copy, Check, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtractedCar {
  vin: string;
  make: string;
  model: string;
  trim?: string;
  year?: string;
  color?: string;
  price?: string;
  kilometers?: string;
  carfaxLink?: string;
  stockNumber?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
}

export default function BulkScraper() {
  const { toast } = useToast();
  const [listingUrl, setListingUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cars, setCars] = useState<ExtractedCar[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [rawJson, setRawJson] = useState<string>("");
  const [copiedRawJson, setCopiedRawJson] = useState(false);

  const handleBulkExtract = async () => {
    if (!listingUrl.trim()) {
      toast({ title: "URL Required", description: "Please enter a listing page URL", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setCars([]);
    setError(null);
    setRawJson("");

    try {
      const res = await fetch("/api/scrape-inventory-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: listingUrl })
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to scrape");
        toast({ title: "Scraping Failed", description: errorData.error, variant: "destructive" });
      } else {
        const data = await res.json();
        setCars(data.cars || []);
        setRawJson(JSON.stringify(data, null, 2));
        toast({ 
          title: "Success", 
          description: `Extracted ${data.cars?.length || 0} vehicles from listing`,
          variant: "default" 
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      toast({ title: "Error", description: "Failed to connect to API", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = () => {
    if (cars.length === 0) return;

    const headers = ["VIN", "Make", "Model", "Trim", "Year", "Color", "Price", "KMS", "Stock #", "Fuel Type", "Transmission", "Carfax"];
    const rows = cars.map(car => [
      car.vin || "",
      car.make || "",
      car.model || "",
      car.trim || "",
      car.year || "",
      car.color || "",
      car.price || "",
      car.kilometers || "",
      car.stockNumber || "",
      car.fuelType || "",
      car.transmission || "",
      car.carfaxLink || ""
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cars-${new Date().getTime()}.csv`;
    a.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rawJson);
    setCopiedRawJson(true);
    setTimeout(() => setCopiedRawJson(false), 2000);
  };

  const deleteCar = (index: number) => {
    setCars(cars.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8" data-testid="bulk-scraper-page">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Bulk Car Inventory Extraction</h1>
        <p className="text-gray-500">Extract entire car inventory from listing pages with VIN, make, model, trim, color, price, KMS, and more.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <Card className="border-0 shadow-sm ring-1 ring-gray-200">
          <CardHeader>
            <CardTitle>Extract Inventory</CardTitle>
            <CardDescription>Enter a listing page URL to extract all vehicles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="font-semibold">Listing Page URL *</Label>
              <Input
                placeholder="https://www.autotrader.ca/cars/toyota/camry"
                value={listingUrl}
                onChange={(e) => setListingUrl(e.target.value)}
                className="font-mono text-sm"
                data-testid="input-listing-url"
              />
              <p className="text-xs text-gray-500">
                Paste URL of a page with multiple vehicle listings
              </p>
            </div>

            <Button
              onClick={handleBulkExtract}
              disabled={isLoading || !listingUrl.trim()}
              className="w-full"
              size="lg"
              data-testid="button-extract-inventory"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Extracting ({cars.length})...
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Extract All Cars
                </>
              )}
            </Button>

            {/* Stats */}
            {cars.length > 0 && (
              <div className="pt-4 border-t space-y-2">
                <div className="text-sm">
                  <p className="text-gray-600 font-semibold mb-2">Extraction Stats</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Total Cars:</span>
                      <span className="font-bold">{cars.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>With VIN:</span>
                      <span className="font-bold">{cars.filter(c => c.vin).length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>With Price:</span>
                      <span className="font-bold">{cars.filter(c => c.price).length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>With KMS:</span>
                      <span className="font-bold">{cars.filter(c => c.kilometers).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Export */}
            {cars.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <Button
                  onClick={downloadCSV}
                  variant="outline"
                  className="w-full"
                  size="sm"
                  data-testid="button-download-csv"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full"
                  size="sm"
                  data-testid="button-copy-json"
                >
                  {copiedRawJson ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied JSON
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy JSON
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {!cars.length && !error && !isLoading && (
            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <LinkIcon className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Run extraction to see results</p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card className="border-0 shadow-sm ring-1 ring-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
                <p className="text-sm text-gray-600">Scraping inventory with JavaScript rendering...</p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-0 shadow-sm ring-1 ring-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">Extraction Failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {cars.length > 0 && (
            <div className="space-y-4">
              <Card className="border-0 shadow-sm ring-1 ring-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Extraction Successful</p>
                      <p className="text-sm text-green-700 mt-1">Found {cars.length} vehicles with complete information</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Car Grid */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Extracted Vehicles</Label>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {cars.map((car, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-lg p-3 space-y-2 hover:shadow-md transition-shadow"
                      data-testid={`card-car-${idx}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900 truncate">
                            {car.year} {car.make} {car.model} {car.trim ? `(${car.trim})` : ""}
                          </p>
                          {car.vin && (
                            <p className="text-xs text-gray-500 font-mono mt-0.5">VIN: {car.vin}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCar(idx)}
                          className="flex-shrink-0"
                          data-testid={`button-delete-car-${idx}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {car.color && (
                          <div>
                            <p className="text-gray-500">Color</p>
                            <p className="font-medium text-gray-900">{car.color}</p>
                          </div>
                        )}
                        {car.price && (
                          <div>
                            <p className="text-gray-500">Price</p>
                            <p className="font-medium text-gray-900">${car.price}</p>
                          </div>
                        )}
                        {car.kilometers && (
                          <div>
                            <p className="text-gray-500">KMS</p>
                            <p className="font-medium text-gray-900">{car.kilometers} km</p>
                          </div>
                        )}
                        {car.stockNumber && (
                          <div>
                            <p className="text-gray-500">Stock #</p>
                            <p className="font-medium text-gray-900">{car.stockNumber}</p>
                          </div>
                        )}
                        {car.fuelType && (
                          <div>
                            <p className="text-gray-500">Fuel</p>
                            <p className="font-medium text-gray-900">{car.fuelType}</p>
                          </div>
                        )}
                        {car.transmission && (
                          <div>
                            <p className="text-gray-500">Trans</p>
                            <p className="font-medium text-gray-900">{car.transmission}</p>
                          </div>
                        )}
                      </div>

                      {car.carfaxLink && (
                        <a
                          href={car.carfaxLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                        >
                          View Carfax →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw JSON */}
              <Card className="border-0 shadow-sm ring-1 ring-gray-200 mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Raw JSON Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto max-h-40 overflow-y-auto" data-testid="display-raw-json">
                    <pre className="whitespace-pre-wrap break-words">{rawJson}</pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
