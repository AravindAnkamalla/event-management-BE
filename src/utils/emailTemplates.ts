// emailTemplates.ts

export const createAccountCreatedEmailTemplate = (
  username: string,
  email: string,
  password: string
) => {
  return {
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Account Created - Event Team</title><style>body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
.container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.header { text-align: center; margin-bottom: 30px; }
.logo { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
.title { color: #1f2937; font-size: 24px; margin-bottom: 20px; }
.footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }</style></head><body>
<div class="container"><div class="header">
<div class="logo">Event Team</div>
<h1 class="title">Welcome, ${username}!</h1></div>
<div class="content">
<p>Your account has been created successfully.</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Password:</strong> ${password}</p>
<p>You can log in using the following link:</p>
<p>If you did not request this account, please ignore this email.</p>
<p>Best regards,<br><strong>The Event Team</strong></p></div>
<div class="footer">
<p>This email was sent because an account was created for you on Event Team.</p></div></div>
</body></html>`,
    text: `Welcome, ${username}!

Your account has been created successfully.

Email: ${email}
Password: ${password}


If you did not request this account, please ignore this email.

Best regards,
The Event Team`,
  };
};

export const createOtpEmailTemplate = (
  username: string,
  otp: string,
  expirationMinutes: number = 10
) => {
  return {
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Password Reset - Event Team</title><style>body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
.container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.header { text-align: center; margin-bottom: 30px; }
.logo { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
.title { color: #1f2937; font-size: 24px; margin-bottom: 20px; }
.otp-container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0; }
.otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; font-family: 'Courier New', monospace; }
.warning-box { background-color: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 15px; border-radius: 6px; margin: 20px 0; }
.footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }</style></head><body>
<div class="container"><div class="header">
<div class="logo">Event Team</div>
<h1 class="title">Password Reset Request 🔐</h1></div>
<div class="content">
<p>Hello ${username},</p>
<p>We received a request to reset your password. Use the verification code below:</p>
<div class="otp-container">
<p>Your verification code is:</p>
<div class="otp-code">${otp}</div>
<p>This code expires in ${expirationMinutes} minutes</p>
</div>
<div class="warning-box">
<strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
</div>
<ul>
<li>Never share this code with anyone</li>
<li>Event Team will never ask for your code via phone or email</li>
<li>This code can only be used once</li>
</ul>
<p>If you continue to have trouble, please contact our support team.</p>
<p>Best regards,<br><strong>The Event Team</strong></p></div>
<div class="footer">
<p>This email was sent because a password reset was requested.</p></div></div>
</body></html>`,
    text: `Password Reset Request - Event Team

Hello ${username},

We received a request to reset your password. Use the verification code below:

Your verification code is: ${otp}

This code expires in ${expirationMinutes} minutes.

SECURITY NOTICE: If you didn't request this password reset, please ignore this email.

For your security:
- Never share this code with anyone
- Event Team will never ask for your code via phone or email
- This code can only be used once

If you continue to have trouble, contact our support.

Best regards,
The Event Team`,
  };
};
