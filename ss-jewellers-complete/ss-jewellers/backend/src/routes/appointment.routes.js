const express = require('express');
const router  = express.Router();
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { Appointment }           = require('../models');
const { sendEmail }             = require('../utils/email');

// POST /api/appointments — anyone can book
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const appt = await Appointment.create({ ...req.body, user: req.user?._id });

    // Send confirmation email if provided
    if (req.body.email) {
      sendEmail({
        to: req.body.email,
        subject: 'S.S. Jewellers – Appointment Request Received ✨',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #8B6914;">S.S. Jewellers</h2>
            <h3>Your Appointment Request</h3>
            <p>Dear <strong>${req.body.name}</strong>,</p>
            <p>We've received your appointment request. Our team will contact you at <strong>${req.body.phone}</strong> within 24 hours to confirm.</p>
            <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
              <tr style="background: #f9f6ed;"><td style="padding:10px; border: 1px solid #ddd;"><strong>Purpose</strong></td><td style="padding:10px; border: 1px solid #ddd;">${req.body.purpose}</td></tr>
              <tr><td style="padding:10px; border: 1px solid #ddd;"><strong>Visit Type</strong></td><td style="padding:10px; border: 1px solid #ddd;">${req.body.type}</td></tr>
              <tr style="background: #f9f6ed;"><td style="padding:10px; border: 1px solid #ddd;"><strong>Date</strong></td><td style="padding:10px; border: 1px solid #ddd;">${new Date(req.body.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
              <tr><td style="padding:10px; border: 1px solid #ddd;"><strong>Time Slot</strong></td><td style="padding:10px; border: 1px solid #ddd;">${req.body.timeSlot || req.body.slot}</td></tr>
            </table>
            <p style="color: #8B6914;">Thank you for choosing S.S. Jewellers — Est. 2016, Berhampur</p>
          </div>
        `,
      }).catch(console.error);
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked! We will confirm within 24 hours.',
      data: { appointment: appt },
    });
  } catch (err) { next(err); }
});

// GET /api/appointments/my — logged-in user
router.get('/my', protect, async (req, res, next) => {
  try {
    const appts = await Appointment.find({ user: req.user._id }).sort({ date: 1 });
    res.json({ success: true, data: { appointments: appts } });
  } catch (err) { next(err); }
});

// PUT /api/appointments/:id/cancel
router.put('/:id/cancel', protect, async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    if (appt.user?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    appt.status = 'cancelled';
    await appt.save();
    res.json({ success: true, message: 'Appointment cancelled.', data: { appointment: appt } });
  } catch (err) { next(err); }
});

module.exports = router;
