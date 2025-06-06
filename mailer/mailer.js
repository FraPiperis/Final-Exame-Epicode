// utils/mailer.js
import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'
dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: process.env.SENDER_EMAIL, // Email verificata su SendGrid
    subject,
    text,
    html,
  }

  try {
    await sgMail.send(msg)
    console.log('Email inviata correttamente')
  } catch (error) {
    console.error('Errore nell’invio dell’email:', error)
    if (error.response) {
      console.error(error.response.body)
    }
  }
}
