import nodemailer from 'nodemailer';

export async function sendResetPasswordEmail(email, resetURL) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: false, // Use TLS
      tls: {
        rejectUnauthorized: false,
      },
      logger: true,
      debug: true,
    });
  
    const message = {
      from: `Your Company <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Please make a PUT request to the following link:\n\n${resetURL}`,
      html: `<p>You requested a password reset.</p><p>Please click the following link to reset your password:</p><a href="${resetURL}">Reset Password</a>`,
    };
  
    try {
      const info = await transporter.sendMail(message);
      console.log('Email sent:', info);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email. Please try again later.');
    }
  }
  