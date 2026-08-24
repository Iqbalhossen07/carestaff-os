import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userType: string;
      careHomeId: string;
      role?: any;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    userType: string;
    careHomeId: string;
    role?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userType: string;
    careHomeId: string;
    role?: any;
  }
}
