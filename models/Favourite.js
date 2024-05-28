const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favouriteSchema = new Schema({
    buyerEmail: { type: String, required: true },
    sellerEmail: { type: String, required: true },
    propertyId: { type: String, required: true }
});

// Creating a compound index on buyerEmail, sellerEmail, and propertyId fields
favouriteSchema.index({ buyerEmail: 1, sellerEmail: 1, propertyId: 1 }, { unique: true });

module.exports = mongoose.model('Favourite', favouriteSchema);
