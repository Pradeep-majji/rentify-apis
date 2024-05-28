const express = require('express');
const Favourite = require('../models/Favourite');
const Property = require('../models/Property');
const Buyer = require('../models/Buyer');
const router = express.Router();

// Get favourite list of buyer
router.get('/buyer-favourites/:email', async (req, res) => {
    try {
      const { email } = req.params;
      const favourites = await Favourite.find({ buyerEmail: email });
      if (!favourites || favourites.length === 0) {
        return res.status(200).json({ success: true, favourites: [] });
      }
      const propertyIds = favourites.map(fav => fav.propertyId);
      const properties = await Property.find({ id: { $in: propertyIds } });
      res.status(200).json({ success: true, favourites: properties });
    } catch (error) {
      console.error('Error fetching favourites:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

// get properties of buyer liked and emails of buyers to sellers
router.get('/favourite-properties/:email', async (req, res) => {
    try {
      const { email } = req.params;
      const properties = await Property.find({ sellerEmail: email });
      if (!properties || properties.length === 0) {
        return res.status(200).json({ success: true, properties: [] });
      }
      const propertyIds = properties.map(property => property.id);
      const favourites = await Favourite.find({ propertyId: { $in: propertyIds } });
      const buyerEmails = favourites.map(favourite => favourite.buyerEmail);
      const buyers = await Buyer.find({ email: { $in: buyerEmails } });
      res.status(200).json({ success: true, buyers });
    } catch (error) {
      console.error('Error fetching favourite properties:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  ///////////  buyers ///////////////
  //adding like
  router.post('/add', async (req, res) => {
    try {
      const { buyerEmail, propertyId } = req.body;
  
      // Check if all required fields are provided
      if (!buyerEmail || !propertyId) {
        res.status(400);
        return res.json({ error: 'All fields are required' });
      }
  
      // Retrieve sellerEmail from the propertyId
      const property = await Property.findOne({ id: propertyId });
      if (!property) {
        res.status(404);
        return res.json({ error: 'Property not found' });
      }
  
      const { sellerEmail } = property;
  
      // Create a new favorite object
      const newFavorite = new Favourite({
        buyerEmail,
        sellerEmail,
        propertyId
      });
  
      // Save the favorite to the database
      await newFavorite.save();
  
      res.status(201).json({ success: true, message: 'Property added to favorites successfully' });
    } catch (error) {
      console.error('Error adding property to favorites:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // count likes by propertyids
  router.get('/count-favourites/:propertyId', async (req, res) => {
    try {
      const { propertyId } = req.params;
  
      // Validate propertyId
      if (!propertyId) {
        res.status(400);
        return res.json({ error: 'Property ID is required' });
      }
  
      // Count the number of times the property has been added to favorites
      const count = await Favourite.countDocuments({ propertyId });
  
      res.status(200).json({ success: true, count });
    } catch (error) {
      console.error('Error counting property favorites:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  


module.exports = router;
