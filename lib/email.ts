import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";


const logoPath = path.resolve("./Ultra Band white-logo (1).png");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");
const logoSrc = `data:image/png;base64,${logoBase64}`;

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
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
      <div class="footer">Automated notification from Ultra Band Music.</div>
    </div>
  </body>
</html>
    `,
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
      <div class="footer">This is an automated confirmation email — please do not reply.</div>
    </div>
  </body>
</html>
    `,
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
      
         <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color:#f8f9fa; padding:40px 0; color:#333;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.1);overflow:hidden;">
        
        <!-- HEADER -->
        <div style="background:#000;padding:25px;text-align:center;">
          <img src="${logoSrc}" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
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
                   <li><strong>Proposed Date:</strong> ${new Date(proposedDate).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</li>
                   <li><strong>Proposed Time:</strong> ${proposedTime}</li>
                 </ul>
                 <p>Please let us know if this new date and time work for you.</p>`
              : `<p>Your booking is currently under review. We’ll get back to you shortly with an update.</p>`
          }

          <h3 style="margin-top:30px;border-bottom:2px solid ${statusColor};padding-bottom:5px;">Your Booking Details</h3>
          <ul style="list-style:none;padding-left:0;line-height:1.6;">
            <li><strong>Service:</strong> ${serviceName}</li>
            ${eventType ? `<li><strong>Event Type:</strong> ${eventType}</li>` : ""}
            <li><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</li>
            <li><strong>Time:</strong> ${eventTime}</li>
            <li><strong>Location:</strong> ${eventLocation}</li>
          </ul>

          ${
            notes
              ? `<div style="margin-top:20px;"><strong>Additional Notes:</strong><br>${notes}</div>`
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
    `,
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
          <img src="${logoSrc}" alt="Ultra Band Music" style="max-width:180px;height:auto;"/>
        </div>
        
        <div style="background:${statusColor};color:#fff;text-align:center;padding:15px 20px;font-size:20px;font-weight:bold;">
          Booking Status Updated
        </div>

        <div style="padding:30px;">
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>New Status:</strong> ${status}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
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
              ${eventType ? `<p><strong>Event Type:</strong> ${eventType}</p>` : ""}
              <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString("en-US", {
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

        <div class="footer">
          This message was generated from your website booking form.
        </div>
      </div>
    </body>
    </html>
    `,
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
              ${eventType ? `<p><strong>Event Type:</strong> ${eventType}</p>` : ""}
              <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString("en-US", {
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

        <div class="footer">
          This is an automated confirmation email. You can reply if you have any questions.
        </div>
      </div>
    </body>
    </html>
      
    `,
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
      <div class="footer">Ultra Band Music — your ultimate choice for an Owambe live band experience.</div>
    </div>
  </body>
</html>
        
      
    `,
  };

  await transporter.sendMail(recoveryEmail);
}
