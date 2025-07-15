import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { GuildProps } from "./lib/definitions";
declare module "next-auth" {
	interface Session {
		isMemberOfGuild: boolean;
		name: string;
		userId: string;
		icon: string;
		guild: { id: string; name: string; icon?: string };
	}
}
export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Discord({
			authorization: { params: { scope: "identify guilds" } },
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			if (account && account.providerAccountId) {
				token.userId = account?.providerAccountId;
			}
			return token;
		},

		async session({ session, token }) {
			const data = await fetch("https://discord.com/api/users/@me/guilds", { headers: { Authorization: `Bearer ${token.access_token}` } });
			const guilds = await data.json();

			if (Array.isArray(guilds)) {
				session.isMemberOfGuild = guilds.some((guild: GuildProps) => guild.id === process.env.DISCORD_SERVER_ID);
			}
			
			if (token.userId) {
				session.user.id = String(token.userId);
			}
			return session;
		},
	},
});
