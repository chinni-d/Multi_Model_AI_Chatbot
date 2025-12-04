import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'AI Chatbot <no-reply@chat.dmanikanta.me>'; // Update this with your verified domain

const getHtmlTemplate = (title: string, content: string, buttonText?: string, buttonUrl?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <style>
    /* Reset */
    body, p, h1, div { margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6; -webkit-font-smoothing: antialiased; }
    
    /* Container */
    .wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
    
    /* Content */
    .content { padding: 40px; }
    
    /* Header */
    .header { margin-bottom: 24px; }
    .header h1 { font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.025em; }
    
    /* Body Text */
    .body-text { font-size: 16px; color: #4b5563; margin-bottom: 24px; }
    .body-text p { margin-bottom: 16px; }
    .body-text strong { color: #111827; font-weight: 600; }
    
    /* Button */
    .button-container { margin-top: 32px; margin-bottom: 32px; }
    .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; text-align: center; }
    
    /* Footer */
    .footer { background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 14px; color: #9ca3af; }
    
    /* Dark Mode Overrides (attempt to keep light theme) */
    @media (prefers-color-scheme: dark) {
      body, .wrapper { background-color: #f3f4f6 !important; }
      .container { background-color: #ffffff !important; color: #374151 !important; }
      h1 { color: #111827 !important; }
      p { color: #4b5563 !important; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="content">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="body-text">
          ${content}
        </div>
        ${buttonText && buttonUrl ? `
          <div class="button-container">
            <a href="${buttonUrl}" class="button" target="_blank">${buttonText}</a>
          </div>
        ` : ''}
        <div class="body-text" style="margin-bottom: 0; font-size: 14px; color: #6b7280;">
          <p>Best regards,<br>The AI Chatbot Team</p>
        </div>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} AI Chatbot. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export async function sendPromoteEmail(email: string, name: string) {
  console.log('Attempting to send promote email to:', email);
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing');
    return;
  }
  
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'You have been promoted to Admin',
      html: getHtmlTemplate(
        'Welcome to the Admin Team',
        `<p>Hello <strong>${name}</strong>,</p>
         <p>Congratulations! You have been promoted to an <strong>Administrator</strong> role in the AI Chatbot system.</p>
         <p>You now have full access to the Admin Panel to manage users and view statistics.</p>`,
        'Go to Admin Panel',
        'https://chat.dmanikanta.me/admin'
      )
    });
    console.log('Promote email sent successfully:', data);
  } catch (error) {
    console.error('Failed to send promote email:', error);
  }
}

export async function sendDemoteEmail(email: string, name: string) {
  console.log('Attempting to send demote email to:', email);
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Admin privileges revoked',
      html: getHtmlTemplate(
        'Role Update',
        `<p>Hello <strong>${name}</strong>,</p>
         <p>Your Administrator privileges in the AI Chatbot system have been revoked.</p>
         <p>You are now a regular user and can continue using the chat features.</p>`,
        'Go to Chat',
        'https://chat.dmanikanta.me/'
      )
    });
    console.log('Demote email sent successfully:', data);
  } catch (error) {
    console.error('Failed to send demote email:', error);
  }
}

export async function sendDeleteEmail(email: string, name: string) {
  console.log('Attempting to send delete email to:', email);
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Account Deleted',
      html: getHtmlTemplate(
        'Account Deleted',
        `<p>Hello <strong>${name}</strong>,</p>
         <p>Your account in the AI Chatbot system has been deleted by an administrator.</p>
         <p>If you believe this is an error, please contact our support team.</p>`
      )
    });
    console.log('Delete email sent successfully:', data);
  } catch (error) {
    console.error('Failed to send delete email:', error);
  }
}

export async function sendResetCountsEmail(email: string, name: string) {
  console.log('Attempting to send reset counts email to:', email);
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Usage Counts Reset',
      html: getHtmlTemplate(
        'Usage Limits Reset',
        `<p>Hello <strong>${name}</strong>,</p>
         <p>Good news! Your request and response counts in the AI Chatbot system have been reset by an administrator.</p>
         <p>You can now continue using the service without restrictions.</p>`,
        'Start Chatting',
        'https://chat.dmanikanta.me/'
      )
    });
    console.log('Reset counts email sent successfully:', data);
  } catch (error) {
    console.error('Failed to send reset counts email:', error);
  }
}
