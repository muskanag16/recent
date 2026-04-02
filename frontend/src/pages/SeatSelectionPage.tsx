
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBusDetails, createBooking } from '../services/api';
import type { Bus, Passenger } from '../types';
import toast from 'react-hot-toast';
import './SeatSelectionPage.css';

const SeatSelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { busId } = location.state || {};
  const [bus, setBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [timer, setTimer] = useState<number>(120);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null);

  useEffect(() => {
    if (!busId) {
      navigate('/');
      return;
    }
    fetchBusDetails();
  }, [busId]);

  useEffect(() => {
    if (selectedSeats.length > 0) {
      const initialPassengers = selectedSeats.map(() => ({
        name: '',
        age: 0,
        gender: 'male' as const,
      }));
      setPassengers(initialPassengers);
    } else {
      setPassengers([]);
    }
  }, [selectedSeats]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (booking && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            toast.error('Time expired! Please book again.');
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [booking, timer, navigate]);

  const fetchBusDetails = async () => {
    try {
      setLoading(true);
      const data = await getBusDetails(busId);
      setBus(data);
    } catch (error) {
      toast.error('Failed to fetch bus details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber: number, isAvailable: boolean) => {
    if (!isAvailable) {
      toast.error('Seat is not available');
      return;
    }

    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        if (prev.length >= 6) {
          toast.error('Maximum 6 seats can be booked at once');
          return prev;
        }
        return [...prev, seatNumber];
      }
    });
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    const invalidPassengers = passengers.some(
      (p) => !p.name || p.age < 1 || p.age > 120 || !p.gender
    );
    if (invalidPassengers) {
      toast.error('Please fill all passenger details correctly');
      return;
    }

    try {
      const bookingData = {
        busId,
        seats: selectedSeats,
        passengerDetails: passengers,
      };
      const response = await createBooking(bookingData);
      setBooking(response);
      toast.success('Booking initiated! Complete within 2 minutes.');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Booking failed');
    }
  };

  const handleProceedToPayment = () => {
    if (booking) {
      navigate(`/confirmation/${booking.id}`, {
        state: { booking, bus, selectedSeats, passengers },
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">
          <div className="bus-loader"></div>
          <p>Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!bus) return null;

  const totalPrice = selectedSeats.length * bus.price;

  return (
    <div className="seat-selection-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="selection-container">
        {/* Header */}
        <div className="selection-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <div className="journey-info">
            <span className="journey-icon">🚌</span>
            <span className="journey-text">Select Your Comfort</span>
          </div>
        </div>

        <div className="selection-content">
          {/* Seat Layout Section */}
          <div className="seat-section">
            <div className="seat-section-header">
              <h2>Choose Your Seats</h2>
              <div className="bus-name-card">
                <span className="bus-name-icon">🚍</span>
                <div>
                  <p className="bus-name">{bus.name}</p>
                  <div className="bus-tags">
                    <span className="tag">{bus.isAC ? '❄️ AC' : '🔥 Non-AC'}</span>
                    <span className="tag">💺 {bus.seatTypes.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bus Layout */}
            <div className="bus-layout">
              <div className="driver-section">
                <div className="driver-seat">👨‍✈️ Driver</div>
                <div className="bus-front">FRONT</div>
              </div>
              
              <div className="seats-container">
                <div className="seats-grid">
                  {bus.seats.map((seat) => (
                    <button
                      key={seat.seatNumber}
                      className={`modern-seat ${!seat.isAvailable ? 'unavailable' : ''} ${
                        selectedSeats.includes(seat.seatNumber) ? 'selected' : ''
                      } ${seat.seatType === 'sleeper' ? 'sleeper' : ''}`}
                      onClick={() => handleSeatClick(seat.seatNumber, seat.isAvailable)}
                      onMouseEnter={() => setHoveredSeat(seat.seatNumber)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      disabled={!seat.isAvailable}
                    >
                      <div className="seat-content">
                        <span className="seat-number">{seat.seatNumber}</span>
                        {seat.seatType === 'sleeper' && seat.sleeperLevel && (
                          <span className="seat-level">{seat.sleeperLevel === 'upper' ? '☁️' : '🛏️'}</span>
                        )}
                        {selectedSeats.includes(seat.seatNumber) && (
                          <span className="check-mark">✓</span>
                        )}
                      </div>
                      {hoveredSeat === seat.seatNumber && seat.isAvailable && !selectedSeats.includes(seat.seatNumber) && (
                        <div className="seat-tooltip">
                          ₹{bus.price}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seat Legend */}
              <div className="seat-legend-modern">
                <div className="legend-item">
                  <div className="legend-dot available-dot"></div>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot selected-dot"></div>
                  <span>Selected</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot unavailable-dot"></div>
                  <span>Booked</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot sleeper-dot"></div>
                  <span>Sleeper</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Section */}
          <div className="summary-section">
            <div className="summary-card">
              <div className="summary-header">
                <h3>Booking Summary</h3>
                <div className="summary-icon">📋</div>
              </div>

              <div className="summary-stats">
                <div className="stat-card">
                  <span className="stat-icon">🎫</span>
                  <div>
                    <p className="stat-label">Selected Seats</p>
                    <p className="stat-value">{selectedSeats.length || 0}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">💰</span>
                  <div>
                    <p className="stat-label">Total Amount</p>
                    <p className="stat-value price">₹{totalPrice}</p>
                  </div>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="selected-seats-list">
                  <p className="list-title">Seat Numbers:</p>
                  <div className="seat-badges">
                    {selectedSeats.map(seat => (
                      <span key={seat} className="seat-badge">Seat {seat}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSeats.length > 0 && (
                <div className="passenger-section">
                  <h4>Passenger Details</h4>
                  {passengers.map((passenger, index) => (
                    <div key={index} className="passenger-card-modern">
                      <div className="passenger-header">
                        <span className="passenger-number">Passenger {index + 1}</span>
                        <span className="seat-number-badge">Seat {selectedSeats[index]}</span>
                      </div>
                      <div className="passenger-form-modern">
                        <div className="form-group-modern">
                          <input
                            type="text"
                            value={passenger.name}
                            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                            placeholder="Full Name"
                            required
                          />
                          <span className="input-icon">👤</span>
                        </div>
                        <div className="form-row">
                          <div className="form-group-modern">
                            <input
                              type="number"
                              value={passenger.age || ''}
                              onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value))}
                              placeholder="Age"
                              min="1"
                              max="120"
                              required
                            />
                            <span className="input-icon">🎂</span>
                          </div>
                          <div className="form-group-modern">
                            <select
                              value={passenger.gender}
                              onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            >
                              <option value="male">👨 Male</option>
                              <option value="female">👩 Female</option>
                              <option value="other">👤 Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!booking ? (
                <button 
                  onClick={handleConfirmBooking} 
                  className="confirm-btn-modern"
                  disabled={selectedSeats.length === 0}
                >
                  <span>Confirm & Lock Seats</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              ) : (
                <div className="timer-section-modern">
                  <div className="timer-card">
                    <div className="timer-icon">⏱️</div>
                    <div className="timer-content">
                      <p>Complete payment within</p>
                      <div className="timer-display">
                        <span>{Math.floor(timer / 60)}</span>:<span>{(timer % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleProceedToPayment} className="payment-btn-modern">
                    <span>Proceed to Payment</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 10h18M6 4h12M6 20h12M3 14h18"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;