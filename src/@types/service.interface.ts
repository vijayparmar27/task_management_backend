// Define the configuration interface for SMTP
export interface SmtpConfig {
  email: string;
  password: string;
  from: string;
  domain: string;
  smtpPort: number;
  smtpHost: string;
}

export abstract class IEmailProvider {
  abstract sendEmail(
    payload: {
      recipient: string | string[];
      from?: string | undefined;
      subject: string;
      body: string;
    },
    isTemplate: boolean | undefined
  ): Promise<void>;
}
