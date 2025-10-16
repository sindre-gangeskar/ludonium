import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import client from "./bot";
import { DiscordEmbedProps, DiscordMessageProps, ResponseProps } from "./lib/definitions";
import { capitalizeString, getColorFromHexToInt, getDiscordVariables, getGiveawayDurationInLocaleString } from "./lib/utils/server";
import GiveawayService from './lib/services/GiveawayService';

const { guildId, adminRoleId, giveawayChannelId, giveawayEmoji } = getDiscordVariables();
const app = express();

app.use(express.json());

app.post("/create-giveaway", async (req, res, next) => {
	try {
		const channel = await client.channels.fetch(giveawayChannelId);
		const preview = await client.fetchGuildPreview(guildId);

		const { donation, giveaway } = req.body;
		const dateString = getGiveawayDurationInLocaleString(giveaway.deadline);

		if (channel && channel.isTextBased() && channel.isSendable()) {
			const embed: DiscordEmbedProps = {
				color: getColorFromHexToInt("#9500ff"),
				thumbnail: { url: preview.iconURL() ?? "" },
				title: "Community Game Key Giveaway",
				description: "A game key giveaway has started for a donated game!\nMake sure to react to this message to participate in the giveaway!",
				fields: [
					{ name: "Platform", value: capitalizeString(donation.platform.name) },
					{ name: "Region", value: donation.region.name.toUpperCase() },
					{ name: "Giveaway Ends", value: dateString },
					{ name: "Social Permissions", value: "You **must** enable the option to allow other server members to send you a DM in **Social Permissions** in order to be able to receive the key upon winning." },
					{
						name: "Privacy Notice",
						value: `By reacting to this giveaway, you consent to the registration of you as a participant by storing your **Discord ID** as a way to recognize you as a participant.
					\nYou can remove your participation and delete your data related to **this** giveaway by removing your reaction from this message.`,
					},
				],
				footer: { text: "NOTE: Adding multiple reactions will NOT increase your chances at winning." },
			};
			const body: DiscordMessageProps = { embeds: [ embed ] };
			const sentMessage = await channel.send(body);
			await GiveawayService.updateById(giveaway.id, sentMessage.id);
			await sentMessage.react(giveawayEmoji);
			return res.status(200).json({ message: "Successfully sent giveaway from bot service", statusCode: 200 });
		}
		else next();
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && "message" in error) {
			console.error(error.message);
		} else {
			console.error(error);
		}
		next();
	}
});
app.post("/send-winner-dm/:discordId", async (req, res, next) => {
	try {
		const { body } = req;
		const discordId = req.params.discordId;

		const discordUser = await client.users.fetch(discordId, { force: true });
		if (!discordId || !discordUser) throw new Error("Unable to find Discord User with provided id");

		const dmChannel = await discordUser.createDM(true);
		if (!dmChannel || !dmChannel.isSendable()) throw new Error("Failed to establish dm channel connection with discord user");

		await dmChannel.send({ embeds: body.embeds });
		return res.json({ status: "success", statusCode: 200, message: "Successfully sent dm to winner" } as ResponseProps);
	} catch (error) {
		console.error(error);
		next();
	}
});
app.get("/get-guild-info", async (req, res) => {
	const data = await client.fetchGuildPreview(guildId);
	return res.status(200).json({ status: "success", message: "Successfully retrieved guild info", data: data } as ResponseProps);
});
app.get("/verify-admin-role/:discordId", async (req, res) => {
	try {
		const discordId = req.params.discordId;
		const guild = await client.guilds.fetch({ guild: guildId, force: true });
		const member = await guild.members.fetch({ user: discordId, force: true });
		const moderatorRole = member.roles.cache.has(adminRoleId);

		return res.status(200).json({ status: "success", statusCode: 200, data: { isAdmin: moderatorRole } });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ status: "error", statusCode: 500, message: "An error has occurred while trying to verify admin role" });
	}
});
app.get("/validate-guild-membership/:discordId", async (req, res) => {
	try {
		const discordId = req.params.discordId;
		const guild = await client.guilds.fetch(guildId);
		const membersList = await guild.members.fetch();
		const isMember = membersList?.some(user => user.id === discordId);
		if (!isMember)
			return res
				.status(404)
				.json({ status: "fail", statusCode: 404, message: "Discord user could not be found in the guild", errors: { discordMembership: "You are currently not a member of the guild." } } as ResponseProps);
		return res.status(200).json({ status: "success", statusCode: 200, message: "Discord user successfully found in the guild" } as ResponseProps);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ status: "error", statusCode: 500, message: "An internal server error has occurred while checking discord user guild membership" } as ResponseProps);
	}
});
app.listen(process.env.SERVER_PORT || 3001, () => {
	console.info(`Express server listening on ${process.env.SERVER_PORT || 3001}`);
});