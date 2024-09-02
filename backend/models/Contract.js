const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  buyerName: { type: String, required: true },
  terms: { type: String, required: true },
  signedByFarmer: { type: Boolean, default: false },
  signedByBuyer: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contract', contractSchema);
