export function paymentSuccessTemplate(
  fullName: string,
  amount: string,
  successUrl: string,
  supportEmail: string,
  logoUrl: string,
): string {
  const optimizedLogoUrl = logoUrl.includes('cloudinary')
    ? logoUrl.replace('/upload/', '/upload/w_200,h_80,c_fit/')
    : logoUrl;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Successful</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f7fa">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff"
          style="border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 20px; text-align: left;">
              <img src="${optimizedLogoUrl}" alt="DevFest Logo" style="max-width: 150px; height: auto; display: block;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
              <p>Hi <strong>${fullName}</strong>,</p>
              <p>Thank you! Your payment of <strong>₦${amount}</strong> for <strong>DevFest Ibadan ${new Date().getFullYear()}</strong> was successful.</p>
              <p>You can access your ticket and event details here:</p>
              <p style="margin-top: 20px; text-align: center;">
                <a href="${successUrl}" 
                  style="background: #28a745;
                         color: #ffffff; 
                         text-decoration: none; 
                         padding: 12px 20px; 
                         border-radius: 4px; 
                         display: inline-block; 
                         font-weight: bold;">
                  View Ticket
                </a>
              </p>
              <p>If you have questions, reach out to us at 
                <a href="mailto:${supportEmail}" style="color: #007BFF; text-decoration: none;">
                  ${supportEmail}
                </a>.
              </p>
              <p>Cheers,<br/>— The DevFest Ibadan Team</p>
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
