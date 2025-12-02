import { useState, useMemo, useEffect } from "react";
import { useCars, useDealerships, type Car, type Dealership } from "@/lib/api-hooks";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Car as CarIcon, 
  AlertCircle, 
  Search,
  ArrowRight,
  MapPin,
  QrCode,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Filter,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Wrench,
  Gauge,
  Shield,
  Calendar,
  Users,
  ClipboardCheck,
  Info,
  Minus,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { fetchCanadianTrims, getTrimsForMake, CANADIAN_TRIMS, decodeVIN } from "@/lib/nhtsa";

const POPULAR_MAKES = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Dodge", "Fiat", "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Land Rover", "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Porsche", "Ram", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

const PROVINCES = [
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "SK", name: "Saskatchewan" },
  { code: "MB", name: "Manitoba" },
  { code: "ON", name: "Ontario" },
  { code: "QC", name: "Quebec" },
  { code: "NB", name: "New Brunswick" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NL", name: "Newfoundland" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "YT", name: "Yukon" }
];

const NAAA_GRADES = [
  { grade: 5, label: "Excellent", description: "Only minor chips; original finish; no tears, burns, or odors; all systems functional", reconditionLow: 500, reconditionHigh: 1000, color: "text-green-600", bg: "bg-green-50" },
  { grade: 4, label: "Above Average", description: "Minor scratches/chips; may need PDR or minor touch-up; minimal interior wear", reconditionLow: 1000, reconditionHigh: 1500, color: "text-blue-600", bg: "bg-blue-50" },
  { grade: 3, label: "Average", description: "Normal wear including parking dings, small scratches, minor interior wear", reconditionLow: 1500, reconditionHigh: 2500, color: "text-yellow-600", bg: "bg-yellow-50" },
  { grade: 2, label: "Below Average", description: "Multiple dents, scratches; panels may need replacement; interior burns/tears", reconditionLow: 2500, reconditionHigh: 4000, color: "text-orange-600", bg: "bg-orange-50" },
  { grade: 1, label: "Poor", description: "Severe abuse or major collision damage; cost-prohibitive reconditioning", reconditionLow: 4000, reconditionHigh: 6000, color: "text-red-600", bg: "bg-red-50" },
  { grade: 0, label: "Inoperative", description: "Non-running; parts missing; suitable only for salvage", reconditionLow: 0, reconditionHigh: 0, color: "text-gray-600", bg: "bg-gray-50" }
];

const REGIONAL_MULTIPLIERS: Record<string, number> = {
  "BC": 1.12,
  "AB": 1.09,
  "SK": 1.05,
  "MB": 1.05,
  "ON": 0.99,
  "QC": 0.92,
  "NB": 0.91,
  "NS": 0.91,
  "NL": 0.91,
  "PE": 0.91,
  "NT": 1.00,
  "NU": 1.00,
  "YT": 1.00
};

const SEASONAL_FACTORS: Record<number, number> = {
  1: 0.965, 2: 0.965,
  3: 1.025, 4: 1.025,
  5: 1.005, 6: 1.005,
  7: 0.99, 8: 0.99,
  9: 0.975, 10: 0.975,
  11: 0.97, 12: 0.97
};

const BRAND_MULTIPLIERS: Record<string, number> = {
  "Toyota": 1.08, "Lexus": 1.10, "Honda": 1.07, "Acura": 1.05,
  "Chrysler": 0.92, "Dodge": 0.93, "Mitsubishi": 0.90, "Fiat": 0.88,
  "Jeep": 0.98, "Ram": 1.02
};

const BODY_TYPE_DEPRECIATION: Record<string, { year1: number, annual: number }> = {
  "truck": { year1: 0.175, annual: 0.11 },
  "suv": { year1: 0.20, annual: 0.135 },
  "sedan": { year1: 0.25, annual: 0.175 },
  "compact": { year1: 0.275, annual: 0.165 },
  "hatchback": { year1: 0.275, annual: 0.165 },
  "luxury": { year1: 0.30, annual: 0.20 },
  "electric": { year1: 0.35, annual: 0.175 },
  "coupe": { year1: 0.22, annual: 0.15 },
  "van": { year1: 0.25, annual: 0.16 },
  "convertible": { year1: 0.28, annual: 0.18 }
};

const RECONDITIONING_COSTS = {
  brakes: {
    padsOnly: { low: 100, high: 300, label: "Brake Pads Only (per axle)" },
    padsRotors: { low: 250, high: 600, label: "Pads + Rotors (per axle)" },
    completeJob: { low: 400, high: 800, label: "Complete Brake Job" }
  },
  tires: {
    economy: { low: 400, high: 600, label: "Economy Set (4)" },
    midRange: { low: 600, high: 1000, label: "Mid-Range Set (4)" },
    suvTruck: { low: 750, high: 1300, label: "SUV/Truck Set (4)" }
  },
  glass: {
    chipRepair: { low: 50, high: 150, label: "Chip Repair" },
    windshield: { low: 200, high: 500, label: "Windshield Replacement" },
    adasWindshield: { low: 500, high: 1000, label: "Windshield with ADAS" }
  },
  paintBody: {
    touchUp: { low: 200, high: 500, label: "Touch-up/Scratch Repair" },
    bumper: { low: 1000, high: 2000, label: "Bumper Respray" },
    fullPanel: { low: 500, high: 1200, label: "Full Panel Repaint" },
    pdr: { low: 100, high: 300, label: "PDR (per dent)" }
  },
  interior: {
    basicDetail: { low: 100, high: 150, label: "Basic Detail" },
    fullDetail: { low: 200, high: 400, label: "Full Detail with Extraction" },
    smokeOdor: { low: 50, high: 100, label: "Smoke/Odor Treatment" },
    seatRepair: { low: 100, high: 500, label: "Seat Tear Repair" }
  },
  mechanical: {
    oilChange: { low: 40, high: 120, label: "Oil Change + Fluids" },
    battery: { low: 100, high: 400, label: "Battery Replacement" },
    alternator: { low: 400, high: 1000, label: "Alternator" },
    safetyInspection: { low: 50, high: 150, label: "Safety Inspection" }
  }
};

const TITLE_TYPES = [
  { value: "clean", label: "Clean Title", deduction: 0 },
  { value: "rebuilt", label: "Rebuilt Title", deduction: 0.30 },
  { value: "salvage", label: "Salvage Title", deduction: 1.0 },
  { value: "flood", label: "Flood Title", deduction: 1.0 },
  { value: "irreparable", label: "Irreparable Title", deduction: 1.0 }
];

const ACCIDENT_LEVELS = [
  { value: "none", label: "No Accidents", deduction: 0 },
  { value: "cosmetic", label: "Cosmetic Only (<$3,000)", deduction: 0.075 },
  { value: "minor", label: "Minor Panel Damage", deduction: 0.10 },
  { value: "moderate", label: "Moderate ($3,000-$10,000)", deduction: 0.125 },
  { value: "major", label: "Major Structural (>$10,000)", deduction: 0.20 },
  { value: "severe", label: "Severe (Rebuilt/Rollover)", deduction: 0.35 }
];

const RUST_LEVELS = [
  { value: "none", label: "No Rust", costLow: 0, costHigh: 0 },
  { value: "surface", label: "Surface Rust (paint-level)", costLow: 100, costHigh: 500 },
  { value: "scale", label: "Scale Rust (bubbling paint)", costLow: 300, costHigh: 1000 },
  { value: "penetrating", label: "Penetrating Rust (through-body)", costLow: 1000, costHigh: 5000 }
];

type DecisionType = "buy" | "wholesale" | "reject";

interface AppraisalResult {
  decision: DecisionType;
  decisionReasons: string[];
  retailValue: number;
  wholesaleValue: number;
  tradeInOffer: number;
  adjustments: {
    label: string;
    amount: number;
    type: "add" | "subtract" | "multiply";
  }[];
  reconditioning: number;
  profitMargin: number;
  holdingCosts: number;
  mileageAdjustment: number;
  regionalMultiplier: number;
  seasonalFactor: number;
  conditionDeduction: number;
  accidentDeduction: number;
  historyDeductions: number;
  similarCars: Car[];
}

export default function AppraisalPage() {
  const { data: dealerships = [] } = useDealerships();
  const { data: allCars = [] } = useCars();
  const { toast } = useToast();
  const { isAdmin, isDataAnalyst } = useAuth();
  const canSeeValuations = isAdmin || isDataAnalyst;
  
  const [formData, setFormData] = useState({
    vin: "",
    make: "",
    model: "",
    year: "",
    kilometers: "",
    trim: "",
    transmission: "automatic",
    fuelType: "gasoline",
    drivetrain: "fwd",
    bodyType: "sedan",
    engineCylinders: "",
    engineDisplacement: "",
    msrp: "",
    province: "",
    postalCode: "",
    vehicleOriginProvince: ""
  });
  
  const [conditionData, setConditionData] = useState({
    naagGrade: 3,
    brakePadThickness: 4,
    tireTreadDepth: 5,
    checkEngineLight: false,
    roughIdle: false,
    excessiveSmoke: false,
    transmissionSlipping: false,
    rustLevel: "none"
  });

  const [historyData, setHistoryData] = useState({
    titleType: "clean",
    accidentLevel: "none",
    accidentCount: 0,
    odometerTampering: false,
    activeRecalls: false,
    frameDamage: false,
    frameDamageRepaired: false,
    stolenFlag: false,
    previousRental: false,
    previousTaxi: false,
    missingServiceRecords: false,
    ownerCount: 1,
    isSpecialtyVehicle: false,
    bcAlbertaHistory: false
  });

  const [reconditioningItems, setReconditioningItems] = useState<{
    category: string;
    item: string;
    cost: number;
    quantity: number;
  }[]>([]);

  const [businessSettings, setBusinessSettings] = useState({
    profitMarginPercent: 15,
    holdingCostPerDay: 50,
    estimatedHoldingDays: 10,
    safetyBufferPercent: 12
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCondition, setShowCondition] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [showReconditioning, setShowReconditioning] = useState(true);
  const [showComparables, setShowComparables] = useState(true);
  const [showBusinessSettings, setShowBusinessSettings] = useState(false);
  
  const [appraisal, setAppraisal] = useState<AppraisalResult | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [availableTrims, setAvailableTrims] = useState<string[]>([]);
  const [isLoadingTrims, setIsLoadingTrims] = useState(false);

  useEffect(() => {
    const loadTrims = async () => {
      if (formData.make && formData.make !== "Other") {
        setIsLoadingTrims(true);
        let trims: string[] = [];
        if (formData.year && formData.model) {
          trims = await fetchCanadianTrims(formData.year, formData.make, formData.model);
        }
        if (trims.length === 0) {
          trims = getTrimsForMake(formData.make);
        }
        setAvailableTrims(trims);
        setIsLoadingTrims(false);
      } else {
        setAvailableTrims(CANADIAN_TRIMS);
      }
    };
    const timer = setTimeout(loadTrims, 500);
    return () => clearTimeout(timer);
  }, [formData.year, formData.make, formData.model]);

  const handleDecodeVin = async () => {
    if (!formData.vin || formData.vin.length < 11) {
      toast({ title: "Invalid VIN", description: "Please enter a valid 17-character VIN", variant: "destructive" });
      return;
    }
    setIsDecoding(true);
    try {
      const result = await decodeVIN(formData.vin);
      if (result.error) throw new Error(result.error);
      
      let normalizedMake = result.make || "";
      if (normalizedMake) {
        const matchedMake = POPULAR_MAKES.find(m => m.toLowerCase() === normalizedMake.toLowerCase());
        if (matchedMake) normalizedMake = matchedMake;
      }
      
      const decoded: any = {
        make: normalizedMake,
        model: result.model || "",
        year: result.year || "",
        engineCylinders: result.engineCylinders || "",
        engineDisplacement: result.engineDisplacement || "",
        trim: result.trim || "",
      };

      if (result.transmission) {
        const trans = result.transmission.toLowerCase();
        if (trans.includes("auto") || trans.includes("cvt")) decoded.transmission = "automatic";
        else if (trans.includes("manual") || trans.includes("stick")) decoded.transmission = "manual";
      }

      if (result.fuelType) {
        const fuel = result.fuelType.toLowerCase();
        if (fuel.includes("gas")) decoded.fuelType = "gasoline";
        else if (fuel.includes("diesel")) decoded.fuelType = "diesel";
        else if (fuel.includes("electric")) decoded.fuelType = "electric";
        else if (fuel.includes("hybrid")) decoded.fuelType = "hybrid";
      }

      if (result.driveType) {
        const drive = result.driveType.toLowerCase();
        if (drive.includes("awd") || drive.includes("all")) decoded.drivetrain = "awd";
        else if (drive.includes("4wd") || drive.includes("4-wheel")) decoded.drivetrain = "4wd";
        else if (drive.includes("rwd") || drive.includes("rear")) decoded.drivetrain = "rwd";
        else if (drive.includes("fwd") || drive.includes("front")) decoded.drivetrain = "fwd";
      }

      if (result.bodyClass) {
        const body = result.bodyClass.toLowerCase();
        if (body.includes("sedan")) decoded.bodyType = "sedan";
        else if (body.includes("suv") || body.includes("sport utility")) decoded.bodyType = "suv";
        else if (body.includes("truck") || body.includes("pickup")) decoded.bodyType = "truck";
        else if (body.includes("van") || body.includes("minivan")) decoded.bodyType = "van";
        else if (body.includes("coupe")) decoded.bodyType = "coupe";
        else if (body.includes("hatch")) decoded.bodyType = "hatchback";
        else if (body.includes("convert")) decoded.bodyType = "convertible";
      }

      if (!decoded.make && !decoded.model) throw new Error("Could not decode vehicle details");

      setFormData(prev => ({ ...prev, ...decoded }));
      toast({ 
        title: "VIN Decoded Successfully", 
        description: `Identified: ${decoded.year} ${decoded.make} ${decoded.model}${decoded.trim ? ` ${decoded.trim}` : ''}` 
      });
    } catch (error) {
      toast({ 
        title: "Decoding Failed", 
        description: error instanceof Error ? error.message : "Could not fetch vehicle details.", 
        variant: "destructive" 
      });
    } finally {
      setIsDecoding(false);
    }
  };

  const addReconditioningItem = (category: string, item: string, avgCost: number) => {
    setReconditioningItems(prev => [...prev, { category, item, cost: avgCost, quantity: 1 }]);
  };

  const removeReconditioningItem = (index: number) => {
    setReconditioningItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateReconditioningCost = (index: number, cost: number) => {
    setReconditioningItems(prev => prev.map((item, i) => i === index ? { ...item, cost } : item));
  };

  const updateReconditioningQuantity = (index: number, quantity: number) => {
    setReconditioningItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: Math.max(1, quantity) } : item));
  };

  const totalReconditioningCost = useMemo(() => {
    const baseCost = reconditioningItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
    const rustCost = RUST_LEVELS.find(r => r.value === conditionData.rustLevel);
    const rustAvg = rustCost ? (rustCost.costLow + rustCost.costHigh) / 2 : 0;
    return baseCost + rustAvg;
  }, [reconditioningItems, conditionData.rustLevel]);

  const calculateMileageAdjustment = (baseValue: number, kilometers: number, vehicleAge: number): number => {
    const expectedMileage = vehicleAge * 20000;
    const variance = kilometers - expectedMileage;
    const adjustmentPerKm = 0.02; // Fixed $0.02 per km as per Canadian Car Appraisal methodology
    let adjustment = variance * adjustmentPerKm * -1;
    
    const maxPenalty = baseValue * 0.15;
    const maxCredit = baseValue * 0.10;
    
    if (adjustment < -maxPenalty) adjustment = -maxPenalty;
    if (adjustment > maxCredit) adjustment = maxCredit;
    
    return adjustment;
  };

  const calculateDepreciation = (msrp: number, vehicleAge: number, bodyType: string, make: string): number => {
    const depRates = BODY_TYPE_DEPRECIATION[bodyType] || BODY_TYPE_DEPRECIATION["sedan"];
    let value = msrp;
    
    if (vehicleAge >= 1) {
      value = value * (1 - depRates.year1);
    }
    
    for (let year = 2; year <= Math.min(vehicleAge, 5); year++) {
      value = value * (1 - depRates.annual);
    }
    
    for (let year = 6; year <= vehicleAge; year++) {
      value = value * 0.90;
    }
    
    const brandMultiplier = BRAND_MULTIPLIERS[make] || 1.0;
    value = value * brandMultiplier;
    
    return Math.max(value, 0);
  };

  const getSeasonalFactor = (bodyType: string): number => {
    const currentMonth = new Date().getMonth() + 1;
    let baseFactor = SEASONAL_FACTORS[currentMonth] || 1.0;
    
    const isWinterMonth = currentMonth >= 10 || currentMonth <= 3;
    const isSummerMonth = currentMonth >= 5 && currentMonth <= 8;
    
    if (bodyType === "suv" || bodyType === "truck") {
      if (isWinterMonth) baseFactor *= 1.05;
      else baseFactor *= 0.95;
    }
    
    if (bodyType === "convertible") {
      if (isSummerMonth) baseFactor *= 1.10;
      else if (currentMonth >= 11 || currentMonth <= 2) baseFactor *= 0.88;
    }
    
    if (bodyType === "truck" && isWinterMonth) {
      baseFactor *= 1.03;
    }
    
    return baseFactor;
  };

  const evaluateDecision = (): { decision: DecisionType; reasons: string[] } => {
    const reasons: string[] = [];
    const km = parseInt(formData.kilometers) || 0;
    const vehicleAge = formData.year ? new Date().getFullYear() - parseInt(formData.year) : 0;
    
    if (["salvage", "flood", "irreparable"].includes(historyData.titleType)) {
      reasons.push(`${TITLE_TYPES.find(t => t.value === historyData.titleType)?.label} - automatic rejection`);
      return { decision: "reject", reasons };
    }
    if (historyData.odometerTampering) {
      reasons.push("Odometer tampering detected");
      return { decision: "reject", reasons };
    }
    if (historyData.activeRecalls) {
      reasons.push("Active unrepaired safety recalls");
      return { decision: "reject", reasons };
    }
    if (historyData.frameDamage && !historyData.frameDamageRepaired) {
      reasons.push("Unrepaired structural/frame damage");
      return { decision: "reject", reasons };
    }
    if (km > 300000) {
      reasons.push("Mileage exceeds 300,000 km");
      return { decision: "reject", reasons };
    }
    if (vehicleAge > 15 && !historyData.isSpecialtyVehicle) {
      reasons.push("Vehicle age exceeds 15 years (non-specialty)");
      return { decision: "reject", reasons };
    }
    if (historyData.stolenFlag) {
      reasons.push("Stolen vehicle flag on history");
      return { decision: "reject", reasons };
    }
    if (conditionData.naagGrade === 0) {
      reasons.push("Vehicle is inoperative (Grade 0)");
      return { decision: "reject", reasons };
    }
    
    if (km >= 200000 && km <= 300000) {
      reasons.push("High mileage (200,000-300,000 km) - wholesale only");
    }
    if (vehicleAge >= 10 && vehicleAge <= 15) {
      reasons.push("Vehicle age 10-15 years - wholesale consideration");
    }
    if (historyData.titleType === "rebuilt") {
      reasons.push("Rebuilt title - 20-40% value reduction");
    }
    if (historyData.accidentCount >= 3) {
      reasons.push("Multiple accidents (3+) - wholesale only");
    }
    if (historyData.accidentLevel === "major" || historyData.accidentLevel === "severe") {
      reasons.push("Major/severe accident history - wholesale only");
    }
    if (historyData.frameDamageRepaired) {
      reasons.push("Structural damage (repaired) - wholesale only");
    }
    if (conditionData.roughIdle || conditionData.excessiveSmoke || conditionData.transmissionSlipping) {
      reasons.push("Mechanical issues detected - wholesale only");
    }
    if (conditionData.checkEngineLight) {
      reasons.push("Check engine light active - requires diagnosis");
    }
    
    if (reasons.length > 0) {
      return { decision: "wholesale", reasons };
    }
    
    return { decision: "buy", reasons: ["Vehicle passes all retail criteria"] };
  };

  const handleAppraise = () => {
    if (!formData.make || !formData.model) {
      toast({ title: "Missing Information", description: "Please enter make and model", variant: "destructive" });
      return;
    }

    const km = parseInt(formData.kilometers) || 0;
    const vehicleAge = formData.year ? new Date().getFullYear() - parseInt(formData.year) : 0;
    const msrp = parseFloat(formData.msrp) || 35000;
    
    const { decision, reasons } = evaluateDecision();
    
    let similar = allCars.filter(car => 
      car.make.toLowerCase() === formData.make.toLowerCase() &&
      car.model.toLowerCase() === formData.model.toLowerCase() &&
      (!formData.year || Math.abs(parseInt(car.year) - parseInt(formData.year)) <= 2)
    );
    
    if (formData.trim && formData.trim !== "Other") {
      const trimMatches = similar.filter(car => car.trim.toLowerCase().includes(formData.trim.toLowerCase()));
      if (trimMatches.length > 0) similar = trimMatches;
    }

    let baseValue: number;
    if (similar.length > 0) {
      const prices = similar.map(c => parseFloat(c.price)).filter(p => !isNaN(p));
      baseValue = prices.reduce((a, b) => a + b, 0) / prices.length;
    } else {
      baseValue = calculateDepreciation(msrp, vehicleAge, formData.bodyType, formData.make);
    }

    const adjustments: AppraisalResult["adjustments"] = [];
    
    const mileageAdj = calculateMileageAdjustment(baseValue, km, vehicleAge);
    if (mileageAdj !== 0) {
      adjustments.push({
        label: `Mileage Adjustment (${km.toLocaleString()} km vs ${(vehicleAge * 20000).toLocaleString()} km expected)`,
        amount: mileageAdj,
        type: mileageAdj > 0 ? "add" : "subtract"
      });
    }
    
    const regionalMult = REGIONAL_MULTIPLIERS[formData.province] || 1.0;
    if (regionalMult !== 1.0) {
      const regionalAdj = baseValue * (regionalMult - 1);
      adjustments.push({
        label: `Regional Market (${formData.province || "National"})`,
        amount: Math.abs(regionalAdj),
        type: regionalMult > 1 ? "add" : "subtract"
      });
    }
    
    if (historyData.bcAlbertaHistory && ["ON", "QC", "NB", "NS", "NL", "PE"].includes(formData.province)) {
      const bcAbPremium = baseValue * 0.075;
      adjustments.push({
        label: "BC/Alberta History Premium (rust-free)",
        amount: bcAbPremium,
        type: "add"
      });
    }
    
    const seasonalFactor = getSeasonalFactor(formData.bodyType);
    if (seasonalFactor !== 1.0) {
      const seasonalAdj = baseValue * (seasonalFactor - 1);
      adjustments.push({
        label: `Seasonal Adjustment (${new Date().toLocaleString('default', { month: 'long' })})`,
        amount: Math.abs(seasonalAdj),
        type: seasonalFactor > 1 ? "add" : "subtract"
      });
    }
    
    const accidentDeduction = ACCIDENT_LEVELS.find(a => a.value === historyData.accidentLevel)?.deduction || 0;
    if (accidentDeduction > 0) {
      adjustments.push({
        label: `Accident History (${ACCIDENT_LEVELS.find(a => a.value === historyData.accidentLevel)?.label})`,
        amount: baseValue * accidentDeduction,
        type: "subtract"
      });
    }
    
    const titleDeduction = TITLE_TYPES.find(t => t.value === historyData.titleType)?.deduction || 0;
    if (titleDeduction > 0 && titleDeduction < 1) {
      adjustments.push({
        label: `Title Status (${TITLE_TYPES.find(t => t.value === historyData.titleType)?.label})`,
        amount: baseValue * titleDeduction,
        type: "subtract"
      });
    }
    
    if (historyData.previousRental) {
      adjustments.push({ label: "Previous Rental Use", amount: baseValue * 0.075, type: "subtract" });
    }
    if (historyData.previousTaxi) {
      adjustments.push({ label: "Previous Taxi/Rideshare Use", amount: baseValue * 0.20, type: "subtract" });
    }
    if (historyData.missingServiceRecords) {
      adjustments.push({ label: "Missing Service Records", amount: baseValue * 0.075, type: "subtract" });
    }
    if (historyData.ownerCount > 2) {
      const ownerDeduction = (historyData.ownerCount - 2) * 0.025 * baseValue;
      adjustments.push({ label: `Multiple Owners (${historyData.ownerCount})`, amount: ownerDeduction, type: "subtract" });
    }
    
    const gradeInfo = NAAA_GRADES.find(g => g.grade === conditionData.naagGrade);
    const conditionDeduction = gradeInfo ? (5 - conditionData.naagGrade) * 0.05 * baseValue : 0;
    if (conditionDeduction > 0) {
      adjustments.push({
        label: `Condition Grade (${gradeInfo?.label} - Grade ${conditionData.naagGrade})`,
        amount: conditionDeduction,
        type: "subtract"
      });
    }
    
    let retailValue = baseValue;
    adjustments.forEach(adj => {
      if (adj.type === "add") retailValue += adj.amount;
      else if (adj.type === "subtract") retailValue -= adj.amount;
    });
    retailValue = Math.max(retailValue, 0);
    
    // Calculate reconditioning with NAAA grade baseline + mechanical inspection costs + manual items
    let reconditioning = totalReconditioningCost;
    
    // Add NAAA grade-based baseline reconditioning cost (average of range)
    if (gradeInfo && gradeInfo.reconditionLow > 0) {
      const gradeBaseCost = (gradeInfo.reconditionLow + gradeInfo.reconditionHigh) / 2;
      reconditioning += gradeBaseCost;
    }
    
    // Add mechanical inspection costs if issues detected
    if (conditionData.brakePadThickness < 2) {
      // Brake replacement needed: $250-$600 per axle average
      reconditioning += 425 * 2; // Both axles
    }
    if (conditionData.tireTreadDepth < 4) {
      // Tires need replacement: $600-$1000 mid-range set
      reconditioning += formData.bodyType === 'truck' || formData.bodyType === 'suv' ? 1000 : 800;
    }
    if (conditionData.checkEngineLight) {
      // Diagnostic + potential repairs
      reconditioning += 300;
    }
    
    // Apply safety buffer (higher for older/high-mileage vehicles)
    if (km > 100000 || vehicleAge > 8) {
      reconditioning = reconditioning * (1 + businessSettings.safetyBufferPercent / 100 * 2);
    } else {
      reconditioning = reconditioning * (1 + businessSettings.safetyBufferPercent / 100);
    }
    
    const profitMargin = retailValue * (businessSettings.profitMarginPercent / 100);
    const holdingCosts = businessSettings.holdingCostPerDay * businessSettings.estimatedHoldingDays;
    
    const tradeInOffer = retailValue - reconditioning - profitMargin - holdingCosts;
    const wholesaleValue = retailValue * 0.75;

    setAppraisal({
      decision,
      decisionReasons: reasons,
      retailValue,
      wholesaleValue,
      tradeInOffer: Math.max(tradeInOffer, 0),
      adjustments,
      reconditioning,
      profitMargin,
      holdingCosts,
      mileageAdjustment: mileageAdj,
      regionalMultiplier: regionalMult,
      seasonalFactor,
      conditionDeduction,
      accidentDeduction: baseValue * accidentDeduction,
      historyDeductions: (historyData.previousRental ? baseValue * 0.075 : 0) + 
                         (historyData.previousTaxi ? baseValue * 0.20 : 0) + 
                         (historyData.missingServiceRecords ? baseValue * 0.075 : 0),
      similarCars: similar.slice(0, 5)
    });
  };

  const getDecisionBadge = (decision: DecisionType) => {
    switch (decision) {
      case "buy":
        return <Badge className="bg-green-500 text-white" data-testid="badge-decision-buy"><CheckCircle className="w-3 h-3 mr-1" />Retail Ready</Badge>;
      case "wholesale":
        return <Badge className="bg-yellow-500 text-white" data-testid="badge-decision-wholesale"><AlertTriangle className="w-3 h-3 mr-1" />Wholesale Only</Badge>;
      case "reject":
        return <Badge className="bg-red-500 text-white" data-testid="badge-decision-reject"><XCircle className="w-3 h-3 mr-1" />Do Not Buy</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3" data-testid="text-page-title">
          <Calculator className="w-8 h-8 text-primary" />
          Canadian Vehicle Appraisal Tool
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Comprehensive trade-in valuation using NAAA condition grading, Canadian market data, and industry-standard formulas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card data-testid="card-vehicle-details">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <CarIcon className="w-5 h-5" />
                Vehicle Details
              </CardTitle>
              <CardDescription>Enter vehicle specs or decode VIN</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <div className="flex gap-2">
                  <Input 
                    id="vin"
                    data-testid="input-vin"
                    placeholder="17-digit VIN" 
                    value={formData.vin} 
                    onChange={e => setFormData({...formData, vin: e.target.value.toUpperCase()})} 
                    maxLength={17}
                    className="font-mono uppercase"
                  />
                  <Button 
                    variant="secondary" 
                    onClick={handleDecodeVin} 
                    disabled={isDecoding}
                    data-testid="button-decode-vin"
                  >
                    {isDecoding ? <span className="animate-spin mr-2">⟳</span> : <QrCode className="w-4 h-4 mr-2" />}
                    Decode
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Make *</Label>
                  <Select value={formData.make} onValueChange={val => setFormData({...formData, make: val})} data-testid="select-make">
                    <SelectTrigger data-testid="select-trigger-make">
                      <SelectValue placeholder="Select Make" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {POPULAR_MAKES.map(make => (
                        <SelectItem key={make} value={make} data-testid={`select-item-make-${make.toLowerCase()}`}>{make}</SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Model *</Label>
                  <Input 
                    data-testid="input-model"
                    placeholder="e.g. Camry" 
                    value={formData.model} 
                    onChange={e => setFormData({...formData, model: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input 
                    data-testid="input-year"
                    placeholder="YYYY" 
                    type="number"
                    value={formData.year} 
                    onChange={e => setFormData({...formData, year: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kilometers</Label>
                  <Input 
                    data-testid="input-kilometers"
                    placeholder="0" 
                    type="number"
                    value={formData.kilometers} 
                    onChange={e => setFormData({...formData, kilometers: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>MSRP ($)</Label>
                  <Input 
                    data-testid="input-msrp"
                    placeholder="35000" 
                    type="number"
                    value={formData.msrp} 
                    onChange={e => setFormData({...formData, msrp: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Trim {isLoadingTrims && <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>}</Label>
                  <Select value={formData.trim} onValueChange={val => setFormData({...formData, trim: val})}>
                    <SelectTrigger data-testid="select-trigger-trim">
                      <SelectValue placeholder="Select Trim" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {availableTrims.map(trim => (
                        <SelectItem key={trim} value={trim}>{trim}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Body Type</Label>
                  <Select value={formData.bodyType} onValueChange={val => setFormData({...formData, bodyType: val})}>
                    <SelectTrigger data-testid="select-trigger-bodytype">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck/Pickup</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="van">Van/Minivan</SelectItem>
                      <SelectItem value="convertible">Convertible</SelectItem>
                      <SelectItem value="compact">Compact/Economy</SelectItem>
                      <SelectItem value="luxury">Luxury Sedan</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Province (Sale Location)</Label>
                  <Select value={formData.province} onValueChange={val => setFormData({...formData, province: val})}>
                    <SelectTrigger data-testid="select-trigger-province">
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map(prov => (
                        <SelectItem key={prov.code} value={prov.code}>{prov.code} - {prov.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input 
                    data-testid="input-postal-code"
                    placeholder="A1A 1A1" 
                    value={formData.postalCode} 
                    onChange={e => setFormData({...formData, postalCode: e.target.value.toUpperCase()})} 
                  />
                </div>
              </div>

              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full flex items-center justify-between" data-testid="button-toggle-advanced">
                    <span className="flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Advanced Specs
                    </span>
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Transmission</Label>
                      <Select value={formData.transmission} onValueChange={val => setFormData({...formData, transmission: val})}>
                        <SelectTrigger data-testid="select-trigger-transmission"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatic">Automatic</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fuel Type</Label>
                      <Select value={formData.fuelType} onValueChange={val => setFormData({...formData, fuelType: val})}>
                        <SelectTrigger data-testid="select-trigger-fueltype"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gasoline">Gasoline</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Drivetrain</Label>
                      <Select value={formData.drivetrain} onValueChange={val => setFormData({...formData, drivetrain: val})}>
                        <SelectTrigger data-testid="select-trigger-drivetrain"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fwd">FWD</SelectItem>
                          <SelectItem value="rwd">RWD</SelectItem>
                          <SelectItem value="awd">AWD</SelectItem>
                          <SelectItem value="4wd">4WD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Cylinders</Label>
                      <Select value={formData.engineCylinders} onValueChange={val => setFormData({...formData, engineCylinders: val})}>
                        <SelectTrigger data-testid="select-trigger-cylinders"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Cyl</SelectItem>
                          <SelectItem value="4">4 Cyl</SelectItem>
                          <SelectItem value="6">6 Cyl (V6/I6)</SelectItem>
                          <SelectItem value="8">8 Cyl (V8)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Collapsible open={showCondition} onOpenChange={setShowCondition}>
            <Card data-testid="card-condition-assessment">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5" />
                      Condition Assessment
                    </span>
                    {showCondition ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CardTitle>
                  <CardDescription>NAAA grading and mechanical inspection</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">NAAA Condition Grade (0-5)</Label>
                    <div className="space-y-2">
                      {NAAA_GRADES.map(grade => (
                        <div 
                          key={grade.grade}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-all",
                            conditionData.naagGrade === grade.grade ? `${grade.bg} border-current ${grade.color}` : "hover:bg-muted/50"
                          )}
                          onClick={() => setConditionData({...conditionData, naagGrade: grade.grade})}
                          data-testid={`button-grade-${grade.grade}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold", grade.bg, grade.color)}>
                                {grade.grade}
                              </div>
                              <div>
                                <div className="font-medium">{grade.label}</div>
                                <div className="text-xs text-muted-foreground">{grade.description}</div>
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              {grade.grade > 0 && (
                                <div className="text-muted-foreground">
                                  ${grade.reconditionLow.toLocaleString()} - ${grade.reconditionHigh.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Mechanical Inspection</Label>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="brake-thickness">Brake Pad Thickness (mm)</Label>
                        <span className={cn("text-sm font-medium", conditionData.brakePadThickness >= 2 ? "text-green-600" : "text-red-600")}>
                          {conditionData.brakePadThickness}mm {conditionData.brakePadThickness >= 2 ? "✓ Pass" : "✗ Fail"}
                        </span>
                      </div>
                      <Slider
                        id="brake-thickness"
                        data-testid="slider-brake-thickness"
                        value={[conditionData.brakePadThickness]}
                        onValueChange={([val]) => setConditionData({...conditionData, brakePadThickness: val})}
                        min={0}
                        max={12}
                        step={0.5}
                      />
                      <p className="text-xs text-muted-foreground">≥2mm passes; &lt;2mm requires replacement ($150-$400/axle)</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="tire-tread">Tire Tread Depth (mm)</Label>
                        <span className={cn("text-sm font-medium", conditionData.tireTreadDepth >= 4 ? "text-green-600" : conditionData.tireTreadDepth >= 2 ? "text-yellow-600" : "text-red-600")}>
                          {conditionData.tireTreadDepth}mm {conditionData.tireTreadDepth >= 4 ? "✓ Good" : conditionData.tireTreadDepth >= 2 ? "⚠ Low" : "✗ Fail"}
                        </span>
                      </div>
                      <Slider
                        id="tire-tread"
                        data-testid="slider-tire-tread"
                        value={[conditionData.tireTreadDepth]}
                        onValueChange={([val]) => setConditionData({...conditionData, tireTreadDepth: val})}
                        min={0}
                        max={10}
                        step={0.5}
                      />
                      <p className="text-xs text-muted-foreground">≥4mm passes; &lt;2mm automatic fail ($400-$1,200 for set)</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Engine/Transmission Issues</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="check-engine"
                            data-testid="checkbox-check-engine"
                            checked={conditionData.checkEngineLight}
                            onCheckedChange={(checked) => setConditionData({...conditionData, checkEngineLight: !!checked})}
                          />
                          <label htmlFor="check-engine" className="text-sm cursor-pointer">Check Engine Light</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="rough-idle"
                            data-testid="checkbox-rough-idle"
                            checked={conditionData.roughIdle}
                            onCheckedChange={(checked) => setConditionData({...conditionData, roughIdle: !!checked})}
                          />
                          <label htmlFor="rough-idle" className="text-sm cursor-pointer">Rough Idle</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="excessive-smoke"
                            data-testid="checkbox-excessive-smoke"
                            checked={conditionData.excessiveSmoke}
                            onCheckedChange={(checked) => setConditionData({...conditionData, excessiveSmoke: !!checked})}
                          />
                          <label htmlFor="excessive-smoke" className="text-sm cursor-pointer">Excessive Smoke</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="trans-slipping"
                            data-testid="checkbox-trans-slipping"
                            checked={conditionData.transmissionSlipping}
                            onCheckedChange={(checked) => setConditionData({...conditionData, transmissionSlipping: !!checked})}
                          />
                          <label htmlFor="trans-slipping" className="text-sm cursor-pointer">Trans. Slipping</label>
                        </div>
                      </div>
                      {(conditionData.roughIdle || conditionData.excessiveSmoke || conditionData.transmissionSlipping) && (
                        <p className="text-xs text-orange-600 flex items-center gap-1 mt-2">
                          <AlertTriangle className="w-3 h-3" />
                          These issues trigger wholesale-only consideration
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Rust Assessment</Label>
                      <Select value={conditionData.rustLevel} onValueChange={val => setConditionData({...conditionData, rustLevel: val})}>
                        <SelectTrigger data-testid="select-trigger-rust">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RUST_LEVELS.map(rust => (
                            <SelectItem key={rust.value} value={rust.value}>
                              {rust.label} {rust.costHigh > 0 && `($${rust.costLow}-$${rust.costHigh})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {conditionData.rustLevel === "penetrating" && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Structural rust may trigger rejection
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={showHistory} onOpenChange={setShowHistory}>
            <Card data-testid="card-vehicle-history">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Vehicle History
                    </span>
                    {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CardTitle>
                  <CardDescription>Title status, accidents, and ownership</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title Status</Label>
                      <Select value={historyData.titleType} onValueChange={val => setHistoryData({...historyData, titleType: val})}>
                        <SelectTrigger data-testid="select-trigger-title">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TITLE_TYPES.map(title => (
                            <SelectItem key={title.value} value={title.value}>
                              {title.label} {title.deduction > 0 && title.deduction < 1 && `(-${title.deduction * 100}%)`}
                              {title.deduction === 1 && " (Reject)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Accident History</Label>
                      <Select value={historyData.accidentLevel} onValueChange={val => setHistoryData({...historyData, accidentLevel: val})}>
                        <SelectTrigger data-testid="select-trigger-accident">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ACCIDENT_LEVELS.map(acc => (
                            <SelectItem key={acc.value} value={acc.value}>
                              {acc.label} {acc.deduction > 0 && `(-${(acc.deduction * 100).toFixed(1)}%)`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Number of Accidents</Label>
                      <Input 
                        data-testid="input-accident-count"
                        type="number"
                        min={0}
                        value={historyData.accidentCount}
                        onChange={e => setHistoryData({...historyData, accidentCount: parseInt(e.target.value) || 0})}
                      />
                      {historyData.accidentCount >= 3 && (
                        <p className="text-xs text-orange-600">3+ accidents = wholesale only</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Owners</Label>
                      <Input 
                        data-testid="input-owner-count"
                        type="number"
                        min={1}
                        value={historyData.ownerCount}
                        onChange={e => setHistoryData({...historyData, ownerCount: parseInt(e.target.value) || 1})}
                      />
                      {historyData.ownerCount > 2 && (
                        <p className="text-xs text-muted-foreground">-2-3% per owner beyond 2nd</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Red Flags (Hard Rejection)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="odometer-tampering"
                          data-testid="checkbox-odometer-tampering"
                          checked={historyData.odometerTampering}
                          onCheckedChange={(checked) => setHistoryData({...historyData, odometerTampering: !!checked})}
                        />
                        <label htmlFor="odometer-tampering" className="text-sm cursor-pointer text-red-600">Odometer Tampering</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="active-recalls"
                          data-testid="checkbox-active-recalls"
                          checked={historyData.activeRecalls}
                          onCheckedChange={(checked) => setHistoryData({...historyData, activeRecalls: !!checked})}
                        />
                        <label htmlFor="active-recalls" className="text-sm cursor-pointer text-red-600">Active Safety Recalls</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="frame-damage"
                          data-testid="checkbox-frame-damage"
                          checked={historyData.frameDamage}
                          onCheckedChange={(checked) => setHistoryData({...historyData, frameDamage: !!checked})}
                        />
                        <label htmlFor="frame-damage" className="text-sm cursor-pointer text-red-600">Frame/Structural Damage</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="stolen-flag"
                          data-testid="checkbox-stolen-flag"
                          checked={historyData.stolenFlag}
                          onCheckedChange={(checked) => setHistoryData({...historyData, stolenFlag: !!checked})}
                        />
                        <label htmlFor="stolen-flag" className="text-sm cursor-pointer text-red-600">Stolen Vehicle Flag</label>
                      </div>
                    </div>
                    {historyData.frameDamage && (
                      <div className="flex items-center space-x-2 pl-4">
                        <Checkbox 
                          id="frame-repaired"
                          data-testid="checkbox-frame-repaired"
                          checked={historyData.frameDamageRepaired}
                          onCheckedChange={(checked) => setHistoryData({...historyData, frameDamageRepaired: !!checked})}
                        />
                        <label htmlFor="frame-repaired" className="text-sm cursor-pointer">Frame damage repaired (wholesale only)</label>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Usage History Deductions</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="prev-rental"
                          data-testid="checkbox-prev-rental"
                          checked={historyData.previousRental}
                          onCheckedChange={(checked) => setHistoryData({...historyData, previousRental: !!checked})}
                        />
                        <label htmlFor="prev-rental" className="text-sm cursor-pointer">Previous Rental (-5-10%)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="prev-taxi"
                          data-testid="checkbox-prev-taxi"
                          checked={historyData.previousTaxi}
                          onCheckedChange={(checked) => setHistoryData({...historyData, previousTaxi: !!checked})}
                        />
                        <label htmlFor="prev-taxi" className="text-sm cursor-pointer">Previous Taxi/Rideshare (-15-25%)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="missing-records"
                          data-testid="checkbox-missing-records"
                          checked={historyData.missingServiceRecords}
                          onCheckedChange={(checked) => setHistoryData({...historyData, missingServiceRecords: !!checked})}
                        />
                        <label htmlFor="missing-records" className="text-sm cursor-pointer">Missing Service Records (-5-10%)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="specialty-vehicle"
                          data-testid="checkbox-specialty"
                          checked={historyData.isSpecialtyVehicle}
                          onCheckedChange={(checked) => setHistoryData({...historyData, isSpecialtyVehicle: !!checked})}
                        />
                        <label htmlFor="specialty-vehicle" className="text-sm cursor-pointer">Specialty/Classic Vehicle</label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="bc-ab-history"
                      data-testid="checkbox-bc-ab-history"
                      checked={historyData.bcAlbertaHistory}
                      onCheckedChange={(checked) => setHistoryData({...historyData, bcAlbertaHistory: !!checked})}
                    />
                    <label htmlFor="bc-ab-history" className="text-sm cursor-pointer">
                      <span className="font-medium text-green-600">BC/Alberta Registration History</span>
                      <span className="text-muted-foreground ml-1">(+5-10% premium in Eastern Canada)</span>
                    </label>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={showReconditioning} onOpenChange={setShowReconditioning}>
            <Card data-testid="card-reconditioning">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      Reconditioning Estimate
                    </span>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono" data-testid="badge-reconditioning-total">
                        ${totalReconditioningCost.toLocaleString()}
                      </Badge>
                      {showReconditioning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </CardTitle>
                  <CardDescription>Add required repairs and maintenance</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {Object.entries(RECONDITIONING_COSTS).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                      <Label className="capitalize text-sm font-semibold">{category.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(items).map(([key, item]) => (
                          <Button
                            key={key}
                            variant="outline"
                            size="sm"
                            className="justify-start text-xs h-auto py-2"
                            onClick={() => addReconditioningItem(category, item.label, (item.low + item.high) / 2)}
                            data-testid={`button-add-recon-${category}-${key}`}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {item.label}
                            <span className="ml-auto text-muted-foreground">${item.low}-${item.high}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {reconditioningItems.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Added Items</Label>
                        {reconditioningItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                            <span className="text-sm flex-1">{item.item}</span>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => updateReconditioningQuantity(index, item.quantity - 1)}
                                data-testid={`button-recon-qty-minus-${index}`}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-6 text-center text-sm">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => updateReconditioningQuantity(index, item.quantity + 1)}
                                data-testid={`button-recon-qty-plus-${index}`}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <Input
                              type="number"
                              className="w-20 h-7 text-sm"
                              value={item.cost}
                              onChange={e => updateReconditioningCost(index, parseFloat(e.target.value) || 0)}
                              data-testid={`input-recon-cost-${index}`}
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-red-500 hover:text-red-600"
                              onClick={() => removeReconditioningItem(index)}
                              data-testid={`button-recon-remove-${index}`}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {conditionData.rustLevel !== "none" && (
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg text-sm">
                      <span className="font-medium">Rust Repair:</span> ${RUST_LEVELS.find(r => r.value === conditionData.rustLevel)?.costLow} - ${RUST_LEVELS.find(r => r.value === conditionData.rustLevel)?.costHigh}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={showBusinessSettings} onOpenChange={setShowBusinessSettings}>
            <Card data-testid="card-business-settings">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Business Settings
                    </span>
                    {showBusinessSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CardTitle>
                  <CardDescription>Profit margins and holding costs</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Profit Margin (%)</Label>
                      <Input
                        data-testid="input-profit-margin"
                        type="number"
                        min={5}
                        max={30}
                        value={businessSettings.profitMarginPercent}
                        onChange={e => setBusinessSettings({...businessSettings, profitMarginPercent: parseFloat(e.target.value) || 15})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Safety Buffer (%)</Label>
                      <Input
                        data-testid="input-safety-buffer"
                        type="number"
                        min={5}
                        max={30}
                        value={businessSettings.safetyBufferPercent}
                        onChange={e => setBusinessSettings({...businessSettings, safetyBufferPercent: parseFloat(e.target.value) || 12})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Holding Cost ($/day)</Label>
                      <Input
                        data-testid="input-holding-cost"
                        type="number"
                        min={20}
                        max={100}
                        value={businessSettings.holdingCostPerDay}
                        onChange={e => setBusinessSettings({...businessSettings, holdingCostPerDay: parseFloat(e.target.value) || 50})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Est. Holding Days</Label>
                      <Input
                        data-testid="input-holding-days"
                        type="number"
                        min={1}
                        max={60}
                        value={businessSettings.estimatedHoldingDays}
                        onChange={e => setBusinessSettings({...businessSettings, estimatedHoldingDays: parseInt(e.target.value) || 10})}
                      />
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Button 
            className="w-full h-14 text-lg font-semibold" 
            onClick={handleAppraise}
            disabled={!formData.make || !formData.model}
            data-testid="button-calculate-appraisal"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate Appraisal
          </Button>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {appraisal ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <Card className={cn(
                "border-2",
                appraisal.decision === "buy" && "border-green-500 bg-green-50/50 dark:bg-green-950/20",
                appraisal.decision === "wholesale" && "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20",
                appraisal.decision === "reject" && "border-red-500 bg-red-50/50 dark:bg-red-950/20"
              )} data-testid="card-decision">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <Shield className="w-6 h-6" />
                      Appraisal Decision
                    </CardTitle>
                    {getDecisionBadge(appraisal.decision)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {appraisal.decisionReasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm" data-testid={`text-decision-reason-${i}`}>
                        {appraisal.decision === "reject" ? (
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        ) : appraisal.decision === "wholesale" ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        )}
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {canSeeValuations && appraisal.decision !== "reject" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20" data-testid="card-retail-value">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Retail Value</div>
                      <div className="text-3xl font-bold" data-testid="text-retail-value">
                        ${Math.round(appraisal.retailValue).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Market listing price</p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20" data-testid="card-trade-in-offer">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-3 text-green-600 dark:text-green-400">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Trade-In Offer</div>
                      <div className="text-3xl font-bold" data-testid="text-trade-in-offer">
                        ${Math.round(appraisal.tradeInOffer).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Maximum acquisition price</p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20" data-testid="card-wholesale-value">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-3 text-orange-600 dark:text-orange-400">
                        <Gauge className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Wholesale Value</div>
                      <div className="text-3xl font-bold" data-testid="text-wholesale-value">
                        ${Math.round(appraisal.wholesaleValue).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Auction/dealer price</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {canSeeValuations && appraisal.decision !== "reject" && (
                <Card data-testid="card-adjustment-breakdown">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Valuation Breakdown
                    </CardTitle>
                    <CardDescription>Detailed adjustments applied to the base value</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {appraisal.adjustments.map((adj, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b last:border-0" data-testid={`row-adjustment-${i}`}>
                          <span className="text-sm">{adj.label}</span>
                          <span className={cn(
                            "font-mono font-medium",
                            adj.type === "add" ? "text-green-600" : "text-red-600"
                          )}>
                            {adj.type === "add" ? "+" : "-"}${Math.round(adj.amount).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Retail Value</span>
                        <span className="font-mono font-medium">${Math.round(appraisal.retailValue).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-red-600">
                        <span>- Reconditioning (incl. {businessSettings.safetyBufferPercent}% buffer)</span>
                        <span className="font-mono">-${Math.round(appraisal.reconditioning).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-red-600">
                        <span>- Profit Margin ({businessSettings.profitMarginPercent}%)</span>
                        <span className="font-mono">-${Math.round(appraisal.profitMargin).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-red-600">
                        <span>- Holding Costs ({businessSettings.estimatedHoldingDays} days × ${businessSettings.holdingCostPerDay})</span>
                        <span className="font-mono">-${Math.round(appraisal.holdingCosts).toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between font-semibold text-lg">
                        <span>Trade-In Offer</span>
                        <span className="font-mono text-green-600">${Math.round(appraisal.tradeInOffer).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="text-sm font-semibold mb-2">Applied Factors</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Regional:</span>
                          <span className="font-mono">{appraisal.regionalMultiplier.toFixed(2)}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Seasonal:</span>
                          <span className="font-mono">{appraisal.seasonalFactor.toFixed(3)}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Condition:</span>
                          <span className="font-mono">-${Math.round(appraisal.conditionDeduction).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mileage:</span>
                          <span className={cn("font-mono", appraisal.mileageAdjustment >= 0 ? "text-green-600" : "text-red-600")}>
                            {appraisal.mileageAdjustment >= 0 ? "+" : ""}${Math.round(appraisal.mileageAdjustment).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {showComparables && (
                <Card data-testid="card-comparables">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CarIcon className="w-5 h-5" />
                          Comparable Vehicles
                        </CardTitle>
                        <CardDescription>
                          Similar vehicles from inventory
                        </CardDescription>
                      </div>
                      <Switch
                        checked={showComparables}
                        onCheckedChange={setShowComparables}
                        data-testid="switch-show-comparables"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {appraisal.similarCars.length > 0 ? (
                      <div className="space-y-4">
                        {appraisal.similarCars.map((car, i) => (
                          <div key={car.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors" data-testid={`card-comparable-${i}`}>
                            <div>
                              <div className="font-bold">{car.year} {car.make} {car.model}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <span>{parseFloat(car.kilometers).toLocaleString()} km</span>
                                <span>•</span>
                                <span>{car.trim}</span>
                              </div>
                              {(car.transmission || car.fuelType) && (
                                <div className="text-xs text-muted-foreground flex gap-2 mt-1">
                                  {car.transmission && <span className="capitalize">{car.transmission}</span>}
                                  {car.fuelType && <span>• {car.fuelType}</span>}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-bold text-lg">${parseFloat(car.price).toLocaleString()}</div>
                                <Badge variant="outline" className="text-xs">Match</Badge>
                              </div>
                              <div className="flex gap-1">
                                {car.listingLink && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8"
                                          onClick={() => window.open(car.listingLink, '_blank')}
                                          data-testid={`button-view-listing-${i}`}
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>View Listing</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                {car.carfaxLink && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8"
                                          onClick={() => window.open(car.carfaxLink, '_blank')}
                                          data-testid={`button-view-carfax-${i}`}
                                        >
                                          <FileText className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>View Carfax</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-xl border border-dashed">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p>No direct matches found in inventory.</p>
                        <p className="text-sm opacity-60">Estimate is based on depreciation formulas.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-2xl bg-muted/30" data-testid="card-empty-state">
              <div className="w-24 h-24 bg-background rounded-full shadow-sm flex items-center justify-center mb-6">
                <Calculator className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Appraise</h3>
              <p className="text-muted-foreground max-w-md">
                Enter vehicle details, condition assessment, and history to generate a comprehensive Canadian market appraisal.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 text-left max-w-lg">
                <div className="p-4 bg-background rounded-lg border">
                  <h4 className="font-semibold text-sm mb-1">NAAA Grading</h4>
                  <p className="text-xs text-muted-foreground">Industry-standard 0-5 condition scale</p>
                </div>
                <div className="p-4 bg-background rounded-lg border">
                  <h4 className="font-semibold text-sm mb-1">Regional Pricing</h4>
                  <p className="text-xs text-muted-foreground">Province-specific market multipliers</p>
                </div>
                <div className="p-4 bg-background rounded-lg border">
                  <h4 className="font-semibold text-sm mb-1">Seasonal Factors</h4>
                  <p className="text-xs text-muted-foreground">Monthly demand adjustments</p>
                </div>
                <div className="p-4 bg-background rounded-lg border">
                  <h4 className="font-semibold text-sm mb-1">Buy/Wholesale/Reject</h4>
                  <p className="text-xs text-muted-foreground">Clear decision recommendations</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
