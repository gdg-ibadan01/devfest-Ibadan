function getDateString(date: Date) {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();

  const getOrdinalSuffix = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return `${dayName}, ${monthName} ${day}${getOrdinalSuffix(day)}, ${year}`;
}

export type TicketConfirmationEmailTemplatePayload = {
  fullName: string;
  eventDate: Date;
  ticketCode: string;
  supportEmail: string;
  ticketDownloadUrl: string;
  logoUrl: string;
  email: string;
};

export function ticketConfirmationTemplate(
  payload: TicketConfirmationEmailTemplatePayload,
) {
  const {
    fullName,
    eventDate,
    ticketCode,
    supportEmail,
    ticketDownloadUrl,
    logoUrl,
  } = payload;
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
                Your DevFest Ibadan ${eventDate.getFullYear()} Ticket is Confirmed! 🎉
              </h2>

              <p>Hi <strong>${fullName}</strong>,</p>
              <p>Congratulations, your ticket for <strong>DevFest Ibadan ${eventDate.getFullYear()}</strong> is confirmed! 🚀</p>

              <p>We’re thrilled you’ll be joining us on <strong>${getDateString(eventDate)}</strong>, for a full-day conference experience celebrating innovation, knowledge-sharing, and community building.</p>

              <p><strong>Here’s what you can expect:</strong></p>
              <ul style="line-height: 1.6;">
                <li>✨ Inspiring talks and panel sessions with startup founders, engineers, and global tech leaders</li>
                <li>✨ Engaging conversations around responsible AI and the future of technology</li>
                <li>✨ Networking with thousands of professionals, students, and innovators from Ibadan, Oyo State, and beyond</li>
                <li>✨ A chance to connect with the ecosystem driving impact locally and internationally</li>
              </ul>

             <p><strong>Event venue:</strong> <a target="_blank" href="https://maps.app.goo.gl/hBjb2mAqDwbhtLe1A">Kakanfo Inn & Conference Centre,
1 Nihinlola Street, MKO Abiola Way, off Joyce 'B' Road, New Gra, Ibadan 200252, Oyo State.</a></p>

             <p><strong>Time:</strong> 9am prompt</p>

              <p style="line-height: 1.8;">
              <strong>Ticket code:</strong> <code>${ticketCode}</code><br/>
              </p>

              <p><strong>✅ Next steps:</strong></p>
              <ul style="line-height: 1.6;">
                <li><a href=${ticketDownloadUrl} target="_blank">Download your ticket</a> and keep it safe.</li>
                <li>Join the GDG Ibadan community →
                  <a href="https://gdg.community.dev/gdg-ibadan/" style="color:#007BFF; text-decoration:none;">
                    gdg.community.dev/gdg-ibadan
                  </a>
                </li>
                <li>Save the date — ${getDateString(eventDate)}.</li>
              </ul>

              <p>We can’t wait to welcome you to DevFest Ibadan ${eventDate.getFullYear()} — come ready to learn, connect, and be inspired 🎉.</p>

              <p>Need help? Contact us at
                <a href="mailto:${supportEmail}" style="color:#007BFF; text-decoration:none;">
                  ${supportEmail}
                </a>
              </p>

              <p>We can't wait to have you,<br/>GDG Ibadan Team</p>
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
