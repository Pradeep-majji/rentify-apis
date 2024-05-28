const express = require('express');
const Property = require('../models/Property');
const Buyer = require('../models/Buyer');
const Seller = require('../models/Buyer');
const router = express.Router();

// Add Property
router.post('/add-property', async (req, res) => {
  try {
    const { name, location, area, bedrooms, bathrooms, landmarks, sellerEmail } = req.body;

    if (!name || !location || !area || !bedrooms || !bathrooms || !landmarks || !sellerEmail) {
      res.status(400);
      return res.json({ error: 'All fields are required' });
    }

    const propertyId = `${name}-${sellerEmail}`;
    const existingProperty = await Property.findOne({ id: propertyId });
    if (existingProperty) {
      res.status(400);
      return res.json({ error: 'Property already exists' });
    }

    const newProperty = new Property({ id: propertyId, name, location, area, bedrooms, bathrooms, landmarks, sellerEmail });
    await newProperty.save();

    res.status(201).json({ success: true, property: newProperty });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Update property by ID
router.put('/update-property/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if any updates are provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    // Update the property by its ID
    const property = await Property.findOneAndUpdate({ id }, updates, { new: true, runValidators: true });

    // Check if property exists and return updated property
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json({ success: true, property });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Fetch all properties of a single seller
router.get('/seller-properties/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const properties = await Property.find({ sellerEmail: email });
    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//////////////////////for buyer///////////////////////////


// Fetch all properties
router.get('/all-properties', async (req, res) => {
  try {
    const properties = await Property.find({});
    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Display details of seller of a single property
router.get('/property-seller/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findOne({ id });
    if (!property) {
      res.status(404);
      return res.json({ error: 'Property not found' });
    }

    const seller = await Seller.findOne({ email: property.sellerEmail });
    if (!seller) {
      res.status(404);
      return res.json({ error: 'Seller not found' });
    }

    res.status(200).json({ success: true, seller: { name: `${seller.firstname} ${seller.lastname}`, firstname: seller.firstname, email: seller.email, phone: seller.phone } });
  } catch (error) {
    console.error('Error fetching seller details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Filter properties based on details
router.get('/filter-properties', async (req, res) => {
    try {
      // Extract filters from query parameters
      const { name, location, bedrooms, bathrooms, landmarks } = req.query;
  
      // Construct the filter object based on provided query parameters
      const filters = {};
      if (name) filters.name = new RegExp(name, 'i'); // Case-insensitive search for name
      if (location) filters.location = new RegExp(location, 'i'); // Case-insensitive search for location
      if (bedrooms) filters.bedrooms = parseInt(bedrooms);
      if (bathrooms) filters.bathrooms = parseInt(bathrooms);
      if (landmarks) filters.landmarks = new RegExp(landmarks, 'i'); // Case-insensitive search for landmarks
  
      // Find properties matching the filters
      const properties = await Property.find(filters);
  
      // If no properties matched, return 0 results
      if (properties.length === 0) {
        return res.status(200).json({ success: true, count: 0, properties: [] });
      }
  
      // Return the matched properties
      res.status(200).json({ success: true, count: properties.length, properties });
    } catch (error) {
      console.error('Error filtering properties:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;
