
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import BusListPage from './pages/BusListPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import './App.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buses" element={<BusListPage />} />
          <Route path="/seats/:busId" element={<SeatSelectionPage />} />
          <Route path="/confirmation/:bookingId" element={<BookingConfirmationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;