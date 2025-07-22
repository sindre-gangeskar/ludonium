import express from "express";
import DiscordBot from "./bot";

const bot = DiscordBot();
const giveawayChannelId = process.env.DISCORD_GIVEAWAY_CHANNEL_ID;
if (!giveawayChannelId) throw new Error("Missing Discord giveaway channel id environment variable");

const app = express();
app.use(express.json());

app.listen(process.env.SERVER_PORT || 3001, () => {
	console.log("Express server listening on 3001");
});
app.post("/create-giveaway", async (req, res) => {
	const channel = await bot.channels.fetch(giveawayChannelId);
	if (channel && channel.isTextBased() && channel.isSendable()) {
		await channel.send(req.body);
		const createdAt = Date.now();
		const duration = 1000 * 60 * 60 * 24 * 2;
		const deadline = createdAt + duration;
		const hasPassed = Date.now() < deadline;

		console.log(hasPassed);
		return res.json({ message: "Successfully sent giveaway from bot service", statusCode: 200 });
	}
});
