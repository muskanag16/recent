
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchBuses } from '../services/api';
import type { Bus, SearchParams } from '../types';
import toast from 'react-hot-toast';
import './BusListPage.css';

const BusListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    seatType: '',
    isAC: '',
    departureSlot: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalBuses: 0,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const searchParams = location.state as SearchParams;

  useEffect(() => {
    if (!searchParams) {
      navigate('/');
      return;
    }
    fetchBuses();
  }, [searchParams, filters, pagination.page]);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const params = {
        ...searchParams,
        ...filters,
        isAC: filters.isAC === 'true' ? true : filters.isAC === 'false' ? false : undefined,
        page: pagination.page,
        pageSize: 10,
      };
      const data = await searchBuses(params);
      setBuses(data.buses);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        totalBuses: data.totalBuses,
      });
    } catch (error) {
      toast.error('Failed to fetch buses');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleBookNow = (busId: string) => {
    navigate(`/seats/${busId}`, { state: { busId, searchParams } });
  };

  const getDepartureTime = (bus: Bus) => {
    const departureStop = bus.stops.find(stop => stop.stopName === searchParams.departureCity);
    return departureStop?.departureTime || 'N/A';
  };

  const getArrivalTime = (bus: Bus) => {
    const arrivalStop = bus.stops.find(stop => stop.stopName === searchParams.arrivalCity);
    return arrivalStop?.arrivalTime || 'N/A';
  };

  const clearFilters = () => {
    setFilters({
      seatType: '',
      isAC: '',
      departureSlot: '',
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="bus-list-container">
      {/* Mobile Filter Toggle Button */}
      <button 
        className="mobile-filter-toggle"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M6 12h12M8 18h8"/>
        </svg>
        Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      {/* Overlay for mobile */}
      {isFilterOpen && <div className="filter-overlay" onClick={() => setIsFilterOpen(false)}></div>}

      {/* Stylish Filters Sidebar */}
      <div className={`filters-sidebar ${isFilterOpen ? 'open' : ''}`}>
        <div className="filters-header">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M6 12h12M8 18h8"/>
            </svg>
            Filter Buses
          </h3>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="clear-filters">
              Clear all
            </button>
          )}
        </div>

        {/* Seat Type Filter with Icons */}
        <div className="filter-group">
          <label className="filter-label">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="6" width="16" height="12" rx="2"/>
              <path d="M8 12h8"/>
            </svg>
            Seat Type
          </label>
          <div className="filter-options">
            {['normal', 'semi-sleeper', 'sleeper'].map((type) => (
              <button
                key={type}
                className={`filter-chip ${filters.seatType === type ? 'active' : ''}`}
                onClick={() => handleFilterChange('seatType', filters.seatType === type ? '' : type)}
              >
                {type === 'normal' && '💺 Normal'}
                {type === 'semi-sleeper' && '🛋️ Semi-Sleeper'}
                {type === 'sleeper' && '🛌 Sleeper'}
              </button>
            ))}
          </div>
        </div>

        {/* AC/NON-AC Filter with Toggle */}
        <div className="filter-group">
          <label className="filter-label">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            AC / NON-AC
          </label>
          <div className="ac-toggle-group">
            <button
              className={`ac-toggle ${filters.isAC === 'true' ? 'active' : ''}`}
              onClick={() => handleFilterChange('isAC', filters.isAC === 'true' ? '' : 'true')}
            >
              <span>❄️ AC</span>
            </button>
            <button
              className={`ac-toggle ${filters.isAC === 'false' ? 'active' : ''}`}
              onClick={() => handleFilterChange('isAC', filters.isAC === 'false' ? '' : 'false')}
            >
              <span>🔥 NON-AC</span>
            </button>
          </div>
        </div>

        {/* Departure Slots with Time Indicators */}
        <div className="filter-group">
          <label className="filter-label">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Departure Time
          </label>
          <div className="time-slots">
            <button
              className={`time-slot ${filters.departureSlot === 'morning' ? 'active' : ''}`}
              onClick={() => handleFilterChange('departureSlot', filters.departureSlot === 'morning' ? '' : 'morning')}
            >
              <span className="time-icon">🌅</span>
              <div className="time-details">
                <span className="time-name">Morning</span>
                <span className="time-range">6 AM - 12 PM</span>
              </div>
            </button>
            <button
              className={`time-slot ${filters.departureSlot === 'afternoon' ? 'active' : ''}`}
              onClick={() => handleFilterChange('departureSlot', filters.departureSlot === 'afternoon' ? '' : 'afternoon')}
            >
              <span className="time-icon">☀️</span>
              <div className="time-details">
                <span className="time-name">Afternoon</span>
                <span className="time-range">12 PM - 4 PM</span>
              </div>
            </button>
            <button
              className={`time-slot ${filters.departureSlot === 'evening' ? 'active' : ''}`}
              onClick={() => handleFilterChange('departureSlot', filters.departureSlot === 'evening' ? '' : 'evening')}
            >
              <span className="time-icon">🌆</span>
              <div className="time-details">
                <span className="time-name">Evening</span>
                <span className="time-range">4 PM - 8 PM</span>
              </div>
            </button>
            <button
              className={`time-slot ${filters.departureSlot === 'night' ? 'active' : ''}`}
              onClick={() => handleFilterChange('departureSlot', filters.departureSlot === 'night' ? '' : 'night')}
            >
              <span className="time-icon">🌙</span>
              <div className="time-details">
                <span className="time-name">Night</span>
                <span className="time-range">8 PM - 6 AM</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search Summary */}
        <div className="search-summary">
          <div className="route-summary">
            <span className="route-icon">🚌</span>
            <div className="route-text">
              <span>{searchParams?.departureCity}</span>
              <span className="route-arrow">→</span>
              <span>{searchParams?.arrivalCity}</span>
            </div>
          </div>
          <div className="date-summary">
            <span>📅</span>
            <span>{searchParams?.date}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="buses-content">
        {/* Results Header with Stats */}
        <div className="results-header">
          <div>
            <h2>
              Available Buses
              {!loading && <span className="result-count">{pagination.totalBuses} buses found</span>}
            </h2>
            <p className="route-breadcrumb">
              {searchParams?.departureCity} <span>→</span> {searchParams?.arrivalCity}
            </p>
          </div>
          {activeFilterCount > 0 && (
            <div className="active-filters">
              {filters.seatType && <span className="active-filter-badge">💺 {filters.seatType}</span>}
              {filters.isAC && <span className="active-filter-badge">{filters.isAC === 'true' ? '❄️ AC' : '🔥 NON-AC'}</span>}
              {filters.departureSlot && <span className="active-filter-badge">⏰ {filters.departureSlot}</span>}
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Finding best buses for you...</p>
          </div>
        ) : (
          <>
            {/* Buses Grid */}
            <div className="buses-grid">
              {buses.map((bus, index) => (
                <div key={bus._id} className="bus-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bus-card-header">
                    <div className="bus-name-section">
                      <div className="bus-icon">🚌</div>
                      <div>
                        <h3>{bus.name}</h3>
                        <div className="bus-badges">
                          <span className={`badge ${bus.isAC ? 'ac-badge' : 'nonac-badge'}`}>
                            {bus.isAC ? 'AC' : 'NON-AC'}
                          </span>
                          {bus.seatTypes.map((type, idx) => (
                            <span key={idx} className="badge type-badge">{type}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="price-tag">
                      <span className="currency">₹</span>
                      <span className="amount">{bus.price}</span>
                      <span className="per-person">/person</span>
                    </div>
                  </div>

                  <div className="bus-card-body">
                    <div className="time-schedule">
                      <div className="time-point">
                        <div className="time-circle departure"></div>
                        <div className="time-details">
                          <span className="time">{getDepartureTime(bus)}</span>
                          <span className="location">{searchParams?.departureCity}</span>
                        </div>
                      </div>
                      <div className="time-line">
                        <div className="line"></div>
                        <div className="duration">Journey</div>
                      </div>
                      <div className="time-point">
                        <div className="time-circle arrival"></div>
                        <div className="time-details">
                          <span className="time">{getArrivalTime(bus)}</span>
                          <span className="location">{searchParams?.arrivalCity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bus-stats">
                      <div className="stat">
                        <span className="stat-icon">💺</span>
                        <div>
                          <span className="stat-value">{bus.availableSeats}</span>
                          <span className="stat-label">Seats available</span>
                        </div>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat">
                        <span className="stat-icon">⭐</span>
                        <div>
                          <span className="stat-value">4.2</span>
                          <span className="stat-label">Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bus-card-footer">
                  <div className="bus-card-footer">
  <button onClick={() => handleBookNow(bus._id)} className="book-now-btn">
    Book Now →
  </button>
</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modern Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination-modern">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="page-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                  Previous
                </button>
                
                <div className="page-numbers">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    let pageNum = i + 1;
                    if (pagination.page > 3 && pagination.totalPages > 5) {
                      pageNum = pagination.page - 2 + i;
                    }
                    if (pageNum <= pagination.totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination({ ...pagination, page: pageNum })}
                          className={`page-number ${pagination.page === pageNum ? 'active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="page-btn"
                >
                  Next
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BusListPage;