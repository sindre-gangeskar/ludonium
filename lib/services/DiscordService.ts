import { DiscordMessageProps, DiscordEmbedProps, ResponseProps, DiscordAPIRequest } from "../definitions";

const discordApiUrl = process.env.DISCORD_API_URL;
const guildId = process.env.DISCORD_GUILD_ID;
const token = process.env.DISCORD_BOT_TOKEN;
const giveawayChannelId = process.env.DISCORD_GIVEAWAY_CHANNEL_ID;
const discordId = process.env.DISCORD_USER_ID;
const discordServerURL = process.env.DISCORD_SERVER_URL;

if (!token) throw new Error("Missing Discord Bot Token in environment variables");
if (!giveawayChannelId) throw new Error("Missing Giveaway Channel ID in environment variables");
if (!discordApiUrl) throw new Error("Missing Discord API URL in environment variables");
if (!guildId) throw new Error("Missing Guild ID in enironment variables");

export default class DiscordService {
	static async test() {
		try {
			const bodyEmbed: DiscordEmbedProps = { title: "Test Giveaway Title", description: `Test Giveaway Description`, color: getColorFromHexToInt("#ffff92") };
			const body: DiscordMessageProps = { embeds: [bodyEmbed] };

			await fetch(`${discordServerURL}/create-giveaway`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});
			return { status: "success", statusCode: 200, message: "Successfully sent Discord Message" } as ResponseProps;
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while sending embedded Discord message" } } as ResponseProps;
		}
	}
	static async sendChannelMessage(body: DiscordMessageProps) {
		try {
			await fetchToDiscordAPI({ intent: "channel", channelId: giveawayChannelId ?? "", body: body });
			return { status: "success", statusCode: 200, message: "Successfuly sent channel message" } as ResponseProps;
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, message: "An internal server error has occurred while sending channel message" } as ResponseProps;
		}
	}
	static async sendDirectMessage(body: DiscordMessageProps) {
		try {
			const createDmReq: DiscordAPIRequest = { intent: "create-dm-channel", recipient_id: discordId ?? "" };
			const createDmResponse = await fetchToDiscordAPI(createDmReq);

			if (createDmResponse && createDmResponse.ok) {
				const data = await createDmResponse.json();
				const messageReq: DiscordAPIRequest = { intent: "channel", channelId: data.id, body: body };
				await fetchToDiscordAPI(messageReq);
				return { status: "success", statusCode: 200, message: "Successfully sent direct message to user" } as ResponseProps;
			} else throw new Error("Failed to send direct message");
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while sending direct message" } } as ResponseProps;
		}
	}
	static async getGuildData() {
		try {
			const req: DiscordAPIRequest = { intent: "guild", guildId: guildId ?? "" };
			const response = await fetchToDiscordAPI(req);
			return await response.json();
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while fetching guild data" } } as ResponseProps;
		}
	}
}
async function fetchToDiscordAPI(req: DiscordAPIRequest) {
	let response;
	switch (req.intent) {
		case "channel": {
			response = await fetch(`${discordApiUrl}/channels/${req.channelId}/messages`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bot ${token}` },
				body: JSON.stringify(req.body),
			});
			break;
		}
		case "guild": {
			response = await fetch(`${discordApiUrl}/guilds/${guildId}`, { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bot ${token}` } });
			break;
		}
		case "create-dm-channel": {
			response = await fetch(`${discordApiUrl}/users/@me/channels`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bot ${token}` },
				body: JSON.stringify({ recipient_id: req.recipient_id }),
			});
			break;
		}
	}
	if (!response || !response.ok) throw new Error("Failed to fetch to Discord API");
	return response;
}
function getColorFromHexToInt(hex: string) {
	return parseInt(hex.replace("#", ""), 16);
}
