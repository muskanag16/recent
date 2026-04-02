export interface Stop {
  stopName: string;
  arrivalTime?: string;
  departureTime?: string;
}

export interface Seat {
  seatNumber: number;
  isAvailable: boolean;
  row: number;
  column: number;
  seatType: 'normal' | 'semi-sleeper' | 'sleeper';
  sleeperLevel?: 'upper' | 'lower';
}

export interface Bus {
  _id: string;
  name: string;
  stops: Stop[];
  availableSeats: number;
  price: number;
  seatTypes: string[];
  isAC: boolean;
  seats: Seat[];
}

export interface SearchParams {
  departureCity: string;
  arrivalCity: string;
  date: string;
  seatType?: string;
  isAC?: boolean;
  departureSlot?: string;
  page?: number;
  pageSize?: number;
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface BookingRequest {
  busId: string;
  seats: number[];
  passengerDetails: Passenger[];
}