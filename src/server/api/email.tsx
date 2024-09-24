import sendMail from "../../../emails";
import UserWelcome from "../../../emails/UserWelcome";
import VerifyEmail from "../../../emails/MagicLinkEmail";

export const sendWelcomeEmail = async (firstName: string, email: string) => {
  await sendMail({
    subject: "Welcome to generate.fitness",
    to: email,
    component: <UserWelcome firstName={firstName} />,
  });
};

export const sendVerificationEmail = async (email: string, url: string) => {
  await sendMail({
    subject: "Your generate.fitness magic link",
    to: email,
    component: <VerifyEmail url={url} />,
  });
};
