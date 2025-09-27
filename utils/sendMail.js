const nodemailer = require('nodemailer');

const sendEmail = async (to, otp) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Optional: verify transporter connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌Email transporter error:', error);
    } else {
      console.log('✅Email transporter is ready');
    }
  });

  const subject = 'Verify Your Email';
  const text = `Your OTP is: ${otp}. It will expire in 10 minutes`;
  const html = `<h2>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes</h2>`;

  // Send mail
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text, 
    html
  });
};

module.exports = sendEmail;

