import { Client, GatewayIntentBits, MessageReaction, PartialMessageReaction, Partials } from "discord.js";
import GiveawayService from "./lib/services/GiveawayService";
import ParticipantService from "./lib/services/ParticipantService";
import { getDiscordVariables } from "./lib/utils/server";

const { token, giveawayChannelId, giveawayEmoji } = getDiscordVariables();

const client = initializeClient();

client.on("messageReactionAdd", async (reaction, user) => {
	try {
		const isBot = client.user?.id === user.id;
		if (isBot) return;

		if (reaction.message.channelId === giveawayChannelId && isRequiredEmoji(reaction))
			await GiveawayService.addParticipant(reaction.message.id, user, reaction);
		else await reaction.users.remove(user.id);
	} catch (error) {
		console.error(error);
		return null;
	}
});
client.on("messageReactionRemove", async (reaction, user) => {
	try {
		const giveaway = await GiveawayService.getByMessageId(reaction.message.id);
		if (!giveaway) return;

		if (reaction.message.id === giveaway.messageId && isRequiredEmoji(reaction))
			await ParticipantService.delete(giveaway.id, user.id);
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
function initializeClient() {
	const client = new Client({
		intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions ],
		partials: [ Partials.Message, Partials.Channel, Partials.Reaction, Partials.User ],
	});

	client.on("clientReady", async () => {
		console.log("Discord Bot is ready");
		await checkGiveawaysInterval(0.5);
	});

	client.login(token);
	return client;
}
function isRequiredEmoji(reaction: PartialMessageReaction | MessageReaction) {
	return (reaction.emoji.id ?? reaction.emoji.name) === giveawayEmoji;
}
export default client;