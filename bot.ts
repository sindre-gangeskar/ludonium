import { Client, GatewayIntentBits, Partials } from "discord.js";
import GiveawayService from "./lib/services/GiveawayService";
import ParticipantService from "./lib/services/ParticipantService";

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) throw new Error("Missing Discord Bot Token environment variable");

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
});

client.on("ready", async () => {
	console.log("Discord Bot is ready");
	await checkGiveawaysInterval(0.25);
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

async function checkGiveawaysInterval(intervalInMinutes: number = 5) {
	const timeInMinutes: number = 1000 * 60 * intervalInMinutes;
	let pending = false;
	setInterval(async () => {
		if (pending) return;
		pending = true;
		await GiveawayService.checkGiveaways();
		pending = false;
	}, timeInMinutes);
}

export default client;