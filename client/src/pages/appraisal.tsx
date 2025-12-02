import { useState, useMemo, useEffect } from "react";
import { useCars, type Car } from "@/lib/api-hooks";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calculator, 
  Car as CarIcon, 
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Loader2,
  Lock,
  Settings,
  FileText,
  Link2,
  MoreHorizontal,
  Camera,
  Trash2,
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { decodeVIN } from "@/lib/nhtsa";

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

const BODY_TYPES = [
  "Sedan", "SUV", "Truck", "Coupe", "Hatchback", "Van", "Convertible", "Wagon"
];

const TRANSMISSIONS = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "cvt", label: "CVT" }
];

const COLOURS = [
  "Black", "White", "Silver", "Grey", "Red", "Blue", "Green", "Brown", "Beige", "Gold", "Orange", "Yellow", "Purple", "Other"
];

const CYLINDERS = ["3", "4", "5", "6", "8", "10", "12"];

const NAAA_GRADES = [
  { grade: 5, label: "Excellent", description: "Only minor chips; original finish; no tears, burns, or odors; all systems functional", reconditionLow: 500, reconditionHigh: 1000, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
  { grade: 4, label: "Good", description: "Minor scratches/chips; may need PDR or minor touch-up; minimal interior wear", reconditionLow: 1000, reconditionHigh: 1500, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { grade: 3, label: "Fair", description: "Normal wear including parking dings, small scratches, minor interior wear", reconditionLow: 1500, reconditionHigh: 2500, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
  { grade: 2, label: "Poor", description: "Multiple dents, scratches; panels may need replacement; interior burns/tears", reconditionLow: 2500, reconditionHigh: 4000, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/30" },
  { grade: 1, label: "Very Poor", description: "Severe abuse or major collision damage; cost-prohibitive reconditioning", reconditionLow: 4000, reconditionHigh: 6000, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
  { grade: 0, label: "Inoperative", description: "Non-running; parts missing; suitable only for salvage", reconditionLow: 0, reconditionHigh: 0, color: "text-gray-600", bg: "bg-gray-50 dark:bg-gray-950/30" }
];

const SIMPLE_CONDITIONS = [
  { value: "excellent", label: "Excellent", grade: 5, icon: Sparkles, description: "Like new, minimal wear" },
  { value: "good", label: "Good", grade: 4, icon: CheckCircle, description: "Normal wear, well maintained" },
  { value: "fair", label: "Fair", grade: 3, icon: Info, description: "Some scratches or dings" },
  { value: "poor", label: "Poor", grade: 2, icon: AlertTriangle, description: "Noticeable damage or wear" }
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

type DecisionType = "buy" | "wholesale" | "reject";

interface AppraisalResult {
  decision: DecisionType;
  decisionReasons: string[];
  retailValue: number;
  wholesaleValue: number;
  tradeInOffer: number;
  tradeInLow: number;
  tradeInHigh: number;
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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 16 }, (_, i) => currentYear - i);

function SectionHeader({ 
  title, 
  isOpen, 
  onToggle,
  className = ""
}: { 
  title: string; 
  isOpen?: boolean; 
  onToggle?: () => void;
  className?: string;
}) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between px-3 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm font-medium rounded-t cursor-pointer select-none",
        className
      )}
      onClick={onToggle}
    >
      <span>{title}</span>
      <div className="flex items-center gap-1">
        {onToggle && (
          isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </div>
  );
}

function FormRow({ 
  label, 
  children, 
  className = "" 
}: { 
  label: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 py-1", className)}>
      <Label className="w-24 text-xs text-slate-600 font-medium shrink-0 text-right">{label}</Label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function AppraisalPage() {
  const { data: allCars = [] } = useCars();
  const { toast } = useToast();
  const { user, isAdmin, isDataAnalyst } = useAuth();
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
    province: "ON",
    colour: ""
  });

  const [salespersonData, setSalespersonData] = useState({
    salesperson: "",
    appraiser: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
    isPurchase: false
  });

  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    homePhone: "",
    email: "",
    address: "",
    postalCode: ""
  });

  const [disposition, setDisposition] = useState<"retail" | "wholesale">("retail");
  const [reconditioning, setReconditioning] = useState(1500);
  const [certification, setCertification] = useState("");
  const [profit, setProfit] = useState(1600);
  const [priceRank, setPriceRank] = useState("");
  const [adjMarketPercent, setAdjMarketPercent] = useState(100);
  const [vRank, setVRank] = useState("");
  const [notes, setNotes] = useState("");

  const [simpleCondition, setSimpleCondition] = useState<string>("good");
  const [hasAccidents, setHasAccidents] = useState(false);
  const [hasCleanTitle, setHasCleanTitle] = useState(true);
  const [isOriginalOwner, setIsOriginalOwner] = useState(true);
  
  const [conditionData, setConditionData] = useState({
    naagGrade: 4,
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

  const [businessSettings] = useState({
    profitMarginPercent: 15,
    holdingCostPerDay: 50,
    estimatedHoldingDays: 10,
    safetyBufferPercent: 12
  });

  const [vehicleOfInterestOpen, setVehicleOfInterestOpen] = useState(false);
  const [vehicleAdditionalOpen, setVehicleAdditionalOpen] = useState(false);
  const [factoryEquipmentOpen, setFactoryEquipmentOpen] = useState(false);
  
  const [appraisal, setAppraisal] = useState<AppraisalResult | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const mapSimpleCondition = (condition: string): number => {
    const mapping: Record<string, number> = {
      excellent: 5,
      good: 4,
      fair: 3,
      poor: 2
    };
    return mapping[condition] || 4;
  };

  const syncSimpleToAdvanced = () => {
    const grade = mapSimpleCondition(simpleCondition);
    setConditionData(prev => ({ ...prev, naagGrade: grade }));
    
    setHistoryData(prev => ({
      ...prev,
      titleType: hasCleanTitle ? "clean" : "rebuilt",
      accidentLevel: hasAccidents ? "minor" : "none",
      accidentCount: hasAccidents ? 1 : 0,
      ownerCount: isOriginalOwner ? 1 : 2
    }));
  };

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
        title: "VIN Decoded", 
        description: `${decoded.year} ${decoded.make} ${decoded.model}${decoded.trim ? ` ${decoded.trim}` : ''}` 
      });
      
      handleAppraise();
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

  const calculateMileageAdjustment = (baseValue: number, kilometers: number, vehicleAge: number): number => {
    const expectedMileage = vehicleAge * 20000;
    const variance = kilometers - expectedMileage;
    const adjustmentPerKm = 0.02;
    let adjustment = variance * adjustmentPerKm * -1;
    
    const maxPenalty = baseValue * 0.15;
    const maxCredit = baseValue * 0.10;
    
    if (adjustment < -maxPenalty) adjustment = -maxPenalty;
    if (adjustment > maxCredit) adjustment = maxCredit;
    
    return adjustment;
  };

  const calculateDepreciation = (msrp: number, vehicleAge: number, bodyType: string, make: string): number => {
    const depRates = BODY_TYPE_DEPRECIATION[bodyType.toLowerCase()] || BODY_TYPE_DEPRECIATION["sedan"];
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
    
    const effectiveTitleType = hasCleanTitle ? "clean" : "rebuilt";
    const effectiveGrade = mapSimpleCondition(simpleCondition);
    const effectiveAccidentLevel = hasAccidents ? "minor" : "none";
    
    if (["salvage", "flood", "irreparable"].includes(effectiveTitleType)) {
      reasons.push(`${TITLE_TYPES.find(t => t.value === effectiveTitleType)?.label} - automatic rejection`);
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
    if (effectiveGrade === 0) {
      reasons.push("Vehicle is inoperative (Grade 0)");
      return { decision: "reject", reasons };
    }
    
    if (km >= 200000 && km <= 300000) {
      reasons.push("High mileage (200,000-300,000 km) - wholesale only");
    }
    if (vehicleAge >= 10 && vehicleAge <= 15) {
      reasons.push("Vehicle age 10-15 years - wholesale consideration");
    }
    if (effectiveTitleType === "rebuilt") {
      reasons.push("Rebuilt title - 20-40% value reduction");
    }
    if ((hasAccidents ? 1 : 0) >= 3) {
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

  const handleAppraise = async () => {
    if (!formData.make || !formData.model) {
      return;
    }

    setIsCalculating(true);
    syncSimpleToAdvanced();

    await new Promise(resolve => setTimeout(resolve, 300));

    const km = parseInt(formData.kilometers) || 0;
    const vehicleAge = formData.year ? new Date().getFullYear() - parseInt(formData.year) : 0;
    const msrp = parseFloat(formData.msrp) || 35000;
    const effectiveGrade = mapSimpleCondition(simpleCondition);
    
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
        label: `Mileage adjustment (${km.toLocaleString()} km)`,
        amount: mileageAdj,
        type: mileageAdj > 0 ? "add" : "subtract"
      });
    }
    
    const regionalMult = REGIONAL_MULTIPLIERS[formData.province] || 1.0;
    if (regionalMult !== 1.0) {
      const regionalAdj = baseValue * (regionalMult - 1);
      adjustments.push({
        label: `Regional market (${PROVINCES.find(p => p.code === formData.province)?.name || formData.province})`,
        amount: Math.abs(regionalAdj),
        type: regionalMult > 1 ? "add" : "subtract"
      });
    }
    
    if (historyData.bcAlbertaHistory && ["ON", "QC", "NB", "NS", "NL", "PE"].includes(formData.province)) {
      const bcAbPremium = baseValue * 0.075;
      adjustments.push({
        label: "BC/Alberta history (rust-free)",
        amount: bcAbPremium,
        type: "add"
      });
    }
    
    const seasonalFactor = getSeasonalFactor(formData.bodyType);
    if (seasonalFactor !== 1.0) {
      const seasonalAdj = baseValue * (seasonalFactor - 1);
      adjustments.push({
        label: "Seasonal adjustment",
        amount: Math.abs(seasonalAdj),
        type: seasonalFactor > 1 ? "add" : "subtract"
      });
    }
    
    const effectiveTitle = hasCleanTitle ? "clean" : "rebuilt";
    const titleInfo = TITLE_TYPES.find(t => t.value === effectiveTitle);
    if (titleInfo && titleInfo.deduction > 0 && titleInfo.deduction < 1) {
      const titleDeduction = baseValue * titleInfo.deduction;
      adjustments.push({
        label: `Title status (${titleInfo.label})`,
        amount: titleDeduction,
        type: "subtract"
      });
    }
    
    const effectiveAccident = hasAccidents ? "minor" : "none";
    const accidentInfo = ACCIDENT_LEVELS.find(a => a.value === effectiveAccident);
    if (accidentInfo && accidentInfo.deduction > 0) {
      const accidentDeduction = baseValue * accidentInfo.deduction;
      adjustments.push({
        label: `Accident history (${accidentInfo.label})`,
        amount: accidentDeduction,
        type: "subtract"
      });
    }
    
    const gradeInfo = NAAA_GRADES.find(g => g.grade === effectiveGrade);
    if (gradeInfo && effectiveGrade < 5) {
      const conditionDeduction = baseValue * ((5 - effectiveGrade) * 0.03);
      adjustments.push({
        label: `Condition (${gradeInfo.label})`,
        amount: conditionDeduction,
        type: "subtract"
      });
    }

    const effectiveOwnerCount = isOriginalOwner ? 1 : 2;
    if (effectiveOwnerCount > 2) {
      const ownerDeduction = baseValue * ((effectiveOwnerCount - 2) * 0.025);
      adjustments.push({
        label: `Multiple owners (${effectiveOwnerCount})`,
        amount: ownerDeduction,
        type: "subtract"
      });
    }
    
    if (historyData.previousRental) {
      adjustments.push({
        label: "Previous rental",
        amount: baseValue * 0.075,
        type: "subtract"
      });
    }
    if (historyData.previousTaxi) {
      adjustments.push({
        label: "Previous taxi/rideshare",
        amount: baseValue * 0.20,
        type: "subtract"
      });
    }
    if (historyData.missingServiceRecords) {
      adjustments.push({
        label: "Missing service records",
        amount: baseValue * 0.075,
        type: "subtract"
      });
    }
    
    let retailValue = baseValue;
    for (const adj of adjustments) {
      if (adj.type === "add") retailValue += adj.amount;
      else if (adj.type === "subtract") retailValue -= adj.amount;
    }
    
    const gradeRecondition = gradeInfo ? (gradeInfo.reconditionLow + gradeInfo.reconditionHigh) / 2 : 1500;
    let reconditioningCost = reconditioning || gradeRecondition;
    
    // Calculate profit margin: use percentage-based calculation per Canadian methodology,
    // or use manual override if user changed the profit field from default
    const calculatedProfitMargin = retailValue * (businessSettings.profitMarginPercent / 100);
    const profitMargin = profit !== 1600 ? profit : calculatedProfitMargin;
    
    const holdingCosts = businessSettings.holdingCostPerDay * businessSettings.estimatedHoldingDays;
    const safetyBuffer = retailValue * (businessSettings.safetyBufferPercent / 100);
    
    const wholesaleValue = retailValue * 0.82;
    const tradeInOffer = wholesaleValue - reconditioningCost - profitMargin - holdingCosts - safetyBuffer;
    
    const tradeInLow = Math.max(tradeInOffer * 0.92, 0);
    const tradeInHigh = tradeInOffer * 1.08;
    
    const conditionDeduction = baseValue * ((5 - effectiveGrade) * 0.03);
    const accidentDeduction = accidentInfo ? baseValue * accidentInfo.deduction : 0;
    let historyDeductions = 0;
    if (historyData.previousRental) historyDeductions += baseValue * 0.075;
    if (historyData.previousTaxi) historyDeductions += baseValue * 0.20;
    if (historyData.missingServiceRecords) historyDeductions += baseValue * 0.075;
    if (effectiveOwnerCount > 2) historyDeductions += baseValue * ((effectiveOwnerCount - 2) * 0.025);

    setAppraisal({
      decision,
      decisionReasons: reasons,
      retailValue: Math.max(retailValue, 0),
      wholesaleValue: Math.max(wholesaleValue, 0),
      tradeInOffer: Math.max(tradeInOffer, 0),
      tradeInLow: Math.max(tradeInLow, 0),
      tradeInHigh: Math.max(tradeInHigh, 0),
      adjustments,
      reconditioning: reconditioningCost,
      profitMargin,
      holdingCosts,
      mileageAdjustment: mileageAdj,
      regionalMultiplier: regionalMult,
      seasonalFactor,
      conditionDeduction,
      accidentDeduction,
      historyDeductions,
      similarCars: similar.slice(0, 5)
    });

    setIsCalculating(false);
  };

  useEffect(() => {
    if (formData.make && formData.model) {
      handleAppraise();
    }
  }, [formData, simpleCondition, hasAccidents, hasCleanTitle, isOriginalOwner, reconditioning, profit, adjMarketPercent, disposition]);

  const appraisedValue = useMemo(() => {
    if (!appraisal) return 0;
    return disposition === "retail" ? appraisal.retailValue : appraisal.wholesaleValue;
  }, [appraisal, disposition]);

  const askingPrice = useMemo(() => {
    if (!appraisal) return 0;
    const basePrice = disposition === "retail" ? appraisal.retailValue : appraisal.wholesaleValue;
    return basePrice * (adjMarketPercent / 100);
  }, [appraisal, adjMarketPercent, disposition]);

  const marketDaysSupply = useMemo(() => {
    if (!appraisal || appraisal.similarCars.length === 0) return "N/A";
    return Math.round(30 + Math.random() * 30).toString();
  }, [appraisal]);

  const likeMineCount = useMemo(() => {
    return appraisal?.similarCars.length || 0;
  }, [appraisal]);

  const adjCostToMarket = useMemo(() => {
    if (!appraisal || appraisal.tradeInOffer === 0) return "N/A";
    const percentage = ((appraisal.tradeInOffer / appraisal.retailValue) * 100).toFixed(1);
    return `${percentage}%`;
  }, [appraisal]);

  return (
    <div className="min-h-screen bg-slate-200 p-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 max-w-[1600px] mx-auto">
        
        {/* LEFT COLUMN - Vehicle Information */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white border border-slate-300 rounded shadow-sm">
            <SectionHeader title="Vehicle Information" />
            <div className="p-3 space-y-2">
              <FormRow label="VIN">
                <div className="flex gap-1">
                  <Input
                    data-testid="input-vin"
                    placeholder=""
                    value={formData.vin}
                    onChange={e => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                    className="h-7 text-xs font-mono uppercase flex-1"
                    maxLength={17}
                  />
                  <Button 
                    onClick={handleDecodeVin} 
                    disabled={isDecoding || formData.vin.length < 11}
                    data-testid="button-decode-vin"
                    className="h-7 px-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded"
                  >
                    {isDecoding ? <Loader2 className="w-3 h-3 animate-spin" /> : "GO"}
                  </Button>
                </div>
              </FormRow>

              <FormRow label="Odometer">
                <Input
                  data-testid="input-kilometers"
                  type="number"
                  placeholder=""
                  value={formData.kilometers}
                  onChange={e => setFormData({ ...formData, kilometers: e.target.value })}
                  className="h-7 text-xs"
                />
              </FormRow>

              <FormRow label="Year">
                <div className="flex gap-1">
                  <Select value={formData.year} onValueChange={val => setFormData({ ...formData, year: val })}>
                    <SelectTrigger data-testid="select-trigger-year" className="h-7 text-xs flex-1">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </FormRow>

              <FormRow label="Make">
                <Select value={formData.make} onValueChange={val => setFormData({ ...formData, make: val })}>
                  <SelectTrigger data-testid="select-trigger-make" className="h-7 text-xs">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_MAKES.map(make => (
                      <SelectItem key={make} value={make}>{make}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormRow>

              <FormRow label="Model">
                <Input
                  data-testid="input-model"
                  placeholder=""
                  value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                  className="h-7 text-xs"
                />
              </FormRow>

              <FormRow label="Series">
                <Select value={formData.trim} onValueChange={val => setFormData({ ...formData, trim: val })}>
                  <SelectTrigger data-testid="select-trigger-trim" className="h-7 text-xs">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="sport">Sport</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormRow>

              <FormRow label="Body Type">
                <Select value={formData.bodyType} onValueChange={val => setFormData({ ...formData, bodyType: val.toLowerCase() })}>
                  <SelectTrigger data-testid="select-trigger-body" className="h-7 text-xs">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {BODY_TYPES.map(type => (
                      <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormRow>

              <FormRow label="# Cylinders">
                <Select value={formData.engineCylinders} onValueChange={val => setFormData({ ...formData, engineCylinders: val })}>
                  <SelectTrigger data-testid="select-trigger-cylinders" className="h-7 text-xs w-20">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {CYLINDERS.map(cyl => (
                      <SelectItem key={cyl} value={cyl}>{cyl}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormRow>

              <FormRow label="Transmission">
                <Select value={formData.transmission} onValueChange={val => setFormData({ ...formData, transmission: val })}>
                  <SelectTrigger data-testid="select-trigger-transmission" className="h-7 text-xs">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSMISSIONS.map(trans => (
                      <SelectItem key={trans.value} value={trans.value}>{trans.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormRow>

              <FormRow label="Colour">
                <Select value={formData.colour} onValueChange={val => setFormData({ ...formData, colour: val })}>
                  <SelectTrigger data-testid="select-trigger-colour" className="h-7 text-xs">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOURS.map(colour => (
                      <SelectItem key={colour} value={colour}>{colour}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormRow>

              <Collapsible open={factoryEquipmentOpen} onOpenChange={setFactoryEquipmentOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-blue-600 hover:text-blue-800 p-0 h-6" data-testid="button-factory-equipment">
                    <FileText className="w-3 h-3 mr-1" />
                    Factory Equipment
                    {factoryEquipmentOpen ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-1">
                  <div className="text-xs text-slate-500 italic">Factory equipment options will appear here after VIN decode</div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded shadow-sm">
            <Collapsible open={vehicleAdditionalOpen} onOpenChange={setVehicleAdditionalOpen}>
              <CollapsibleTrigger asChild>
                <SectionHeader 
                  title="Vehicle Additional" 
                  isOpen={vehicleAdditionalOpen}
                  onToggle={() => setVehicleAdditionalOpen(!vehicleAdditionalOpen)}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 space-y-2">
                  <FormRow label="Province">
                    <Select value={formData.province} onValueChange={val => setFormData({ ...formData, province: val })}>
                      <SelectTrigger data-testid="select-trigger-province" className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVINCES.map(prov => (
                          <SelectItem key={prov.code} value={prov.code}>{prov.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormRow>
                  <FormRow label="Est. MSRP">
                    <Input
                      data-testid="input-msrp"
                      type="number"
                      placeholder="35000"
                      value={formData.msrp}
                      onChange={e => setFormData({ ...formData, msrp: e.target.value })}
                      className="h-7 text-xs"
                    />
                  </FormRow>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="bg-white border border-slate-300 rounded shadow-sm">
            <SectionHeader title="Vehicle Condition" />
            <div className="p-3 space-y-3">
              <div className="grid grid-cols-4 gap-1">
                {SIMPLE_CONDITIONS.map(condition => {
                  const Icon = condition.icon;
                  return (
                    <button
                      key={condition.value}
                      type="button"
                      data-testid={`button-condition-${condition.value}`}
                      onClick={() => setSimpleCondition(condition.value)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded border transition-all text-xs",
                        simpleCondition === condition.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 hover:border-slate-400"
                      )}
                    >
                      <Icon className={cn(
                        "w-4 h-4 mb-1",
                        condition.value === "excellent" && "text-green-500",
                        condition.value === "good" && "text-blue-500",
                        condition.value === "fair" && "text-yellow-500",
                        condition.value === "poor" && "text-orange-500"
                      )} />
                      <span className="font-medium">{condition.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t">
                <div className="font-medium text-xs mb-2">Photos</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-6" data-testid="button-add-photo">
                    <Camera className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-6" data-testid="button-delete-photo">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
                <div className="mt-2 text-xs text-slate-500 italic">
                  Appraisal images of vehicles that are not in inventory are kept for 60 days.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded shadow-sm">
            <SectionHeader title="Notes" />
            <div className="p-3">
              <Textarea
                data-testid="textarea-notes"
                placeholder="Enter appraisal notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="min-h-[80px] text-xs resize-none"
              />
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN - Salesperson/Customer Info */}
        <div className="lg:col-span-5 space-y-2">
          <div className="bg-white border border-slate-300 rounded shadow-sm">
            <SectionHeader title="Salesperson/Appraiser Information" />
            <div className="p-3 space-y-2">
              <FormRow label="Salesperson">
                <Input
                  data-testid="input-salesperson"
                  placeholder=""
                  value={salespersonData.salesperson}
                  onChange={e => setSalespersonData({ ...salespersonData, salesperson: e.target.value })}
                  className="h-7 text-xs"
                />
              </FormRow>

              <FormRow label="Appraiser">
                <Select 
                  value={salespersonData.appraiser} 
                  onValueChange={val => setSalespersonData({ ...salespersonData, appraiser: val })}
                >
                  <SelectTrigger data-testid="select-trigger-appraiser" className="h-7 text-xs">
                    <SelectValue placeholder={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Select Appraiser"} />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.firstName && user?.lastName && (
                      <SelectItem value={`${user.firstName} ${user.lastName}`}>{user.firstName} {user.lastName}</SelectItem>
                    )}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormRow>

              <div className="flex items-center gap-2 py-1">
                <Label className="w-24 text-xs text-slate-600 font-medium shrink-0 text-right">Purchase</Label>
                <Checkbox
                  data-testid="checkbox-purchase"
                  checked={salespersonData.isPurchase}
                  onCheckedChange={(checked) => setSalespersonData({ ...salespersonData, isPurchase: !!checked })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded shadow-sm">
            <SectionHeader title="Customer Information" />
            <div className="p-3 space-y-2">
              <FormRow label="First Name">
                <Input
                  data-testid="input-first-name"
                  placeholder=""
                  value={customerData.firstName}
                  onChange={e => setCustomerData({ ...customerData, firstName: e.target.value })}
                  className="h-7 text-xs"
                />
              </FormRow>

              <FormRow label="Last Name">
                <Input
                  data-testid="input-last-name"
                  placeholder=""
                  value={customerData.lastName}
                  onChange={e => setCustomerData({ ...customerData, lastName: e.target.value })}
                  className="h-7 text-xs"
                />
              </FormRow>

              <FormRow label="Home Phone">
                <Input
                  data-testid="input-phone"
                  placeholder=""
                  value={customerData.homePhone}
                  onChange={e => setCustomerData({ ...customerData, homePhone: e.target.value })}
                  className="h-7 text-xs"
                />
              </FormRow>

              <FormRow label="Email">
                <Input
                  data-testid="input-email"
                  type="email"
                  placeholder=""
                  value={customerData.email}
                  onChange={e => setCustomerData({ ...customerData, email: e.target.value })}
                  className="h-7 text-xs"
                />
              </FormRow>

              <FormRow label="Address">
                <Input
                  data-testid="input-address"
                  placeholder=""
                  value={customerData.address}
                  onChange={e => setCustomerData({ ...customerData, address: e.target.value })}
                  className="h-7 text-xs"
                />
              </FormRow>

              <FormRow label="Postal Code">
                <Input
                  data-testid="input-postal-code"
                  placeholder=""
                  value={customerData.postalCode}
                  onChange={e => setCustomerData({ ...customerData, postalCode: e.target.value })}
                  className="h-7 text-xs w-28"
                />
              </FormRow>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded shadow-sm">
            <Collapsible open={vehicleOfInterestOpen} onOpenChange={setVehicleOfInterestOpen}>
              <CollapsibleTrigger asChild>
                <SectionHeader 
                  title="Vehicle of Interest" 
                  isOpen={vehicleOfInterestOpen}
                  onToggle={() => setVehicleOfInterestOpen(!vehicleOfInterestOpen)}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 space-y-2 text-xs text-slate-500 italic">
                  Vehicle customer is interested in purchasing (if trade-in scenario)
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Quick History Check */}
          <div className="bg-white border border-slate-300 rounded shadow-sm">
            <SectionHeader title="Quick History Check" />
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between py-1 px-2 bg-slate-50 rounded">
                <span className="text-xs">Any accidents?</span>
                <Checkbox
                  data-testid="checkbox-accidents"
                  checked={hasAccidents}
                  onCheckedChange={(checked) => setHasAccidents(!!checked)}
                />
              </div>
              <div className="flex items-center justify-between py-1 px-2 bg-slate-50 rounded">
                <span className="text-xs">Clean title?</span>
                <Checkbox
                  data-testid="checkbox-clean-title"
                  checked={hasCleanTitle}
                  onCheckedChange={(checked) => setHasCleanTitle(!!checked)}
                />
              </div>
              <div className="flex items-center justify-between py-1 px-2 bg-slate-50 rounded">
                <span className="text-xs">Original owner?</span>
                <Checkbox
                  data-testid="checkbox-original-owner"
                  checked={isOriginalOwner}
                  onCheckedChange={(checked) => setIsOriginalOwner(!!checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Summary Panel */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white border border-slate-300 rounded shadow-sm">
            <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm font-medium rounded-t">
              <span>Summary</span>
              <span className="text-blue-300 text-xs cursor-pointer hover:underline">Tags</span>
            </div>
            <div className="p-3 space-y-4">
              {/* Disposition */}
              <div className="flex items-center gap-4">
                <Label className="text-xs font-medium w-24">Disposition</Label>
                <div className="flex gap-4" data-testid="radio-disposition">
                  <button
                    type="button"
                    onClick={() => setDisposition("retail")}
                    className="flex items-center gap-1"
                    data-testid="radio-retail"
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      disposition === "retail" ? "border-green-500" : "border-slate-300"
                    )}>
                      {disposition === "retail" && <div className="w-2 h-2 rounded-full bg-green-500" />}
                    </div>
                    <span className="text-xs">Retail</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisposition("wholesale")}
                    className="flex items-center gap-1"
                    data-testid="radio-wholesale"
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      disposition === "wholesale" ? "border-green-500" : "border-slate-300"
                    )}>
                      {disposition === "wholesale" && <div className="w-2 h-2 rounded-full bg-green-500" />}
                    </div>
                    <span className="text-xs">Wholesale</span>
                  </button>
                </div>
              </div>

              {/* Reconditioning */}
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium w-24">Reconditioning</Label>
                <div className="flex items-center gap-1 flex-1">
                  <Input
                    data-testid="input-reconditioning"
                    type="number"
                    value={reconditioning}
                    onChange={e => setReconditioning(parseInt(e.target.value) || 0)}
                    className="h-7 text-xs w-24"
                  />
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>

              {/* Certification */}
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium w-24">Certification</Label>
                <Input
                  data-testid="input-certification"
                  value={certification}
                  onChange={e => setCertification(e.target.value)}
                  className="h-7 text-xs flex-1"
                />
              </div>

              {/* Hero Values Section */}
              <div className="bg-slate-100 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="text-xs text-slate-600 font-medium mb-1">Appraised Value</div>
                    <div className="text-2xl font-bold text-slate-800" data-testid="text-appraised-value">
                      ${Math.round(appraisedValue).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-16">
                    <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-xs text-slate-600 font-medium mb-1">Profit</div>
                    <Input
                      data-testid="input-profit"
                      type="number"
                      value={profit}
                      onChange={e => setProfit(parseInt(e.target.value) || 0)}
                      className="h-8 text-lg font-bold text-center w-24 mx-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Market Analysis */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-xs font-medium block mb-1">Price Rank</Label>
                    <Input
                      data-testid="input-price-rank"
                      value={priceRank}
                      onChange={e => setPriceRank(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs font-medium block mb-1">Adj % of Market</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        data-testid="input-adj-market"
                        type="number"
                        value={adjMarketPercent}
                        onChange={e => setAdjMarketPercent(parseInt(e.target.value) || 100)}
                        className="h-7 text-xs w-16"
                      />
                      <span className="text-xs text-slate-500">95%-105%</span>
                    </div>
                  </div>
                </div>

                <div className="px-2">
                  <Slider
                    data-testid="slider-adj-market"
                    value={[adjMarketPercent]}
                    onValueChange={([val]) => setAdjMarketPercent(val)}
                    min={95}
                    max={105}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-xs font-medium block mb-1">vRank</Label>
                    <Input
                      data-testid="input-vrank"
                      value={vRank}
                      onChange={e => setVRank(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs font-medium block mb-1">Asking Price</Label>
                    <div className="h-7 px-2 border rounded bg-slate-50 flex items-center text-sm font-semibold" data-testid="text-asking-price">
                      ${Math.round(askingPrice).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Market Days Supply:</span>
                  <span className="font-medium" data-testid="text-market-days">{marketDaysSupply}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Like Mine:</span>
                  <span className="font-medium" data-testid="text-like-mine">{likeMineCount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Adj. % Cost to Market:</span>
                  <span className="font-medium" data-testid="text-cost-to-market">{adjCostToMarket}</span>
                </div>
              </div>

              {/* Decision Badge */}
              {appraisal && (
                <div className="border-t pt-3 flex justify-center">
                  {appraisal.decision === "buy" && (
                    <Badge className="bg-green-600 text-white px-3 py-1" data-testid="badge-decision-buy">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Buy for Retail
                    </Badge>
                  )}
                  {appraisal.decision === "wholesale" && (
                    <Badge className="bg-yellow-600 text-white px-3 py-1" data-testid="badge-decision-wholesale">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Wholesale Only
                    </Badge>
                  )}
                  {appraisal.decision === "reject" && (
                    <Badge className="bg-red-600 text-white px-3 py-1" data-testid="badge-decision-reject">
                      <XCircle className="w-3 h-3 mr-1" />
                      Pass
                    </Badge>
                  )}
                </div>
              )}

              {/* Trade-In Value Display */}
              {appraisal && (
                <div className="border-t pt-3 text-center">
                  <div className="text-xs text-slate-600 mb-1">Suggested Trade-In Value</div>
                  <div className="text-lg font-bold text-blue-600" data-testid="text-trade-in-value">
                    ${Math.round(appraisal.tradeInLow).toLocaleString()} - ${Math.round(appraisal.tradeInHigh).toLocaleString()}
                  </div>
                </div>
              )}

              {/* Action Buttons Row 1 */}
              <div className="flex flex-wrap gap-2 border-t pt-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs h-7" data-testid="dropdown-reports">
                      <FileText className="w-3 h-3 mr-1" />
                      Reports
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="text-xs">
                      <img src="https://www.carfax.ca/img/cfx-logo-en.svg" alt="CARFAX" className="w-14 h-3 mr-2" />
                      CARFAX Report
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Vehicle History Report</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Market Analysis Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs h-7" data-testid="dropdown-disclosure">
                      <AlertTriangle className="w-3 h-3 mr-1 text-red-500" />
                      Disclosure
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="text-xs">Add Disclosure</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">View All Disclosures</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs h-7" data-testid="dropdown-bill-of-sale">
                      <FileText className="w-3 h-3 mr-1 text-red-500" />
                      Bill of Sale
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="text-xs">Create Bill of Sale</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">View Templates</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs h-7" data-testid="dropdown-links">
                      <Link2 className="w-3 h-3 mr-1" />
                      Links
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="text-xs">Link to Inventory</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Link to Customer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Action Buttons Row 2 */}
              <div className="flex gap-2 justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-4" data-testid="dropdown-actions">
                      Actions
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="text-xs">Save Appraisal</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Print Appraisal</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Email to Customer</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Add to Inventory</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" className="text-xs h-8 px-4" data-testid="button-cancel">
                  Cancel
                </Button>
              </div>
            </div>
          </div>

          {/* Calculation Details - Collapsible */}
          {appraisal && (
            <Collapsible>
              <div className="bg-white border border-slate-300 rounded shadow-sm">
                <CollapsibleTrigger className="w-full">
                  <SectionHeader title="Calculation Details" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-600">Estimated Retail Value</span>
                      <span className="font-medium">${Math.round(appraisal.retailValue).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-600">Wholesale Value (82%)</span>
                      <span className="font-medium">${Math.round(appraisal.wholesaleValue).toLocaleString()}</span>
                    </div>
                    
                    {appraisal.adjustments.map((adj, i) => (
                      <div key={i} className="flex justify-between py-1 border-b">
                        <span className="text-slate-600">{adj.label}</span>
                        <span className={cn(
                          "font-medium",
                          adj.type === "add" ? "text-green-600" : "text-red-600"
                        )}>
                          {adj.type === "add" ? "+" : "-"}${Math.round(adj.amount).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-600">Est. Reconditioning</span>
                      <span className="font-medium text-red-600">-${Math.round(appraisal.reconditioning).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-600">Profit Margin</span>
                      <span className="font-medium text-red-600">-${Math.round(appraisal.profitMargin).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-slate-600">Holding Costs</span>
                      <span className="font-medium text-red-600">-${Math.round(appraisal.holdingCosts).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between py-2 bg-slate-100 rounded px-2 mt-2">
                      <span className="font-semibold">Trade-In Offer</span>
                      <span className="font-bold text-blue-600">${Math.round(appraisal.tradeInOffer).toLocaleString()}</span>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}

          {/* Comparable Vehicles */}
          {appraisal && appraisal.similarCars.length > 0 && (
            <Collapsible>
              <div className="bg-white border border-slate-300 rounded shadow-sm">
                <CollapsibleTrigger className="w-full">
                  <SectionHeader title={`Comparable Vehicles (${appraisal.similarCars.length})`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 space-y-2">
                    {appraisal.similarCars.map((car, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-slate-50 text-xs">
                        <div>
                          <span className="font-medium">{car.year} {car.make} {car.model}</span>
                          {car.trim && <span className="text-slate-500 ml-1">{car.trim}</span>}
                        </div>
                        <span className="font-semibold">${parseFloat(car.price).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  );
}
