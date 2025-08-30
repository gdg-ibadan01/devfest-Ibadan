export function adminInviteTemplate(
  fullName: string,
  tempPassword: string,
  logoUrl: string,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Invitation</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #F1F3F4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F1F3F4">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(90deg, #4285F4, #EA4335, #FBBC05, #34A853); padding: 20px; text-align: center;">
              <img src="${logoUrl}" alt="GDG Logo" style="max-width: 150px; display: block; margin: 0 auto 10px auto;" />
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">GDG Event Manager</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px; color: #202124; font-size: 16px; line-height: 1.5;">
              <p>Hi <strong>${fullName}</strong>,</p>
              <p>You have been invited to join <strong>GDG Event Manager</strong> as an Admin.</p>
              <p>Please log in with the following temporary password:</p>
              <p style="background-color: #F1F3F4; padding: 12px; font-size: 18px; text-align: center; border-radius: 5px; letter-spacing: 1px; color: #EA4335;">
                <strong>${tempPassword}</strong>
              </p>
              <p>For security, please change your password immediately after logging in.</p>
              <p style="margin-top: 20px;">
                <a href="https://gdg-event-manager.com/login" 
                  style="background: linear-gradient(90deg, #4285F4 0%, #EA4335 25%, #FBBC05 50%, #34A853 75%, #4285F4 100%);
                         color: #ffffff;
                         text-decoration: none;
                         padding: 12px 20px;
                         border-radius: 4px;
                         display: inline-block;
                         font-weight: bold;
                         letter-spacing: 0.5px;">
                  Log In Now
                </a>
              </p>
              <p>If you did not expect this email, you can safely ignore it.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td bgcolor="#F1F3F4" style="padding: 20px; text-align: center; font-size: 12px; color: #5f6368;">
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
