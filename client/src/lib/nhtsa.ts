export const CANADIAN_TRIMS = [
  "CE", "LE", "XLE", "SE", "XSE", "Limited", "Platinum", // Toyota
  "DX", "LX", "EX", "EX-L", "Touring", "Sport", "Si", "Type R", // Honda
  "S", "SV", "SL", "SR", "Platinum", // Nissan
  "Trendline", "Comfortline", "Highline", "Execline", "GTI", "R", // VW
  "Essential", "Preferred", "Luxury", "Ultimate", "N Line", // Hyundai
  "LX", "EX", "EX Premium", "SX", "SX Limited", // Kia
  "GX", "GS", "GT", "GT-Line", "Signature", // Mazda
  "Base", "Premium", "Limited", "Wilderness", "Premier", // Subaru
  "WT", "LS", "LT", "RST", "LTZ", "High Country", // GM/Chevy
  "XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", // Ford
  "Tradesman", "Big Horn", "Sport", "Rebel", "Laramie", "Limited", // Ram
  "Other"
];

export async function fetchCanadianTrims(year: string, make: string, model: string): Promise<string[]> {
  if (!year || !make || !model) return [];

  try {
    // NHTSA API parameters
    const params = new URLSearchParams({
      Year: year,
      Make: make,
      Model: model,
      units: "US", // Canadian specific endpoint might default to metric or accept this
      format: "json"
    });

    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetCanadianVehicleSpecifications/?${params.toString()}`
    );
    
    const data = await response.json();

    if (data.Results && Array.isArray(data.Results)) {
      const trims = new Set<string>();
      
      data.Results.forEach((vehicle: any) => {
        // The API returns a Specs array. We need to find the "Trim" variable.
        // Sometimes it's in the root object if simplified, but usually in Specs.
        
        if (vehicle.Specs) {
            const trimSpec = vehicle.Specs.find((s: any) => s.Name === "Trim");
            if (trimSpec && trimSpec.Value && trimSpec.Value !== "N/A" && trimSpec.Value !== "null") {
                trims.add(trimSpec.Value);
            }
            
            const seriesSpec = vehicle.Specs.find((s: any) => s.Name === "Series");
            if (seriesSpec && seriesSpec.Value && seriesSpec.Value !== "N/A" && seriesSpec.Value !== "null") {
                trims.add(seriesSpec.Value);
            }
        }
      });

      if (trims.size > 0) {
          return Array.from(trims).sort();
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching Canadian trims:", error);
    return [];
  }
}
