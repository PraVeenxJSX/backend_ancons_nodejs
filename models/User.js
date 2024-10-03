const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  qualification: { type: String, required: true },
  semester: { type: String, required: true },
  testPlans: { type: String, required: true },
  resume: { type: String, required: true }, // This will store the path of the uploaded resume
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
