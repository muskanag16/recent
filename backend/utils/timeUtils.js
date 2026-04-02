// Utility functions for time handling
const getTimeSlot = (timeString) => {
  if (!timeString) return null;
  
  // Parse time string (e.g., "09:00 AM" or "14:30")
  let hour;
  if (timeString.includes('AM') || timeString.includes('PM')) {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    hour = parseInt(hours);
    if (modifier === 'PM' && hour !== 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;
  } else {
    hour = parseInt(timeString.split(':')[0]);
  }
  
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 16) return 'afternoon';
  if (hour >= 16 && hour < 20) return 'evening';
  return 'night';
};

const formatTimeRemaining = (expiryDate) => {
  const now = new Date();
  const diff = expiryDate - now;
  
  if (diff <= 0) return 'Expired';
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

module.exports = { getTimeSlot, formatTimeRemaining };