
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './BookingConfirmationPage.css';

const BookingConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, bus, selectedSeats, passengers } = location.state || {};
  const [isConfirming, setIsConfirming] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!booking || !bus) {
      navigate('/');
      return;
    }

    // Update timer every second
    const timer = setInterval(() => {
      const expiry = new Date(booking.expiryTime).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        clearInterval(timer);
        toast.error('Time expired! Please book again.');
        setTimeout(() => navigate('/'), 2000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [booking, bus, navigate]);

  const handleConfirmPayment = async () => {
    setIsConfirming(true);
    try {
      toast.success('Booking confirmed successfully!');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Confirmation failed');
    } finally {
      setIsConfirming(false);
    }
  };

  if (!booking || !bus) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (timeLeft / 120) * 100;

  return (
    <div className="confirmation-page">
      {/* Animated Background */}
      <div className="confetti-bg">
        <div className="confetti confetti-1"></div>
        <div className="confetti confetti-2"></div>
        <div className="confetti confetti-3"></div>
        <div className="confetti confetti-4"></div>
        <div className="confetti confetti-5"></div>
      </div>

      <div className="floating-shapes">
        <div className="shape shape-1">🎫</div>
        <div className="shape shape-2">🚌</div>
        <div className="shape shape-3">💺</div>
        <div className="shape shape-4">✨</div>
        <div className="shape shape-5">⭐</div>
      </div>

      <div className="confirmation-wrapper">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="success-circle">
            <svg className="success-icon" viewBox="0 0 52 52">
              <circle className="success-circle-bg" cx="26" cy="26" r="25" fill="none" />
              <path className="success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <div className="pulse-ring"></div>
          </div>
          <h1 className="success-title">Booking Ready!</h1>
          <p className="success-subtitle">Your seats are reserved for 2 minutes</p>
        </div>

        <div className="confirmation-grid">
          {/* Main Ticket Card */}
          <div className="ticket-card">
            <div className="ticket-header">
              <div className="ticket-icon">🎟️</div>
              <div>
                <h3>E-Ticket</h3>
                <p>Journey Confirmation</p>
              </div>
              <div className="ticket-number">#{booking.id?.slice(-8) || 'TEMP001'}</div>
            </div>

            <div className="ticket-body">
              {/* Journey Route */}
              <div className="journey-route">
                <div className="route-point">
                  <div className="point-dot start"></div>
                  <div className="point-content">
                    <span className="point-city">{bus.stops[0]?.stopName || 'Departure'}</span>
                    <span className="point-time">{bus.stops[0]?.departureTime || '--:--'}</span>
                  </div>
                </div>
                <div className="route-line">
                  <div className="route-dashed"></div>
                  <div className="route-duration">Journey</div>
                </div>
                <div className="route-point">
                  <div className="point-dot end"></div>
                  <div className="point-content">
                    <span className="point-city">{bus.stops[bus.stops.length - 1]?.stopName || 'Arrival'}</span>
                    <span className="point-time">{bus.stops[bus.stops.length - 1]?.arrivalTime || '--:--'}</span>
                  </div>
                </div>
              </div>

              {/* Bus Info */}
              <div className="bus-info-card">
                <div className="info-row">
                  <span className="info-label">🚍 Bus Name</span>
                  <span className="info-value">{bus.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">❄️ AC Status</span>
                  <span className={`info-value ${bus.isAC ? 'ac' : 'non-ac'}`}>
                    {bus.isAC ? 'Air Conditioned' : 'Non-AC'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">💺 Seat Type</span>
                  <span className="info-value">{bus.seatTypes.join(', ')}</span>
                </div>
              </div>

              {/* Seats Section */}
              <div className="seats-section">
                <h4>Selected Seats</h4>
                <div className="seats-grid-mini">
                  {selectedSeats.map((seat: number, idx: number) => (
                    <div key={idx} className="seat-card-mini">
                      <span className="seat-number-mini">{seat}</span>
                      <span className="seat-status">Selected</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Passenger Details */}
              <div className="passengers-section">
                <h4>Passenger Details</h4>
                {passengers.map((passenger: any, index: number) => (
                  <div key={index} className="passenger-card-mini">
                    <div className="passenger-avatar">
                      {passenger.gender === 'male' ? '👨' : passenger.gender === 'female' ? '👩' : '👤'}
                    </div>
                    <div className="passenger-info-mini">
                      <div className="passenger-name">{passenger.name}</div>
                      <div className="passenger-meta">
                        <span>Age: {passenger.age}</span>
                        <span>Gender: {passenger.gender}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Ticket Price</span>
                  <span>₹{bus.price} x {selectedSeats.length}</span>
                </div>
                <div className="price-row">
                  <span>GST (5%)</span>
                  <span>₹{Math.floor(bus.price * selectedSeats.length * 0.05)}</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span>₹{booking.totalPrice + Math.floor(bus.price * selectedSeats.length * 0.05)}</span>
                </div>
              </div>
            </div>

            <div className="ticket-footer">
              <div className="barcode"></div>
              <p className="booking-id">Booking ID: {booking.id}</p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="payment-section">
            <div className="timer-card-modern">
              <div className="timer-header">
                <span className="timer-icon">⏰</span>
                <span>Complete Payment Within</span>
              </div>
              <div className="timer-progress">
                <svg className="progress-ring" width="120" height="120">
                  <circle
                    className="progress-ring-bg"
                    stroke="#e0e0e0"
                    strokeWidth="8"
                    fill="none"
                    r="52"
                    cx="60"
                    cy="60"
                  />
                  <circle
                    className="progress-ring-fill"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    r="52"
                    cx="60"
                    cy="60"
                    style={{
                      strokeDasharray: 326.9,
                      strokeDashoffset: 326.9 * (1 - progressPercent / 100)
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="timer-text">
                  <span className="timer-value">{formatTime(timeLeft)}</span>
                  <span className="timer-label">Remaining</span>
                </div>
              </div>
              {timeLeft < 30 && timeLeft > 0 && (
                <div className="timer-warning-animation">
                  ⚡ Hurry up! Time is running out! ⚡
                </div>
              )}
            </div>

            <div className="payment-methods">
              <h4>Select Payment Method</h4>
              <div className="payment-options">
                <button className="payment-option active">
                  <span>💳</span>
                  <span>Credit/Debit Card</span>
                </button>
                <button className="payment-option">
                  <span>📱</span>
                  <span>UPI</span>
                </button>
                <button className="payment-option">
                  <span>🏦</span>
                  <span>Net Banking</span>
                </button>
                <button className="payment-option">
                  <span>📲</span>
                  <span>Wallet</span>
                </button>
              </div>
            </div>

            <button 
              onClick={handleConfirmPayment} 
              className={`confirm-payment-modern ${isConfirming ? 'loading' : ''}`}
              disabled={isConfirming || timeLeft === 0}
            >
              {isConfirming ? (
                <>
                  <span className="spinner"></span>
                  Processing Payment...
                </>
              ) : (
                <>
                  <span>✅</span>
                  Confirm & Pay ₹{booking.totalPrice + Math.floor(bus.price * selectedSeats.length * 0.05)}
                </>
              )}
            </button>

            <div className="secure-badge">
              <span>🔒</span>
              <span>100% Secure Payment</span>
              <span>🛡️</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="footer-note">
          <div className="note-item">📧 Confirmation will be sent to your email</div>
          <div className="note-item">📱 Download ticket for offline access</div>
          <div className="note-item">⏰ Report 30 minutes before departure</div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;