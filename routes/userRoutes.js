const express = require('express');
const multer = require('multer');
const path = require('path'); // Import path module for file path handling
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name with timestamp
  }
});
const upload = multer({ storage: storage });

// Register route
router.post('/register', upload.single('resume'), async (req, res) => {
  try {
    const { fullName, phone, email, qualification, semester, testPlans } = req.body;

    // Resume file path from multer
    const resumePath = req.file ? req.file.path : ''; // Get path to uploaded file
    const resumeOriginalName = req.file ? req.file.originalname : ''; // Original filename of the resume

    // Create a new user instance
    const newUser = new User({
      fullName,
      phone,
      email,
      qualification,
      semester,
      testPlans,
      resume: resumePath // Store resume path in the database
    });

    // Save the user to the database
    await newUser.save();

    // Email notification setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.NOTIFY_EMAIL, // Admin's email
      subject: 'New Registration Notification',
      text: `A new user has registered:\n
            Full Name: ${fullName}\n
            Phone: ${phone}\n
            Email: ${email}\n
            Qualification: ${qualification}\n
            Semester: ${semester}\n
            Test Plans: ${testPlans}`,
      attachments: [
        {
          filename: resumeOriginalName, // Send the original file name
          path: path.join(__dirname, '../', resumePath), // Path to the file in the uploads folder
          contentType: 'application/pdf' // Ensure it's sent as PDF
        }
      ]
    };

    // Send email with attachment
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;
