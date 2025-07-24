import { Client, GatewayIntentBits, Partials } from "discord.js";
import GiveawayService from "./lib/services/GiveawayService";
import ParticipantService from "./lib/services/ParticipantService";

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) throw new Error("Missing Discord Bot Token environment variable");

export default function DiscordBot() {
	const client = new Client({
		intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions],
		partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
	});
	client.on("ready", () => {
		console.log("Discord Bot is ready");
	});
	client.login(process.env.DISCORD_BOT_TOKEN);

	client.on("messageReactionAdd", async (reaction, user) => {
		try {
			if (reaction && reaction.message.id) {
				const messageId = reaction.message.id;
				console.log(messageId);
				const giveaway = await GiveawayService.getByMessageId(messageId);
				if (reaction.message.id === giveaway.messageId) {
					await ParticipantService.create(giveaway.id, user.id);
					console.info(`User ${user.id} has entered giveaway ID: ${giveaway.id}`);
				}
			}
		} catch (error) {
			console.error(error);
		}
	});

	return client;
}
