# 🚌 Bus Booking System - Full Stack Application

A modern, feature-rich bus ticket booking system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application allows users to search for buses, view seat layouts, select seats, and book tickets with a real-time 2-minute seat locking system.

## ✨ Features

### Core Features
- 🔍 **Advanced Bus Search** - Search by departure city, arrival city, and date <img width="1918" height="965" alt="image" src="https://github.com/user-attachments/assets/0bdc8844-f91f-4296-9414-93477ae7f142" />

- 🎯 **Smart Filters** - Filter by seat type (Normal/Semi-Sleeper/Sleeper), AC/Non-AC, and departure time slots <img width="1916" height="980" alt="Screenshot 2026-04-02 213513" src="https://github.com/user-attachments/assets/8028d3a1-ea29-45e6-8879-de75509457c5" />
- 💺 **Interactive Seat Selection** - Visual seat layout with real-time availability
- ⏱️ **2-Minute Seat Locking** - Selected seats are locked for 2 minutes during booking
- 📝 **Passenger Management** - Add passenger details for each booked seat<img width="1917" height="904" alt="Screenshot 2026-04-02 213531" src="https://github.com/user-attachments/assets/6dae008b-c809-4f69-8079-9664628bd193" />

- 💳 **Booking Confirmation** - Complete booking with payment simulation<img width="1899" height="964" alt="Screenshot 2026-04-02 213619" src="https://github.com/user-attachments/assets/45c70a2b-f9ee-4841-ab3e-9166d250185b" />

- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Bonus Features
- ⏰ Real-time countdown timer for booking completion
- 🎨 Modern glassmorphism UI design with animations
- 🔄 Automatic seat release after timer expiry
- ✅ Form validation and error handling
- 📊 Pagination for bus listings
- 🎯 Interactive seat map with tooltips

## 🛠️ Technology Stack

### Frontend
- **React.js** (v18.2.0) - UI Framework
- **TypeScript** - Type safety and better development experience
- **React Router DOM** (v6.20.0) - Navigation and routing
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Beautiful toast notifications
- **CSS3** - Custom styling with animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Deployment
- **Frontend**: Vercel
- **Database**: MongoDB Atlas

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB Atlas account (or local MongoDB)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bus-booking-system.git
cd bus-booking-system
