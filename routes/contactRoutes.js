const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact'); // Import Contact model
require('dotenv').config();

// Contact Us route
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save the contact form data to the database
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Email notification setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.PASSWORD // Your email password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.NOTIFY_EMAIL, // Your email to receive notifications
      subject: `New Contact Us Message from ${name}`,
      text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    // Send the email notification
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
