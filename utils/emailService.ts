import nodemailer from "nodemailer";
import { config } from "../config";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        html,
      });
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }
}

export const emailService = new EmailService();
