import { Client, GatewayIntentBits, Partials } from "discord.js";
import GiveawayService from "./lib/services/GiveawayService";
import ParticipantService from "./lib/services/ParticipantService";
import { getDiscordVariables } from "./lib/utils/server";

const { token, giveawayChannelId, giveawayEmoji } = getDiscordVariables();

const client = new Client({
	intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions ],
	partials: [ Partials.Message, Partials.Channel, Partials.Reaction, Partials.User ],
});

client.on("ready", async () => {
	console.log("Discord Bot is ready");
	await checkGiveawaysInterval(10);
});
client.login(token);

client.on("messageReactionAdd", async (reaction, user) => {
	try {
		if (reaction && reaction.message.id && reaction.message.channelId === giveawayChannelId && reaction.emoji.name === giveawayEmoji.toString()) {
			await GiveawayService.addParticipant(reaction.message.id, user, reaction);
		} else reaction.users.remove(user.id);
	} catch (error) {
		console.error(error);
		return null;
	}
});
client.on("messageReactionRemove", async (reaction, user) => {
	try {
		const giveaway = await GiveawayService.getByMessageId(reaction.message.id);
		if (!giveaway) return;

		if (reaction.message.id === giveaway.messageId) {
			await ParticipantService.delete(giveaway.id, user.id);
			await reaction.users.remove(user.id);
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