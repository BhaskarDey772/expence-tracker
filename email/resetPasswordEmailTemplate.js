
module.exports = (resetToken, userName) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #dddddd;
            }
            .header h1 {
                color: #007bff;
                margin: 0;
            }
            .content {
                margin: 20px 0;
            }
            .reset-link {
                display: block;
                margin: 20px 0;
                text-align: center;
            }
            .reset-link a {
                background-color: #007bff;
                color: #ffffff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #dddddd;
                text-align: center;
                color: #999999;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <p>Hi ${userName},</p>
                <p>We received a request to reset your password for your expense tracker account. You can reset your password by clicking the link below:</p>
                <div class="reset-link">
                    <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Your Password</a>
                </div>
                <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
            </div>
            <div class="footer">
                <p>Thank you for using our expense tracker app!</p>
                <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`
}
