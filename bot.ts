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
	client.login(token);

	client.on("messageReactionAdd", async (reaction, user) => {
		try {
			if (reaction && reaction.message.id) {
				const messageId = reaction.message.id;
				const giveaway = await GiveawayService.getByMessageId(messageId);
				if (giveaway && reaction.message.id === giveaway.messageId) await ParticipantService.create(giveaway.id, user.id);
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	});
	client.on("messageReactionRemove", async (reaction, user) => {
		try {
			if (reaction && reaction.message.id) {
				const giveaway = await GiveawayService.getByMessageId(reaction.message.id);

				if (giveaway && reaction.message.id === giveaway.messageId) {
					await ParticipantService.delete(giveaway.id, user.id);
					const message = reaction.message;

					for (const [, reaction] of message.reactions.cache) {
						const reacted = await reaction.users.fetch().then(users => users.has(user.id));
						if (reacted) await reaction.users.remove(user.id);
					}
				}
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	});

	return client;
}
