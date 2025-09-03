export function ticketConfirmationTemplate(
  fullName: string,
  ticketType: string,
  transactionId: string,
  ticketId: string,
  isCheckedIn: boolean,
  supportEmail: string,
  logoUrl: string,
): string {
  const optimizedLogoUrl = logoUrl.replace(
    '/upload/',
    '/upload/w_200,h_80,c_fit/',
  );

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
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 20px; text-align: left;">
              <img src="${optimizedLogoUrl}" alt="DevFest Logo" style="max-height: 50px; display: block;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; text-align: left; font-size: 16px; color: #333;">
              <h2 style="color: #007BFF; margin-top: 0;">
                Your DevFest Ibadan 2025 Ticket is Confirmed! 🎉
              </h2>

              <p>Hi <strong>${fullName}</strong>,</p>
              <p>Congratulations, your ticket for <strong>DevFest Ibadan 2025 Saturday Conference</strong> is confirmed! 🚀</p>

              <p>We’re thrilled you’ll be joining us on <strong>Saturday, November 29th, 2025</strong>, for a full-day conference experience celebrating innovation, knowledge-sharing, and community building.</p>

              <p><strong>Here’s what you can expect on Saturday, Nov 29:</strong></p>
              <ul style="line-height: 1.6;">
                <li>✨ Inspiring talks and panel sessions with startup founders, engineers, and global tech leaders</li>
                <li>✨ Engaging conversations around responsible AI and the future of technology</li>
                <li>✨ Networking with thousands of professionals, students, and innovators from Ibadan, Oyo State, and beyond</li>
                <li>✨ A chance to connect with the ecosystem driving impact locally and internationally</li>
              </ul>

              <p><strong>💡 Bonus for you:</strong> As a ticket holder, you’re also welcome to attend our free hands-on workshops on <strong>Friday, November 28th</strong> covering Design, Mobile Development, Frontend & Backend, AI/ML, Cloud, Cybersecurity, Technical Writing, and Product Management.</p>

              <p style="line-height: 1.8;">
              <strong>Ticket ID:</strong> ${ticketId}<br/>
                <strong>Ticket Type:</strong> ${ticketType}<br/>
                <strong>Reference:</strong> ${transactionId}<br/>
                <strong>Checked In Status:</strong> ${isCheckedIn ? 'Yes' : 'No'}
              </p>

              <p><strong>✅ Next steps:</strong></p>
              <ul style="line-height: 1.6;">
                <li>Download your ticket and keep it safe.</li>
                <li>Join the GDG Ibadan community → 
                  <a href="https://gdg.community.dev/gdg-ibadan/" style="color:#007BFF; text-decoration:none;">
                    gdg.community.dev/gdg-ibadan
                  </a>
                </li>
                <li>Save the dates — November 28th & 29th, 2025.</li>
              </ul>

              <p>We can’t wait to welcome you to DevFest Ibadan 2025 — come ready to learn, connect, and be inspired 🎉.</p>  

              <p>Need help? Contact us at 
                <a href="mailto:${supportEmail}" style="color:#007BFF; text-decoration:none;">
                  ${supportEmail}
                </a>
              </p>

              <p>Best regards,<br/>GDG Ibadan Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; font-size: 12px; color: #888; background-color: #f1f3f4;">
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
