import nodemailer, { createTransport } from "nodemailer";
import { IEmailProvider, SmtpConfig } from "../@types/service.interface";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Config from "../config/config";

class NodemailerEmailService extends IEmailProvider {
  private readonly transporter!: nodemailer.Transporter;
  private readonly smtpConfig: SmtpConfig;

  constructor() {
    super();
    const { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } = Config;

    const smtpConfig: SmtpConfig = {
      email: NODEMAILER_EMAIL,
      password: NODEMAILER_PASSWORD,
      from: "Task Management",
      domain: "gmail",
      smtpHost: "smtp.gmail.com",
      smtpPort: 465,
    };
    this.smtpConfig = smtpConfig;

    const smtpConfiguration: SMTPTransport.Options = {
      auth: {
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_PASSWORD,
      },
      service: "gmail",
    };

    this.transporter = createTransport(smtpConfiguration);
  }

  async sendEmail(
    payload: {
      recipient: string | string[];
      from?: string | undefined;
      subject: string;
      body: string;
    },
    isTemplate: boolean | undefined = false
  ): Promise<void> {
    try {
      // Determine whether the body should be sent as HTML or plain text

      const { recipient, subject, body, from } = payload;

      const key = isTemplate ? "html" : "text";

      const to = Array.isArray(recipient) ? recipient.join(",") : recipient;

      // Create email data object
      const data = {
        from: this.smtpConfig.email,
        to: from ? this.smtpConfig.email : to, // Recipient(s) email address(es)
        subject: subject, // Subject of the email
        sender: this.smtpConfig.email, // Sender email for authentication purposes
        [key]: body, // Body of the email, either as HTML or plain text
      };

      // Send the email using the configured transporter
      await this.transporter.sendMail(data);

      // Log successful email sending
      console.info(`Email sent to ${recipient} with subject '${subject}'`);
    } catch (error) {
      // Log the error and throw a new error with a message
      console.error("Error sending email:", error);
    }
  }
}

export const nodemailerEmailService = new NodemailerEmailService();
