import express from "express";
import DiscordBot from "./bot";
import { DiscordEmbedProps, DiscordMessageProps, ResponseProps } from "./lib/definitions";
import { capitalizeString, getColorFromHexToInt, getGiveawayDurationInLocaleString } from "./lib/utils";
import GiveawayService from "./lib/services/GiveawayService";

const bot = DiscordBot();
const giveawayChannelId = process.env.DISCORD_GIVEAWAY_CHANNEL_ID?.toString().trim();
const guildId = process.env.DISCORD_GUILD_ID?.toString().trim();

if (!giveawayChannelId) throw new Error("Missing Discord giveaway channel id environment variable");
if (!guildId) throw new Error("Missing Discord guild id environment variable");

const app = express();

app.use(express.json());

app.post("/create-giveaway", async (req, res, next) => {
	try {
		const channel = await bot.channels.fetch(giveawayChannelId);
		const preview = await bot.fetchGuildPreview(guildId);

		const { donation, giveaway } = req.body;
		const dateString = getGiveawayDurationInLocaleString(giveaway.deadline);

		if (channel && channel.isTextBased() && channel.isSendable()) {
			const embed: DiscordEmbedProps = {
				color: getColorFromHexToInt("#fdf690"),
				thumbnail: { url: preview.iconURL() ?? "" },
				title: "Community Game Key Giveaway",
				description: "A game key giveaway has started for a donated game!\nMake sure to react to this message to participate in the giveaway!",
				fields: [
					{ name: "Platform", value: capitalizeString(donation.platform.name) },
					{ name: "Region", value: donation.region.name.toUpperCase() },
					{ name: "Giveaway Ends", value: dateString },
					{
						name: "Privacy Notice",
						value: `By reacting to this giveaway, you consent to the registration of you as a participant by storing your **Discord ID** as a way to recognize you as a participant.
					\nYou can remove your participation and delete your data related to **this** giveaway by removing your reaction from this message.`,
					},
				],
				footer: {text: 'NOTE: Adding multiple reactions will NOT increase your chances at winning.'}
			};
			const body: DiscordMessageProps = { embeds: [embed] };
			const message = await channel.send(body);
			await GiveawayService.updateById(giveaway.id, message.id);
			return res.json({ message: "Successfully sent giveaway from bot service", statusCode: 200 });
		}
	} catch (error) {
		if (error && typeof error === "object" && "code" in error) {
			console.warn("The bot is missing the required permissions to send a message in the channel. Ensure it has the rights to send messages.");
		} else {
			console.error(error);
		}
		next();
	}
});
app.get("/get-guild-info", async (req, res) => {
	const data = await bot.fetchGuildPreview(guildId);
	return res.status(200).json({ status: "success", message: "Successfully retrieved guild info", data: data } as ResponseProps);
});
app.get("/discord-test", async (req, res) => {
	const channel = await bot.channels.fetch(giveawayChannelId);
	if (channel && channel.isTextBased() && channel.isSendable()) channel.send({ content: "Testing a ping message" });

	return res.status(200).json({ status: "success", statusCode: 200, message: "Successfully sent test message" } as ResponseProps);
});
app.listen(process.env.SERVER_PORT || 3001, () => {
	console.log("Express server listening on 3001");
});
