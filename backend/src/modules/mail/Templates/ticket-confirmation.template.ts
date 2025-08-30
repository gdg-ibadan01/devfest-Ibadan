export function ticketConfirmationTemplate(
  firstName: string,
  eventDate: string,
  venue: string,
  ticketType: string,
  transactionId: string,
  supportEmail: string,
  logoUrl: string,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ticket Confirmation</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f7fa">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff"
          style="border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 20px; text-align: center; font-size: 20px; color: white;
              background: linear-gradient(90deg, #4285F4, #DB4437, #F4B400, #0F9D58);">
              🎟 Ticket Confirmed
            </td>
          </tr>

          <!-- Logo -->
          <tr>
            <td style="padding: 20px; text-align: center;">
              <img src="${logoUrl}" alt="Event Logo" style="max-height: 50px; margin-bottom: 10px;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; text-align: center; font-size: 16px; color: #333;">
              <h2 style="color: #4285F4;">Your DevFest Ibadan 2025 Ticket is Confirmed! 🎉</h2>
              <p>Hi <strong>${firstName}</strong>,</p>
              <p>Your payment for DevFest Ibadan 2025 has been successfully processed. We're excited to welcome you!</p>
              
              <p>
                <strong>Event:</strong> DevFest Ibadan 2025<br/>
                <strong>Date:</strong> ${eventDate}<br/>
                <strong>Venue:</strong> ${venue}<br/>
                <strong>Ticket Type:</strong> ${ticketType}<br/>
                <strong>Reference:</strong> ${transactionId}
              </p>

              <p><strong>💡 What to Expect:</strong><br/>Tech talks, swags, networking, fun!</p>
              <p>Need help? Contact us at <a href="mailto:${supportEmail}" style="color:#DB4437;">${supportEmail}</a></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; font-size: 12px; color: #888; background-color: #f1f3f4;">
              &copy; ${new Date().getFullYear()} GDG Ibadan. All rights reserved.
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
