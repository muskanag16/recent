// Validation middleware for booking requests
const validateBooking = (req, res, next) => {
  const { busId, seats, passengerDetails } = req.body;

  if (!busId || typeof busId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Valid busId is required'
    });
  }

  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'At least one seat is required'
    });
  }

  if (seats.length > 6) {
    return res.status(400).json({
      success: false,
      error: 'Maximum 6 seats can be booked at once'
    });
  }

  if (!passengerDetails || !Array.isArray(passengerDetails) || passengerDetails.length !== seats.length) {
    return res.status(400).json({
      success: false,
      error: 'Passenger details must match number of seats'
    });
  }

  // Validate each passenger
  for (let i = 0; i < passengerDetails.length; i++) {
    const passenger = passengerDetails[i];
    if (!passenger.name || passenger.name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: `Passenger ${i + 1}: Valid name is required`
      });
    }
    if (!passenger.age || passenger.age < 1 || passenger.age > 120) {
      return res.status(400).json({
        success: false,
        error: `Passenger ${i + 1}: Valid age (1-120) is required`
      });
    }
    if (!passenger.gender || !['male', 'female', 'other'].includes(passenger.gender)) {
      return res.status(400).json({
        success: false,
        error: `Passenger ${i + 1}: Valid gender is required`
      });
    }
  }

  next();
};

module.exports = { validateBooking };