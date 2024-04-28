import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../../../server/api/email";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  events: {
    async createUser(message) {
      message.user.email
        ? await sendWelcomeEmail(
            message.user.name ? message.user.name : "",
            message.user.email
          )
        : null;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    EmailProvider({
      server: "",
      from: "hi@generate.fitness",
      async sendVerificationRequest({ identifier: email, url }) {
        await sendVerificationEmail(email, url);
      },
    }),

    // ...add more providers here
  ],
};
export default NextAuth(authOptions);
