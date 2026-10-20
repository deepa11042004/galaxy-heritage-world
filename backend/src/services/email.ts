import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { logger } from '../config/logger.js';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!config.smtp.host || config.smtp.host === 'localhost') {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
    });
  }
  return transporter;
}

export async function sendEnquiryAcknowledgement(enquiry: {
  referenceNumber: string;
  name: string;
  email: string;
  phone: string;
  destinationInterest?: string | null;
}) {
  const mailer = getTransporter();
  if (!mailer) {
    logger.info(
      { ref: enquiry.referenceNumber, to: enquiry.email },
      '[Email Mock] SMTP not configured; logged enquiry acknowledgement successfully.'
    );
    return false;
  }

  try {
    await mailer.sendMail({
      from: `"Galaxy Heritage World" <${config.smtp.fromEmail}>`,
      to: enquiry.email,
      subject: `Enquiry Received [Ref: ${enquiry.referenceNumber}] - Galaxy Heritage World`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #141414;">
          <h2 style="color: #D4AF37;">Thank you for contacting Galaxy Heritage World</h2>
          <p>Dear ${enquiry.name},</p>
          <p>We have received your enquiry regarding <strong>${enquiry.destinationInterest || 'your upcoming holiday'}</strong>.</p>
          <p>Your unique enquiry reference is: <strong>${enquiry.referenceNumber}</strong></p>
          <p>Our dedicated travel consultant will review your preferences and get in touch with you shortly.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">
            Galaxy Heritage World | Toll Free: 1800-843-6114 | info@galaxyheritageworld.com<br/>
            Lower Ground, C-33, Ram Nagar, Kaushambi, Ghaziabad, Uttar Pradesh 201012
          </p>
        </div>
      `,
    });
    logger.info({ ref: enquiry.referenceNumber, to: enquiry.email }, 'Sent enquiry acknowledgement email');
    return true;
  } catch (error) {
    logger.error({ err: error, ref: enquiry.referenceNumber }, 'Failed to send enquiry email');
    return false;
  }
}
