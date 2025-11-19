import { NextRequest, NextResponse } from 'next/server';

interface BookingRequest {
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
  totalPrice: number;
}

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingRequest = await request.json();

    // Validate required fields
    if (!bookingData.email || !bookingData.fullName || !bookingData.contactNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Here you would:
    // 1. Save booking to database
    // 2. Send confirmation email to customer
    // 3. Send notification email to taxi company

    // For now, we'll just log and return success
    console.log('New Booking:', bookingData);

    // Simulate sending emails
    await sendCustomerEmail(bookingData);
    await sendCompanyEmail(bookingData);

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed',
      bookingId: generateBookingId()
    });

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}

// Helper function to generate booking ID
function generateBookingId(): string {
  return 'BK' + Date.now().toString(36).toUpperCase();
}

// Simulate sending customer confirmation email
async function sendCustomerEmail(booking: BookingRequest) {
  console.log('Sending customer email to:', booking.email);
  
  const emailContent = `
    Dear ${booking.fullName},

    Thank you for booking with QLD Taxi Services!

    Booking Details:
    ----------------
    Pickup: ${booking.pickupLocation}
    Address: ${booking.pickupAddress}
    
    Dropoff: ${booking.dropoffLocation}
    Address: ${booking.dropoffAddress}
    
    Date & Time: ${booking.pickupDate} at ${booking.pickupTime}
    Passengers: ${booking.passengers}
    Luggage: ${booking.luggage}
    ${booking.flightNumber ? `Flight: ${booking.flightNumber}` : ''}
    Child Seat: ${booking.childSeat ? 'Yes' : 'No'}
    
    Total Fare: $${booking.totalPrice}

    We look forward to serving you!

    Best regards,
    QLD Taxi Services
    +61 7 4098 5555
  `;

  // In production, use a service like Resend, SendGrid, or Nodemailer
  // await resend.emails.send({
  //   from: 'bookings@qldtaxi.com.au',
  //   to: booking.email,
  //   subject: 'Booking Confirmation - QLD Taxi Services',
  //   text: emailContent
  // });

  return true;
}

// Simulate sending company notification email
async function sendCompanyEmail(booking: BookingRequest) {
  console.log('Sending company notification');
  
  const emailContent = `
    New Booking Received!

    Customer Details:
    ----------------
    Name: ${booking.fullName}
    Email: ${booking.email}
    Phone: ${booking.contactNumber}

    Trip Details:
    -------------
    Pickup: ${booking.pickupLocation}
    Address: ${booking.pickupAddress}
    
    Dropoff: ${booking.dropoffLocation}
    Address: ${booking.dropoffAddress}
    
    Date & Time: ${booking.pickupDate} at ${booking.pickupTime}
    Passengers: ${booking.passengers}
    Luggage: ${booking.luggage}
    ${booking.flightNumber ? `Flight: ${booking.flightNumber}` : ''}
    Child Seat: ${booking.childSeat ? 'Yes' : 'No'}
    
    Total Fare: $${booking.totalPrice}
  `;

  // In production, send to company email
  // await resend.emails.send({
  //   from: 'system@qldtaxi.com.au',
  //   to: 'bookings@qldtaxi.com.au',
  //   subject: 'New Booking - Action Required',
  //   text: emailContent
  // });

  return true;
}