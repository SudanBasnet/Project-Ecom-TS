import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import ENV_CONFIG from "../config/env.config";
import transporter from "../config/nodemailer.config";

type TEmailOption = {
  to: string;
  subject: string;
  html: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: any[];
};

export const sendEmail = async ({
  to,
  subject,
  html,
  attachments,
  cc,
  bcc,
}: TEmailOption) => {
  try {
    const mailOptions: Mail.Options = {
      to,
      from: `Project Ecommerce <${ENV_CONFIG.smtp_user}>`,
      subject,
      html,
    };

    if (cc) {
      mailOptions.cc = cc;
    }

    if (bcc) {
      mailOptions.bcc = bcc;
    }

    if (attachments) {
      mailOptions.attachments = attachments;
    }

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    if (previewUrl) {
      console.log("Ethereal preview URL:", previewUrl);
    }

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
