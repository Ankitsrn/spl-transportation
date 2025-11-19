export interface PricingTier {
  passengers: string;
  price: number;
}

export interface Route {
  id: number;
  from: string;
  to: string;
  pricing: PricingTier[];
  distance: string;
  duration: string;
}

export interface BookingFormData {
  pickupLocation: string;
  pickupAddress: string;
  dropoffLocation: string;
  dropoffAddress: string;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  luggage: number;
  flightNumber: string;
  childSeat: boolean;
  fullName: string;
  email: string;
  contactNumber: string;
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}