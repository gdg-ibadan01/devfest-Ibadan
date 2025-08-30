export function paymentFailedTemplate(
  fullName: string,
  retryLink: string,
  supportEmail: string,
  logoUrl: string,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Failed</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f7fa">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff"
          style="border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          
          <!-- Header with DevFest Colors -->
          <tr>
            <td style="padding: 20px; text-align: center; 
              background: linear-gradient(90deg, #4285F4, #DB4437, #F4B400, #0F9D58);">
              <img src="${logoUrl}" alt="GDG Logo"
                style="max-width: 150px; display: block; margin: 0 auto 10px auto;" />
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: normal;">
                Payment Failed
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.5;">
              <p>Hi <strong>${fullName}</strong>,</p>
              <p>Unfortunately, your payment for <strong>DevFest Ibadan 2025</strong> wasn't successful.</p>
              <p>No worries — you can try again using the button below:</p>
              <p style="margin-top: 20px; text-align: center;">
                <a href="${retryLink}" 
                  style="background: linear-gradient(90deg, #4285F4, #DB4437, #F4B400, #0F9D58);
                  color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 4px; display: inline-block;">
                  Retry Payment
                </a>
              </p>
              <p>If you need assistance, reach out to us at 
                <a href="mailto:${supportEmail}" style="color: #DB4437;">${supportEmail}</a>.
              </p>
              <p>Cheers,<br/>— The DevFest Ibadan Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#f1f3f4" style="padding: 20px; text-align: center; font-size: 12px; color: #888888;">
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
