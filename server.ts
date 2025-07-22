import express from "express";
import DiscordBot from "./bot";
import { DiscordEmbedProps, DiscordMessageProps, ResponseProps } from "./lib/definitions";

const bot = DiscordBot();
const giveawayChannelId = process.env.DISCORD_GIVEAWAY_CHANNEL_ID?.toString().trim();
const guildId = process.env.DISCORD_GUILD_ID?.toString().trim();

if (!giveawayChannelId) throw new Error("Missing Discord giveaway channel id environment variable");
if (!guildId) throw new Error("Missing Discord guild id environment variable");

const app = express();

app.use(express.json());

app.post("/create-giveaway", async (req, res) => {
	const channel = await bot.channels.fetch(giveawayChannelId);
	const preview = await bot.fetchGuildPreview(guildId);
	const { donation, giveaway } = req.body;

	if (channel && channel.isTextBased() && channel.isSendable()) {
		const embed: DiscordEmbedProps = {
			thumbnail: { url: preview.iconURL() ?? "" },
			title: "Giveaway Started",
			description: "A giveaway has been started.\nMake sure to react to this message to participate!",
			fields: [
				{ name: "Giveaway ID", value: giveaway.id, inline: true },
				{ name: "Platform", value: donation.platform.name, inline: true },
				{ name: "Region", value: donation.region.name, inline: true },
			],
		};
		const body: DiscordMessageProps = { embeds: [embed] };
		await channel.send(body);
		return res.json({ message: "Successfully sent giveaway from bot service", statusCode: 200 });
	}
});
app.get("/get-guild-info", async (req, res) => {
	const data = await bot.fetchGuildPreview(guildId);
	return res.status(200).json({ status: "success", message: 'Successfully retrieved guild info', data: data } as ResponseProps);
});
app.get("/discord-test", async (req, res) => {
	const channel = await bot.channels.fetch(giveawayChannelId);
	if (channel && channel.isTextBased() && channel.isSendable())
		channel.send({ content: 'Testing a ping message' });

	return res.status(200).json({status: "success", statusCode: 200, message: 'Successfully sent test message'} as ResponseProps)
});
app.listen(process.env.SERVER_PORT || 3001, () => {
	console.log("Express server listening on 3001");
});
