export function passwordResetTemplate(
  fullName: string,
  resetLink: string,
  supportEmail: string,
  logoUrl: string,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset - GDG Ibadan</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
        background-color: #f4f7f6;
        color: #2d3748;
        -webkit-font-smoothing: antialiased;
      }
      .wrapper {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      }
      .header {
        background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
        padding: 36px 40px;
        text-align: center;
      }
      .header img { height: 48px; margin-bottom: 16px; }
      .header h1 {
        color: #ffffff;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.3px;
      }
      .content {
        padding: 40px 40px 32px;
      }
      .greeting {
        font-size: 17px;
        font-weight: 600;
        color: #1a202c;
        margin-bottom: 16px;
      }
      .body-text {
        font-size: 15px;
        line-height: 1.7;
        color: #4a5568;
        margin-bottom: 16px;
      }
      .cta-wrapper {
        text-align: center;
        margin: 32px 0;
      }
      .cta-button {
        display: inline-block;
        padding: 14px 36px;
        background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.2px;
        box-shadow: 0 4px 12px rgba(26,115,232,0.35);
      }
      .expiry-notice {
        background: #fff8e1;
        border-left: 4px solid #f59e0b;
        padding: 12px 16px;
        border-radius: 0 6px 6px 0;
        font-size: 14px;
        color: #92400e;
        margin: 24px 0;
      }
      .divider {
        border: none;
        border-top: 1px solid #e2e8f0;
        margin: 28px 0;
      }
      .fallback-link {
        font-size: 13px;
        color: #718096;
        word-break: break-all;
        margin-bottom: 8px;
      }
      .fallback-link a { color: #1a73e8; }
      .footer {
        background: #f7f8fa;
        padding: 24px 40px;
        text-align: center;
        border-top: 1px solid #e2e8f0;
      }
      .footer p {
        font-size: 13px;
        color: #a0aec0;
        line-height: 1.6;
        margin-bottom: 4px;
      }
      .footer a { color: #1a73e8; text-decoration: none; }
      @media (max-width: 600px) {
        .wrapper { margin: 0; border-radius: 0; }
        .content, .header, .footer { padding-left: 24px; padding-right: 24px; }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <!-- Header -->
      <div class="header">
        <img src="${logoUrl}" alt="GDG Ibadan Logo" />
        <h1>Password Reset Request</h1>
      </div>

      <!-- Body -->
      <div class="content">
        <p class="greeting">Hi ${fullName},</p>
        <p class="body-text">
          We received a request to reset the password for your GDG Ibadan admin account.
          Click the button below to choose a new password. This link is valid for
          <strong>1 hour</strong>.
        </p>

        <div class="cta-wrapper">
          <a href="${resetLink}" class="cta-button">Reset My Password</a>
        </div>

        <div class="expiry-notice">
          ⏳ This link will expire in <strong>1 hour</strong>. If it expires, you can
          request a new one from the login page.
        </div>

        <p class="body-text">
          If you did not request a password reset, you can safely ignore this email.
          Your password will remain unchanged and no further action is needed.
        </p>

        <hr class="divider" />

        <p class="fallback-link">
          If the button above doesn't work, copy and paste this URL into your browser:<br />
          <a href="${resetLink}">${resetLink}</a>
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a></p>
        <p>© ${new Date().getFullYear()} GDG Ibadan · DevFest Ibadan</p>
        <p>This is an automated message, please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
</html>
  `.trim();
}
