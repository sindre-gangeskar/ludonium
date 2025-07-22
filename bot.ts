import { Client, GatewayIntentBits, Partials } from "discord.js";

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) throw new Error('Missing Discord Bot Token environment variable');


export default function DiscordBot() {
	const client = new Client({
		intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions],
		partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
	});
	client.on("ready", () => {
		console.log("Discord Bot is ready");
	});
	client.login(process.env.DISCORD_BOT_TOKEN);

	client.on("messageReactionAdd", (reaction, user) => {
		if (reaction.emoji.name === "👍") user.send("You reacted positively to this message");
		else if (reaction.emoji.name === "👎") user.send("You reacted negatively to this message");
	});

  return client;
}
