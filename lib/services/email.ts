import { EmailTemplate, EmailNotification } from "@/types";

// Email templates
export const emailTemplates = {
  newBooking: (data: any): EmailTemplate => ({
    subject: `New Booking Confirmation - ${data.vehicleName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Confirmation</h2>
        <p>Dear ${data.customerName},</p>
        <p>Thank you for booking with Drive Away! Your booking has been confirmed.</p>
        
        <h3>Booking Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Booking ID</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.bookingId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Vehicle</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.vehicleName}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Pickup Date</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.pickupDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Return Date</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.returnDate}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Total Price</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">$${data.totalPrice}</td>
          </tr>
        </table>

        <h3>Next Steps:</h3>
        <ul>
          <li>Confirm your booking details</li>
          <li>Make advance payment of $${data.advancePayment}</li>
          <li>Arrive 15 minutes before pickup time</li>
        </ul>

        <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
          If you have any questions, please contact us at ${data.contactEmail}
        </p>
      </div>
    `,
    text: `
      Booking Confirmation
      
      Dear ${data.customerName},
      
      Thank you for booking with Drive Away! Your booking has been confirmed.
      
      Booking Details:
      Booking ID: ${data.bookingId}
      Vehicle: ${data.vehicleName}
      Pickup Date: ${data.pickupDate}
      Return Date: ${data.returnDate}
      Total Price: $${data.totalPrice}
      
      Next Steps:
      - Confirm your booking details
      - Make advance payment of $${data.advancePayment}
      - Arrive 15 minutes before pickup time
      
      Contact us: ${data.contactEmail}
    `,
  }),

  bookingCompleted: (data: any): EmailTemplate => ({
    subject: `Booking Completed - ${data.vehicleName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank You!</h2>
        <p>Dear ${data.customerName},</p>
        <p>Your booking period has ended. Thank you for choosing Drive Away!</p>
        
        <h3>Booking Summary:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Booking ID</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.bookingId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Vehicle</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.vehicleName}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Total Amount</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">$${data.totalPrice}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Days Rented</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.totalDays}</td>
          </tr>
        </table>

        <h3>We'd Love Your Feedback!</h3>
        <p>Please rate your experience and help us improve.</p>

        <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
          Thank you for choosing Drive Away!
        </p>
      </div>
    `,
    text: `
      Thank You!
      
      Dear ${data.customerName},
      
      Your booking period has ended. Thank you for choosing Drive Away!
      
      Booking Summary:
      Booking ID: ${data.bookingId}
      Vehicle: ${data.vehicleName}
      Total Amount: $${data.totalPrice}
      Days Rented: ${data.totalDays}
      
      We'd Love Your Feedback!
      Please rate your experience and help us improve.
    `,
  }),

  adminNewBooking: (data: any): EmailTemplate => ({
    subject: `NEW BOOKING - ${data.vehicleName} (${data.bookingId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">New Booking Alert</h2>
        
        <h3>Customer Information:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Name</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Email</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.customerEmail}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Phone</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.customerPhone}</td>
          </tr>
        </table>

        <h3>Booking Information:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Booking ID</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.bookingId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Vehicle</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.vehicleName}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Pickup</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.pickupDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Return</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.returnDate}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Total Price</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">$${data.totalPrice}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Status</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; color: #ff9800;"><strong>${data.status}</strong></td>
          </tr>
        </table>

        <p style="margin-top: 30px;">
          <a href="http://localhost:3000/admin/bookings/${data.bookingId}" 
             style="background-color: #000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View in Admin Dashboard
          </a>
        </p>
      </div>
    `,
    text: `
      New Booking Alert
      
      Customer Information:
      Name: ${data.customerName}
      Email: ${data.customerEmail}
      Phone: ${data.customerPhone}
      
      Booking Information:
      Booking ID: ${data.bookingId}
      Vehicle: ${data.vehicleName}
      Pickup Date: ${data.pickupDate}
      Return Date: ${data.returnDate}
      Total Price: $${data.totalPrice}
      Status: ${data.status}
    `,
  }),

  bookingReminder: (data: any): EmailTemplate => ({
    subject: `Reminder: Your booking ends on ${data.returnDate}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Reminder</h2>
        <p>Dear ${data.customerName},</p>
        <p>This is a reminder that your booking period ends on <strong>${data.returnDate}</strong>.</p>
        
        <h3>Booking Details:</h3>
        <p><strong>Vehicle:</strong> ${data.vehicleName}</p>
        <p><strong>Return Date:</strong> ${data.returnDate}</p>
        
        <p>Please ensure to return the vehicle by the scheduled time to avoid additional charges.</p>
      </div>
    `,
    text: `
      Booking Reminder
      
      Dear ${data.customerName},
      
      This is a reminder that your booking period ends on ${data.returnDate}.
      
      Booking Details:
      Vehicle: ${data.vehicleName}
      Return Date: ${data.returnDate}
      
      Please ensure to return the vehicle by the scheduled time.
    `,
  }),
};

// Send email (placeholder - implement with your email service)
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  try {
    // TODO: Integrate with email service (SendGrid, Gmail, AWS SES, etc.)
    // For now, just log
    console.log("📧 Email would be sent:", {
      to,
      subject,
      timestamp: new Date().toISOString(),
    });

    // Example with fetch (replace with your email service)
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ to, subject, html, text })
    // });
    // return response.ok;

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Send notification emails
export async function sendNewBookingNotification(
  bookingData: any
): Promise<void> {
  // Send to customer
  const customerTemplate = emailTemplates.newBooking(bookingData);
  await sendEmail(
    bookingData.customerEmail,
    customerTemplate.subject,
    customerTemplate.html,
    customerTemplate.text
  );

  // Send to admin
  const adminTemplate = emailTemplates.adminNewBooking(bookingData);
  await sendEmail(
    process.env.NEXT_PUBLIC_APP_EMAIL || "admin@driveaway.com",
    adminTemplate.subject,
    adminTemplate.html,
    adminTemplate.text
  );
}

export async function sendBookingCompletedNotification(
  bookingData: any
): Promise<void> {
  const template = emailTemplates.bookingCompleted(bookingData);
  await sendEmail(
    bookingData.customerEmail,
    template.subject,
    template.html,
    template.text
  );
}

export async function sendBookingReminderNotification(
  bookingData: any
): Promise<void> {
  const template = emailTemplates.bookingReminder(bookingData);
  await sendEmail(
    bookingData.customerEmail,
    template.subject,
    template.html,
    template.text
  );
}
