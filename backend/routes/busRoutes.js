const router = require('express').Router();
const Bus = require('../models/Bus');

// GET /api/buses - Search buses with filters
router.get('/', async (req, res) => {
  try {
    const {
      departureCity,
      arrivalCity,
      date,
      seatType,
      isAC,
      departureSlot,
      page = 1,
      pageSize = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    // Filter by departure and arrival cities
    if (departureCity && arrivalCity) {
      filter['stops'] = {
        $elemMatch: {
          stopName: departureCity,
        },
      };
    }

    // Filter by seat type
    if (seatType && seatType !== '') {
      filter.seatTypes = seatType;
    }

    // Filter by AC/Non-AC
    if (isAC !== undefined && isAC !== '') {
      filter.isAC = isAC === 'true';
    }

    // Filter by departure time slot
    if (departureSlot && departureSlot !== '') {
      // This is a simplified version - in production, you'd need more complex logic
      let timeRange;
      switch (departureSlot) {
        case 'morning':
          timeRange = { $regex: /0[6-9]|1[0-1]/ };
          break;
        case 'afternoon':
          timeRange = { $regex: /12|13|14|15/ };
          break;
        case 'evening':
          timeRange = { $regex: /16|17|18|19/ };
          break;
        case 'night':
          timeRange = { $regex: /20|21|22|23|00|01|02|03|04|05/ };
          break;
        default:
          timeRange = null;
      }
      if (timeRange) {
        filter['stops.departureTime'] = timeRange;
      }
    }

    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const skip = (pageNum - 1) * pageSizeNum;

    const totalBuses = await Bus.countDocuments(filter);
    const buses = await Bus.find(filter).skip(skip).limit(pageSizeNum);

    res.json({
      success: true,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(totalBuses / pageSizeNum),
      totalBuses,
      buses,
    });
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// GET /api/buses/:busId - Get specific bus details
router.get('/:busId', async (req, res) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ 
        success: false, 
        error: 'Bus not found' 
      });
    }

    res.json({
      success: true,
      bus,
    });
  } catch (error) {
    console.error('Error fetching bus:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;