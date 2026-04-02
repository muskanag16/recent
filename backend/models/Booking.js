const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
});

const BookingSchema = new mongoose.Schema({
  busId: { type: String, required: true },
  seats: [{ type: Number, required: true }],
  passengerDetails: [PassengerSchema],
  totalPrice: { type: Number, required: true },
  bookingTime: { type: Date, default: Date.now },
  expiryTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'expired'], 
    default: 'pending' 
  },
});

module.exports = mongoose.model('Booking', BookingSchema);