import NextAuth, { type AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID || "",
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "not-used", // Public client doesn't use secret
            issuer: process.env.KEYCLOAK_ISSUER,
            authorization: {
                params: {
                    // PKCE is enabled by default in next-auth for Keycloak
                    scope: "openid profile email",
                },
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            // @ts-ignore - accessToken is not typed in default session
            session.accessToken = token.accessToken;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
