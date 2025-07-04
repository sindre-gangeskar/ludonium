import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

declare module "next-auth" {
	interface Session {
		guilds?: unknown;
		guild: { id: string; name: string };
		discordServer: string;
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
			if (account?.access_token) token.access_token = account?.access_token;
			return token;
		},

		async session({ session, token }) {
			const data = await fetch("https://discord.com/api/users/@me/guilds", { headers: { Authorization: `Bearer ${token.access_token}` } });
			session.guilds = await data.json();

			if (Array.isArray(session.guilds)) {
				session.guilds = session.guilds.map(guild => ({ name: guild.name, id: guild.id }));
				session.guild = (session.guilds as Array<{ name: string; id: string }>).find(guild => guild.id === process.env.DISCORD_SERVER_ID) ?? { id: "", name: "" };
			}
			return session;
		},
	},
});
