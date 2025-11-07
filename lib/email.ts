import nodemailer from "nodemailer";
import path from "path";
import { format } from "date-fns";
import { BANK_DETAILS } from "./bank-details";

const logoPath = path.resolve("./public/Ultra Band white-logo (1).png");

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  // secure: true,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

interface BookingEmailData {
  serviceCategory: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType?: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventDescription: string;
  budgetRange: string;
}

// Contact Form Emails
export async function sendContactEmails(data: ContactEmailData) {
  const { name, email, message } = data;

  // Email to business
  const businessEmail = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: process.env.BUSINESS_EMAIL,
    subject: `${name} Reached Out`,
    html: `
      <html>
  <head>
    <style>
      body {
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #f7f7f8;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .email-wrapper {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      }
      .email-header {
        background: linear-gradient(135deg, #8328FA, #5B14E5);
        color: white;
        text-align: center;
        padding: 24px 16px;
      }
      .email-header h1 { margin: 0; font-size: 22px; font-weight: 600; }
      .email-body { padding: 32px 24px; line-height: 1.6; font-size: 15px; }
      .email-body h2 { color: #8328FA; font-size: 18px; margin-bottom: 12px; }
      .details-box {
        background-color: #f2f0ff;
        border-left: 4px solid #8328FA;
        padding: 12px 16px;
        border-radius: 6px;
        margin: 20px 0;
      }
      .footer { text-align: center; font-size: 13px; color: #888; padding: 20px; }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-header"><h1>New Contact Form Submission</h1></div>
      <div class="email-body">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <div class="details-box">
          <h2>Message:</h2>
          <p>${message}</p>
        </div>
        <p>Sent from the Ultra Band Music website contact form.</p>
      </div>
         <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>
      <div class="footer">Automated notification from Ultra Band Music.</div>
    </div>
  </body>
</html>
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  // Email to customer
  const customerEmail = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Thanks for contacting Ultra Band Music!",
    html: `
      <html>
  <head>
    <style>
      body { font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f7f7f8;margin:0;padding:0;color:#333;}
      .email-wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05);}
      .email-header{background:linear-gradient(135deg,#8328FA,#5B14E5);color:white;text-align:center;padding:24px 16px;}
      .email-header h1{margin:0;font-size:22px;font-weight:600;}
      .email-body{padding:32px 24px;line-height:1.6;font-size:15px;}
      .email-body h2{color:#8328FA;font-size:18px;margin-bottom:12px;}
      .details-box{background-color:#f2f0ff;border-left:4px solid #8328FA;padding:12px 16px;border-radius:6px;margin:20px 0;}
      .footer{text-align:center;font-size:13px;color:#888;padding:20px;}
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-header"><h1>Thank You for Reaching Out!</h1></div>
      <div class="email-body">
        <p>Hi ${name},</p>
        <p>Thank you for contacting <strong>Ultra Band Music</strong>. We’ve received your message and will get back to you within 24 hours.</p>
        <div class="details-box">
          <h2>Your Message:</h2>
          <p>${message}</p>
        </div>
        <p>Best regards,<br><strong>Ultra Band Music Team</strong></p>
      </div>
         <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>
      <div class="footer">This is an automated confirmation email — please do not reply.</div>
    </div>
  </body>
</html>
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  // Send both emails
  await Promise.all([
    transporter.sendMail(businessEmail),
    transporter.sendMail(customerEmail),
  ]);
}

// Booking Status Update Emails
interface BookingUpdateData {
  clientName: string;
  clientEmail: string;
  status: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  serviceCategory: string;
  eventType?: string;
  notes?: string;
  proposedDate?: string;
  proposedTime?: string;
}

// Update to Bookings - Audio Mixing & Video Editing
export async function sendBookingStatusUpdateEmails(data: BookingUpdateData) {
  const {
    clientName,
    clientEmail,
    status,
    eventDate,
    eventTime,
    eventLocation,
    serviceCategory,
    eventType,
    notes,
    proposedDate,
    proposedTime,
  } = data;

  const serviceName =
    serviceCategory === "events"
      ? "Live Event Performance"
      : serviceCategory === "mixing"
      ? "Audio Mixing & Mastering"
      : "Video Editing Services";

  const statusTitle =
    status === "accepted"
      ? "Booking Confirmed! 🎉"
      : status === "rejected"
      ? "Booking Update"
      : status === "counter_proposed"
      ? "Counter Proposal for Your Booking"
      : "Booking Status Update";

  const statusColor =
    status === "accepted"
      ? "#28a745"
      : status === "rejected"
      ? "#dc3545"
      : status === "counter_proposed"
      ? "#007bff"
      : "#ffc107";

  // Email to customer
  const customerEmail = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: clientEmail,
    subject: `${statusTitle} - Ultra Band Music`,
    html: `
      
      <html>
       <head>
        <style>
          body{font-family:'Segoe UI',Roboto,sans-serif;background:#f7f7f8;margin:0;padding:0;color:#333;}
          .wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);overflow:hidden;}
          .header{background:linear-gradient(135deg,#8328FA,#5B14E5);color:white;padding:24px;text-align:center;}
          .header h1{margin:0;font-size:22px;}
          .content{padding:32px 24px;line-height:1.6;}
          .cost-box{background:#f2f0ff;border-left:4px solid #8328FA;padding:16px;border-radius:6px;margin:20px 0;}
          .cost-box h2{color:#8328FA;margin:0 0 10px 0;font-size:20px;}
          .breakdown{background:#fff;border:1px solid #e5e7eb;padding:16px;border-radius:6px;margin:15px 0;}
          .breakdown h2{font-size:16px;color:#333;margin-top:12px;margin-bottom:8px;}
          .breakdown ul, .breakdown ol{margin:8px 0;padding-left:20px;}
          .breakdown li{margin-bottom:4px;}
          .breakdown blockquote{border-left:3px solid #8328FA;padding-left:12px;color:#666;font-style:italic;}
          .button{display:inline-block;background:#8328FA;color:#fff!important;padding:12px 24px;border-radius:6px;text-decoration:none;margin:10px 5px;font-weight:500;}
          .button-secondary{background:#6c757d;}
          .footer{background:#f7f7f8;padding:20px;text-align:center;font-size:13px;color:#777;}
        </style>
      </head>
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color:#f8f9fa; padding:40px 0; color:#333;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.1);overflow:hidden;">
        
        <!-- HEADER -->
        <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>
        
        <!-- STATUS HEADER -->
        <div style="background:${statusColor};color:#fff;text-align:center;padding:15px 20px;font-size:20px;font-weight:bold;">
          ${statusTitle}
        </div>

        <!-- BODY -->
        <div style="padding:30px;">
          <p>Hi <strong>${clientName}</strong>,</p>
          ${
            status === "accepted"
              ? `<p>Great news! Your booking has been <strong>confirmed</strong>! We’re thrilled to be part of your event. Our team will contact you shortly with next steps.</p>`
              : status === "rejected"
              ? `<p>Unfortunately, we’re unable to accommodate your booking request at this time. We apologize for any inconvenience and would be happy to explore alternative dates with you.</p>`
              : status === "counter_proposed" && proposedDate && proposedTime
              ? `<p>We have a counter proposal for you:</p>
                 <ul style="list-style:none;padding-left:0;">
                   <li><strong>Proposed Date:</strong> ${new Date(
                     proposedDate
                   ).toLocaleDateString("en-US", {
                     weekday: "long",
                     year: "numeric",
                     month: "long",
                     day: "numeric",
                   })}</li>
                   <li><strong>Proposed Time:</strong> ${proposedTime}</li>
                 </ul>
                 <p>Please let us know if this new date and time work for you.</p>`
              : `<p>Your booking is currently under review. We’ll get back to you shortly with an update.</p>`
          }

          <h3 style="margin-top:30px;border-bottom:2px solid ${statusColor};padding-bottom:5px;">Your Booking Details</h3>
          <ul style="list-style:none;padding-left:0;line-height:1.6;">
            <li><strong>Service:</strong> ${serviceName}</li>
            ${
              eventType
                ? `<li><strong>Event Type:</strong> ${eventType}</li>`
                : ""
            }
            <li><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}</li>
            <li><strong>Time:</strong> ${eventTime}</li>
            <li><strong>Location:</strong> ${eventLocation}</li>
          </ul>

          ${
            notes
              ? `<div class="breakdown" style="margin-top:10px;">
               <h3 style="color:#8328FA;margin-top:0;">Admin Notes:</h3>
                 ${notes}
               </div>`
              : ""
          }

          <p style="margin-top:25px;">If you have any questions, feel free to reply directly to this email.</p>
          <p style="margin-top:30px;">Best regards,<br><strong>Ultra Band Music Team</strong></p>
        </div>

        <!-- FOOTER -->
        <div style="background:#f0f0f0;padding:15px;text-align:center;font-size:12px;color:#777;">
          This is an automated notification email from Ultra Band Music.<br/>
          You can reply directly if you have questions.
        </div>
      </div>
    </div>
      </html>
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  // Email to business (notification)
  const businessEmail = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: process.env.BUSINESS_EMAIL,
    subject: `Booking Status Updated: ${clientName} - ${status}`,
    html: `
      
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif;background:#f8f9fa;padding:40px 0;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.1);overflow:hidden;">
        
        <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>
        
        <div style="background:${statusColor};color:#fff;text-align:center;padding:15px 20px;font-size:20px;font-weight:bold;">
          Booking Status Updated
        </div>

        <div style="padding:30px;">
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>New Status:</strong> ${status}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString(
            "en-US",
            { weekday: "long", year: "numeric", month: "long", day: "numeric" }
          )}</p>
          <p><strong>Location:</strong> ${eventLocation}</p>

          ${
            notes
              ? `<div style="margin-top:20px;"><strong>Notes Sent to Client:</strong><br>${notes}</div>`
              : ""
          }

          <p style="margin-top:30px;">A client notification email has been sent automatically.</p>
        </div>

        <div style="background:#f0f0f0;padding:15px;text-align:center;font-size:12px;color:#777;">
          Internal Ultra Band Music notification.
        </div>
      </div>
    </div>     
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  // Send both emails
  await Promise.all([
    transporter.sendMail(customerEmail),
    transporter.sendMail(businessEmail),
  ]);
}

// Booking Form Emails
export async function sendBookingEmails(data: BookingEmailData) {
  const {
    serviceCategory,
    clientName,
    clientEmail,
    clientPhone,
    eventType,
    eventDate,
    eventTime,
    eventLocation,
    eventDescription,
    budgetRange,
  } = data;

  const serviceName =
    serviceCategory === "events"
      ? "Live Event Performance"
      : serviceCategory === "mixing"
      ? "Audio Mixing & Mastering"
      : "Video Editing Services";

  const baseStyle = `
      <style>
        body {
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f7f7f8;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .header {
          background: linear-gradient(135deg, #8328FA, #5B14E5);
          color: white;
          text-align: center;
          padding: 24px 16px;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
        }
        .content {
          padding: 32px 24px;
          line-height: 1.6;
          font-size: 15px;
        }
        .section {
          margin-bottom: 24px;
        }
        .section h2 {
          font-size: 17px;
          color: #8328FA;
          margin-bottom: 10px;
        }
        .details {
          background-color: #f2f0ff;
          border-left: 4px solid #8328FA;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 14px;
        }
        .footer {
          background-color: #f7f7f8;
          text-align: center;
          font-size: 13px;
          color: #777;
          padding: 16px;
        }
        .list {
          margin: 12px 0 0 16px;
          padding: 0;
        }
        .list li {
          margin-bottom: 6px;
        }
      </style>`;

  // Email to business
  const businessEmail = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: process.env.BUSINESS_EMAIL,
    subject: `New Booking Request: ${serviceName} - ${clientName}`,
    html: `
      <html>
    <head>${baseStyle}</head>
    <body>
      <div class="email-wrapper">
        <div class="header"><h1>New Booking Request</h1></div>
        <div class="content">
          <div class="section">
            <h2>Contact Information</h2>
            <div class="details">
              <p><strong>Name:</strong> ${clientName}</p>
              <p><strong>Email:</strong> ${clientEmail}</p>
              <p><strong>Phone:</strong> ${clientPhone || "Not provided"}</p>
            </div>
          </div>

          <div class="section">
            <h2>Service Details</h2>
            <div class="details">
              <p><strong>Service Category:</strong> ${serviceName}</p>
              ${
                eventType
                  ? `<p><strong>Event Type:</strong> ${eventType}</p>`
                  : ""
              }
              <p><strong>Date:</strong> ${new Date(
                eventDate
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</p>
              <p><strong>Time:</strong> ${eventTime}</p>
              <p><strong>Location:</strong> ${eventLocation}</p>
              <p><strong>Budget Range:</strong> ${budgetRange}</p>
            </div>
          </div>

          ${
            eventDescription
              ? `
              <div class="section">
                <h2>Additional Details</h2>
                <div class="details">
                  <p>${eventDescription}</p>
                </div>
              </div>`
              : ""
          }

          <p style="margin-top: 24px;">Sent automatically from <strong>Ultra Band Music</strong> booking system.</p>
        </div>
         <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>

        <div class="footer">
          This message was generated from your website booking form.
        </div>
      </div>
    </body>
    </html>
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  // Email to customer
  const customerEmail = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: clientEmail,
    subject: "Booking Request Received - Ultra Band Music",
    html: `
       <html>
    <head>${baseStyle}</head>
    <body>
      <div class="email-wrapper">
        <div class="header"><h1>Booking Request Received!</h1></div>
        <div class="content">

          <p>Hi ${clientName},</p>
          <p>Thank you for your booking request! We're thrilled about the opportunity to be part of your special event.</p>

          <div class="section">
            <h2>Your Booking Details</h2>
            <div class="details">
              <p><strong>Service:</strong> ${serviceName}</p>
              ${
                eventType
                  ? `<p><strong>Event Type:</strong> ${eventType}</p>`
                  : ""
              }
              <p><strong>Date:</strong> ${new Date(
                eventDate
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</p>
              <p><strong>Time:</strong> ${eventTime}</p>
              <p><strong>Location:</strong> ${eventLocation}</p>
            </div>
          </div>

          <div class="section">
            <h2>What Happens Next?</h2>
            <ul class="list">
              <li>Our team will review your request and availability</li>
              <li>We'll prepare a customized proposal for your event</li>
              <li>You'll receive a detailed quote within 24 hours</li>
              <li>We'll schedule a call to discuss any questions</li>
            </ul>
          </div>

          <p>If you have any urgent questions, feel free to reply to this email or call us directly.</p>

          <p style="margin-top: 20px;">Best regards,<br><strong>The Ultra Band Music Team</strong></p>
        </div>
         <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>

        <div class="footer">
          This is an automated confirmation email. You can reply if you have any questions.
        </div>
      </div>
    </body>
    </html>
      
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  // Send both emails
  await Promise.all([
    transporter.sendMail(businessEmail),
    transporter.sendMail(customerEmail),
  ]);
}

interface PasswordRecoveryData {
  email: string;
  username: string;
  temporaryPassword: string;
}

// Password Recovery Mail- To Admin
export async function sendPasswordRecoveryEmail(data: PasswordRecoveryData) {
  const { email, username, temporaryPassword } = data;

  const recoveryEmail = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Admin Password Recovery - Ultra Band Music",
    html: `
      
          <html>
  <head>
    <style>
      body{font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f7f7f8;margin:0;padding:0;color:#333;}
      .email-wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05);}
      .email-header{background:linear-gradient(135deg,#8328FA,#5B14E5);color:white;text-align:center;padding:24px 16px;}
      .email-body{padding:32px 24px;line-height:1.6;font-size:15px;text-align:center;}
      .button{display:inline-block;background-color:#8328FA;color:#fff !important;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:500;margin-top:20px;}
      .footer{text-align:center;font-size:13px;color:#888;padding:20px;}
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-header"><h1>Password Reset Request</h1></div>
      <div class="email-body">
        <p>Hello!,</p>
        <p>We received a request to reset your password for your <strong>Ultra Band Music</strong> account.</p>
        <p>Temporary Login Credentials:</p>
        Username: ${username}
        Password: ${temporaryPassword}
        <p>Important Security Notice:</p>
        <p> Please change your password immediately after logging in
            Go to Admin Settings → Admin Credentials to update
            Choose a strong, unique password
            Update your recovery email if needed</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      </div>
       <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>
      <div class="footer">Ultra Band Music — your ultimate choice for an Owambe live band experience.</div>
    </div>
  </body>
</html>
        
      
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  await transporter.sendMail(recoveryEmail);
}

// Cost Proposal Email to Client
export async function sendCostProposalEmail(data: {
  clientName: string;
  clientEmail: string;
  proposedCost: number;
  notes?: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  bookingId: string;
}) {
  const responseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/booking-response/${data.bookingId}`;

  const email = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: data.clientEmail,
    subject: "Cost Proposal for Your Event - Ultra Band Music",
    html: `
      <html>
      <head>
        <style>
          body{font-family:'Segoe UI',Roboto,sans-serif;background:#f7f7f8;margin:0;padding:0;color:#333;}
          .wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);overflow:hidden;}
          .header{background:linear-gradient(135deg,#8328FA,#5B14E5);color:white;padding:24px;text-align:center;}
          .header h1{margin:0;font-size:22px;}
          .content{padding:32px 24px;line-height:1.6;}
          .cost-box{background:#f2f0ff;border-left:4px solid #8328FA;padding:16px;border-radius:6px;margin:20px 0;}
          .cost-box h2{color:#8328FA;margin:0 0 10px 0;font-size:20px;}
          .breakdown{background:#fff;border:1px solid #e5e7eb;padding:16px;border-radius:6px;margin:15px 0;}
          .breakdown h2{font-size:16px;color:#333;margin-top:12px;margin-bottom:8px;}
          .breakdown ul, .breakdown ol{margin:8px 0;padding-left:20px;}
          .breakdown li{margin-bottom:4px;}
          .breakdown blockquote{border-left:3px solid #8328FA;padding-left:12px;color:#666;font-style:italic;}
          .button{display:inline-block;background:#8328FA;color:#fff!important;padding:12px 24px;border-radius:6px;text-decoration:none;margin:10px 5px;font-weight:500;}
          .button-secondary{background:#6c757d;}
          .footer{background:#f7f7f8;padding:20px;text-align:center;font-size:13px;color:#777;}
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header"><h1>Cost Proposal for Your Event</h1></div>
          <div class="content">
            <p>Hi ${data.clientName},</p>
            <p>Thank you for your interest! We've prepared a cost proposal for your event:</p>
            
            <div class="cost-box">
              <h2>Proposed Cost: $${data.proposedCost.toFixed(2)}</h2>
              <p><strong>Event Date:</strong> ${format(new Date(data.eventDate), "PPP")}</p>
              <p><strong>Time:</strong> ${data.eventTime}</p>
              <p><strong>Location:</strong> ${data.eventLocation}</p>
            </div>

            ${data.notes ? `
              <div class="breakdown">
                <h3 style="color:#8328FA;margin-top:0;">Cost Breakdown:</h3>
                ${data.notes}
              </div>
            ` : ''}

            <p><strong>What would you like to do?</strong></p>
            
            <div style="text-align:center;margin:30px 0;">
              <a href="${responseUrl}?action=accept" class="button">Accept Proposal</a>
              <a href="${responseUrl}?action=counter" class="button button-secondary">Make Counter Offer</a>
            </div>

            <p style="text-align:center;font-size:12px;color:#888;margin-top:20px;">
              <a href="${responseUrl}?action=cancel" style="color:#dc3545;text-decoration:underline;">Cancel Booking</a>
            </p>

            <p style="margin-top:30px;">We look forward to hearing from you!</p>
            <p>Best regards,<br><strong>Ultra Band Music Team</strong></p>
          </div>
           <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>
          <div class="footer">
            This is an automated email from Ultra Band Music. You can reply directly with any questions.
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  console.log(
    "📧 Attempting to send cost proposal email to:",
    data.clientEmail
  );
  console.log("📧 Response URL:", responseUrl);

  await transporter.sendMail(email);
}

// Payment Link Email
export async function sendPaymentLinkEmail(data: {
  clientName: string;
  clientEmail: string;
  amount: number;
  paymentLink: string;
  eventDate: string;
  bookingId: string;
}) {
  const responseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/booking-response/${data.bookingId}`;
  const email = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: data.clientEmail,
    subject: "Payment Link - Ultra Band Music",
    html: `
      <html>
      <head>
        <style>
          body{font-family:'Segoe UI',Roboto,sans-serif;background:#f7f7f8;margin:0;padding:0;color:#333;}
          .wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);overflow:hidden;}
          .header{background:linear-gradient(135deg,#8328FA,#5B14E5);color:white;padding:24px;text-align:center;}
          .header h1{margin:0;font-size:22px;}
          .content{padding:32px 24px;line-height:1.6;}
          .cost-box{background:#f2f0ff;border-left:4px solid #8328FA;padding:16px;border-radius:6px;margin:20px 0;}
          .cost-box h2{color:#8328FA;margin:0 0 10px 0;font-size:20px;}
          .button{display:inline-block;background:#8328FA;color:#fff!important;padding:14px 28px;border-radius:6px;text-decoration:none;margin:10px 5px;font-weight:600;font-size:16px;}
          .footer{background:#f7f7f8;padding:20px;text-align:center;font-size:13px;color:#777;}
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header"><h1>Complete Your Booking Payment</h1></div>
          <div class="content">
            <p>Hi ${data.clientName},</p>
            <p>Great news! We've agreed on the booking details. Please complete your payment to confirm:</p>
            
            <div class="cost-box">
              <h2>Amount Due: $${data.amount.toFixed(2)}</h2>
              <p><strong>Event Date:</strong> ${format(
                new Date(data.eventDate),
                "PPP"
              )}</p>
            </div>

            <div style="text-align:center;margin:30px 0;">
              <a href="${responseUrl}?action=accept" class="button">Pay Now</a>
            </div>

            <p>Once payment is confirmed, your booking will be finalized!</p>
            <p style="margin-top:30px;">Best regards,<br><strong>Ultra Band Music Team</strong></p>
          </div>
           <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>
          <div class="footer">
            This is an automated email from Ultra Band Music.
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  console.log("📧 Sending payment link email to:", data.clientEmail);
  await transporter.sendMail(email);
}

// Counter Offer Notification to Admin
export async function sendCounterOfferNotification(data: {
  clientName: string;
  counterOffer: number;
  bookingId: string;
}) {
  const email = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: process.env.BUSINESS_EMAIL,
    subject: `Counter Offer Received - ${data.clientName}`,
    html: `
      <html>
      <head>
        <style>
          body{font-family:'Segoe UI',Roboto,sans-serif;background:#f7f7f8;margin:0;padding:0;color:#333;}
          .wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);overflow:hidden;}
          .header{background:linear-gradient(135deg,#ff9800,#ff5722);color:white;padding:24px;text-align:center;}
          .header h1{margin:0;font-size:22px;}
          .content{padding:32px 24px;line-height:1.6;}
          .offer-box{background:#fff3e0;border-left:4px solid #ff9800;padding:16px;border-radius:6px;margin:20px 0;}
          .button{display:inline-block;background:#8328FA;color:#fff!important;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:15px;}
          .footer{background:#f7f7f8;padding:20px;text-align:center;font-size:13px;color:#777;}
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header"><h1>Counter Offer Received</h1></div>
          <div class="content">
            <p><strong>${
              data.clientName
            }</strong> has sent a counter offer for their booking.</p>
            
            <div class="offer-box">
              <h3 style="margin:0 0 10px 0;color:#ff9800;">Counter Offer Amount</h3>
              <p style="font-size:28px;font-weight:bold;color:#ff5722;margin:10px 0;">$${data.counterOffer.toFixed(
                2
              )}</p>
            </div>

            <p>Please review this offer in your admin dashboard and respond accordingly.</p>
            
            <div style="text-align:center;">
              <a href="${
                process.env.NEXT_PUBLIC_APP_URL
              }/admin" class="button">Review in Dashboard</a>
            </div>
          </div>
           <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>
          <div class="footer">Internal notification from Ultra Band Music</div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  await transporter.sendMail(email);
}

interface PaymentSuccessData {
  clientName: string;
  clientEmail: string;
  amount: number;
  transactionId: string;
  bookingDetails: {
    eventType?: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    serviceCategory: string;
  };
}


// Success Mails
export async function sendPaymentSuccessEmails(data: PaymentSuccessData) {
  const { clientName, clientEmail, amount, transactionId, bookingDetails } =
    data;

  const serviceName =
    bookingDetails.serviceCategory === "events"
      ? "Live Event Performance"
      : bookingDetails.serviceCategory === "mixing"
      ? "Audio Mixing & Mastering"
      : "Video Editing Services";

  const invoiceHtml = `
    <div style="background:#f2f0ff;border:2px solid #8328FA;padding:20px;border-radius:8px;margin:20px 0;">
      <h3 style="color:#8328FA;margin-top:0;">Invoice Details</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:8px;"><strong>Service:</strong></td>
          <td style="padding:8px;">${serviceName}</td>
        </tr>
        ${
          bookingDetails.eventType
            ? `
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:8px;"><strong>Event Type:</strong></td>
          <td style="padding:8px;">${bookingDetails.eventType}</td>
        </tr>`
            : ""
        }
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:8px;"><strong>Date:</strong></td>
          <td style="padding:8px;">${format(
            new Date(bookingDetails.eventDate),
            "PPP"
          )}</td>
        </tr>
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:8px;"><strong>Time:</strong></td>
          <td style="padding:8px;">${bookingDetails.eventTime}</td>
        </tr>
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:8px;"><strong>Location:</strong></td>
          <td style="padding:8px;">${bookingDetails.eventLocation}</td>
        </tr>
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:8px;"><strong>Transaction ID:</strong></td>
          <td style="padding:8px;font-family:monospace;">${transactionId}</td>
        </tr>
        <tr style="background:#e8f5e9;">
          <td style="padding:12px;"><strong style="font-size:16px;">Total Paid:</strong></td>
          <td style="padding:12px;"><strong style="font-size:18px;color:#28a745;">$${amount.toFixed(
            2
          )}</strong></td>
        </tr>
      </table>
    </div>
  `;

  // Email to customer
  const customerEmail = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: clientEmail,
    subject: "Payment Successful - Booking Confirmed! - Ultra Band Music",
    html: `
      <html>
      <head>
        <style>
          body{font-family:'Segoe UI',Roboto,sans-serif;background:#f7f7f8;margin:0;padding:0;color:#333;}
          .wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);overflow:hidden;}
          .header{background:linear-gradient(135deg,#28a745,#20c997);color:white;padding:24px;text-align:center;}
          .header h1{margin:0;font-size:24px;}
          .content{padding:32px 24px;line-height:1.6;}
          .footer{background:#f7f7f8;padding:20px;text-align:center;font-size:13px;color:#777;}
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>🎉 Payment Successful!</h1>
          </div>
          <div class="content">
            <p>Hi ${clientName},</p>
            <p>Thank you for your payment! Your booking is now <strong>confirmed</strong>.</p>
            
            ${invoiceHtml}

            <p style="margin-top:30px;">We're excited to be part of your special event! Our team will be in touch with final details closer to the date.</p>
            
            <p style="margin-top:20px;">If you have any questions, feel free to reply to this email.</p>
            
            <p style="margin-top:30px;">Best regards,<br><strong>Ultra Band Music Team</strong></p>
          </div>
           <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>
          <div class="footer">
            Keep this email as your receipt and booking confirmation.
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  // Email to admin
  const adminEmail = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: process.env.BUSINESS_EMAIL,
    subject: `💰 Payment Received - ${clientName} - $${amount.toFixed(2)}`,
    html: `
      <html>
      <head>
        <style>
          body{font-family:'Segoe UI',Roboto,sans-serif;background:#f7f7f8;margin:0;padding:0;color:#333;}
          .wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);overflow:hidden;}
          .header{background:linear-gradient(135deg,#28a745,#20c997);color:white;padding:24px;text-align:center;}
          .content{padding:32px 24px;line-height:1.6;}
          .footer{background:#f7f7f8;padding:20px;text-align:center;font-size:13px;color:#777;}
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header"><h1>Payment Received</h1></div>
          <div class="content">
            <p><strong>Client:</strong> ${clientName}</p>
            <p><strong>Email:</strong> ${clientEmail}</p>
            <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
            
            ${invoiceHtml}

            <p style="margin-top:20px;"><strong>Note:</strong> A private event has been automatically created in your dashboard. You can make it public when ready.</p>
          </div>
           <div style="background:#000;padding:25px;text-align:center;">
          <img src="cid:ultraband-logo" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>
          <div class="footer">Automated notification from Ultra Band Music</div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: "ultraband-logo.png",
        path: logoPath,
        cid: "ultraband-logo",
      },
    ],
  };

  await Promise.all([
    transporter.sendMail(customerEmail),
    transporter.sendMail(adminEmail),
  ]);
}


export async function sendBankDetailsEmail(data: {
  clientName: string;
  clientEmail: string;
  amount: number;
  bookingId: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}) {
  const email = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: data.clientEmail,
    subject: "Payment Instructions - Ultra Band Music",
    html: `
      <html>
      <head>
        <style>
          body{font-family:'Segoe UI',Roboto,sans-serif;background:#f7f7f8;margin:0;padding:0;color:#333;}
          .wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);overflow:hidden;}
          .header{background:linear-gradient(135deg,#28a745,#20c997);color:white;padding:24px;text-align:center;}
          .header h1{margin:0;font-size:22px;}
          .content{padding:32px 24px;line-height:1.6;}
          .bank-box{background:#f2f0ff;border:2px solid #8328FA;padding:20px;border-radius:8px;margin:20px 0;}
          .bank-box h3{color:#8328FA;margin-top:0;}
          .bank-detail{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb;}
          .bank-detail:last-child{border-bottom:none;}
          .bank-detail strong{color:#333;}
          .amount-box{background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;border-radius:6px;margin:20px 0;}
          .footer{background:#f7f7f8;padding:20px;text-align:center;font-size:13px;color:#777;}
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header"><h1>Payment Instructions</h1></div>
          <div class="content">
            <p>Hi ${data.clientName},</p>
            <p>Thank you for accepting our proposal! Please make your payment using the bank details below:</p>
            
            <div class="amount-box">
              <h3 style="margin:0 0 8px 0;color:#f59e0b;">Amount to Pay</h3>
              <p style="font-size:28px;font-weight:bold;color:#92400e;margin:0;">$${data.amount.toFixed(2)}</p>
            </div>

            <div class="bank-box">
              <h3>Bank Transfer Details</h3>
              <div class="bank-detail">
                <span>Bank Name:</span>
                <strong>${BANK_DETAILS.bankName}</strong>
              </div>
              <div class="bank-detail">
                <span>Account Name:</span>
                <strong>${BANK_DETAILS.accountName}</strong>
              </div>
              <div class="bank-detail">
                <span>Account Number:</span>
                <strong>${BANK_DETAILS.accountNumber}</strong>
              </div>
              ${BANK_DETAILS.routingNumberWire ? `
              <div class="bank-detail">
                <span>Routing Number:</span>
                <strong>${BANK_DETAILS.routingNumberWire}</strong>
              </div>` : ''}
            </div>

            <div style="background:#dbeafe;border-left:4px solid #3b82f6;padding:16px;border-radius:6px;margin:20px 0;">
              <p style="margin:0;"><strong>Important:</strong></p>
              <ul style="margin:8px 0;padding-left:20px;">
                <li>Please include your name in the transfer reference</li>
                <li>After making payment, click the confirmation link in your booking page</li>
                <li>Keep your payment receipt for records</li>
              </ul>
            </div>

            <p><strong>Event Details:</strong></p>
            <p>📅 ${format(new Date(data.eventDate), "PPP")}<br>
            ⏰ ${data.eventTime}<br>
            📍 ${data.eventLocation}</p>

            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/booking-response/${data.bookingId}?action=confirm-payment" 
                 style="display:inline-block;background:#8328FA;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;">
                I Have Made Payment
              </a>
            </div>

            <p>Best regards,<br><strong>Ultra Band Music Team</strong></p>
          </div>
          <div class="footer">
            This is an automated email from Ultra Band Music.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(email);
}

export async function sendPaymentConfirmationToAdmin(data: {
  clientName: string;
  clientEmail: string;
  amount: number;
  bookingId: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  paymentMethod: string;
  paymentProofUrl?: string;
}) {
  const paymentMethodNames = {
    bank_transfer: 'Bank Transfer',
    zelle: 'Zelle',
    paypal: 'PayPal',
  };

  const email = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: process.env.BUSINESS_EMAIL,
    subject: `⚠️ Payment Confirmation Needed - ${data.clientName}`,
    html: `
      <html>
      <head>
        <style>
          body{font-family:'Segoe UI',Roboto,sans-serif;background:#f7f7f8;margin:0;padding:0;color:#333;}
          .wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);overflow:hidden;}
          .header{background:linear-gradient(135deg,#f59e0b,#d97706);color:white;padding:24px;text-align:center;}
          .content{padding:32px 24px;line-height:1.6;}
          .alert-box{background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;border-radius:6px;margin:20px 0;}
          .proof-box{background:#f3f4f6;border:1px solid #d1d5db;padding:16px;border-radius:8px;margin:20px 0;text-align:center;}
          .footer{background:#f7f7f8;padding:20px;text-align:center;font-size:13px;color:#777;}
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header"><h1>⚠️ Payment Confirmation Required</h1></div>
          <div class="content">
            <div class="alert-box">
              <p style="margin:0;font-weight:600;color:#92400e;">Client has submitted payment proof!</p>
            </div>

            <p><strong>Client:</strong> ${data.clientName}</p>
            <p><strong>Email:</strong> ${data.clientEmail}</p>
            <p><strong>Amount:</strong> $${data.amount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${paymentMethodNames[data.paymentMethod] || data.paymentMethod}</p>
            <p><strong>Event:</strong> ${format(new Date(data.eventDate), "PPP")} at ${data.eventTime}</p>
            <p><strong>Location:</strong> ${data.eventLocation}</p>

            ${data.paymentProofUrl ? `
            <div class="proof-box">
              <p style="margin:0 0 10px 0;font-weight:600;">Payment Proof:</p>
              <a href="${data.paymentProofUrl}" target="_blank" style="display:inline-block;background:#8328FA;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">
                View Payment Receipt
              </a>
            </div>` : ''}

            <p style="margin-top:20px;">Please verify the payment and confirm in the admin dashboard.</p>

            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
                 style="display:inline-block;background:#8328FA;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;">
                Go to Admin Dashboard
              </a>
            </div>
          </div>
          <div class="footer">Internal notification from Ultra Band Music</div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(email);
}