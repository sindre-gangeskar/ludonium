import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { GuildProps } from "./lib/definitions";
import axios from "axios";
declare module "next-auth" {
	interface Session {
		user: { id: string }
		isMemberOfGuild: boolean;
		name: string;
		icon: string;
		guild: { id: string; name: string; icon?: string };
		role?: string;
		isAdmin?: boolean;
	}
}
export const { handlers, signIn, signOut, auth } = NextAuth({
	secret: process.env.AUTH_SECRET,
	providers: [
		Discord({
			clientId: process.env.AUTH_DISCORD_ID!,
			clientSecret: process.env.AUTH_DISCORD_SECRET!,
			authorization: { params: { scope: "identify guilds" } },
		}),
	],
	session: {strategy: 'jwt'},
	callbacks: {
		async jwt({ token, account }) {
			/* Initial login */
			if (account && account.providerAccountId) {
				token.userId = account?.providerAccountId;
			}

			if (account && account.access_token) {
				token.access_token = account.access_token;
				/* Get guilds the user is a member of and check to see if the user is a member of the guild by id defined in the env variable. */
				const data = await axios.get("https://discord.com/api/users/@me/guilds", { headers: { Authorization: `Bearer ${account.access_token}` } });
				const guilds = data.data;
				if (Array.isArray(guilds)) token.isMemberOfGuild = guilds.some((guild: GuildProps) => guild.id === process.env.DISCORD_GUILD_ID);

				/* Check user for admin role */
				if (account.providerAccountId) {
					const url = `${process.env.DISCORD_SERVER_URL}/verify-admin-role/${account.providerAccountId}`;
					const response = await axios.get(url);
					if (response.data.data.isAdmin) token.isAdmin = response.data.data.isAdmin;
				}
			}

			return token;
		},
		async session({ session, token }) {
			if (token.userId && session.user) session.user.id = String(token.userId);

			session.isAdmin = Boolean(token.isAdmin);
			session.isMemberOfGuild = Boolean(token.isMemberOfGuild);
			return session;
		},
	},
});