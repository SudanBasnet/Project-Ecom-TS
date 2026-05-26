import ENV_CONFIG from "../config/env.config";
import transporter from "../config/nodemailer.config";

export const sendEmail = async () => {
  try {
    await transporter.sendMail({
      to: "sudanbasnet56@gmail.com",
      from: `project Ecommerce <${ENV_CONFIG.smtp_user}>`,
      subject: "Welcome to Ecom",
      text: "login Successful. Welcome to Ecom",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
