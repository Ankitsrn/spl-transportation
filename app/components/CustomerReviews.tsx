'use client';
import { Star, Quote } from 'lucide-react';
// import { CUSTOMER_REVIEWS } from '../data'; // Keep your import if you prefer

// Temporary mock data to make this component renderable immediately for testing
const CUSTOMER_REVIEWS = [
  {
    name: 'Sarah Johnson',
    date: 'Oct 12, 2023',
    rating: 5,
    comment: 'The driver was incredibly professional and arrived exactly on time. The car was spotless. Highly recommended!'
  },
  {
    name: 'Michael Chen',
    date: 'Sep 28, 2023',
    rating: 5,
    comment: 'Best airport transfer I have ever used. The flight tracking feature is a lifesaver. Will definitely book again.'
  },
  {
    name: 'Emily Davis',
    date: 'Nov 05, 2023',
    rating: 4,
    comment: 'Great service for city commuting. Very comfortable ride, though traffic was a bit heavy. Driver knew all the shortcuts!'
  }
];

export default function CustomerReviews() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-16">
           <p className="text-yellow-500 dark:text-yellow-400 font-bold tracking-wider uppercase text-sm mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {CUSTOMER_REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 
                         border border-gray-100 dark:border-gray-800 
                         shadow-lg hover:shadow-xl dark:hover:shadow-yellow-900/10 
                         transition-all duration-300 hover:-translate-y-1"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute top-6 right-8 opacity-10 dark:opacity-20">
                <Quote className="w-12 h-12 text-yellow-500 fill-current" />
              </div>

              {/* Rating Stars */}
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300 dark:text-gray-700'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 italic relative z-10">
                &quot;{review.comment}&quot;
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-gray-100 dark:bg-gray-800 mb-6"></div>

              {/* User Info */}
              <div className="flex justify-between items-end">
                <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                        {review.name}
                    </p>
                    <p className="text-sm text-yellow-500 font-medium">Verified Client</p>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {review.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}