'use client';
import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    // Added min-h-screen, top padding for navbar, and dark mode background
    <div className="min-h-screen max-w-5xl mx-auto px-6 pb-12 pt-24 md:pt-32 dark:bg-slate-950 transition-colors">
      {/* Page Header */}
      <div className="flex items-center space-x-3 mb-10">
        <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white">
          Terms & Conditions
        </h1>
      </div>

      {/* Terms Container */}
      <div className="space-y-8">
        {/* Section 1 */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-slate-200 transition-colors dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 mb-3 dark:text-white">
            1. Booking Terms
          </h2>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            All bookings are subject to availability and confirmation. We
            recommend booking at least 24 hours in advance for guaranteed
            service.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-slate-200 transition-colors dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 mb-3 dark:text-white">
            2. Pricing
          </h2>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            All prices are in Australian Dollars (AUD) and are fixed rates for
            the specified routes. Additional charges may apply for child seats
            ($5) and waiting time beyond the agreed pickup time.
          </p>
        </section>

        {/* Section 3 */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-slate-200 transition-colors dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 mb-3 dark:text-white">
            3. Cancellation Policy
          </h2>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            Cancellations made more than 24 hours before the scheduled pickup time
            are free of charge. Cancellations within 24 hours may incur a 50%
            cancellation fee. No-shows will be charged the full fare.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-slate-200 transition-colors dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 mb-3 dark:text-white">
            4. Passenger Responsibilities
          </h2>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            Passengers are responsible for being ready at the pickup location at
            the scheduled time. Please ensure you provide accurate contact
            information for communication regarding your booking.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-slate-200 transition-colors dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 mb-3 dark:text-white">
            5. Luggage Policy
          </h2>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            Standard luggage allowance is included in the fare. Oversized or
            excessive luggage may require a larger vehicle at an additional cost.
          </p>
        </section>

        {/* Section 6 */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-slate-200 transition-colors dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 mb-3 dark:text-white">
            6. Safety & Conduct
          </h2>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            All passengers must comply with Queensland road safety laws. The
            driver reserves the right to refuse service to intoxicated or
            disruptive passengers.
          </p>
        </section>

        {/* Section 7 */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-slate-200 transition-colors dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 mb-3 dark:text-white">
            7. Liability
          </h2>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            While we take every precaution to ensure safe and timely service, we
            are not liable for delays caused by traffic, weather, or
            circumstances beyond our control.
          </p>
        </section>
      </div>
    </div>
  );
}