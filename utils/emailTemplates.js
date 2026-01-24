const getBaseStyles = () => `
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f6f8; }
  .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .header { background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%); padding: 30px; text-align: center; } /* Lighter gradient */
  .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
  .content { padding: 40px 30px; color: #475569; }
  .otp-box { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0; font-weight: bold; letter-spacing: 2px; font-size: 24px; color: #334155; }
  .btn { display: inline-block; background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%); color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; text-align: center; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4); }
  .btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  .footer a { color: #6366f1; text-decoration: none; }
  p { margin-bottom: 15px; font-size: 16px; }
  ul { padding-left: 20px; margin-bottom: 20px; }
  li { margin-bottom: 10px; }
`;

const getVerificationEmailTemplate = (url, name) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Your Email</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:logo" alt="Note Genius" style="height: 50px; width: auto;">
    </div>
    <div class="content">
      <h2>Hello ${name || 'User'},</h2>
      <p>Welcome to <strong>Note Genius</strong>! We're excited to have you on board. To get started, please verify your email address by clicking the button below.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" class="btn">Verify Email Address</a>
      </div>

      <p style="font-size: 14px; color: #64748b;">Or copy and paste this link into your browser:<br>
      <a href="${url}" style="color: #6366f1; word-break: break-all;">${url}</a></p>
      
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account with us, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Note Genius. All rights reserved.</p>
      <p>123 AI Street, Tech City, TC 90210</p>
    </div>
  </div>
</body>
</html>
    `;
};

const getPasswordResetEmailTemplate = (url, name) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:logo" alt="Note Genius" style="height: 50px; width: auto;">
    </div>
    <div class="content">
      <h2>Hello ${name || 'User'},</h2>
      <p>We received a request to reset your password for your Note Genius account.</p>
      
      <p>Click the button below to proceed with setting a new password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" class="btn">Reset Password</a>
      </div>

      <p style="font-size: 14px; color: #64748b;">Or copy and paste this link into your browser:<br>
      <a href="${url}" style="color: #6366f1; word-break: break-all;">${url}</a></p>
      
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Note Genius. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
};

module.exports = {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate
};
