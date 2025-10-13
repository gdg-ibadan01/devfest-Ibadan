export function adminInviteTemplate(
  fullName: string,
  tempPassword: string,
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
  <title>Admin Invitation</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #F1F3F4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F1F3F4">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" 
               style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
          
          <!-- Header with Logo (Left aligned) -->
          <tr>
            <td style="padding: 20px; text-align: left;">
              <img src="${optimizedLogoUrl}" alt="Logo" style="max-width: 150px; height: auto; display: block;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; color: #202124; font-size: 16px; line-height: 1.5;">
              <p>Hi <strong>${fullName}</strong>,</p>
              <p>You have been invited to join as an Admin.</p>
              <p>Please log in with the following temporary password:</p>
              <p style="background-color: #F1F3F4; padding: 12px; font-size: 18px; text-align: center; border-radius: 5px; letter-spacing: 1px; color: #202124;">
                <strong>${tempPassword}</strong>
              </p>
              <p>For security, please change your password immediately after logging in.</p>
              <p style="margin-top: 20px;">
                <a href="https://devfest-ibadan.netlify.app/admin" 
                  style="background: #007BFF;
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
