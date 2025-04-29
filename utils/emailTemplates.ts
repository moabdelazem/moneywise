export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome to MoneyWise! 🚀",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Welcome to MoneyWise, ${name}!</h1>
        <p>Thank you for joining our community of smart financial planners.</p>
        <p>Get started by:</p>
        <ul>
          <li>Setting up your first budget</li>
          <li>Adding your accounts</li>
          <li>Exploring our financial insights</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
      </div>
    `,
  }),

  loginAlert: (email: string) => ({
    subject: "New Login to Your MoneyWise Account",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Login Detected</h2>
        <p>We detected a new login to your MoneyWise account.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p>Email: ${email}</p>
        <p>If this wasn't you, please contact our support team immediately.</p>
      </div>
    `,
  }),

  reportExport: (name: string) => ({
    subject: "Your MoneyWise Report is Ready!",
    html: `
      <div style=\"font-family: Arial, sans-serif; padding: 20px;\">
        <h2>Hi ${name},</h2>
        <p>Your requested financial report has been generated and is attached to this email.</p>
        <p>If you did not request this report, please contact our support team.</p>
        <p>Thank you for using MoneyWise!</p>
      </div>
    `,
  }),
};
