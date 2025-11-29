import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

// Types based on database schema
export interface Dealership {
  id: string;
  name: string;
  location: string;
  province: string;
  address: string;
  postalCode: string;
  phone: string;
  createdAt?: string;
}

export interface Car {
  id: string;
  dealershipId: string;
  vin: string;
  stockNumber?: string;
  condition: string;
  make: string;
  model: string;
  trim: string;
  year: string;
  color: string;
  price: string;
  kilometers: string;
  transmission: string;
  fuelType: string;
  bodyType: string;
  drivetrain?: string;
  engineCylinders?: string;
  engineDisplacement?: string;
  features?: string[];
  listingLink: string;
  carfaxLink: string;
  carfaxStatus?: 'clean' | 'claims' | 'unavailable';
  notes: string;
  status: 'available' | 'sold' | 'pending';
  createdAt?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CarCounts {
  total: number;
  available: number;
  sold: number;
  pending: number;
}

// API functions
async function fetchDealerships(): Promise<Dealership[]> {
  const response = await fetch('/api/dealerships');
  if (!response.ok) throw new Error('Failed to fetch dealerships');
  return response.json();
}

async function fetchCarsPaginated(
  page: number = 1,
  pageSize: number = 50,
  dealershipId?: string,
  search?: string,
  status?: string
): Promise<PaginatedResult<Car>> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());
  if (dealershipId) params.append('dealershipId', dealershipId);
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  
  const response = await fetch(`/api/cars/paginated?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch cars');
  return response.json();
}

async function fetchCarCounts(dealershipId?: string): Promise<CarCounts> {
  const params = new URLSearchParams();
  if (dealershipId) params.append('dealershipId', dealershipId);
  
  const response = await fetch(`/api/cars/counts?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch car counts');
  return response.json();
}

async function fetchCars(dealershipId?: string, search?: string): Promise<Car[]> {
  const params = new URLSearchParams();
  if (dealershipId) params.append('dealershipId', dealershipId);
  if (search) params.append('search', search);
  
  const response = await fetch(`/api/cars?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch cars');
  return response.json();
}

async function fetchCarByVin(vin: string): Promise<Car | null> {
  const response = await fetch(`/api/cars/vin/${vin}`);
  if (!response.ok) throw new Error('Failed to fetch car');
  return response.json();
}

async function fetchCarByStockNumber(stockNumber: string): Promise<Car | null> {
  const response = await fetch(`/api/cars/stock/${stockNumber}`);
  if (!response.ok) throw new Error('Failed to fetch car');
  return response.json();
}

async function createDealership(dealership: Omit<Dealership, 'id' | 'createdAt'>): Promise<Dealership> {
  const response = await fetch('/api/dealerships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dealership),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Failed to create dealership');
  }
  return response.json();
}

async function updateDealership(id: string, dealership: Partial<Dealership>): Promise<Dealership> {
  const response = await fetch(`/api/dealerships/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dealership),
  });
  if (!response.ok) throw new Error('Failed to update dealership');
  return response.json();
}

async function deleteDealership(id: string): Promise<void> {
  const response = await fetch(`/api/dealerships/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete dealership');
}

async function createCar(car: Omit<Car, 'id' | 'createdAt'>): Promise<Car> {
  const response = await fetch('/api/cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  if (!response.ok) throw new Error('Failed to create car');
  return response.json();
}

async function updateCar(id: string, car: Partial<Car>): Promise<Car> {
  const response = await fetch(`/api/cars/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  if (!response.ok) throw new Error('Failed to update car');
  return response.json();
}

async function deleteCar(id: string): Promise<void> {
  const response = await fetch(`/api/cars/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete car');
}

// React Query hooks
export function useDealerships() {
  return useQuery({
    queryKey: ['dealerships'],
    queryFn: fetchDealerships,
  });
}

export function useCars(dealershipId?: string, search?: string) {
  return useQuery({
    queryKey: ['cars', dealershipId, search],
    queryFn: () => fetchCars(dealershipId, search),
  });
}

export function useCarsPaginated(
  page: number = 1,
  pageSize: number = 50,
  dealershipId?: string,
  search?: string,
  status?: string
) {
  return useQuery({
    queryKey: ['cars-paginated', page, pageSize, dealershipId, search, status],
    queryFn: () => fetchCarsPaginated(page, pageSize, dealershipId, search, status),
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
  });
}

export function useCarCounts(dealershipId?: string) {
  return useQuery({
    queryKey: ['car-counts', dealershipId],
    queryFn: () => fetchCarCounts(dealershipId),
    staleTime: 60000,
  });
}

export function useCarByVin(vin: string) {
  return useQuery({
    queryKey: ['car-vin', vin],
    queryFn: () => fetchCarByVin(vin),
    enabled: vin.length > 0,
  });
}

export function useCreateDealership() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createDealership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealerships'] });
      toast({ title: "Success", description: "Dealership added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to add dealership", variant: "destructive" });
    },
  });
}

export function useUpdateDealership() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Dealership> }) => updateDealership(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealerships'] });
      toast({ title: "Success", description: "Dealership updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update dealership", variant: "destructive" });
    },
  });
}

export function useDeleteDealership() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteDealership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealerships'] });
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast({ title: "Deleted", description: "Dealership removed" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete dealership", variant: "destructive" });
    },
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['cars-paginated'] });
      queryClient.invalidateQueries({ queryKey: ['car-counts'] });
      toast({ title: "Success", description: "Car added to inventory" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add car", variant: "destructive" });
    },
  });
}

export function useUpdateCar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Car> }) => updateCar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['cars-paginated'] });
      queryClient.invalidateQueries({ queryKey: ['car-counts'] });
      toast({ title: "Success", description: "Car updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update car", variant: "destructive" });
    },
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['cars-paginated'] });
      queryClient.invalidateQueries({ queryKey: ['car-counts'] });
      toast({ title: "Deleted", description: "Car removed from inventory" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete car", variant: "destructive" });
    },
  });
}

export function useToggleSoldStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (car: Car) => {
      const newStatus: 'available' | 'sold' = car.status === 'sold' ? 'available' : 'sold';
      return updateCar(car.id, { status: newStatus });
    },
    onSuccess: (updatedCar) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['cars-paginated'] });
      queryClient.invalidateQueries({ queryKey: ['car-counts'] });
      toast({ 
        title: updatedCar.status === 'sold' ? "Marked as Sold" : "Marked as Available", 
        description: `${updatedCar.year} ${updatedCar.make} ${updatedCar.model} is now ${updatedCar.status}.` 
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update car status", variant: "destructive" });
    },
  });
}
