import type { Route, Review } from './types';

export const ROUTES_DATA: Route[] = [
  {
    id: 1,
    from: "Port Douglas",
    to: "Cairns Airport",
    pricing: [
      { passengers: "1-2", price: 160 },
      { passengers: "3-4", price: 200 },
      { passengers: "5+", price: 250 }
    ],
    distance: "67 km",
    duration: "55 min"
  },
  {
    id: 2,
    from: "Cairns Airport",
    to: "Port Douglas",
    pricing: [
      { passengers: "1-2", price: 160 },
      { passengers: "3-4", price: 200 },
      { passengers: "5+", price: 250 }
    ],
    distance: "67 km",
    duration: "55 min"
  },
  {
    id: 3,
    from: "Cairns City",
    to: "Palm Cove",
    pricing: [
      { passengers: "1-2", price: 80 },
      { passengers: "3-4", price: 100 },
      { passengers: "5+", price: 130 }
    ],
    distance: "27 km",
    duration: "25 min"
  },
  {
    id: 4,
    from: "Palm Cove",
    to: "Cairns City",
    pricing: [
      { passengers: "1-2", price: 80 },
      { passengers: "3-4", price: 100 },
      { passengers: "5+", price: 130 }
    ],
    distance: "27 km",
    duration: "25 min"
  },
  {
    id: 5,
    from: "Cairns Airport",
    to: "Cairns City",
    pricing: [
      { passengers: "1-2", price: 45 },
      { passengers: "3-4", price: 60 },
      { passengers: "5+", price: 75 }
    ],
    distance: "7 km",
    duration: "12 min"
  }
];

export const AVAILABLE_LOCATIONS: string[] = Array.from(
  new Set(ROUTES_DATA.flatMap(r => [r.from, r.to]))
).sort();

export const CUSTOMER_REVIEWS: Review[] = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "Excellent service! Driver was punctual and very professional. Highly recommend for airport transfers.",
    date: "2 weeks ago"
  },
  {
    name: "Michael Chen",
    rating: 5,
    comment: "Great experience from Port Douglas to Cairns. Clean vehicle and friendly driver. Will use again!",
    date: "1 month ago"
  },
  {
    name: "Emma Wilson",
    rating: 5,
    comment: "Reliable and affordable. The booking process was super easy and driver arrived right on time.",
    date: "3 weeks ago"
  }
];