# AutoManager - Complete Functional Documentation
**All Tabs, Features, and How Everything Works**

---

## TABLE OF CONTENTS
1. [TAB 1: INVENTORY MANAGEMENT](#tab-1-inventory-management)
2. [TAB 2: ADD VEHICLES (UPLOAD)](#tab-2-add-vehicles-upload)
3. [TAB 3: APPRAISAL TOOL](#tab-3-appraisal-tool)
4. [System-Wide Features](#system-wide-features)

---

## TAB 1: INVENTORY MANAGEMENT

**Location:** Home page / Main tab / "Inventory" in navigation

**Purpose:** View, manage, search, filter, and control all vehicles across all dealerships

### A. DEALERSHIP MANAGEMENT

#### What It Does
The left sidebar displays all your dealerships. You can click on a dealership to view only its vehicles, or manage the dealership itself.

#### Features

**1. View Dealerships**
- List of all registered dealerships appears in the left sidebar
- Each dealership shows: name, location, address details
- Click on any dealership to filter the inventory to show only that dealership's cars
- Selecting a dealership keeps it selected as you perform other actions (like adding vehicles)

**2. Add New Dealership**
- Click "New Dealership" button in top right
- A dialog opens with these fields:
  - **Name** (required) - Business name of dealership
  - **Location** (required) - City or region
  - **Province** (required) - Canadian province code (AB, BC, ON, QC, etc.)
  - **Address** (required) - Full street address
  - **Postal Code** (required) - Postal code
  - **Phone** (required) - Contact phone number
- Validation: All fields must be filled before saving
- After adding: Dealership immediately appears in the sidebar and is available for adding vehicles

**3. Edit Dealership**
- Hover over a dealership in the sidebar
- Click the edit icon (pencil)
- Dialog opens with current dealership information
- Modify any fields
- Click "Update" to save changes
- All vehicles associated with this dealership remain linked

**4. Delete Dealership**
- Hover over a dealership in the sidebar
- Click the delete icon (trash bin)
- A confirmation dialog appears: "Delete this dealership and all its cars?"
- If confirmed: The dealership AND ALL its vehicles are permanently deleted
- Cascade deletion: Removing a dealership removes all cars connected to it
- The sidebar updates immediately

---

### B. VEHICLE INVENTORY TABLE

#### Display
The main area shows a table/list of all vehicles (or filtered vehicles if filters are applied).

#### What Each Vehicle Row Shows
- **Year, Make, Model** - Vehicle identification (e.g., 2020 Toyota Camry)
- **Color** - Exterior color
- **Trim** - Trim level (LX, EX, Sport, etc.)
- **Price** - Asking price in dollars
- **Kilometers** - Odometer reading
- **Transmission** - Manual or Automatic
- **Status Badge** - Color-coded:
  - Green = Available (can be sold)
  - Yellow = Pending (sale in progress)
  - Gray = Sold (already sold)

#### Vehicle Count Badge
Top of page shows: "X Vehicles" badge indicating total filtered vehicles

#### Dealership Info Per Car
When a dealership is selected, the displayed cars show that dealership's name and location

---

### C. GLOBAL SEARCH

#### How It Works
Search box at the top of the inventory allows real-time searching.

#### What It Searches
Searches across ALL these fields simultaneously:
- VIN (Vehicle Identification Number)
- Make (manufacturer name)
- Model (vehicle model name)
- Color (exterior color)
- Trim (trim level)
- Transmission type (manual/automatic)
- Year (model year)
- Carfax status
- Body type (sedan, SUV, truck, etc.)
- Fuel type (gasoline, diesel, hybrid, electric)
- Drivetrain (FWD, RWD, AWD, 4WD)
- Engine cylinders
- Features (all selected features)
- Notes (any notes entered for the vehicle)
- Dealership name and province
- Stock number

#### Behavior
- Type any text in the search box
- Results filter instantly (no need to press Enter)
- Matching vehicles stay visible, non-matching ones hide
- Clearing the search shows all vehicles again
- Search is case-insensitive (typing "toyota" finds "Toyota")

---

### D. SORTING

#### Sort Options
Click the "Sort" button to choose sorting order:

**Price Options:**
- Price: High to Low (most expensive first)
- Price: Low to High (least expensive first)

**Year Options:**
- Year: Newest (2025 models first)
- Year: Oldest (older models first)

**Mileage Options:**
- Mileage: Low to High (lowest kilometers first)

**Default Sort:**
- Added Date: Newest additions appear first

#### How It Works
- Select a sort option
- Inventory list immediately reorders
- Sort persists as you search or filter
- You can combine sort with search/filters

---

### E. ADVANCED FILTERS

#### Opening Filters
Click the "Filters" button to expand the filter panel. The panel slides down showing all available filter options.

#### Filter Types

**1. Standard Dropdown Filters (appears in top grid):**

- **Make** - Select vehicle manufacturer (Acura, BMW, Ford, Honda, Toyota, etc.)
  - Selecting a make updates the available models below
  - Shows: "Any Make" to clear the filter

- **Model** - Select vehicle model
  - Only shows models available in your inventory
  - Dependent on Make selection
  - Shows: "Any Model" to clear

- **Color** - Select exterior color
  - Options: Black, White, Silver, Gray, Red, Blue, Brown, Green, Beige, Gold, Orange, Yellow, Purple, Other
  - Shows: "Any Color" to clear

- **Trim** - Filter by trim level
  - Only available if Make is selected first
  - Shows: "Any Trim" to clear
  - Disabled until you select a Make

- **VIN Contains** - Text input
  - Searches for partial VIN match (case-insensitive)
  - Example: type "2T1" to find all Toyota VINs starting with that

- **VIN Starts With** - Text input
  - Filters VIN by first characters only
  - Max 3 characters
  - Example: type "1" to find all vehicles with VIN starting with "1"

- **Province** - Filter by dealership province
  - Type province code (ON, BC, AB, etc.)
  - Searches dealership province field

**2. Range Sliders (middle section):**

- **Year Range** - Slider with dual handles
  - Range: 1995 to 2025
  - Shows selected range: "1995 - 2025"
  - Drag left handle to set minimum year
  - Drag right handle to set maximum year
  - Only filters if you move from default range

- **Price Range** - Slider for vehicle price
  - Range: $0 to $200,000
  - Shown in increments of $5,000
  - Shows: "$0 - $200,000"
  - Filters vehicles within selected price band

- **Kilometers Range** - Slider for mileage
  - Range: 0 to 300,000 km
  - Shown in increments of 10,000 km
  - Shows: "0 - 300,000 km"
  - Filters by odometer reading

**3. Multi-Select Checkboxes (bottom section):**

**Transmission (select multiple):**
- Automatic
- Manual
- Check any combination and show only matching vehicles

**Drivetrain (select multiple):**
- FWD (Front Wheel Drive)
- RWD (Rear Wheel Drive)
- AWD (All Wheel Drive)
- 4WD (4 Wheel Drive)
- 4x4 (4x4)

**Fuel Type (select multiple):**
- Gasoline
- Diesel
- Hybrid
- Electric

**Body Type (select multiple):**
- Sedan
- SUV
- Truck
- Coupe
- Hatchback
- Van
- Convertible

**Engine Cylinders (select multiple):**
- 3, 4, 5, 6, 8, 10, 12 cylinder options

#### How Filters Work Together
- All filters work together (AND logic)
- Example: Select "Ford" make + "2020" year + "$20,000-$30,000" price = shows only Ford vehicles from 2020 in that price range
- Multi-select filters also work together: selecting "Automatic" AND "Gasoline" shows only vehicles with both

#### Clear All Filters
A button (or auto-clear when collapsing) resets:
- All text filters
- All sliders to default ranges
- All checkboxes to unchecked

---

### F. VEHICLE ACTIONS

#### Edit Vehicle
Click "Edit" button on any vehicle row:

**What Opens:**
A large dialog with ALL vehicle fields available:

**Basic Information:**
- VIN (17-character field)
- Stock Number (dealer's internal reference)
- Make (dropdown, 39+ manufacturers)
- Model (text input)
- Year (number input)
- Trim (dropdown, loads available trims for selected make)
- Color (dropdown, 14 colors)
- Condition (New, Used, Certified Pre-Owned)

**Pricing & Mileage:**
- Price (dollar amount)
- Kilometers (odometer reading)

**Specifications:**
- Transmission (Automatic, Manual, CVT)
- Fuel Type (Gasoline, Diesel, Hybrid, Electric)
- Body Type (Sedan, SUV, Truck, Van, Coupe, Hatchback)

**Advanced Section (expands when clicked):**
- Drivetrain (FWD, RWD, AWD, 4WD, 4x4)
- Engine Cylinders (3-12)
- Engine Displacement (in liters)
- Carfax Link (URL to Carfax report)
- Notes (large text area for any additional details)

**Features Selection:**
- 45+ checkboxes for vehicle features:
  - Seating: Leather Seats, Heated Seats, Ventilated Seats, etc.
  - Safety: Blind Spot Monitor, Collision Warning, etc.
  - Technology: Navigation, Apple CarPlay, Android Auto, etc.
  - Comfort: Sunroof, Climate Control, etc.
  - Lights: LED Headlights, Fog Lights, etc.
  - Convenience: Remote Start, Keyless Entry, Power Liftgate, etc.

**VIN Decoder Button:**
- Click button next to VIN field
- Automatically decodes 17-character VIN using NHTSA database
- Auto-populates: Year, Make, Model, Trim, Engine Specs
- Shows loading spinner while decoding
- Toast notification displays decoded info: "2020 Toyota Camry LE"
- If VIN invalid or not found, shows error message

**How to Update:**
1. Modify any field
2. Click "Update" button
3. System validates all required fields are filled
4. Duplicate check: Validates no other vehicle has same VIN or Stock Number (excluding current vehicle)
5. If valid: Vehicle updates in database and list
6. Toast shows: "Car updated"
7. Dialog closes

**Validation Rules for Update:**
- VIN or Stock Number: At least one must be provided
- Required fields: Make, Model, Year, Trim, Price, Kilometers, Color, Transmission, Fuel Type, Body Type, Condition, Dealership
- Optional fields: Listing URL, Carfax link, Notes, Features, Engine specs, Drivetrain

#### Mark as Sold
Quick action to toggle vehicle status:
- Click "Mark as Sold" button
- Vehicle status changes from "Available" to "Sold"
- Vehicle grays out / strikes through in list
- Can click again to mark as "Available" again
- Toast notification: "Marked as Sold: 2020 Toyota Camry"
- Useful for tracking sold vehicles without deletion

#### Delete Vehicle
Click "Delete" button:
- Confirmation dialog appears: "Delete this car?"
- If confirmed: Vehicle permanently removed from inventory
- Toast: "Car removed from inventory"
- Vehicle disappears from list
- Cannot be undone (no undo/restore feature)

---

### G. DATA BACKUP & RESTORE

#### Export Data (Backup)
Click "Backup" dropdown → "Export Data":

**What It Does:**
1. Exports entire inventory to a JSON file
2. Includes: All dealerships + all vehicles
3. File downloads automatically
4. Filename: `inventory-backup-YYYY-MM-DD.json` (with current date)
5. Toast message: "Exported 5 dealerships and 42 vehicles"

**What's in the Export:**
```json
{
  "dealerships": [
    { "id": "...", "name": "...", "location": "...", ... }
  ],
  "cars": [
    { "id": "...", "make": "...", "model": "...", ... }
  ],
  "exportDate": "2025-11-23T14:30:00Z",
  "version": "1.0"
}
```

#### Import Data (Restore)
Click "Backup" dropdown → "Import Data":

**What It Does:**
1. Opens file picker dialog
2. Select previously exported JSON backup file
3. System reads the file
4. Creates new dealerships (old IDs are remapped)
5. Creates all vehicles (dealership IDs updated to point to new dealerships)
6. Toast: "Imported 5 dealerships and 42 vehicles"
7. New data merges with existing inventory (doesn't overwrite)

**How ID Remapping Works:**
- Original backup had dealership IDs (example: "dealer-123")
- System creates new dealerships with new IDs
- Maps old IDs to new IDs (dealer-123 → new-uuid)
- All vehicles get updated to point to new dealership IDs
- Result: Complete working copy of backup with fresh IDs

**When to Use:**
- Restore from backup if data was accidentally deleted
- Transfer inventory between instances
- Migrate data from old system

---

### H. INVENTORY STATISTICS

**Header Information:**
- "X Vehicles" badge shows total vehicles in current filter
- Shows dealership count: "Manage X dealerships and Y total cars"
- Updates in real-time as you filter or add/remove vehicles

---

## TAB 2: ADD VEHICLES (UPLOAD)

**Location:** "Add Vehicles" tab in navigation

**Purpose:** Add new vehicles to inventory using multiple methods

---

### A. TAB SYSTEM

Four tabs at top, each for different input method:
1. **Manual Entry** - Fill form manually
2. **Bulk CSV** - Import from CSV file
3. **URL Import** - Scrape from listing URL
4. **AI Scan (PDF)** - Extract from document/image

---

### B. MANUAL ENTRY TAB

#### Search Existing Vehicle Section
Before adding manually, you can search for an existing vehicle to edit it instead.

**Search by VIN:**
- Input field for VIN
- Button: "Search"
- System searches all vehicles by exact VIN match
- If found: Form auto-fills with that vehicle's data
- If not found: Toast says "No vehicle found with that VIN or Stock Number"

**Search by Stock Number:**
- Input field for stock number
- Button: "Search"
- System searches all vehicles by stock number
- If found: Form auto-fills
- If not found: Toast message

#### Extract from Listing URL Section
Scrapes vehicle data automatically from a dealer/listing website.

**How It Works:**
1. Paste URL from any vehicle listing page
2. Click "Extract" button
3. Loading spinner shows "Scraping..."
4. System fetches page HTML and extracts data using pattern matching
5. Auto-fills these fields (if found):
   - Year
   - Make
   - Model
   - Trim
   - Price
   - Kilometers
   - VIN
   - Stock Number
   - Color
   - Listing Link (URL is saved as listing link)
6. Toast: "Extracted 6 vehicle details from URL"
7. You review and complete remaining fields manually

**What It Searches For:**
- Year: Looks in URL first, then page heading, then generic patterns
- VIN: 17-character alphanumeric pattern
- Price: Multiple patterns like "Selling Price $X", "Price: $X", red-colored prices
- Kilometers: "Odometer: X km", "Mileage: X", pattern matching
- Stock Number: "Stock #: X", "#X" patterns
- Color: Matches 14 common colors (Black, White, Silver, etc.)
- Make/Model: Matches manufacturer names + model

**Limitations:**
- Some sites may not have all data visible in HTML
- Prices might be formatted differently
- May need manual correction/completion

#### Dealership Selection
Dropdown to select which dealership this vehicle belongs to:
- Blue highlighted section
- Required field
- Search box within dropdown to find dealership by name
- Must select a dealership before saving

#### Vehicle Information Form

**Identifier Section:**
- **VIN** - 17-character input, uppercase, with "Decode VIN" button
- **Stock Number** - Internal inventory number
- **Condition** - Dropdown: New, Used, Certified Pre-Owned

**Basic Details (in 3-column grid):**
- **Make** - Dropdown with 39+ manufacturers
- **Model** - Text input (can be auto-filled from VIN)
- **Year** - Number input (YYYY format)

**More Details (continuing grid):**
- **Trim** - Dropdown or text input
- **Color** - Dropdown with 14 colors
- **Price** - Dollar amount
- **Kilometers** - Odometer reading
- **Transmission** - Dropdown: Automatic, Manual, CVT
- **Fuel Type** - Dropdown: Gasoline, Diesel, Hybrid, Electric
- **Body Type** - Dropdown: Sedan, SUV, Truck, Coupe, Hatchback, Van, Convertible

#### VIN Decoder
Click the "Decode VIN" button (QR code icon):

**What It Does:**
1. Takes 17-character VIN from input field
2. Calls NHTSA (National Highway Traffic Safety Administration) API
3. API returns detailed vehicle data
4. System auto-populates:
   - Year
   - Make (normalized to match your list)
   - Model
   - Trim
   - Engine Cylinders
   - Engine Displacement
   - Transmission (converted to your format)
   - Fuel Type (converted to your format)
   - Drivetrain (converted: FWD, RWD, AWD, 4WD)
   - Body Type (converted to your categories)

**VIN Validation:**
- Must be at least 11 characters
- Must be valid (in NHTSA database)
- If invalid: Toast error "VIN not found in NHTSA database"
- If too short: Error "Please enter a valid 17-character VIN"

**On Success:**
- Loading spinner appears during API call
- Toast shows: "VIN Decoded Successfully: Identified: 2020 Toyota Camry LE"
- Advanced section auto-opens to show decoded specs
- Can still edit any auto-filled field

**On Failure:**
- Error toast: "Decoding Failed: Could not fetch vehicle details"
- Form fields don't change
- User must enter data manually

#### Advanced Section (Collapsible)
Click "Engine & Features (Advanced)" button to expand:

**Engine Specifications:**
- **Cylinders** - Dropdown: 3, 4, 5, 6, 8, 10, 12
- **Displacement** - Dropdown with common sizes: 1.5L, 2.0L, 3.5L, 5.7L, 6.7L (Diesel), etc.
- **Drivetrain** - Dropdown: FWD, RWD, AWD, 4WD, 4x4

**Links:**
- **Listing Link** - URL to vehicle listing page
- **Carfax Link** - URL to Carfax report
- **Carfax Status** - Dropdown: Clean, Claims, Unavailable

**Notes:**
- Large text area for any notes (condition notes, history, etc.)

**Features Selection:**
- 45+ checkboxes for vehicle features
- Categories: Seating, Safety, Technology, Comfort, Lights, Convenience, Packages
- Select any combination of features
- Each feature represents an option the vehicle has

#### Form Validation Before Saving
When clicking "Add Vehicle" button, system validates:

**Required Fields:**
1. Dealership must be selected
2. VIN or Stock Number: At least one required
3. Make: Required
4. Model: Required
5. Year: Required
6. Trim: Required
7. Color: Required
8. Price: Required
9. Kilometers: Required
10. Transmission: Required
11. Fuel Type: Required
12. Body Type: Required
13. Condition: Required

**Validation Messages:**
- If missing field: Toast error showing which field is required
- Example: "Make and Model are required"
- Example: "Either VIN or Stock Number is required"

#### Duplicate Detection
System checks for duplicates before saving:

**VIN Check:**
- If VIN is provided, system searches all vehicles
- If VIN already exists, dialog appears showing: "A vehicle with this VIN already exists at [Dealership Name]"
- Dialog offers: "Ignore duplicate and add anyway" button
- Can override and add duplicate if needed (for corrections/updates)

**Stock Number Check:**
- Same as VIN check
- Shows dialog if stock number already exists
- Can ignore and add anyway

#### Successful Addition
After clicking "Add Vehicle":
1. Vehicle saves to database
2. Toast appears: "Car added to inventory"
3. Form clears (except dealership stays selected for convenience)
4. Advanced section collapses
5. You can immediately add another vehicle
6. New vehicle appears in Inventory tab

---

### C. BULK CSV TAB

#### What This Does
Import multiple vehicles at once from a CSV (comma-separated values) file.

#### How to Use
1. Click the "Bulk CSV" tab
2. Paste or load CSV data
3. System processes each row as one vehicle
4. Each vehicle goes through same validation as manual entry

#### CSV Format Expected
Columns should be (in order):
- Make
- Model
- Year
- VIN
- Stock Number
- Price
- Kilometers
- Condition
- Transmission
- Fuel Type
- Body Type
- Trim
- Color
- (Optional: Dealership, Features, Notes)

#### Processing
- Validates each row
- Checks for duplicate VIN/Stock Number for each
- Shows progress
- Skips rows with errors
- Toast shows results: "Processed 5 vehicles from CSV"

#### Limitations
- Each row processed independently
- One error doesn't stop other rows from importing
- Manual review recommended for any skipped rows

---

### D. URL IMPORT TAB

#### What This Does
Paste a vehicle listing URL and system extracts all available data automatically.

**How to Use:**
1. Paste complete URL from dealer/listing website
2. Click "Extract" button
3. System fetches page and extracts data
4. Shows extracted fields
5. Click "Use This Data" to transfer to manual form
6. Continue editing and save normally

#### What Gets Extracted
Same as "Extract from Listing URL" feature in manual tab:
- Year, Make, Model, Trim
- Price, Kilometers, VIN, Stock Number
- Color, Listing Link

#### Limitations
- Website structure may prevent complete extraction
- Some fields might be images/JavaScript (can't extract)
- Manual review always recommended
- Complex websites may not parse correctly

---

### E. AI SCAN (PDF) TAB

#### What This Does
Upload a PDF or image (like a Monroney label, invoice, or photo) and AI extracts vehicle data.

**How to Use:**
1. Click "Upload File" button
2. Select PDF or image from computer
3. Loading indicator shows "Analyzing..."
4. System processes document (simulated ~2 seconds)
5. Extracted data displays
6. Review accuracy
7. Click "Use This Data" to transfer to manual form
8. Edit and save normally

#### What It Extracts
- Make, Model, Year
- VIN
- Price
- Trim
- Color
- Kilometers (if shown)

#### Document Types Supported
- PDF: Invoices, Monroney labels, service records
- Images: Photos with visible specs, monroney photos
- Documents with vehicle data

#### Accuracy
- Works best with clear, legible documents
- Auto-detection rates 70-90% depending on document quality
- Always review extracted data for accuracy before saving

---

### F. VEHICLE SEARCH DURING ADD
While adding a vehicle, you can search for existing vehicles by:
- **VIN** - Exact match search
- **Stock Number** - Exact match search
- If found: Pre-fills form with existing data
- Useful for: Updating vehicles, re-listing, transferring between dealerships

---

## TAB 3: APPRAISAL TOOL

**Location:** "Appraisal Tool" tab in navigation

**Purpose:** Calculate market value of any vehicle using inventory data and market algorithms

---

### A. FORM SECTION (Left Side)

#### Vehicle Input

**VIN Decoder:**
- Input field for 17-character VIN
- "Decode" button with QR icon
- Same functionality as Add Vehicles tab
- Auto-populates: Year, Make, Model, Trim, Engine specs, Transmission, Fuel Type, Drivetrain, Body Type

**Make Selection** (Required)
- Dropdown with 32 popular makes
- Options: Acura, Audi, BMW, Ford, Honda, Toyota, Tesla, etc.
- Also includes "Other" option

**Model Input** (Required)
- Text input (not dropdown)
- Type vehicle model name
- Example: "Camry", "F-150", "CR-V"

**Year Input**
- Number input
- Vehicle model year
- Optional but recommended for accuracy

**Trim Selection**
- Dropdown that loads available trims for selected make
- If year/model entered: Shows specific trims for that combination
- Shows loading indicator while fetching from NHTSA API
- Falls back to make-based trims if API doesn't return specific ones

**Kilometers Input**
- Number input
- Current odometer reading
- Affects valuation: Higher km = lower value ($0.05 per km difference)
- Optional but affects accuracy

#### Advanced Specs & Features Section (Expandable)

**Engine & Transmission:**
- **Body Type** - Dropdown: Sedan, SUV, Truck, Coupe, Hatchback, Van
- **Drivetrain** - Dropdown: FWD, RWD, AWD, 4WD, 4x4
- **Cylinders** - Dropdown: 3, 4, 5, 6, 8, 10, 12
  - Affects valuation: V8 = higher value, more economical cylinders may be lower
- **Displacement (L)** - Options: 1.5L to 6.7L

**Transmission & Fuel:**
- **Transmission** - Dropdown: Automatic (default), Manual
  - Manual typically valued $500 lower than automatic
- **Fuel Type** - Dropdown: Gasoline (default), Diesel, Hybrid, Electric
  - Hybrid/Electric adds ~$2,000-$3,000 to value
  - Diesel trucks add premium value

**Vehicle Features** (45+ options)
- Checkboxes for all features: Navigation, Sunroof, Leather, etc.
- Each selected feature adds $150-$200 to estimated value
- Example: Vehicle with 5 features gets $750-$1,000 feature premium

**Strict Matching Options:**
- **Match Transmission** - Toggle
  - When ON: Only shows comparable vehicles with same transmission
  - When OFF: Shows any transmission in comparables
- **Match Fuel Type** - Toggle
  - When ON: Comparables must have same fuel type
  - When OFF: Shows any fuel type

#### Regional & Market Settings

**Province Selection:**
- Dropdown with 13 Canadian provinces/territories
- Options: AB, BC, MB, NB, NL, NS, NT, NU, ON, PE, QC, SK, YT
- Some provinces have higher values (ON, BC)
- Affects valuation estimate

**Postal Code Input:**
- Text input for postal code
- Used for regional adjustments
- Optional but helps with accuracy

**Search Radius:**
- Dropdown: 25 km, 50 km (default), 100 km, 250 km, 500 km
- Determines how far to search for comparable vehicles
- Larger radius = potentially lower prices (rural areas cheaper)
- Affects which vehicles are used for comparison

#### Comparable Vehicles Display Toggle
- **Show Comparables** - Toggle switch
- When ON: Results section shows up to 3 comparable vehicles
- When OFF: Only shows valuation estimate (hides comparable vehicles)
- Helpful to reduce clutter if you just want the price estimate

#### Calculate Button
- **Calculate Value** button (bottom of form)
- Disabled until Make and Model are selected
- Clicking triggers appraisal calculation
- Shows brief loading state

---

### B. RESULTS SECTION (Right Side)

#### Display After Calculating

**Retail Value Card** (Blue)
- **Title:** "Estimated Retail"
- **Value:** Dollar range (e.g., "$20,500 - $22,500")
- **Description:** "Market listing price"
- **What It Means:** Price you could list the vehicle for retail

**Trade-In Value Card** (Green)
- **Title:** "Estimated Trade-In"
- **Value:** Dollar range (e.g., "$14,350 - $18,000")
- **Description:** "Acquisition cost"
- **What It Means:** What dealer would pay as trade-in

#### Comparable Vehicles Section

**Shows up to 3 vehicles from your inventory that match:**
- Same make and model
- Year within ±2 years of entered year
- Same trim (if specified and available)
- Same transmission/fuel type (if strict matching enabled)

**For Each Comparable Vehicle Shows:**
- **Year, Make, Model** (e.g., "2020 Toyota Camry")
- **Kilometers** - Odometer reading
- **Trim** - Trim level
- **Transmission & Fuel Type** - Specs
- **Price** - Listing price
- **Match Badge** - Indicates it's a matching vehicle
- **Buttons:**
  - View Listing button (opens listing URL in new tab if available)
  - View Carfax button (opens Carfax report if available)

**Empty State (No Comparables):**
- Shows message: "No direct matches found in inventory"
- Explains: "Estimate is based on general market data"
- Valuation still provided using algorithm

---

### C. HOW VALUATION ALGORITHM WORKS

#### Scenario 1: If Comparable Vehicles Found
1. **Base Price:** Calculate average price of all matching vehicles
2. **Mileage Adjustment:** 
   - Compare entered km vs. average km of comparables
   - Adjust: $0.05 per km difference
   - Example: If comparable average is 100k km and you enter 80k km, add $1,000
3. **Radius Adjustment:**
   - 50 km radius: No change (baseline)
   - 100 km radius: Reduce 2%
   - 250 km radius: Reduce 4%
   - 500 km radius: Reduce 5%
4. **Feature Bonus:** Add $150 per selected feature
5. **Engine/Drivetrain Bonus:**
   - V8 engine: +$1,000
   - AWD/4WD (if not already in comparables): +$1,500
6. **Fuel Type Bonus:**
   - Hybrid/Electric (if not already in comparables): +$2,000
7. **Final Estimate:** Base + adjustments
8. **Retail Range:** Estimate × 0.9 (low) to × 1.1 (high)
9. **Trade-In Range:** Estimate × 0.7 (low) to × 0.8 (high)

#### Scenario 2: No Comparable Vehicles Found
If no vehicles match in inventory, uses **Mock Algorithm:**

1. **Base Price:** $25,000 (market average)
2. **Trim Adjustment:**
   - Limited/Touring/Premium trim: +$5,000
   - Sport/GT trim: +$3,000
3. **Year Factor:** (Year - 2010) × $1,000
   - Example: 2020 = $10,000 bonus
4. **Mileage Factor:** (150,000 - km) × $0.05
   - Example: 80,000 km = $3,500 bonus
5. **Regional Factor:** Postal code length × $100
6. **Province Factor:**
   - Ontario or BC: +$1,000
   - Other provinces: No bonus
7. **Transmission Factor:**
   - Manual: -$500
   - Automatic: No change
8. **Drivetrain Factor:**
   - AWD/4WD/4x4: +$2,000
   - Other: No bonus
9. **Fuel Type Factor:**
   - Hybrid/Electric: +$3,000
   - Diesel: +$3,000 (trucks)
   - Gasoline: No change
10. **Engine Factor:**
    - V8: +$2,000
    - V6: +$1,000
    - Other: No change
11. **Feature Factor:** Selected features × $200
12. **Final Estimate:** Base + all adjustments
13. **Retail Range:** Estimate × 0.9 to × 1.1
14. **Trade-In Range:** Estimate × 0.7 to × 0.8

---

### D. EXAMPLE APPRAISAL WALKTHROUGH

**User Enters:**
- Make: Toyota
- Model: Camry
- Year: 2020
- Kilometers: 85,000
- Trim: LE
- Transmission: Automatic
- Fuel Type: Gasoline
- Features: 3 selected (Navigation, Backup Camera, Apple CarPlay)
- Province: Ontario
- Radius: 50 km

**System Finds:**
- 2 comparable 2019-2021 Toyota Camry LEs in inventory
- Vehicle 1: 2019, price $24,500, 95,000 km
- Vehicle 2: 2021, price $26,000, 80,000 km
- Average: $25,250

**Calculation:**
- Base: $25,250
- Mileage: User has 85k, average is 87.5k → Very close, no adjustment
- Features: 3 × $150 = $450
- Ontario: +$1,000
- Estimated Retail: $26,700
- Retail Range: $24,030 - $29,370
- Trade-In Range: $18,690 - $21,360

**Shows:**
- Estimated Retail: $24,000 - $29,400
- Estimated Trade-In: $18,700 - $21,300
- Comparable Vehicles: Shows the 2 Camrys found

---

### E. ACCURACY NOTES

**Appraisal is More Accurate When:**
- You have many vehicles of that make/model in inventory
- You enter complete specifications
- Kilometer reading is current
- Features are accurate
- Province/region match where vehicle is

**Appraisal is Less Accurate When:**
- No comparable vehicles in inventory
- Using fallback mock algorithm
- Vehicle is unique/specialty type
- Regional data is sparse
- Features are incomplete

---

## SYSTEM-WIDE FEATURES

### Feature Explanations (Used Across All Tabs)

#### VIN (Vehicle Identification Number)
- **What It Is:** Unique 17-character code assigned by manufacturer
- **Format:** Combination of letters and numbers
- **Why Important:** Uniquely identifies every vehicle ever made
- **Used In:** Decoding specs, duplicate detection, tracking
- **Can Be Decoded To Get:** Year, make, model, engine type, transmission, drivetrain, etc.

#### Stock Number
- **What It Is:** Dealer's internal inventory tracking number
- **Format:** Usually alphanumeric (e.g., "A12345", "LOT001")
- **Why Important:** Quick internal reference
- **Used In:** Duplicate detection, internal tracking
- **Note:** Different from VIN; assigned by dealer

#### Trim Level
- **What It Is:** Variant/package level within a model
- **Examples:** 
  - Toyota Camry: L, LE, SE, XLE, XSE
  - Ford F-150: XL, XLT, Lariat, King Ranch, Platinum
- **Why Important:** Significantly affects price and features
- **Effect on Value:** Higher trim = higher value

#### Condition
- **New:** Fresh from manufacturer, 0-10 miles/km
- **Used:** Previously owned, any mileage
- **Certified Pre-Owned:** Used but verified by manufacturer/dealer, inspection passed

#### Transmission
- **Automatic:** Gear changes automatically (most common)
- **Manual:** Driver shifts gears with clutch pedal
- **CVT:** Continuously Variable Transmission (smooth acceleration)

#### Fuel Type
- **Gasoline:** Standard petroleum fuel (most common, cheapest to run)
- **Diesel:** Heavier fuel, better torque, better fuel economy, higher initial cost
- **Hybrid:** Combination of gas engine + electric motor (high efficiency, lowest emissions)
- **Electric:** Battery powered only (zero emissions, highest upfront cost)

#### Drivetrain
- **FWD (Front Wheel Drive):** Engine power goes to front wheels (most common, good handling)
- **RWD (Rear Wheel Drive):** Power to rear wheels (traditional, better balance)
- **AWD (All Wheel Drive):** All 4 wheels receive power automatically (best traction, higher cost/complexity)
- **4WD/4x4:** Can lock in 4-wheel drive mode for off-road (trucks/SUVs, manual engagement)

#### Body Type
- **Sedan:** 4-door car, trunk, seating for 4-5 (family vehicle)
- **SUV:** Sport Utility Vehicle, larger, higher ride, often with 3 rows
- **Truck:** Pickup truck, open bed for cargo
- **Coupe:** 2-door sports car
- **Hatchback:** Compact car with rear cargo opening
- **Van:** Large family vehicle, sliding doors, lots of interior space
- **Convertible:** Retractable or removable roof

#### Engine Specs
- **Cylinders:** Number of combustion chambers (more = more power but less efficiency)
  - 3-4 cyl: Economical, good for sedans
  - 6 cyl: Balanced power/economy
  - 8+ cyl: High performance, luxury vehicles
- **Displacement:** Total engine volume in liters
  - 1.5-2.5L: Economical (sedans, compacts)
  - 3.0-3.5L: Mid-range power (mid-size SUVs)
  - 5.0-6.5L: High performance (trucks, sports cars)

#### Features
**45+ options including:**
- **Seating:** Leather, heated, ventilated, power adjustable
- **Technology:** Navigation, Apple CarPlay, Android Auto, wireless charging
- **Safety:** Blind spot monitor, collision avoidance, lane assist
- **Comfort:** Sunroof, climate zones, air suspension
- **Convenience:** Remote start, keyless entry, power liftgate
- **Lights:** LED headlights, adaptive lights
- **Packages:** Sport, off-road, winter, technology packages

---

### Navigation & Layout

#### Top Navigation Bar
- **Logo/Brand:** "AutoManager - Dealer System" at top left
- **Three Tabs:** Inventory | Add Vehicles | Appraisal Tool
- **Active Tab:** Highlighted in black, shows current page
- Click any tab to switch

#### Sidebar (Left)
- **Dealership List:** Shows all registered dealerships
- **Selection:** Click to filter inventory to that dealership
- **Management:** Hover for edit/delete options

#### Main Content Area (Right)
- **Primary Page Content:** Changes based on selected tab
- **Responsive:** Adapts from desktop to mobile layouts
- **Scrollable:** Long forms and lists scroll internally

---

### Notifications (Toast Messages)

#### Success Messages (Green)
- "Dealership added successfully"
- "Car added to inventory"
- "Car updated"
- "Exported 5 dealerships and 42 vehicles"
- "Imported 5 dealerships and 42 vehicles"
- "VIN Decoded Successfully: Identified: 2020 Toyota Camry LE"

#### Error Messages (Red)
- "Required fields missing"
- "A vehicle with this VIN already exists"
- "A vehicle with this Stock Number already exists"
- "Failed to fetch dealerships"
- "Invalid VIN"
- "Decoding Failed: Could not fetch vehicle details"
- "Please select a dealership"
- "Either VIN or Stock Number is required"

#### Info Messages (Blue)
- "Form Cleared: Vehicle fields have been reset"
- "Vehicle Found: Form filled with: 2020 Toyota Camry"
- "Success: Extracted 6 vehicle details from URL"

#### Temporary Displays
- Loading spinners during: VIN decoding, URL scraping, appraisal calculation
- Appear for 1-3 seconds typically
- Show with descriptive text

---

### Keyboard & Input Behaviors

#### Text Inputs
- **Case Insensitive:** Make, Model, Color searches work regardless of case
- **Trimming:** Extra spaces automatically removed
- **Max Length:** Some fields have limits (VIN: 17 chars, Stock #: varies)

#### Dropdowns
- **Searchable:** Type to filter options
- **Arrow Keys:** Navigate with up/down
- **Enter:** Select highlighted option
- **Escape:** Close dropdown

#### Sliders
- **Drag Handles:** Click and drag left/right to adjust range
- **Display:** Shows current value while dragging
- **Snap:** Snaps to preset increments (year: 1, price: $5k, km: 10k)

#### Checkboxes
- **Click:** Toggle on/off
- **Multi-Select:** Can select multiple options in same group
- **Visual Feedback:** Checked icon appears when selected

---

### Performance & Caching

#### Client-Side Filtering
- All inventory filtering happens instantly on your computer
- No server delay
- Results update as you type/adjust filters

#### Data Caching
- Application caches dealership and vehicle data
- Updates when you: Add, Edit, or Delete items
- Cache automatically invalidates and refreshes

#### Search Performance
- Search across 15+ vehicle fields simultaneously
- Instantly filters as you type
- No noticeable lag even with 100+ vehicles

---

### Browser Compatibility
- **Works On:** Chrome, Firefox, Safari, Edge (modern versions)
- **Mobile Responsive:** Adapts to phones, tablets, desktops
- **Requires JavaScript:** Application needs JavaScript enabled
- **No Plugins:** No special plugins or extensions needed

---

### Data Safety

#### What's Stored
- All dealership information
- All vehicle inventory data
- All custom settings and filters
- Search history (cleared on refresh)

#### What's NOT Stored
- Passwords (no authentication in current version)
- Payment information
- Personal user data

#### Backups
- Use "Export Data" to manually backup to JSON file
- Store backup file on computer or cloud storage
- Use "Import Data" to restore from backup anytime

---

## SUMMARY TABLE

| Feature | Location | Purpose | Key Actions |
|---------|----------|---------|--------------|
| **Dealership Management** | Inventory Tab | Manage dealer locations | Add, Edit, Delete dealerships |
| **Vehicle Inventory** | Inventory Tab | View all vehicles | Edit, Delete, Mark Sold, Filter |
| **Global Search** | Inventory Tab | Find vehicles | Type to search across all fields |
| **Advanced Filters** | Inventory Tab | Narrow by specs | Select make, price range, features |
| **Sorting** | Inventory Tab | Order vehicles | By price, year, mileage |
| **Manual Vehicle Entry** | Add Vehicles Tab | Add one vehicle | Fill form manually |
| **VIN Decoder** | Add Vehicles & Appraisal | Auto-extract specs | Paste VIN, decode |
| **URL Scraping** | Add Vehicles Tab | Extract from listing | Paste URL, extract |
| **Bulk CSV Import** | Add Vehicles Tab | Add multiple vehicles | Paste CSV data |
| **PDF/Image Scan** | Add Vehicles Tab | Extract from document | Upload file |
| **Duplicate Detection** | Add Vehicles Tab | Prevent duplicates | Check VIN, Stock # |
| **Vehicle Appraisal** | Appraisal Tab | Calculate market value | Enter specs, get estimate |
| **Comparables Analysis** | Appraisal Tab | View similar vehicles | Compare prices, features |
| **Data Export** | Inventory Tab | Backup all data | Download JSON file |
| **Data Import** | Inventory Tab | Restore from backup | Upload JSON file |

---

**END OF FUNCTIONAL DOCUMENTATION**

This comprehensive guide explains every feature, tab, and function in the AutoManager application from an operational/functional perspective (not technical code).
