\
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add your custom property id
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string; // Add your custom property id
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    sub?: string; // Ensure sub is typed, as it will hold the user ID
    id?: string; // Or if you prefer to use id directly on the token
  }
}
