import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { sendEmail } from "@/lib/services/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save contact message to Firestore
    try {
      const contactRef = collection(db, "contactMessages");
      const docRef = await addDoc(contactRef, {
        name: body.name,
        email: body.email,
        phone: body.phone || "",
        subject: body.subject,
        message: body.message,
        status: "new",
        createdAt: Timestamp.now(),
      });

      console.log("Contact message saved:", docRef.id);
    } catch (firestoreError) {
      console.error("Error saving to Firestore:", firestoreError);
      // Continue even if Firestore fails
    }

    // Send email notification to admin
    try {
      const adminEmail =
        process.env.NEXT_PUBLIC_APP_EMAIL || "admin@driveaway.com";
      const subject = `New Contact Message: ${body.subject}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Name</strong></td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${
                body.name
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Email</strong></td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;"><a href="mailto:${
                body.email
              }">${body.email}</a></td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Phone</strong></td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${
                body.phone || "Not provided"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Subject</strong></td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${
                body.subject
              }</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 8px; border: 1px solid #e5e7eb; vertical-align: top;"><strong>Message</strong></td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${
                body.message
              }</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
            Submitted at: ${new Date().toLocaleString()}
          </p>
        </div>
      `;
      const text = `
New Contact Form Submission

Name: ${body.name}
Email: ${body.email}
Phone: ${body.phone || "Not provided"}
Subject: ${body.subject}

Message:
${body.message}

Submitted at: ${new Date().toLocaleString()}
      `;

      await sendEmail(adminEmail, subject, html, text);
      console.log("Admin notification email sent");
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Continue even if email fails
    }

    // Send confirmation email to user
    try {
      const userSubject = "We received your message - Drive Away";
      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank You!</h2>
          <p>Hi ${body.name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          
          <h3>Your Message Details:</h3>
          <p><strong>Subject:</strong> ${body.subject}</p>
          <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
          
          <p style="margin-top: 20px; color: #6b7280;">
            If you have any urgent inquiries, please contact us directly at ${
              process.env.NEXT_PUBLIC_APP_EMAIL
            }
          </p>
        </div>
      `;
      const userText = `
Thank You!

Hi ${body.name},

We have received your message and will get back to you as soon as possible.

Your Message Details:
Subject: ${body.subject}
Submitted on: ${new Date().toLocaleString()}

If you have any urgent inquiries, please contact us directly.
      `;

      await sendEmail(body.email, userSubject, userHtml, userText);
      console.log("User confirmation email sent");
    } catch (userEmailError) {
      console.error(
        "Error sending confirmation email to user:",
        userEmailError
      );
      // Continue even if email fails
    }

    return NextResponse.json(
      {
        message: "Message sent successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
