# AutoManager - Data Structures & Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Type System](#type-system)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Storage Layer](#storage-layer)
6. [API Layer](#api-layer)
7. [Frontend Data Layer](#frontend-data-layer)
8. [Field Descriptions](#field-descriptions)

---

## Overview

AutoManager uses a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│  - UI Components                                        │
│  - React Query Hooks (client/src/lib/api-hooks.ts)    │
│  - TypeScript Interfaces                               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/JSON
┌────────────────────▼────────────────────────────────────┐
│                  API LAYER (Express)                    │
│  - REST Endpoints (server/routes.ts)                   │
│  - Request Validation (Zod schemas)                    │
│  - Error Handling                                      │
└────────────────────┬────────────────────────────────────┘
                     │ Function Calls
┌────────────────────▼────────────────────────────────────┐
│              STORAGE LAYER (Drizzle ORM)               │
│  - Interface Definition (IStorage)                     │
│  - Database Operations (DatabaseStorage class)         │
│  - Query Building                                      │
└────────────────────┬────────────────────────────────────┘
                     │ SQL Queries
┌────────────────────▼────────────────────────────────────┐
│                DATABASE (PostgreSQL)                    │
│  - Tables: dealerships, cars                          │
│  - Relationships & Constraints                         │
│  - Data Persistence                                    │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Location: `shared/schema.ts`

The database uses **PostgreSQL** with **Drizzle ORM** for type-safe database operations.

### Table 1: `dealerships`

**Purpose**: Stores dealership/location information for the auto inventory system.

```typescript
dealerships = pgTable("dealerships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  province: text("province").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Field Breakdown**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, AUTO (UUID) | Unique identifier, automatically generated |
| `name` | TEXT | NOT NULL | Dealership name (e.g., "Downtown Toyota") |
| `location` | TEXT | NOT NULL | City/area (e.g., "Toronto") |
| `province` | TEXT | NOT NULL | Province (e.g., "Ontario", "BC") |
| `address` | TEXT | NOT NULL | Full street address |
| `postalCode` | TEXT | NOT NULL | Canadian postal code (e.g., "M5H 2N2") |
| `phone` | TEXT | NOT NULL | Contact phone number |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT NOW | Record creation timestamp |

**Relationships**:
- **One-to-Many** with `cars` table (one dealership has many cars)

---

### Table 2: `cars`

**Purpose**: Stores complete vehicle inventory with detailed specifications.

```typescript
cars = pgTable("cars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealershipId: varchar("dealership_id").notNull().references(() => dealerships.id, { onDelete: 'cascade' }),
  vin: text("vin"),
  stockNumber: text("stock_number"),
  condition: text("condition").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  trim: text("trim").notNull(),
  year: text("year").notNull(),
  color: text("color").notNull(),
  price: text("price").notNull(),
  kilometers: text("kilometers").notNull(),
  transmission: text("transmission").notNull(),
  fuelType: text("fuel_type").notNull(),
  bodyType: text("body_type").notNull(),
  drivetrain: text("drivetrain"),
  engineCylinders: text("engine_cylinders"),
  engineDisplacement: text("engine_displacement"),
  features: text("features").array(),
  listingLink: text("listing_link").notNull(),
  carfaxLink: text("carfax_link").notNull(),
  carfaxStatus: text("carfax_status"),
  notes: text("notes").notNull(),
  status: text("status").notNull().default('available'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Field Breakdown**:

| Field | Type | Constraints | Description | Example Value |
|-------|------|-------------|-------------|---------------|
| `id` | VARCHAR | PRIMARY KEY, AUTO (UUID) | Unique car identifier | "550e8400-e29b-41d4..." |
| `dealershipId` | VARCHAR | FOREIGN KEY, NOT NULL, CASCADE DELETE | References dealerships.id | "123e4567-e89b-12d3..." |
| `vin` | TEXT | NULLABLE | 17-character Vehicle Identification Number | "1HGBH41JXMN109186" |
| `stockNumber` | TEXT | NULLABLE | Internal dealership stock number | "A1234", "USED-2023-045" |
| `condition` | TEXT | NOT NULL | Vehicle condition | "used", "new", "certified" |
| `make` | TEXT | NOT NULL | Manufacturer brand | "Toyota", "Honda", "Ford" |
| `model` | TEXT | NOT NULL | Model name | "Camry", "Civic", "F-150" |
| `trim` | TEXT | NOT NULL | Trim level/package | "SE", "Sport", "Limited" |
| `year` | TEXT | NOT NULL | Model year | "2023", "2020" |
| `color` | TEXT | NOT NULL | Exterior color | "White", "Black", "Silver" |
| `price` | TEXT | NOT NULL | Listing price (stored as text) | "35000", "48999" |
| `kilometers` | TEXT | NOT NULL | Odometer reading | "15000", "42300" |
| `transmission` | TEXT | NOT NULL | Transmission type | "automatic", "manual", "cvt" |
| `fuelType` | TEXT | NOT NULL | Fuel type | "gasoline", "diesel", "electric", "hybrid" |
| `bodyType` | TEXT | NOT NULL | Vehicle body style | "sedan", "suv", "truck", "coupe" |
| `drivetrain` | TEXT | NULLABLE | Drive configuration | "fwd", "rwd", "awd", "4wd" |
| `engineCylinders` | TEXT | NULLABLE | Number of cylinders | "4", "6", "8" |
| `engineDisplacement` | TEXT | NULLABLE | Engine size in liters | "2.0L", "3.5L", "5.7L" |
| `features` | TEXT[] | NULLABLE, ARRAY | Array of feature strings | ["Navigation", "Sunroof", "Leather"] |
| `listingLink` | TEXT | NOT NULL | URL to original listing | "https://autotrader.ca/..." |
| `carfaxLink` | TEXT | NOT NULL | URL to Carfax report | "https://carfax.com/..." |
| `carfaxStatus` | TEXT | NULLABLE | Carfax report status | "clean", "claims", "unavailable" |
| `notes` | TEXT | NOT NULL | Additional notes/comments | "Excellent condition, one owner" |
| `status` | TEXT | NOT NULL, DEFAULT 'available' | Inventory status | "available", "sold", "pending" |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT NOW | Record creation timestamp | "2024-01-15 14:30:00" |

**Relationships**:
- **Many-to-One** with `dealerships` table (many cars belong to one dealership)
- **Cascade Delete**: When a dealership is deleted, all its cars are automatically deleted

**Special Notes**:
- `features` is a **PostgreSQL array** type, allowing multiple feature strings per vehicle
- Price and kilometers stored as `text` for flexibility (handles formatting, commas, etc.)
- VIN and stockNumber are nullable because not all vehicles may have this info initially

---

## Type System

### Location: `shared/schema.ts` and `client/src/lib/api-hooks.ts`

The type system uses **TypeScript** + **Zod** for runtime validation and compile-time type safety.

### Zod Schemas (Server-Side Validation)

**Purpose**: Validate incoming API requests before database operations.

```typescript
// Insert schemas - used for creating new records
export const insertDealershipSchema = createInsertSchema(dealerships).omit({
  id: true,        // Auto-generated by database
  createdAt: true, // Auto-generated by database
});

export const insertCarSchema = createInsertSchema(cars).omit({
  id: true,
  createdAt: true,
});

// Update schemas - used for updating existing records
export const updateDealershipSchema = insertDealershipSchema.partial();
export const updateCarSchema = insertCarSchema.partial();
```

**How It Works**:
1. `createInsertSchema()` automatically generates a Zod schema from the Drizzle table definition
2. `.omit()` removes fields that are auto-generated (id, createdAt)
3. `.partial()` makes all fields optional for update operations

### TypeScript Types

```typescript
// Insert types - for creating new records
export type InsertDealership = z.infer<typeof insertDealershipSchema>;
export type InsertCar = z.infer<typeof insertCarSchema>;

// Update types - for updating existing records
export type UpdateDealership = z.infer<typeof updateDealershipSchema>;
export type UpdateCar = z.infer<typeof updateCarSchema>;

// Select types - for querying/reading records
export type Dealership = typeof dealerships.$inferSelect;
export type Car = typeof cars.$inferSelect;
```

**Type Flow**:

```
Database Table Definition (Drizzle)
         ↓
Zod Schema (Runtime Validation)
         ↓
TypeScript Types (Compile-Time Safety)
         ↓
Frontend Interfaces (React Components)
```

---

## Data Flow Architecture

### Complete Data Flow Example: Creating a New Car

```
┌──────────────────────────────────────────────────────────────┐
│ STEP 1: USER ACTION (Frontend)                              │
│ User clicks "Add to Inventory" button                       │
│ Location: client/src/pages/upload.tsx                       │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 2: REACT QUERY MUTATION (Frontend)                     │
│ const createCarMutation = useCreateCar();                   │
│ createCarMutation.mutateAsync(carData);                     │
│ Location: client/src/lib/api-hooks.ts                       │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼ HTTP POST /api/cars
┌──────────────────────────────────────────────────────────────┐
│ STEP 3: API ENDPOINT (Backend)                              │
│ app.post("/api/cars", async (req, res) => {                │
│   const validated = insertCarSchema.parse(req.body);       │
│   const car = await storage.createCar(validated);          │
│   res.status(201).json(car);                               │
│ });                                                          │
│ Location: server/routes.ts                                  │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼ Function Call
┌──────────────────────────────────────────────────────────────┐
│ STEP 4: STORAGE LAYER (Backend)                             │
│ async createCar(car: InsertCar): Promise<Car> {            │
│   const results = await db.insert(schema.cars)             │
│     .values(car)                                            │
│     .returning();                                           │
│   return results[0];                                        │
│ }                                                            │
│ Location: server/storage.ts                                 │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼ SQL INSERT
┌──────────────────────────────────────────────────────────────┐
│ STEP 5: DATABASE (PostgreSQL)                               │
│ INSERT INTO cars (dealership_id, make, model, ...)         │
│ VALUES ($1, $2, $3, ...)                                    │
│ RETURNING *;                                                │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼ Returns Created Record
┌──────────────────────────────────────────────────────────────┐
│ STEP 6: RESPONSE & CACHE INVALIDATION (Frontend)           │
│ - Receive created car object                                │
│ - queryClient.invalidateQueries(['cars'])                   │
│ - Toast notification shows success                          │
│ - UI automatically re-fetches and updates                   │
└──────────────────────────────────────────────────────────────┘
```

### Data Validation Layers

The system uses **three layers** of validation:

1. **TypeScript Compile-Time** (Development)
   - Catches type mismatches before code runs
   - IDE autocomplete and error detection
   
2. **Zod Runtime Validation** (Server)
   - Validates incoming API requests
   - Rejects malformed/invalid data
   - Example: `insertCarSchema.parse(req.body)`

3. **Database Constraints** (Storage)
   - NOT NULL constraints
   - Foreign key relationships
   - Data type enforcement

---

## Storage Layer

### Location: `server/storage.ts`

The storage layer provides an **abstraction** between the API and database, making the codebase:
- **Testable** (can mock IStorage interface)
- **Maintainable** (change database without touching API code)
- **Type-safe** (TypeScript interfaces ensure correct usage)

### IStorage Interface

```typescript
export interface IStorage {
  // Dealership operations
  getAllDealerships(): Promise<Dealership[]>;
  getDealership(id: string): Promise<Dealership | undefined>;
  createDealership(dealership: InsertDealership): Promise<Dealership>;
  updateDealership(id: string, dealership: UpdateDealership): Promise<Dealership | undefined>;
  deleteDealership(id: string): Promise<boolean>;
  
  // Car operations
  getAllCars(): Promise<Car[]>;
  getCarsByDealership(dealershipId: string): Promise<Car[]>;
  getCar(id: string): Promise<Car | undefined>;
  getCarByVin(vin: string): Promise<Car | undefined>;
  getCarByStockNumber(stockNumber: string): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: string, car: UpdateCar): Promise<Car | undefined>;
  deleteCar(id: string): Promise<boolean>;
  searchCars(query: string): Promise<Car[]>;
}
```

### Key Methods Explained

#### 1. Query Operations (Read)

**Get All Cars**
```typescript
async getAllCars(): Promise<Car[]> {
  return await db.select()
    .from(schema.cars)
    .orderBy(desc(schema.cars.createdAt));
}
```
- Returns: Array of all cars
- Ordering: Newest first (by createdAt)
- Use case: Inventory page showing all vehicles

**Get Cars by Dealership**
```typescript
async getCarsByDealership(dealershipId: string): Promise<Car[]> {
  return await db.select()
    .from(schema.cars)
    .where(eq(schema.cars.dealershipId, dealershipId))
    .orderBy(desc(schema.cars.createdAt));
}
```
- Returns: All cars for a specific dealership
- Filtering: WHERE dealership_id = $1
- Use case: Viewing inventory for a single location

**Search Cars**
```typescript
async searchCars(query: string): Promise<Car[]> {
  const searchTerm = `%${query}%`;
  return await db.select()
    .from(schema.cars)
    .where(
      or(
        ilike(schema.cars.vin, searchTerm),
        ilike(schema.cars.make, searchTerm),
        ilike(schema.cars.model, searchTerm),
        // ... more fields
      )
    )
    .orderBy(desc(schema.cars.createdAt));
}
```
- Returns: Cars matching search query
- Matching: Case-insensitive LIKE across 10+ fields
- Use case: Search bar functionality

#### 2. Mutation Operations (Create/Update/Delete)

**Create Car**
```typescript
async createCar(car: InsertCar): Promise<Car> {
  const results = await db.insert(schema.cars)
    .values(car)
    .returning();
  return results[0];
}
```
- Input: InsertCar (without id, createdAt)
- Output: Complete Car object with auto-generated fields
- SQL: INSERT ... RETURNING *

**Update Car**
```typescript
async updateCar(id: string, car: UpdateCar): Promise<Car | undefined> {
  const results = await db.update(schema.cars)
    .set(car)
    .where(eq(schema.cars.id, id))
    .returning();
  return results[0];
}
```
- Input: Partial car data (only fields to update)
- Output: Updated car or undefined if not found
- SQL: UPDATE ... WHERE id = $1 RETURNING *

**Delete Car**
```typescript
async deleteCar(id: string): Promise<boolean> {
  const results = await db.delete(schema.cars)
    .where(eq(schema.cars.id, id))
    .returning();
  return results.length > 0;
}
```
- Returns: true if deleted, false if not found
- SQL: DELETE FROM cars WHERE id = $1

---

## API Layer

### Location: `server/routes.ts`

The API layer exposes **RESTful HTTP endpoints** for the frontend to consume.

### Endpoint Structure

```
BASE URL: /api

Dealerships:
  GET    /api/dealerships           - List all dealerships
  GET    /api/dealerships/:id       - Get single dealership
  POST   /api/dealerships           - Create dealership
  PATCH  /api/dealerships/:id       - Update dealership
  DELETE /api/dealerships/:id       - Delete dealership

Cars:
  GET    /api/cars                  - List all cars (with filters)
  GET    /api/cars/:id              - Get single car
  GET    /api/cars/vin/:vin         - Get car by VIN
  GET    /api/cars/stock/:stockNum  - Get car by stock number
  POST   /api/cars                  - Create car
  PATCH  /api/cars/:id              - Update car
  DELETE /api/cars/:id              - Delete car

Utilities:
  POST   /api/scrape-listing        - Extract data from listing URL
  POST   /api/decode-vin            - Decode VIN to get vehicle info
```

### Query Parameters

**GET /api/cars** supports filtering:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `dealershipId` | string | Filter by dealership | `/api/cars?dealershipId=abc123` |
| `search` | string | Search across multiple fields | `/api/cars?search=toyota` |

---

## Frontend Data Layer

### Location: `client/src/lib/api-hooks.ts`

The frontend uses **React Query** for server state management with automatic:
- **Caching** - Reduces unnecessary API calls
- **Refetching** - Keeps data fresh
- **Optimistic Updates** - UI updates before server confirms
- **Error Handling** - Consistent error states

### React Query Hooks

#### Query Hooks (Read Operations)

**useDealerships()**
```typescript
export function useDealerships() {
  return useQuery({
    queryKey: ['dealerships'],
    queryFn: fetchDealerships,
  });
}

// Usage in component:
const { data: dealerships, isLoading, error } = useDealerships();
```
- Returns: `{ data, isLoading, error, refetch, ... }`
- Cache key: `['dealerships']`
- Auto-refetch: On window focus, mount

**useCars(dealershipId?, search?)**
```typescript
export function useCars(dealershipId?: string, search?: string) {
  return useQuery({
    queryKey: ['cars', dealershipId, search],
    queryFn: () => fetchCars(dealershipId, search),
  });
}

// Usage examples:
const { data: allCars } = useCars();
const { data: dealerCars } = useCars('dealership-123');
const { data: searchResults } = useCars(undefined, 'toyota');
```
- Cache keys vary by parameters
- Independent caches for different queries

#### Mutation Hooks (Create/Update/Delete)

**useCreateCar()**
```typescript
export function useCreateCar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast({ title: "Success", description: "Car added to inventory" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add car", variant: "destructive" });
    },
  });
}

// Usage in component:
const createCarMutation = useCreateCar();
createCarMutation.mutate(carData);
```

**Mutation Flow**:
1. Call `mutate()` with data
2. API request sent
3. On success:
   - Cache invalidated (forces refetch)
   - Toast notification shown
   - UI automatically updates
4. On error:
   - Error toast shown
   - User notified

**useToggleSoldStatus()**
```typescript
export function useToggleSoldStatus() {
  return useMutation({
    mutationFn: async (car: Car) => {
      const newStatus: 'available' | 'sold' = 
        car.status === 'sold' ? 'available' : 'sold';
      return updateCar(car.id, { status: newStatus });
    },
    onSuccess: (updatedCar) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast({ 
        title: updatedCar.status === 'sold' ? "Marked as Sold" : "Marked as Available",
        description: `${updatedCar.year} ${updatedCar.make} ${updatedCar.model} is now ${updatedCar.status}.` 
      });
    },
  });
}
```
- Special mutation: Toggles between sold/available
- Smart notification: Shows current status

---

## Field Descriptions

### Dealership Fields (Detailed)

| Field | Format | Validation | Example | Notes |
|-------|--------|------------|---------|-------|
| **name** | Free text | Required, non-empty | "Downtown Toyota", "AutoMax Sales" | Business name |
| **location** | City name | Required | "Toronto", "Vancouver" | City/municipality |
| **province** | 2-letter code | Required | "ON", "BC", "AB" | Canadian provinces |
| **address** | Street address | Required | "123 Main St, Unit 5" | Full street address |
| **postalCode** | A1A 1A1 format | Required | "M5H 2N2", "V6B 2W9" | Canadian postal code |
| **phone** | Phone number | Required | "416-555-0100", "(604) 555-0200" | Contact number |

### Car Fields (Detailed)

#### Identification Fields

| Field | Format | Source | Example |
|-------|--------|--------|---------|
| **vin** | 17 alphanumeric | VIN decoder, manual entry, URL scraping | "1HGBH41JXMN109186" |
| **stockNumber** | Alphanumeric | Manual entry, URL scraping | "A1234", "USED-2023-045" |

#### Basic Information

| Field | Options/Format | Source |
|-------|----------------|--------|
| **condition** | "new", "used", "certified" | Manual entry, defaults to "used" |
| **make** | Brand name | VIN decoder, manual, URL scraping |
| **model** | Model name | VIN decoder, manual, URL scraping |
| **trim** | Trim level | API lookup, manual, URL scraping |
| **year** | YYYY | VIN decoder, manual, URL scraping |
| **color** | Color name | Manual entry, URL scraping |

#### Pricing & Mileage

| Field | Format | Storage | Display |
|-------|--------|---------|---------|
| **price** | String (numeric) | "35000" | "$35,000" |
| **kilometers** | String (numeric) | "42300" | "42,300 km" |

*Note: Stored as text to preserve formatting and handle edge cases*

#### Technical Specifications

| Field | Options | Source |
|-------|---------|--------|
| **transmission** | "automatic", "manual", "cvt", "dual-clutch" | VIN decoder, manual |
| **fuelType** | "gasoline", "diesel", "electric", "hybrid", "plug-in hybrid" | VIN decoder, manual |
| **bodyType** | "sedan", "suv", "truck", "coupe", "hatchback", "van", "wagon" | VIN decoder, manual |
| **drivetrain** | "fwd", "rwd", "awd", "4wd" | VIN decoder, manual |
| **engineCylinders** | "3", "4", "5", "6", "8", "10", "12" | VIN decoder, manual |
| **engineDisplacement** | "2.0L", "3.5L", "5.7L" | VIN decoder, manual |

#### Features Array

**Type**: PostgreSQL array of strings

**Example**:
```typescript
features: [
  "Navigation System",
  "Sunroof/Moonroof",
  "Leather Seats",
  "Heated Front Seats",
  "Backup Camera",
  "Apple CarPlay",
  "Blind Spot Monitor"
]
```

**How it works**:
- Stored as PostgreSQL `text[]` array type
- TypeScript type: `string[] | null`
- UI: Multi-select checkboxes

#### Status & Links

| Field | Type | Options | Purpose |
|-------|------|---------|---------|
| **status** | Enum | "available", "sold", "pending" | Inventory management |
| **listingLink** | URL | Any valid URL | Original listing source |
| **carfaxLink** | URL | Carfax URL or empty | Vehicle history report |
| **carfaxStatus** | Enum | "clean", "claims", "unavailable" | Report status indicator |
| **notes** | Free text | Any text | Additional info/comments |

---

## Special Data Flows

### 1. URL Scraping Flow

```
User pastes listing URL
        ↓
POST /api/scrape-listing { url: "..." }
        ↓
Fetch HTML content from URL
        ↓
Apply regex patterns to extract:
  - VIN (95%+ success rate)
  - Year, Make, Model (85-90%)
  - Price (80-85%)
  - Kilometers, Color, Stock # (70-75%)
        ↓
Return extracted data as JSON
        ↓
Frontend auto-fills form fields
        ↓
User reviews & saves to database
```

**Regex Extraction Patterns** (from `EXTRACT_FROM_URL_DETAILED.md`):
- VIN: 4-6 patterns (e.g., `VIN[:\s]*([A-HJ-NPR-Z0-9]{17})`)
- Price: 6 patterns (e.g., `\$([0-9,]+)`)
- Year: 6 patterns (e.g., `"year"\s*:\s*"?(\d{4})"?`)

### 2. Bulk URL Extraction Flow

```
User pastes multiple URLs (one per line)
        ↓
Frontend splits by newline, filters valid URLs
        ↓
For each URL sequentially:
  1. Set status to 'loading'
  2. Call /api/scrape-listing
  3. Update status to 'success' or 'error'
  4. Store extracted data
        ↓
Display results with status indicators
        ↓
User clicks "Save All to Inventory"
        ↓
Batch create all successful extractions
```

### 3. VIN Decoding Flow

```
User enters VIN (17 characters)
        ↓
POST /api/decode-vin { vin: "..." }
        ↓
Call external VIN decoder API (NHTSA or other)
        ↓
Receive vehicle specifications:
  - Year, Make, Model
  - Body type, engine specs
  - Transmission, drivetrain
        ↓
Return structured data
        ↓
Frontend auto-fills form fields
```

---

## Cache & State Management

### React Query Cache Keys

| Query | Cache Key | Invalidated By |
|-------|-----------|----------------|
| All dealerships | `['dealerships']` | Create/update/delete dealership |
| All cars | `['cars']` | Create/update/delete car |
| Filtered cars | `['cars', dealershipId, search]` | Create/update/delete car |
| Car by VIN | `['car-vin', vin]` | Update/delete that car |

### Cache Invalidation Strategy

**When creating a car**:
```typescript
queryClient.invalidateQueries({ queryKey: ['cars'] });
```
- Invalidates ALL queries starting with `['cars', ...]`
- Forces refetch of car lists
- UI automatically updates

**When deleting a dealership**:
```typescript
queryClient.invalidateQueries({ queryKey: ['dealerships'] });
queryClient.invalidateQueries({ queryKey: ['cars'] });
```
- Invalidates both dealerships and cars
- Necessary because of cascade delete relationship

---

## Error Handling

### Three-Layer Error Handling

**1. Frontend Validation**
- TypeScript compile-time checks
- React Hook Form validation
- Client-side feedback

**2. API Layer**
```typescript
try {
  const validated = insertCarSchema.parse(req.body);
  const car = await storage.createCar(validated);
  res.status(201).json(car);
} catch (error) {
  console.error("Error creating car:", error);
  res.status(400).json({ error: "Invalid car data" });
}
```

**3. Database Layer**
- Constraint violations
- Foreign key checks
- Transaction rollbacks

### User-Facing Error Messages

**React Query handles errors automatically**:
```typescript
onError: () => {
  toast({ 
    title: "Error", 
    description: "Failed to add car", 
    variant: "destructive" 
  });
}
```

---

## Performance Optimizations

### 1. Database Indexing
- Primary keys (id) are automatically indexed
- Foreign keys (dealershipId) should be indexed for join performance
- VIN and stockNumber should be indexed for lookups

### 2. Query Optimization
- Use `.select()` to fetch only needed columns
- Use `.where()` for filtering at database level
- Use `.orderBy()` for sorting at database level

### 3. Frontend Caching
- React Query caches for 5 minutes by default
- Reduces redundant API calls
- Background refetch keeps data fresh

### 4. Lazy Loading
- Queries only execute when components mount
- `enabled` option prevents premature fetches
- Suspense support for code splitting

---

## Summary

**AutoManager Data Architecture**:

✅ **Type-safe** - TypeScript + Zod validation at every layer
✅ **Scalable** - Clean separation of concerns
✅ **Maintainable** - Interface-based storage layer
✅ **User-friendly** - Automatic cache management
✅ **Robust** - Three-layer error handling
✅ **Performant** - Smart caching and query optimization

**Key Technologies**:
- **Database**: PostgreSQL (with Neon serverless)
- **ORM**: Drizzle (type-safe SQL builder)
- **Validation**: Zod (runtime schema validation)
- **API**: Express (REST endpoints)
- **State Management**: React Query (server state)
- **Type System**: TypeScript (compile-time safety)

---

## Additional Resources

- `shared/schema.ts` - Complete database schema definitions
- `server/storage.ts` - Storage interface implementation
- `server/routes.ts` - API endpoint definitions
- `client/src/lib/api-hooks.ts` - React Query hooks
- `EXTRACT_FROM_URL_DETAILED.md` - URL scraping documentation
- `FUNCTIONAL_DOCUMENTATION.md` - Feature documentation
