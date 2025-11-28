# AutoManager Inventory Tab - Complete Documentation

---

## Overview

The **Inventory Tab** is the central hub for viewing, managing, and organizing all vehicles across your dealerships. It provides a powerful combination of search, filtering, sorting, and bulk operations to efficiently manage your automotive inventory.

---

## 1. Page Layout Structure

The Inventory page is divided into two main sections:

| Section | Width | Description |
|---------|-------|-------------|
| **Left Sidebar** | 25% | Dealership list for filtering by location |
| **Main Content Area** | 75% | Vehicle list with search, filters, and vehicle cards |

---

## 2. Header Section

### 2.1 Page Title & Statistics
- **"Inventory" Title** - Main page heading
- **Total Vehicle Count Badge** - Shows the total number of vehicles in the filtered view

### 2.2 Action Buttons (Top Right)

| Button | Icon | Function |
|--------|------|----------|
| **Export** | Download icon | Exports all dealerships and vehicles to a JSON backup file |
| **Import** | Upload icon | Imports data from a previously exported JSON backup file |
| **Add Vehicle** | Plus icon | Navigates to the Upload page to add new vehicles |

---

## 3. Export/Import Data (Backup & Restore)

### 3.1 Export Data
**How it works:**
1. Click the **Export** button
2. A JSON file is automatically downloaded containing:
   - All dealerships
   - All vehicles
   - Export date
   - Version number
3. Filename format: `inventory-backup-YYYY-MM-DD.json`
4. Success notification shows count of exported dealerships and vehicles

**Use Case:** Create backups of your inventory before making major changes, or transfer data between systems.

### 3.2 Import Data
**How it works:**
1. Click the **Import** button
2. Select a previously exported JSON backup file
3. System processes the file:
   - Creates new dealerships from the backup
   - Creates new vehicles with updated dealership references
4. Success notification shows count of imported items

**Important Notes:**
- Import creates NEW records (does not overwrite existing data)
- Dealership IDs are remapped automatically
- Invalid file formats show an error message

---

## 4. Dealership Sidebar

### 4.1 Sidebar Header
- **"Dealerships" Label** - Section title
- **Count Badge** - Shows total number of dealerships

### 4.2 "All Inventory" Option
- Located at the top of the dealership list
- When selected, displays **all vehicles from all dealerships combined**
- Shows the total count: "View all X vehicles"
- Has a distinct visual style with a black ring border when active

### 4.3 Individual Dealership Cards
Each dealership card displays:

| Element | Description |
|---------|-------------|
| **Dealership Name** | Bold, prominent display |
| **Location** | Province shown below name |
| **Vehicle Count** | Number of cars + "vehicles" text |

**Hover Actions (appear on mouse hover):**

| Button | Icon | Action |
|--------|------|--------|
| **Edit** | Pencil | Opens Edit Dealership dialog |
| **Delete** | Trash | Removes dealership (with confirmation) |

**Visual States:**
- **Selected**: Blue ring border with shadow
- **Unselected**: Light border, hover reveals actions
- **Hover**: Slight shadow effect

### 4.4 Add New Dealership Button
- Located at the bottom of the dealership sidebar
- **"+ New Dealership"** text with plus icon
- Opens the Add Dealership dialog

---

## 5. Add Dealership Dialog

### 5.1 Dialog Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **Dealership Name** | Text Input | Yes | Name of the dealership |
| **Province** | Dropdown | Yes | Canadian province selection |

**Available Provinces:**
- Ontario
- Quebec
- British Columbia
- Alberta
- Manitoba
- Saskatchewan
- Nova Scotia
- New Brunswick
- Newfoundland and Labrador
- Prince Edward Island
- Northwest Territories
- Yukon
- Nunavut

### 5.2 Dialog Actions

| Button | Action |
|--------|--------|
| **Cancel** | Closes dialog without saving |
| **Create Dealership** | Saves new dealership to database |

---

## 6. Edit Dealership Dialog

### 6.1 Dialog Fields
Same as Add Dealership:
- **Dealership Name** - Pre-filled with current name
- **Province** - Pre-selected with current province

### 6.2 Dialog Actions

| Button | Action |
|--------|--------|
| **Cancel** | Closes dialog without saving |
| **Save Changes** | Updates dealership information |

---

## 7. Search Functionality

### 7.1 Main Search Bar
Located prominently at the top of the main content area.

**Appearance:**
- Large input field with search icon
- Placeholder text: "Search by VIN, make, model, or features..."
- Rounded corners with shadow effect

**Searchable Fields:**

| Field | Example Search |
|-------|----------------|
| VIN | "1HGBH" |
| Make | "Toyota" |
| Model | "Camry" |
| Color | "Black" |
| Year | "2023" |
| Trim | "Limited" |
| Transmission | "automatic" |
| Fuel Type | "hybrid" |
| Body Type | "SUV" |
| Drivetrain | "AWD" |
| Engine Cylinders | "4 cylinder" |
| Features | "sunroof" |
| Notes | Any note content |
| Dealership Name | "Downtown Motors" |
| Province | "Ontario" |
| Carfax Status | "clean" |

**Behavior:**
- Real-time filtering as you type
- Case-insensitive matching
- Partial matches supported

---

## 8. Sorting Options

### 8.1 Sort Button
Located next to the search bar with a dropdown menu.

### 8.2 Available Sort Options

| Option | Description | Icon |
|--------|-------------|------|
| **Price: High to Low** | Most expensive first | Down arrow |
| **Price: Low to High** | Cheapest first | Up arrow |
| **Year: Newest** | Latest model year first | - |
| **Year: Oldest** | Oldest model year first | - |
| **Mileage: Low to High** | Lowest kilometers first | - |

---

## 9. Advanced Filters Panel

### 9.1 Toggle Filters
Click the **"Filters"** button to expand/collapse the advanced filtering panel.

### 9.2 Dropdown Filters

| Filter | Options | Description |
|--------|---------|-------------|
| **Make** | All car manufacturers | 41 major brands including Toyota, Honda, BMW, etc. |
| **Model** | Dynamic based on inventory | Shows only models present in current inventory |

### 9.3 Range Slider Filters

| Filter | Min | Max | Description |
|--------|-----|-----|-------------|
| **Year** | 1995 | 2025 | Filter by model year range |
| **Price** | $0 | $200,000 | Filter by price range |
| **Kilometers** | 0 km | 300,000 km | Filter by mileage range |

**Slider Features:**
- Dual handles for min/max selection
- Current range displayed above slider
- Step increments for precision

### 9.4 Text Input Filters

| Filter | Placeholder | Function |
|--------|-------------|----------|
| **VIN (Contains)** | "Contains..." | Matches VINs containing the text |
| **VIN (Starts With)** | "Starts with..." | Matches VINs beginning with text |
| **Trim** | "e.g., SE, Limited" | Filter by trim level |
| **Color** | "e.g., Black, White" | Filter by exterior color |
| **Province** | "e.g., ON, BC" | Filter by dealership location |

### 9.5 Multi-Select Checkbox Filters

**Transmission Options:**
- [ ] Automatic
- [ ] Manual
- [ ] CVT

**Drivetrain Options:**
- [ ] FWD (Front-Wheel Drive)
- [ ] RWD (Rear-Wheel Drive)
- [ ] AWD (All-Wheel Drive)
- [ ] 4WD (Four-Wheel Drive)

**Fuel Type Options:**
- [ ] Gasoline
- [ ] Diesel
- [ ] Electric
- [ ] Hybrid
- [ ] Plug-in Hybrid

**Body Type Options:**
- [ ] Sedan
- [ ] SUV
- [ ] Truck
- [ ] Coupe
- [ ] Hatchback
- [ ] Van
- [ ] Wagon
- [ ] Convertible

**Engine Cylinders Options:**
- [ ] 3 Cylinder
- [ ] 4 Cylinder
- [ ] 5 Cylinder
- [ ] 6 Cylinder
- [ ] 8 Cylinder
- [ ] 10 Cylinder
- [ ] 12 Cylinder

### 9.6 Clear All Filters Button
- Located at bottom right of filter panel
- Resets ALL filters to default values
- Icon: X mark

---

## 10. Vehicle Cards (Inventory List)

### 10.1 Card Layout
Each vehicle is displayed as a horizontal card with the following layout:

```
[Status Badges] | [Vehicle Info Grid] | [Dealership Badge] | [Action Buttons]
```

### 10.2 Status Badges (Left Side)

| Badge | Color | Meaning |
|-------|-------|---------|
| **SOLD** | Red | Vehicle has been sold |
| **PENDING** | Yellow | Sale in progress |
| **AVAILABLE** | Green | Ready for sale |
| **Clean** | Blue | Clean Carfax report |

### 10.3 Vehicle Information Grid

| Column | Content | Example |
|--------|---------|---------|
| **Title** | Year Make Model | "2023 Toyota Camry" |
| **Subtitle** | Trim level | "XLE" |
| **Price** | Formatted price | "$35,000" |
| **Kilometers** | Formatted mileage | "45,000 km" |
| **Color** | Exterior color | "Black" |
| **Specs** | Transmission • Fuel | "Automatic • Gasoline" |

### 10.4 Dealership Badge
- Shows dealership name in a rounded badge
- Only visible when viewing "All Inventory"
- Hidden when filtering by specific dealership

### 10.5 Action Buttons (Right Side)

| Button | Icon | Color on Hover | Function |
|--------|------|----------------|----------|
| **Status Toggle** | - | Green/White | Toggles between Sold/Available |
| **View Listing** | External Link | Blue | Opens listing URL in new tab |
| **Edit** | Pencil | Blue | Opens Edit Vehicle dialog |
| **Delete** | Trash | Red | Deletes vehicle (with confirmation) |

### 10.6 Status Toggle Button Behavior

| Current Status | Button Text | Button Style | Click Result |
|----------------|-------------|--------------|--------------|
| Available | "Sold" | Green solid | Changes to Sold |
| Pending | "Sold" | Green solid | Changes to Sold |
| Sold | "Available" | Green outline | Changes to Available |

---

## 11. Edit Vehicle Dialog

### 11.1 Dialog Header
- **Title:** "Edit Vehicle"
- **Close Button:** X in top right corner

### 11.2 Basic Information Section

| Field | Type | Description |
|-------|------|-------------|
| **VIN** | Text + Decode Button | 17-character Vehicle ID with auto-decode |
| **Stock Number** | Text | Dealership stock reference |
| **Condition** | Dropdown | New / Used |
| **Make** | Dropdown | Car manufacturer (41 options) |
| **Model** | Dropdown | Vehicle model (dynamic based on make) |
| **Trim** | Text Input | Trim level (custom text entry) |
| **Year** | Dropdown | 1990-2025 |
| **Color** | Dropdown | 14 common colors + Other |
| **Price** | Number | Vehicle price (numbers only) |
| **Kilometers** | Number | Odometer reading |
| **Status** | Dropdown | Available / Pending / Sold |
| **Dealership** | Dropdown | Assign to dealership |

### 11.3 VIN Decode Button
- **Icon:** QR Code
- **Function:** Automatically fills vehicle details from VIN
- **Auto-fills:** Make, Model, Year, Trim, Transmission, Fuel Type, Drivetrain, Engine specs

### 11.4 Advanced Specs Section (Collapsible)

Click **"Show Advanced Specs"** to expand:

| Field | Type | Options |
|-------|------|---------|
| **Transmission** | Dropdown | Automatic, Manual, CVT, Not Specified |
| **Fuel Type** | Dropdown | Gasoline, Diesel, Electric, Hybrid, Plug-in Hybrid, Not Specified |
| **Body Type** | Dropdown | Sedan, SUV, Truck, Coupe, Hatchback, Van, Wagon, Convertible, Not Specified |
| **Drivetrain** | Dropdown | FWD, RWD, AWD, 4WD |
| **Engine Cylinders** | Dropdown | 3-12 cylinders |
| **Engine Displacement** | Text | e.g., "2.5L" |
| **Carfax Status** | Dropdown | Clean, Unavailable |

### 11.5 URLs & Notes Section

| Field | Type | Description |
|-------|------|-------------|
| **Listing URL** | Text | Link to online vehicle listing |
| **Carfax URL** | Text | Link to Carfax report |
| **Notes** | Textarea | Additional comments/details |

### 11.6 Features Section (Collapsible)

Click **"Show Features"** to expand a checklist of vehicle features:

**Available Features (48 options):**
- Navigation System
- Sunroof/Moonroof
- Panoramic Sunroof
- Leather Seats
- Heated Front Seats
- Heated Rear Seats
- Ventilated Seats
- Memory Seats
- Power Seats
- Backup Camera
- 360° Camera
- Parking Sensors
- Bluetooth
- Apple CarPlay
- Android Auto
- Wireless Charging
- Premium Sound System
- Blind Spot Monitor
- Adaptive Cruise Control
- Lane Departure Warning
- Lane Keep Assist
- Collision Warning
- Automatic Emergency Braking
- Third Row Seating
- Tow Package
- Trailer Hitch
- Remote Start
- Keyless Entry
- Push Button Start
- Power Liftgate
- Hands-Free Liftgate
- Roof Rack
- Running Boards
- LED Headlights
- Fog Lights
- Daytime Running Lights
- HID Headlights
- Automatic Headlights
- Rain Sensing Wipers
- Heated Mirrors
- Power Folding Mirrors
- Heads-Up Display
- Dual Zone Climate
- Tri-Zone Climate
- Rear Climate Control
- Air Suspension
- Sport Package
- Off-Road Package
- Winter Package
- Technology Package

### 11.7 Dialog Actions

| Button | Action |
|--------|--------|
| **Cancel** | Closes dialog, discards changes |
| **Save Changes** | Updates vehicle in database |

---

## 12. Delete Vehicle Confirmation

When clicking the delete button on a vehicle:

1. **Confirmation Dialog** appears (browser confirm)
2. Shows: "Are you sure you want to delete this vehicle?"
3. **OK** - Deletes the vehicle permanently
4. **Cancel** - Keeps the vehicle

**After Deletion:**
- Vehicle removed from list
- Success notification: "Car removed from inventory"
- Inventory count updates automatically

---

## 13. Delete Dealership Confirmation

When clicking the delete button on a dealership:

1. **Confirmation Dialog** appears
2. Shows: "Are you sure? This will delete the dealership and all its vehicles."
3. **OK** - Deletes dealership AND all associated vehicles
4. **Cancel** - Keeps the dealership

**Warning:** This action is permanent and cascades to all vehicles!

---

## 14. Empty States

### 14.1 No Dealerships
When no dealerships exist:
- Message: "No dealerships yet"
- Prompt to add first dealership

### 14.2 No Vehicles Found
When filters return no results:
- Message: "No vehicles found"
- Suggestion to adjust filters or add vehicles

### 14.3 Loading State
While data is loading:
- Spinner animation displayed
- "Loading..." text

---

## 15. Data Schema (Vehicle Fields)

### 15.1 Complete Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **id** | UUID | Auto | Unique identifier |
| **dealershipId** | UUID | Yes | Reference to dealership |
| **vin** | Text | No | 17-character VIN |
| **stockNumber** | Text | No | Stock reference number |
| **condition** | Text | Yes | "new" or "used" |
| **make** | Text | Yes | Manufacturer name |
| **model** | Text | Yes | Vehicle model |
| **trim** | Text | Yes | Trim level |
| **year** | Text | Yes | Model year |
| **color** | Text | Yes | Exterior color |
| **price** | Text | Yes | Vehicle price |
| **kilometers** | Text | Yes | Odometer reading |
| **transmission** | Text | Yes | Transmission type |
| **fuelType** | Text | Yes | Fuel type |
| **bodyType** | Text | Yes | Body style |
| **drivetrain** | Text | No | Drive configuration |
| **engineCylinders** | Text | No | Number of cylinders |
| **engineDisplacement** | Text | No | Engine size |
| **features** | Array | No | List of features |
| **listingLink** | Text | Yes | Listing URL |
| **carfaxLink** | Text | Yes | Carfax URL |
| **carfaxStatus** | Text | No | "clean" or "unavailable" |
| **notes** | Text | Yes | Additional notes |
| **status** | Text | Yes | "available", "pending", "sold" |
| **createdAt** | Timestamp | Auto | Creation date |

---

## 16. Keyboard Shortcuts & Interactions

| Interaction | Action |
|-------------|--------|
| **Click dealership** | Filter to that dealership's inventory |
| **Click vehicle card** | No action (use buttons) |
| **Hover vehicle card** | Reveals action buttons clearly |
| **Hover dealership** | Reveals edit/delete buttons |
| **Enter in search** | Filters immediately (real-time) |
| **Escape in dialogs** | Closes the dialog |

---

## 17. Notifications & Feedback

### 17.1 Success Messages

| Action | Message |
|--------|---------|
| Create Dealership | "Success - Dealership created" |
| Update Dealership | "Success - Dealership updated" |
| Delete Dealership | "Deleted - Dealership removed" |
| Update Vehicle | "Success - Car updated" |
| Delete Vehicle | "Deleted - Car removed from inventory" |
| Toggle to Sold | "Marked as Sold - [Vehicle] is now sold" |
| Toggle to Available | "Marked as Available - [Vehicle] is now available" |
| Export Data | "Export Successful - Exported X dealerships and Y vehicles" |
| Import Data | "Import Successful - Imported X dealerships and Y vehicles" |

### 17.2 Error Messages

| Action | Message |
|--------|---------|
| Failed Create | "Error - Failed to create dealership/car" |
| Failed Update | "Error - Failed to update" |
| Failed Delete | "Error - Failed to delete" |
| Invalid Import | "Import Failed - Please check the file format" |

---

## 18. Responsive Behavior

The Inventory page adapts to different screen sizes:

| Screen Size | Layout Changes |
|-------------|----------------|
| **Desktop (lg+)** | Full sidebar + 4-column filter grid |
| **Tablet (md)** | Narrower sidebar, 3-column filters |
| **Mobile (sm)** | Stacked layout, collapsible sidebar |

---

## 19. Car Manufacturers List

The system supports the following 41 car manufacturers:

| | | | |
|---|---|---|---|
| Acura | Alfa Romeo | Aston Martin | Audi |
| Bentley | BMW | Buick | Cadillac |
| Chevrolet | Chrysler | Dodge | Ferrari |
| Fiat | Ford | Genesis | GMC |
| Honda | Hyundai | Infiniti | Jaguar |
| Jeep | Kia | Lamborghini | Land Rover |
| Lexus | Lincoln | Maserati | Mazda |
| McLaren | Mercedes-Benz | MINI | Mitsubishi |
| Nissan | Porsche | Ram | Rolls-Royce |
| Subaru | Tesla | Toyota | Volkswagen |
| Volvo | | | |

---

## 20. Color Options

The system includes 14 standard color options:

| Color | Color | Color | Color |
|-------|-------|-------|-------|
| Black | White | Silver | Gray |
| Red | Blue | Brown | Green |
| Beige | Gold | Orange | Yellow |
| Purple | Other | | |

---

*End of Inventory Tab Documentation*
