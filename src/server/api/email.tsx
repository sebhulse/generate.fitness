import sendMail from "../../../emails";
import UserWelcome from "../../../emails/UserWelcome";

export const sendWelcomeEmail = async (firstName: string, email: string) => {
  await sendMail({
    subject: "Welcome to generate.fitness",
    to: email,
    component: <UserWelcome firstName={firstName} />,
  });
};
