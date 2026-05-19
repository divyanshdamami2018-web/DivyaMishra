const nodemailer = require("nodemailer");

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

// Wraps plain text in a professional HTML email template
const buildHtml = (subject, body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f2;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2a5b46 0%,#1e4434 100%);padding:40px 48px;text-align:center;">
              <p style="margin:0;font-size:13px;color:#a3d4bc;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Mental Health with</p>
              <h1 style="margin:8px 0 0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Divya Mishra</h1>
              <p style="margin:6px 0 0;font-size:12px;color:#a3d4bc;letter-spacing:1px;">Counseling Psychologist</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:48px;color:#374151;">
              <pre style="margin:0;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.8;white-space:pre-wrap;color:#374151;">${body.replace(/\*/g, '')}</pre>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8faf9;padding:24px 48px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">This is an automated message from Mental Health with Divya Mishra.</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">📧 dpsychologist01@gmail.com &nbsp;|&nbsp; 📞 +91 99298 14206</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Mental Health with Divya Mishra" <${process.env.EMAIL}>`,
      to,
      subject,
      text: text.replace(/\*/g, ""), // plain text fallback (strip markdown bold)
      html: buildHtml(subject, text),
    });
    console.log(`Email sent to ${to}:`, info.response);
    return info;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message);
    throw error;
  }
};

module.exports = sendEmail;
