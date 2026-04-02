// import axios from 'axios';

// import type { SearchParams ,BookingRequest} from "../types";

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const searchBuses = async (params: SearchParams) => {
//   const response = await api.get('/buses', { params });
//   return response.data;
// };

// export const getBusDetails = async (busId: string) => {
//   const response = await api.get(`/buses/${busId}`);
//   return response.data;
// };

// export const createBooking = async (bookingData: BookingRequest) => {
//   const response = await api.post('/bookings', bookingData);
//   return response.data;
// };

// export const confirmBooking = async (bookingId: string) => {
//   const response = await api.put(`/bookings/${bookingId}/confirm`);
//   return response.data;
// };
// frontend/src/services/api.ts
import axios from 'axios';
import type{ SearchParams, BookingRequest } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchBuses = async (params: SearchParams) => {
  const response = await api.get('/buses', { params });
  return response.data;
};

export const getBusDetails = async (busId: string) => {
  const response = await api.get(`/buses/${busId}`);
  return response.data.bus || response.data; // Handle both response formats
};

export const createBooking = async (bookingData: BookingRequest) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const confirmBooking = async (bookingId: string) => {
  const response = await api.put(`/bookings/${bookingId}/confirm`);
  return response.data;
};