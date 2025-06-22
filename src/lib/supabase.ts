import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://vgifmkixezmzxjraprjn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaWZta2l4ZXptenhqcmFwcmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTg0NDAsImV4cCI6MjA2NjA5NDQ0MH0.WwRp7rNxuC1neO1uGOH-YlOuummnMhzaSUmWMvu2GJM';

// Create and export the Supabase client with Clerk integration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Function to set Supabase session with Clerk JWT
export const setSupabaseSession = async (clerkToken: string) => {
  const { data, error } = await supabase.auth.setSession({
    access_token: clerkToken,
    refresh_token: 'dummy-refresh-token' // Required by Supabase but not used with Clerk
  });
  
  if (error) {
    console.error('Error setting Supabase session:', error);
    throw error;
  }
  
  return data;
};

// Function to clear Supabase session
export const clearSupabaseSession = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error clearing Supabase session:', error);
  }
};

// Type definitions
export interface Driver {
  id: string;
  clerk_user_id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  is_active: boolean;
  location_lat?: number;
  location_lon?: number;
  created_at: string;
  updated_at: string;
  cars?: Car[];
}

export interface Car {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  license: string;
  seats: number;
  created_at?: string;
  updated_at?: string;
}

export interface RiderProfile {
  id: string;
  clerk_user_id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  rider_clerk_id: string;
  driver_id: string;
  pickup_lat: number;
  pickup_lon: number;
  dropoff_lat: number;
  dropoff_lon: number;
  pickup_address: string;
  dropoff_address: string;
  departure_time: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  fare: number;
  created_at: string;
  drivers?: Driver & { cars?: Car[] };
}

export interface DriverData {
  clerk_user_id: string;
  name: string;
  phone: string;
  email: string;
  rating?: number;
  is_active?: boolean;
  location_lat?: number;
  location_lon?: number;
}

export interface CarData {
  user_id: string;
  make: string;
  model: string;
  year: number;
  license: string;
  seats: number;
}

export interface RiderData {
  clerk_user_id: string;
  name: string;
  phone: string;
  email: string;
  rating?: number;
}

export interface BookingData {
  rider_clerk_id: string;
  driver_id: string;
  pickup_lat: number;
  pickup_lon: number;
  dropoff_lat: number;
  dropoff_lon: number;
  pickup_address: string;
  dropoff_address: string;
  departure_time: string;
  fare: number;
}

// Enhanced database helper functions with better error handling
export const dbHelpers = {
  // Helper function to ensure user is authenticated
  async ensureAuthenticated() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('User not authenticated. Please sign in again.');
    }
    return user;
  },

  // Driver operations
  async createDriver(driverData: DriverData): Promise<Driver> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('drivers')
      .insert([driverData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
    return data as Driver;
  },

  async updateDriver(clerkUserId: string, updates: Partial<DriverData>): Promise<Driver> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating driver:', error);
      throw error;
    }
    return data as Driver;
  },

  async getDriverByClerkId(clerkUserId: string): Promise<Driver | null> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        cars (
          id,
          make,
          model,
          year,
          license,
          seats
        )
      `)
      .eq('clerk_user_id', clerkUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error getting driver:', error);
      throw error;
    }
    return data as Driver | null;
  },

  async getAllActiveDrivers(): Promise<Driver[]> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        cars (
          id,
          make,
          model,
          year,
          license,
          seats
        )
      `)
      .eq('is_active', true)
      .order('rating', { ascending: false });
    
    if (error) {
      console.error('Error getting active drivers:', error);
      throw error;
    }
    return data as Driver[];
  },

  // Car operations
  async createCar(carData: CarData): Promise<Car> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('cars')
      .insert([carData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating car:', error);
      throw error;
    }
    return data as Car;
  },

  async updateCar(carId: string, updates: Partial<CarData>): Promise<Car> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('cars')
      .update(updates)
      .eq('id', carId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating car:', error);
      throw error;
    }
    return data as Car;
  },

  async getCarsByUserId(userId: string): Promise<Car[]> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error getting cars:', error);
      throw error;
    }
    return data as Car[];
  },

  async deleteCar(carId: string): Promise<void> {
    await this.ensureAuthenticated();
    
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', carId);
    
    if (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  },

  // Rider operations
  async createRiderProfile(riderData: RiderData): Promise<RiderProfile> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('rider_profiles')
      .insert([riderData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating rider profile:', error);
      throw error;
    }
    return data as RiderProfile;
  },

  async getRiderByClerkId(clerkUserId: string): Promise<RiderProfile | null> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('rider_profiles')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error getting rider:', error);
      throw error;
    }
    return data as RiderProfile | null;
  },

  async updateRiderProfile(clerkUserId: string, updates: Partial<RiderData>): Promise<RiderProfile> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('rider_profiles')
      .update(updates)
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating rider profile:', error);
      throw error;
    }
    return data as RiderProfile;
  },

  // Booking operations
  async createBooking(bookingData: BookingData): Promise<Booking> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
    return data as Booking;
  },

  async getBookingsByRider(riderClerkId: string): Promise<Booking[]> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        drivers (
          id,
          name,
          phone,
          email,
          cars (
            make,
            model,
            year,
            license
          )
        )
      `)
      .eq('rider_clerk_id', riderClerkId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting rider bookings:', error);
      throw error;
    }
    return data as Booking[];
  },

  async getBookingsByDriver(driverId: string): Promise<Booking[]> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting driver bookings:', error);
      throw error;
    }
    return data as Booking[];
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
    return data as Booking;
  },

  // Driver matching function
  async findDriverMatch(riderLat: number, riderLon: number, departureTime: string): Promise<Driver | null> {
    await this.ensureAuthenticated();
    
    const { data, error } = await supabase.rpc('find_driver_match', {
      rider_lat: riderLat,
      rider_lon: riderLon,
      departure_time: departureTime
    });

    if (error) {
      console.error('Error finding driver match:', error);
      throw error;
    }
    return data && data.length > 0 ? data[0] as Driver : null;
  },

  // Real-time subscriptions
  subscribeToDriverChanges(callback: (payload: any) => void) {
    return supabase
      .channel('drivers_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'drivers' }, 
        callback
      )
      .subscribe();
  },

  subscribeToBookingChanges(callback: (payload: any) => void) {
    return supabase
      .channel('bookings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' }, 
        callback
      )
      .subscribe();
  }
};