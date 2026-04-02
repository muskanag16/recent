const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
  stopName: { type: String, required: true },
  arrivalTime: String,
  departureTime: String,
});

const SeatSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  row: { type: Number, required: true },
  column: { type: Number, required: true },
  seatType: { 
    type: String, 
    enum: ['normal', 'semi-sleeper', 'sleeper'], 
    required: true 
  },
  sleeperLevel: { type: String, enum: ['upper', 'lower'] },
});

const BusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stops: [StopSchema],
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  seatTypes: [{ type: String }],
  isAC: { type: Boolean, required: true },
  seats: [SeatSchema],
});

module.exports = mongoose.model('Bus', BusSchema);