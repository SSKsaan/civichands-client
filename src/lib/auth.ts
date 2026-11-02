import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import type { BetterAuthOptions, Auth } from "better-auth";

let authInstance: Auth<BetterAuthOptions> | null = null;

function createAuth() {
  if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
    throw new Error("MONGODB_URI and DB_NAME are required");
  }
  const client = new MongoClient(process.env.MONGODB_URI!);
  client.connect();

  const options: BetterAuthOptions = {
    database: mongodbAdapter(client.db(process.env.DB_NAME!)),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      maxPasswordLength: 128,
    },
    trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
    plugins: [nextCookies(), jwt()],
  };

  return betterAuth(options);
}

export function getAuth() {
  if (!authInstance) {
    authInstance = createAuth();
  }
  return authInstance;
}

// Direct export for route handler compatibility
export const auth = getAuth();