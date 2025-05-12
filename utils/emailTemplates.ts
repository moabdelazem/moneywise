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

  paymentReminder: (
    name: string,
    reminder: {
      title: string;
      amount: number;
      dueDate: Date;
      category: string;
      daysUntilDue: number;
    }
  ) => {
    const formattedAmount = reminder.amount.toFixed(2);
    const formattedDate = new Date(reminder.dueDate).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    let urgencyColor = "#2563EB"; // Blue for normal
    let urgencyText = "Upcoming";

    if (reminder.daysUntilDue <= 1) {
      urgencyColor = "#EF4444"; // Red for urgent (today or tomorrow)
      urgencyText =
        reminder.daysUntilDue === 0 ? "Due Today!" : "Due Tomorrow!";
    } else if (reminder.daysUntilDue <= 3) {
      urgencyColor = "#F59E0B"; // Amber for soon
      urgencyText = "Due Soon";
    }

    return {
      subject: `${urgencyText}: ${reminder.title} Payment Due ${
        reminder.daysUntilDue === 0
          ? "Today"
          : `in ${reminder.daysUntilDue} days`
      }`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #111827; font-size: 24px; margin-bottom: 4px;">Payment Reminder</h1>
            <div style="background-color: ${urgencyColor}; color: white; padding: 8px 16px; border-radius: 16px; display: inline-block; font-weight: bold;">
              ${urgencyText}
            </div>
          </div>
          
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <h2 style="color: #111827; font-size: 20px; margin-top: 0;">${
              reminder.title
            }</h2>
            <div style="display: flex; margin-bottom: 12px;">
              <div style="width: 50%; color: #4b5563;">Amount</div>
              <div style="width: 50%; font-weight: bold; color: #111827;">$${formattedAmount}</div>
            </div>
            <div style="display: flex; margin-bottom: 12px;">
              <div style="width: 50%; color: #4b5563;">Due Date</div>
              <div style="width: 50%; font-weight: bold; color: #111827;">${formattedDate}</div>
            </div>
            <div style="display: flex;">
              <div style="width: 50%; color: #4b5563;">Category</div>
              <div style="width: 50%; font-weight: bold; color: #111827;">${
                reminder.category
              }</div>
            </div>
          </div>
          
          <p style="color: #4b5563; margin-bottom: 24px;">
            Hi ${name}, this is a friendly reminder about your upcoming payment. 
            ${
              reminder.daysUntilDue === 0
                ? "This payment is due <strong>today</strong>."
                : `This payment is due in <strong>${reminder.daysUntilDue} days</strong>.`
            }
          </p>
          
          <div style="text-align: center;">
            <a href="https://moneywise.example.com/dashboard" style="background-color: #2563EB; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: bold;">
              View in Dashboard
            </a>
          </div>
          
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
            <p>MoneyWise - Your Personal Finance Assistant</p>
            <p>If you would like to modify your notification settings, please visit your profile settings.</p>
          </div>
        </div>
      `,
    };
  },
};
