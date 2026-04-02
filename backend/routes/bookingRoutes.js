const router = require('express').Router();
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

// POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
  try {
    const { busId, seats, passengerDetails } = req.body;

    // Validate input
    if (!busId || !seats || !passengerDetails) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Check if bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ 
        success: false, 
        error: 'Bus not found' 
      });
    }

    // Check if seats are available
    const seatNumbers = seats;
    const unavailableSeats = [];
    
    for (const seatNum of seatNumbers) {
      const seat = bus.seats.find(s => s.seatNumber === seatNum);
      if (!seat || !seat.isAvailable) {
        unavailableSeats.push(seatNum);
      }
    }

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Seats ${unavailableSeats.join(', ')} are not available`,
      });
    }

    // Calculate total price
    const totalPrice = seatNumbers.length * bus.price;

    // Set expiry time (2 minutes from now)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 2);

    // Create booking
    const booking = new Booking({
      busId,
      seats: seatNumbers,
      passengerDetails,
      totalPrice,
      expiryTime,
      status: 'pending',
    });

    await booking.save();

    // Lock seats (mark as unavailable temporarily)
    for (const seatNum of seatNumbers) {
      const seat = bus.seats.find(s => s.seatNumber === seatNum);
      if (seat) {
        seat.isAvailable = false;
      }
    }
    bus.availableSeats -= seatNumbers.length;
    await bus.save();

    // Set timeout to expire booking after 2 minutes
    setTimeout(async () => {
      try {
        const pendingBooking = await Booking.findById(booking._id);
        if (pendingBooking && pendingBooking.status === 'pending') {
          pendingBooking.status = 'expired';
          await pendingBooking.save();

          // Release seats
          const busAgain = await Bus.findById(busId);
          if (busAgain) {
            for (const seatNum of seatNumbers) {
              const seat = busAgain.seats.find(s => s.seatNumber === seatNum);
              if (seat) {
                seat.isAvailable = true;
              }
            }
            busAgain.availableSeats += seatNumbers.length;
            await busAgain.save();
          }
          console.log(`Booking ${booking._id} expired and seats released`);
        }
      } catch (err) {
        console.error('Error in booking expiry handler:', err);
      }
    }, 120000); // 2 minutes

    res.status(201).json({
      success: true,
      message: 'Booking pending - complete payment within 2 minutes',
      id: booking._id,
      seatsBooked: seatNumbers,
      totalPrice,
      expiryTime,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// PUT /api/bookings/:bookingId/confirm - Confirm booking
router.put('/:bookingId/confirm', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        error: 'Booking cannot be confirmed' 
      });
    }

    if (new Date() > booking.expiryTime) {
      booking.status = 'expired';
      await booking.save();
      
      // Release seats
      const bus = await Bus.findById(booking.busId);
      if (bus) {
        for (const seatNum of booking.seats) {
          const seat = bus.seats.find(s => s.seatNumber === seatNum);
          if (seat) {
            seat.isAvailable = true;
          }
        }
        bus.availableSeats += booking.seats.length;
        await bus.save();
      }
      
      return res.status(400).json({ 
        success: false, 
        error: 'Booking has expired' 
      });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      id: booking._id,
      seatsBooked: booking.seats,
      totalPrice: booking.totalPrice,
    });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// GET /api/bookings/:bookingId - Get booking details
router.get('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;