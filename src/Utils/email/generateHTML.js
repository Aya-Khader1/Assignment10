export const template = (code,username,subject) =>`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color:#0f0f1a; font-family: 'Helvetica Neue', Arial, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a; padding:50px 0;">
    <tr>
      <td align="center">

        <!-- Email container -->
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#1a1a2e 0%, #16161f 100%); border-radius:16px; overflow:hidden; border:1px solid #2a2a3d;">

          <!-- Header with gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#d4af37 0%, #f5d76e 50%, #d4af37 100%); padding:3px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#16161f; padding:36px 40px; text-align:center;">
                    <div style="display:inline-block; width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#d4af37,#f5d76e); margin-bottom:14px; line-height:56px; text-align:center;">
                      <span style="color:#16161f; font-size:24px; font-weight:700;">★</span>
                    </div>
                    <h1 style="color:#f5d76e; font-size:22px; margin:0; font-weight:600; letter-spacing:1px;">${username}</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 40px 32px 40px;">
              <h2 style="color:#ffffff; font-size:20px; margin:0 0 14px 0; text-align:center; font-weight:600;">Your Verification Code</h2>
              <p style="color:#9b9bb0; font-size:14px; line-height:1.8; margin:0 0 32px 0; text-align:center;">
                Hi there, use the code below to complete your verification.<br>
                It's valid for <strong style="color:#f5d76e;">10 minutes</strong> only.
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 28px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:linear-gradient(135deg,#d4af37,#f5d76e); padding:2px; border-radius:12px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background-color:#1a1a2e; border-radius:10px; padding:20px 44px;">
                                <span style="font-size:34px; letter-spacing:10px; font-weight:700; color:#ffffff; font-family:'Courier New',monospace;">${code}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #2a2a3d; padding-top:24px;">
                    <p style="color:#6b6b80; font-size:12.5px; line-height:1.8; margin:0; text-align:center;">
                      If you didn't request this code, you can safely ignore this email.<br>
                      Never share this code with anyone — our team will never ask for it.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px 40px; text-align:center;">
              <p style="color:#4a4a5a; font-size:11.5px; margin:0; letter-spacing:0.5px;">
                © 2026 YOUR APP — All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`