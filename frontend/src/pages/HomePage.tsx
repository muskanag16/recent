import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    departureCity: '',
    arrivalCity: '',
    date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchParams.departureCity && searchParams.arrivalCity && searchParams.date) {
      navigate('/buses', { state: searchParams });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Bus Ticket Booking</h1>
        <p>Book your bus tickets online with ease</p>
      </div>
      
      <div className="search-form-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="form-group">
            <label>Departure City</label>
            <input
              type="text"
              name="departureCity"
              placeholder="Enter departure city"
              value={searchParams.departureCity}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Arrival City</label>
            <input
              type="text"
              name="arrivalCity"
              placeholder="Enter arrival city"
              value={searchParams.arrivalCity}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Date of Travel</label>
            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <button type="submit" className="search-button">
            Search Buses
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;