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
export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
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
			if (account?.access_token) {
				token.access_token = account.access_token;
			}

			if (account && account.access_token) {
				const data = await fetch("https://discord.com/api/users/@me/guilds", { headers: { Authorization: `Bearer ${account.access_token}` } });
				const guilds = await data.json();
				if (Array.isArray(guilds)) token.isMemberOfGuild = guilds.some((guild: GuildProps) => guild.id === process.env.DISCORD_GUILD_ID);
			}

			return token;
		},

		async session({ session, token }) {
			if (token.userId) session.user.id = String(token.userId);

			session.isMemberOfGuild = Boolean(token.isMemberOfGuild);
			return session;
		},
	},
});
