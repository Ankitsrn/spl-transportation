'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import RoutesPage from './components/RoutesPage';
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';
import ContactPage from './components/ContactPage';
import type { BookingFormData, Route } from './types';

export default function TaxiBookingApp() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [bookingStep, setBookingStep] = useState<number>(1);

  const [formData, setFormData] = useState<BookingFormData>({
    pickupLocation: '',
    pickupAddress: '',
    dropoffLocation: '',
    dropoffAddress: '',
    pickupDate: '',
    pickupTime: '',
    passengers: 1,
    luggage: 0,
    flightNumber: '',
    childSeat: false,
    fullName: '',
    email: '',
    contactNumber: ''
  });

  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routesLoading, setRoutesLoading] = useState<boolean>(true);

  // -------------------------------
  // LOAD ROUTES FROM API
  // -------------------------------
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch('/api/routes');
        if (!res.ok) throw new Error('Failed to fetch routes');
        const data: Route[] = await res.json();
        if (mounted) setRoutes(data);
      } catch (e) {
        console.error('Error loading routes', e);
      } finally {
        if (mounted) setRoutesLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // -------------------------------
  // AVAILABLE LOCATIONS
  // -------------------------------
  const AVAILABLE_LOCATIONS = useMemo(() => {
    return Array.from(new Set(routes.flatMap(r => [r.from, r.to]))).sort();
  }, [routes]);

  // -------------------------------
  // DROPOFF OPTIONS
  // -------------------------------
  const dropoffOptions: string[] = formData.pickupLocation
    ? Array.from(new Set(routes.filter(r => r.from === formData.pickupLocation).map(r => r.to))).sort()
    : AVAILABLE_LOCATIONS;

  // -------------------------------
  // PRICE CALCULATION
  // -------------------------------
  useEffect(() => {
    if (formData.pickupLocation && formData.dropoffLocation) {
      const route = routes.find(
        r => r.from === formData.pickupLocation && r.to === formData.dropoffLocation
      );

      if (route) {
        // SET selectedRoute ONLY if user didn't manually select via "Book This Route"
        if (!selectedRoute || selectedRoute.id !== route.id) {
          setSelectedRoute(route);
        }

        let basePrice = 0;

        if (formData.passengers <= 2) basePrice = route.pricing[0].price;
        else if (formData.passengers <= 4) basePrice = route.pricing[1].price;
        else basePrice = route.pricing[2].price;

        const childSeatCost = formData.childSeat ? 5 : 0;

        setCalculatedPrice(basePrice + childSeatCost);
      } else {
        setCalculatedPrice(0);
      }
    } else {
      setCalculatedPrice(0);
    }
  }, [
    formData.pickupLocation,
    formData.dropoffLocation,
    formData.passengers,
    formData.childSeat,
    routes
  ]);

  // -------------------------------
  // FIXED: useCallback for handleInputChange (prevents re-renders / infinite loops)
  // -------------------------------
  const handleInputChange = useCallback(
    (field: keyof BookingFormData, value: string | number | boolean) => {
      setFormData(prev => {
        if (field === 'pickupLocation') {
          const newPickup = String(value);
          const validDropoffs = Array.from(
            new Set(routes.filter(r => r.from === newPickup).map(r => r.to))
          );
          const dropoffValid = validDropoffs.includes(prev.dropoffLocation);

          return {
            ...prev,
            pickupLocation: newPickup,
            dropoffLocation: dropoffValid ? prev.dropoffLocation : ''
          };
        }

        if (field === 'passengers') {
          const parsed = Number(value);
          const n = Number.isFinite(parsed)
            ? Math.max(1, Math.min(10, Math.floor(parsed)))
            : prev.passengers;

          return { ...prev, passengers: n };
        }

        if (field === 'luggage') {
          const parsed = Number(value);
          const n = Number.isFinite(parsed)
            ? Math.max(0, Math.min(10, Math.floor(parsed)))
            : prev.luggage;

          return { ...prev, luggage: n };
        }

        return { ...prev, [field]: value };
      });
    },
    [routes]
  );

  const clearSelectedRoute = useCallback(() => {
    setSelectedRoute(null);
  }, []);

  // -------------------------------
  // HANDLE ROUTE SELECTION FROM ROUTES PAGE
  // -------------------------------
  const handleRouteSelect = useCallback((route: Route) => {
    setSelectedRoute(route);
    setFormData(prev => ({
      ...prev,
      pickupLocation: route.from,
      dropoffLocation: route.to
    }));
    setBookingStep(1);
    setCurrentPage('home');
    // Scroll to top to ensure user sees the populated form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // -------------------------------
  // BOOKING SUBMIT
  // -------------------------------
  const handleBookingSubmit = async () => {
    const bookingData = {
      ...formData,
      totalPrice: calculatedPrice,
      route: selectedRoute
    };

    console.log('Booking Details:', bookingData);
    alert(`Booking confirmed! Confirmation email sent to ${formData.email}`);

    setFormData({
      pickupLocation: '',
      pickupAddress: '',
      dropoffLocation: '',
      dropoffAddress: '',
      pickupDate: '',
      pickupTime: '',
      passengers: 1,
      luggage: 0,
      flightNumber: '',
      childSeat: false,
      fullName: '',
      email: '',
      contactNumber: ''
    });

    setBookingStep(1);
    setCurrentPage('home');
  };

  // -------------------------------
  // RENDER PAGES
  // -------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        setCurrentPage={setCurrentPage}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {currentPage === 'home' && (
        <HomePage
          formData={formData}
          handleInputChange={handleInputChange}
          bookingStep={bookingStep}
          setBookingStep={setBookingStep}
          setCurrentPage={setCurrentPage}
          AVAILABLE_LOCATIONS={AVAILABLE_LOCATIONS}
          dropoffOptions={dropoffOptions}
          selectedRoute={selectedRoute}
          clearSelectedRoute={clearSelectedRoute}
          calculatedPrice={calculatedPrice}
        />
      )}

      {currentPage === 'routes' && (
        <RoutesPage setCurrentPage={setCurrentPage} onSelectRoute={handleRouteSelect} />
      )}

      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'terms' && <TermsPage />}
      {currentPage === 'contact' && <ContactPage />}

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}