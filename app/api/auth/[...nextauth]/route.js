import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../../lib/mongoose';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin'
  },
  session: {
    jwt: true
  },
  secret: process.env.NEXTAUTH_SECRET
};

// Correctly export both GET and POST handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
