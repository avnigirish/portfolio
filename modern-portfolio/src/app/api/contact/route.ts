import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Use App Password for Gmail
      },
    })

    // Email to you (notification)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'avni123.girish@gmail.com',
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">New Contact Form Submission</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e0e7ff; border-radius: 8px;">
            <p style="margin: 0; color: #4338ca; font-size: 14px;">
              This message was sent from your portfolio contact form.
            </p>
          </div>
        </div>
      `,
    }

    // Auto-reply to sender
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Avni Girish',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">Thank you for reaching out!</h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for contacting me through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Connect with me on <a href="https://www.linkedin.com/in/avni-girish/" style="color: #8b5cf6;">LinkedIn</a></li>
            <li>Check out my projects on <a href="https://github.com/avnigirish" style="color: #8b5cf6;">GitHub</a></li>
            <li>View my <a href="${process.env.NEXT_PUBLIC_APP_URL}/resume.pdf" style="color: #8b5cf6;">resume</a></li>
          </ul>
          
          <p>Best regards,<br>
          <strong>Avni Girish</strong><br>
          Computer Science & Cognitive Science Student<br>
          Rutgers University</p>
          
          <div style="margin-top: 30px; padding: 15px; background: #e0e7ff; border-radius: 8px;">
            <p style="margin: 0; color: #4338ca; font-size: 14px;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    }

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(autoReplyOptions)
    ])

    // Log the contact for analytics (you can later store this in a database)
    console.log('Contact form submission:', {
      timestamp: new Date().toISOString(),
      name,
      email,
      subject,
      messageLength: message.length,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! You should receive a confirmation email shortly.'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again or contact me directly at avni123.girish@gmail.com',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
