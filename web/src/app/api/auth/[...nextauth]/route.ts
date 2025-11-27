import NextAuth, { type AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID || "",
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "not-used",
            issuer: process.env.KEYCLOAK_ISSUER,
            authorization: {
                params: {
                    scope: "openid profile email offline_access",
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
                // Initial sign in - store tokens
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 60 * 60 * 1000;
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // Access token has expired, try to refresh it
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            // @ts-ignore - accessToken is not typed in default session
            session.accessToken = token.accessToken;
            // @ts-ignore - error is not typed in default session
            session.error = token.error;
            return session;
        },
    },
};

async function refreshAccessToken(token: any) {
    try {
        const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.KEYCLOAK_CLIENT_ID || '',
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken,
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        console.error('Error refreshing access token', error);
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
