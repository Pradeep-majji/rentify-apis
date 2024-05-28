const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SellerSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Seller', SellerSchema);
