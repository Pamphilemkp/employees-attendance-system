import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import {dbConnect} from '../../../../lib/dbConnect';
import User from '../../../../models/User';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        console.log('Original Password:', credentials.password);
        console.log('Hashed Password from DB:', user.password);

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        console.log('Password match result:', isMatch);

        if (isMatch) {
          return { id: user._id, name: user.name, email: user.email, role: user.role };
        } else {
          return null;
        }
      }
    })
  ],
  session: {
    jwt: true,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
