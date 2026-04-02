// require("dotenv").config();
// const mongoose = require('mongoose');
// const Bus = require('./models/Bus');



// // Function to generate seats
// function generateSeats(count, seatType) {
//   const seats = [];
//   const seatsPerRow = 4;
//   const rows = Math.ceil(count / seatsPerRow);

//   for (let i = 1; i <= count; i++) {
//     const row = Math.ceil(i / seatsPerRow);
//     const column = ((i - 1) % seatsPerRow) + 1;
//     seats.push({
//       seatNumber: i,
//       isAvailable: Math.random() > 0.2, // 80% available
//       row,
//       column,
//       seatType,
//     });
//   }
//   return seats;
// }

// function generateSleeperSeats(count) {
//   const seats = [];
//   for (let i = 1; i <= count; i++) {
//     seats.push({
//       seatNumber: i,
//       isAvailable: Math.random() > 0.2,
//       row: Math.ceil(i / 2),
//       column: i % 2 === 0 ? 2 : 1,
//       seatType: "sleeper",
//       sleeperLevel: i % 2 === 0 ? "lower" : "upper",
//     });
//   }
//   return seats;
// }

// async function seedData() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('Connected to MongoDB');
    
//     // Clear existing data
//     await Bus.deleteMany({});
//     console.log('Cleared existing buses');

//     const buses = [
//       {
//         name: "KSRTC Airavat",
//         stops: [
//           { stopName: "Bangalore", departureTime: "09:00 AM" },
//           { stopName: "Hosur", arrivalTime: "10:00 AM", departureTime: "10:15 AM" },
//           { stopName: "Vellore", arrivalTime: "01:00 PM", departureTime: "01:15 PM" },
//           { stopName: "Chennai", arrivalTime: "03:00 PM" }
//         ],
//         availableSeats: 32,
//         price: 1000,
//         seatTypes: ["normal", "semi-sleeper"],
//         isAC: true,
//         seats: generateSeats(40, "normal")
//       },
//       {
//         name: "SRS Travels",
//         stops: [
//           { stopName: "Bangalore", departureTime: "12:00 PM" },
//           { stopName: "Krishnagiri", arrivalTime: "01:30 PM", departureTime: "01:45 PM" },
//           { stopName: "Vellore", arrivalTime: "04:00 PM", departureTime: "04:15 PM" },
//           { stopName: "Chennai", arrivalTime: "06:00 PM" }
//         ],
//         availableSeats: 24,
//         price: 600,
//         seatTypes: ["normal"],
//         isAC: false,
//         seats: generateSeats(30, "normal")
//       },
//       {
//         name: "Volvo Multi-Axle",
//         stops: [
//           { stopName: "Bangalore", departureTime: "10:00 PM" },
//           { stopName: "Vellore", arrivalTime: "01:00 AM", departureTime: "01:15 AM" },
//           { stopName: "Chennai", arrivalTime: "05:00 AM" }
//         ],
//         availableSeats: 16,
//         price: 1500,
//         seatTypes: ["sleeper"],
//         isAC: true,
//         seats: generateSleeperSeats(20)
//       },
//       {
//         name: "Orange Travels",
//         stops: [
//           { stopName: "Bangalore", departureTime: "08:00 AM" },
//           { stopName: "Krishnagiri", arrivalTime: "10:30 AM", departureTime: "10:45 AM" },
//           { stopName: "Chennai", arrivalTime: "02:00 PM" }
//         ],
//         availableSeats: 35,
//         price: 800,
//         seatTypes: ["semi-sleeper"],
//         isAC: true,
//         seats: generateSeats(40, "semi-sleeper")
//       },
//       {
//         name: "Sharma Travels",
//         stops: [
//           { stopName: "Bangalore", departureTime: "11:00 PM" },
//           { stopName: "Vellore", arrivalTime: "02:30 AM", departureTime: "02:45 AM" },
//           { stopName: "Chennai", arrivalTime: "06:00 AM" }
//         ],
//         availableSeats: 28,
//         price: 1200,
//         seatTypes: ["sleeper"],
//         isAC: true,
//         seats: generateSleeperSeats(36)
//       },
//       {
//         name: "VRL Travels",
//         stops: [
//           { stopName: "Bangalore", departureTime: "07:00 PM" },
//           { stopName: "Hosur", arrivalTime: "08:30 PM", departureTime: "08:45 PM" },
//           { stopName: "Vellore", arrivalTime: "10:30 PM", departureTime: "10:45 PM" },
//           { stopName: "Chennai", arrivalTime: "01:00 AM" }
//         ],
//         availableSeats: 20,
//         price: 900,
//         seatTypes: ["semi-sleeper"],
//         isAC: false,
//         seats: generateSeats(35, "semi-sleeper")
//       },
//       {
//         name: "Kallada Travels",
//         stops: [
//           { stopName: "Bangalore", departureTime: "09:30 PM" },
//           { stopName: "Krishnagiri", arrivalTime: "12:00 AM", departureTime: "12:15 AM" },
//           { stopName: "Chennai", arrivalTime: "04:30 AM" }
//         ],
//         availableSeats: 30,
//         price: 1100,
//         seatTypes: ["sleeper"],
//         isAC: true,
//         seats: generateSleeperSeats(32)
//       },
//       {
//         name: "National Travels",
//         stops: [
//           { stopName: "Bangalore", departureTime: "02:00 PM" },
//           { stopName: "Hosur", arrivalTime: "03:30 PM", departureTime: "03:45 PM" },
//           { stopName: "Vellore", arrivalTime: "05:30 PM", departureTime: "05:45 PM" },
//           { stopName: "Chennai", arrivalTime: "08:00 PM" }
//         ],
//         availableSeats: 38,
//         price: 700,
//         seatTypes: ["normal"],
//         isAC: false,
//         seats: generateSeats(42, "normal")
//       }
//     ];

//     await Bus.insertMany(buses);
//     console.log(`✅ Seeded ${buses.length} buses successfully`);
    
//     // Display summary
//     const count = await Bus.countDocuments();
//     console.log(`\n📊 Database Summary:`);
//     console.log(`Total buses in database: ${count}`);
    
//     process.exit(0);
//   } catch (error) {
//     console.error('Error seeding data:', error);
//     process.exit(1);
//   }
// }

// seedData();
require("dotenv").config();
const mongoose = require('mongoose');
const Bus = require('./models/Bus');

// Function to generate seats
function generateSeats(count, seatType) {
  const seats = [];
  const seatsPerRow = 4;
  const rows = Math.ceil(count / seatsPerRow);

  for (let i = 1; i <= count; i++) {
    const row = Math.ceil(i / seatsPerRow);
    const column = ((i - 1) % seatsPerRow) + 1;
    seats.push({
      seatNumber: i,
      isAvailable: Math.random() > 0.2, // 80% available
      row,
      column,
      seatType,
    });
  }
  return seats;
}

function generateSleeperSeats(count) {
  const seats = [];
  for (let i = 1; i <= count; i++) {
    seats.push({
      seatNumber: i,
      isAvailable: Math.random() > 0.2,
      row: Math.ceil(i / 2),
      column: i % 2 === 0 ? 2 : 1,
      seatType: "sleeper",
      sleeperLevel: i % 2 === 0 ? "lower" : "upper",
    });
  }
  return seats;
}

// Validate MongoDB URI
if (!process.env.MONGO_URI) {
  console.error('❌ Error: MONGO_URI is not defined in .env file');
  console.log('Please add: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname');
  process.exit(1);
}

async function seedData() {
  let connection = null;
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log(`📡 Using database: ${process.env.MONGO_URI.split('/').pop() || 'MongoDB Atlas'}`);
    
    // Connect with options for better stability
    connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database Name: ${mongoose.connection.db.databaseName}`);
    
    // Check if data already exists
    const existingBuses = await Bus.countDocuments();
    if (existingBuses > 0) {
      console.log(`⚠️  Found ${existingBuses} existing buses in database`);
      console.log('🔄 Clearing existing data...');
      await Bus.deleteMany({});
      console.log('✅ Cleared existing buses');
    }
    
    console.log('🌱 Generating bus data...');
    
    const buses = [
      {
        name: "KSRTC Airavat",
        stops: [
          { stopName: "Bangalore", departureTime: "09:00 AM" },
          { stopName: "Hosur", arrivalTime: "10:00 AM", departureTime: "10:15 AM" },
          { stopName: "Vellore", arrivalTime: "01:00 PM", departureTime: "01:15 PM" },
          { stopName: "Chennai", arrivalTime: "03:00 PM" }
        ],
        availableSeats: 32,
        price: 1000,
        seatTypes: ["normal", "semi-sleeper"],
        isAC: true,
        seats: generateSeats(40, "normal")
      },
      {
        name: "SRS Travels",
        stops: [
          { stopName: "Bangalore", departureTime: "12:00 PM" },
          { stopName: "Krishnagiri", arrivalTime: "01:30 PM", departureTime: "01:45 PM" },
          { stopName: "Vellore", arrivalTime: "04:00 PM", departureTime: "04:15 PM" },
          { stopName: "Chennai", arrivalTime: "06:00 PM" }
        ],
        availableSeats: 24,
        price: 600,
        seatTypes: ["normal"],
        isAC: false,
        seats: generateSeats(30, "normal")
      },
      {
        name: "Volvo Multi-Axle",
        stops: [
          { stopName: "Bangalore", departureTime: "10:00 PM" },
          { stopName: "Vellore", arrivalTime: "01:00 AM", departureTime: "01:15 AM" },
          { stopName: "Chennai", arrivalTime: "05:00 AM" }
        ],
        availableSeats: 16,
        price: 1500,
        seatTypes: ["sleeper"],
        isAC: true,
        seats: generateSleeperSeats(20)
      },
      {
        name: "Orange Travels",
        stops: [
          { stopName: "Bangalore", departureTime: "08:00 AM" },
          { stopName: "Krishnagiri", arrivalTime: "10:30 AM", departureTime: "10:45 AM" },
          { stopName: "Chennai", arrivalTime: "02:00 PM" }
        ],
        availableSeats: 35,
        price: 800,
        seatTypes: ["semi-sleeper"],
        isAC: true,
        seats: generateSeats(40, "semi-sleeper")
      },
      {
        name: "Sharma Travels",
        stops: [
          { stopName: "Bangalore", departureTime: "11:00 PM" },
          { stopName: "Vellore", arrivalTime: "02:30 AM", departureTime: "02:45 AM" },
          { stopName: "Chennai", arrivalTime: "06:00 AM" }
        ],
        availableSeats: 28,
        price: 1200,
        seatTypes: ["sleeper"],
        isAC: true,
        seats: generateSleeperSeats(36)
      },
      {
        name: "VRL Travels",
        stops: [
          { stopName: "Bangalore", departureTime: "07:00 PM" },
          { stopName: "Hosur", arrivalTime: "08:30 PM", departureTime: "08:45 PM" },
          { stopName: "Vellore", arrivalTime: "10:30 PM", departureTime: "10:45 PM" },
          { stopName: "Chennai", arrivalTime: "01:00 AM" }
        ],
        availableSeats: 20,
        price: 900,
        seatTypes: ["semi-sleeper"],
        isAC: false,
        seats: generateSeats(35, "semi-sleeper")
      },
      {
        name: "Kallada Travels",
        stops: [
          { stopName: "Bangalore", departureTime: "09:30 PM" },
          { stopName: "Krishnagiri", arrivalTime: "12:00 AM", departureTime: "12:15 AM" },
          { stopName: "Chennai", arrivalTime: "04:30 AM" }
        ],
        availableSeats: 30,
        price: 1100,
        seatTypes: ["sleeper"],
        isAC: true,
        seats: generateSleeperSeats(32)
      },
      {
        name: "National Travels",
        stops: [
          { stopName: "Bangalore", departureTime: "02:00 PM" },
          { stopName: "Hosur", arrivalTime: "03:30 PM", departureTime: "03:45 PM" },
          { stopName: "Vellore", arrivalTime: "05:30 PM", departureTime: "05:45 PM" },
          { stopName: "Chennai", arrivalTime: "08:00 PM" }
        ],
        availableSeats: 38,
        price: 700,
        seatTypes: ["normal"],
        isAC: false,
        seats: generateSeats(42, "normal")
      }
    ];

    console.log('💾 Inserting buses into database...');
    const result = await Bus.insertMany(buses);
    
    console.log(`\n✅ Successfully seeded ${result.length} buses!\n`);
    
    // Display detailed summary
    console.log('📊 Database Summary:');
    console.log('═'.repeat(50));
    console.log(`📌 Total Buses: ${result.length}`);
    console.log(`🎫 Total Seats: ${result.reduce((sum, bus) => sum + bus.seats.length, 0)}`);
    console.log(`💰 Price Range: ₹${Math.min(...result.map(b => b.price))} - ₹${Math.max(...result.map(b => b.price))}`);
    console.log(`❄️ AC Buses: ${result.filter(b => b.isAC).length}`);
    console.log(`🔥 Non-AC Buses: ${result.filter(b => !b.isAC).length}`);
    
    console.log('\n🚍 Bus Details:');
    console.log('═'.repeat(50));
    result.forEach((bus, index) => {
      console.log(`${index + 1}. ${bus.name}`);
      console.log(`   💰 Price: ₹${bus.price} | ❄️ ${bus.isAC ? 'AC' : 'Non-AC'}`);
      console.log(`   💺 Seat Types: ${bus.seatTypes.join(', ')}`);
      console.log(`   🎫 Available Seats: ${bus.availableSeats}`);
      console.log(`   📍 Route: ${bus.stops[0].stopName} → ${bus.stops[bus.stops.length - 1].stopName}`);
      console.log(`   ⏰ Departure: ${bus.stops[0].departureTime}`);
      console.log('─'.repeat(30));
    });
    
    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n🔧 Next Steps:');
    console.log('1. Start your server: npm run dev');
    console.log('2. Test API: http://localhost:5000/api/buses');
    console.log('3. Search for buses from Bangalore to Chennai');
    
  } catch (error) {
    console.error('\n❌ Error seeding data:');
    console.error('═'.repeat(50));
    
    if (error.name === 'MongoServerError' && error.code === 8000) {
      console.error('⚠️  Authentication failed! Please check your MongoDB username and password.');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('⚠️  Cannot connect to MongoDB. Please check:');
      console.error('   - Your internet connection');
      console.error('   - MongoDB Atlas IP whitelist (add 0.0.0.0/0)');
      console.error('   - MongoDB connection string is correct');
    } else if (error.name === 'ValidationError') {
      console.error('⚠️  Data validation error:');
      console.error(error.message);
    } else {
      console.error(error);
    }
    
    console.error('\n💡 Troubleshooting Tips:');
    console.error('1. Make sure MongoDB Atlas is running');
    console.error('2. Check your .env file has correct MONGO_URI');
    console.error('3. Verify network access in MongoDB Atlas (IP whitelist)');
    console.error('4. Check username and password are correct');
    
    process.exit(1);
  } finally {
    // Close MongoDB connection
    if (connection) {
      await mongoose.connection.close();
      console.log('\n🔌 MongoDB connection closed.');
    }
  }
}

// Run seed function
seedData();