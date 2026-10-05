import { betterAuth } from "better-auth";
import { env } from "../config/env.js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../config/infra/db/prisma.js";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }
  },
  trustedOrigins: ["http://localhost:3001"],

  emailAndPassword: {
    enabled: true,
  },
});