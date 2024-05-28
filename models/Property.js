const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    area: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    landmarks: { type: String, required: true },
    sellerEmail: { type: String, required: true }
});

// Ensure id is a combination of name and sellerEmail
propertySchema.pre('save', function(next) {
    this.id = `${this.name}-${this.sellerEmail}`;
    next();
});

module.exports = mongoose.model('Property', propertySchema);
