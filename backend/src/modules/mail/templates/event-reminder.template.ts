export function eventReminderTemplate(
  fullName: string,
  eventDate: string,
  locationAddress: string,
  startTime: string,
  supportEmail: string,
  logoUrl: string,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Event Reminder</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f7fa">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" 
               style="border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          
          <!-- Header with Logo (Left aligned) -->
          <tr>
            <td style="padding: 20px; text-align: left;">
              <img src="${logoUrl}" alt="Event Logo" style="max-height: 50px; display: block;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6; text-align: center;">
              <h2 style="margin-top: 0; color: #007BFF;">DevFest Ibadan 2025 Kicks Off Tomorrow!</h2>
              <p>Hi <strong>${fullName}</strong>,</p>
              <p>We're thrilled to have you joining us! Here's a quick reminder of your event details:</p>
              <p style="font-size: 16px; line-height: 1.8;">
                📅 <strong>Date:</strong> ${eventDate}<br/>
                📍 <strong>Venue:</strong> ${locationAddress}<br/>
                🕘 <strong>Time:</strong> ${startTime}
              </p>
              <p>✨ Be ready to learn, connect, and have fun with fellow developers!</p>
              <p>Need help? Reach out at 
                <a href="mailto:${supportEmail}" style="color: #007BFF; text-decoration: none;">
                  ${supportEmail}
                </a>
              </p>
              <p>See you tomorrow!<br/>— The DevFest Ibadan Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#f1f3f4" style="padding: 20px; text-align: center; font-size: 12px; color: #888888;">
              &copy; ${new Date().getFullYear()} DevFest Ibadan. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
